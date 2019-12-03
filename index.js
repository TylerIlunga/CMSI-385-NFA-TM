const Parser = require('./lib/Parser');
const NFA = require('./lib/NFA');
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});
const parser = new Parser(rl);

rl.on('close', _ => {
  if (parser.completedParsing()) {
    rl.close();
    const machine = new NFA(parser);
    console.log('machine', machine);
  }
});
