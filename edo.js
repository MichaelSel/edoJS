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
const is_element_of = (arr,bigger_arr) => {
    if(arr.length==0 || bigger_arr.length ==0) return false
    arr = JSON.stringify(arr)
    arr2 = JSON.stringify(bigger_arr)
    return arr2.indexOf(arr)!=-1
}
const mod = (n, m) => {
    return ((n % m) + m) % m;
}
const unique_in_array = (list) => {

    let unique  = new Set(list.map(JSON.stringify));
    unique = Array.from(unique).map(JSON.parse);

    return unique
}
const array_compare = (arr1,arr2) => {
    arr1 = JSON.stringify(arr1)
    arr2 = JSON.stringify(arr2)
    return arr1==arr2
}
const primes_in_range = (upper=17,lower=2) => {
    let primes = []
    for(let num=lower;num<=upper;num++) {
        if(num>1) {
            for(let i=2;i<num;i++) {
                if(num%i==0) break
                else primes.push(num)
            }
        }
    }
    return primes
}

class EDO {

    // self = this

    constructor(edo=12) {
        this.edo = edo
        this.cents_per_step = (12 / edo) * 100
        this.M3s = this.ratio_to_interval(5 / 4, 20)
        this.m3s = this.ratio_to_interval(6 / 5, 20)
        this.P5s = this.ratio_to_interval(3 / 2, 5)
        this.edo_divisors = get_divisors(edo)
        this.catalog = {}

    }

    ratio_to_interval(ratio,tolerance=10) {
        let intervals = []
        let cents = this.ratio_to_cents(ratio)
        for (let i = 0; i < this.edo; i++) {
            let interval = this.interval_to_cents(i)
            if (Math.abs(interval - cents) <= tolerance) intervals.push(i)
            else if (intervals.length > 0) break
        }
        return intervals
    }

    ratio_to_cents(ratio) {
        return 1200*Math.log2(ratio)
    }

    to_steps(lst,cache=true) {
        if(!this.catalog[String(lst)]) this.catalog[String(lst)] = {}
        if(this.catalog[String(lst)]['steps']) return this.catalog[String(lst)]['steps']

        let s = [...lst]
        let intervals = []
        for(let i=0;i<s.length-1;i++) {
            intervals.push(s[i + 1] - s[i])
        }
        if(cache) this.catalog[String(lst)]['steps'] = intervals
        return intervals
    }

    invert (scale,cache=true) {
        /*Inverts the intervals of the collection*/
        if(!this.catalog[String(scale)]) this.catalog[String(scale)] = {}
        if(this.catalog[String(scale)]['inverted']) return this.catalog[String(scale)]['inverted']

        let steps = this.to_steps(scale)
        let r_steps = [...steps]
        r_steps.reverse()
        r_steps = r_steps.slice(1).concat(r_steps.slice(0,1))

        let i_scale = this.intervals_to_scale(r_steps)
        if(cache) this.catalog[String(scale)]['inverted'] = i_scale
        return i_scale
    }

