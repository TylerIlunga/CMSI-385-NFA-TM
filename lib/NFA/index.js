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

  handleTransitions(symbol, state) {
    return this.states[state] && this.states[state][symbol]
      ? this.states[state][symbol]
      : new Set();
  }

  isAccepted(state) {
    return this.acceptStates.includes(state);
  }
  accept(word, state = this.startState) {
    if (word.length === 0) {
      return this.isAccepted(state);
    }
    const nextStates = this.handleTransitions(word.charAt(0), state);
    const evals = [...nextStates].map(state => {
      return this.accept(word.substring(1), state);
    });
    return evals.includes(true);
  }
}

module.exports = NFA;
