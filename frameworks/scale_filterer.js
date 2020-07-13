const EDO = require("../edo").EDO

const JS = function (thing) {
    return JSON.stringify(thing).replace(/"/g,'')
}
let divisions = 12
edo = new EDO(divisions)
let scales = edo.get.scales(1,6,1,4)
console.log("Total Scales",scales.length," Filtering...")

/** Get all the scales that are a subset of a mode of limited transposition, that aren't modes of limited transposition themselves*/
const subsets_of_modes_of_LT_that_arent = function (scales,edo) {

    //Get all the modes of limited transposition
    scales = scales.filter((scale)=>scale.count.transpositions()<scale.edo)

    //remove the chromatic scale
    scales = scales.filter((scale)=>scale.get.step_sizes().length>1 || scale.get.step_sizes()[0]!=1) //if the only step size is [1] it's the chromatic scale

    // //remove scales that are subsets of other scales
    // scales = scales.filter((scale,ind,all)=> {
    //     let temp_all = [...all]
    //     temp_all.splice(ind,1) //remove current scale from list
    //     return !scale.is.subset(temp_all.map((scale)=>scale.pitches))
    // })

    scales = scales.map((scale)=>{
        //Get all subsets of each mode of limited transposition
        let sub_scales = scale.parent.get.subsets(scale.pitches)

        //normalize all subsets to 0 and store their PCs
        sub_scales=sub_scales.map((pitches)=>scale.parent.scale(pitches).normal().pitches)

        //remove duplications
        sub_scales = scale.parent.get.unique_elements(sub_scales)

        //turn each into a scale object
        sub_scales = sub_scales.map((pitches)=>scale.parent.scale(pitches))

        //remove all scales with 3 pitches or less
        sub_scales = sub_scales.filter((scale)=>scale.count.pitches()>3)

        //remove all scales that are modes of limited transposition themselves
        sub_scales = sub_scales.filter((scale)=>scale.count.transpositions()==scale.edo)

        return {mode:scale.pitches, subsets: sub_scales}
    })

    for (let mode of scales) {
        console.log(JS(mode.mode),"Subsets:")

        for(let subset of mode.subsets) {
            console.log(JS(subset.pitches))
        }
        console.log("\n")
    }

    return scales

}

/** Get all modes of limited transpositions and their subsets who are also of limited transposition */
const all_modes_of_LT = function (scales,edo) {
    //Get all the modes of limited transposition
    scales = scales.filter((scale)=>scale.count.transpositions()<scale.edo)

    //remove the chromatic scale
    scales = scales.filter((scale)=>scale.get.step_sizes().length>1 || scale.get.step_sizes()[0]!=1) //if the only step size is [1] it's the chromatic scale

    // //remove scales that are subsets of other scales
    // scales = scales.filter((scale,ind,all)=> {
    //     let temp_all = [...all]
    //     temp_all.splice(ind,1) //remove current scale from list
    //     return !scale.is.subset(temp_all.map((scale)=>scale.pitches))
    // })


    scales = scales.map((scale)=>{
        //Get all subsets of each mode of limited transposition
        let sub_scales = scale.parent.get.subsets(scale.pitches)

        //normalize all subsets to 0 and store their PCs
        sub_scales=sub_scales.map((pitches)=>scale.parent.scale(pitches).normal().pitches)

        //remove duplications
        sub_scales = scale.parent.get.unique_elements(sub_scales)

        //turn each into a scale object
        sub_scales = sub_scales.map((pitches)=>scale.parent.scale(pitches))

        //remove all scales with 3 pitches or less
        sub_scales = sub_scales.filter((scale)=>scale.count.pitches()>3)

        //remove all scales that are NOT modes of limited transposition themselves
        sub_scales = sub_scales.filter((scale)=>scale.count.transpositions()!=scale.edo)

        //remove all subsets that are their own superset
        sub_scales = sub_scales.filter((sub)=>!edo.is.same(sub,scale))


        return {mode:scale.pitches, subsets: sub_scales}
    })

    for (let mode of scales) {
        console.log(JS(mode.mode),"Subsets:")

        for(let subset of mode.subsets) {
            console.log(JS(subset.pitches))
        }
        console.log("\n")
    }

    return scales

}

scales = subsets_of_modes_of_LT_that_arent(scales,edo)

