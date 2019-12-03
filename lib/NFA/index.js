class NFA {
  constructor(parser) {
    this.alphabet = parser.alphabet;
    this.startState = parser.startState;
    this.states = parser.states;
    this.acceptStates = parser.acceptStates;
    if (
      !(this.alphabet && this.startState && this.states && this.acceptStates)
    ) {
      throw new Error('Parser failed to extract required NFA attributes.');
    }
  }
  transition(state, symbol) {
    console.log('transition()', state, symbol);
  }
  nextPossibleState(state, symbol) {
    console.log('nextPossibleState()', state, symbol);
  }

  isAccepted(state) {
    console.log('isAccepted()', state);
  }
  accept(string, state = this.startState) {
    console.log('accept()', string, state);
  }
}

module.exports = NFA;
