## v1-bad.ts

Core issues:

1. **Code Duplication**: Both `SportsVehicle` and `OffRoadVehicle` will have to write the exact same duplicate code for `PerformanceDrive`.
2. **Maintenance Nightmare**: If you change how `PerformanceDrive` works, you have to modify it in multiple child classes.

## Strategy Pattern: "Favor Composition over Inheritance"

To solve this, we take the behavior (`drive`) out of the inheritance hierarchy entirely. We turn that behavior into its own interface.

### 1. Define the Strategy Interface and Implementations

```ts
interface DriveStrategy {
  drive(): void;
}

class PerformanceDrive implements DriveStrategy {
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
    super(new PerformanceDrive());
  }
}

class OffRoadVehicle extends Vehicle {
  constructor() {
    // Reuses the exact same logic! No duplication.
    super(new PerformanceDrive());
  }
}

class PassengerVehicle extends Vehicle {
  constructor() {
    super(new NormalDrive());
  }
}
```
