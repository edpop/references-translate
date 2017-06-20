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
	new Replacement(/ (?:С|P)\. /, ' pp. '),
	new Replacement(/№ (\d+)\./, 'no. $1,'),
	new Replacement(/ (?:Т|Vol)\. (\d+)/, ' vol. $1'),
	new Replacement(/ (\d\d\d\d)\./, ' $1,'),
	new Replacement(/\. (\d\d\d\d)/, ', $1'),
	new Replacement(/ \d+ [с|p]\./, ''),
	new Replacement(/ \/\/ /, ', '),
	new Replacement(/,$/, '.')
];
