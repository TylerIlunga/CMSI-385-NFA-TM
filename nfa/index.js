const Parser = require('../lib/Parser');
const NFA = require('../lib/NFA');
const { persistResults } = require('../lib/Util');
const rl = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});
const nfaParser = new Parser(rl, 'NFA');

rl.on('begin', _ => {
  if (!nfaParser.completedParsing()) {
    return console.log('Please follow the instructions above.');
  }
  const machine = new NFA(nfaParser);
  rl.question('Please enter a string to evaluate below:\n', async word => {
    console.log('input string:', word);
    const invalidSyms = word.split('').find(c => !machine.alphabet.has(c));
    const isAccepted = invalidSyms === undefined ? machine.accept(word) : false;
    persistResults(word, isAccepted, __dirname + '/../descs/nfa/results.txt');
    rl.emit('begin');
  });
});
