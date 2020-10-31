const URI = "http://localhost:3100/chart";
const Axios = require("axios");

class ChartManager {
    async ImageFromData(body) {
        const response = await Axios.get(URI, {
            data: body,
            responseType: 'arraybuffer'
        });
        return response.data;
    }
}
module.exports = ChartManager;

/**
 *     let m = await cm.ImageFromData({
        width: 600,
        height: 290,
        type: 'line',
        data: {
            labels: [].concat(yData),
            datasets: [{
                label: '# gün istatistiği',
                data: [].concat(xData),
                backgroundColor: [
                    'rgba(0, 132, 189, 0.2)'
                ],
                borderColor: [].concat(zData),
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        callback: (value) => '$' + value
                    }
                }]
            }
        }
    });
    embed.setImage("attachment://Graph.png");
    let attachment = new MessageAttachment(m, "Graph.png");

 */