const patterns = require('./patterns');

const cyrillic2latin = {
	а: 'a', б: 'b', в: 'v', г: 'g',
	д: 'd', е: 'e', ё: 'e', ж: 'zh',
	з: 'z', и: 'i', й: 'i', к: 'k',
	л: 'l', м: 'm', н: 'n', о: 'o',
	п: 'p', р: 'r', с: 's', т: 't',
	у: 'u', ф: 'f', х: 'h', ц: 'ts',
	ч: 'ch', ш: 'sh', щ: 'sh', ъ: '',
	ы: 'i', ь: '', э: 'e', ю: 'u', я: 'ya'
};

function transliterate (str) {
	let out = '';
	for (let i = 0; i < str.length; i++) {
		const letter = str[i];
		if (!patterns.isCyrillic(letter)) {
			out += letter;
		} else if (patterns.isUpper(letter)) {
			const letters = cyrillic2latin[letter.toLowerCase()];
			out += letters[0].toUpperCase() + letters.substr(1);
		} else {
			out += cyrillic2latin[letter];
		}
	}
	return out;
}

module.exports = transliterate;
