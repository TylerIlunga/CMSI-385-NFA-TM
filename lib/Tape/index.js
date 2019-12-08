class Tape {
  constructor(blankSymbol) {
    this.head = null;
    this.tail = null;
    this.current = this.head;
    this.blankSymbol = blankSymbol;
  }

  handlePointerError() {
    throw new Error('Tape does not point to Node.');
  }

  handleMoveError(direction) {
    throw new Error(
      `Invalid Tape Direction: ${direction}\nAvailable Directions: [L, R]`,
    );
  }

  read() {
    console.log('Tape.read()');
    if (!this.current) {
      return handlePointerError();
    }
    return this.current.getData();
  }

  write(symbol) {
    console.log('Tape.write():', symbol);
    if (!this.current) {
      return handlePointerError();
    }
    this.current.updateData(symbol);
  }

  moveLeft(state) {
    console.log('Tape.moveLeft()');
    if (!this.current.prev) {
      this.current.prev = new Node(state, this.blankSymbol);
    }
    this.current = this.current.prev;
  }

  moveRight(state) {
    console.log('Tape.moveRight()');
    if (!this.current.next) {
      this.current.next = new Node(state, this.blankSymbol);
    }
    this.current = this.current.next;
  }

  move(state, direction) {
    console.log('Tape.move():', direction);
    if (!this.current) {
      return handlePointerError();
    }
    switch (direction) {
      case 'L':
        return moveLeft(state);
      case 'R':
        return moveRight(state);
      default:
        return handleMoveError(direction);
    }
  }
}

class Node {
  constructor(state, data = null) {
    this.state = state;
    this.data = data;
    this.prev = null;
    this.next = null;
  }

  getState() {
    console.log('Node.getState()');
    return this.state;
  }

  getData() {
    console.log('Node.getData()');
    return this.data;
  }

  updateData(data) {
    console.log('Node.updateData():', data);
    this.data = data;
  }

  getNext() {
    console.log('Node.getNext()');
    return this.next;
  }

  getPrev() {
    console.log('Node.getPrev()');
    return this.prev;
  }
}

module.exports = Tape;
