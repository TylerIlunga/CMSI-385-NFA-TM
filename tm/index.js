const Parser = require('../lib/Parser');
const TM = require('../lib/TM');
const rl = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});
const tmParser = new Parser(rl, 'TM');

rl.on('begin', _ => {
  if (!tmParser.completedParsing()) {
    return console.log('Please follow the instructions above.');
  }
  const machine = new TM(tmParser);
  console.log('TM::', machine);
  rl.question('Please enter a string to evaluate below:\n', word => {
    const invalidSyms = word.split('').find(c => !machine.alphabet.has(c));
    console.log('invalidSyms::', invalidSyms);
    const isAccepted = invalidSyms === undefined ? machine.begin(word) : false;
    console.log(`isAccepted: ${isAccepted}`);
    rl.emit('begin');
  });
});
