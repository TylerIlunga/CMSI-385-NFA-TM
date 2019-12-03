class Parser {
  constructor(rl) {
    this.readline = rl;
    this.startState = null;
    this.acceptStates = null;
    this.states = null;
    this.alphabet = null;
    this.lamdba = 'λ';
    this.parseInput(this.readline);
  }

  handleInvalidFormat() {
    throw new Error('Invalid Format for input provided.');
  }

  handleUnknownState() {
    throw new Error('Unknown State was provided in input.');
  }

  completedParsing() {
    return this.startState && this.acceptStates && this.states && this.alphabet;
  }

  parseInput() {
    this.readline.question(
      'Enter State & Accept States using the following format:\n(START=q0;ACCEPT=q2,q1)\n',
      answer => {
        const splitAnswer = answer.split(';');
        if (splitAnswer.length != 2) {
          return this.handleInvalidFormat();
        }

        const startStateSplit = splitAnswer[0].split('=');
        const acceptStatesSplit = splitAnswer[1].split('=');
        if (!(startStateSplit.length === 2 && acceptStatesSplit.length === 2)) {
          this.handleInvalidFormat();
        }

        this.states = {};
        this.startState = startStateSplit[1];
        this.states[this.startState] = {};
        this.acceptStates = acceptStatesSplit[1].split(',').map(state => {
          this.states[state] = {};
          return state;
        });

        console.log('this.startState', this.startState);
        console.log('this.acceptStates', this.acceptStates);
        console.log('this.states', this.states);
        this.readline.setPrompt(
          'Enter each transition for the NFA using the following format:\n(q0:{symbol}->q1)\nType "begin" when you are finished.\n',
        );
        this.readline.prompt();
        this.readline.on('line', answer1 => {
          if (answer1.toLowerCase() === 'begin') {
            return this.readline.emit('close');
          }

          const transitionSplit = answer1.split('->');
          //   console.log('transitionSplit:', transitionSplit);
          if (transitionSplit.length != 2) {
            return this.handleInvalidFormat();
          }

          const symbolSplit = transitionSplit[0].split(':');
          //   console.log('symbolSplit::', symbolSplit);
          if (symbolSplit.length > 2) {
            return this.handleInvalidFormat();
          }

          this.alphabet = !this.alphabet ? new Set() : this.alphabet;
          const previousState = symbolSplit[0];
          const nextState = transitionSplit[1];
          //   console.log('previousState', previousState);
          //   console.log('nextState', nextState);
          if (
            !(
              this.states[previousState] &&
              this.acceptStates.includes(nextState)
            )
          ) {
            return this.handleUnknownState();
          }

          if (symbolSplit.length === 2) {
            const transitionSymbol = symbolSplit[1];
            const transitionOptions = this.states[previousState][
              transitionSymbol
            ];
            if (transitionOptions === undefined || transitionOptions === null) {
              this.states[previousState][transitionSymbol] = new Set();
            }
            this.alphabet.add(transitionSymbol);
            this.states[previousState][transitionSymbol].add(nextState);
          } else {
            const transitionOptions = this.states[previousState][this.lamdba];
            if (transitionOptions === undefined || transitionOptions === null) {
              this.states[previousState][this.lamdba] = new Set();
            }
            this.states[previousState][this.lamdba].add(nextState);
            this.alphabet.add(this.lamdba);
          }
          console.log('this.alphabet', this.alphabet);
          console.log('this.states', this.states);
        });
      },
    );
  }
}

module.exports = Parser;
