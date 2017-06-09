const assert = require('assert');

const p = require('../patterns');


assert(p.isCyrillic('ц'));
assert(p.isCyrillic('Ц'));
assert(p.isCyrillic('цЦ'));
assert(p.isCyrillic('Ёлочка'));
assert(!p.isCyrillic('1'));
assert(!p.isCyrillic('цЦ1'));
assert(!p.isCyrillic('цЦq'));

assert(p.isLatin('q'));
assert(p.isLatin('Q'));
assert(p.isLatin('qQ'));
assert(!p.isLatin('1'));
assert(!p.isLatin('qQ1'));
assert(!p.isLatin('qQц'));

assert(p.isFamily('Петровъ'));
assert(p.isFamily('Watson'));
assert(p.isFamily('Ы'));
assert(!p.isFamily('петров'));
assert(!p.isFamily('watson'));
assert(!p.isFamily('watson'));
assert(!p.isFamily('1ы'));
assert(!p.isFamily('Ы1'));
assert(!p.isFamily('Пw'));
assert(!p.isFamily('ЫЫы'));

assert(p.isInitials('Ё.Ы.'));
assert(p.isInitials('W.W.'));
assert(!p.isInitials('Ё.ы.'));
assert(!p.isInitials('W.w.'));
assert(!p.isInitials('Ё.W.'));
assert(!p.isInitials('Ё.1.'));
assert(!p.isInitials('Ё.ОО.'));
assert(!p.isInitials('Ё.Ы'));
