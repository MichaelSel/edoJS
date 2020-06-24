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

/** Class representing some EDO tuning system. */
class EDO {

    /**
     * <p>Creates a tuning context and system that exposes powerful functions for manipulating, analyzing, and generating music.</p>
     * <p>This is the main class of the project. At its center stand 4 collections (see "Namespaces" below) of functions.</p>
     * <ul>
     *  <li> [EDO.convert]{@link EDO#convert} is a set of functions used to change between equivalent representations within the tuning context.</li>
     *  <li> [EDO.count]{@link EDO#count} is a set of functions used to count stuff.</li>
     *  <li> [EDO.get]{@link EDO#get} is a set of functions used to manipulate and generate stuff.</li>
     *  <li> [EDO.is]{@link EDO#is} is a set of functions used for boolean truth statements.</li></ul>
     * @param {number} edo - The number of equal divisions of the octave.
     * @example
     * //Basic usage:
     * let edo = new EDO(12) //create a new EDO context with 12 divisions.
     *
     * //once the object has been created, you can access its functions.
     * edo.get.inversion([0,2,4,5,7,9,11]) //inverts the pitches
     * //returns [0, 2,  4, 6, 7, 9, 11]
     *
     * edo.convert.ratio_to_interval(3/2)
     * //returns [7]
     *
     * edo.count.pitches([0, 3, 3, 2, 4, 3, 4])
     * //returns [[3,3],[4,2], [2,1], [0,1]] (3 appears 3 times, 4 appears 2 times, etc.)
     *
     * edo.is.subset([2,4],[1,2,3,4,5])
     * //returns true (the set [2,4] IS a subset of [1,2,3,4,5])
     */
    constructor(edo=12) {
        this.edo = edo
        this.cents_per_step = (12 / edo) * 100
        this.M3s = this.convert.ratio_to_interval(5 / 4, 20)
        this.m3s = this.convert.ratio_to_interval(6 / 5, 20)
        this.P5s = this.convert.ratio_to_interval(3 / 2, 5)
        this.edo_divisors = this.get.divisors(edo)
        this.catalog = {}

    }

    /**
     * Returns a new Scale Object with given pitches
     * @param  {Array<Number>} pitches - a collection of pitch classes
     * @return {Scale}
     */
    scale (pitches) {
        return new Scale(pitches,this)
    }


