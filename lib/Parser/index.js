class Parser {
  constructor(rl, type) {
    this.readline = rl;
    this.type = type;
    this.startState = null;
    this.acceptStates = null;
    this.states = null;
    this.alphabet = null;
    this.tapeAlphabet = null;
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
    console.log('parsing nfa description...');
    const statesPrompt = this.handleStatesPrompt();
    this.readline.question(statesPrompt, answer => {
      const splitAnswer = answer.split(';');
      if (splitAnswer.length !== 2) {
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

      this.readline.setPrompt(this.handleTransitionsPrompt());
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
        console.log(transitionSplit);
        if (transitionSplit.length !== 2) {
          return this.handleInvalidFormat();
        }

        const symbolSplit = transitionSplit[0].split(':');
        if (symbolSplit.length > 2) {
          return this.handleInvalidFormat();
        }

        const previousState = symbolSplit[0];
        const transitionSymbol = symbolSplit[1];
        const nextState = transitionSplit[1];
        if (!this.states[previousState]) {
          return this.handleUnknownState();
        }
        if (!this.states[nextState]) {
          this.states[nextState] = {};
        }

        this.alphabet = !this.alphabet ? new Set() : this.alphabet;

        if (symbolSplit.length === 2) {
          const currOpts = this.states[previousState][transitionSymbol];
          if (currOpts === undefined || currOpts === null) {
            this.states[previousState][transitionSymbol] = new Set();
          }
          this.alphabet.add(transitionSymbol);
          this.states[previousState][transitionSymbol].add(nextState);
        } else {
          const currOpts = this.states[previousState][this.lamdba];
          if (currOpts === undefined || currOpts === null) {
            this.states[previousState][this.lamdba] = new Set();
          }
          this.states[previousState][this.lamdba].add(nextState);
          this.alphabet.add(this.lamdba);
        }
      });
    });
  }

  parseTMDescription() {
    console.log('parsing TM description...');
    const statesPrompt = this.handleStatesPrompt();
    this.readline.question(statesPrompt, answer => {
      const splitAnswer = answer.split(';');
      if (splitAnswer.length !== 3) {
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

      this.readline.setPrompt(this.handleTransitionsPrompt());
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
        if (transitionSplit.length !== 2) {
          return this.handleInvalidFormat();
        }

        const [symbolSplit, transitionOpsSplit] = transitionSplit.map(
          (ts, i) => {
            return i === 0 ? ts.split(':') : ts.split(',');
          },
        );
        if (symbolSplit.length !== 2) {
          return this.handleInvalidFormat();
        }
        if (transitionOpsSplit.length !== 3) {
          return this.handleInvalidFormat();
        }

        const previousState = symbolSplit[0];
        const transitionSymbol = symbolSplit[1];
        const writeSymbol = transitionOpsSplit[0];
        const moveDirection = transitionOpsSplit[1];
        const nextState = transitionOpsSplit[2];
        if (!this.states[previousState]) {
          return this.handleUnknownState();
        }
        if (!this.states[nextState]) {
          this.states[nextState] = {};
        }

        this.alphabet = !this.alphabet ? new Set() : this.alphabet;
        this.tapeAlphabet = new Set();
        this.tapeAlphabet.add(writeSymbol);
        this.tapeAlphabet.add(moveDirection);

        const currOpts = this.states[previousState][transitionSymbol];
        if (currOpts === undefined || currOpts === null) {
          this.states[previousState][transitionSymbol] = { [nextState]: null };
        }

        this.alphabet.add(transitionSymbol);
        this.states[previousState][transitionSymbol][nextState] = {
          write: writeSymbol,
          move: moveDirection,
        };
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
