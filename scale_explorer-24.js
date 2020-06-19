const EDO = require("./edo")
edo = new EDO(24)

let scale




scale = edo.scale([0, 2, 8, 10, 14, 17, 20]) //Maqam Hijaz
scale = edo.scale([0, 3, 6, 10, 12, 18, 20]) //Maqam Bayati Shuri
scale = edo.scale([0, 3, 6, 10, 14, 16, 20]) //Maqam Bayati ver 1
scale = edo.scale([0, 3, 6, 10, 14, 17, 20]) //Maqam Bayati ver 2
scale = edo.scale([0, 3, 7, 9, 15, 17, 21]) //Maqam Huzam
scale = edo.scale([0, 4, 6, 10, 14, 16, 22]) //Maqam Nahawand
scale = edo.scale([0, 4, 6, 12, 14, 20, 21]) //Maqam Awj ‘Iraq
scale = edo.scale([0, 4, 7, 10, 12, 18, 20]) //Maqam Bastanikar



/*
3-NOTE JINS:
*/

scale = edo.scale([0,5,7]) //Jins Musta‘ar
scale = edo.scale([0,3,7]) //Jins Sikah

/*
4-NOTE JINS:
*/

scale = edo.scale([0,3,6,10]) //Jins Bayati
scale = edo.scale([0,4,7,10]) //Jins Upper Rast

/*
5-NOTE JINS:
*/








const JS = function (thing) {
    return JSON.stringify(thing).replace(/"/g,'')
}
console.log("INFO ON SCALE:", JS(scale.pitches))
console.log("Rothenberg:", scale.get.rothenberg_propriety())
console.log("Gravity:", JS(scale.get.lerdahl_attraction_vector()))
console.log("Transpositions:", scale.count.transpositions())
console.log('\n\n')


console.log("COMMON-TONE TRANSPOSITIONS:")
for (let trans of scale.get.common_tone_transpositions()) {
    console.log("Pitches:",JS(trans[0].map((a)=>edo.convert.pc_to_name(a))),"Notes altered from original:",JS(trans[1]))
}


console.log("")
console.log("TRICHORDS:")
for (let tri of scale.get.trichords()) {
    console.log("Pitches:", tri,"Occurrence:", scale.get.position_of_quality(tri))
}

console.log("")
console.log("TETRACHORDS:")
for (tetra of scale.get.tetrachords()) {
    console.log("Pitches:", tetra, "Occurrence:", scale.get.position_of_quality(tetra))
}

console.log("")
console.log("STACKS (1-x-1-x-1):")
for (let stack of scale.get.stacks(3,1)) {
    console.log('3rds',stack,"Occurrence:",scale.get.position_of_quality(stack))
}

console.log("")
console.log("STACKS (1-x-1-x-1-x-1):")
for (let stack of scale.get.stacks(4,1)) {
    console.log('3rds',stack,"Occurrence:",scale.get.position_of_quality(stack))
}

console.log("")
console.log("STACKS (1-x-1-x-1-x-1-x-1-x-1):")
for (let stack of scale.get.stacks(6,1)) {
    console.log('3rds',stack,"Occurrence:",scale.get.position_of_quality(stack))
}

console.log("")
console.log("STACKS (1-x-x-1-x-x-1):")
for (let stack of scale.get.stacks(3,2)) {
    console.log('4ths',stack,"Occurrence:",scale.get.position_of_quality(stack))
}

console.log("")
console.log("STACKS (1-x-x-1-x-x-1-x-x-1):")
for (let stack of scale.get.stacks(4,2)) {
    console.log('4ths',stack,"Occurrence:",scale.get.position_of_quality(stack))
}

console.log("\nINTERVAL VECTOR:",scale.get.interval_vector())