    /**A collection of functions that return an amount
     * @namespace EDO#count*/
    count = {
        /**
         * Returns the pitch and the number of its occurrences as a tuple for every unique value in pitches
         * @param  {Array<Number>} pitches - a collection of pitches (not necessarily pitch classes)
         * @example
         * let edo = new EDO(12) // define a tuning system
         * edo.count.pitches([0, 3, 3, 2, 4, 3, 4])
         * // returns [[3,3],[4,2], [2,1], [0,1]] (3 appears 3 times, 4 appears 2 times, etc.)
         * @return {Array<Number>} A pitch, and how many times it appears
         * @memberOf EDO#count
         */
        pitches: (pitches) => {
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

        /**
         * Returns the number of commons tones between two collections of pitches
         * @param  {Array<Number>} list1 - a collection of pitches (not necessarily pitch classes)
         * @param  {Array<Number>} list2 - a collection of pitches (not necessarily pitch classes)
         * @return {Number} The number of common tones between the two lists
         * @memberOf EDO#count
         * @example
         * let edo = new EDO(12) // define a tuning system
         * edo.count.common_tones([1,2,4],[2,3,4,5])
         * //returns 2 (because 2 and 4 are in both lists)
         */
        common_tones : (list1,list2) => {
            let common_tones = 0
            for(let note of list2) {
                if(list1.indexOf(note)!=-1) common_tones++
            }
            return common_tones
        },
    }


    /**A collection of functions that return a boolean
     * @namespace EDO#is*/
    is = {
        /**
         * Returns true if some collection of pitches (thing) is a subset of another collection of pitches (thing2)
         * @param  {Array<Number>} thing - a collection of pitches (not necessarily pitch classes)
         * @param  {Array<Number>} thing2 - a collection of pitches (not necessarily pitch classes)
         * @return {Boolean}
         * @memberOf EDO#is
         * @example
         * let edo = new EDO(12) // define a tuning system
         * edo.is.subset([2,4],[1,2,3,4,5])
         * //returns true (the set [2,4] IS a subset of [1,2,3,4,5])
         * @example
         * let edo = new EDO(12) // define a tuning system
         * edo.is.subset([2,4],[1,2,3,5])
         * //returns false (the set [2,4] is NOT a subset of [1,2,3,5])
         */
        subset:  (thing,thing2) => {

            for(let note of thing) {
                if(thing2.indexOf(note)==-1) return false
            }
            return true
        },

        /**
         * Returns True if arr is an element in an array of arrays (bigger_arr)
         * @param  {Array<Number>} arr - a collection of pitches (not necessarily pitch classes)
         * @param  {Array<Array<Number>>} bigger_arr - an array of arrays containing a collection of pitches (not necessarily pitch classes)
         * @return {Boolean}
         * @memberOf EDO#is
         * @example
         * let edo = new EDO(12) // define a tuning system
         * edo.is.subset([2,4],[[1,2,3,4],[1,2,4]])
         * //returns false (the set [2,4] is NOT equal to [1,2,3,4] or to [1,2,4])
         * @example
         * let edo = new EDO(12) // define a tuning system
         * edo.is.subset([2,4],[[1,2,3,4],[1,2,4],[2,4]])
         * //returns true
         */
        element_of: (arr,bigger_arr) => {
            if(arr.length==0 || bigger_arr.length ==0) return false
            arr = JSON.stringify(arr)
            let arr2 = JSON.stringify(bigger_arr)
            return arr2.indexOf(arr)!=-1
        },

        /**
         * Returns True if arr1 equals arr2 in contents and in order.
         * @param  {Array<Number>} arr1 - a collection of pitches (not necessarily pitch classes)
         * @param  {Array<Number>} arr2 - a collection of pitches (not necessarily pitch classes)
         * @return {Boolean}
         * @memberOf EDO#is
         * @example
         * let edo = new EDO(12) // define a tuning system
         * edo.is.same([2,4],[4,2]])
         * //returns false
         *
         * @example
         * //Also supports more complicated structures
         * let edo = new EDO(12) // define a tuning system
         * edo.is.same([2,[4,[1,2,3]]],[2,[4,[1,2,3]]])
         * //returns true
         */
        same: (arr1,arr2) => {
            arr1 = JSON.stringify(arr1)
            arr2 = JSON.stringify(arr2)
            return arr1==arr2
        }
    }

    /**A collection of functions manipulates an input
     * @namespace EDO#get*/
    get = {
        /**
         * Gets an array and returns every possible ordering of that array.
         * @param  {Array<Number>} pitches - (usually) a collection of pitches, but could be used with any type of array
         * @example
         * edo.get.permutations([0, 2, 3])
         * // [[ 0, 2, 3 ],[ 0, 3, 2 ],[ 2, 0, 3 ],[ 2, 3, 0 ],[ 3, 0, 2 ],[ 3, 2, 0 ]]
         * @return {Array<Array<Number>>}
         * @memberOf EDO#get
         */
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

        /**
         * Gets a subset to find and returns the indices from a given array (arr) that form that subset
         * @param  {Array<Number>} find - a collection of pitches to find (in order)
         * @param  {Array<Number>} arr - a bigger collection where we search
         * @param  {Boolean} [allow_skips=true] - if false, the search will only be done on consecutive items
         * @example
         * // returns [[ 0, 2, 5 ], [ 0, 2, 6 ],[ 0, 4, 5 ], [ 0, 4, 6 ],[ 1, 2, 5 ], [ 1, 2, 6 ],[ 1, 4, 5 ], [ 1, 4, 6 ],[ 3, 4, 5 ], [ 3, 4, 6 ]]
         * get.subset_indices([0, 2, 3], [0, 0, 2, 0, 2, 3, 3])
         * @return {Array<Array<Number>>}
         * @memberOf EDO#get
         */
        subset_indices: (find, arr,allow_skips=true) => {
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

        /**
         * <p>Extracts every possible "motive" from a given melody.</p>
         * <p>A motive can be intervalic (default) such that it looks at the intervals rather than the pitch classes.
         * The function also keeps track of the number of times each motive appeared.</p>
         * @param  {Array<Number>} melody - a collection of pitches to find (in order)
         * @param  {Boolean} [intervalic=true] - looks at the intervals rather than the pitch classes.
         * @param  {Boolean} [allow_skips=true] - if false, the search will only be done on consecutive items
         * @return {Array<motives>}
         * @memberOf EDO#get
         * @function
         * @example
         * let edo = new EDO(12) // define a tuning system
         * edo.get.motives([7,6,7,6,7,2,5,3,0]).slice(0,4) //get first 3 motives
         * //returns
         * [
         *   { motive: [ -1, 1 ], incidence: 2 }, //going a half-step down, then up appears twice
         *   { motive: [ -1 ], incidence: 2 }, //going a half-step down appears twice
         *   { motive: [ 1 ], incidence: 2 } //going a half-step up appears twice
         * ]
         */
        motives: (melody,intervalic=true, allow_skips=false) => {
            let motives = []
            if(!intervalic) {
                let all_subsets = unique_in_array(this.get.subsets(melody,allow_skips))
                all_subsets.forEach((subset) => {
                    let incidence = this.get.subset_indices(subset,melody,allow_skips).length
                    motives.push({motive:subset,incidence:incidence})
                })
            } else {
                let all_subsets = this.get.subsets(melody,allow_skips).map((subset)=>this.convert.to_steps(subset))
                let unique_subsets = this.get.unique_elements(all_subsets)

                motives = unique_subsets.map((subset)=>{
                    let count = 0
                    for (let i = 0; i < all_subsets.length; i++) {
                        if(this.is.same(subset,all_subsets[i])) count++
                    }
                    return {motive:subset,incidence:count}
                })
            }


            motives = motives.filter((motive)=>motive.motive.length>0)
            motives = motives.sort((a,b)=> b.incidence-a.incidence || b.motive.length-a.motive.length)

            return motives
        },

        /**
         * <p>Same as [EDO.get.motives()]{@link EDO#get.motives} only instead of considering pitches as pitch classes, it looks at them as scale degrees.</p>
         * <p>As such, in the scale <code>[0,2,4,5,7,9,11]</code>, <code>[0,2,4]</code> and <code>[2,4,5]</code> are considered the same motive
         * This is because while the former has steps of size <code>[2,2]</code> and the latter <code>[2,1]</code> they both represent moving
         * 2 scale degrees up step wise in the scale <code>[1,1]</code>.</p>
         * @param  {Array<Number>} melody - a collection of pitches to find (in order)
         * @param  {Array<Number>} scale - a diatonic context (collection of PCs) for the motive search
         * @param  {Boolean} [allow_skips=true] - if false, the search will only be done on consecutive items
         * @return {Array<motive>}
         * @memberOf EDO#get
         * @see {@link EDO#get.motives}
         * @example
         * let edo = new EDO(12) // define a tuning system
         * let melody = [8,7,7,8,7,7,8,7,7,15,15,14,12,12,10,8,8,7,5,5] // Mozart Symphony no. 40
         * let scale = edo.scale([0,2,3,5,7,8,10]) //natural minor
         * edo.get.motives_diatonic(melody,scale) // find diatonic motives in the melody
         *                      .slice(0,3) //show top 3
         * //returns (motives are represented in change in scale degrees)
         * [
         *  { motive: [ 0 ], incidence: 9 },
         *  { motive: [ -1 ], incidence: 6 },
         *  { motive: [ -1, 0 ], incidence: 5 }
         * ]
         */
        motives_diatonic: (melody, scale,allow_skips=false) => {
            if (scale instanceof Scale) scale = scale.pitches
            let not_in_scale = melody.filter((note)=>scale.indexOf(this.mod(note,this.edo))==-1)
            if(not_in_scale.length>0) return null

            scale = this.get.unique_elements(scale).sort((a,b)=>a-b)

            let scale_degrees=melody.map((note)=>scale.indexOf(note)+1)
            let motives = this.get.motives(scale_degrees,true,allow_skips)
            return motives

        },

        /** Returns simple ratios in fraction form, decimal form, and their representation in cents with a given limit.
         * @param  {Number} [limit=17] - the limit
         * @param  {Boolean} cache - if true, the result will be cached for faster retrival
         * @return {Object}
         * @memberOf EDO#get
         */
        simple_ratios: (limit=17,cache=true) => {
            let primes = this.get.primes_in_range(limit)
            console.log(primes)
            let ratios = {}
            for(let i=2;i<limit+1;i++) {
                for(let j=1;j<i;j++) {
                    if(((primes.indexOf(i)<0) && (primes.indexOf(j)<0)) || (i%2==0 && j%2==0) || (i%j==0 && j>2)) continue
                    ratios[String(i) + '/' + String(j)] = {cents: this.convert.ratio_to_cents(i/j), value:i/j}
                }
            }
            return ratios
        },

        /** Returns the inversion of a given set of pitches
         *
         * @param  {Array<Number>} scale - a collection of pitches (not necessarily PCs)
         * @param  {Boolean} cache - if true, the result will be cached for faster retrival
         * @return {Array<Number>} The inverted input
         * @memberOf EDO#get
         * @example
         * let edo = new EDO(12) // define a tuning system
         * edo.get.inversion([0,2,4,5,7,9,11])
         * //returns [0, 2,  4, 6, 7, 9, 11]*/
        inversion: (scale,cache=true) => {

            if(!this.catalog[String(scale)]) this.catalog[String(scale)] = {}
            if(this.catalog[String(scale)]['inverted']) return this.catalog[String(scale)]['inverted']

            let steps = this.convert.to_steps(scale)
            let r_steps = [...steps]
            r_steps.reverse()

            let i_scale = this.convert.intervals_to_scale(r_steps)
            if(cache) this.catalog[String(scale)]['inverted'] = i_scale
            return i_scale
        },

        /** Returns the normal order of a given set of pitches
         * @param  {Array<Number>} lst - a collection of PCs
         * @param  {Boolean} cache - if true, the result will be cached for faster retrival
         * @return {Array<Number>} The normal order of the input
         * @memberOf EDO#get
         * @example
         * let edo = new EDO(12) //Create a tuning context
         * edo.get.normal_order([0,2,4,5,7,9,11])
         * //returns [0, 1, 2, 3, 5, 6, 8, 10]*/
        normal_order: (lst,cache=true) => {
            let edo = this.edo
            if(!this.catalog[String(lst)]) this.catalog[String(lst)] = {}
            if(this.catalog[String(lst)]['normal_order']) return this.catalog[String(lst)]['normal_order']



            let pitches = []
            lst.forEach((pitch) => {
                pitches.push(pitch % this.edo)
            })


            pitches = this.get.unique_elements(pitches)

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

        /** Returns the normal order of a given set of pitches
         * @param  {Array<Number>} scale - a collection of PCs
         * @param  {Boolean} cache - if true, the result will be cached for faster retrieval
         * @return {Array<Array<Number>>}
         * @memberOf EDO#get
         * @example
         * let edo = new EDO(12) // create a tuning context
         * edo.get.modes([0,2,4,5,7,9,11]) //Major scale
         * //returns
         * [
         *  [0,2,4,5,7,9,11], //Ionian
         *  [0,2,3,5,7,9,10], //Dorian
         *  [0,1,3,5,7,8,10], //Phrigian
         *  [0,2,4,6,7,9,11], //Lydian
         *  [0,2,4,5,7,9,10], //Mixolydian
         *  [0,2,3,5,7,8,10], //Aeolian
         *  [0,1,3,5,6,8,10]  //Locrian
         * ]
         * */
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

            modes = this.get.unique_elements(modes)
            if(cache) this.catalog[String(scale)]['modes'] = modes
            return modes
        },

        /** <p>Returns the path taken (as pitches) after climbing up a interval "fractal" tree.</p>
         *
         * <p>In an interval tree where each branch adds (or subtracts) an interval recursively.
         * For instance, such a tree could have 2 interval branches. One "on the left" adding -3 to the current
         * pitch, and the one "on the right" adding +2 to the current pitch.
         * If you climbed this tree using some path, for instance "left, left, right, left, right, right", you
         * will in essence move <code>[-3, -3, +2, -3, +2, +2]</code> such that if you start with pitch class 0 you get:
         * <code>[0, -3, -6, -4, -7, -5, -3]</code> which if we ignore octave (i.e. indicate pitch classes) we get: <code>[0, 9, 6, 8, 5, 7, 9]</code>.</p>
         *
         *
         * @param  {Array<Number>} intervals - the "branches" coming out of each node on the tree. For instance, <code>[3,-3,2]</code>
         * would represent a tree with three branches coming out of each node, the leftmost is +3 the middle one is -3,
         * and the rightmost one is +2.
         *
         * @param  {Array<Number>} path - the indication of how to traverse the tree. The list contains the indexes of
         * the branch to be climbed at each iteration. so <code>[0,0,1,1,2]</code> would mean go up the leftmost branch twice,
         * then go up the middle branch twice, finally go up the rightmost branch once (Note, this example uses
         * three branches, but there could be any number of branches).
         *
         * @param  {Number} [starting_pitch=0] - Indicates the starting pitch of the tree
         * (the pitch to be added to rather than starting at 0).
         *
         * @return {Array<Number>} the path
         * @memberOf EDO#get*/
        path_on_tree: (intervals,path,starting_pitch=0) =>{
            let result = [starting_pitch]
            for (let branch of path) {
                result.push(result[result.length-1]+intervals[branch]) //adds the interval at index=branch to the last value stored.
            }
            return result
        },

        /** <p>Finds the required operation to get to a destination note using given intervals</p>
         *
         * <p>Finds the shortest path towards a given note (destination) by starting on note 0 and moving using the
         * intervals provided.
         * For instance, for <code>destination = -4</code> and <code>intervals = [-7,3]</code> (reaching -4, by only moving up by minor 3rds (3) and down by perfect
         * 5ths (-7)), the function will return <code>[3,3,3,3,3,3,-7,-7]</code> which is the shortest way to get from 0
         * to -4 using only these intervals.</p>
         *
         * <p>Note: the order of the intervals is mutable and can be jumbled up at will without harming the
         * result. In the example given, as long as there are six 3s and two -7s. the sum will be -4. So
         * there is potential for permutations.</p>
         *
         *
         * @param  {Number} destination - the destination note. This is an int that represents some interval away from 0.
         * @param  {Array<Number> | Number} intervals - the interval classes to be used (usually at least one positive interval to move up and one negative to move down)
         * @return {Array<Array<Number>>} an sorted array of the intervals needed to reach the destination starting from 0.
         * @memberOf EDO#get
         * @example
         * //The quickest way to get to E (from 0) moving up with P5s and down with m3s
         * let path = edo.get.shortest_path(7,[5,-3]) // returns [ -3, 5, 5 ]
         * let all = edo.get.permutations(path) //all permutation of the result
         * //returns
         * [
         *  [ -3, 5, 5 ],
         *  [ -3, 5, 5 ],
         *  [ 5, -3, 5 ],
         *  [ 5, 5, -3 ],
         *  [ 5, -3, 5 ],
         *  [ 5, 5, -3 ]
         * ]
         * all = all.map((path)=>edo.convert.intervals_to_pitches(path)) //convert the intervals into pitches
         * let as_pitches = all.map((path)=>edo.convert.midi_to_name(path,60)) //convert the pitches into pitch names
         * //returns
         * [
         *  [ 'C4', 'A3', 'D4', 'G4' ],
         *  [ 'C4', 'A3', 'D4', 'G4' ],
         *  [ 'C4', 'F4', 'D4', 'G4' ],
         *  [ 'C4', 'F4', 'Bb4', 'G4' ],
         *  [ 'C4', 'F4', 'D4', 'G4' ],
         *  [ 'C4', 'F4', 'Bb4', 'G4' ]
         * ]
         *
         * */
        shortest_path: (destination,intervals=[5,-3], used = [],life_span=10) => {

            let up_interval = []
            let down_interval = []
            for (let int of intervals) {
                if(int>0) up_interval.push(int)
                else if(int<0) down_interval.push(int)
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
            paths = paths.sort((a,b)=>a-b)
            return paths

        },

        /** Returns all the ways to reach a destination pitch by providing a set of motives and a number of steps
         *
         * @example
         * // returns [3,3,-3]
         * get.path_n_steps(3,[[3],[-3]],3)
         * @param  {Number} destination - the destination note. This is an int that represents some interval away from 0.
         * @param  {Array<Array<Number>>} motives - a list of motives to be used
         * @param  {Number} n_steps - The exact number of pitches needed
         * @return {Array<Array<Number>>} An array of all the ways possible.
         * @memberOf EDO#get*/
        path_n_steps: (destination,motives=[],n_steps=8) => {
            const up_motives = motives.filter((m)=>this.get.interval_shift(m)>0)
            const down_motives = motives.filter((m)=>this.get.interval_shift(m)<0)
            const static_motives = motives.filter((m)=>this.get.interval_shift(m)==0)
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

            return this.get.unique_elements(success)
        },

        /** Generates all possible necklaces (unique scales without their modes) based on input parameters.
         *
         * @param  {Number} min_step - The smallest step size that can be used to form scales. If min_step=3, no scale will contain
         * intervals smaller than 3 (so no intervals of size 2, or 1 will be found in any scale)
         * @param  {Number} max_step - The largest step that can be used to form scales. If max_step=3, no scale will contain
         * intervals larger than 3 (so no intervals of size >3 will be found in any scale)
         * @param  {Number} min_sizes - The minimal amount of variety in step size needed to make a scale. if min_sizes=2,
         * then scales with step sizes that belong to fewer than 2 interval classes will not be included.
         *
         * In the case of min_sizes=2, the following scales will be excluded: [0,1,2,3,4,5,6,7,8,9,10,11],
         * [0,2,4,6,8,10], [0,3,6,9], etc.
         *
         * * @param  {Number} max_sizes - The maximal amount of variety in step size allowed to make a scale.
         * if max_sizes=2, then scales that use more than 2 step sizes will be excluded.
         *
         * In the case of max_sizes=2, the following scale will be excluded: [0,1,4,5,7,10,11], because it has >2 (3)
         * step sizes. step size=1 between 0 and 1, step size=2 between 5 and 7, and step size = 3 between 1 and 4.
         * @return {Array<Scale>} all the scales that abide by the criteria given
         * @memberOf EDO#get*/
        scales:(min_step=1,max_step=4,min_sizes=2,max_sizes=3, EDO = this) => {

            //get all unique combinations of size s from set of intervals set
            const calc_comb = (s,set) => {
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
                return this.get.unique_elements(solutions)
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

        /** Returns all necklaces from a given set of steps
         * @param  {Array<Number>} lst - a set of intervals
         * @return {Array<Array<Number>>} Necklaces
         * @memberOf EDO#get
         * @example
         * let edo = new EDO(12)
         * edo.get.necklace([2,2,1,2,2,2,1])
         * //returns
         * [ //These are the 3 unique orderings of the intervals in the input
         *  [2, 2, 2, 1, 2, 2, 1], //any other combination would be some rotation of
         *  [2, 2, 2, 2, 1, 2, 1], //one of these
         *  [2, 2, 2, 2, 2, 1, 1]
         * ]
         * @see {@link https://en.wikipedia.org/wiki/Necklace_(combinatorics)}
         * */
        necklace:(lst) => {
            let necklaces = []
            let unique_steps = this.get.unique_elements(lst)
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

        /** <p>Makes every stacking combination of intervals from 'intervals' up to 'height' stack_size.</p>
         *
         * <p>For instance, given the <code>intervals = [2,3]</code> and <code>stack_size = 3</code>, the function will return a list of lists
         * such that every list will be of <code>length = 3</code> (<code>stack_size</code>) containing an exhaustive list of every
         * combination using the intervals 2 and 3 (in this case).
         * As such, it will return  <code>[[2, 2, 2], [2, 2, 3], [2, 3, 2], [3, 2, 2], [2, 3, 3], [3, 2, 3],
         * [3, 3, 2], [3, 3, 3]]</code> which represents every combination or 2s and 3s in any order of length 3.</p>
         *
         * <p>if <code>as_pitches = true</code>, instead of returning the list of intervals classes of length 3, it
         * will return a list of pitches starting from 0 (which can go above 11). If set to true the function
         * will return  <code>[[0, 2, 4, 6], [0, 2, 4, 7], [0, 2, 5, 7], [0, 3, 5, 7], [0, 2, 5, 8], [0, 3, 5, 8],
         * [0, 3, 6, 8], [0, 3, 6, 9]]</code></p>
         * @param  {Array<Number>} intervals - the intervals be used
         * @param  {Number} [stack_size=3] - the size of the stack of pitches.
         * @param  {Boolean} [as_pitches=false] - Indicates whether the returned result represents interval classes or pitches
         * @return {Array<Number>} a list of interval classes or pitches
         * @memberOf EDO#get
         * @example
         * let edo = new EDO(12) // create a tuning context
         * edo.get.interval_stack([3,2],3)
         * //returns
         *      [
         *       [ 2, 2, 2 ],
         *       [ 3, 2, 2 ],
         *       [ 2, 3, 2 ],
         *       [ 2, 2, 3 ],
         *       [ 3, 3, 2 ],
         *       [ 3, 2, 3 ],
         *       [ 2, 3, 3 ],
         *       [ 3, 3, 3 ]
         *      ]
         *
         * @example
         * edo.get.interval_stack([3,2],3,true)
         * //returns
         * [
         *  [ 0, 2, 4, 6 ],
         *  [ 0, 3, 5, 7 ],
         *  [ 0, 2, 5, 7 ],
         *  [ 0, 2, 4, 7 ],
         *  [ 0, 3, 6, 8 ],
         *  [ 0, 3, 5, 8 ],
         *  [ 0, 2, 5, 8 ],
         *  [ 0, 3, 6, 9 ]
         * ]
         * */
        interval_stack: (intervals, stack_size=3,as_pitches=false) => {
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
            intervals = this.get.unique_elements(intervals)
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

        /** Returns the closest ratio (within a given limit) for any interval class.
         * @param  {Number} interval - An interval class
         * @param  {Number} [limit=17] - The harmonic limit
         * @param  {Boolean} cache - if true, the result will be cached for faster retrival
         * @return {Object}
         * @returns {approximation}
         * @memberOf EDO#get
         * @example
         * let edo = new EDO(12) // create a tuning context
         * edo.get.ratio_approximation(7)
         * //returns { ratio: '3/2', cents_offset: -1.955000865387433, decimal: 1.5 }
         *
         * let edo = new EDO(17) // Notice this is 17 divisions
         * console.log(edo.get.ratio_approximation(3))
         * //returns {ratio: '17/15', cents_offset: -4.921988887832043, decimal: 1.1333333333333333}
         *
         */
        ratio_approximation: (interval,limit=17) =>{
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

        /** Gets a melody represented as intervals, and returns the interval traversed by the end.
         * @param  {Array<Number>} intervals - Melody represented in intervals
         * @returns {Number} the interval traversed by the melody
         * @memberOf EDO#get
         * @example
         * let edo = new EDO(12) // define a tuning system
         * edo.get.interval_shift([2,-3,4,-1])
         * //returns 2 (moving up 2, then down 3, then up 4, then down 1 will get you +2 above where you started)
         */
        interval_shift: (intervals) => {
            /*Gets an array of intervals in order, and returns the interval traversed by the end*/
            return intervals.reduce((t,e)=>t+e)
        },

        /** Returns all the subsets (in order) from a given array of pitches.
         * @param  {Array<Number>} pitches - a given array of pitches
         * @param  {Boolean} allow_skips - if set to false, function will only return subsets that have consecutive members
         * @example
         * //returns [[0], [2], [3], [0, 2], [0, 3], [2, 3], [0, 2, 3]]
         * get.subsets([0,2,3],true)
         * @example
         * //returns [[0], [2], [3], [0, 2], [2, 3], [0, 2, 3]]
         * edo.get.subsets([0,2,3],false)
         * @returns {Array<Array<Number>>}
         * @memberOf EDO#get
         */
        subsets: (pitches,allow_skips=true) => {
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

        /** <p>Returns a vector describing the contour of the given pitches.</p>
         *
         * <p>If local is set to true, every cell in the vector will be
         * either 1 if note n is higher than n-1, 0 if note n is the same as n-1, and -1 if note n is lower than n-1
         * For instance <code>[0,0,4,7,4,7,4,0]</code> will in local mode will return <code>[0,1,1,-1,1,-1,-1]</code></p>
         *
         * <p>If local is set to false (default), the contour of the line is expressed such that the actual pc class of the
         * note is removed but its relative position in regards to the entire line is kept.
         * <code>[0,4,7,12,16,7,12,16]</code> (Bach prelude in C) has 5 distinct note heights, so it will return
         * <code>[0,1,2,3, 4, 2,3, 4]</code> indicating the relative height of each note in the entire phrase</p>
         * @param  {Array<Number>} pitches - a given array of pitches
         * @param  {Boolean} [local=false] - if set to false, function will only return subsets that have consecutive members
         * @returns {Array<Number>}
         * @memberOf EDO#get
         * @example
         * let edo = new EDO(12) // define a tuning system
         * edo.get.contour([0,4,7,12,16,7,12,16])
         * //returns [0, 1, 2, 3, 4, 2, 3, 4]
         * @example
         * let edo = new EDO(12) // define a tuning system
         * edo.get.contour([0,4,7,12,16,7,12,16],true)
         * //returns [1, 1, 1, 1,-1, 1, 1]
         */
        contour: (pitches,local=false) => {


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
                let unique_pitches = this.get.unique_elements(pitches)
                unique_pitches = unique_pitches.sort((a,b)=>a-b)
                for (let i = 0; i < unique_pitches.length; i++) {
                    catalog[unique_pitches[i]]=i
                }

                let vector = pitches.map((pitch)=>catalog[pitch])
                return vector
            }

        },

        /** Returns the distribution (as fractions adding up to 1) of the pitches in a set of pitches
         *
         * @param  {Array<Number>} pitches - a given array of pitches
         * @returns {Array<distribution>}
         * @memberOf EDO#get
         * @example
         * let edo = new EDO(12) // create a tuning context
         * edo.get.pitch_distribution([8,7,7,8,7,7,8,7,7,15,15,14,12,12,10,8,8,7,5,5]) //Mozart Sym. 40
         * //returns
         * [
         *  { note: 7, rate: 0.35 },
         *  { note: 8, rate: 0.25 },
         *  { note: 15, rate: 0.1 },
         *  { note: 12, rate: 0.1 },
         *  { note: 5, rate: 0.1 },
         *  { note: 14, rate: 0.05 },
         *  { note: 10, rate: 0.05 }
         * ]
         */
        pitch_distribution: (pitches) => {
            let unique = this.get.unique_elements(pitches)

            let dist = unique.map((el)=>{return {note:el,rate: pitches.filter(x => x==el).length/pitches.length}})
            dist = dist.sort((a,b)=>b.rate-a.rate)
            return dist
        },

        /** Transposes the input by a given amount
         *
         * @param  {Array<Number>} pitches - a given array of pitches
         * @param  {Number} [amount=0] - the interval by which to transpose
         * @param  {Boolean} [as_PC=true] - if true, the intervals returns will conform to a single octave
         * @returns {Array<Number>}
         * @memberOf EDO#get
         * @example
         * let edo = new EDO(12) //Create a tuning context
         * edo.get.transposition([0,2,4,5,7,9,11],7)
         * //returns [7, 9, 11, 0, 2, 4,  6]
         */
        transposition: (pitches,amount=0,as_PC=true) => {
            pitches = pitches.map((pitch) => pitch+amount)
            if (as_PC) pitches=pitches.map((pitch)=>this.mod(pitch,this.edo))
            return pitches
        },

        /** Returns an array of (length) pitches, with lowest note not lower than range[0],
         * and highest note not higher than range[1].
         *
         * @param  {Number} [length=8] - The number of pitches in the melody
         * @param  {Array<number>} [range=[0, 12]] - the lower and upper limits (inclusive) for the melody
         * @param  {Boolean} [repetitions=false] - If repetitions is false, the returned melody will note have the
         * same pitch appear twice (although it may have the same pitch class, but in a different octave).
         * @param  {Array<number>} [from_PCs] - If from_PCs is provided, the pitches returned will be only ones
         * that appear in from_PCs.
         * @param  {Number|Boolean} [avoid_leaps=false] - If avoid_leaps is provided (a number), the generator will
         * ATTEMPT to move in intervals that equal to avoid_leaps or smaller
         * @returns {Array<Number>}
         * @memberOf EDO#get
         * @example
         * let edo = new EDO(12) //Create a tuning context
         * edo.get.random_melody(4,[-3,2]) //returns e.g. [ -2, -1, 1, 2 ]
         * edo.get.random_melody(4,[-3,2]) //returns e.g. [ 2, 1, -3, -2 ]
         * edo.get.random_melody(6,[0,17],true,[0,2,4,5,7,9,11]) // returns e.g. [ 7, 9, 2, 17, 4, 4 ]
         * edo.get.random_melody(6,[0,17],true,[0,2,4,5,7,9,11]) // returns e.g. [ 2, 5, 0, 2, 0, 9 ]
         */
        random_melody: (length=8,range = [0,12], repetitions=false, from_PCs=undefined,avoid_leaps=false) => {
            let pitches = []
            if(from_PCs) {
                from_PCs = from_PCs.map((pc)=>this.mod(pc,this.edo))
                from_PCs = this.get.unique_elements(from_PCs)
                for (let i = range[0]; i <=range[1] ; i++) {
                    if(from_PCs.indexOf(this.mod(i,this.edo))!=-1) pitches.push(i)
                }
            }
            else {
                pitches = Array.from(Array((range[1]+1)-range[0]), (_, i) => i + range[0])
            }

            let collection = []


            while(collection.length<length) {
                if(!avoid_leaps) {
                    let ind = Math.floor(Math.random() * (pitches.length) ) ;
                    collection.push(parseInt(pitches[ind]))
                    if(!repetitions) pitches.splice(ind,1)
                } else {
                    let leapless_pitches = []
                    if(collection.length==0) leapless_pitches = pitches
                    else {
                        let leaper = avoid_leaps
                        do {
                            leapless_pitches = pitches.filter((pitch)=> Math.abs(collection[collection.length-1]-pitch)<=leaper)
                            if(leapless_pitches.length==0) leaper++
                        } while (leapless_pitches.length==0)
                    }

                    let ind = Math.floor(Math.random() * (leapless_pitches.length) ) ;
                    collection.push(parseInt(leapless_pitches[ind]))
                    if(!repetitions) pitches.splice(pitches.indexOf(leapless_pitches[ind]),1)
                }

            }
            return collection
        },

        /** Gets an array that may have duplications and returns the array without duplications
         *
         * @param  {Array<number|Array<Number>>} list - an array with duplications
         * @returns {Array<Number>} an array without duplications
         * @memberOf EDO#get
         * @example
         * let edo = new EDO(12) //Create a tuning context
         * edo.get.unique_elements([1,[2,3],2,[2,3],2]) //notice that it accepts nested elements as well
         * //returns [ 1, [ 2, 3 ], 2 ]
         */
        unique_elements : (list) => {

            let unique  = new Set(list.map(JSON.stringify));
            unique = Array.from(unique).map(JSON.parse);

            return unique
        },

        /** <p>Returns a lattice from the pitches in the scale</p>

         * @param {Number} [hor=3] - the gap between numbers horizontally
         * @param {Number} [ver=4] - the gap between numbers vertically
         * @param {Boolean} [as_notes=false]
         * @example
         * let edo = new EDO(12) //define tuning
         * edo.get.lattice()
         * //returns
         //0  3  6  9  0  3  6  9  0  3  6  9
         //
         //8  11 2  5  8  11 2  5  8  11 2  5
         //
         //4  7  10 1  4  7  10 1  4  7  10 1
         //
         //0  3  6  9  0  3  6  9  0  3  6  9
         //
         //8  11 2  5  8  11 2  5  8  11 2  5
         //
         //4  7  10 1  4  7  10 1  4  7  10 1
         //
         //0  3  6  9  0  3  6  9  0  3  6  9
         * @memberOf EDO#get*/
        lattice: (hor=3,ver=4,as_notes=false) => {
            let lattice = ""
            for (let i = this.edo; i >= -this.edo; i-=ver) {
                let line = ""
                for (let j = 0; j < this.edo ; j++) {
                    let num =this.mod(i+(j*hor),this.edo)
                    let note
                    if(as_notes) note = this.convert.pc_to_name(num)
                    else note = String(num)
                    line+=note+" ".repeat(3-note.length)
                }
                lattice+=line+"\n\n"
            }
            return lattice
        },

        primes_in_range: (upper=17,lower=2) => {
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
        },
        divisors : (n) => {
            let divisors = []
            for (let i=2;i<Math.ceil(n/2);i++) {
                if(n%parseInt(i)==0) divisors.push(i)
            }
            return divisors
        }
    }

    /**A collection of functions that converts an input into other equivalent representations
     * @namespace EDO#convert*/
    convert = {
        /** Gets a melody as pitches and returns the melody as intervals
         *
         * @param  {Array<number>} lst - a collection of pitches
         * @param  {Boolean} [cache=true] - when true the result is cached for faster future retrieval
         * @returns {Array<Number>} an array of intervals
         * @memberOf EDO#convert
         * @example
         * let edo = new EDO(12) // define a tuning system
         * edo.convert.to_steps([0,2,4,5,7,9,11])
         * //returns [ 2, 2, 1, 2, 2, 2 ]*/
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

        /** Gets a scale's name, and returns it as a Scale object
         *
         * @param  {String} name - a scale's name (based on this API's naming formula)
         * @returns {Scale} a scale object
         * @memberOf EDO#convert
         * @example
         * let edo = new EDO(12) // define a tuning system
         * edo.convert.name_to_scale('12-1387')
         * //returns Scale object corresponding to the diatonic scale*/
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

        /** Returns all of the IC in the EDO that equal to a given ratio (with a given tolerance in cents)
         *
         * @param  {Number} ratio - A harmonic ratio
         * @param  {Number} [tolerance=10] - a tolerance (allowed error) in cents
         * @returns {Array<Number>} Interval classes that fit that ratio
         * @memberOf EDO#convert
         * @example
         * let edo = new EDO(12) // define a tuning system
         * edo.convert.ratio_to_interval(3/2)
         * //[7]
         * @example
         * let edo = new EDO(12) // define a tuning system
         * edo.convert.ratio_to_interval(5/4,20) //increased the default tolerance (default 10 won't accept IC 4)
         * //returns [4]
         * */
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

        /** Returns a value in cents to a given input ratio
         *
         * @param  {Number} ratio - A harmonic ratio
         * @returns {Number} The ratio represented in cents
         * @memberOf EDO#convert
         * @example
         * let edo = new EDO(12) // define a tuning system
         * edo.convert.ratio_to_cents(5/4)
         * //returns 386.3137138648348*/
        ratio_to_cents: (ratio) => {
            return 1200*Math.log2(ratio)
        },

        /** Returns a value in cents from a given interval
         *
         * @param  {Number} interval - Some interval
         * @returns {Number} the interval represented in cents
         * @memberOf EDO#convert
         * @example
         * let edo = new EDO(17) // define a tuning with 17 divisions of the octave
         * edo.convert.interval_to_cents(6)
         * //returns 423.5294117647059*/
        interval_to_cents: (interval) => {
            return this.cents_per_step*interval
        },

        /** Gets a list of intervals classes. Returns a scale as list of pitch classes.
         *
         * @param  {Array<Number>} intervals - A list of intervals
         * @example
         * let edo = new EDO(12) // define a tuning system with 12 divisions of the octave
         * edo.convert.intervals_to_scale([2, 2, 1, 2, 2, 2, 1])
         * // returns [0,2,4,5,7,9,11]
         * @returns {Number} A scale made up by adding the intervals in order
         * @memberOf EDO#convert*/
        intervals_to_scale: (intervals) => {
            let pcs = [0]

            intervals.forEach((interval) => {
                pcs.push(interval+pcs[pcs.length-1])
            })
            return pcs
        },

        /** Returns a ratio as a decimal number from a given interval
         *
         * @param  {Number} interval - Some interval
         * @returns {Number} a ratio
         * @memberOf EDO#convert
         * @example
         * let edo = new EDO(12) // define a tuning system with 12 divisions of the octave
         * edo.convert.interval_to_ratio(7)
         * // returns 1.4983070768766815*/
        interval_to_ratio: (interval) => {
            return Math.pow(2,interval/this.edo)
        },

        /** Returns a ratio as a decimal number from an interval represented in cents
         *
         * @param  {Number} cents - an interval in cents
         * @returns {Number} a ratio
         * @memberOf EDO#convert
         * @example
         * let edo = new EDO(12) // define a tuning system with 12 divisions of the octave
         * edo.convert.cents_to_ratio(700)
         * // returns 1.4983070768766815*/
        cents_to_ratio: (cents) => {
            return Math.pow(2,cents/1200)
        },

        /** Returns the name of the note (including octave) from a midi value
         * @param  {Array<Number>|Number} note_number - a midi note number or an array of midi note numbers
         * @param  {Number} offset - an amount by which to shift note_number
         * @example
         * let edo = new EDO(12) // define a tuning system with 12 divisions of the octave
         * edo.convert.midi_to_name([60,62])
         * //returns ["C4","D4"]
         * @returns {Array<String>|String} The input as note name(s)
         * @memberOf EDO#convert*/
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
                let note_name = this.convert.pc_to_name(this.mod(note_number,12))
                return note_name.trim() + octave
            }


        },

        /** Returns the name of a note from a given pitch class (supports only 12-edo)
         * @param  {Number} pc - a pitch class
         * @returns {String} The input as a note name
         * @memberOf EDO#convert
         * @example
         * let edo = new EDO(12) // define a tuning system with 12 divisions of the octave
         * edo.convert.midi_to_name(4)
         * //returns "E"
         * */
        pc_to_name: (pc) => {
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
            if(this.edo!=12) return undefined
            return PC[pc]
        },

        /** Given a list of intervals (or list of lists), returns pitches made with the intervals
         * starting from starting_pitch
         * @param  {Array<Number>|Array<Array<Number>>} intervals - a list of intervals
         * @param  {Number} [starting_pitch=0]
         * @param  {Boolean} [modulo] if modulo is provided, the pitches will conform to it
         * @returns {Array<Number>|Array<Array<Number>>} The input as pitches
         * @memberOf EDO#convert
         * @example
         * let edo = new EDO(12) // define a tuning system with 12 divisions of the octave
         * edo.convert.intervals_to_pitches([2,3])
         * //returns [ 0, 2, 5 ]*/
        intervals_to_pitches: (intervals,starting_pitch=0,modulo=undefined) => {
            let pitches
            if(modulo) pitches = [mod(starting_pitch,modulo)]
            else pitches=[starting_pitch]
            for(let interval of intervals) {
                if(Array.isArray(interval)) {
                    starting_pitch = pitches.flat()[pitches.flat().length-1]
                    let result = this.convert.intervals_to_pitches(interval,starting_pitch)
                    result=result.slice(1)
                    pitches.push(result)
                }
                else {
                    if(modulo) pitches.push(mod(parseInt(pitches[pitches.length-1])+parseInt(interval)),modulo)
                    else pitches.push(parseInt(pitches[pitches.length-1])+parseInt(interval))
                }
            }
            return pitches
        },

        /** Given a list of midi notes, returns a list of intervals
         * @param  {Array<Number>} midi - a list of midi pitches
         * @returns {Array<Number>} The input as intervals
         * @memberOf EDO#convert
         * @example
         * let edo = new EDO(12) // define a tuning system with 12 divisions of the octave
         * edo.convert.midi_to_intervals([60,64,57,61])
         * //returns [ 4, -7, 4 ]*/
        midi_to_intervals: (midi) => {
            let intervals = []
            for(let i=0;i<midi.length-1;i++) {
                intervals.push(midi[i+1]-midi[i])
            }
            return intervals
        }
    }

    mod (n, m) {
        return ((n % m) + m) % m;
    }


}

/** <p>Class representing a set of pitch classes within an EDO system</p>
 * <p>(This class should have been called "Set" but because Set is a reserved work in JavaScript (as in most languages), "Scale" was selected as a compromise).</p> */
class Scale {
    /**
     * <p>Creates a set of pitch classes within the context of the edo system.</p>
     * <p>Unlike the [EDO Class]{@link EDO}, this class constains methods which are more directed at manipulating a set of pitch classes (regardless of their octave).
     * At the center of this class stand 5 collections (see "Namespaces" below) of functions.</p>
     * <ul>
     *  <li> [Scale.to]{@link Scale#to} is a set of functions used to change between equivalent representations of the set.</li>
     *  <li> [Scale.count]{@link Scale#count} is a set of functions used to count stuff.</li>
     *  <li> [Scale.get]{@link Scale#get} is a set of functions used to manipulate and track, and generate stuff.</li>
     *  <li> [Scale.is]{@link Scale#is} is a set of functions used for boolean truth statements.</li>
     *  <li> [Scale.export]{@link Scale#export} is a set of functions used to export files.</li></ul>
     *  <p>
     *      In addition to the namespaces, Scale also has 4 methods that can be chained together:
     * <ul>
     *  <li> [Scale.invert()]{@link Scale#invert} returns the inversion of the original Scale object as a new Scale object.</li>
     *  <li> [Scale.mode(n)]{@link Scale#mode} returns the nth mode of the original Scale object as a new Scale object.</li>
     *  <li> [Scale.normal()]{@link Scale#normal} returns the normal order of the original Scale object as a new Scale object.</li>
     *  <li> [Scale.prime()]{@link Scale#prime} returns the prime form of the original Scale object as a new Scale object.</li>
     *  </ul>
     *  </p>
     * @param {Array<number>} pitches - The pitch classes of the set.
     * @param {EDO} parent - and EDO context
     *
     * @example
     * //Basic usage 1:
     * let edo = new EDO(12) //create a new EDO context with 12 divisions.
     * let scale = new Scale([0,2,4,5,7,9,11],edo) //pass the PCs and edo context to the scale
     *
     * //Basic usage 2 (preffered):
     * let edo = new EDO(12) //create a new EDO context with 12 divisions.
     * let scale = edo.scale([0,2,4,5,7,9,11]) //create an instance of Scale through the EDO.scale method rather than
     *
     * @example
     * //for scale [0, 2, 3, 5, 6, 8, 9, 11 ] //octatonic
     * scale.count.transpositions() //returns 3
     * scale.is.mode_of([0, 1, 3, 4, 6, 7, 9, 10]) //returns true
     * scale.to.cents() //returns [0, 200, 300, 500, 600, 800, 900, 1100]
     * scale.get.stacks(3,2) //returns [ [ 0, 5, 9 ], [ 0, 4, 9 ] ]
     *
     * @example
     * //chain functions
     * let scale = edo.scale([0,2,4,5,7,9,11])
     * scale.mode(2) //the 3rd mode (1st is 0)
     *      .normal() //in normal order
     *      .invert() //inverted
     *      .prime() //in prime form
     *      .get.pitches() //returns [0, 1, 3, 5, 6, 8, 10]
     */
    constructor(pitches,parent) {
        this.parent = parent
        this.catalog = {}

        let smallest = Math.min.apply(Math,pitches)
        let diff_from_zero = 0-smallest

        this.pitches = pitches.map((pitch) => pitch+diff_from_zero)
        this.edo = this.parent.edo
        this.pitches = this.pitches.map((pitch) => pitch%parent.edo)
        this.pitches = this.parent.get.unique_elements(this.pitches)
        this.pitches.sort((a, b) => a-b)

        this.name = this.get.name()
    }

    /**A collection of functions that return an amount
     * @namespace*/
    count = {
        /**
         * <pre>Returns the number of Perfect Fifths (with a tolerance of 5 cents) in the scale.
         *
         * (To count other intervals or set a different tolerance use @Scale.count.ratio())</pre>
         * @return {Number}
         * @memberOf Scale#count
         */
        P5s: () => {
            return this.count.interval(this.parent.P5s)
        },

        /**
         * <pre>Returns the number of Major Thirds (with a tolerance of 20 cents) in the scale.
         *
         * (To count other intervals or set a different tolerance use @Scale.count.ratio())</pre>
         * @return {Number}
         * @memberOf Scale#count
         */
        M3s: () => {
            return this.count.interval(this.parent.M3s)
        },

        /**
         * <pre>Returns the number of Minor Thirds (with a tolerance of 20 cents) in the scale.
         *
         * (To count other intervals or set a different tolerance use @Scale.count.ratio())</pre>
         * @return {Number}
         * @memberOf Scale#count
         */
        m3s: () => {
            return this.count.interval(this.parent.m3s)
        },

        /**
         * <pre>Returns the number of Major and Minor Thirds (with a tolerance of 20 cents) in the scale.
         *
         * (To count other intervals or set a different tolerance use @Scale.count.ratio())</pre>
         * @return {Number}
         * @memberOf Scale#count
         */
        thirds: () => {
            return this.count.interval(this.parent.M3s.concat(this.parent.m3s))
        },

        /**
         * <pre>Returns the number of pitches in the scale (its cardinality).
         * @return {Number}
         * @memberOf Scale#count
         */
        pitches: () => {
            return this.pitches.length
        },

        /**
         * <pre>Returns the number of rotational symmetries in the scale.
         * @return {Number}
         * @memberOf Scale#count
         */
        rotational_symmetries: () => {
            return this.edo / this.count.transpositions()
        },

        /**
         * <pre>Returns the number of unique modes in the scale.
         * @return {Number}
         * @memberOf Scale#count
         * @example
         * E.g returns 7 for the major scale, and 1 for the whole tone scale*/
        modes: () => {
        return this.get.modes().length
        },

        /**
         * <pre>Returns the number of major and minor (sounding) triads in the scale.
         *
         * For other chord qualities use a combination of Scale.count.chord_quality() and EDO.convert.ratio_to_interval()
         * </pre>
         * @return {Number}
         * @memberOf Scale#count*/
        major_minor_triads: () => {
            let major = this.count.chord_quality([[...this.parent.M3s],[...this.parent.P5s]])
            let minor = this.count.chord_quality([[...this.parent.m3s],[...this.parent.P5s]])

            return major+minor
        },

        /**
         * Returns the number of intervals of size IC in the scale.
         * @param {Number} interval - some interval class.
         * @return {Number}
         * @memberOf Scale#count*/
        interval: (interval) => {
            let scale = this.pitches
            let count = 0
            for(let note of scale) {
                for (let int of interval) {

                    if(scale.indexOf((note+int)% this.edo)  !=-1) count++
                }
            }


            return count
        },

        /**
         * Returns number of unique transpositions available for the scale.
         * @param {Boolean} [cache=true] - when true, the result will be cached for faster retrieval.
         * @return {Number}
         * @function
         * @memberOf Scale#count*/
        transpositions: (cache=true) => {
            if(this.catalog['# transpositions']) return this.catalog['# transpositions']
            let scale = this.pitches
            let scales = [scale]
            for(let i=0;i<this.parent.edo;i++) {
                let t_scale = []
                scale.forEach((note) => {
                    t_scale.push((note+i+1) % this.edo)
                })
                t_scale.sort((a,b) => a-b)
                if(this.parent.is.element_of(t_scale,scales)) return scales.length
                scales.push(t_scale)

            }
            let result = scales.length
            if(cache) this.catalog['# transpositions'] = result
            return result
        },

        /**
         * Returns the number of imperfections (notes that do not have a P5 above them) in the scale.
         * @param {Number} [tolerance=10] - allowed tolerance in cents (away from P5)
         * @param {Boolean} [cache=true] - when true, the result will be cached for faster retrieval.
         * @return {Number}
         * @memberOf Scale#count*/
        imperfections: (tolerance=10,cache=true) => {

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

        /**
         * Returns the number of times a certain chord quality (specific in PCs above the root) exists in the scale.
         * @param {Array<Number>} intervals - intervals above 0
         * @return {Number}
         * @example
         * Scale.count.chord_quality([4, 7, 11]) counts the number of times a major 7th (if in 12 TET) appears in a scale
         * @memberOf Scale#count*/
        chord_quality: (intervals) => {
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

        /**
         * Returns the number of unique trichords available in the scale.
         * @return {Number}
         * @function
         * @memberOf Scale#count*/
        trichords: () => {
            return this.get.trichords().length
        },

        /**
         * Returns the number of unique tetrachords available in the scale.
         * @return {Number}
         * @function
         * @memberOf Scale#count*/
        tetrachords: () => {
            return this.get.tetrachords().length
        },

        /**
         * Counts how many times some ratio appears in the scale within a given tolerance.
         * @param {Number} ratio
         * @param {Number} [tolerance=10] - a tolerance in cents
         * @return {Number}
         * @function
         * @memberOf Scale#count*/
        ratio: (ratio,tolerance=10) => {
            /**/
            let intervals = this.parent.convert.ratio_to_interval(ratio,tolerance)
            return this.count.interval(intervals)
        },

        /**
         * Counts how many simple ratios appear in the scale.
         * @param {Number} [limit=17] - some harmonic limit
         * @param {Number} [tolerance=15] - a tolerance in cents
         * @returns simple_ratio
         * @memberOf Scale#count
         *
         * */
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

        /**
         * Returns the maximal number of consecutive steps of size 'size' in the scale.
         * @param {Number} size - the size of the step
         * @returns {Number}
         * @memberOf Scale#count
         * */
        consecutive_steps: (size) => {
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

    /**A collection of functions manipulates the scale and returns diverse information about it
    * @namespace*/
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
            let normal = this.get.normal_order()
            let total = 0
            normal.forEach((i) => {
                total+=Math.pow(2,i)
            })
            return String(this.parent.edo) + "-" + String(parseInt(total))


        },

        /** Returns all the various modes (normalized to 0, that include all pitches) available from this scale
         * @param  {Boolean} cache - When true, the result will be cached for faster retrieval
         * @returns {Array<Array<Number>>} An array of the different modes
         * @memberOf Scale#get
         */
        modes: (cache=true) => {
            if(this.catalog['modes']) return this.catalog['modes']

            let modes = this.parent.get.modes(this.pitches)
            if(cache) return this.catalog['modes'] = modes
            return modes
        },

        /** Returns the scale's pitches as pitch classes
         * @returns {Array<Number>} The scale's pitches as PCs
         * @memberOf Scale#get
         */
        pitches: () => {
            return this.pitches
        },

        /** Returns the interval vector of the scale.
         * @param  {Boolean} cache - When true, the result will be cached for faster retrieval
         * @returns {Array<Number>} An array representing the vector
         * @memberOf Scale#get
         */
        interval_vector: (cache=true) => {
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

        /** Returns every trichord (normalized to 0) available in this scale
         * @param  {Boolean} cache - When true, the result will be cached for faster retrieval
         * @returns {Array<Number>} An array representing the vector
         * @memberOf Scale#get
         */
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
            trichords = this.parent.get.unique_elements(trichords)
            if(cache) this.catalog['trichords'] = trichords
            return trichords

        },

        /** Returns every tetrachord (normalized to 0) available in this scale
         * @param  {Boolean} cache - When true, the result will be cached for faster retrieval
         * @returns {Array<Number>} An array representing the vector
         * @memberOf Scale#get
         */
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
            tetrachords = this.parent.get.unique_elements(tetrachords)
            if(cache) this.catalog['tetrachords'] = tetrachords
            return tetrachords
        },

        /** Returns a list of lists of size "levels" made out of scale degrees with "skip" steps skipped apart.
         * @param  {Number} levels - The number of levels to the stack
         * @param  {Number} skip - The number of scale steps to skip between each level on the stack
         * @returns {Array<Array<Number>>} An array containing all of the stacks
         * @memberOf Scale#get
         * @example
         * [0,2,4,5,7,9,11] in 12-TET Scale.get.stacks(3,1)
         * //returns [[0, 3, 6], [0, 3, 7], [0, 4, 7]]
         * To get all quartal qualities, instead of skip=1, skip should be set to equal to 2. (C, skipping D, and E, and selecting F, etc.)
         */
        stacks: (levels,skip) => {
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
            stacks = this.parent.get.unique_elements(stacks)
            return stacks
        },

        /** Returns all the transpositions of the scale that share a common tone with the original scale
         * As well the the number of notes altered to get from the original scale to the new scale as a "Tuple"
         * @param  {Boolean} normalize - when true, all of the transpositions will be constructed on 0
         * @returns {Array<Array<Number>,Number>} An array containing all of the stacks
         * @memberOf Scale#get
         * @example
         * [0,2,4,5,7,9,11] in 12-TET Scale.get.common_tone_transpositions()
         * //returns [[[0,2,4,5,7,9,11],0],[[0,2,4,5,7,9,10],1],[[0,2,4,6,7,9,11],1],[[1,2,4,6,7,9,11],2],[[1,2,4,6,8,9,11],3],[[1,3,4,6,8,9,11],4],[[1,3,4,6,8,10,11],5]]
         * @example
         * [0,2,4,5,7,9,11] in 12-TET Scale.get.common_tone_transpositions(false)
         * //returns [[[0,2,4,5,7,9,11],0],[[5,7,9,10,0,2,4],1],[[7,9,11,0,2,4,6],1],[[2,4,6,7,9,11,1],2],[[9,11,1,2,4,6,8],3],[[4,6,8,9,11,1,3],4],[[11,1,3,4,6,8,10],5]]
         */
        common_tone_transpositions: (normalize=true) => {


            let transpositions = []
            let intervals = this.to.steps()
            intervals=intervals.slice(0,-1) //removing the last step because we don't need the octave completion
            for (let note of this.pitches) {
                let transposition = [note]
                for(let interval of intervals) {
                    let next_note = this.parent.mod(transposition.slice(-1)[0]+interval,this.edo)
                    transposition.push(next_note)
                }
                if(normalize) transposition.sort((a,b)=>a-b)
                let CT = this.count.pitches() - this.parent.count.common_tones(this.pitches,transposition)
                transpositions.push([transposition,CT])
            }
            transpositions.sort((a,b) =>a[1]-b[1])
            return transpositions

        },

        /** Returns the sets that the scale is contained in from a given list of sets
         * @param  {Array<Array<Number>>} scales - a list of scales
         * @returns {Array<Array<Number>>} the scales that contain the Scale object
         * @memberOf Scale#get
         * @example
         * [0,3,7] in 12-TET Scale.get.supersets([[0,1,2,3,4,5,6,7],[0,3,4,7],[0,1,2]])
         * //returns [[0,1,2,3,4,5,6,7],[0,3,4,7]]*/
        supersets: (scales) => {
            let sets = []
            for (let scale of scales) {
                let modes = this.parent.get.modes(scale)
                for(let mode of modes) {
                    if(this.is.subset(mode)) sets.push(scale)
                }
            }
            sets = this.parent.get.unique_elements(sets)
            return sets
        },

        /** <pre>Returns all of the rotations of the scale (not normalized to 0).
         *
         * To get the rotations normalized to zero (the modes) use {@link Scale#get#modes()}</pre>
         * @returns {Array<Array<Number>>} The rotations of the scale
         * @memberOf Scale#get
         * @example
         * [0,3,7]  Scale.get.rotations()
         * //returns [[0,3,7],[3,7,0],[7,0,3]]*/
        rotations: () => {
            let rotations = []
            let rotate = [...this.pitches]
            while (!this.parent.is.element_of(rotate,rotations)) {
                rotations.push(rotate)
                rotate = [...rotate.slice(1),...rotate.slice(0,1)]
            }
            return rotations
        },

        /** <pre>Returns every ordering (permutation) of notes in the scale
         *
         * Uses {@link EDO.get.permutations()}</pre>
         * @returns {Array<Array<Number>>} The permutations of the scale
         * @memberOf Scale#get
         * @example
         * [0,3,7]  Scale.get.permutations()
         * //returns [[0,3,7],[0,7,3],[3,0,7],[3,7,0],[7,0,3],[7,3,0]]*/
        permutations: () => {
            return this.parent.get.permutations(this.pitches)
        },

        /** <pre>Gets a list of intervals above a root, and returns all the positions in the scale where this
         chord quality can be created
         *
         * @returns {Array<Number>} The PCs on which the quality can be built
         * @memberOf Scale#get
         * @example
         * [0,4,7] in 12-EDO Scale.get.position_of_quality([4,7]) (a major triad)
         * //returns [0,5,7] because you can construct a major triad on 0, 5, and 7*/
        position_of_quality: (intervals) => {
            let result = []
            let double_scale = [...this.pitches,...this.pitches]

            for(let pitch of this.pitches) {
                let int = intervals.map((interval)=> (interval+pitch)%this.edo)
                let s = [...int]
                if(this.parent.is.subset(s,double_scale)) result.push(pitch)
            }
            return result


        },

        /** <pre>Calculates the attraction between note1 to note2 according to Lerdahl's formula in TPS
         * @param {Number} note1 - The first PC
         * @param {Number} note2 - The second PC
         * @returns {Number} The value of attraction between note1 and note2
         * @memberOf Scale#get*/
        lerdahl_attraction: (note1,note2) => {
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

        /** <pre>Returns a graphic vector showing the tendencies of each note in the scale
         * @returns {Array<String>} The attraction vector
         * @see Scale.get.lerdahl_attraction()
         * @example
         * let edo = new EDO(12) //define tuning
         * let scale = edo.scale([0,2,4,5,7,9,11]) //major scale
         * scale.get.lerdahl_attraction_vector()
         * //returns [*,<>,*,<>,*,<<,>>]
         * @memberOf Scale#get*/
        lerdahl_attraction_vector: () =>{

            let vector = []
            for (let i=0; i<this.pitches.length;i++) {
                let note = this.pitches[i]
                let ln = this.pitches[this.parent.mod(i-1,this.pitches.length)]
                let un = this.pitches[this.parent.mod(i+1,this.pitches.length)]
                ln = this.get.lerdahl_attraction(note,ln)
                un = this.get.lerdahl_attraction(note,un)
                if(ln<1 && un<1) vector.push('*')
                else if(ln<1 && un>=1) vector.push('>>')
                else if(ln>=1 && un<1) vector.push('<<')
                else if(ln>=1 && un>=1) vector.push('<>')
            }
            return vector

        },

        /** <pre>Returns a list of unique step sizes that appear in the scale
         * @returns {Array<Number>} The step sizes
         * @example
         * let edo = new EDO(12) //define tuning
         * let scale = edo.scale([0,2,4,5,7,9,11]) //major scale
         * scale.get.step_sizes()
         * //returns [1,2]
         * @memberOf Scale#get*/
        step_sizes: (cache=true) => {

            if(this.catalog['step sizes']) return this.catalog['step sizes']
            let lst = this.parent.get.unique_elements(this.to.steps())
            lst.sort((a,b) => a-b)
            if(cache) this.catalog['step sizes'] = lst
            return lst


        },

        /** <pre>Returns the smallest multiplier between the sizes of steps
         * @returns {Number} The step sizes
         * @example
         * let edo = new EDO(12) //define tuning
         * let scale = edo.scale([0,1,4,5,7,8,11]) //define scale with 3 kinds of steps (1,2, and 3)
         * scale.get.least_step_multiplier()
         * //returns 1.5
         * //2 is a multiplier of 2 over 1. 3 is a multiplier of 3 over one and 1.5 over two.
         * //Therefore, the function will return 1.5.
         * @memberOf Scale#get*/
        least_step_multiplier: () => {

            let steps= this.get.step_sizes()
            if(steps.length==1) return 1
            let size = this.edo
            for(let i=0;i<steps.length-1;i++) {
                if(steps[i+1]/steps[i]<size) size = steps[i+1]/steps[i]
            }
            return size
        },

        /** <pre>Returns the Rothenberg Propriety value for this scale
         * @param {Boolean} [cache=true] - When true, the result will be cached for future retrieval.
         * @returns {('strictly proper'|'proper'|'improper')} The step sizes
         * @example
         * let edo = new EDO(12) //define tuning
         * let scale = edo.scale([0,2,4,7,9]) //a major pentatonic scale
         * scale.get.rothenberg_propriety()
         * //returns "strictly proper"
         * @memberOf Scale#get*/
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

        /** <pre>Returns the Levenshtein distance of the scale to another scale
         * @param {Array<Number>} t - Some collection of pitches to perferm the comparison with
         * @param {Boolean} [ratio_calc=false] - When true, the function computes the
         levenshtein distance ratio of similarity between two strings
         * @returns {Number}
         * @example
         * let edo = new EDO(12) //define tuning
         * let scale = edo.scale([0,2,4,7,9]) //a major pentatonic scale
         * scale.get.levenshtein([0,2,4,5,7,9,11])
         * //returns 1
         *
         * @example
         * scale.get.levenshtein([0,2,4,5,7,9,11],true)
         * //returns 0.9230769230769231
         * @memberOf Scale#get*/
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
                let Ratio = ((s.length+ t.length) - distance[row-1][col-1]) / (s.length + t.length)

                return Ratio
            } else {
                return distance[s.length][t.length]
            }
        },

        /** <pre>Same as {@link EDO.get.shortest_path()} but for diatonic cases.
         * Instead of thinking in "intervals" it thinks in steps and scale degrees.
         so in the context of C major, moving from E to G is a move of size 3 (scale degrees),
         and from C to E is also 3 (scale degrees) even though in one case it's a minor third and in
         the other its a Major third.

         In this function the starting point is scale_degree 1</pre>

         * @param {Number} destination_scale_degree
         * @param {Number} up_steps
         * @param {Number} down_steps
         * @memberOf Scale#get*/
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

        },


        /** <pre>Returns the scale's inversion</pre>

         * @param {Boolean} [cache=true] - When true, the result will be cached for future retrieval
         * @returns {Array<Number>} the inverted pitches
         * @memberOf Scale#get*/
        inversion: (cache=true) => {
            /*Inverts the intervals of the scale*/
            if(this.catalog['inverted']) return this.catalog['inverted']

            let scale = this.parent.get.inversion(this.pitches,cache=false)
            if(cache) this.catalog['inverted'] = scale

            return scale
        },

        /** <pre>Returns the scale's pitches in prime form</pre>

         * @param {Boolean} [cache=true] - When true, the result will be cached for future retrieval
         * @returns {Array<Number>} The pitches in prime form
         * @memberOf Scale#get*/
        prime_form: (cache=true) => {
            /*Returns the scale in prime form*/
            if(this.catalog['prime form']) return this.catalog['prime form']
            let i_self = this.parent.scale(this.get.inversion())
            let norm_ord = this.parent.scale(this.get.normal_order())
            let i_norm_ord = this.parent.scale(i_self.get.normal_order())
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

        /** <pre>Returns the scale's pitches in normal order</pre>

         * @param {Boolean} [cache=true] - When true, the result will be cached for future retrieval
         * @returns {Array<Number>} The pitches in normal order
         * @memberOf Scale#get*/
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

        /** <pre>Returns the scale's pitches transposed by a certain amount</pre>
         * @param {Number} amount - The amount by which to transpose the pitches
         * @returns {Array<Number>} The transposed pitches
         * @memberOf Scale#get*/
        transposition: (amount) => {
            return this.parent.get.transposition(this.pitches,amount)
        }
    }

    /**A collection of functions that convert data from one representation to another
     * @namespace*/
    to = {
        /**
         * Instead of PCs, this returns the scale represented by intervals (steps between notes)
         * @param {Boolean} [cache=true] - when true, the result is cached for future retrieval
         * @returns {Array<Number>}
         * @memberOf Scale#to
         * */
        steps: (cache=true) => {

            if(this.catalog['steps']) return this.catalog['steps']

            let intervals = this.parent.convert.to_steps(this.pitches.concat([this.edo]),cache=false)
            if(cache) this.catalog['steps'] = intervals
            return intervals
        },

        /**
         * Returns the scale's representation in cents [0,100,300, etc.]
         * @returns {Array<Number>}
         * @memberOf Scale#to
         * */
        cents: () => {
            return this.pitches.map((note) => note*this.parent.cents_per_step)
        }

    }

    /**A collection of functions that returns a Boolean about various features regarding the scale
     * @namespace*/
    is = {
        /**
         * Returns True if the scale is in normal order and False if it isn't
         * @returns {Boolean}
         * @memberOf Scale#is
         * */
        normal_order: () => {
            return this.parent.is.same(this.pitches,this.get.normal_order())
        },

        /**Checks if the scale (as a whole!) is one of the scales given in a list of scales (or in one of their modes)
         * @param {Array<Array<Number>>} scales - a collection of scales (or necklaces)
         * @returns {Boolean}
         * @memberOf Scale#is */
        one_of: (scales) => {
            /**/
            let scale = this.pitches
            let all_modes = scales.map((item) => this.parent.get.modes(item))
            all_modes = all_modes.flat(1)
            if(this.parent.is.element_of(scale,all_modes)) return true
            return false
        },

        /**<p>Checks if the scale is a mode / rotation of another scale</p>
         *
         * <p>To check again multiple scale see [Scale.is.one_of]{@link Scale#is.one_of}</p>
         * @param {Array<Number>} scales - a collection of scales (or necklaces)
         * @returns {Boolean}
         * @memberOf Scale#is
         * @see Scale#is.one_of
         * */

        mode_of: (scale) => {
            let modes = this.parent.get.modes(scale)
            return (this.parent.is.element_of(this.pitches,modes))
        },

        /**
         * Returns True if the scale is in prime form and False if it isn't.
         * @returns {Boolean}
         * @memberOf Scale#is
         * */
        prime_form: () => {
            return this.parent.is.same(this.pitches,this.get.prime_form())
        },

        /**Returns True if the scale is invertible and False if it isn't
         * @param {Boolean} [cache=true] - when true, the result will be cached for future retrieval
         * @returns {Boolean}
         * @memberOf Scale#is */
        invertible: (cache=true) => {
            if(this.catalog['invertible']) return this.catalog['invertible']

            let scale=this.get.normal_order()
            let i_scale = this.parent.scale(this.get.inversion()).get.normal_order()
            let result = true
            if(this.parent.is.same(scale,i_scale)) result=false
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

    /**A collection of functions that exports various file formats
     * @namespace*/
    export = {
        /**Generates a scala file with the current tuning of the scale
         * @param {String} [dir=true] - The directory to which the file will be saved
         * @param {String} [filename] - When not provided, the file name will be the name of the scale
         * @memberOf Scale#export */
        scala: (dir="scala/",filename) => {
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


    /**
     * Returns a Scale object with pitches corresponding to the nth mode of the original scale
     * @param {Number} n - Mode number to be returned (starting at 0)
     * @returns {Scale}
     * */
    mode (n=0) {
        let modes = this.get.modes()
        let mode = modes[this.parent.mod(n,modes.length)]
        return new Scale(mode,this.parent)
    }

    /**
     * Returns a Scale object with pitches corresponding to the inversion of the original scale.
     * @returns {Scale}
     * */
    invert () {
        let pitches = this.get.inversion()
        return new Scale(pitches,this.parent)
    }

    /**
     * Returns a Scale object with pitches corresponding to the normal order of the original scale.
     * @returns {Scale}
     * */
    normal () {
        let pitches = this.get.normal_order()
        return new Scale(pitches,this.parent)
    }

    /**
     * Returns a Scale object with pitches corresponding to the prime form of the original scale.
     * @returns {Scale}
     * */
    prime () {
        let pitches = this.get.prime_form()
        return new Scale(pitches,this.parent)
    }


}


module.exports = {
    EDO:EDO,
    Scale:Scale
}




