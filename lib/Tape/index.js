class Tape {
  constructor(blankSymbol) {
    this.head = null;
    this.tail = null;
    this.current = null;
    this.blankSymbol = blankSymbol;
  }

  handleInvalidInputArgument() {
    throw new Error('Must provide an argument to mount.');
  }

  handlePointerError() {
    throw new Error('Tape does not point to Node.');
  }

  handleMoveError(direction) {
    throw new Error(
      `Invalid Tape Direction: ${direction}\nAvailable Directions: [L, R]`,
    );
  }

  mountInput(word) {
    if (!(word && word.length !== 0)) {
      return this.handleInvalidInputArgument();
    }
    this.head = new Node(word.charAt(0));
    let currentNode = this.head;
    word.split('').forEach((symbol, i) => {
      if (i !== 0) {
        const temp = currentNode;
        currentNode.next = new Node(symbol);
        currentNode = currentNode.next;
        currentNode.prev = temp;
      }
    });
    this.current = this.head;
    this.tail = currentNode;
  }

  read() {
    if (!this.current) {
      return this.handlePointerError();
    }
    return this.current.getData();
  }

  write(symbol) {
    if (!this.current) {
      return this.handlePointerError();
    }
    this.current.updateData(symbol);
    return this;
  }

  moveLeft() {
    if (!this.current) {
      return this.handlePointerError();
    }
    if (!this.current.prev) {
      this.current.prev = new Node(this.blankSymbol);
      this.current.prev.next = this.current;
    }
    this.current = this.current.prev;
    return this;
  }

  moveRight() {
    if (!this.current) {
      return this.handlePointerError();
    }
    if (!this.current.next) {
      this.current.next = new Node(this.blankSymbol);
      this.current.next.prev = this.current;
    }
    this.current = this.current.next;
    return this;
  }

  move(direction) {
    if (!this.current) {
      return this.handlePointerError();
    }
    switch (direction) {
      case 'L':
        return this.moveLeft();
      case 'R':
        return this.moveRight();
      default:
        return this.handleMoveError(direction);
    }
  }
}

class Node {
  constructor(data = null) {
    this.data = data;
    this.prev = null;
    this.next = null;
  }

  getData() {
    return this.data;
  }

  updateData(data) {
    this.data = data;
  }

  getNext() {
    return this.next;
  }

  getPrev() {
    return this.prev;
  }
}

module.exports = Tape;
