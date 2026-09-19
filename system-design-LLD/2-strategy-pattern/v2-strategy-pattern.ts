/**
 * Turn the behavior (drive) into a interface
 */
interface DriveStrategy {
  drive(): void;
}

/**
 * Turn each behavior into its own seperate class
 */
class NormalDriveStrategy implements DriveStrategy {
  drive() {
    console.log("drive with standard fuel efficiency");
  }
}

class PerformanceDriveStrategy implements DriveStrategy {
  drive() {
    console.log("drive with high performance capabilities");
  }
}

/**
 * Reuse existing build strategies
 */
class CityDriveStrategy implements DriveStrategy {
  private base = new NormalDriveStrategy();

  drive() {
    this.base.drive();
    console.log("add city drive capability");
  }
}

class OffroadDriveStrategy implements DriveStrategy {
  private base = new PerformanceDriveStrategy();

  drive() {
    this.base.drive();
    console.log("add offroad drive capability");
  }
}

/**
 * `Vehicle` class holds a strategy instead of behavior
 */
class Vehicle implements DriveStrategy {
  constructor(private driveStrategy: DriveStrategy) {}

  drive() {
    this.driveStrategy.drive();
  }
}

const cityDrive = new Vehicle(new CityDriveStrategy());
cityDrive.drive();

const offroadDrive = new Vehicle(new OffroadDriveStrategy());
offroadDrive.drive();
