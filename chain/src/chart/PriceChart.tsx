import {
  type CSSProperties,
  useEffectEvent,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  AreaSeries,
  CandlestickSeries,
  ColorType,
  CrosshairMode,
  HistogramSeries,
  LineStyle,
  PriceScaleMode,
  createChart,
  createSeriesMarkers,
  type IChartApi,
  type ISeriesApi,
  type ISeriesMarkersPluginApi,
  type SeriesMarker,
  type Time,
  type UTCTimestamp,
} from "lightweight-charts";
import { useTranslation } from "react-i18next";
import { DAY_SECONDS, ERAS, REBRAND_DAY, type Candle } from "@/lib/chart/history";
import { HISTORY } from "@/lib/rich-list/data";
import { useTheme } from "@/lib/useTheme";
import { SegmentedControl } from "@/rich-list/primitives";
import { EraBands } from "./era-bands";
import { useChartFormatters } from "./format";
import { chartPalette, withAlpha } from "./palette";

const METRICS = ["price", "mcap"] as const;
type Metric = (typeof METRICS)[number];
const RANGES = ["1M", "3M", "1Y", "all"] as const;
type Range = (typeof RANGES)[number];
const CHART_TYPES = ["line", "candles"] as const;
type ChartType = (typeof CHART_TYPES)[number];
const SCALES = ["log", "linear"] as const;
type Scale = (typeof SCALES)[number];
/** What the time axis shows: a preset range, one contract's era, or wherever the reader panned. */
type View = Range | `era-${number}` | null;

const RANGE_DAYS: Record<Exclude<Range, "all">, number> = { "1M": 30, "3M": 91, "1Y": 365 };

/** A pan or zoom this soon after the reader's own input is theirs, so it clears the preset. */
const INTERACTION_WINDOW_MS = 300;

function dayOf(seconds: number) {
  return Math.floor(seconds / DAY_SECONDS) * DAY_SECONDS;
}

/** Market cap is each day's price times that day's supply; price is the candle as it is. */
function metricFactor(candle: Candle, metric: Metric) {
  return metric === "mcap" ? candle.supply : 1;
}

// Rich list history events with a known day, drawn as markers where the price was at the time.
const EVENTS = HISTORY.filter((event) => (event.precision ?? "day") === "day").map((event) => ({
  id: event.id,
  time: Date.parse(`${event.date}T00:00:00Z`) / 1000,
}));

/**
 * The day each contract's era begins on the chart: its first candle. A migration day goes to
 * whichever contract traded more that day, which can still be the old one.
 */
function eraStartDays(candles: Candle[]) {
  return ERAS.map(
    (era, index) => candles.find((candle) => candle.eraIndex === index)?.time ?? dayOf(era.start),
  );
}

type Handles = {
  chart: IChartApi;
  area: ISeriesApi<"Area">;
  candles: ISeriesApi<"Candlestick">;
  volume: ISeriesApi<"Histogram">;
  areaMarkers: ISeriesMarkersPluginApi<Time>;
  candleMarkers: ISeriesMarkersPluginApi<Time>;
  bands: EraBands;
};

function applyView(handles: Handles, candles: Candle[], view: View) {
  const timeScale = handles.chart.timeScale();
  const last = candles[candles.length - 1]?.time;
  if (view === null || last === undefined) {
    return;
  }
  if (view === "all") {
    timeScale.fitContent();
    return;
  }
  if (view.startsWith("era-")) {
    const index = Number(view.slice(4));
    const starts = eraStartDays(candles);
    const next = starts[index + 1];
    timeScale.setVisibleRange({
      from: starts[index] as UTCTimestamp,
      to: (next === undefined ? last : next - DAY_SECONDS) as UTCTimestamp,
    });
    return;
  }
  const days = RANGE_DAYS[view as Exclude<Range, "all">];
  timeScale.setVisibleRange({
    from: (last - days * DAY_SECONDS) as UTCTimestamp,
    to: last as UTCTimestamp,
  });
}

