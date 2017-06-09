const cyrillicLower = 'а-яё';
const cyrillicUpper = 'А-ЯЁ';
const latinLower = 'a-z';
const latinUpper = 'A-Z';

const reLower = new RegExp('^['+cyrillicLower+latinLower+']+$');
//const reLower = /^[a-zа-я]+$/;
const reUpper = new RegExp('^['+cyrillicUpper+latinUpper+']+$');
//const reUpper = /^[A-ZА-Я]+$/;
const reCyrillic = new RegExp('^['+cyrillicLower+cyrillicUpper+']+$');
//const reCyrillic = /^[а-яА-Я]+$/;
const reLatin = new RegExp('^['+latinLower+latinUpper+']+$');
//const reLatin = /^[a-zA-Z]+$/;

const isLower = (str) => reLower.test(str);
const isUpper = (str) => reUpper.test(str);
const isCyrillic = (str) => reCyrillic.test(str);
const isLatin = (str) => reLatin.test(str);
const isWord = (str) => isLatin(str) || isCyrillic(str);
const isFamily = (str) => isWord(str) && isUpper(str[0]) && (str.length === 1 || isLower(str.substr(1)));

const dot = '.';
const isInitials = (str) => (
	str.length === 4 &&
	str[1] === dot && str[3] === dot &&
	isWord(str[0]+str[2]) && isUpper(str[0]+str[2])
);


module.exports.isLower = isLower;
module.exports.isUpper = isUpper;
module.exports.isCyrillic = isCyrillic;
module.exports.isLatin = isLatin;
module.exports.isFamily = isFamily;
module.exports.isInitials = isInitials;
