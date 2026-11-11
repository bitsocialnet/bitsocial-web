import fetch from "node-fetch";
import Debug from "debug";
import monitorState from "./monitor-state.js";
import { createProbeTransitionNotifier } from "./probe-alerts.js";

const debug = Debug("bitsocial-stats-monitor:telegram-alerts");

const botToken = process.env.BITSOCIAL_STATS_TELEGRAM_BOT_TOKEN?.trim();
const chatId = process.env.BITSOCIAL_STATS_TELEGRAM_CHAT_ID?.trim();
const alertName = process.env.BITSOCIAL_STATS_ALERT_NAME?.trim() || "Bitsocial Stats";

const isTelegramConfigured = Boolean(botToken && chatId);
// a failed send is retried on the next poll (1min), so a send must settle before then
const sendTimeoutMs = 1000 * 15;

const truncate = (value, maxLength = 3500) => {
  const text = String(value || "");
  if (text.length <= maxLength) {
    return text;
  }
  return `${text.slice(0, maxLength - 3)}...`;
};

const sendTelegramMessage = async (text) => {
  if (!isTelegramConfigured) {
    debug("Telegram alerts disabled because bot token or chat id is missing");
    return false;
  }

  const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chat_id: chatId,
      text: truncate(text),
      parse_mode: "HTML",
      disable_web_page_preview: true,
    }),
    signal: AbortSignal.timeout(sendTimeoutMs),
  });

  const body = await response.text();
  if (!response.ok) {
    throw Error(`Telegram sendMessage failed: HTTP ${response.status} ${body.slice(0, 300)}`);
  }

  return true;
};

export const notifyProbeTransition = createProbeTransitionNotifier({
  getAlerts: () => {
    if (!monitorState.alerts) {
      monitorState.alerts = {};
    }
    return monitorState.alerts;
  },
  sendMessage: sendTelegramMessage,
  alertName,
  log: debug,
});
