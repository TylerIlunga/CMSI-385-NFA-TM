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
    console.log('handleTransitions()', state, symbol);
    /* Handles Tape Operations and extracting transitions */
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

  // isAccepted(state) {
  //   console.log('isAccepted():', state);
  //   return this.acceptStates.includes(state);
  // }

  isAccepted(state) {
    console.log('isAccepted():', state, this.Tape.current);
    return (
      this.Tape.read() === this.blankSymbol && this.acceptStates.includes(state)
    );
  }

  accept(word, state = this.startState) {
    console.log('accept()', word, state);
    // if (word.length === 0) {
    //   return this.isAccepted(state);
    // }
    // const nextStates = this.handleTransitions(word.charAt(0), state);
    // console.log('nextStates::', nextStates);
    // const evals = [...nextStates].map(state => {
    //   return this.accept(word.substring(1), state);
    // });
    // console.log('evals::', evals);
    // return evals.includes(true);
  }

  begin(word, state = this.startState) {
    console.log('begin()', word, state);
    let currentState = state;
    this.Tape.mountInput(word);
    console.log('this.Tape::', this.Tape);
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
