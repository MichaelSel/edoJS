function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
const EDO = require("../edo").EDO
let divisions = 12
edo = new EDO(divisions)

// let num_of_time_for_each_set = 6
// let num_of_subjects = 1000

// const make_dist = function () {
//     const make_random_subject_dist = function () {
//         let sub = Array.from(Array(66))
//         sub = sub.map((el,i)=>{return {set:i+1,value:getRandomInt(1,num_of_time_for_each_set)}})
//         return sub
//     }
//     let subs=[]
//     for (let i = 0; i < num_of_subjects; i++) {
//         subs.push(make_random_subject_dist())
//     }
//     let totales = {}
//     subs.forEach((sub)=> {
//         sub.forEach((set)=> {
//             if(totales[set.set]==undefined) totales[set.set]=set.value
//             else totales[set.set]+=set.value
//         })
//     })
//
//     totales_array = []
//
//     Object.keys(totales).forEach((key)=> {
//         totales_array.push({set_id: parseInt(key), value: totales[key]/ subs.length})
//     })
//     totales_array = totales_array.sort((a,b)=>a.value-b.value)
//     totales_values = []
//     totales_array.forEach((el)=>{totales_values.push(el.value)})
//     totales_values = edo.get.unique_elements(totales_values)
//     // console.log("Total unique values:",totales_values.length)
//     return totales_values.length
// }
//
// let highest =0
// for (let i = 0; i < 10000; i++) {
//     let result = make_dist()
//     if(result>highest) highest=result
// }
// console.log(highest)

console.log(edo.show.necklace_fractal("con"))