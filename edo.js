const fs = require('fs');

class FixedContentNecklace {
    constructor(number_list) {
        /*
        Class FixedContentNecklace Init Method

            :param number_list: A list of integers

        */
        // Force negative numbers to zero
        for (let i=0;i <number_list.length;i++) {
            if(number_list[i]<0) number_list[i]=0
        }
        this.n_init = number_list
        this.N = number_list.reduce((t,n)=> n+t)
        this.k = number_list.length
        this.initialize()
    }
    initialize(method='simple') {
        /*
        Determines what method algorithm to use in the generation

            :param method: The name of the method/algorithm to use
        */
        this.occurrence = [...this.n_init]
        this.word = Array(this.N).fill(0)
        this.alphabet = Array(this.k).fill(0)
        this.alphabet = this.alphabet.map((el,i,arr)=>i)
        this.run = Array (this.N).fill(0)
        this.first_letter = 0
        this.last_letter = this.k - 1


        this.__set_letter_bounds(method)

        if (method != 'simple') {
            this.word = [this.word[0]].concat(Array(this.N - 1).fill(this.last_letter))
        }

    }
    __set_letter_bounds(method) {
        /*
        Assign the first letter with nonzero occurrence to word[0], short-circuiting the search to the
        letter to put there during the algorithm, and finds the last nonzero letter

            :param method: The name of the method/algorithm to use

        */
        let found_first_nonzero = false
        for (let letter=0;letter<this.k;letter++) {
            if  (!found_first_nonzero &&  this.occurrence[letter] > 0) {
                found_first_nonzero = true
                this.occurrence[letter] -= 1
                this.word[0] = letter
                this.first_letter = letter
            }

            // remove any letters with zero occurrence from the alphabet so that
            // we automatically skip them
            if (method != 'simple') {
                if (this.occurrence[letter] == 0) {
                    this.__remove_letter(letter)
                }
            }
        }
        this.last_letter = (!this.alphabet) ? 0 : Math.max.apply(Math,this.alphabet)
    }
    * execute(method="simple") {
        /*
        Runs the algorithm that's passed to `method`

        :param method: The method/algorithm to execute

        */



        this.initialize(method)
        if (method == 'simple') {
            yield* this._simple_fixed_content(2, 1)
        }
        else if(method == 'fast') {
            yield* this._fast_fixed_content(2, 1, 2)
        }


    }
    * _simple_fixed_content(t,p) {
        /*
        The simple algorithm

        :param t: ?
        :param p: ?

        */
        if (t > this.N) { // if the prenecklace is complete
            if (this.N % p == 0) { // if the prenecklace word is a necklace
                yield [...this.word]
            }
        }
        else {
            for(let letter = this.word[t-p-1];letter<this.k;letter++) {
                if(this.occurrence[letter]>0) {
                    this.word[t-1]=letter
                    this.occurrence[letter] -=1
                    if(letter==this.word[t-p-1]) {
                        yield* this._simple_fixed_content(t+1, p)
                    }
                    else {
                        yield* this._simple_fixed_content(t+1, t)
                    }
                    this.occurrence[letter]+=1
                }
            }
        }
    }
    * _fast_fixed_content(t,p,s){
        let i_removed
        /*
        The fast algorithm
        */
        if(this.occurrence[this.last_letter]==this.N -t +1) {
            if( this.occurrence[this.last_letter]==this.run[t-p-1]) {
                if(this.N % p ==0) {
                    yield [...this.word]
                }
            }
            else if(this.occurrence[this.last_letter]>this.run[t-p-1]) {
                yield [...this.word]
            }
        }
        else if(this.occurrence[this.first_letter] != this.N-t+1) {
            let letter = Math.max.apply(Math,this.alphabet)
            let i = this.alphabet.length-1
            let s_current = s
            while (letter >= this.word[t-p-1]) {
                this.run[parseInt(s-1)] = parseInt(t-s)
                this.word[t-1] = letter
                this.occurrence[letter] -=1
                if(!this.occurrence[letter]) {
                    i_removed = this.__remove_letter(letter)
                }
                if(letter != this.last_letter) {
                    s_current = t+1
                }
                if(letter == this.word[t-p-1]) {
                    yield* this._fast_fixed_content(t+1,p,s_current)
                }
                else {
                    yield* this._fast_fixed_content(t+1,t,s_current)
                }
                if(!this.occurrence[letter]) {
                    this.__add_letter(i_removed,letter)
                }
                this.occurrence[letter] += 1
                i -=1
                letter = this.__get_letter(i)
            }
            this.word[t-1] = this.last_letter
        }
    }
    __remove_letter(letter) {
        let index = this.alphabet.indexOf(letter)
        this.alphabet.splice(index,1)
        return index
    }
    __add_letter(index,letter) {
        this.alphabet.splice(index,0,letter)
    }
    __get_letter (index) {
        return (index<0)?-1: this.alphabet[index]
    }
}
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
        this.M3s = this.convert.ratio_to_interval(5 / 4, 20)
        this.m3s = this.convert.ratio_to_interval(6 / 5, 20)
        this.P5s = this.convert.ratio_to_interval(3 / 2, 5)
        this.edo_divisors = get_divisors(edo)
        this.catalog = {}

    }


    scale (pitches) {
        return new Scale(pitches,this)
    }

    count = {
        pitches: (pitches) => {
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
        },
        common_tones : (list1,list2) => {
            let common_tones = 0
            for(let note of list2) {
                if(list1.indexOf(note)!=-1) common_tones++
            }
            return common_tones
        },
    }
    is = {
        subset:  (thing,thing2) => {
            /*returns True if thing is a subset of thing2*/

            for(let note of thing) {
                if(thing2.indexOf(note)==-1) return false
            }
            return true
        }
    }
    get = {
        permutations : (inputArr) => {
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
        },
        subset_indices: (find=[0,2,3], arr = [0,0,2,0,2,3,3],allow_skips=true) => {
            /*Gets a subset to find and returns the indices from a given array (arr) that form that subset
            *
            * For instance if we are looking for [0,2,3] in the array [0,0,2,0,2,3,3], and allow_skips=true the function
            * will return
            *               [
                              [ 0, 2, 5 ], [ 0, 2, 6 ],
                              [ 0, 4, 5 ], [ 0, 4, 6 ],
                              [ 1, 2, 5 ], [ 1, 2, 6 ],
                              [ 1, 4, 5 ], [ 1, 4, 6 ],
                              [ 3, 4, 5 ], [ 3, 4, 6 ]
                            ]
            * Which are all the ways to form [0,2,3] from arr (in order)
            *
            * If allow_skips=false the function will return [[3,4,5]] which is the only way to form [0,2,3] without
            * skipping elements
            * */
            let paths = []

            const run_it_with_skips = function (find,arr,path=[],ind=0) {
                if(find.length==0) return path
                let find_this = find[0]
                for (let i = ind; i < arr.length; i++) {
                    if(arr[i]==find_this) {
                        let res = run_it_with_skips(find.slice(1),arr,[...path,i],i+1)
                        if(res) paths.push(res)
                    }
                }
            }

            const run_it_no_skips = function (find,arr) {
                loop1:
                for (let i = 0; i < arr.length - (find.length-1); i++) {
                    loop2:
                    for (let j = 0; j < find.length; j++) {
                        if(find[j]!=arr[i+j]) continue loop1
                        if(j==find.length-1) {
                            let arr = new Array(find.length).fill(0)
                            arr.forEach((el,ind)=>arr[ind]=i+ind)
                            paths.push(arr)

                        }
                    }
                }

            }
            if(allow_skips) run_it_with_skips(find,arr)
            else run_it_no_skips (find,arr)

            return paths
        },
        motives: (melody,intervalic=true, allow_skips=false) => {
            /*
            * Extracts every possible "motive" from a "melody".
            * A motive can be intervalic (default) such that it looks at the intervals rather than the pitch classes
            * The function also keeps track of the number of times each motive appeared.
            * For instance, [7,7,7,3] in intervalic mode, the function will return []
            *
            * */



            let motives = []
            if(!intervalic) {
                let all_subsets = unique_in_array(this.get.subsets(melody,allow_skips))
                all_subsets.forEach((subset) => {
                    let incidence = this.get.subset_indices(subset,melody,allow_skips).length
                    motives.push({motive:subset,incidence:incidence})
                })
            } else {
                let all_subsets = this.get.subsets(melody,allow_skips).map((subset)=>this.convert.to_steps(subset))
                let unique_subsets = unique_in_array(all_subsets)

                motives = unique_subsets.map((subset)=>{
                    let count = 0
                    for (let i = 0; i < all_subsets.length; i++) {
                        if(array_compare(subset,all_subsets[i])) count++
                    }
                    return {motive:subset,incidence:count}
                })
            }


            motives = motives.filter((motive)=>motive.motive.length>0)
            motives = motives.sort((a,b)=> b.incidence-a.incidence || b.motive.length-a.motive.length)

            return motives
        },
        motives_diatonic: (melody, scale,allow_skips=false) => {
            /*
            * Same as get.motives() only instead of considering pitches as pitch classes, it looks at them as scale degrees
            * As such, in the scale [0,2,4,5,7,9,11], [0,2,4] and [2,4,5] are considered the same motive
            * This is because while the former has steps of size [2,2] and the latter  [2,1] they both represent moving
            * 2 scale degrees up step wise in the scale [1,1]*/
            let not_in_scale = melody.filter((note)=>scale.indexOf(note)==-1)
            if(not_in_scale.length>0) return null
            scale = unique_in_array(scale).sort((a,b)=>a-b)

            let scale_degrees=melody.map((note)=>scale.indexOf(note)+1)
            let motives = this.get.motives(scale_degrees,true,allow_skips)
            return motives

        },
        simple_ratios: (limit=17,cache=true) => {
            let primes = primes_in_range(limit)
            let ratios = {}
            for(let i=2;i<limit+1;i++) {
                for(let j=1;j<i;j++) {
                    if(((primes.indexOf(i)<0) && (primes.indexOf(j)<0)) || (i%2==0 && j%2==0) || (i%j==0 && j>2)) continue
                    ratios[String(i) + '/' + String(j)] = {cents: this.convert.ratio_to_cents(i/j), value:i/j}
                }
            }
            return ratios
        },
        invertion: (scale,cache=true) => {
            /*Inverts the intervals of the collection*/
            if(!this.catalog[String(scale)]) this.catalog[String(scale)] = {}
            if(this.catalog[String(scale)]['inverted']) return this.catalog[String(scale)]['inverted']

            let steps = this.convert.to_steps(scale)
            let r_steps = [...steps]
            r_steps.reverse()
            r_steps = r_steps.slice(1).concat(r_steps.slice(0,1))

            let i_scale = this.convert.intervals_to_scale(r_steps)
            if(cache) this.catalog[String(scale)]['inverted'] = i_scale
            return i_scale
        },
        normal_order: (lst,cache=true) => {
            let edo = this.edo
            if(!this.catalog[String(lst)]) this.catalog[String(lst)] = {}
            if(this.catalog[String(lst)]['normal_order']) return this.catalog[String(lst)]['normal_order']



            let pitches = []
            lst.forEach((pitch) => {
                pitches.push(pitch % this.edo)
            })


            pitches = unique_in_array(pitches)

            pitches.sort((a,b) => a-b)
            let modes = this.get.modes(pitches)
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
        },
        modes: (scale,cache=true) => {
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
        },
        path_on_tree: (intervals,path,starting_pitch=0) =>{
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
        },
        shortest_path: (destination,up_interval=[3,4],down_interval=[-1,-2], used = [],life_span=10) => {
            /*
            * Finds the required operation to get to a destination note using given intervals

            Finds the shortest path towards a given note (destination) by starting on note 0,
            and moving up only using the "up_interval(s)", or down using the "down_interval(s)".
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





            const shortest_path_single_up_down = function  (destination,up_interval=1,down_interval=-1,max_length=10) {
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
                while(total!=destination && steps<max_length) {
                    total = [...up,...down].reduce((t,e)=>e+t,0)
                    steps++
                    if(total<destination) up.push(up_interval)
                    else if(total>destination) down.push(down_interval)
                }
                if(total!=destination) return null
                return [...up,...down]
            }


            if(!Array.isArray(up_interval) && !Array.isArray(down_interval)) {
                return shortest_path_single_up_down(destination,up_interval,down_interval,life_span)

            }
            else {
                if(!Array.isArray(up_interval)) up_interval=[up_interval]
                if(!Array.isArray(down_interval)) down_interval=[down_interval]
            }

            let paths = []
            const shortest_path_array = function (destination,up_interval=[3,4],down_interval=[-1,-2], used = [],life_span=10) {
                if(life_span<0) return null

                let sum = used.reduce((a,b)=>a+b,0)
                if(sum==destination && (paths.length==0 || paths.length>used.length)) {
                    paths=[...used]
                    return
                }
                else if (sum==destination && (paths.length!=0 || paths.length<=used.length)) {
                    return
                }

                if(sum<destination) {
                    for(let num of up_interval) {
                        shortest_path_array(destination,up_interval,down_interval,used.concat([num]),life_span-1)
                    }
                }
                else if(sum>destination) {
                    for(let num of down_interval) {
                        shortest_path_array(destination,up_interval,down_interval,used.concat([num]),life_span-1)
                    }
                }

            }


            shortest_path_array(destination,up_interval,down_interval, used,life_span)
            // paths = paths.sort((a,b)=>a.length-b.length)

            return paths

        },
        path_n_steps: (destination,motives=[],n_steps=8) => {
            /*
            * returns all the ways to reach a destination pitch by providing a set of motives  and a number of steps
            * For instance, if the destination is 3, the motives (a single interval in this case) are 3 and -3 and the number of steps is 3,
            * the function will output [3,3,-3]
            * */
            const up_motives = motives.filter((m)=>this.get.motive_interval_shift(m)>0)
            const down_motives = motives.filter((m)=>this.get.motive_interval_shift(m)<0)
            const static_motives = motives.filter((m)=>this.get.motive_interval_shift(m)==0)
            let success = []
            const run_it = function (used=[]) {
                let sum = used.flat().reduce((t,e)=>t+e,0)
                let length = used.flat().length
                if(length>n_steps || (length==n_steps && sum!=destination)) return null
                if(length==n_steps && sum==destination) return used
                if(sum<destination) {
                    for(let i=0;i<up_motives.length;i++) {
                        let result = run_it(used.concat([up_motives[i]]))

                        if(result!=null) success.push(result)
                    }
                }
                else if(sum>destination) {
                    for(let i=0;i<down_motives.length;i++) {
                        let result = run_it(used.concat([down_motives[i]]))
                        if(result!=null) success.push(result)
                    }
                }
                for(let i=0;i<static_motives.length;i++) {
                    let result = run_it(used.concat([static_motives[i]]))
                    if(result!=null) success.push(result)
                }

            }
            run_it()

            return unique_in_array(success)
        },
        scales:(min_step=1,max_step=4,min_sizes=2,max_sizes=3, EDO = this) => {
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
                return unique_in_array(solutions)
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
                    let necklaces = EDO.get.necklace(combo)
                    all_necklaces = all_necklaces.concat(necklaces)
                }
                return all_necklaces

            }

            const get_all_scales = function (all_necklaces) {
                let all_scales = []

                all_necklaces.forEach((necklace) => {
                    all_scales.push(EDO.convert.intervals_to_scale(necklace))
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


        },
        necklace:(lst) => {
            let necklaces = []
            let unique_steps = unique_in_array(lst)
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
        },
        interval_stack: (intervals, stack_size=3,as_pitches=false) => {
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
        },
        ratio_approximation: (interval,limit=17) =>{
            /*find closest ratio within a given limit*/
            let closest_ratio = 0
            let closest_name = ""
            let numeric = 0
            let interval_in_cents = this.convert.interval_to_cents(interval)
            let ratios = this.get.simple_ratios(limit=limit)
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
        },
        motive_interval_shift: (pitches) => {
            /*Gets an array of intervals in order, and returns the interval traversed by the end of the motive
             */
            return pitches.reduce((t,e)=>t+e)
        },
        subsets: (pitches,allow_skips=true) => {
            /*Returns all the subsets from a given array of pitches.
            * The subsets respect order.
            * If allow_skips=true the function will return subsets that require skipping over items as well
            *
            *
            * In that case for [0,2,3] the returned subsets are [0] [2] [3] [0,2] [0,3] [2,3] [0,2,3]
            * but if allow_skips=false, [0,3] will not be included because this subset skips 2*/

            if(allow_skips) {
                pitches = pitches.reduce(
                    (subsets, value) => subsets.concat(
                        subsets.map(set => [...set, value])
                    ),
                    [[]]
                )
            } else {
                let subsets = []
                for (let window = 1; window < pitches.length+1; window++) {
                    for (let i = 0; i < pitches.length - window+1; i++) {
                        subsets.push(pitches.slice(i,i+window))
                    }
                }
                pitches=subsets
            }

            pitches = pitches.filter((el)=>el.length>0)
            return pitches
        },
        contour: (pitches,local=false) => {
            /* returns a vector describing the contour of the given pitches.

            If local is set to true, every cell in the vector will be
            either 1 if note n is higher than n-1, 0 if note n is the same as n-1, and -1 if note n is lower than n-1
            For instance [0,0,4,7,4,7,4,0] will in local mode will return [0,1,1,-1,1,-1,-1]

            if local is set to false (default), the contour of the line is expressed such that the actual pc class of the
            note is removed but its relative position in regards to the entire line is keps.
            [0,4,7,12,16,7,12,16] (Bach prelude in C) has 5 distinct note heights, so it will return
            [0,1,2,3, 4, 2,3, 4] indicating the relative height of each note in the entire phrase
            * */

            if(local) {
                let vector = []
                for (let i = 1; i < pitches.length; i++) {
                    if(pitches[i]>pitches[i-1]) vector.push(1)
                    else if(pitches[i]==pitches[i-1]) vector.push(0)
                    else vector.push(-1)
                }
                return vector
            } else {
                let catalog = {}
                let unique_pitches = unique_in_array(pitches)
                unique_pitches = unique_pitches.sort((a,b)=>a-b)
                for (let i = 0; i < unique_pitches.length; i++) {
                    catalog[unique_pitches[i]]=i
                }

                let vector = pitches.map((pitch)=>catalog[pitch])
                return vector
            }

        },
        pitch_distribution: (pitches) => {
            let unique = unique_in_array(pitches)


            let dist = unique.map((el)=>{return {note:el,rate: pitches.filter(x => x==el).length/pitches.length}})
            dist = dist.sort((a,b)=>b.rate-a.rate)
            return dist
        }
    }
    convert = {
        to_steps: (lst,cache=true) => {
            if(!this.catalog[String(lst)]) this.catalog[String(lst)] = {}
            if(this.catalog[String(lst)]['steps']) return this.catalog[String(lst)]['steps']

            let s = [...lst]
            let intervals = []
            for(let i=0;i<s.length-1;i++) {
                intervals.push(s[i + 1] - s[i])
            }
            if(cache) this.catalog[String(lst)]['steps'] = intervals
            return intervals
        },
        name_to_scale: (name) => {
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
        },
        ratio_to_interval:(ratio,tolerance=10) => {
            let intervals = []
            let cents = this.convert.ratio_to_cents(ratio)
            for (let i = 0; i < this.edo; i++) {
                let interval = this.convert.interval_to_cents(i)
                if (Math.abs(interval - cents) <= tolerance) intervals.push(i)
                else if (intervals.length > 0) break
            }
            return intervals
        },
        ratio_to_cents: (ratio) => {
            return 1200*Math.log2(ratio)
        },
        interval_to_cents: (interval) => {
            return this.cents_per_step*interval
        },
        intervals_to_scale: (intervals) => {
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
        },
        interval_to_ratio: (interval) => {
            return Math.pow(2,interval/this.edo)
        },
        cents_to_ratio: (cents) => {
            return Math.pow(2,cents/1200)
        },
        midi_to_name: (note_number,offset=0) => {
            /*Given a midi note code as an integer, returns its note name and octave disposition (e.g C4 for 60).*/

            //only supports 12 edo, so it returns the input if in other edo
            if(this.edo!=12) return note_number

            //If it's an array of notes
            if(Array.isArray(note_number)) {
                return note_number.map((a) => this.convert.midi_to_name(a,offset))
            }
            else {
                note_number=note_number+offset
                let octave = Math.floor(note_number/12)-1
                let note_name = this.convert.pc_to_name(mod(note_number,12))
                return note_name.trim() + octave
            }


        },
        pc_to_name: (pc) => {
            /*Given a pitch class as an int, returns its name (e.g G for 7)*/

            let PC = {
                0: 'C ',
                1: 'C#',
                2: 'D ',
                3: 'Eb',
                4: 'E ',
                5: 'F ',
                6: 'F#',
                7: 'G ',
                8: 'Ab',
                9: 'A ',
                10: 'Bb',
                11: 'B ',
                '*': '**'
            }
            return PC[pc]
        },
        intervals_to_pitches: (intervals,starting_pitch=0,modulus=undefined) => {

            /*Given a list of intervals (or list of lists), returns pitches made with the intervals
            starting from starting_pitch*/
            let pitches
            if(modulus) pitches = [mod(starting_pitch,modulus)]
            else pitches=[starting_pitch]
            for(let interval of intervals) {
                if(Array.isArray(interval)) {
                    starting_pitch = pitches.flat()[pitches.flat().length-1]
                    let result = this.convert.intervals_to_pitches(interval,starting_pitch)
                    result=result.slice(1)
                    pitches.push(result)
                }
                else {
                    if(modulus) pitches.push(mod(parseInt(pitches[pitches.length-1])+parseInt(interval)),modulus)
                    else pitches.push(parseInt(pitches[pitches.length-1])+parseInt(interval))
                }
            }
            return pitches
        },
        midi_to_intervals: (midi) => {
            let intervals = []
            for(let i=0;i<midi.length-1;i++) {
                intervals.push(midi[i+1]-midi[i])
            }
            return intervals
        }
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
            let p5 = this.parent.convert.ratio_to_cents(3/2)
            for(let i=1;i<this.edo;i++) {
                if(Math.abs(this.parent.convert.interval_to_cents(i)-p5)<=tolerance) valid_intervals.push(i)
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
            let intervals = this.parent.convert.ratio_to_interval(ratio,tolerance)
            return this.count.interval(intervals)
        },
        simple_ratios: (limit=17,tolerance=15) => {
            let ratios = this.parent.get.simple_ratios(limit=limit)
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

            let modes = this.parent.get.modes(this.pitches)
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
                        trichords.push(this.parent.get.normal_order(trichord))
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
                            tetrachords.push(this.parent.get.normal_order(tetrachord))
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
                let CT = this.count.pitches() - this.parent.count.common_tones(this.pitches,transposition)
                transpositions.push([transposition,CT])
            }
            transpositions.sort((a,b) =>a[1]-b[1])
            return transpositions

        },
        supersets: (scales) => {
            let sets = []
            for (let scale of scales) {
                let modes = this.parent.get.modes(scale)
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

            return this.parent.get.permutations(this.pitches)
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
                if(this.parent.is.subset(s,double_scale)) result.push(pitch)
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
        },
        shortest_path: (destination_scale_degree,up_steps=1,down_steps=-1) => {
            /*same as EDO.shortest_path only for diatonic cases
            Instead of thinking in "intervals" it thinks in steps and scale degrees.
            so in the context of C major, moving from E to G is a move of size 3 (scale degrees),
            and from C to E is also 3 (scale degrees) eventhough in once case it's a minor third and in
            the other its a Major third.

            In this function the starting point is scale_degree 1
            */
            let temp_edo = new EDO(this.count.pitches())
            let result = temp_edo.get.shortest_path(destination_scale_degree-1,up_steps,down_steps)
            console.log(result)

        }
    }
    to = {
        steps: (cache=true) => {
            /*Instead of PCs, this returns the scale represented by intervals*/
            if(this.catalog['steps']) return this.catalog['steps']

            let intervals = this.parent.convert.to_steps(this.pitches.concat([this.edo]),cache=false)
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

            let scale = this.parent.get.invertion(this.pitches,cache=false)
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
            let result = this.parent.get.normal_order(lst,cache=false)

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
            let all_modes = scales.map((item) => this.parent.get.modes(item))
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
    export = {
        scala: (dir="scala/",filename=undefined) => {
            let scale_name = this.get.name()
            filename = filename || scale_name + ".scl"
            let file = "! " + filename + "\n"
            file += "!\n" + scale_name + " " + JSON.stringify(this.get.pitches()) + "\n"
            file += String(this.count.pitches()+1) + "\n!\n"
            let scale_in_cents = this.to.cents()
            for(let pitch of scale_in_cents) {
                file+= String(pitch) + "\n"
            }
            file+="2/1"
            fs.writeFile(dir + filename, file, function(err) {
                if(err) {
                    return console.log(err);
                }
            });
        }
    }
}
module.exports = EDO


let edo = new EDO(24)

let scale = edo.scale([0,1,4,5,8,11,14,15,18,21])
console.log(scale.export.scala())



// console.log(edo.convert.interval_to_ratio(7))
// console.log(edo.convert.name_to_scale('12-1495'))
//
// console.log(edo.get.ratio_approximation(7))
// console.log(edo.get.interval_stack([2,3],3,true))
// console.log(edo.get.path_on_tree([2,3,4],[0,1,0,1,1,1,2]))
// console.log(edo.get.motives([0,1,3,0,1,3,4,3,4,0,1,0,1]))
// console.log(edo.get.shortest_path(-5,[3,4],[-7]))
// console.log(edo.get.shortest_path(7,3,-8))
// console.log(edo.get.scales(1,3,2,3))
//
// console.log(edo.count.pitches([0,3,3,2,4,3,4]))
//
//
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
// console.log(scale.get.shortest_path(2,2,-1))
//
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


