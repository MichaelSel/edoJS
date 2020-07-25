function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
const EDO = require("../edo").EDO
edo = new EDO(12)
console.log(edo.get.resize_melody([0,2,4,5,7,5,4,2,-1,0],0.5))






