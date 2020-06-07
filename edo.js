const FixedContentNecklace = require("../edoJS/FixedContentNecklace")
const get_divisors = function (n) {
    let divisors = []
    for (let i=2;i<Math.ceil(n/2);i++) {
        if(n%parseInt(i)==0) divisors.push(i)
    }
    return divisors
}
const combinations = (set, k) => {
    if (k > set.length || k <= 0) {
        return []
    }

    if (k == set.length) {
        return [set]
    }

    if (k == 1) {
        return set.reduce((acc, cur) => [...acc, [cur]], [])
    }

    let combs = [], tail_combs = []

    for (let i = 0; i <= set.length - k + 1; i++) {
        tail_combs = combinations(set.slice(i + 1), k - 1)
        for (let j = 0; j < tail_combs.length; j++) {
            combs.push([set[i], ...tail_combs[j]])
        }
    }

    return combs
}

// const combinations = set => {
//     return set.reduce((acc, cur, idx) => [...acc, ...k_combinations(set, idx + 1)], [])
// }

const list_to_unique = (list) => {

    let unique  = new Set(list.map(JSON.stringify));
    unique = Array.from(unique).map(JSON.parse);

    return unique
}




class EDO {

    self = this

    constructor(edo=12) {
        this.edo = edo
        this.M3s = this.ratio_to_interval(5 / 4, 20)
        this.m3s = this.ratio_to_interval(6 / 5, 20)
        this.P5s = this.ratio_to_interval(3 / 2, 5)
        this.edo_divisors = get_divisors(edo)
        this.catalog = {}
        this.cents_per_step = (12 / edo) * 100
    }

    ratio_to_interval(ratio,tolerance=10) {
        let intervals = []
        ratio = this.ratio_to_cents(ratio)
        for (let i = 0; i < this.edo; i++) {
            let interval = this.interval_to_cents(i)
            if (Math.abs(interval - ratio) <= tolerance) intervals.push(i)
            else if (intervals.length > 0) break
        }
        return intervals
    }

    ratio_to_cents(ratio) {
        return 1200*Math.log2(ratio)
    }

    interval_to_cents (interval) {
        this.cents_per_step*interval
    }

    intervals_to_scale (intervals) {
        /*Gets a list of intervals classes. Returns a scale as list of pitch classes.

        Gets [2,2,1,2,2,2,1]
        Return [0,2,4,5,7,9,11]

        Parameters
        ----------
        intervals : list


        Returns
        -------
        list
            scale as pitch classes
        */
        let pcs = [0]

        intervals.forEach((interval) => {
            pcs.push(interval+pcs[pcs.length-1])
        })
        return pcs
    }

