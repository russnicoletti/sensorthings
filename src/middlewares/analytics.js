import Metrics from 'cd-metrics';

let metrics = null;
let enableMetrics = false;
let requests = 0;
let startTime = null;
const INTERVAL = 60 * 60 * 24 * 1000;

exports.analyticsRouter = (req, res, next) => {
  if (enableMetrics && !metrics) {
    const options = {
      appName: 'SensorWeb Server',
      appVersion: 'beta'
    };

    metrics = new Metrics(req.clientId, options);

    startTime = Date.now();
    setInterval(() => {
      const secs = (Date.now() - startTime) / 1000;
      const reqsPerSec = requests / secs;

      // `recordEvent`: event category, event action, event label, value
      metrics.recordFloatingPointEventAsync(
        'SensorThings API', 'API requests', 'reqs per second',
        reqsPerSec.toFixed(2));
      requests = 0;
      startTime = Date.now();
    }, INTERVAL);
  }
  requests++;
  next();
}

exports.initAnalytics = (enable) => {
  enableMetrics = enable && enable !== 'false';
};
