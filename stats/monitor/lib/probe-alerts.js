const escapeHtml = (value) =>
  String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

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
      `<b>${escapeHtml(alertName)} ${title}</b>`,
      `<b>${escapeHtml(label)}</b>`,
      escapeHtml(summary),
      details ? `<pre>${escapeHtml(details)}</pre>` : "",
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
