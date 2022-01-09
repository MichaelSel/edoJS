// const EDO = require("../index.js").EDO
import {EDO} from "../edo.js"
//
let edo = new EDO(24)
// let scale = edo.scale([0,1,2,3,4,5,6,7])
// let parsed = scale.get.n_chords(8).map(n_chord=>n_chord.map(n=>{
//     if(n==0) return "Node"
//     if(n==1) return "+1/-7"
//     if(n==2) return "+2/-6"
//     if(n==3) return "+3/-5"
//     if(n==4) return "+4/-4"
//     if(n==5) return "+5/-3"
//     if(n==6) return "+6/-2"
//     if(n==7) return "+7/-1"
//
// }))
// let result = JSON.stringify(parsed)
//     .split('[').join("\n")
//     .split("]").join("")
//     .split(",").join("\t")
//     .split("\"").join("")
// console.log(result)

// Gets
function get_necklaces (steps,max_notes) {
    let all = []
    function run_it(elements,goal, tally=Array.from(Array(elements.length).fill(0)),index=0) {
        let current = tally.reduce((ag,e,i)=>(e*elements[i])+ag,0)
        let num_of_notes = tally.reduce((ag,e)=>e+ag,0)
        if(num_of_notes>max_notes) return
        if(current==goal) all.push(tally)
        if(index==tally.length) return

        let temp_current = current
        let value = 0
        while (temp_current<goal) {
            let temp = Array.from(tally)
            temp[index]= value
            value++
            temp_current = temp.reduce((ag,e,i)=>(e*elements[i])+ag,0)
            run_it(elements,goal,temp,index+1)
        }

    }
    run_it(steps)
    all = all.map(arr=>arr.map((n,i)=>Array(n).fill(steps[i])).flat())
    return all
}


const unique_elements = (list) => {

    let unique = new Set(list.map(JSON.stringify));
    unique = Array.from(unique).map(JSON.parse);

    return unique
}

// console.log(JSON.stringify(calc_comb(12,[3,2,1])))
// console.log("hiiiiii")
// console.log(JSON.stringify(unique_elements(calc_comb2(12,[1,2,3]))))

let scales = edo.get.scales(1,24,1,6,8,8,false).sort((a,b)=>a.count.pitches()-b.count.pitches())
console.log(scales.length)
// let result = get_necklaces(12,[1,2,3],7)
// scales.forEach(s=>console.log(s.pitches))