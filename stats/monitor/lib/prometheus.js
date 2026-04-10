const prefix = "bitsocial_stats_";

import promClient from "prom-client";

const up = new promClient.Gauge({
  name: `${prefix}up`,
  help: "1 = up, 0 = not up",
  registers: [promClient.register],
});
up.set(1);

const jsonMetrics = async () => {
  const collectValue = (obj, line) => {
    const match = line.match(/^(([^\s]+)({[^\s]*})|([^\s]+)) ((.*) (.*)|(.*))$/i);
    if (!match || !match.length) return;
    let value;
    if (match[6] && match[7])
      value = { value: parseFloat(match[6]), timestamp: parseFloat(match[7]) };
    else value = { value: parseFloat(match[5]) };
    if (match[3]) value.labels = JSON.parse(match[3].replace(/([^{}=,]+)[,]?=/g, '"$1":'));
    obj.values.push(value);
  };
  const collectHelp = (obj, line) => {
    const match = line.match(/^# HELP ([^\s]+) (.*)$/);
    if (!match || !match.length) return false;
    obj.name = match[1];
    obj.help = match[2];
    return true;
  };
  const collectType = (obj, line) => {
    const match = line.match(/^# TYPE ([^\s]+) (.*)$/);
    if (!match || !match.length) return false;
    obj.type = match[2];
    return true;
  };
  const toJson = (text) => {
    const json = [];
    let current;
    text
      .replace("\r\n", "\n")
      .split("\n")
      .forEach((line) => {
        if (!line.trim() && current) {
          json.push(current);
          current = null;
          return;
        }
        if (!current) current = { values: [] };
        if (!current.name && collectHelp(current, line)) return;
        if (!current.type && collectType(current, line)) return;
        if (!current.name || !current.type) return;
        collectValue(current, line);
      });
    return json;
  };
  const metrics = await prometheus.promClient.register.metrics();
  return toJson(metrics);
};

const prometheus = { promClient, prefix, jsonMetrics };
export default prometheus;

export { promClient, prefix, jsonMetrics };