    make(min_step=1,max_step=4,min_sizes=2,max_sizes=3, EDO = this) {
        /*Generates all possible necklaces based on input parameters.

            Generates all possible necklaces based on input parameters and stores then in the scales attribute.

            Attributes
            ----------
            scales : list
                list containing all scales as their own lists



            Parameters
            ----------
            min_step : int
                The smallest step that can be used to form scales. If min_step=3, no scale will contain
                intervals smaller than 3 (so no intervals of size 2, or 1 will be found in any scale)
            max_step : int
                The largest step that can be used to form scales. If max_step=3, no scale will contain
                intervals larger than 3 (so no intervals of size >3 will be found in any scale)
            min_sizes : int
                The minimal amount of variety in step size needed to make a scale. if min_sizes=2, then
                scales with step sizes that belong to fewer than 2 interval classes will not be included.

                In the case of min_sizes=2, the following scales will be excluded: [0,1,2,3,4,5,6,7,8,9,10,11],
                [0,2,4,6,8,10], [0,3,6,9], etc.
            max_sizes : int
                The maximal amount of variety in step size allowed to make a scale. if max_sizes=2, then
                scales that use more than 2 step sizes will be excluded.

                In the case of max_sizes=2, the following scale will be excluded: [0,1,4,5,7,10,11], because
                it has >2 (3) step sizes. step size=1 between 0 and 1, step size=2 between 5 and 7,
                and step size = 3 between 1 and 4.
            */

        //get all unique combinations of size s from set of intervals set
        const calc_comb = function (s,set) {
            let solutions = []
            for (let i=0;i<set.length;i++) {
                let n=set[i]
                let m = Math.floor(s/n) //Max times n fits in s
                if(s/n==m && set.length==1) solutions.push(Array(m).fill(n))
                let new_set = [...set]
                new_set.splice(i,1)
                if(new_set.length>0) {
                    for(let k=m; k!=0; k--) {
                        let new_sum = s-(k*n)
                        if(new_sum>0) {
                            let new_result = calc_comb(new_sum,new_set)
                            if(new_result.length>0) {
                                for(let r=0;r<new_result.length;r++) {
                                    let solution = Array(k).fill(n).concat(new_result[r].flat())
                                    solution.sort()
                                    solutions.push(solution)
                                }
                            }
                        }
                    }
                }


            }
            return list_to_unique(solutions)
        }

        //returns all possible step sizes based on the min_step and max_step parameters
        const get_step_sizes = function (min_step,max_step) {
            let step_sizes = []
            for(let i=max_step;i!=min_step-1;i--) {
                step_sizes.push(i)
            }
            return step_sizes
        }

        //returns all possible step combination between min_sizes and max_sized from step_sizes
        const get_interval_combinations = function (min_sizes,max_sizes,step_sizes) {
            let step_combinations = []
            for (let window_size = min_sizes;window_size<=max_sizes;window_size++) {
                step_combinations = step_combinations.concat(combinations(step_sizes,window_size))
            }
            return step_combinations
        }

        //get the unique interval partitions for each set of possible interval combinations
        const unique_for_all = function (interval_combinations) {
            let collection = []
            interval_combinations.forEach((combo)=>{
                let unique_step_combination = calc_comb(EDO.edo,combo)
                if(unique_step_combination.length>0) {
                    collection = collection.concat(unique_step_combination)
                }
            })
            return collection
        }

        //make all possible necklaces out of interval combinations given in [combos]
        const make_all_necklaces = function (combos) {
            let all_necklaces = []
            for (let i=0;i<combos.length;i++) {
                let combo = combos[i]
                let necklaces = EDO.make_necklace(combo)
                all_necklaces = all_necklaces.concat(necklaces)
            }
            return all_necklaces

        }

        const get_all_scales = function (all_necklaces) {
            let all_scales = []

            all_necklaces.forEach((necklace) => {
                all_scales.push(EDO.intervals_to_scale(necklace))
                })
            return all_scales
        }

        let step_sizes = get_step_sizes(min_step,max_step)

        let interval_combinations = get_interval_combinations(min_sizes,max_sizes,step_sizes)
        let combos = unique_for_all(interval_combinations)

        let all_necklaces = make_all_necklaces(combos)

        let _scales = get_all_scales(all_necklaces)
        let scales = new Set()
        _scales.forEach((scale) => scales.add(scale))
        return scales
        

    }

    make_necklace(lst) {
        let necklaces = []
        let unique_steps = list_to_unique(lst)
        let map = {}
        let n = []
        unique_steps.forEach((step,i)=>{
            map[i]=step
            let count = lst.reduce((t,el)=>{
               return (el==step) ? t+1 : t
            },0)
            n.push(count)
        })
        let mynecklace = new FixedContentNecklace(n)

        let result = Array.from(mynecklace.execute('fast'))

        result.forEach((entry)=> {
            let new_arr = entry.map((el)=>map[el])
            necklaces.push(new_arr)
        })
        return necklaces
    }



}

let edo = new EDO(5)
scales = edo.make(1,3,2,3)
scales.forEach((scale) => {
    console.log(scale)
})


