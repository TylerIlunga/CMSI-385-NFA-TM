const Tape = require('../Tape');

class TM {
  constructor(parser) {
    this.alphabet = parser.alphabet;
    this.blankSymbol = parser.blankSymbol;
    this.startState = parser.startState;
    this.states = parser.states;
    this.acceptStates = parser.acceptStates;
    this.Tape = new Tape(this.blankSymbol);
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
    if (!(this.states[state] && this.states[state][symbol])) {
      return new Array();
    }
    const nextStates = new Array();
    const transitions = this.states[state][symbol];
    Object.keys(transitions).forEach(state => {
      this.Tape.write(transitions[state].write).move(transitions[state].move);
      nextStates.push(state);
    });
    return nextStates;
  }

  isAccepted(state) {
    return (
      this.Tape.read() === this.blankSymbol && this.acceptStates.includes(state)
    );
  }

  begin(word, state = this.startState) {
    let currentState = state;
    this.Tape.mountInput(word);
    // NOTE: Non-Recursive Languages will not halt
    while (true) {
      const nextStates = this.handleTransitions(
        this.Tape.current.getData(),
        currentState,
      );
      if (nextStates.length === 0) {
        return this.isAccepted(currentState);
      }
      currentState = nextStates.shift();
    }
  }
}

module.exports = TM;