type LegendNodes = {
  swatch: HTMLSpanElement | null;
  era: HTMLSpanElement | null;
  date: HTMLSpanElement | null;
  price: HTMLSpanElement | null;
  change: HTMLSpanElement | null;
  since: HTMLSpanElement | null;
  ohlc: HTMLSpanElement | null;
  volume: HTMLSpanElement | null;
  event: HTMLSpanElement | null;
};

/**
 * BSO's daily price across all three contracts, on TradingView's Lightweight Charts. The chart
 * itself lives outside React: series, options and the legend are written imperatively so panning
 * and the crosshair never re-render the page.
 */
export default function PriceChart({ candles }: { candles: Candle[] }) {
  const { t } = useTranslation();
  const format = useChartFormatters();
  const { theme } = useTheme();
  const palette = useMemo(() => chartPalette(theme), [theme]);
  const containerRef = useRef<HTMLDivElement>(null);
  const handlesRef = useRef<Handles | null>(null);
  const hoverTimeRef = useRef<number | null>(null);
  const lastInteractionRef = useRef(0);
  const legendRef = useRef<LegendNodes>({
    swatch: null,
    era: null,
    date: null,
    price: null,
    change: null,
    since: null,
    ohlc: null,
    volume: null,
    event: null,
  });
  const [metric, setMetric] = useState<Metric>("price");
  const [view, setView] = useState<View>("all");
  const [chartType, setChartType] = useState<ChartType>("line");
  const [scale, setScale] = useState<Scale>("log");
  const formatValue = metric === "mcap" ? format.marketCap : format.price;

  const candleIndexByTime = useMemo(
    () => new Map(candles.map((candle, index) => [candle.time, index])),
    [candles],
  );
  const eventByTime = useMemo(() => new Map(EVENTS.map((event) => [event.time, event.id])), []);
  const summary = useMemo(() => {
    const closes = candles.map((candle) => candle.close * metricFactor(candle, metric));
    return t(`chart.summary.${metric}`, {
      from: format.day(candles[0].time),
      to: format.day(candles[candles.length - 1].time),
      low: formatValue(Math.min(...closes)),
      high: formatValue(Math.max(...closes)),
      latest: formatValue(closes[closes.length - 1]),
    });
  }, [candles, format, formatValue, metric, t]);

  // The legend shows the hovered day, or the last day in view, against the first day in view.
  const renderLegend = useEffectEvent(() => {
    const handles = handlesRef.current;
    const nodes = legendRef.current;
    if (!handles || candles.length === 0) {
      return;
    }
    const lastIndex = candles.length - 1;
    const range = handles.chart.timeScale().getVisibleLogicalRange();
    const clamp = (value: number) => Math.min(lastIndex, Math.max(0, value));
    // A fitted range starts a hair past bar 0, which still means bar 0.
    const firstVisible = candles[range ? clamp(Math.ceil(range.from - 0.001)) : 0];
    const hoveredIndex =
      hoverTimeRef.current === null ? undefined : candleIndexByTime.get(hoverTimeRef.current);
    const candle = candles[hoveredIndex ?? (range ? clamp(Math.floor(range.to)) : lastIndex)];
    const factor = metricFactor(candle, metric);
    const change =
      (candle.close * factor) / (firstVisible.close * metricFactor(firstVisible, metric)) - 1;
    const eventId = eventByTime.get(candle.time);

    nodes.swatch?.style.setProperty("--ch-swatch", palette.eras[candle.eraIndex]);
    if (nodes.era) nodes.era.textContent = t(`chart.eras.${ERAS[candle.eraIndex].id}`);
    if (nodes.date) nodes.date.textContent = format.day(candle.time);
    if (nodes.price) nodes.price.textContent = formatValue(candle.close * factor);
    if (nodes.change) {
      nodes.change.textContent = format.change(change);
      nodes.change.dataset.direction = change > 0 ? "up" : change < 0 ? "down" : "flat";
    }
    if (nodes.since) {
      nodes.since.textContent = t("chart.legend.since", { date: format.day(firstVisible.time) });
    }
    if (nodes.ohlc) {
      nodes.ohlc.textContent = t("chart.legend.ohlc", {
        open: formatValue(candle.open * factor),
        high: formatValue(candle.high * factor),
        low: formatValue(candle.low * factor),
        close: formatValue(candle.close * factor),
      });
    }
    if (nodes.volume) {
      nodes.volume.textContent = t("chart.legend.volume", {
        value: format.volume(candle.volumeUsd),
      });
    }
    if (nodes.event) {
      nodes.event.textContent = eventId ? t(`richList.history.events.${eventId}.title`) : "";
      nodes.event.hidden = !eventId;
    }
  });

  const onRangeChange = useEffectEvent(() => {
    if (performance.now() - lastInteractionRef.current < INTERACTION_WINDOW_MS) {
      setView(null);
    }
    renderLegend();
  });

  const restoreView = useEffectEvent(() => {
    if (handlesRef.current) {
      applyView(handlesRef.current, candles, view);
    }
  });

  // Create the chart once. It starts as a log-scale line over the whole history, the same as the
  // initial control state.
  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const chart = createChart(container, {
      autoSize: true,
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        fontFamily: "Manrope, sans-serif",
        fontSize: 12,
        attributionLogo: true,
      },
      grid: { vertLines: { visible: false } },
      rightPriceScale: {
        borderVisible: false,
        mode: PriceScaleMode.Logarithmic,
        scaleMargins: { top: 0.16, bottom: 0.2 },
      },
      timeScale: {
        borderVisible: false,
        fixLeftEdge: true,
        fixRightEdge: true,
        minBarSpacing: 0.1,
      },
      crosshair: {
        mode: CrosshairMode.Magnet,
        vertLine: { style: LineStyle.Dashed, width: 1 },
        horzLine: { style: LineStyle.Dashed, width: 1 },
      },
      // Vertical drags scroll the page on touch screens; horizontal drags pan the chart.
      handleScroll: { vertTouchDrag: false },
      kineticScroll: { touch: !reducedMotion, mouse: false },
    });
    const priceFormat = { type: "price" as const, precision: 8, minMove: 0.00000001 };
    const area = chart.addSeries(AreaSeries, {
      lineWidth: 2,
      priceFormat,
      crosshairMarkerRadius: 4,
      priceLineStyle: LineStyle.Dotted,
    });
    const candleSeries = chart.addSeries(CandlestickSeries, {
      visible: false,
      priceFormat,
      borderVisible: false,
      priceLineStyle: LineStyle.Dotted,
    });
    const volume = chart.addSeries(HistogramSeries, {
      priceScaleId: "volume",
      priceFormat: { type: "volume" },
      lastValueVisible: false,
      priceLineVisible: false,
    });
    chart.priceScale("volume").applyOptions({ scaleMargins: { top: 0.84, bottom: 0 } });
    const bands = new EraBands();
    volume.attachPrimitive(bands);

    handlesRef.current = {
      chart,
      area,
      candles: candleSeries,
      volume,
      areaMarkers: createSeriesMarkers(area, []),
      candleMarkers: createSeriesMarkers(candleSeries, []),
      bands,
    };

    chart.subscribeCrosshairMove((param) => {
      hoverTimeRef.current = param.time === undefined ? null : Number(param.time);
      renderLegend();
    });
    chart.timeScale().subscribeVisibleLogicalRangeChange(() => onRangeChange());
    // The plot narrows once the price axis has measured its labels, and with the left edge fixed
    // that cuts the newest days off a preset; re-applying it keeps the preset whole.
    chart.timeScale().subscribeSizeChange(() => restoreView());

    return () => {
      handlesRef.current = null;
      chart.remove();
    };
  }, []);

  // Data, colours and labels change together rarely: on a live refresh, a switch between price and
  // market cap, a theme switch or a new language. Re-applying the current view keeps a preset
  // pinned to the newest day.
  useLayoutEffect(() => {
    const handles = handlesRef.current;
    if (!handles) {
      return;
    }
    const { chart, area, candles: candleSeries, volume, bands } = handles;

    chart.applyOptions({
      layout: { textColor: palette.text },
      grid: { horzLines: { color: palette.grid } },
      crosshair: {
        vertLine: { color: palette.crosshair, labelBackgroundColor: palette.crosshairLabel },
        horzLine: { color: palette.crosshair, labelBackgroundColor: palette.crosshairLabel },
      },
      localization: {
        locale: format.locale,
        // The linear scale's bottom margin reaches below zero, where no price exists.
        priceFormatter: (value: number) => (value < 1e-12 ? "" : formatValue(value)),
        timeFormatter: (time: Time) => format.day(Number(time)),
      },
    });
    area.applyOptions({ crosshairMarkerBorderColor: palette.background });
    candleSeries.applyOptions({
      upColor: palette.up,
      downColor: palette.down,
      wickUpColor: palette.up,
      wickDownColor: palette.down,
    });

    area.setData(
      candles.map((candle) => {
        const color = palette.eras[candle.eraIndex];
        return {
          time: candle.time as UTCTimestamp,
          value: candle.close * metricFactor(candle, metric),
          lineColor: color,
          topColor: withAlpha(color, palette.areaFillAlpha),
          bottomColor: withAlpha(color, 0),
        };
      }),
    );
    candleSeries.setData(
      candles.map((candle) => {
        const factor = metricFactor(candle, metric);
        return {
          time: candle.time as UTCTimestamp,
          open: candle.open * factor,
          high: candle.high * factor,
          low: candle.low * factor,
          close: candle.close * factor,
        };
      }),
    );
    volume.setData(
      candles.map((candle) => ({
        time: candle.time as UTCTimestamp,
        value: candle.volumeUsd,
        color: palette.volume,
      })),
    );

    const first = candles[0]?.time ?? 0;
    const markers: SeriesMarker<Time>[] = EVENTS.filter((event) => event.time >= first).map(
      (event) => ({
        id: event.id,
        time: event.time as UTCTimestamp,
        position: "aboveBar",
        shape: "circle",
        color: palette.marker,
        size: 0.6,
      }),
    );
    handles.areaMarkers.setMarkers(markers);
    handles.candleMarkers.setMarkers(markers);

    const starts = eraStartDays(candles);
    bands.update(
      ERAS.map((era, index) => ({
        startDay: starts[index],
        label: t(`chart.eras.${era.id}`).toLocaleUpperCase(format.locale),
      })),
      [{ day: REBRAND_DAY, label: t("chart.eras.rebrand").toLocaleUpperCase(format.locale) }],
      palette.bands,
    );

    restoreView();
    renderLegend();
  }, [candles, format, formatValue, metric, palette, t]);

  const markInteraction = () => {
    lastInteractionRef.current = performance.now();
  };

  const selectView = (next: View) => {
    setView(next);
    // A preset picked right after a drag must not be cleared by its own range change.
    lastInteractionRef.current = 0;
    if (handlesRef.current) {
      applyView(handlesRef.current, candles, next);
    }
  };

  const selectChartType = (next: ChartType) => {
    setChartType(next);
    handlesRef.current?.area.applyOptions({ visible: next === "line" });
    handlesRef.current?.candles.applyOptions({ visible: next === "candles" });
  };

  const selectScale = (next: Scale) => {
    setScale(next);
    handlesRef.current?.chart.priceScale("right").applyOptions({
      mode: next === "log" ? PriceScaleMode.Logarithmic : PriceScaleMode.Normal,
    });
  };

  const setLegendNode = (key: keyof LegendNodes) => (node: HTMLSpanElement | null) => {
    legendRef.current[key] = node;
  };

  return (
    <section
      className="ch-panel"
      aria-labelledby="ch-panel-title"
      aria-describedby="ch-panel-summary"
      data-chart-type={chartType}
    >
      <h2 id="ch-panel-title" className="sr-only">
        {t("chart.panelTitle")}
      </h2>
      <p id="ch-panel-summary" className="sr-only">
        {summary}
      </p>
      <div className="ch-head">
        <ChartLegend nodeRef={setLegendNode} />

        <div className="ch-toolbar">
          <SegmentedControl
            label={t("chart.controls.metricLabel")}
            options={METRICS}
            value={metric}
            onChange={setMetric}
            optionLabel={(option) => t(`chart.controls.metrics.${option}`)}
          />
          <SegmentedControl
            label={t("chart.controls.rangeLabel")}
            options={RANGES}
            value={view}
            onChange={selectView}
            optionLabel={(option) => t(`chart.controls.ranges.${option}`)}
          />
          <SegmentedControl
            label={t("chart.controls.typeLabel")}
            options={CHART_TYPES}
            value={chartType}
            onChange={selectChartType}
            optionLabel={(option) => t(`chart.controls.types.${option}`)}
          />
          <SegmentedControl
            label={t("chart.controls.scaleLabel")}
            options={SCALES}
            value={scale}
            onChange={selectScale}
            optionLabel={(option) => t(`chart.controls.scales.${option}`)}
          />
        </div>
      </div>

      {/* Capture-phase handlers: the chart's own listeners zoom and pan before a bubbling React
          handler would run, and the range change they cause must already see the reader's input.
          The canvas is not given an image role, because the chart adds a TradingView link inside
          it; the summary above describes it instead. */}
      <div
        ref={containerRef}
        className="ch-canvas"
        dir="ltr"
        onPointerDownCapture={markInteraction}
        onPointerMoveCapture={(event) => {
          if (event.buttons) {
            markInteraction();
          }
        }}
        onWheelCapture={markInteraction}
      />

      <EraButtons view={view} colors={palette.eras} onSelect={selectView} />
    </section>
  );
}

