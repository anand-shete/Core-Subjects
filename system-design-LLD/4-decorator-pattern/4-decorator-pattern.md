The Decorator Pattern is a structural design pattern that lets you dynamically add new behaviors and responsibilities to an object at runtime without altering its code or breaking other instances of the same class.

## Example

Think of a base Coffee ($2.00).

- If you want milk, you don't buy a separate MilkCoffee class. You take your base coffee and wrap it with a Milk Decorator (+$0.50).
- If you want whip, you wrap that entire combination with a Whip Decorator (+$0.70).

The total cost calculation bubbles down through all the wrappers automatically.

### 1. Code abstraction

Both the concrete object and the decorators must implement the same interface so they can be used interchangeably.

```ts
interface Coffee {
  getCost(): number;
  getDescription(): string;
}
```

### 2. The Concrete Component

This is the baseline object that we want to add extra features to.

```ts
class SimpleCoffee implements Coffee {
  getCost(): number {
    return 2.0;
  }

  getDescription(): string {
    return "Simple Coffee";
  }
}
```

### 3. The Base Decorator Class

This class implements the `Coffee` interface and holds a reference to a wrapped `Coffee` object. It delegates all work to the wrapped object.

```ts
abstract class CoffeeDecorator implements Coffee {
  protected decoratedCoffee: Coffee;

  constructor(coffee: Coffee) {
    this.decoratedCoffee = coffee;
  }

  getCost(): number {
    return this.decoratedCoffee.getCost();
  }

  getDescription(): string {
    return this.decoratedCoffee.getDescription();
  }
}
```

### 4. Concrete Decorators

These classes extend the base decorator to add specific behaviors and modify the output.

```ts
class MilkDecorator extends CoffeeDecorator {
  getCost(): number {
    return super.getCost() + 0.5;
  }

  getDescription(): string {
    return super.getDescription() + ", Milk";
  }
}

class SugarDecorator extends CoffeeDecorator {
  getCost(): number {
    return super.getCost() + 0.2;
  }

  getDescription(): string {
    return super.getDescription() + ", Sugar";
  }
}
```

### 5. Client Code (Putting it together)

We can chain the wrappers at runtime depending on what the user orders

```ts
let myCoffee: Coffee = new SimpleCoffee();
console.log(`${myCoffee.getDescription()} -> $${myCoffee.getCost().toFixed(2)}`);

myCoffee = new MilkDecorator(myCoffee);
console.log(`${myCoffee.getDescription()} -> $${myCoffee.getCost().toFixed(2)}`);

myCoffee = new SugarDecorator(myCoffee);
console.log(`${myCoffee.getDescription()} -> $${myCoffee.getCost().toFixed(2)}`);
```
