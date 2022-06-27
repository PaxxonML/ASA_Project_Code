const Observable = require("../lib/utils/Observable");
const Light = require("../lib/houseworld/Light");

class SmartLight extends Light{
    constructor(house, person, inRoom, name) {
        super(house, name);
        this.house = house;
        this.name = name;
        this.inRoom = inRoom;
        this.person = person;
        this.set('status', 'off')
        person.observe( 'in_room', value => this.checkRoom(value))
    }
    checkRoom(roomName) {
        if (roomName == this.inRoom && this.status == 'off') {
            this.switchOnLight()
        } else if (roomName != this.inRoom && this.status == 'on'){
            this.switchOffLight()
        }
    }
}

module.exports = SmartLight