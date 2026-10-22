import type {
  IPrimitivePaneRenderer,
  IPrimitivePaneView,
  ISeriesPrimitive,
  SeriesAttachedParameter,
  Time,
  UTCTimestamp,
} from "lightweight-charts";

type RenderTarget = Parameters<IPrimitivePaneRenderer["draw"]>[0];

/**
 * An era starts on its first candle's day and runs until the next era starts. The label is drawn as
 * given, so callers uppercase it for their locale.
 */
export type EraBand = { startDay: number; label: string };

/** A moment inside an era worth marking, such as a rename, drawn as a dashed line. */
export type EraDivider = { day: number; label: string };

export type EraBandColors = { line: string; label: string };

const LABEL_FONT_PX = 10.5;
const LABEL_INSET_PX = 12;
const LABEL_TOP_PX = 14;
const DIVIDER_LABEL_TOP_PX = 32;

/**
 * Draws each contract's era behind the price: a hairline where one contract hands over to the
 * next, and the era's name in its top corner when it fits. Edges sit between two bars, so each day
 * falls wholly inside one band. Dividers get a dashed line and a label on the row below the era
 * names, on whichever side has room.
 */
export class EraBands implements ISeriesPrimitive<Time> {
  private bands: EraBand[] = [];
  private dividers: EraDivider[] = [];
  private colors: EraBandColors = { line: "transparent", label: "transparent" };
  private params: SeriesAttachedParameter<Time> | null = null;
  private readonly view: IPrimitivePaneView = {
    zOrder: () => "bottom",
    renderer: () => this.renderer,
  };
  private readonly renderer: IPrimitivePaneRenderer = {
    draw: (target) => this.draw(target),
  };

  attached(params: SeriesAttachedParameter<Time>) {
    this.params = params;
  }

  detached() {
    this.params = null;
  }

  paneViews() {
    return [this.view];
  }

  update(bands: EraBand[], dividers: EraDivider[], colors: EraBandColors) {
    this.bands = bands;
    this.dividers = dividers;
    this.colors = colors;
    this.params?.requestUpdate();
  }

  private edge(startDay: number) {
    const timeScale = this.params?.chart.timeScale();
    const first = timeScale?.timeToCoordinate(startDay as UTCTimestamp);
    const previous = timeScale?.timeToCoordinate((startDay - 86_400) as UTCTimestamp);
    if (first == null) {
      return null;
    }
    return previous == null ? first : (first + previous) / 2;
  }

  private draw(target: RenderTarget) {
    if (!this.params) {
      return;
    }
    const edges = this.bands.map((band) => this.edge(band.startDay));

    target.useBitmapCoordinateSpace(
      ({ context, bitmapSize, horizontalPixelRatio, verticalPixelRatio }) => {
        const width = bitmapSize.width;
        const height = bitmapSize.height;
        context.font = `600 ${Math.round(LABEL_FONT_PX * verticalPixelRatio)}px Exo, sans-serif`;
        if ("letterSpacing" in context) {
          context.letterSpacing = `${(0.14 * LABEL_FONT_PX * horizontalPixelRatio).toFixed(1)}px`;
        }
        context.textBaseline = "top";

        this.bands.forEach((band, index) => {
          const start = edges[index];
          const end = edges[index + 1];
          const left = index === 0 || start == null ? 0 : Math.round(start * horizontalPixelRatio);
          const right =
            end == null || index === this.bands.length - 1
              ? width
              : Math.round(end * horizontalPixelRatio);
          if (right <= 0 || left >= width || right <= left) {
            return;
          }

          if (index > 0 && left > 0) {
            context.fillStyle = this.colors.line;
            context.fillRect(left, 0, Math.max(1, Math.floor(horizontalPixelRatio)), height);
          }

          const visibleLeft = Math.max(left, 0);
          const inset = LABEL_INSET_PX * horizontalPixelRatio;
          const labelWidth = context.measureText(band.label).width;
          if (Math.min(right, width) - visibleLeft >= labelWidth + inset * 2) {
            context.fillStyle = this.colors.label;
            context.fillText(band.label, visibleLeft + inset, LABEL_TOP_PX * verticalPixelRatio);
          }
        });

        const lineWidth = Math.max(1, Math.floor(horizontalPixelRatio));
        for (const divider of this.dividers) {
          const edge = this.edge(divider.day);
          if (edge == null) {
            continue;
          }
          const x = Math.round(edge * horizontalPixelRatio);
          if (x <= 0 || x >= width) {
            continue;
          }
          context.fillStyle = this.colors.line;
          const dash = 4 * verticalPixelRatio;
          for (let y = 0; y < height; y += dash * 2) {
            context.fillRect(x, y, lineWidth, dash);
          }

          const inset = 6 * horizontalPixelRatio;
          const labelWidth = context.measureText(divider.label).width;
          const labelX =
            x + inset + labelWidth <= width
              ? x + inset
              : x - inset - labelWidth >= 0
                ? x - inset - labelWidth
                : null;
          if (labelX !== null) {
            context.fillStyle = this.colors.label;
            context.fillText(divider.label, labelX, DIVIDER_LABEL_TOP_PX * verticalPixelRatio);
          }
        }
      },
    );
  }
}