    interval_to_cents (interval) {
        return this.cents_per_step*interval
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

    interval_to_ratio (interval) {
        return Math.pow(2,interval/this.edo)
    }

    cents_to_ratio (cents) {
        return Math.pow(2,cents/1200)
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
                                    solution.sort((a,b) => a-b)
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
        let scales = []
        _scales.forEach((scale) => scales.push(new Scale(scale,this)))
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

    name_to_scale(name) {
        name = name.split('-')
        let edo = name[0]
        name = name[1]
        if(edo!=this.edo) return "Wrong edo"

        let vector = []
        for (let i=edo;i>0;i--) {
            let nw = Math.pow(2,i)
            if(nw>name) continue
            vector.push(i)
            name-=nw
        }
        vector.push(0)
        vector.reverse()
        return this.scale(vector)
    }


    put_in_normal_order(lst,cache=true) {
        let edo = this.edo
        if(!this.catalog[String(lst)]) this.catalog[String(lst)] = {}
        if(this.catalog[String(lst)]['normal_order']) return this.catalog[String(lst)]['normal_order']



        let pitches = []
        lst.forEach((pitch) => {
            pitches.push(pitch % this.edo)
        })


        pitches = unique_in_array(pitches)

        pitches.sort((a,b) => a-b)
        let modes = this.get_modes(pitches)
        let organize = function (modes) {
            let smallest = edo
            let filtered_modes = []
            modes.forEach(mode => {
                if(mode[mode.length-1]<smallest) smallest = mode[mode.length-1]
            })
            modes.forEach(mode => {
                if(mode[mode.length-1]==smallest) filtered_modes.push(mode)
            })
            if(filtered_modes.length==1) return filtered_modes[0]
            else {
                let last = filtered_modes[0][filtered_modes[0].length-1]
                let truncated_modes = filtered_modes.map((mode) => {
                    return mode.slice(0,-1)
                })
                let normal_order = organize(truncated_modes)
                normal_order.push(last)
                return normal_order
            }
            return 0
        }

        let result = organize(modes)
        if(cache) {
            this.catalog[String(lst)]['normal_order'] = result
        }
        return result
    }

    get_modes(scale,cache=true) {
        let edo = this.edo
        if(!this.catalog[String(scale)]) this.catalog[String(scale)] = {}
        if(this.catalog[String(scale)]['modes']) return this.catalog[String(scale)]['modes']



        let length = scale.length
        let doubled = scale.concat(scale)


        let modes = []

        for(let i=0; i<length;i++) {
            let shift = this.edo - doubled[i]
            let mode = doubled.slice(i,i+length)
            mode = mode.map((el)=>(el+shift)%this.edo)
            modes.push(mode)
        }

        modes = unique_in_array(modes)
        if(cache) this.catalog[String(scale)]['modes'] = modes
        return modes
    }

    count_common_tones(list1,list2) {
        let common_tones = 0
        for(let note of list2) {
            if(list1.indexOf(note)!=-1) common_tones++
        }
        return common_tones
    }

    get_simple_ratios (limit=17,cache=true) {
        let primes = primes_in_range(limit)
        let ratios = {}
        for(let i=2;i<limit+1;i++) {
            for(let j=1;j<i;j++) {
                if(((primes.indexOf(i)<0) && (primes.indexOf(j)<0)) || (i%2==0 && j%2==0) || (i%j==0 && j>2)) continue
                ratios[String(i) + '/' + String(j)] = {cents: this.ratio_to_cents(i/j), value:i/j}
            }
        }
        return ratios
    }

    find_approx_ratio (interval,limit=17) {
        /*find closest ratio within a given limit*/
        let closest_ratio = 0
        let closest_name = ""
        let numeric = 0
        let interval_in_cents = this.interval_to_cents(interval)
        let ratios = this.get_simple_ratios(limit=limit)
        for(let ratio in ratios) {
            let side_a = Math.abs(ratios[ratio]['cents']-interval_in_cents)
            let side_b = Math.abs(interval_in_cents-closest_ratio)
            if(side_a<side_b) {
                closest_ratio = ratios[ratio]['cents']
                closest_name = ratio
                numeric = ratios[ratio]['value']
            }
        }
        return {ratio: closest_name, cents_offset: interval_in_cents-closest_ratio, decimal: numeric}
    }

    scale (pitches) {
        return new Scale(pitches,this)
    }

    permute (inputArr) {
        let result = [];

        const do_it = (arr, m = []) => {
            if (arr.length === 0) {
                result.push(m)
            } else {
                for (let i = 0; i < arr.length; i++) {
                    let curr = arr.slice();
                    let next = curr.splice(i, 1);
                    do_it(curr.slice(), m.concat(next))
                }
            }
        }

        do_it(inputArr)

        return result;
    }

    is_subset  (thing,thing2) {
        /*returns True if thing is a subset of thing2*/

        for(let note of thing) {
            if(thing2.indexOf(note)==-1) return false
        }
        return true
    }

    find_motives(melody) {
        /*Returns every repeating pattern in a given set of pitches (melody)*/

        let seen = []
        let motives = []

        const subfinder = function (mylist,pattern) {
            let matches = []
            for(let i=0;i<mylist.length;i++) {
                if(array_compare(mylist[i],pattern[0]) && array_compare(mylist.slice(i,i+pattern.length),pattern)) {
                    matches.push(pattern)
                }
            }
            return matches
        }

        for(let window=1;window<melody.length/2+1;window++) {
            for(let i=0;i<melody.length-(2*window) +1;i++) {
                let motive = melody.slice(i,i+window)
                if(!is_element_of(motive,seen)) {
                    let incidence = subfinder(melody,motive).length
                    if(incidence>1) {
                        motives.push([motive,incidence])
                        seen.push(motive)
                    }
                }
            }
        }
        motives.sort(function (a, b) {
            return b[0].length - a[0].length || b[1] - a[1] ;
        });
        return motives
    }



    stack_intervals (intervals, stack_size=3,as_pitches=false) {
        /*makes every stacking combination of intervals from 'intervals' up to "height" stack_size.

        For instance, given the intervals [2,3] and stack_size = 3, the function will return a list of lists
        such that every list will be of length 3 (stack_size) containing an exhaustive list of every
        combination using the intervals 2 and 3 (in this case).
        As such, it will return  [[2, 2, 2], [2, 2, 3], [2, 3, 2], [3, 2, 2], [2, 3, 3], [3, 2, 3],
        [3, 3, 2], [3, 3, 3]] which represents every combination or 2s and 3s in any order of length 3.

        if as_pitches is set to True, instead of returning the list of intervals classes of length 3, it
        will return a list of pitches starting from 0 (which can go above 11). If set to True the function
        will return  [[0, 2, 4, 6], [0, 2, 4, 7], [0, 2, 5, 7], [0, 3, 5, 7], [0, 2, 5, 8], [0, 3, 5, 8],
        [0, 3, 6, 8], [0, 3, 6, 9]]


        Parameters
        ----------
        intervals : list
            the intervals be used
        stack_size : int
            the size of the stack of pitches.
        as_pitches : bool (optional)
            Indicates whether the returned result represents interval classes or pitches


        Returns
        -------
        list of lists
            a list of interval classes or pitches
        */

        const decToBase = (n,b) => {
            if(n==0) return [0]
            let digits= []
            while(n) {
                digits.push(n%b)
                n = Math.floor(n/b)
            }
            digits.reverse()
            return digits
        }

        let all_perm = []
        intervals = unique_in_array(intervals)
        let base = intervals.length
        let mapping = {}
        let result = []
        for(let i=0;i<intervals.length;i++) mapping[i]=intervals[i]
        let max = base ** stack_size
        for(let i=0;i<max;i++) {
            let res = decToBase(i,base)
            let fill_in = stack_size - res.length
            fill_in = Array(fill_in).fill(0)
            all_perm.push([...fill_in,...res])
        }
        for(let vector of all_perm) {
            result.push(vector.map((el) => mapping[el]))
        }
        result.sort((a,b) => a.reduce((t,e)=>t+e) - b.reduce((t,e)=>t+e))
        if(as_pitches) {
            let pitches = []
            for (let l of result) {
                let ls = [0]
                for(let item of l) {
                    ls.push(ls[ls.length-1]+item)
                }
                pitches.push(ls)
            }
            result=pitches
        }
        return result
    }

    path_on_tree (intervals,path,starting_pitch=0) {
        /*Climbs up a interval "fractal" tree and returns the path taken

        In an interval tree where each branch adds (or subtracts) an interval recursively.
        For instance, such a tree could have 2 interval branches. One "on the left" adding -3 to the current
        pitch, and the one "on the right" adding +2 to the current pitch.
        If you climbed this tree using some path, for instance "left, left, right, left, right, right", you
        will in essence move -3 -3 +2 -3 +2 +2 such that if you start with pitch class 0 you get:
        0 -3 -6 -4 -7 -5 -3 which if we ignore octave (i.e. indicate pitch classes) we get: 0 9 6 8 5 7 9.


        Parameters
        ----------
        intervals : list
            the "branches" coming out of each node on the tree. For instance, [3,-3,2] would represent a
            tree with three branches coming out of each node, the leftmost is +3 the middle one is -3, and
            the rightmost one is +2.
        path : list
            the indication of how to traverse the tree. The list contains the indexes of the branch to be
            climbed at each itiration. so [0,0,1,1,2] would mean go up the leftmost branch twice, then go
            up the middle branch twice, finally go up the rightmost branch once (Note, this example uses
            three branches, but there could be any number of branches).
        starting_pitch : int (optional)
            Indicates the starting pitch of the tree (the pitch to be added to rather than starting at 0).


        Returns
        -------
        list
            the path
        */

        let result = [starting_pitch]
        for (let branch of path) {
            result.push(result[result.length-1]+intervals[branch]) //adds the interval at index=branch to the last value stored.
        }
        return result
    }

    shortest_path (destination,up_interval=1,down_interval=-1) {
        /*
        * Finds the required operation to get to a destination note using given intervals

        Finds the shortest path towards a given note (destination) by starting on note 0,
        and moving up only using the "up_interval", or down using the "down_interval".
        For instance, for the path from 0 to -4, by only moving up by minor 3rds (3) and down by perfect
        5ths (-7), the function will return [3,3,3,3,3,3,-7,-7] which is the shortest way to get from 0
        to -4 using only these intervals.

        Note: the order of the intervals is mutable and can be jumbled up at will without harming the
        result. In the example given, as long as there are six 3s and two -7s. the sum will be -4. So
        there is potential for permutations.


        Parameters
        ----------
        destination : int
            the destination note. This is an int that represents some interval away from 0.
        up_interval : int (optional)
            the interval used to move upwards
        down_interval : int (optional)
            the interval used to move downwards


        Returns
        -------
        list
            a sorted list of the intervals needed to reach the destination starting from 0.*/

        down_interval = -Math.abs(down_interval)
        up_interval = Math.abs(up_interval)
        let steps = 0
        let up = []
        let down = []
        let total = 0
        while(total!=destination && steps<100) {
            total = [...up,...down].reduce((t,e)=>e+t,0)
            steps++
            if(total<destination) up.push(up_interval)
            else if(total>destination) down.push(down_interval)
        }
        if(total!=destination) return null
        return [...up,...down]
    }

    count_pitches(pitches) {
        /*Returns the number of occurrences for every PC present in "pitches"

        E.g. [0,3,3,2,4,3,4] will return tuples order with most common to list common pitch such:
        [(3,3),(4,2), (2,1), (0,1)]*/

        let counts = []
        let unique = new Set(pitches)
        for (let pitch of unique) {
            let count = pitches.reduce((t,e)=>{
                if(e==pitch) return t+1
                else return t
            },0)
            counts.push([pitch,count])
        }
        counts.sort((a,b)=>b[1]-a[1])
        return counts
    }

}

class Scale {
    constructor(pitches,parent) {
        this.parent = parent
        this.catalog = {}

        let smallest = Math.min.apply(Math,pitches)
        let diff_from_zero = 0-smallest

        this.pitches = pitches.map((pitch) => pitch+diff_from_zero)
        this.edo = this.parent.edo
        this.pitches = this.pitches.map((pitch) => pitch%parent.edo)
        this.pitches = unique_in_array(this.pitches)
        this.pitches.sort((a, b) => a-b)

        this.name = this.get.name()
    }

    count = {
        P5s: () => {
            /*Returns the number of Perfect Fifths (with a tolerance of 5 cents) in the scale

            To count other intervals or set a different tolerance use Scale.count_ratio()*/
            return this.count.interval(this.parent.P5s)
        },
        M3s: () => {
            /*Returns the number of Major Thirds (with a tolerance of 20 cents) in the scale

            To count other intervals or set a different tolerance use Scale.count_ratio()*/
            return this.count.interval(this.parent.M3s)
        },
        m3s: () => {
            /*Returns the number of Minor Thirds (with a tolerance of 20 cents) in the scale

            To count other intervals or set a different tolerance use Scale.count_ratio()*/
            return this.count.interval(this.parent.m3s)
        },
        thirds: () => {
            /* Returns the number of Major and Minor Thirds (with a tolerance of 20 cents) in the scale

            To count other intervals or set a different tolerance use Scale.count_ratio()*/
            return this.count.interval(this.parent.M3s.concat(this.parent.m3s))
        },
        pitches: () => {
            /*Returns the number of pitches in the scale*/
            return this.pitches.length
        },
        rotational_symmetries: () => {
            /*Returns the number of rotational symmetries in the scale*/

            return this.edo / this.count.transpositions()
        },
        modes: () => {
        /*Returns the number of unique modes in the scale

        E.g. returns 7 for the major scale, and 1 for the whole tone scale*/
        return this.get.modes().length
        },
        major_minor_triads: () => {
            /*Returns the number of major and minor (sounding) triads in the scale

            For other chord qualities use a combination of Scale.count_chord_quality() and self.gen.ratio_to_interval()*/
            return this.count.chord_quality([this.parent.M3s,this.parent.P5s]) + this.count.chord_quality([this.parent.m3s,this.parent.P5s])

        },
        interval: (interval) => {
            /*Returns the number of intervals of size IC in the scale*/
            let scale = this.pitches
            let count = 0
            for(let note of scale) {
                for (let int of interval) {

                    if(scale.indexOf((note+int)% this.edo)  !=-1) count++
                }
            }


            return count
        },
        transpositions: (cache=true) => {
            /*Returns number of unique transpositions available for the scale*/
            if(this.catalog['# transpositions']) return this.catalog['# transpositions']
            let scale = this.pitches
            let scales = [scale]
            for(let i=0;i<this.parent.edo;i++) {
                let t_scale = []
                scale.forEach((note) => {
                    t_scale.push((note+i+1) % this.edo)
                })
                t_scale.sort((a,b) => a-b)
                if(is_element_of(t_scale,scales)) return scales.length
                scales.push(t_scale)

            }
            let result = scales.length
            if(cache) this.catalog['# transpositions'] = result
            return result

        },
        imperfections: (tolerance=10,cache=true) => {
            /*Returns the number of imperfections (notes that do not have a P5 above them) in the scale*/
            if(this.catalog['# imperfections']) return this.catalog['# imperfections']

            let scale = this.pitches
            let imperfections = 0
            let valid_intervals = []
            let p5 = this.parent.ratio_to_cents(3/2)
            for(let i=1;i<this.edo;i++) {
                if(Math.abs(this.parent.interval_to_cents(i)-p5)<=tolerance) valid_intervals.push(i)
                else if(valid_intervals.length>0) break
            }
            let octavescale = scale.map((note) => note+this.edo)
            let doublescale = scale.concat(octavescale)
            scale.forEach((note) => {
                let valid =false

                valid_intervals.forEach((interval) => {
                    if(doublescale.indexOf(note+interval)!=-1) valid=true

                })
                if(!valid) imperfections++
            })
            if(cache) this.catalog['# imperfections'] = imperfections
            return imperfections

        },
        chord_quality: (intervals) => {
            /*Returns the number of times a certain chord quality (specific in PCs above the root) exists in the scale
            e.g. intervals = [4,7,11] counts the number of times a major 7th (if in 12 TET) appears in a scale*/

            let scale = this.pitches
            let count=0
            let modes = this.get.modes()
            let exists = false
            let valid = true
            loop1:
                for(let i=0;i<modes.length;i++){
                    let mode = modes[i]
                    valid = true
                    loop2:
                        for(let j=0;j<intervals.length;j++) {
                            let interval = intervals[j]
                            if(Array.isArray(interval)) {
                                exists = interval.map((int) => mode.indexOf(int)!=-1)

                            }
                            else {exists = [mode.indexOf(interval)!=-1]}
                            if(exists.indexOf(true)==-1) {
                                valid=false
                                break loop2
                            }
                        }
                    if(valid) count++
                }
            return count
        },
        trichords: () => {
            /*Returns the number of unique trichords available in the scale*/
            return this.get.trichords().length
        },
        tetrachords: () => {
            /*Returns the number of unique tetrachords available in the scale*/
            return this.get.tetrachords().length
        },
        ratio: (ratio,tolerance=10) => {
            /*Counts how many times some ratio appears in the scale within a given tolerance*/
            let intervals = this.parent.ratio_to_interval(ratio,tolerance)
            return this.count.interval(intervals)
        },
        simple_ratios: (limit=17,tolerance=15) => {
            let ratios = this.parent.get_simple_ratios(limit=limit)
            let unique = 0
            let total = 0
            for (let ratio in ratios) {
                let result = this.count.ratio(ratios[ratio]['value'],tolerance)
                if(result>0) {
                    unique++
                    total+=result
                }
            }
            return {discrete:unique,instances: total}
        },
        consecutive_steps: (size) => {
            /*Returns the maximal number of consecutive steps of size 'size'*/
            let counts = []
            let steps = this.to.steps()
            steps = [...steps,...steps]
            if(steps.indexOf(size)==-1) return 0
            let sequences = []
            let count = 0
            for (let step of steps) {
                if(step==size) count++
                else {
                    counts.push(count)
                    count=0
                }
            }
            counts = counts.sort((a,b) => b-a)
            let result = counts[0]
            result = Math.min.apply(Math,[result,this.edo])
            return result

        }
    }
    get = {
        name: () => {
            /*
            :return:
                The name of the scale in the form TET-Code, TET being the number of divisions of the octave in the
                current system, and code being the binary value of the scale (see example below)
                For simplicity consider a system with 4 divisions. Such a system has 4 possible pitches: [0,1,2,3].
                The scale vector is a binary representation of the PCs used in the scale in reversed order. So the scale
                [0,2] would have a representation of [0,1,0,1]
                                                     [  2   0]
                As such, the name for this scale will be 4-5
                */
            let normal = this.to.normal_order()
            let total = 0
            normal.forEach((i) => {
                total+=Math.pow(2,i)
            })
            return String(this.parent.edo) + "-" + String(parseInt(total))


        },
        modes: (cache=true) => {
            /*Returns all the various modes (normalized to 0, that include all pitches) available from this scale

            :param cache:
            :return:*/

            if(this.catalog['modes']) return this.catalog['modes']

            let modes = this.parent.get_modes(this.pitches)
            if(cache) return this.catalog['modes'] = modes
            return modes
        },
        pitches: () => {
            /*Returns the scale's pitchs as pitch classes*/
            return this.pitches
        },
        interval_vector: (cache=true) => {
            /*Returns the interval vector of the scale*/
            if(this.catalog['interval vector']) return this.catalog['interval vector']
            let scale = this.pitches
            let vector = []
            let intervals = {}
            for(let i=0;i<this.edo-1;i++) {
                intervals[i+1] = 0
            }
            let length = scale.length
            let doublescale = scale.concat(scale)
            scale.forEach((note,i)=> {
                for(let j=0; j<length-1;j++) {
                    let interval = (doublescale[i+j+1]-doublescale[i]) % this.edo
                    intervals[interval] +=1
                }
            })
            for(let i=0;i<Math.floor(this.edo/2);i++) {
                vector.push(intervals[i+1])
            }
            if(cache) this.catalog['interval vector'] =vector
            return vector



        },
        trichords: (cache=true) => {
            /*
            Returns a list of every trichord (normalized to 0) available in this scale.

            :param cache:
            :return:
            */
            if(this.catalog['trichords']) return this.catalog['trichords']
            let scale = this.pitches
            let trichords = []
            let modes = this.get.modes()
            modes.forEach((mode) => {
                let int1 =0
                for(let int2 = 1;int2<mode.length-1;int2++) {
                    for(let int3 = int2+1;int3<mode.length;int3++) {
                        let trichord = [mode[int1],mode[int2],mode[int3]]
                        trichords.push(this.parent.put_in_normal_order(trichord))
                    }
                }
            })
            trichords = unique_in_array(trichords)
            if(cache) this.catalog['trichords'] = trichords
            return trichords

        },
        tetrachords: (cache=true) => {
            /*
            Returns a list of every tetrachord (normalized to 0) available in this scale.

            :param cache:
            :return:
            */
            if(this.catalog['tetrachords']) return this.catalog['tetrachords']

            let scale = this.pitches
            let tetrachords = []
            let modes = this.get.modes()
            modes.forEach((mode) => {
                let int1 =0
                for(let int2 = 1;int2<mode.length-2;int2++) {
                    for(let int3 = int2+1;int3<mode.length-1;int3++) {
                        for(let int4 = int3+1;int4<mode.length;int4++) {
                            let tetrachord = [mode[int1],mode[int2],mode[int3],mode[int4]]
                            tetrachords.push(this.parent.put_in_normal_order(tetrachord))
                        }
                    }
                }
            })
            tetrachords = unique_in_array(tetrachords)
            if(cache) this.catalog['tetrachords'] = tetrachords
            return tetrachords
        },
        stacks: (levels,skip) => {
            /*Returns a list of lists of size "levels" made out of scale degrees with "skip" steps skipped apart.

            E.g in [0,2,4,5,7,9,11] in 12-TET levels = 3 (number of pitches per stack)
            and skip=1 (number of scale degrees skipped between pitches) the function returns all the triads available
            in the major tonality as  [[0, 3, 6], [0, 3, 7], [0, 4, 7]].

            To get all quartal qualities, instead of skip=1, skip should be set to equal to 2. (C, skipping D, and E, and selecting F, etc.)*/

            let scale = this.pitches

            let diapason = ((skip+1)*(levels-1))+1
            let modes = this.get.modes()
            let stacks = []
            modes.forEach((mode) => {
                let notes = []
                for (let i=0;i<diapason;i+=skip+1) {
                    notes.push(mode[i%mode.length])
                }
                let temp = new Set(notes)
                if(temp.size==levels) stacks.push(notes)
            })
            stacks = unique_in_array(stacks)
            return stacks
        },
        common_tone_transpositions: (normalize=true) => {
            /*Returns all the transpositions of the scale that share a common tone with the original scale
            As well the the number of notes altered to get from the original scale to the new scale as a Tuple*/

            let transpositions = []
            let intervals = this.to.steps()
            intervals=intervals.slice(0,-1) //removing the last step because we don't need the octave completion
            for (let note of this.pitches) {
                let transposition = [note]
                for(let interval of intervals) {
                    let next_note = mod(transposition.slice(-1)[0]+interval,this.edo)
                    transposition.push(next_note)
                }
                if(normalize) transposition.sort((a,b)=>a-b)
                let CT = this.count.pitches() - this.parent.count_common_tones(this.pitches,transposition)
                transpositions.push([transposition,CT])
            }
            transpositions.sort((a,b) =>a[1]-b[1])
            return transpositions

        },
        supersets: (scales) => {
            let sets = []
            for (let scale of scales) {
                let modes = this.parent.get_modes(scale)
                for(let mode of modes) {
                    if(this.is.subset(mode)) sets.push(scale)
                }
            }
            return sets
        },
        rotations: () => {
            /*Returns all of the rotations of the scale (not normalized to 0).

            To get the rorations normalized to zero (the modes) use Scale.get_modes()*/
            let rotations = []
            let rotate = [...this.pitches]
            while (!is_element_of(rotate,rotations)) {
                rotations.push(rotate)
                rotate = [...rotate.slice(1),...rotate.slice(0,1)]
            }
            return rotations
        },
        permutations: () => {
            /*Returns every ordering (permutation) of notes in the scale*/

            return this.parent.permute(this.pitches)
        },
        position_of_quality: (intervals) => {
            /*Gets a list of intervals about a root, and returns all the positions in the scale where this
            chord quality can be created

            E.g in [0,2,4,5,7,9,11] intervals = [4,7] (major triad) will return [0,5,7] because you can construct a major
            triad on 0, 5, and 7.*/

            let result = []
            let double_scale = [...this.pitches,...this.pitches]

            for(let pitch of this.pitches) {
                let int = intervals.map((interval)=> (interval+pitch)%this.edo)
                let s = [...int]
                if(this.parent.is_subset(s,double_scale)) result.push(pitch)
            }
            return result


        },
        lerdahl_attraction: (note1,note2) => {
            /*Calculates the attraction between note1 to note2 according to Lerdahl's formula in TPS*/
            if(note1==note2) return 0
            note1 = {pitch:note1}
            note2 = {pitch:note2}

            // first we check which level each pitch belongs to:
            // 1 if C, 2 if E or G, and 3 for everything else

            const get_note_anchoring_strength = (note) => {
                if(note==0) return 4
                else {
                    if(this.parent.P5s.indexOf(note)>=0 || this.parent.M3s.indexOf(note)>=0)  return 3
                    else return 1
                }
            }

            note1.anchoring = get_note_anchoring_strength(note1.pitch)
            note2.anchoring = get_note_anchoring_strength(note2.pitch)

            let dist = Math.abs(note1.pitch-note2.pitch)
            if(dist>this.edo/2) dist = this.edo-dist
            dist = dist*12/this.edo

            //if neither note is more stable
            if(note2.anchoring==note1.anchoring) return 0

            // original Lerdahl uses square of distance.
            // return (note2['anchoring']/note1['anchoring'])*(1/math.pow(dist,2))
            // I find that omitting the square generalizes better
            return (note2.anchoring/note1.anchoring)*(1/dist)
        },
        lerdahl_attraction_vector: () =>{
            /*
            see @lerdahl_attraction
            Returns a graphic vector showing the tendencies of each note in the scale
            [*,<<,>>,*,<>,*,etc.]
            */
            let vector = []
            for (let i=0; i<this.pitches.length;i++) {
                let note = this.pitches[i]
                let ln = this.pitches[mod(i-1,this.pitches.length)]
                let un = this.pitches[mod(i+1,this.pitches.length)]
                ln = this.get.lerdahl_attraction(note,ln)
                un = this.get.lerdahl_attraction(note,un)
                if(ln<1 && un<1) vector.push('*')
                else if(ln<1 && un>=1) vector.push('>>')
                else if(ln>=1 && un<1) vector.push('<<')
                else if(ln>=1 && un>=1) vector.push('<>')
            }
            return vector

        },
        step_sizes: (cache=true) => {
            /*Convert the scales PCs into a list of ICs representing the size of each step in the scale*/
            if(this.catalog['step sizes']) return this.catalog['step sizes']
            let lst = unique_in_array(this.to.steps())
            lst.sort((a,b) => a-b)
            if(cache) this.catalog['step sizes'] = lst
            return lst


        },
        least_step_multiplier: () => {
            /*the smallest multiplier between the sizes of steps

            E.g in [0,1,4,5,7,8,11] there are 3 kinds of steps 1,2, and 3.
            2 is a multiplier of 2 over 1. 3 is a multiplier of 3 over one and 1.5 over two.
            Therefore, the function will return 1.5.*/
            let steps= this.get.step_sizes()
            if(steps.length==1) return 1
            let size = this.edo
            for(let i=0;i<steps.length-1;i++) {
                if(steps[i+1]/steps[i]<size) size = steps[i+1]/steps[i]
            }
            return size
        },
        rothenberg_propriety : (cache=true) => {
            if(this.catalog['rothenberg']) return this.catalog['rothenberg']

            let scale = this.pitches
            let map = []
            let steps = Array(scale.length-1).fill(0).map((el,i) => i+1)
            let intervals = this.to.steps()
            steps.forEach((step) => {
                let double_intervals = intervals.concat(intervals)
                let interval_classes = []
                for(let i=0;i<intervals.length;i++) {
                    let sli = double_intervals.slice(i,i+step)
                    sli = sli.reduce((t,e) => t+e)
                    interval_classes.push(sli)
                }
                map.push({min:Math.min.apply(Math,interval_classes),max:Math.max.apply(Math,interval_classes)})
            })
            let strictly_proper = true
            let proper = true
            for(let i=1;i<map.length;i++) {
                if (map[i]['min'] <= map[i - 1]['max']) strictly_proper = false
                if (map[i]['min'] < map[i - 1]['max']) proper = false
            }

            let result = ""
            if(strictly_proper) result="strictly proper"
            else if (proper) result = "proper"
            else result = "improper"
            if(cache) this.catalog['rothenberg'] = result
            return result
        },
        levenshtein: (t,ratio_calc=false) => {
            /*Returns the Levenshtein distance of the scale to another scale*/

            /*levenshtein_ratio_and_distance:
            Calculates levenshtein distance between two strings.
            If ratio_calc = True, the function computes the
            levenshtein distance ratio of similarity between two strings
            For all i and j, distance[i,j] will contain the Levenshtein
            distance between the first i characters of s and the
            first j characters of t*/


            let s = this.pitches

            //initialize matrix with 0

            let rows = s.length+1
            let cols = t.length+1
            let distance = Array.from({length: rows}, e => Array(cols).fill(0));
            let col
            let row
            //Populate matrix of zeros with the indices of each character of both strings
            for(let i=1;i<rows;i++) {
                for(let k=1;k<cols;k++) {

                    distance[i][0] = i
                    distance[0][k] = k
                }
            }

            // Iterate over the matrix to compute the cost of deletions,insertions and/or substitutions
            let cost = 0
            for(col=1; col<cols;col++) {
                for(row=1;row<rows;row++) {
                    if(s[row-1] == t[col-1]) cost=0 //If the characters are the same in the two strings in a given position [i,j] then the cost is 0
                    else {
                        // In order to align the results with those of the Python Levenshtein package, if we choose to calculate the ratio
                        // the cost of a substitution is 2. If we calculate just distance, then the cost of a substitution is 1.
                        if(ratio_calc) cost=2
                        else cost=1
                    }
                    let res = Math.min.apply(Math,[distance[row - 1][col] + 1,distance[row][col - 1] + 1,distance[row - 1][col - 1] + cost])
                    distance[row][col] = res
                }
            }
            if(ratio_calc) {
                let Ratio = ((s.length+ t.length) - distance[row][col]) / (s.length + t.length)
                return Ratio
            } else {
                return distance[s.length][t.length]
            }
        }
    }
    to = {
        steps: (cache=true) => {
            /*Instead of PCs, this returns the scale represented by intervals*/
            if(this.catalog['steps']) return this.catalog['steps']

            let intervals = this.parent.to_steps(this.pitches.concat([this.edo]),cache=false)
            if(cache) this.catalog['steps'] = intervals
            return intervals
        },
        prime_form: (cache=true) => {
            /*Returns the scale in prime form*/
            if(this.catalog['prime form']) return this.catalog['prime form']
            let i_self = this.parent.scale(this.to.inverted())
            let norm_ord = this.parent.scale(this.to.normal_order())
            let i_norm_ord = this.parent.scale(i_self.to.normal_order())
            let scale_steps = norm_ord.to.steps()
            let i_scale_steps = i_norm_ord.to.steps()
            let result = norm_ord.pitches
            for(let i=0;i<scale_steps.length;i++) {
                if(scale_steps[i]<i_scale_steps[i]) {
                    result=norm_ord.pitches
                    break
                }
                else if(scale_steps[i]>i_scale_steps[i]) {
                    result=i_norm_ord.pitches
                    break
                }

            }
            if(cache) this.catalog['prime form'] = result
            return result
        },
        inverted: (cache=true) => {
            /*Inverts the intervals of the scale*/
            if(this.catalog['inverted']) return this.catalog['inverted']

            let scale = this.parent.invert(this.pitches,cache=false)
            if(cache) this.catalog['inverted'] = scale

            return scale
        },
        normal_order:  (cache=true) => {
            /*
            Returns the scale in normal order

            :param cache:
            :return:
            */
            if(this.catalog['normal_order']) return this.catalog['normal_order']

            let lst = this.pitches
            let result = this.parent.put_in_normal_order(lst,cache=false)

            if(cache) this.catalog['normal_order'] = result
            return result

        },
        cents: () => {
            /*Returns the scale's representation in cents [0,100,300, etc.]*/
            return this.pitches.map((note) => note*this.parent.cents_per_step)
        }

    }
    is = {
        normal_order: () => {
            /*Returns True if the scale is in normal order and False if it isn't*/
            return array_compare(this.pitches,this.to.normal_order())
        },
        one_of: (scales) => {
            /*Checks if the scale (as a whole!) is one of the scales given in a list of scales (and all of their modes)*/
            let scale = this.pitches
            let all_modes = scales.map((item) => this.parent.get_modes(item))
            all_modes = all_modes.flat(1)
            if(is_element_of(scale,all_modes)) return true
            return false
        },
        prime_form: () => {
            /*Returns True if the scale is in prime form and False if it isn't*/
            return array_compare(this.pitches,this.to.prime_form())
        },
        invertible: (cache=true) => {
            /*Returns True if the scale is invertible and False if it isn't*/
            if(this.catalog['invertible']) return this.catalog['invertible']

            let scale=this.to.normal_order()
            let i_scale = this.parent.scale(this.to.inverted()).to.normal_order()
            let result = true
            if(array_compare(scale,i_scale)) result=false
            if(cache) this.catalog['invertible']=result
            return result
        },
        subset: (scales) => {
            /*returns True if the scale is a subset of one of multiple scales provided*/
            const is_subset_of_one = function (scale1,scale2) {
                for(let note of scale1) {
                    if(scale2.indexOf(note)==-1) return false
                }
                return true
            }
            if(!Array.isArray(scales[0])) scales=[scales]
            for (let scale of scales) {
                if(is_subset_of_one(this.pitches,scale)) return true
            }
            return false
        },
        in_lower_edos: (cache=true) => {
            /*Returns a list of (lower-order) EDOs if the scale can be represented in them
            For instance 12-EDO [0,3,6,9] also exists in in 4-EDO as [0,1,2,3]. Therefore the function will return [4]*/

            if(this.catalog['lower EDOs']) return this.catalog['lower EDOs']
            let scale = this.pitches
            let edos = []
            for(let divisor of this.parent.edo_divisors) {
                let valid = true
                for (let note of scale) {
                    if(note%divisor!=0) {
                        valid=false
                        break
                    }
                }
                if(valid) edos.push(parseInt(this.edo/divisor))
            }
            if(cache) this.catalog['lower EDOs'] = edos
            return edos

        }
    }
}


let edo = new EDO(12)
// let scale = edo.scale([0,1,4,5,7,8,11])
let scale = edo.scale([0,1,2])



// console.log(edo.interval_to_ratio(7))
// console.log(edo.find_approx_ratio(7))
// console.log(edo.name_to_scale('12-1495'))
// console.log(edo.stack_intervals([2,3],3,true))
// console.log(edo.path_on_tree([2,3,4],[0,1,0,1,1,1,2]))
// console.log(edo.shortest_path(7,3,-8))
// console.log(edo.count_pitches([0,3,3,2,4,3,4]))
console.log(edo.find_motives([0,1,3,0,1,3,4,3,4,0,1,0,1]))


// console.log(scale.count.transpositions())
// console.log(scale.count.imperfections())
// console.log(scale.count.interval([3,4]))
// console.log(scale.count.P5s())
// console.log(scale.count.M3s())
// console.log(scale.count.m3s())
// console.log(scale.count.thirds())
// console.log(scale.count.pitches())
// console.log(scale.count.rotational_symmetries())
// console.log(scale.count.modes())
// console.log(scale.count.chord_quality([0,[3,4],7]))
// console.log(scale.count.major_minor_triads())
// console.log(scale.count.trichords())
// console.log(scale.count.tetrachords())
// console.log(scale.count.ratio(5/4,30))
// console.log(scale.count.simple_ratios())
// console.log(scale.count.consecutive_steps(1))
//
// console.log(scale.get.name())
// console.log(scale.get.modes())
// console.log(scale.get.pitches())
// console.log(scale.get.interval_vector())
// console.log(scale.get.trichords())
// console.log(scale.get.tetrachords())
// console.log(scale.get.stacks(3, 1))
// console.log(scale.get.common_tone_transpositions())
// console.log(scale.get.supersets([[0,1,2,3,4,5,6,7],[0,3,4,7],[0,1,2]]))
// console.log(scale.get.rotations())
// console.log(scale.get.permutations())
// console.log(scale.get.position_of_quality([0,4,7]))
// console.log(scale.get.lerdahl_attraction(4,0))
// console.log(scale.get.lerdahl_attraction_vector())
// console.log(scale.get.least_step_multiplier())
// console.log(scale.get.step_sizes())
// console.log(scale.get.rothenberg_propriety())
// console.log(scale.get.levenshtein([0,1,2]))
//
// console.log(scale.to.steps())
// console.log(scale.to.prime_form())
// console.log(scale.to.inverted())
// console.log(scale.to.normal_order())
// console.log(scale.to.cents())
//
// console.log(scale.is.one_of([[0,1,4,5,7,8,11],[1,3,5,7,9,10]]))
// console.log(scale.is.normal_order())
// console.log(scale.is.prime_form())
// console.log(scale.is.invertible())
// console.log(scale.is.subset([[0,1,4,5,7,8,9],[0,1,4,5,7,8,11]]))
// console.log(scale.is.in_lower_edos())



