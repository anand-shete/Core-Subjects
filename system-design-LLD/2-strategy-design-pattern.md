## Problem

Suppose we have an abstract class `Vehicle` with a method `drive()`.

```ts
abstract class Vehicle {
  drive(): void {
    console.log("base vehicle drive");
  }
}

class SportsVehicle extends Vehicle {
  specialDrive(): void {
    console.log("Driving with high performance capability");
  }
}

class OffRoadVehicle extends SportsVehicle {
  // forced to copy/paste to mimic exact parent strategy
  override specialDrive(): void {
    console.log("Driving with high performance capability");
    console.log("adds off road capabilities to special drive");
  }
}

class PassengerVehicle {
  normalDrive(): void {
    console.log("Driving with standard fuel efficiency");
  }
}

class CityVehicle extends PassengerVehicle {
  // same issue here
  normalDrive(): void {
    console.log("Driving with standard fuel efficiency");
    console.log("adds city drive capabilites to passenger vehicles");
  }
}
```

Why pure inheritance fails here:

1. **Code Duplication**: Both `SportsVehicle` and `OffRoadVehicle` will have to write the exact same duplicate code for `SpecialDrive`.
2. **Maintenance Nightmare**: If you change how `SpecialDrive` works, you have to modify it in multiple child classes.

## Strategy Pattern Fix: "Favor Composition over Inheritance"

To solve this, we take the behavior (`drive`) out of the inheritance hierarchy entirely. We turn that behavior into its own interface.

### 1. Define the Strategy Interface and Implementations

```ts
interface DriveStrategy {
  drive(): void;
}

class SpecialDrive implements DriveStrategy {
  drive() {
    console.log("Driving with high performance capability");
  }
}

class NormalDrive implements DriveStrategy {
  drive() {
    console.log("Driving with standard fuel efficiency");
  }
}
```

### 2. Inject it into the Parent Class

Instead of inheriting the behavior, the parent class has a strategy.

```ts
class Vehicle {
  // Composition: Vehicle "has a" DriveStrategy
  constructor(private driveObject: DriveStrategy) {}

  public drive() {
    this.driveObject.drive();
  }
}
```

### 3. Child Classes simply pass down the right Strategy

Now, child classes do not write driving logic. They just choose a strategy object to handle it.

```ts
class SportsVehicle extends Vehicle {
  constructor() {
    // Pass the shared special drive logic
    super(new SpecialDrive());
  }
}

class OffRoadVehicle extends Vehicle {
  constructor() {
    // Reuses the exact same logic! No duplication.
    super(new SpecialDrive());
  }
}

class PassengerVehicle extends Vehicle {
  constructor() {
    super(new NormalDrive());
  }
}
```
