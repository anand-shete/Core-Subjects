abstract class Vehicle {
  drive() {
    console.log("base vehicle drive");
  }
}

/**
 * create `PassengerVehicle` and `SportsVehicle` from `Vehicle` parent
 */
class PassengerVehicle extends Vehicle {
  normalDrive() {
    console.log("drive with standard fuel efficiency");
  }
}

class SportsVehicle extends Vehicle {
  performanceDrive() {
    console.log("drive with high performace capability");
  }
}

/**
 * create `CityVehicle` and `OffroadVehicle` which extend `PassengerVehicle` and `SportsVehicle` respectively
 */
class CityVehicle extends PassengerVehicle {
  normalDrive() {
    console.log("drive with standard fuel efficiency");
    console.log("add city drive capability");
  }
}

/**
 * create `OffroadVehicle` from `SportsVehicle` class
 */
class OffroadVehicle extends SportsVehicle {
  performanceDrive() {
    console.log("drive with high performace capability");
    console.log("add offroad capability");
  }
}

const cityVehicle = new CityVehicle();
cityVehicle.normalDrive();

const offroadVehicle = new OffroadVehicle();
offroadVehicle.performanceDrive();
