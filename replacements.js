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
	new Replacement(/№/, 'no.'),
	new Replacement(/ (?:Т|Vol)\./, ' vol.'),
	new Replacement(/\. (\d\d\d\d)/, ', $1'),
	new Replacement(/ \d+ [с|p]\./, ''),
	new Replacement(/ \/\/ /, ', '),
	new Replacement(/(\d+)\./g, '$1,'),
	new Replacement(/,$/, '.')
];
