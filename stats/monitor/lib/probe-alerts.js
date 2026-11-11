const escapeHtml = (value) =>
  String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

// sendTelegramMessage cuts text past 3500 characters, which can split a tag or an entity, and
// Telegram rejects that message on every retry. Each field is clipped after escaping instead,
// between entities, within budgets that keep the whole message under that cap.
const escapeHtmlClipped = (value, maxLength) => {
  const escaped = escapeHtml(value);
  if (escaped.length <= maxLength) {
    return escaped;
  }
  let clipped = "";
  for (const char of String(value)) {
    const escapedChar = escapeHtml(char);
    if (clipped.length + escapedChar.length > maxLength - 3) {
      break;
    }
    clipped += escapedChar;
  }
  return `${clipped}...`;
};

// `state` is a probe's last observed state and `notifiedState` the last one the operator was told
// about. notifiedState only moves once the message was sent (or alerts are disabled), so a failed
// send is retried on the next poll instead of being lost.
export const createProbeTransitionNotifier =
  ({ getAlerts, sendMessage, alertName, log = () => {} }) =>
  async ({ id, label, ok, summary, details }) => {
    const alerts = getAlerts();
    const nextState = ok ? "up" : "down";
    // null (it survives monitorState.json) until the operator was told anything; alerts saved
    // before notifiedState existed were notified when their state last changed
    const notifiedState =
      alerts[id] && "notifiedState" in alerts[id]
        ? alerts[id].notifiedState
        : (alerts[id]?.state ?? null);
    alerts[id] = {
      ...alerts[id],
      state: nextState,
      notifiedState,
      updatedAt: new Date().toISOString(),
    };

    if (notifiedState === nextState) {
      return;
    }

    // nothing to report for a probe that was never reported down
    if (notifiedState === null && ok) {
      alerts[id].notifiedState = nextState;
      return;
    }

    const title = ok ? "RECOVERED" : "DOWN";
    const message = [
      `<b>${escapeHtmlClipped(alertName, 100)} ${title}</b>`,
      `<b>${escapeHtmlClipped(label, 200)}</b>`,
      escapeHtmlClipped(summary, 1000),
      details ? `<pre>${escapeHtmlClipped(details, 2000)}</pre>` : "",
    ]
      .filter(Boolean)
      .join("\n");

    try {
      const sent = await sendMessage(message);
      alerts[id] = {
        ...alerts[id],
        notifiedState: nextState,
        lastNotifiedAt: sent ? new Date().toISOString() : alerts[id]?.lastNotifiedAt,
        lastNotificationStatus: sent ? "sent" : "disabled",
      };
    } catch (error) {
      alerts[id] = {
        ...alerts[id],
        lastNotificationStatus: "failed",
        lastNotificationError: error.message,
      };
      log(error.message);
    }
  };
