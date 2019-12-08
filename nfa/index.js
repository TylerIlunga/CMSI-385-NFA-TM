const Parser = require('../lib/Parser');
const NFA = require('../lib/NFA');
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});
const parser = new Parser(rl);

rl.on('begin', _ => {
  if (!parser.completedParsing()) {
    return console.log('Please follow the instructions above.');
  }
  const machine = new NFA(parser);
  console.log('NFA::', machine);
  rl.question('Please enter a string to evaluate below:\n', word => {
    const isAccepted = word
      .split('')
      .filter(c => machine.alphabet.has(c))
      .includes(false)
      ? false
      : machine.accept(word);
    console.log(`isAccepted: ${isAccepted}`);
    rl.emit('begin');
  });
});
