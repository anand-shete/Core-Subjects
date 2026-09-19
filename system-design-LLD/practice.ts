class Engine {
    constructor() {
        console.log('i am engine');
    }
}

class Tyre extends Engine {
    func() {
        console.log("test");
    }
}

class Chassis extends Tyre {
    dem() {

    }
}