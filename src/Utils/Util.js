Number.prototype.toHumanize = function (options) {
    options = options || {};
    let d = options.delimiter || ',';
    let s = options.separator || '.';
    let n = this.toString().split('.');
    n[0] = n[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1' + d);
    return n.join(s);
};