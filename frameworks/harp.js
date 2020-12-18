const EDO = require("../edo").EDO

let edo = new EDO(24)

let parker1 = [0,3,8,11,14,18,22]
let parker2 = [0,5,8,9,14,18,22]
let harmonic_on_G = [1,4,8,9,14,18,22]
let harmonic_on_F = [0,5,8,10,14,18,21]
let scordatura = harmonic_on_G
// console.log(edo.get.harp_position_of_quality([0,8,14,19,4,11],scordatura,[-2,0,2])) //maj79E
// console.log(edo.get.harp_position_of_quality([0,3,6,9,12],scordatura,[-2,0,2])) // 3/4 tone pentachord
// console.log(edo.get.harp_position_of_quality([0,3,6,14],scordatura,[-2,0,2])) //min~9
// console.log(edo.get.harp_position_of_quality([0,1,7,8],scordatura,[-2,0,2]))
// console.log(edo.get.harp_position_of_quality([0,2,4,6],scordatura,[-2,0,2])) //Chromatic tetrachord
// console.log(edo.get.harp_position_of_quality([0,1,2],scordatura,[-2,0,2])) //microtonal trichord
// console.log(edo.get.harp_position_of_quality([0,4,8,12,16,19],scordatura,[-2,0,2])) //whole-tone pentachord + 3/4
// console.log(edo.get.harp_position_of_quality([0,4,8,11,14],scordatura,[-2,0,2])) //overtone lydian
// console.log(edo.get.harp_position_of_quality([20,0,4,8,11,14],scordatura,[-2,0,2])) //wholetone + overtone lydian
// console.log(edo.get.harp_position_of_quality([17,20,0,4,8,11,14],scordatura,[-2,0,2])) //wholetone + overtone lydian variation
// console.log(edo.get.harp_position_of_quality([0,4,8,11,14,18,19],scordatura,[-2,0,2])) //Overtone scale
// console.log(edo.get.harp_position_of_quality([1,4,8,12,16,20],scordatura,[-2,0,2])) // 3/4 + whole-tone pentachord
// console.log(edo.get.harp_position_of_quality([0,1,5,12,13,17],scordatura,[-2,0,2])) //MOLT
// console.log(edo.get.harp_position_of_quality([0,1,6,12,13,18],scordatura,[-2,0,2])) //MOLT
// console.log(edo.get.harp_position_of_quality([0,4,5,12,16,17],scordatura,[-2,0,2])) //MOLT
// console.log(edo.get.harp_position_of_quality([0,5,6,12,17,18],scordatura,[-2,0,2])) //MOLT
// console.log(edo.get.harp_position_of_quality([0,5,12,17],scordatura,[-2,0,2])) //MOLT
// console.log(edo.get.harp_position_of_quality([0,3,7,11,15,18],scordatura,[-2,0,2])) //3/4+wholetone sextachord
// console.log(edo.get.harp_position_of_quality([0,3,6,9,12],scordatura,[-2,0,2]))
// console.log(edo.get.harp_position_of_quality([0,1,3],scordatura,[-2,0,2]))
// console.log(edo.get.harp_position_of_quality([0,8,11],scordatura,[-2,0,2]))
// console.log(edo.get.harp_position_of_quality([0,1,3,5],scordatura,[-2,0,2])) // :(

// let configurations = ["NNSFNSS", "NNFFNNF", "NNFFNSN", "NNNFNSS", "SSNNSNN", "NNFSSSN", "NNNFFFN", "SSNNNNN", "NNFFFFN", "NNNFFFS", "NNNNFNN", "NNFFFNS", "NNSSSSN", "NNSFNNN", "NNNFNNN", "NNNNNNN", "NNNSSNF", "NNNSSSN", "SSNNNNF", "SSNNNSN", "NFFNNSN", "FSSSNFN", "NNFNNFF", "NNFNFFF", "NSNFFNN", "FNSNNFF", "NSNFNNN", "NNSFNSS", "NNFFNNF", "NNFFNSN", "NNNFNSS", "NSNFFFN", "SSNNNNN", "NNFFNFF", "SSNNNNN", "NSNFFFN", "NNFFFFF", "SSNNNNN", "SSNNSFN", "FSNFSNN", "FNSFSFN", "FNNFSFN", "FNSNSFS", "FNFNSFN", "FNNNSFS", "FSFNSNN", "FSNNSNS", "FNNFSNN", "FNFNSNN", "FNNNSNS", "NNFNFFF", "SSNNNNN"]
//
// let matrix = Array.from([...Array(configurations.length+1)])
// matrix = matrix.map(m=>Array.from([...Array(configurations.length+1)]))
//
//
//
// for (let i = 1; i <= configurations.length; i++) {
//     matrix[i][0] = configurations[i-1]
//     matrix[0][i] = configurations[i-1]
// }
//
//
// for (let i = 0; i < configurations.length; i++) {
//     let line = i+1
//     let item1_line = 0
//     let item2_line=line
//
//     for (let j = 0; j < configurations.length; j++) {
//         let col = j+1
//         let item1_col = col
//         let item2_col = 0
//         let item1 = matrix[item1_line][item1_col]
//         let item2 = matrix[item2_line][item2_col]
//         let distance = 0
//         for (let k = 0; k < item1.length; k++) {
//             if(item1[k]!=item2[k]) distance++
//         }
//
//         matrix[line][col] = distance
//     }
//
// }
//
// matrix = matrix.map(row=>row.join(',')).join('\n')
// console.log(matrix)
// edo = new EDO(12)



// let syl = ['Ne','Ver','Sed','Shi','Stoul','Yor','Ma','Ni']
// for (let i = 0; i < 10; i++) {
//     console.log(JSON.stringify(edo.shuffle_array(syl)))
// }


let scales = edo.get.scales(1,12,2,6,7)
scales.filter(scale=>scale.count.transpositions()<24).forEach(scale=>{
    console.log(JSON.stringify(scale.pitches))
})