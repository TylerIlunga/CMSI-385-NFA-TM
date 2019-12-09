const Parser = require('../lib/Parser');
const TM = require('../lib/TM');
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});

const parser = new Parser(rl, 'TM');

rl.on('begin', _ => {
  if (!parser.completedParsing()) {
    return console.log('Please follow the instructions above.');
  }
  const machine = new TM(parser);
  console.log('TM::', machine);
  rl.question('Please enter a string to evaluate below:\n', word => {
    const isAccepted = word
      .split('')
      .filter(c => machine.alphabet.has(c))
      .includes(false)
      ? false
      : machine.begin(word);
    console.log(`isAccepted: ${isAccepted}`);
    rl.emit('begin');
  });
});
