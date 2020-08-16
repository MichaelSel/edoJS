const EDO = require("../edo").EDO

const unique_in_array = (list) => {

    let unique  = new Set(list.map(JSON.stringify));
    unique = Array.from(unique).map(JSON.parse);

    return unique
}
const JS = function (thing) {
    return JSON.stringify(thing).replace(/"/g,'')
}

edo = new EDO(12)


let melody = [7,5,4,3,2,1,3,5,6,7]
console.log("\n\nMELODY:",JS(edo.convert.midi_to_name(melody,60)))

console.log("\nCONTOUR:",JS(edo.get.contour(melody)))

console.log("\nPitch Distribution:",edo.get.pitch_distribution(melody))


let motives = edo.get.motives(melody)

motives = motives.map((motive) => {
    motive.interval = edo.get.interval_traversed(motive.motive)
    return motive
})

let main_motives = motives.map((m)=>m.motive)
console.log(motives.sort((a,b)=>b.incidence-a.incidence).slice(0,10))




for(let i=0;i<12;i++) {
    let melodies = []
    console.log("\n\nReaching",edo.convert.midi_to_name(i,60),"in 9 steps, using motives from the given melody:")
    let motivic = edo.get.path_n_steps(i,main_motives,9-1) //getting all motivic solutions
        .sort((a,b)=>a.length-b.length) //sorting based on length of motive (prefering solutions with longer motives)
        .slice(0,5) //Keeping only the 5 best options
        .map((int)=>edo.convert.intervals_to_pitches(int)) //converting to PC
        .map((int)=>edo.convert.midi_to_name(int,60)) //converting to note names
    motivic.forEach((m) => {
        console.log(JS(m))
    })

}


