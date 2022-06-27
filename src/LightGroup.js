const Observable = require("../lib/utils/Observable");
const Light = require("../lib/houseworld/Light");

class LightGroup extends Observable{
    constructor(house, room, lightGroupName, noOfLights) {
        super()
        this.house = house;
        this.name = lightGroupName;
        this.lights = []
        this.noOfOnLights = 0
        this.set('status', 'off')
        let cutName = this.name.substring(0,(this.name.length)-1)
        for ( let i = 1; i <= noOfLights; i++ ) {
            this.lights.push(new Light(this.house, cutName.concat(i.toString())))
        }
    }
    switchOnLights(lightName) {
        let convertedAllFlag = false
        if ( lightName != null ){
            let index = parseInt(lightName.substring(lightName.length-1, lightName.length))-1
            this.lights[index].switchOnLight()
            this.noOfOnLights++
        }else{
            convertedAllFlag = true
            for (const light in this.lights) {
                if ( light.status == 'off') {
                    light.switchOnLight()
                    this.noOfOnLights++
                }
            }
        }
        this.status = convertedAllFlag || this.noOfOnLights == this.lights.length ? 'on' : 'partially on'
        this.house.utilities.electricity.consumption += convertedAllFlag ? this.lights.length : 1;
        // Include some messages logged on the console!
        console.log(`${this.name} turned ${this.status}`)
    }
    switchOffLights(lightName) {
        let convertedAllFlag = false
        if ( lightName != null ){
            let index = parseInt(lightName.substring(lightName.length-1, lightName.length))-1
            this.lights[index].switchOffLight()
            this.noOfOnLights--
        }else{
            convertedAllFlag = true
            for (const light in this.lights) {
                if ( light.status == 'on') {
                    light.switchOffLight()
                    this.noOfOnLights--
                }
            }
        }
        this.status = convertedAllFlag || this.noOfOnLights == 0 ? 'off' : 'partially on'
        this.house.utilities.electricity.consumption -= convertedAllFlag ? this.lights.length : 1;;
        // Include some messages logged on the console!
        console.log(`${this.name} turned ${this.status}`)
    }
}

module.exports = LightGroup