import "./lib/dev-tools";
import "./rich-list/bones/registry";
import { setDocumentMetaKey } from "./lib/i18n";
import { renderPage } from "./render-page";
import RichListApp from "./rich-list/RichListApp";
import "./rich-list/rich-list.css";

setDocumentMetaKey("richList.meta");
void renderPage(RichListApp, "chain-rich-list");
