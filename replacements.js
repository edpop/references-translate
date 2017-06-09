class Replacement {
    /**
     * @param {RegExp} from
     * @param {String} to
     */
    constructor(from, to) {
        this.from = from;
        this.to = to;
    }
}

module.exports = [
    new Replacement(/ С\. /, ' pp. '),
    new Replacement(/№ (\d+)\./, 'no. $1,'),
    new Replacement(/ Т\. (\d+)/, ' vol. $1'),
    new Replacement(/ (\d\d\d\d)\./, ' $1,'),
    new Replacement(/ \/\/ /, ', ')
];
