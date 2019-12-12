const fs = require('fs');
const Parser = require('../lib/Parser');
const NFA = require('../lib/NFA');
const rl = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});
const nfaParser = new Parser(rl, 'NFA');

const persistResult = (word, isAccepted) => {
  const filePath =
    process.env.RESULTS_PATH || __dirname + '/../descs/nfa/results.txt';
  const result = `${word}: ${isAccepted}\n\n`;
  fs.open(filePath, 'w', async (err, fd) => {
    if (err) {
      return fs.writeFile(filePath, result, err => {
        fs.close(fd, () => {
          console.log(err ? err : 'Results written to: ', filePath);
        });
      });
    }
    fs.appendFile(filePath, result, 'utf8', () => {
      fs.close(fd, () => {
        console.log('Results written to: ', filePath);
      });
    });
  });
};

rl.on('begin', _ => {
  if (!nfaParser.completedParsing()) {
    return console.log('Please follow the instructions above.');
  }
  const machine = new NFA(nfaParser);
  rl.question('Please enter a string to evaluate below:\n', async word => {
    console.log('input string:', word);
    const invalidSyms = word.split('').find(c => !machine.alphabet.has(c));
    const isAccepted = invalidSyms === undefined ? machine.accept(word) : false;
    persistResult(word, isAccepted);
    rl.emit('begin');
  });
});
