const escapeChars = ['`', '>', '#', '+', '-', '=', '|', '{', '}', '.'];

module.exports.escape = (markdown = '') => markdown.split('').map(c => {
  const i = escapeChars.indexOf(c);
  return i >= 0 ? '\\' + escapeChars[i] : c;
}).join('');

module.exports.unindent = (text = '') =>  text.split('\n').map(s => s.trim()).join('\n');
