The Observer Design Pattern is a behavioral design pattern that defines a one-to-many dependency between objects. When one object (Observable) changes its state, all its dependents (Observers) are notified and updated automatically.

- **Observable**: Maintains a list of observers and provides methods to attach, detach, and notify them.
- **Observer**: Defines an updating interface for objects that should be notified of changes.
- **Concrete Subject** / **Concrete Observer**: Implementations of the respective interfaces.

## Example

Weather station notifying multiple Observers to notify current temperature change.

```ts
// 1. Observer Interface
interface Observer {
  update(temperature: number, humidity: number): void;
}

// 2. Subject (Observable) Interface
interface Subject {
  registerObserver(o: Observer): void;
  removeObserver(o: Observer): void;
  notifyObservers(): void;
}

// 3. Concrete Subject
class WeatherStation implements Subject {
  private observers: Observer[] = [];
  private temperature: number = 0;
  private humidity: number = 0;

  public registerObserver(o: Observer): void {
    this.observers.push(o);
  }

  public removeObserver(o: Observer): void {
    const index = this.observers.indexOf(o);
    if (index !== -1) {
      this.observers.splice(index, 1);
    }
  }

  public notifyObservers(): void {
    for (const observer of this.observers) {
      observer.update(this.temperature, this.humidity);
    }
  }

  // Business logic method that triggers the notification
  public setMeasurements(temperature: number, humidity: number): void {
    this.temperature = temperature;
    this.humidity = humidity;
    this.notifyObservers();
  }
}

// 4. Concrete Observers
class PhoneDisplay implements Observer {
  public update(temperature: number, humidity: number): void {
    console.log(`[Phone Display] Temp: ${temperature}°C, Humidity: ${humidity}%`);
  }
}

class WindowDisplay implements Observer {
  public update(temperature: number, humidity: number): void {
    console.log(`[Window Display] Weather changed! Temperature is now ${temperature}°C`);
  }
}

// --- Driver Code (Execution) ---
const weatherStation = new WeatherStation();

const phone = new PhoneDisplay();
const windowElement = new WindowDisplay();

// Subscribe observers
weatherStation.registerObserver(phone);
weatherStation.registerObserver(windowElement);

// Simulate weather update -> Both displays update automatically
weatherStation.setMeasurements(26, 65);

// Unsubscribe one observer
weatherStation.removeObserver(phone);

// Simulate another update -> Only WindowDisplay updates
weatherStation.setMeasurements(28, 60);
```

## Real-World Use Cases

- **Pub/Sub Systems**: Event handling systems like Node.js EventEmitter or RxJS Observables.
- **UI Frameworks**: Model-View-Controller (MVC) architectures where data changes in the model automatically update the view.
- **Notification Services**: Pushing push notifications or emails when an order status changes in e-commerce.
