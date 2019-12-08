class Parser {
  constructor(rl, type) {
    this.readline = rl;
    this.type = type;
    this.startState = null;
    this.acceptStates = null;
    this.states = null;
    this.alphabet = null;
    this.lamdba = 'λ';
    this.blankSymbol = null;
    this.parseInput();
  }

  handleStatesPrompt() {
    let prompt = 'Enter State & Accept States using the following format:\n';
    if (this.type === 'NFA') {
      prompt += '(START=q0;ACCEPT=q2,q1)\n';
    }
    if (this.type === 'TM') {
      prompt += '(START=q0;ACCEPT=q2,q1;BLANK=B)\n';
    }
    return prompt;
  }

  handleTransitionsPrompt() {
    let prompt =
      'Enter each transition for the NFA using the following format:\n';
    if (this.type === 'NFA') {
      prompt += '(q0:{symbol}->q1)\n';
    }
    if (this.type === 'TM') {
      prompt += '(q0:{read}->{write},{move},q1)\n';
    }
    prompt += 'Type "begin" when you are finished.\n';
    return prompt;
  }

  handleInvalidFormat() {
    throw new Error('Invalid Format for input provided.');
  }

  handleUnknownState() {
    throw new Error('Unknown State was provided in input.');
  }

  completedParsing() {
    return (
      this.startState &&
      this.acceptStates &&
      this.states &&
      this.alphabet &&
      this.finished
    );
  }

  parseNFADescription() {
    console.log('parseNFADescription()');
    const statesPrompt = this.handleStatesPrompt();
    this.readline.question(statesPrompt, answer => {
      const splitAnswer = answer.split(';');
      if (splitAnswer.length != 2) {
        return this.handleInvalidFormat();
      }

      const [startStateSplit, acceptStatesSplit] = splitAnswer.map(s =>
        s.split('='),
      );
      if (!(startStateSplit.length === 2 && acceptStatesSplit.length === 2)) {
        return this.handleInvalidFormat();
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
      const transitionPrompt = this.handleTransitionsPrompt();
      this.readline.setPrompt(transitionPrompt);
      this.readline.prompt();
      this.readline.on('line', transition => {
        if (transition.toLowerCase() === 'begin') {
          this.finished = true;
          return this.readline.emit('begin');
        }
        if (this.completedParsing()) {
          return;
        }

        const transitionSplit = transition.split('->');
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
        if (!this.states[previousState]) {
          return this.handleUnknownState();
        }

        if (!this.states[nextState]) {
          this.states[nextState] = {};
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
    });
  }

  parseTMDescription() {
    console.log('parseTMDescription()');
    const statesPrompt = this.handleStatesPrompt();
    this.readline.question(statesPrompt, answer => {
      const splitAnswer = answer.split(';');
      if (splitAnswer.length != 3) {
        return this.handleInvalidFormat();
      }

      const [
        startStateSplit,
        acceptStatesSplit,
        blankSymbolSplit,
      ] = splitAnswer.map(s => s.split('='));

      if (
        !(
          startStateSplit.length === 2 &&
          acceptStatesSplit.length === 2 &&
          blankSymbolSplit.length == 2
        )
      ) {
        return this.handleInvalidFormat();
      }

      this.states = {};
      this.startState = startStateSplit[1];
      this.states[this.startState] = {};
      this.alphabet = new Set();
      this.blankSymbol = blankSymbolSplit[1];
      this.alphabet.add(this.blankSymbol);
      this.acceptStates = acceptStatesSplit[1].split(',').map(state => {
        this.states[state] = {};
        return state;
      });

      console.log('this.alphabet', this.alphabet);
      console.log('this.blankSymbol', this.blankSymbol);
      console.log('this.startState', this.startState);
      console.log('this.acceptStates', this.acceptStates);
      console.log('this.states', this.states);
      const transitionPrompt = this.handleTransitionsPrompt();
      this.readline.setPrompt(transitionPrompt);
      this.readline.prompt();
      this.readline.on('line', transition => {
        if (transition.toLowerCase() === 'begin') {
          this.finished = true;
          return this.readline.emit('begin');
        }
        if (this.completedParsing()) {
          return;
        }
        // TODO: HANDLE PARSING TRANSITION INPUT
      });
    });
  }

  parseInput() {
    switch (this.type) {
      case 'NFA':
        return this.parseNFADescription();
      case 'TM':
        return this.parseTMDescription();
      default:
        throw new Error('Supported Descriptions: [NFA, TM]');
    }
  }
}

module.exports = Parser;
