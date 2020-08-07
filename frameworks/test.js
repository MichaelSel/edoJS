function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
const EDO = require("../edo").EDO
let edo = new EDO(12)
// let chords = [[0,4,6,8,11],[1,3,6,7,11],[1,4,5,9,11],[3,5,7,10,11]]
// chords = edo.get.permutations(chords)
// chords.forEach((coll)=>{
//     console.log("collection:")
//     let chord1 = coll.splice(0,1)[0]
//     console.log(chord1)
//     while(coll.length>0) {
//         chord2 = coll.splice(0,1)[0]
//         chord1 = edo.get.minimal_voice_leading(chord1,chord2)
//         console.log(chord1)
//     }
//     console.log('\n')
// })
// let sets
// sets = edo.get.partitioned_subsets([0,[1,2],[3,4],[5,6],7,[8,9],[10,11],0])
// sets = edo.get.partitioned_subsets([0,[1,2],[3,4],7,[8,9],0])
// sets = edo.get.partitioned_subsets([0,[3,4],[5,6],[7,8],[10,11]])
// sets = edo.get.partitioned_subsets([[0],[4,3],[2,3],[8,9],[10,11],7,[3,4]])
//
// sets.forEach((set)=>{
//     console.log(JSON.stringify(set))
// })
//
//

let motives = edo.get.contour_motives([6,5,6,3,6,8,6,1,3],)
motives.forEach((motive)=>console.log(JSON.stringify(motive)))





