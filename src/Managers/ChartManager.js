const { ChartJSNodeCanvas } = require('chartjs-node-canvas');

class ChartManager {
    static async ImageFromData(body, w = 600, h = 290) {
        return await ChartManager.fromImage(body, w, h);
    }

    static async fromImage(config, w, h) {
        let crs = new ChartJSNodeCanvas({ width: w, height: h });
        return await crs.renderToBuffer(config);
    }
}

module.exports = ChartManager;