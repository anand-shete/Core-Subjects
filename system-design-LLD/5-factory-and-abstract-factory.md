Factory Pattern is a creational design pattern in Low-Level Design (LLD) that delegates object instantiation to a specialized factory class or method instead of letting the client create objects directly using the `new` keyword.

## 1. Simple Factory

This approach encapsulates the switch-case logic inside a centralized factory class method.

```ts
abstract class Shape {
  abstract draw(): void;
}

class Circle extends Shape {
  draw() {
    console.log("Drawing a circle");
  }
}
class Square extends Shape {
  draw() {
    console.log("Drawing a square");
  }
}

class ShapeFactory {
  static createShape(type: "circle" | "square"): Shape {
    if (type === "circle") return new Circle();
    if (type === "square") return new Square();
    throw new Error("Invalid shape type");
  }
}

const shape = ShapeFactory.createShape("circle");
shape.draw();
```

> Problem arises if you want to add a `Triangle` class, you must modify the `ShapeFactory` class, which violates the Open/Closed Principle (OCP).

## 2. Factory pattern

To fix the OCP issue, we defer instantiation to subclasses. Instead of a single class handling everything, each shape gets its own dedicated creator class.

```ts
abstract class ShapeCanvas {
  abstract createShape(): Shape;

  render() {
    const shape = this.createShape();
    shape.draw();
  }
}

class CircleCanvas extends ShapeCanvas {
  createShape(): Shape {
    return new Circle();
  }
}

class SquareCanvas extends ShapeCanvas {
  createShape(): Shape {
    return new Square();
  }
}

const canvas: ShapeCanvas = new CircleCanvas();
canvas.render();
```

## 3. Abstract Factory Pattern

Let's say your system supports families of shapes based on themes—like rendering 2D Shapes versus rendering 3D Shapes. An Abstract Factory groups these dependent products together.

```ts
// Product Family 1: 2D Shapes
interface Shape2D {
  draw2D(): void;
}
class Circle2D implements Shape2D {
  draw2D() {
    console.log("Drawing flat 2D Circle");
  }
}
class Square2D implements Shape2D {
  draw2D() {
    console.log("Drawing flat 2D Square");
  }
}

// Product Family 2: 3D Shapes
interface Shape3D {
  draw3D(): void;
}
class Sphere3D implements Shape3D {
  draw3D() {
    console.log("Drawing volumetric 3D Sphere");
  }
}
class Cube3D implements Shape3D {
  draw3D() {
    console.log("Drawing volumetric 3D Cube");
  }
}

// Abstract Factory Interface
interface GeometryFactory {
  createRoundShape(): Shape2D | Shape3D;
  createFourSidedShape(): Shape2D | Shape3D;
}

// Concrete Factory 1: Produces ONLY 2D Shapes
class FlatGeometryFactory implements GeometryFactory {
  createRoundShape(): Shape2D {
    return new Circle2D();
  }
  createFourSidedShape(): Shape2D {
    return new Square2D();
  }
}

// Concrete Factory 2: Produces ONLY 3D Shapes
class VolumetricGeometryFactory implements GeometryFactory {
  createRoundShape(): Shape3D {
    return new Sphere3D();
  }
  createFourSidedShape(): Shape3D {
    return new Cube3D();
  }
}

// Client Code
function renderScene(factory: GeometryFactory) {
  const round = factory.createRoundShape();
  const box = factory.createFourSidedShape();

  // Handled abstractly depending on the environment passed
  "draw2D" in round ? round.draw2D() : (round as Shape3D).draw3D();
}

// Switch themes dynamically
renderScene(new VolumetricGeometryFactory()); // Outputs 3D models
```
