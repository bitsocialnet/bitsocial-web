import "./lib/dev-tools";
import "./chart/bones/registry";
import ChartApp from "./chart/ChartApp";
import { setDocumentMetaKey } from "./lib/i18n";
import { renderPage } from "./render-page";
import "./rich-list/rich-list.css";
import "./chart/chart.css";

setDocumentMetaKey("chart.meta");
void renderPage(ChartApp, "chain-chart");
