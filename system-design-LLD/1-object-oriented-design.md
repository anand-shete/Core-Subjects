## Encapsulation

Encapsulation is hiding internal implementation (via access modifiers)

```js
class BankAccount {
  #balance;
  _non_private = true;

  constructor(bal) {
    this.#balance = bal;
  }

  deposit(amt) {
    if (amt > 0) {
      this.#balance += amt;
    }
  }

  getBalance() {
    return this.#balance;
  }
}

let account = new BankAccount(1000);
account.deposit(500);
account.deposit(-200);
console.log("balance in my account:", account.getBalance());
```

## Inheritance

Inheritance allows classes to get properties and methods of another class

```js
class Animal {
  constructor(name, species) {
    this.name = name;
    this.species = species;
  }

  speak() {
    console.log(`${this.name} makes some noise!`);
  }
}

class Dog extends Animal {
  sound = "woof woof";

  constructor(name, type = "husky") {
    super(name, type);
  }

  bark() {
    console.log(`${this.name} does ${this.sound}. It is a ${this.species}!`);
  }
}

let dog = new Dog("Tommy", "husky");
dog.speak();
dog.bark();
```

## Polymorphism

Polymorphism allows different classess to have methods with same name but different behaviours

```js
class Shape {
  draw() {
    console.log("draw a shape");
  }
}

class Circle extends Shape {
  draw() {
    console.log("draw a circle");
  }
}

class Square extends Shape {
  draw() {
    console.log("draw a square");
  }
}
let shape = new Shape();
shape.draw();
let circle = new Circle();
circle.draw();
let square = new Square();
square.draw();
```

## Abstraction

Abstraction means hiding implementation details (via classes and methods)

```js
class DrawShape {
  #connect(n) {
    console.log(`connect ${n} lines`);
  }

  #draw(n) {
    console.log(`draw ${n} lines`);
  }

  triangle() {
    this.#draw(3);
    this.#connect(3);
    console.log("triangle complete");
  }
}

shape = new DrawShape();
shape.triangle();
```
