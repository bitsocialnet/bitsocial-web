import fetch from "node-fetch";
import Debug from "debug";
import monitorState from "./monitor-state.js";

const debug = Debug("bitsocial-stats-monitor:telegram-alerts");

const botToken = process.env.BITSOCIAL_STATS_TELEGRAM_BOT_TOKEN?.trim();
const chatId = process.env.BITSOCIAL_STATS_TELEGRAM_CHAT_ID?.trim();
const alertName = process.env.BITSOCIAL_STATS_ALERT_NAME?.trim() || "Bitsocial Stats";

const isTelegramConfigured = Boolean(botToken && chatId);

const escapeHtml = (value) =>
  String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

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
  });

  const body = await response.text();
  if (!response.ok) {
    throw Error(`Telegram sendMessage failed: HTTP ${response.status} ${body.slice(0, 300)}`);
  }

  return true;
};

export const notifyProbeTransition = async ({ id, label, ok, summary, details }) => {
  if (!monitorState.alerts) {
    monitorState.alerts = {};
  }

  const previousState = monitorState.alerts[id]?.state;
  const nextState = ok ? "up" : "down";
  monitorState.alerts[id] = {
    ...monitorState.alerts[id],
    state: nextState,
    updatedAt: new Date().toISOString(),
  };

  if (previousState === nextState) {
    return;
  }

  if (previousState === undefined && ok) {
    return;
  }

  const title = ok ? "RECOVERED" : "DOWN";
  const message = [
    `<b>${escapeHtml(alertName)} ${title}</b>`,
    `<b>${escapeHtml(label)}</b>`,
    escapeHtml(summary),
    details ? `<pre>${escapeHtml(details)}</pre>` : "",
  ]
    .filter(Boolean)
    .join("\n");

  try {
    const sent = await sendTelegramMessage(message);
    monitorState.alerts[id] = {
      ...monitorState.alerts[id],
      lastNotifiedAt: sent ? new Date().toISOString() : monitorState.alerts[id]?.lastNotifiedAt,
      lastNotificationStatus: sent ? "sent" : "disabled",
    };
  } catch (error) {
    monitorState.alerts[id] = {
      ...monitorState.alerts[id],
      lastNotificationStatus: "failed",
      lastNotificationError: error.message,
    };
    debug(error.message);
  }
};
