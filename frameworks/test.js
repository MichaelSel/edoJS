function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
const EDO = require("../edo").EDO
edo = new EDO(12)
let scale = edo.scale([0,3,7])
let transpositions = scale.get.common_tone_transpositions()
    .map((t)=>t.transposition)
transpositions = edo.get.unique_elements(transpositions)
    .map((t)=>edo.get.minimal_voice_leading(scale.pitches,t))
console.log(transpositions)





