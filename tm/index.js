const Parser = require('../lib/Parser');
const TM = require('../lib/TM');
const { persistResults } = require('../lib/Util');
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
  rl.question('Please enter a string to evaluate below:\n', word => {
    console.log('input string:', word);
    const invalidSyms = word.split('').find(c => !machine.alphabet.has(c));
    const isAccepted = invalidSyms === undefined ? machine.begin(word) : false;
    persistResults(word, isAccepted, __dirname + '/../descs/tm/results.txt');
    rl.emit('begin');
  });
});
