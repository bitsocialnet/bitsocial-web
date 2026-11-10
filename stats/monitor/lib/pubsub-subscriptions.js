// One kubo pubsub subscription per topic, retried until kubo accepts it. kubo-rpc-client only calls
// onError when a subscription stream throws: a stream kubo ends cleanly, or a subscribe request that
// fails after the 1s subscribe() waits before resolving, drops the subscription silently. So
// resubscribeDropped() asks kubo which topics it is still subscribed to and subscribes again to the
// ones it lost.
export const createPubsubSubscriptions = ({
  pubsub,
  log = () => {},
  retryDelayMs = 1000 * 5,
  lsTimeoutMs = 1000 * 30,
}) => {
  const subscriptions = new Map();
  let closed = false;

  const subscribe = async (topic) => {
    const subscription = subscriptions.get(topic);
    if (subscription.subscribing) {
      return;
    }
    subscription.subscribing = true;
    try {
      while (!closed) {
        try {
          // drop the previous stream first, so one that is still open can't deliver messages twice
          if (subscription.handler) {
            await pubsub.unsubscribe(topic, subscription.handler);
          }
          // kubo-rpc-client tracks a stream by its handler, so each stream gets its own: an old
          // stream that ends late can't untrack the new one, and only the current one resubscribes
          const handler = (message) => subscription.onMessage(message);
          const onError = (error, fatal, pubsubMessage) => {
            log(`kubo.pubsub.subscribe onError community '${subscription.name}'`, {
              error,
              fatal,
              pubsubMessage,
            });
            if (fatal && !closed && subscription.handler === handler) {
              subscribe(topic);
            }
          };
          subscription.handler = handler;
          await pubsub.subscribe(topic, handler, { onError });
          log(`subscribed to community pubsub '${subscription.name}'`);
          return;
        } catch (e) {
          log(
            `failed subscribe to community pubsub '${subscription.name}': ${e.message}, trying again in ${retryDelayMs / 1000}s...`,
          );
          await new Promise((r) => setTimeout(r, retryDelayMs));
        }
      }
    } finally {
      subscription.subscribing = false;
    }
  };

  const has = (topic) => subscriptions.has(topic);

  const add = (topic, onMessage, name = topic) => {
    if (subscriptions.has(topic)) {
      return false;
    }
    subscriptions.set(topic, { name, onMessage, handler: undefined, subscribing: false });
    subscribe(topic);
    return true;
  };

  // topics whose subscribe loop is still running are left to it
  const resubscribeDropped = async () => {
    const topics = [...subscriptions.keys()].filter(
      (topic) => !subscriptions.get(topic).subscribing,
    );
    if (!topics.length) {
      return [];
    }
    const subscribedTopics = new Set(await pubsub.ls({ signal: AbortSignal.timeout(lsTimeoutMs) }));
    const droppedTopics = topics.filter((topic) => !subscribedTopics.has(topic));
    for (const topic of droppedTopics) {
      log(`kubo dropped community pubsub '${subscriptions.get(topic).name}', subscribing again`);
      subscribe(topic);
    }
    return droppedTopics;
  };

  const close = async () => {
    closed = true;
    for (const [topic, { handler }] of subscriptions) {
      if (handler) {
        await pubsub.unsubscribe(topic, handler);
      }
    }
  };

  return { has, add, resubscribeDropped, close };
};