/** Empty slots the chart fills imperatively as the crosshair and the visible range move. */
function ChartLegend({
  nodeRef,
}: {
  nodeRef: (key: keyof LegendNodes) => (node: HTMLSpanElement | null) => void;
}) {
  return (
    <div className="ch-legend">
      <p className="ch-legend-meta">
        <span ref={nodeRef("swatch")} className="ch-swatch" aria-hidden />
        <span ref={nodeRef("era")} className="ch-legend-era" />
        <span ref={nodeRef("date")} className="ch-legend-date" />
      </p>
      <p className="ch-legend-price">
        <span ref={nodeRef("price")} className="ch-price" />
        <span className="ch-legend-change">
          <span ref={nodeRef("change")} className="ch-change" />
          <span ref={nodeRef("since")} className="ch-since" />
        </span>
      </p>
      <p className="ch-legend-detail">
        <span ref={nodeRef("ohlc")} className="ch-ohlc" />
        <span ref={nodeRef("volume")} />
        <span ref={nodeRef("event")} className="ch-event" hidden />
      </p>
    </div>
  );
}

/** The legend of the three contracts, each a button that zooms the chart to its era. */
function EraButtons({
  view,
  colors,
  onSelect,
}: {
  view: View;
  colors: string[];
  onSelect: (view: View) => void;
}) {
  const { t } = useTranslation();
  const format = useChartFormatters();

  return (
    <div className="ch-eras" role="group" aria-label={t("chart.eras.label")}>
      {ERAS.map((era, index) => {
        const next = ERAS[index + 1];
        const eraView = `era-${index}` as const;
        return (
          <button
            key={era.id}
            type="button"
            aria-pressed={view === eraView}
            className="ch-era"
            style={{ "--ch-swatch": colors[index] } as CSSProperties}
            onClick={() => onSelect(eraView)}
          >
            <span className="ch-swatch" aria-hidden />
            <span className="ch-era-name">{t(`chart.eras.${era.id}`)}</span>
            <span className="ch-era-years">
              {t("chart.eras.years", {
                from: format.year(era.start),
                to: next ? format.year(next.start) : t("chart.eras.now"),
              })}
            </span>
          </button>
        );
      })}
    </div>
  );
}
