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
    // console.log('transition()', state, symbol);
    return this.states[state] && this.states[state][symbol]
      ? this.states[state][symbol]
      : new Set();
  }

  isAccepted(state) {
    // console.log('isAccepted():', state);
    return this.acceptStates.includes(state);
  }
  accept(word, state = this.startState) {
    // console.log('accept()', word, state);
    if (word.length === 0) {
      return this.isAccepted(state);
    }
    const nextStates = this.handleTransitions(word.charAt(0), state);
    //  console.log('nextStates:', nextStates);
    const evals = [...nextStates].map(state => {
      return this.accept(word.substring(1), state);
    });
    // console.log('evals::', evals);
    return evals.includes(true);
    // return word.length === 0
    //   ? this.isAccepted(state)
    //   : this.accept(
    //   word.substring(1),
    //   this.transition(state, word.charAt(0)),
    // );
  }
}

module.exports = NFA;
