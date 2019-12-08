const Tape = require('../Tape');

class TM {
  constructor(parser) {
    this.alphabet = parser.alphabet;
    this.blankSymbol = parser.blankSymbol;
    this.startState = parser.startState;
    this.states = parser.states;
    this.acceptStates = parser.acceptStates;
    this.Tape = new Tape(this.blankSymbol);
    console.log('this.Tape::', this.Tape);
    if (
      !(
        this.alphabet &&
        this.blankSymbol &&
        this.startState &&
        this.states &&
        this.acceptStates
      )
    ) {
      throw new Error('Parser failed to extract required NFA attributes.');
    }
  }

  handleTransitions(symbol, state) {
    console.log('handleTransitions()', state, symbol);
  }

  isAccepted(state) {
    console.log('isAccepted():', state);
    return this.acceptStates.includes(state);
  }
  accept(word, state = this.startState) {
    console.log('accept()', word, state);
  }
}

module.exports = TM;
