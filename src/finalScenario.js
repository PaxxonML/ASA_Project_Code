const Beliefset =  require('../lib/bdi/Beliefset')
const Observable =  require('../lib/utils/Observable')
const Clock =  require('../lib/utils/Clock')
const Agent = require('../lib/bdi/Agent')
const Goal = require('../lib/bdi/Goal')
const Intention = require('../lib/bdi/Intention')
const Person = require('../lib/houseworld/Person')
const Light = require('../lib/houseworld/Light')
const {AlarmGoal, AlarmIntention} = require('../lib/houseworld/Alarm')
const {SenseLightsGoal, SenseLightsIntention, SenseOneLightGoal, SenseOneLightIntention} = require('../lib/houseworld/LightSensor')
const SmartLightGroup = require("./SmartLightGroup");
const SmartLight = require("./SmartLight");


class House {
    constructor () {
        this.people = { tere: new Person(this, 'Tere', 'kitchen')}
        this.rooms = {
            gym: { name: 'gym', doors_to: ['hall'] },
            studyRoom1: { name: 'studyRoom1', doors_to: ['hall'] },
            studyRoom2: { name: 'studyRoom2', doors_to: ['hall'] },
            guestRestroom: { name: 'guestRestroom', doors_to: ['hall'] },
            entrance: { name: 'entrance', doors_to: ['hall'] },
            stairs: { name: 'stairs', doors_to: ['hall'] },
            hall: { name: 'hall', doors_to: ['gym', 'studyRoom1', 'studyRoom2', 'guestRestroom', 'entrance', 'stairs', 'livingRoom'] },
            livingRoom: { name: 'livingRoom', doors_to: ['hall', 'diningRoom'] },
            diningRoom: { name: 'diningRoom', doors_to: ['livingRoom', 'kitchen', 'outsideOpenGrill'] },
            outsideOpenGrill: { name: 'outsideOpenGrill', doors_to: ['diningRoom', 'kitchen', 'outside'] },
            outside: { name: 'outside', doors_to: ['outsideBathroom', 'outsideOpenGrill'] },
            outsideBathroom: { name: 'outsideBathroom', doors_to: ['outside'] },
            kitchen: { name: 'kitchen', doors_to: ['diningRoom', 'outside', 'outsideOpenGrill', ] },
            pantryRoom: { name: 'pantryRoom', doors_to: ['kitchen'] },
            laundryRoom: { name: 'laundryRoom', doors_to: ['kitchen'] }

        }
        this.devices = {
            gymLights: new SmartLightGroup(this, this.people.tere, this.rooms.gym.name, 'gymLights',6),
            studyRoom1Lights: new SmartLightGroup(this, this.people.tere, this.rooms.studyRoom1.name, 'studyRoom1Lights', 3),
            studyRoom2Lights: new SmartLight(this, this.people.tere, this.rooms.studyRoom2.name, 'studyRoom2Light'),
            guestRestroomLights: new SmartLightGroup(this, this.people.tere, this.rooms.guestRestroom.name, 'guestRestroomLights', 2),
            entranceLights: new SmartLightGroup(this, this.people.tere, this.rooms.entrance.name, 'entranceLights', 3),
            stairsLights: new SmartLightGroup(this, this.people.tere, this.rooms.stairs.name, 'stairsLights', 3),
            hallLights: new SmartLightGroup(this, this.people.tere, this.rooms.hall.name, 'hallLights', 2),
            livingRoomLights: new SmartLightGroup(this, this.people.tere, this.rooms.livingRoom.name, 'livingRoomLights', 2),
            diningRoomLights: new SmartLightGroup(this, this.people.tere, this.rooms.diningRoom.name, 'diningRoomLights', 5),
            outsideOpenGrillLights: new SmartLightGroup(this, this.people.tere, this.rooms.outsideOpenGrill.name, 'outsideOpenGrillLights', 4),
            outsideBathroomLights: new SmartLightGroup(this, this.people.tere, this.rooms.outsideBathroom.name, 'outsideBathroomLights', 2),
            kitchenLights: new SmartLightGroup(this, this.people.tere, this.rooms.kitchen.name, 'kitchenLights', 10),
            pantryRoomLights: new SmartLight(this, this.people.tere, this.rooms.pantryRoom.name, 'pantryRoomLight'),
            laundryRoomLights: new SmartLightGroup(this, this.people.tere, this.rooms.laundryRoom.name, 'laundryRoomLights', 2)
        }
        this.utilities = {
            electricity: new Observable( { consumption: 0 } )
        }
    }
}



// House, which includes rooms and devices
var myHouse = new House()

// Agents
var myAgent = new Agent('myAgent')
myAgent.intentions.push(AlarmIntention)
myAgent.postSubGoal( new AlarmGoal({hh:8, mm:0}) )

myAgent.intentions.push(SenseLightsIntention)
// myAgent.intentions.push(SenseOneLightIntention)
myAgent.postSubGoal( new SenseLightsGoal( [myHouse.devices.kitchenLights, myHouse.devices.diningRoomLights, myHouse.devices.livingRoomLights, myHouse.devices.hallLights, myHouse.devices.studyRoom1Lights] ) )

// Simulated Daily/Weekly schedule
Clock.global.observe('mm', (mm) => {
    var time = Clock.global
    if(time.hh==8 && time.mm==0)
        myHouse.devices.kitchenLights.switchOnLights()
    if(time.hh==8 && time.mm==15)
        myHouse.people.tere.moveTo('kitchen')
    if(time.hh==8 && time.mm==30)
        myHouse.people.tere.moveTo('diningRoom')
    if(time.hh==8 && time.mm==45)
        myHouse.people.tere.moveTo('livingRoom')
    if(time.hh==9 && time.mm==00)
        myHouse.people.tere.moveTo('hall')
    if(time.hh==9 && time.mm==15)
        myHouse.people.tere.moveTo('studyRoom1')
    if(time.hh==13 && time.mm==30) {
        myHouse.people.tere.moveTo('hall')
        myHouse.people.tere.moveTo('livingRoom')
        myHouse.people.tere.moveTo('diningRoom')
        myHouse.people.tere.moveTo('kitchen')
    }
    if(time.hh==19 && time.mm==0) {
        for (const lights in this.devices) {
            if (lights instanceof SmartLight) {
                lights.switchOnLight()
            } else if (lights instanceof SmartLightGroup) {
                lights.switchOnLights()
            }
        }
    }
    if(time.hh==22 && time.mm==15) {
        myHouse.people.tere.moveTo('hall')
        myHouse.people.tere.moveTo('stairs')
    }
})

// Start clock
Clock.startTimer()