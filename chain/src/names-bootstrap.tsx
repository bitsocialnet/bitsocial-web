import "./lib/dev-tools";
import { setDocumentMetaKey } from "./lib/i18n";
import NamesApp from "./names/NamesApp";
import { renderPage } from "./render-page";
import "./rich-list/rich-list.css";
import "./names/names.css";

setDocumentMetaKey("names.meta");
void renderPage(NamesApp, "chain-names");
