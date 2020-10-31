const URI = "http://185.148.242.75:3061/";
const path = require("path");
const axios = require("axios")
class ChartManager{

    constructor(path = "chart"){
        this.Path = path;
    }

    async getImageFromData(body){
        let uri = URI + this.Path;
        console.log("test")
        doRequest(uri, body);
        console.log("test");
    }

}
/**
 * 
 * @param {*} url 
 * @param {*} body 
 * @returns {Promise<Request>}
 */
function doRequest(url, data) {
    request(url, {
        body: JSON.stringify({
            config: data
        }),
        method: "GET"
    }, function (error, res, body) {
        if (!error && res.statusCode == 200) {
            console.log("1")
        } else {
            console.log("2")
        }
    });
}  

module.exports = ChartManager;