const Observable = require('../utils/Observable');



class Light extends Observable {
    constructor (house, name, room) {
        super()
        this.house = house;         // reference to the house
        this.name = name;           // non-observable
        this.room = room;
        this.set('status', 'off')   // observable
    }
    switchOnLight (l) {
        this.status = 'on'
        this.house.utilities.electricity.consumption += 1;
        // Include some messages logged on the console!
        console.log(`${this.name} turned ${this.status}`)
    }
    switchOffLight (l) {
        this.status = 'off'
        this.house.utilities.electricity.consumption -= 1;
        // Include some messages logged on the console!
        console.log(`${this.name} turned ${this.status}`)
    }
}




module.exports = Light