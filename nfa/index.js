const Parser = require('../lib/Parser');
const NFA = require('../lib/NFA');
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
  console.log('NFA::', machine);
  rl.question('Please enter a string to evaluate below:\n', word => {
    const invalidSyms = word.split('').find(c => !machine.alphabet.has(c));
    const isAccepted = invalidSyms === undefined ? machine.accept(word) : false;
    console.log(`isAccepted: ${isAccepted}`);
    rl.emit('begin');
  });
});
