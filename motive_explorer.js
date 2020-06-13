const EDO = require("./edo")

const unique_in_array = (list) => {

    let unique  = new Set(list.map(JSON.stringify));
    unique = Array.from(unique).map(JSON.parse);

    return unique
}
const JS = function (thing) {
    return JSON.stringify(thing).replace(/"/g,'')
}

edo = new EDO(12)


let melody = [0,2,4,5,2,4,7]
console.log("\n\nMELODY:",JS(edo.convert.midi_to_name(melody,60)))
let motives = edo.get.motives(melody)

// console.log("\n\nMOTIVES IN MELODY:")
// motives.forEach((motive)=> {
//     console.log(JS(motive))
// })


motives = motives.map((motive) => {
    motive.interval = edo.get.motive_interval_shift(motive.motive)
    return motive
})

let main_motives = motives.map((m)=>m.motive)




for(let i=0;i<12;i++) {
    let melodies = []
    console.log("\n\nReaching",edo.convert.midi_to_name(i,60),"in 8 steps, using motives from the given melody:")
    let motivic = edo.get.path_n_steps(i,main_motives,8) //getting all motivic solutions
        .sort((a,b)=>a.length-b.length) //sorting based on length of motive (prefering solutions with longer motives)
        .slice(0,5) //Keeping only the 5 best options
        .map((int)=>edo.convert.intervals_to_pitches(int)) //converting to PC
        .map((int)=>edo.convert.midi_to_name(int,60)) //converting to note names
    motivic.forEach((m) => {
        console.log(JS(m))
    })

}

