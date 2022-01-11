const environment = (typeof window === 'undefined') ? "server" : "browser"
// import { createRequire } from "module";
// const require = createRequire(import.meta.url);

let fs, parseXML, midiParser
if (environment == 'server') {
    fs = require('fs')
    parseXML = require('xml2js').parseString;
    midiParser = require('midi-parser-js');

}


let save_file
if (environment == 'server') {
    /**
     * @ignore*/
    save_file = function (name, dir, contents, _unused) {
        fs.writeFile(dir + name, contents, function (err) {
            if (err) {
                return console.log(err);
            }
        });

    }

} else {
    /**
     * Handles file saving when run client-side
     * @ignore
     * */
    save_file = function (name, dir, contents, mime_type = "text/plain") {

        const blob = new Blob([contents], {type: mime_type});

        const dlink = document.createElement('a');
        dlink.download = name;
        dlink.href = window.URL.createObjectURL(blob);
        dlink.onclick = function (e) {
            // revokeObjectURL needs a delay to work properly
            setTimeout(() => {
                window.URL.revokeObjectURL(this.href);
            }, 1500);
        };

        dlink.click();
        dlink.remove();
    }

}

let load_file
if (environment == 'server') {
    /**
     * Handles file loading when run server-side
     * @ignore
     * */
    /**
     * @ignore*/
    load_file = function (file) {
        return fs.readFileSync(file,
            // {encoding:'utf8', flag:'r'}
        );

    }

} else {

    /**
     * Handles file saving when run client-side
     * @ignore
     * */
    load_file = function (name, dir, contents) {
        var fileSelector = document.createElement('input');
        fileSelector.setAttribute('type', 'file');

        var selectDialogueLink = document.createElement('a');
        selectDialogueLink.setAttribute('href', '');
        selectDialogueLink.innerText = "Select File";

        selectDialogueLink.onclick = function () {
            fileSelector.click();
            return false;
        }
        selectDialogueLink.click()
    }

}


class FixedContentNecklace {
    constructor(number_list,method="fast") {
        /*
        Class FixedContentNecklace Init Method

            :param number_list: A list of integers

        */
        // Force negative numbers to zero
        for (let i = 0; i < number_list.length; i++) {
            if (number_list[i] < 0) number_list[i] = 0
        }
        this.n_init = number_list
        this.N = number_list.reduce((t, n) => n + t)
        this.k = number_list.length
        this.initialize(method)
    }

    initialize(method) {
        /*
        Determines what method algorithm to use in the generation

            :param method: The name of the method/algorithm to use
        */
        this.occurrence = [...this.n_init]
        this.word = Array(this.N).fill(0)
        this.alphabet = Array(this.k).fill(0)
        this.alphabet = this.alphabet.map((el, i, arr) => i)
        this.run = Array(this.N).fill(0)
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
        for (let letter = 0; letter < this.k; letter++) {
            if (!found_first_nonzero && this.occurrence[letter] > 0) {
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
        this.last_letter = (!this.alphabet) ? 0 : Math.max.apply(Math, this.alphabet)
    }

    * execute(method = "simple") {
        /*
        Runs the algorithm that's passed to `method`

        :param method: The method/algorithm to execute

        */


        this.initialize(method)
        if (method == 'simple') {
            yield* this._simple_fixed_content(2, 1)
        } else if (method == 'fast') {
            yield* this._fast_fixed_content(2, 1, 2)
        }


    }

    * _simple_fixed_content(t, p) {
        /*
        The simple algorithm

        :param t: ?
        :param p: ?

        */
        if (t > this.N) { // if the prenecklace is complete
            if (this.N % p == 0) { // if the prenecklace word is a necklace
                yield [...this.word]
            }
        } else {
            for (let letter = this.word[t - p - 1]; letter < this.k; letter++) {
                if (this.occurrence[letter] > 0) {
                    this.word[t - 1] = letter
                    this.occurrence[letter] -= 1
                    if (letter == this.word[t - p - 1]) {
                        yield* this._simple_fixed_content(t + 1, p)
                    } else {
                        yield* this._simple_fixed_content(t + 1, t)
                    }
                    this.occurrence[letter] += 1
                }
            }
        }
    }

    * _fast_fixed_content(t, p, s) {
        let i_removed
        /*
        The fast algorithm
        */
        if (this.occurrence[this.last_letter] == this.N - t + 1) {
            if (this.occurrence[this.last_letter] == this.run[t - p - 1]) {
                if (this.N % p == 0) {
                    yield [...this.word]
                }
            } else if (this.occurrence[this.last_letter] > this.run[t - p - 1]) {
                yield [...this.word]
            }
        } else if (this.occurrence[this.first_letter] != this.N - t + 1) {
            let letter = Math.max.apply(Math, this.alphabet)
            let i = this.alphabet.length - 1
            let s_current = s
            while (letter >= this.word[t - p - 1]) {
                this.run[parseInt(s - 1)] = parseInt(t - s)
                this.word[t - 1] = letter
                this.occurrence[letter] -= 1
                if (!this.occurrence[letter]) {
                    i_removed = this.__remove_letter(letter)
                }
                if (letter != this.last_letter) {
                    s_current = t + 1
                }
                if (letter == this.word[t - p - 1]) {
                    yield* this._fast_fixed_content(t + 1, p, s_current)
                } else {
                    yield* this._fast_fixed_content(t + 1, t, s_current)
                }
                if (!this.occurrence[letter]) {
                    this.__add_letter(i_removed, letter)
                }
                this.occurrence[letter] += 1
                i -= 1
                letter = this.__get_letter(i)
            }
            this.word[t - 1] = this.last_letter
        }
    }

    __remove_letter(letter) {
        let index = this.alphabet.indexOf(letter)
        this.alphabet.splice(index, 1)
        return index
    }

    __add_letter(index, letter) {
        this.alphabet.splice(index, 0, letter)
    }

    __get_letter(index) {
        return (index < 0) ? -1 : this.alphabet[index]
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

const unique_in_array = (base) => [...new Set(base)]

const rescale = (num, in_min, in_max, out_min, out_max) => {
    return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}
const GCD = (...n) => n.length === 2 ? n[1] ? GCD(n[1], n[0] % n[1]) : n[0] : n.reduce((a, c) => a = GCD(a, c));

/** Class representing some EDO tuning system.*/

class EDO {

    /**
     * <p>Creates a tuning context and system that exposes powerful functions for manipulating, analyzing, and generating music.</p>
     * <p>This is the main class of the project. At its center stand 7 collections (see "Namespaces" below) of functions.</p>
     * <ul>
     *  <li> [EDO.convert]{@link EDO#convert} is a set of functions used to change between equivalent representations within the tuning context.</li>
     *  <li> [EDO.count]{@link EDO#count} is a set of functions used to count stuff.</li>
     *  <li> [EDO.get]{@link EDO#get} is a set of functions used to manipulate and generate stuff.</li>
     *  <li> [EDO.is]{@link EDO#is} is a set of functions used for boolean truth statements.</li>
     *  <li> [EDO.show]{@link EDO#show} is a set of functions used for visualization.</li>
     *  <li> [EDO.midi]{@link EDO#midi} is a set of functions used for importing and processing midi files.</li>
     *  <li> [EDO.xml]{@link EDO#xml} is a set of functions used for importing and processing musicXML files.</li>
     *  <li> [EDO.export]{@link EDO#export} is a set of functions used for exporting the output to various formats.</li>
     *  </ul>
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
    constructor(edo = 12) {
        this.edo = edo
        this.cents_per_step = (12 / edo) * 100
        this.M3s = this.convert.ratio_to_interval(5 / 4, 20)
        this.m3s = this.convert.ratio_to_interval(6 / 5, 20)
        this.P5s = this.convert.ratio_to_interval(3 / 2, 5)
        this.edo_divisors = this.get.divisors(edo)
        this.catalog = {}


    }

    /**
     * <p>Returns a new Scale Object with given pitches</p>
     * <p>Remark: "pitch classes" conform to the current tuning system used. 0-11 in 12EDO, 0-16 in 17EDO, etc.</p>
     * @param  {Array<Number>} pitches - a collection of pitch classes
     * @return {Scale}
     */
    scale(pitches,cache = this.cache) {
        return new Scale(pitches, this, cache)
    }

    make_DOM_svg(container_id, width, height, clean = false) {
        let div = document.createElement('div')
        div.style.width = width + "px";
        div.style.height = height + "px";
        div.style.display = "inline"
        let div_id = div.setAttribute("id", "paper_" + Date.now());
        let container = document.getElementById(container_id)
        if (clean) container.innerHTML = ""
        container.appendChild(div)
        const paper = new Raphael(div, width, height);
        let background = paper.rect(0, 0, width, height).attr('fill', '#000000')
        return {
            div_id: div_id,
            div: div,
            container_id: container_id,
            container: container,
            paper: paper,
            background: background,
            width: width,
            height: height,
            cleaned: clean
        }
    }

    shuffle_array(arr_in, in_place = true) {
        let arr
        if (in_place) arr = arr_in
        else arr = [...arr_in]
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * i)
            const temp = arr[i]
            arr[i] = arr[j]
            arr[j] = temp
        }
        return arr
    }

    sort_scales = (scales) => {
        scales = scales.sort((a, b) => {
            let run = Math.min(a.pitches.length, b.pitches.length)
            for (let i = 0; i < run; i++) {
                if (a.pitches[i] != b.pitches[i]) return a.pitches[i] - b.pitches[i]
                else if (a.pitches[i] == b.pitches[i] && i == run - 1) return a.pitches.length - b.pitches.length
            }
        })
        return scales
    }





    /**A collection of functions that convert an input into other equivalent representations
     * @namespace EDO#convert*/
    convert = {
        /** Expresses cents as intervallic unit (in given EDO)
         *
         * @param  {Number} interval - cents
         * @param  {Boolean} [round=true] - whether to round the decimals in case not a round number
         * @returns {Number} An equivilant value represented in intervallic units
         * @memberOf EDO#convert
         * @example
         * let edo = new EDO(24) // define a tuning with 24 divisions of the octave
         * edo.convert.cents_to_interval(6)
         * //returns 2*/
        cents_to_interval: (cents, round=true) => {
            let result = cents / this.cents_per_step
            if(round) result  = Math.round(result)
             return result
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
            if(Array.isArray(cents)) {
                return cents.map(e=>this.convert.cents_to_ratio(e))
            }
            return Math.pow(2, cents / 1200)
        },

        cents_to_simple_ratio: (cents,limit=17) => {
            if(Array.isArray(cents)) return cents.map(c=>this.convert.cents_to_simple_ratio(c,limit))
            cents = this.mod(cents,1200)
            if(cents==0) {
                return   {
                    cents: 0,
                    cents_in_octave: 0,
                    value: 1,
                    diff_in_octave: 0,
                    ratio: '1/1',
                    original: 0
                }
            }

            let SR = this.get.simple_ratios(limit,true)
            let min
            for (let key of Object.keys(SR)) {

                if(min) {
                    let diff_in_octave = Math.abs(SR[key].cents_in_octave-cents)
                    let diff_min = Math.abs(SR[min].cents_in_octave-cents)
                    if(diff_in_octave<diff_min) min = key
                } else min = key



            }
            SR[min].diff_in_octave = cents-SR[min].cents_in_octave
            SR[min].ratio = min
            SR[min].original = cents
            return SR[min]


        },

        /** Returns the midi_note and cents offset for a given pitch frequency in hertz
         *
         * @param  {Number} hz - Some frequency of a pitch
         * @returns {Object} {midi: the midi-note number, cents: fine-tuning of note in cents}
         * @memberOf EDO#convert
         * @example
         * let edo = new EDO()
         * edo.convert.freq_to_midi(445)
         * //returns
         * { midi: 69, cents: 20 }
         * */
        freq_to_midi: (hz) => {
            let result = (12*Math.log2(hz/440))+69
            let midi_note = Math.floor(result)
            let dec = result-midi_note
            let cents = Math.round(dec*100)
            if(cents>50) {
                midi_note = midi_note+1
                cents = (100-cents)*-1
            }
            return {midi:midi_note, cents:cents}
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
            return this.cents_per_step * interval
        },

        /** Returns a ratio as a decimal number from a given interval
         *
         * @param  {Number|Array<Number>} interval - Some interval
         * @returns {Number} a ratio
         * @memberOf EDO#convert
         * @example
         * let edo = new EDO(12) // define a tuning system with 12 divisions of the octave
         * edo.convert.interval_to_ratio(7)
         * // returns 1.4983070768766815*/
        interval_to_ratio: (interval) => {
            if(Array.isArray(interval)) return interval.map(i=>this.convert.interval_to_ratio(i))
            return Math.pow(2, interval / this.edo)

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
        intervals_to_pitches: (intervals, starting_pitch = 0, modulo = undefined) => {
            let pitches
            if (modulo) pitches = [mod(starting_pitch, modulo)]
            else pitches = [starting_pitch]
            for (let interval of intervals) {
                if (Array.isArray(interval)) {
                    starting_pitch = pitches.flat()[pitches.flat().length - 1]
                    let result = this.convert.intervals_to_pitches(interval, starting_pitch)
                    result = result.slice(1)
                    pitches.push(result)
                } else {
                    if (modulo) pitches.push(mod(parseInt(pitches[pitches.length - 1]) + parseInt(interval)), modulo)
                    else pitches.push(parseInt(pitches[pitches.length - 1]) + parseInt(interval))
                }
            }
            return pitches
        },

        /** <p>Gets a series of intervallic units . Returns a scale as list of pitch classes</p>
         *<p>Remark: "pitch classes" conform to the current tuning system used. 0-11 in 12EDO, 0-16 in 17EDO, etc.</p>
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
                pcs.push((interval + pcs[pcs.length - 1]))
            })

            return this.scale(pcs,false).pitches
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
            for (let i = 0; i < midi.length - 1; i++) {
                intervals.push(midi[i + 1] - midi[i])
            }
            return intervals
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
        midi_to_name: (note_number, offset = 0) => {
            /*Given a midi note code as an integer, returns its note name and octave disposition (e.g C4 for 60).*/

            //only supports 12 edo, so it returns the input if in other edo
            if (this.edo != 12) return note_number

            //If it's an array of notes
            if (Array.isArray(note_number)) {
                return note_number.map((a) => this.convert.midi_to_name(a, offset))
            } else {
                note_number = note_number + offset
                let octave = Math.floor(note_number / 12) - 1
                let note_name = this.convert.pc_to_name(this.mod(note_number, 12))
                return note_name.trim() + octave
            }


        },

        /** Returns the frequency of the midi note
         * @param  {Array<Number>|Number} note_number - a midi note number or an array of midi note numbers
         * @param  {Number} [offset=0] - By how much to offset every given number
         * @param  {Number} [A=440] - What is the tuning of A
         * @example
         * let edo = new EDO(12) // define a tuning system with 12 divisions of the octave
         * edo.convert.midi_to_freq(69) //returns 440
         * edo.convert.midi_to_freq([69,70]) //returns [ 440, 466.1637615180899 ]
         * @returns {Array<Number>|Number} the frequency of the midi note
         * @memberOf EDO#convert*/
        midi_to_freq: (midi,offset=0,A=440) => {
            if(Array.isArray(midi)) return midi.map(n=>this.convert.midi_to_freq(n,offset,A))
            else return Math.pow(2,((midi+offset)-69)/12)*A
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
            if (edo != this.edo) return "Wrong edo"

            let vector = []
            for (let i = edo; i > 0; i--) {
                let nw = Math.pow(2, i)
                if (nw > name) continue
                vector.push(i)
                name -= nw
            }
            vector.push(0)
            vector.reverse()
            return this.scale(vector, false)
        },

        /** Returns the name of a note from a given pitch class (supports only 12-edo)
         * @param  {Number | Array<Number>} pc - a pitch class
         * @returns {String} The input as a note name
         * @memberOf EDO#convert
         * @example
         * let edo = new EDO(12) // define a tuning system with 12 divisions of the octave
         * edo.convert.pc_to_name(4)
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
            if (this.edo != 12) return pc
            if(Array.isArray(pc)) return pc.map(p=>this.convert.pc_to_name(p))
            return PC[pc].trim()
        },

        /** <p>Normalizes any input to include pitch-classes only (to ignore octave displacement)</p>
         * <p>Remark: "pitch classes" conform to the current tuning system used. 0-11 in 12EDO, 0-16 in 17EDO, etc.</p>
         * @param  {Array<Number>} pitches - any collection of pitches (e.g. a melody)
         * @returns {Array<Number>} the input as pitch classes
         * @memberOf EDO#convert
         * @example
         * let edo = new EDO(12) // define a tuning system with 12 divisions of the octave
         * edo.convert.pitches_to_PCs([0,2,12,-2,7])
         * //returns [0,2,0,10,7]
         * */
        pitches_to_PCs: (pitches) => {
            return pitches.map((pitch) => this.mod(pitch, this.edo))
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
            return 1200 * Math.log2(ratio)
        },

        /** <p>Returns all of the intervallic units in the EDO that equal to a given ratio (with a given tolerance in cents)</p>
         *<p>Remark: "intervallic units" conform to the current tuning system used. E.g., 0-11 occupy 1 octave in 12EDO, 0-16 in 17EDO, etc.</p>
         * @param  {Number} ratio - A harmonic ratio
         * @param  {Number} [tolerance=10] - a tolerance (allowed error) in cents
         * @returns {Array<Number>} Intervals that fit that ratio
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
        ratio_to_interval: (ratio, tolerance = 10) => {
            let intervals = []
            let cents = this.convert.ratio_to_cents(ratio)
            for (let i = 0; i < this.edo; i++) {
                let interval = this.convert.interval_to_cents(i)
                if (Math.abs(interval - cents) <= tolerance) intervals.push(i)
                else if (intervals.length > 0) break
            }
            return intervals
        },

        /** Gets a melody as pitches and returns the melody as intervals
         *
         * @param  {Array<number>} lst - a collection of pitches
         * @param  {Boolean} [cache=false] - when true the result is cached for faster future retrieval
         * @returns {Array<Number>} an array of intervals
         * @memberOf EDO#convert
         * @example
         * let edo = new EDO(12) // define a tuning system
         * edo.convert.to_steps([0,2,4,5,7,9,11])
         * //returns [ 2, 2, 1, 2, 2, 2 ]*/
        to_steps: (lst, cache = true) => {
            if(lst.length<=1) return []
            if(this.cat_getset(["to_steps",String(lst)])) return this.cat_getset(["to_steps",String(lst)])
            let intervals = []
            for (let i = 0; i < lst.length - 1; i++) {
                intervals.push(lst[i + 1] - lst[i])
            }
            if (cache) this.cat_getset(["to_steps",String(lst)],intervals)
            return intervals
        }

    }

    /**A collection of functions that return an amount
     * @namespace EDO#count*/
    count = {
        /**
         * Returns the number of commons tones between two collections of pitches
         * <p>Remark: "pitches" conform to the current tuning system used. E.g., 0-11 occupy 1 octave in 12EDO, 0-16 in 17EDO, etc.</p>
         * @param  {Array<Number>} list1 - a collection of pitches (not necessarily pitch classes)
         * @param  {Array<Number>} list2 - a collection of pitches (not necessarily pitch classes)
         * @return {Number} The number of common tones between the two lists
         * @memberOf EDO#count
         * @example
         * let edo = new EDO(12) // define a tuning system
         * edo.count.common_tones([1,2,4],[2,3,4,5])
         * //returns 2 (because 2 and 4 are in both lists)
         */
        common_tones: (list1, list2) => {

            return list1.reduce((ag,e)=>ag+ list2.includes(e),0)
        },

        /**
         * From a list of arrays passed to the function, returns the number of differences between each array and its following neighbor.
         * @param  {Array<Number>} ...args - As many arrays as needed.
         * @return {Number} The number of differences between neighboring arrays
         * @memberOf EDO#count
         * @example
         * let edo = new EDO()
         * edo.count.differences([0,2,3],[0,1,2],[0,2,4],[0,2,1,1,1])
         * // returns [2,2,3] (2 differences between the 1st and 2nd arrays, 2 diffs between the 2nd and 3rd, and 3 diffs between the 3rd and 4th.)
         */
        differences: (...arrays) => {
            let args = arrays.map((el,i,arr)=>{
                if(i!=arr.length-1) {
                    let lena = arr[i].length
                    let lenb = arr[i+1].length
                    let minlen = Math.min(lena,lenb)
                    let maxlen = Math.max(lena,lenb)
                    let diff = maxlen-minlen
                    for (let j = 0; j < minlen; j++) {
                        if(arr[i][j]!=arr[i+1][j]) diff++
                    }
                    return diff
                }
            })
            return args.slice(0,args.length-1)


        },

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
                let count = pitches.reduce((t, e) => {
                    if (e == pitch) return t + 1
                    else return t
                }, 0)
                counts.push([pitch, count])
            }
            counts.sort((a, b) => b[1] - a[1])
            return counts
        },



    }

    /**A collection of functions that exports various file formats
     * @namespace*/
    export = {
        /**
         * <p>Downloads / saves a png file with the contents of a container</p>
         * <p>Note: all of the graphics made with this library create SVG elements, so just pass the same ID that you used to create the graphic in the first place</p>
         *
         * @param  {String} container_id - The ID of a container that has one or more SVG elements in it.
         * @memberOf EDO#export
         * @example
         * <script src="edo.js"></script>
         * <script src="raphael.min.js"></script>
         * <div id="container" style="width:900px;height:600px; margin:0 auto;"></div>
         * <script>
         *  let edo = new EDO()
         *  //Create a necklace graphic
         *  edo.show.necklace('container', [0,2,4,5,7,9,11])
         *
         *  //Save the graphic
         *  edo.export.png('container') //downloads the necklace
         * </script>
         */
        png: (container_id) => {
            if (environment == "server") return console.log("This is only support when run on client-side")

            const triggerDownload = function (imgURI) {
                let evt = new MouseEvent('click', {
                    view: window,
                    bubbles: false,
                    cancelable: true
                });

                let a = document.createElement('a');
                a.setAttribute('download', container_id + '.png');
                a.setAttribute('href', imgURI);
                a.setAttribute('target', '_blank');

                a.dispatchEvent(evt);
            }


            let el = document.getElementById(container_id)
            let svgs = el.getElementsByTagName('svg')

            for (let svg of svgs) {
                let bBox = svg.getBBox();
                let width = bBox.width
                let height = bBox.height
                let canvas = document.createElement('canvas');
                canvas.width = width
                canvas.height = height
                let ctx = canvas.getContext('2d');
                let data = (new XMLSerializer()).serializeToString(svg);
                let DOMURL = window.URL || window.webkitURL || window;
                let img = new Image();
                let mime_type = 'image/svg+xml;charset=utf-8'
                let svgBlob = new Blob([data], {type: mime_type});
                let url = DOMURL.createObjectURL(svgBlob);
                img.onload = function () {
                    ctx.drawImage(img, 0, 0);
                    DOMURL.revokeObjectURL(url);

                    var imgURI = canvas
                        .toDataURL('image/png')
                        .replace('image/png', 'image/octet-stream');
                    triggerDownload(imgURI);
                };

                img.src = url;
            }
        },


        /**
         * <p>Downloads / saves an SVG file with the contents of a container</p>
         * <p>Note: all of the graphics made with this library create SVG elements, so just pass the same ID that you used to create the graphic in the first place</p>
         *
         * @param  {String} container_id - The ID of a container that has one or more SVG elements in it.
         * @memberOf EDO#export
         * @example
         *  let edo = new EDO()
         *  //Create a necklace graphic
         *  edo.show.necklace('container', [0,2,4,5,7,9,11])
         *
         *  //Save the graphic
         *  edo.export.svg('container') //downloads the necklace
         */
        svg: (container_id) => {
            if (environment == "server") return console.log("This is only support when run on client-side")
            let el = document.getElementById(container_id)
            let svgs = el.getElementsByTagName('svg')
            for (let svg of svgs) {
                let svgString = "<?xml version=\"1.0\" encoding=\"utf-8\"?>" + svg.outerHTML
                let a = document.createElement('a');
                a.download = container_id + '.svg';
                a.type = 'image/svg+xml';
                let blob = new Blob([svgString], {"type": "image/svg+xml"});
                a.href = (window.URL || webkitURL).createObjectURL(blob);
                a.click();
            }
        }

    }

    /**A collection of functions manipulating an input
     * @namespace EDO#get*/
    get = {
        /** <p>Returns the angle created on the necklace for a given trichord.</p>
         *
         * <p>If <code>a</code>, <code>b</code>, and <code>c</code>, are vertices of a triangle (trichord) on a necklace. This function returns the angle <code>abc</code>. That is, the angle node b has with a and c.</p>
         * @param  {Array<Number>} triplet - a triplet/trichord of 3 numbers (intervallic units)
         * @returns {Number} the angle in degrees
         * @memberOf EDO#get
         * @example
         * let edo = new EDO(12) // define a tuning system
         * edo.get.angle([0,3,6]) //returns 90

         */
        angle: (triplet) => {
            let diff1=Math.abs(triplet[0]-triplet[1])
            diff1=(diff1>Math.ceil(this.edo/2))?this.edo-diff1:diff1
            let diff2=Math.abs(triplet[1]-triplet[2])
            diff2=(diff2>Math.ceil(this.edo/2))?this.edo-diff2:diff2
            return ((180-diff1/12*360)/2) + ((180-diff2/12*360)/2)
        },

        /** <p>Given an array of scale degrees in cents, returns a Scale Object in the edo that best describes the pitches.</p>
         *
         * <p>If <code>a</code>, <code>b</code>, and <code>c</code>, are vertices of a triangle (trichord) on a necklace. This function returns the angle <code>abc</code>. That is, the angle node b has with a and c.</p>
         * @param  {Array<Number>} scale_in_cents - The scale in question represented in cents
         * @param  {Number} begin_edo - The smallest EDO to consider
         * @param  {Number} end_edo - The largest EDO to consider
         * @returns {Scale} A scale in the best fitting EDO
         * @memberOf EDO#get
         * @example
         * let edo = new EDO() // define a tuning system
         * edo.get.best_edo_from_cents([0,200,350,500,700,900,1100])
         * //returns the Scale Object [0,4,7,10,14,18,22] in a 24EDO context
         */
        best_edo_from_cents: (scale_in_cents,begin_edo=scale_in_cents.length+2,end_edo=24) => {
            let cents = scale_in_cents
            let diff = Infinity
            let min_edo = Infinity
            for (let i = begin_edo; i <= end_edo; i++) {
                let ed = new EDO(i)
                let edo_app = ed.get.notes_from_cents(cents)
                let edo_diff = edo_app.reduce((ag,e)=>ag+Math.abs(e.diff),0)
                if (edo_diff<diff) {
                    diff = edo_diff
                    min_edo = i
                }
            }
            let win_edo = new EDO(min_edo)
            return win_edo.scale(win_edo.get.notes_from_cents(cents).map(e=>e.note))
        },

        /** Returns the [x,y] coordinates of the nodes of the given pitches.
         * pitch
         * @param  {Array<Number> | Number} pitch - A pitch, or an array of pitches
         * @param  {Array<Number>} [circle_center=[0,0]] - The center of the circle
         * @param  {Number} [r=0.56418958354776] - The radius of the circle. By default the radius is of a circle with area=1
         * @returns {Array<Array<Number,Number>>} An array with tuples each corresponding to the x,y position of every pitch
         * @memberOf EDO#get
         * @see Scale#get.coordinates
         * @example
         * let edo = new EDO(12) //define context
         * edo.get.coordinates([0,3,7]) //minor triad
         * //returns
         * [
         *  [0,0.56418958354776],
         *  [0.56418958354776,3.454664838020213e-17],
         *  [-0.2820947917738801,-0.48860251190292314]
         * ]
         *
         */
        coordinates: (pitch,circle_center = [0,0],r=0.56418958354776	) => {
            if(Array.isArray(pitch)) return pitch.map(p=>this.get.coordinates(p,circle_center,r))
            const angle_mult = 360/this.edo
            pitch = this.mod(pitch,this.edo)
            const angle = (pitch*angle_mult)*(Math.PI/180)
            const x = (r*Math.sin(angle))+circle_center[0]
            const y = (r*Math.cos(angle))+circle_center[1]
            return [x,y]
        },

        /** <p>Returns a vector describing the contour of the given pitches.</p>
         *
         * <p>If local is set to true, every cell in the vector will be
         * either 1 if note n is higher than n-1, 0 if note n is the same as n-1, and -1 if note n is lower than n-1
         * For instance <code>[0,0,4,7,4,7,4,0]</code> will in local mode will return <code>[0,1,1,-1,1,-1,-1]</code></p>
         *
         * <p>If local is set to false (default), the contour of the line is expressed such that the actual pitch-class of the
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
        contour: (pitches, local = false) => {


            if (local) {
                let vector = []
                for (let i = 1; i < pitches.length; i++) {
                    if (pitches[i] > pitches[i - 1]) vector.push(1)
                    else if (pitches[i] == pitches[i - 1]) vector.push(0)
                    else vector.push(-1)
                }
                return vector
            } else {
                let catalog = {}
                let unique_pitches = this.get.unique_elements(pitches)
                unique_pitches = unique_pitches.sort((a, b) => a - b)
                for (let i = 0; i < unique_pitches.length; i++) {
                    catalog[unique_pitches[i]] = i
                }

                let vector = pitches.map((pitch) => catalog[pitch])
                return vector
            }

        },

        /**
         * <p>Extracts every possible contour motive from a given melody. </p>
         * <p>The function extracts every contour  subset appearing in the given melody.
         * The function also keeps track of the number of times each motive appeared.</p>
         * @param  {Array<Number>} melody - a collection of pitches to find (in order)
         * @param  {Boolean} [allow_skips=false] - if false, the search will only be done on consecutive items
         * @param  {Number} [maximal_length=8] - Do not look for motives longer than this value.
         * @return {Array<motives>}
         * @memberOf EDO#get
         * @function
         * @example
         * let edo = new EDO(12) // define a tuning system
         * edo.get.contour_motives([7,6,7,6,7,2,5,3,0]).slice(0,4) //get first 3 motives
         * //returns
         * [
         *   { motive: [ -1, 1 ], incidence: 2 }, //going a half-step down, then up appears twice
         *   { motive: [ -1 ], incidence: 2 }, //going a half-step down appears twice
         *   { motive: [ 1 ], incidence: 2 } //going a half-step up appears twice
         * ]
         */
        contour_motives: (melody, allow_skips = false,maximal_length=8) => {
            let motives = []
            let all_subsets = this.get.subsets(melody, allow_skips).map((subset) => this.get.contour(subset)).filter((contour) => contour.length > 1)
            all_subsets = all_subsets.filter(sub=>sub.length<=maximal_length)

            let unique_subsets = this.get.unique_elements(all_subsets)
            motives = unique_subsets.map((subset) => {
                let count = 0
                for (let i = 0; i < all_subsets.length; i++) {
                    if (this.is.same(subset, all_subsets[i])) count++
                }
                return {motive: subset, incidence: count}
            })
            motives = motives.sort((a, b) => b.incidence - a.incidence || b.motive.length - a.motive.length)
            return motives

        },

        /**
         * <p>From a given set of pitches, returns every combination (order specific) of size k</p>
         * <p>(For a similar function where the order doesn't matter use [EDO.get.n_choose_k()]{@link EDO#get.n_choose_k})
         * @param  {Array<Number>} set - The array from which to extract combinations
         * @param  {Number} k - The number of elements per set returned
         * @return {Array<Array<Number>>}
         * @memberOf EDO#get
         * @example
         * edo.get.combinations([1,3,5,7],2)
         * //returns
         * [[1,3],[3,1],[1,5],[5,1],[1,7],[7,1],[3,5],[5,3],[3,7],[7,3],[5,7],[7,5]]
         */
        combinations: (set, k) => {
            let combs = this.get.n_choose_k(set,k)
            combs = combs.map(e=>this.get.permutations(e))
            combs = combs.flat()
            combs = this.get.unique_elements(combs)
            return combs
        },

        /** <p>Returns the complementary interval (needed to complete the octave) for a given an interval class.</p>
         * @param {Number} interval - Some interval class
         * @returns {Number}
         * @memberOf EDO#get
         * @example
         * let edo = new EDO(12) // define a tuning system
         * edo.get.complementary_interval(3) //returns 9
         *
         */
        complementary_interval: (interval) => {
            return this.edo - interval
        },

        /** <p>Returns all the pitch-classes of the EDO that the scale does not use.</p>
         * <p>Remark: "pitch-classes" conform to the current tuning system used. E.g., 0-11 in 12EDO, 0-16 in 17EDO, etc.</p>
         * @param {boolean} [from_0=false] - when true, the output will be normalized to 0.
         * @returns {Array<Number>}
         * @memberOf EDO#get
         * @example
         * let edo = new EDO(12) // define a tuning system
         * edo.get.complementary_set([0,2,4,5,7,9,11])
         * //returns [1, 3, 6, 8, 10]
         *
         * edo.get.complementary_set([0,2,4,5,7,9,11],true)
         * //returns [0, 2, 5, 7, 9]
         */
        complementary_set: (pitches, from_0) => {
            let PCs = Array.from(Array(this.edo).keys())
            pitches.forEach((PC) => {
                (PCs.indexOf(PC) != -1) ? PCs.splice(PCs.indexOf(PC), 1) : true
            })
            if (from_0) PCs = this.scale(PCs, false).pitches
            return PCs
        },


        /** <p>Returns N step constituents such that they minimize the size between the smallest and largest constituents</p>
         * @param {Number} n - The numbers of desired steps
         * @returns {Array<Number>}
         * @memberOf EDO#get
         * @example
         * let edo = new EDO(12) // define a tuning system
         * edo.get.evenly_split(5) //returns [ 2, 2, 2, 3, 3 ]
         * edo.get.evenly_split(6) //returns [ 2, 2, 2, 2, 2, 2 ]
         * edo.get.evenly_split(7) //returns [ 1, 1, 2, 2, 2, 2, 2 ]
         * edo.get.evenly_split(8) //returns [ 1, 1, 1, 1, 2, 2, 2, 2 ]
         */
        evenly_split: (n) => {
            let intervals = []

            let edo = this.edo
            if (edo < n)
                return intervals
            else if (edo % n == 0) {
                intervals = Array.from(Array(n).fill(edo/n))
            } else {
                let zp = n - (edo % n);
                let pp = Math.floor(edo / n);
                for (let i = 0; i < n; i++) {
                    if (i >= zp) intervals.push((pp + 1))
                    else intervals.push(pp)

                }
            }
            return intervals
        },

        /** <p>Returns a chord progression of length <code>num_of_chords</code> using only <code>allowed_qualities</code>, with at least <code>common_notes_min</code> notes in common between every chord.</p>
         * @param {Array<Array<Number>>} allowed_qualities - A list of allowed chord qualities (regardless of transposition)
         * @param {Array<Number>} starting_chord - The first chord in the progression (using exact pitches and voicing)
         * @param {Number} [num_of_chords=4] - The number of chords the final progression shuold include.
         * @param {Number} [common_notes_min=2] - The minimal number of notes in common between every two succeeding chords in the progression.
         * @returns {Array<Array<Number>>}
         * @memberOf EDO#get
         * @example
         * let edo = new EDO(12) // define a tuning system
         * edo.get.harmonic_progression([[0,3,7],[0,4,7]],[1,4,7])
         * //returns e.g. [ [ 1, 4, 7 ], [ 11, 4, 7 ], [ 11, 2, 7 ], [ 10, 2, 7 ] ]
         */
        harmonic_progression: (allowed_qualities, starting_chord,num_of_chords=4, common_notes_min=2) => {
            let progression = [starting_chord]
            let escape=100
            while(progression.length<num_of_chords && escape>0) {
                let last_chord = progression[progression.length-1]
                let possibilities = []
                for(let quality of allowed_qualities) {
                    for (let i = 0; i < this.edo; i++) {
                        let trans = quality.map(n=>(n+i)%this.edo)

                        let in_common = this.count.common_tones(trans,last_chord)
                        if(in_common>=common_notes_min && in_common!=last_chord.length) possibilities.push(trans)
                    }
                }
                possibilities = this.get.unique_elements(possibilities)
                if(possibilities.length==0) {
                    escape--
                    continue
                }

                progression.push(this.shuffle_array(possibilities)[0])
            }
            for (let i = 1; i < progression.length; i++) {

                progression[i]=this.get.minimal_voice_leading(progression[i-1],progression[i])

            }
            return progression

        },

        /** <p>Returns a chord progression to harmonize a given melodies with given possible chord qualities.</p>
         * @param {Array<Number>} melody - The melody
         * @param {Array<Array<Number>>} allowed_qualities - A list of allowed chord qualities (regardless of transposition)
         * @param {Array<Number>} starting_chord - The first chord in the progression (using exact pitches and voicing)
         * @param {Number} [common_notes_min=1] - The minimal number of notes in common between every two succeeding chords in the progression.
         * @returns {Array<Array<Number>>}
         * @memberOf EDO#get
         * @example
         * let edo = new EDO(12) // define a tuning system
         * edo.get.harmonized_melody([7,4,5,2,4,0,2],[[0,4,7],[0,3,7]])
         * //returns e.g.
         * [
         *  [ 4, 7, 11 ],
         *  [ 4, 9, 0 ],
         *  [ 5, 9, 2 ],
         *  [ 7, 11, 2 ],
         *  [ 7, 0, 4 ],
         *  [ 9, 0, 4 ],
         *  [ 9, 2, 5 ]
         * ]
         */
        harmonized_melody: (melody,allowed_qualities,starting_chord, common_notes_min=1) => {
            let harmony = []
            let melody_copy = [...melody]
            let last_chord = starting_chord
            allowed_qualities = allowed_qualities.map(q=>this.scale(q, false).get.modes()).flat()

            melody_copy = melody_copy.map((note,i)=>{

                let options = allowed_qualities.map(q=>q.map(n=>(n+note)%this.edo).sort((a,b)=>a-b))
                if(last_chord && i==0) {
                    harmony.push(last_chord)
                    return last_chord
                }
                if(last_chord) {
                    options = options.filter(option => {
                        let in_common = this.count.common_tones(option,last_chord)
                        return in_common>=common_notes_min && in_common!=last_chord.length
                    })
                }
                let chord = this.shuffle_array(options)[0]
                harmony.push(chord)
                last_chord=chord
                return last_chord
            })

            for (let i = 1; i < harmony.length; i++) {
                if(harmony[i]==undefined || harmony[i-1]==undefined) continue
                harmony[i] = this.get.minimal_voice_leading(harmony[i-1],harmony[i])
            }

            console.log(harmony)

            return harmony

        },


        // /** <p>Returns all of the possible combinations of pitches on a harp (through pedaling).</p>
        //  * @param {Boolean} [as_intervals=false] - When true, the returned values are of the interval relationships between the pitches, and not the pitch classes.
        //  * @param {<Array<Number>} [strings_in_octave=[0,2,4,5,7,9,11]] - The tuning of the strings
        //  * @param {Array<Number>} [pedal_shift=[-1,0,1]] - The possible configurations of every pedal (how much does a configuration raise/lower the pitch)
        //  * @returns {Array<Array<Number>>}
        //  * @memberOf EDO#get
        //  * @example
        //  * let edo = new EDO(12) // define a tuning system
        //  * edo.get.harp_configurations()
        //  */
        // harp_configurations: (as_intervals=false,strings_in_octave=[0,2,4,5,7,9,11],pedal_shift = [-1,0,1],with_quality) => {
        //     strings_in_octave = strings_in_octave.map(s=>pedal_shift.map(p=>this.mod(s+p,this.edo)))
        //     let configurations = this.get.partitioned_subsets(strings_in_octave)
        //     if(with_quality) {
        //         configurations = configurations.filter(c=>this.scale(c).count.chord_quality(with_quality)>0)
        //     }
        //     if(as_intervals) {
        //         configurations = this.get.unique_elements(configurations.map(c=> {
        //             let min_index = c.indexOf(Math.min(...c))
        //             c = this.get.rotated(c,min_index)
        //             // console.log(c)
        //             let steps = this.convert.to_steps(c).map(c=>(this.edo-c<c)?c-this.edo:c)
        //             steps = steps.map(s=>{
        //                 if(s<-(this.edo/2)) return this.edo+s
        //                 else return s
        //             })
        //             return steps
        //         }))
        //
        //     }
        //     return configurations
        //
        // },

        /** <p>Returns all of the possible ways to achieve a certain chord quality on a harp.</p>
         * @param {Array<Number>} quality - The desired chord quality
         * @param {Array<Number>} [scordatura=[0,2,4,5,7,9,11]] - The tuning of the strings
         * @param {Array<Number>} [pedal_shift=[-1,0,1]] - The possible configurations of every pedal (how much does a configuration raise/lower the pitch)
         * @returns {Array<Object>}
         * @memberOf EDO#get
         * @example
         * let edo = new EDO(12) // define a tuning system
         * edo.get.harp_position_of_quality([0,1,2,3]) //find all possible chromatic tetrachord on a harp
         * //returns
         * [
         *  {
         *      strings: [ 6, 1, 7, 2 ], //the strings to be plucked
         *      pedals: [ 1, -1, 1, -1 ], //the pedals corresponding to the aforementioned strings
         *      pitches: [ 10, 11, 0, 1 ] //the resultant pitches
         *  },
         *  {
         *      strings: [ 5, 6, 7, 1 ],
         *      pedals: [ 1, 0, -1, -1 ],
         *      pitches: [ 8, 9, 10, 11 ]
         *  },
         *  {
         *      strings: [ 3, 4, 5, 6 ],
         *      pedals: [ 1, 1, 0, -1 ],
         *      pitches: [ 5, 6, 7, 8 ]
         *  },
         *  {
         *      strings: [ 2, 3, 4, 5 ],
         *      pedals: [ 1, 0, 0, -1 ],
         *      pitches: [ 3, 4, 5, 6 ]
         *  },
         *  {
         *      strings: [ 2, 4, 3, 5 ],
         *      pedals: [ 1, -1, 1, -1 ],
         *      pitches: [ 3, 4, 5, 6 ]
         *  },
         *  {
         *      strings: [ 6, 7, 1, 2 ],
         *      pedals: [ 1, 0, 0, -1 ],
         *      pitches: [ 10, 11, 0, 1 ]
         *  },
         *  {
         *      strings: [ 1, 2, 3, 4 ],
         *      pedals: [ 1, 0, -1, -1 ],
         *      pitches: [ 1, 2, 3, 4 ]
         *  },
         *  {
         *      strings: [ 7, 1, 2, 3 ],
         *      pedals: [ 1, 1, 0, -1 ],
         *      pitches: [ 0, 1, 2, 3 ]
         *  }
         * ]
         *
         */
        harp_position_of_quality: (quality,scordatura=[0,2,4,5,7,9,11],pedal_shift = [-1,0,1]) =>{
            let results = []
            let strings_in_octave_norm = scordatura.map(s=>pedal_shift.map(p=>this.mod(s+p,this.edo)))
            let configurations = this.get.partitioned_subsets(strings_in_octave_norm)
            configurations = configurations.map(c=>{
                for (let i = 0; i < this.edo; i++) {
                    let qual = quality.map(q=>(q+i)%this.edo)
                    if(this.is.subset(qual,c)) {
                        let positions = []
                        let transpositions = []
                        let pitches = []
                        qual.forEach(qu=>positions.push(c.indexOf(qu)+1))
                        positions.forEach(pos=>{

                            let res = -scordatura[pos-1]+c[pos-1]
                            if(!pedal_shift.includes(res)) {
                                if(res<0) res = this.mod(res+this.edo,this.edo)
                                else if (res>0) res = res-this.edo
                            }
                            pitches.push(c[pos-1])
                            transpositions.push(res)
                        })
                        results.push({strings:positions,pedals:transpositions,pitches:pitches})
                    }
                }

            })
            results = this.get.unique_elements(results)
            results = results.sort((a,b)=>{
                let ap = a['pitches']
                let bp = b['pitches']
                let len = ap.length
                for (let i = 0; i < len; i++) {
                    if(ap[i]!=bp[i]) return ap[i]-bp[i]
                }
            })
            return results
        },

        /** <p>Returns the pitches produced given a list of harp pedal transpositions (in ascending order, not harp pedal order).</p>
         * @param {Array<Number>} pedals - The configuration / transposition set be each pedal (e.g. [-1,0,0,0,1,0,0]) for Cb and G# in 12EDO
         * @param {Array<Number>} [scordatura=[0,2,4,5,7,9,11]] - The tuning of the strings
         * @returns {Array<Number>}
         * @memberOf EDO#get
         * @example
         * let edo = new EDO(12) // define a tuning system
         * edo.get.harp_pedals_to_pitches([0,0,0,0,0,1,-1]) 6th string sharpened, 7th string flattened
         * //returns
         * [0, 2, 4, 5, 7, 10, 10]
         *
         */
        harp_pedals_to_pitches: (pedals,scordatura=[0,2,4,5,7,9,11])=>{
            return scordatura.map((note,i)=>this.mod(note+pedals[i],this.edo))
        },

        harp_least_pedals_passage: (pitches,scordatura=[0,2,4,5,7,9,11],pedal_shift = [-1,0,1]) => {
            let strings_in_octave = scordatura.map(s=>pedal_shift.map(p=>this.mod(s+p,this.edo)))
            let configurations = this.get.partitioned_subsets(strings_in_octave)
            let paths = []

            let recurrent = (pitches,path=[]) => {
                let ml,mr
                let options
                for (let i = 0; i < pitches.length; i++) {
                    ml = pitches.slice(0,pitches.length-i)
                    mr = pitches.slice(pitches.length-i)
                    let unique = this.get.unique_elements(ml.map(n=>this.mod(n,this.edo)))
                    let uniquel = unique.length
                    if(uniquel>scordatura.length) continue
                    options = configurations.filter(conf=>this.is.subset(unique,conf))
                    if(options.length>0) break
                }
                if(!options) return
                options.forEach(opt=>{
                    if(mr.length==0) paths.push([...path,opt])
                    else recurrent(mr,[...path,opt])
                })





            }
            recurrent(pitches)


            let distances = paths.map((path)=>{
                return path.map((p,i)=>{
                    if(i==path.length-1) return 0
                    let ar1=path[i]
                    let ar2 = path[i+1]
                    let dist = 0
                    for (let j = 0; j < ar2.length; j++) {
                        if(ar1[j]!=ar2[j]) dist++
                    }
                    return dist
                })






            }).map(path=>path.reduce((ag,e)=>ag+e,0))
            let min = Math.min(...distances)
            let indexes = []
            distances.forEach((dist,i)=>{
                if(dist==min) indexes.push(i)
            })

            paths = paths.filter((path,i)=>indexes.includes(i))
            return {paths:paths,pedals:min}

        },

        /** <p>Fills in the missing pedals to the output of [EDO.get.harp_position_of_quality()]{@link EDO#get.harp_position_of_quality}.</p>
         * @param {Array<Object>} qualities - The output of @link EDO#get.harp_position_of_quality
         * @param {Array<Number>} [harp_default=[-1,-1,-1,-1,-1,-1,-1]] - The default configuration of the pedals
         * @param {Array<Number>} [scordatura=[0,2,4,5,7,9,11]] - The tuning of the strings when all pedals are not flattened nor sharpened.
         * @returns {Array<Number>}
         * @memberOf EDO#get
         */
        fill_partial_harp_pedaling: (qualities,harp_default=[-1,-1,-1,-1,-1,-1,-1],scordatura=[0,2,4,5,7,9,11])=> {
            qualities = qualities.map(q=>{
                let new_pedals = [...harp_default]
                q.strings.forEach((str,i)=>{
                    new_pedals[str-1]=q.pedals[i]
                })
                q.pedals=new_pedals

                return q
            })
            return qualities
        },





        /** <p>Returns the interval between two pitch classes.</p>
         * <p>Remark: "pitch classes" conform to the current tuning system used. E.g., 0-11 in 12EDO, 0-16 in 17EDO, etc.</p>
         * @param {Number} PC1 - The first pitch class
         * @param {Number} PC2 - The second pitch class
         * @returns {Array<Number>}
         * @memberOf Scale#get
         * @example
         * let edo = new EDO(12) // define a tuning system
         * edo.get.interval_class(1,8) //returns 5
         */
        interval_class: (PC1,PC2) => {
            let diff = Math.abs(PC1-PC2)
            return (diff<Math.ceil(this.edo/2))? diff : this.edo-diff

        },

        /** <p>Returns all combinations of size k from an array.</p>
         * @param {Array} arr - An array with elements
         * @param {Number} k=2 - The number of elements in each returned permutation
         * @returns {Array<Number>}
         * @memberOf EDO#get
         * @example
         * edo.get.n_choose_k([1,3,5,7],k=3)
         * //returns [ [ 1, 3, 5 ], [ 1, 3, 7 ], [ 1, 5, 7 ], [ 3, 5, 7 ] ]
         */
        n_choose_k: (arr,k=2) =>{
            let results = []
            const combinations = (arr,len,start_pos=0,result=Array(len)) =>{
                if(len==0) {
                    results.push([...result])
                    return
                }
                for (let i = start_pos; i <= arr.length-len ; i++) {
                    result[result.length-len] = arr[i]
                    combinations(arr,len-1,i+1,result)
                }
            }
            combinations(arr,k)
            return results
        },

        /** <p>Returns the closest approximation within the current EDO from a list of pitches in cents and the difference between the EDO version to the original in cents.</p>
         * @param {Array<Number>} cents - A list of pitches as cents
         * @returns {Array<Object>}
         * @memberOf EDO#get
         * @example
         * edo.get.notes_from_cents([0,157,325,498,655,834,1027])
         * //returns
         * [
         *  { note: 0, diff: 0 },
         *  { note: 2, diff: 43 },
         *  { note: 3, diff: -25 },
         *  { note: 5, diff: 2 },
         *  { note: 7, diff: 45 },
         *  { note: 8, diff: -34 },
         *  { note: 10, diff: -27 }
         * ]
         */
        notes_from_cents: (cents=[]) => {
            let step_in_cents = 1200/this.edo
            cents = cents
                .map(c=>this.mod(c,1200))
                .map(c=>{
                    let min = Math.floor(c/step_in_cents)
                    let min_in_cents = min*step_in_cents
                    let min_diff = c-min_in_cents
                    let max = Math.ceil(c/step_in_cents)
                    let max_in_cents = max*step_in_cents
                    let max_diff = max_in_cents-c
                    if(min_diff<max_diff) return {note:min,diff:-min_diff}
                    else return {note:max,diff:max_diff}
                })
            return cents
        },

        /** <p>Returns the ROUGHNESS OF SINE-PAIRS based on algorithm from Vassilakis, 2001 & 2005 .</p>
         * @param {Number} freq1 - the frequency of the 1st sine
         * @param {Number} freq2 - the frequency of the 2nd sine
         * @param {Number} [amp1=1] - the amplitude of the 1st sine
         * @param {Number} [amp2=1] - the amplitude of the 2nd sine
         * @returns {Number}
         * @memberOf Scale#get
         * @example
         * edo.get.sine_pair_dissonance(440,475) //returns 0.08595492117939352
         * @see http://www.acousticslab.org/learnmoresra/moremodel.html
         * @see Vassilakis, P. (2001). "Auditory roughness estimation of complex spectra—Roughness degrees and dissonance ratings of harmonic intervals revisited." The journal of the Acoustical Society of America 110(5): 2755-2755.
         */
        sine_pair_dissonance: (freq1,freq2,amp1=1,amp2=1) => {
            const f_min = Math.min(freq1,freq2)
            const f_max = Math.max(freq1,freq2)
            const a_min = Math.min(amp1,amp2)
            const a_max = Math.max(amp1,amp2)
            const X = a_min*a_max
            const Y = (2*a_min)/(a_min+a_max)
            const b1 = 3.5
            const b2=5.75
            const s1 = 0.0207
            const s2 = 18.96
            const s = 0.24/(s1*f_min+s2)
            const Z = Math.pow(Math.E,-1*b1*s*(f_max-f_min)) - Math.pow(Math.E,(-1*b2*s*(f_max-f_min)))
            const R = Math.pow(X,0.1)*0.5*Math.pow(Y,3.11)*Z
            return R

        },

        // /** <p>Returns the measure of dissonance of a given input based on Sethares' algorithm.</p>
        //  * @param {Array<Number>} ratios - An (ordered) array of ratios with root=1 (e.g. [1,1.5,1.66,2])
        //  * @param {Array<Number>} [amplitudes=[1,1...]] - An (ordered) array of corresponding amplitudes to each ratio (0<=amp<=1)
        //  * @param {Number} [base_freq=440] - The frequency to use as the basis for the calculation
        //  * @returns {Number} a number value of the measure of dissonance of the given input
        //  * @memberOf Scale#get
        //  * @example
        //  * let edo = new EDO(12) // define a tuning system
        //  * edo.get.dissonance_measure([1,2]) //returns 0.000009198921497239643
        //  *
        //  * edo.get.dissonance_measure([1,2],[1,0.5],110) //returns 0.029873544106178103
        //  *
        //  * @see https://sethares.engr.wisc.edu/consemi.html
        //  */
        // dissonance_measure: (ratios,amplitudes=Array.from(new Array(ratios.length).fill(1)),base_freq=440) => {
        //     ratios = ratios.map(r=>r*base_freq)
        //     const Dstar=0.24, S1=0.0207, S2=18.96, C1=5, C2=-5,
        //     A1=-3.51, A2=-5.75, firstpass=1, N=ratios.length
        //     let D=0
        //     for (let i = 2; i <= N; i++) {
        //         let Fmin = ratios.slice(0,N-i+1)
        //         let S = Fmin.map(e=>Dstar/(S1*e+S2))
        //         let slice1 = ratios.slice(i-1,N)
        //         let slice2 = ratios.slice(0,(N-i+1))
        //         let Fdif = []
        //         for (let j = 0; j < slice1.length; j++) {
        //             Fdif.push(slice1[j]-slice2[j])
        //         }
        //
        //         let aslice1 = amplitudes.slice(i-1,N)
        //         let aslice2 = amplitudes.slice(0,(N-i+1))
        //         let a = (aslice1.reduce((a,b)=>a+b,0)<aslice2.reduce((a,b)=>a+b,0))?aslice1:aslice2
        //
        //
        //         let calc1= Fdif.map((el,ind)=>Math.exp(el*S[ind]*A1)*C1)
        //         let calc2 = Fdif.map((el,ind)=>Math.exp(el*S[ind]*A2)*C2)
        //         let calcsum = calc1.map((el,ind)=>el+calc2[ind])
        //         let Dnew = calcsum.map((el,ind)=>el*a[ind])
        //         let Dnewsum = Dnew.reduce((a,b)=>a+b,0)
        //         D+=Dnewsum
        //     }
        //     return D
        //
        // },

        // /** <p>Returns mean (Sethares) dissonance value for every rotation of a given set.</p>
        //  * @param {Array<Number>} set - A set of pitches
        //  * @param {Boolean} normalize - when true, the value is divided by the number of pitches to make it easier to compare roughness of scales with different number of pitches
        //  * @returns {Number} a number value of the measure of dissonance of the given input
        //  * @memberOf Scale#get
        //  * @example
        //  * let edo = new EDO(12) // define a tuning system
        //  * edo.get.mean_set_dissonance([0,2,4,5,7,9,11]) //returns 4.846261636284487
        //  *
        //  * @see EDO#get.dissonance_measure
        //  */
        // mean_set_dissonance: (set,normalize=false)=>{
        //     set = set.sort((a,b)=>a-b)
        //     let modes = this.get.modes(set)
        //     let ratios = modes.map(m=>this.convert.interval_to_ratio(m))
        //     let dis = ratios.map(r=>this.get.dissonance_measure(r))
        //     let mean = dis.reduce((a,e)=>a+e,0)/dis.length
        //     if(normalize) mean = mean/set.length
        //     return mean
        // },

        /** <p>Expends / contracts the intervals between pitches of a melody.</p>
         * @param {Array<Number>} melody - The melody to be modified
         * @param {Number} resize_by - The amount by which the melody will be modified (can be positive/negative/fraction)
         * @param {String} [method="multiply"] - "add" to add resize by to any interval. "multiply" to multiply the intervals by the value.
         * @returns {Array<Number>}
         * @memberOf Scale#get
         * @example
         * let edo = new EDO(12) // define a tuning system
         * edo.get.resize_melody([0,2,4,5,7,5,4,2,-1,0],2)
         * //returns [0, 4, 8, 10, 14, 10, 8, 4, -2, 0]
         *
         * edo.get.resize_melody([0,2,4,5,7,5,4,2,-1,0],-1)
         * //[0,-2,-4,-5,-7,-5,-4,-2,1,0]
         *
         * edo.get.resize_melody([0,2,4,5,7,5,4,2,-1,0],-1,method='add')
         * //returns
         * [0,1,2,2,3,2,2,1,-1,-1]
         */
        resize_melody: (melody, resize_by = 2, method = "multiply") => {
            let note1 = melody[0]
            melody = this.convert.to_steps(melody)
            if (method == "add") {
                melody = melody.map((interval) => {
                    if (interval > 0) return (interval + resize_by > 0) ? interval + resize_by : 0
                    else if (interval < 0) return (interval - resize_by < 0) ? interval - resize_by : 0
                    else return 0
                })
            } else if (method == "multiply") melody = melody.map((interval) => Math.round(interval * resize_by))

            melody = this.convert.intervals_to_pitches(melody)
            return this.get.transposition(melody, note1, false)


        },

        /** <p>Returns a generated scale generated by a given generator, with a given cardinality.</p>
         * @param {Number} [generator=7] - The generator
         * @param {Number} [cardinality=7] - The cardinality (number of pitches)
         * @returns {Array<Number>}
         * @memberOf EDO#get
         * @example
         * let edo = new EDO(12) // define a tuning system
         * edo.get.generated_scale(7,5) // returns [0,2,4,7,9]
         * @see Balzano, G. J. (1980). "The group-theoretic description of 12-fold and microtonal pitch systems." Computer music journal 4(4): 66-84.
         * @see Carey, N. (2007). "Coherence and sameness in well-formed and pairwise well-formed scales." Journal of Mathematics and Music 1(2): 79-98.
         * @see Carey, N. and D. Clampitt (1989). "Aspects of well-formed scales." Music Theory Spectrum 11(2): 187-206.
         */
        generated_scale: (generator=7,cardinality=7,return_object=false) =>{
            let scale = []
            for (let i = 0; i < cardinality ; i++) {
                scale.push(this.mod(generator*i,this.edo))
            }
            scale = this.get.normal_order(scale.sort((a,b)=>a-b))
            return scale
        },

        /** <p>Returns every IC that by iteratively adding it to 0, produces all of the pitches of the tuning space.</p>
         * @see Balzano, G. J. (1980). "The group-theoretic description of 12-fold and microtonal pitch systems." Computer music journal 4(4): 66-84.
         * @param {Boolean} [with_complement_interval=false] - When true the complementary intervals will be included (e.g. in 12EDO IC>6)
         * @returns {Array<Number>}
         * @memberOf EDO#get
         * @example
         * let edo = new EDO(12) // define a tuning system
         * edo.get.generators()
         * //returns [1,5]
         *
         * edo.get.generators(true)
         * //returns [[1,11],[5,7]]
         */
        generators: (with_complement_interval = false) => {
            let generators = []
            for (let i = 1; i < Math.ceil(this.edo / 2); i++) {

                let arr = Array.from(Array(this.edo).keys()).map((ind) => this.mod(ind * i, this.edo))
                arr = this.get.unique_elements(arr)
                if (arr.length == this.edo) generators.push(i)
            }
            if (with_complement_interval) generators = generators.map((el) => [el, this.get.complementary_interval(el)])
            return generators
        },

        /** <p>Returns the elements that are found in all given sets</p>
         * @param {...Array<Number>} collections - Any number of arrays containing pitches
         * @returns {Array<Number>}
         * @memberOf EDO#get
         * @example
         * let edo = new EDO(12) // define a tuning system
         * edo.get.intersection([1,2,3,4],[3,4,5,6])
         * //returns [3,4]
         *
         * edo.get.intersection([1,2,3,4],[3,4,5,6],[2,4])
         * //returns [4]
         */
        intersection: (...collections) => {
            let first = collections[0]
            for (let i = 1; i < collections.length; i++) {
                first = first.filter(value => collections[i].includes(value))
            }
            return first

        },

        /** Gets a melody represented as intervals, and returns the interval traversed by the end.
         * @param  {Array<Number>} intervals - Melody represented in intervals
         * @returns {Number} the interval traversed by the melody
         * @memberOf EDO#get
         * @example
         * let edo = new EDO(12) // define a tuning system
         * edo.get.interval_traversed([2,-3,4,-1])
         * //returns 2 (moving up 2, then down 3, then up 4, then down 1 will get you +2 above where you started)
         */
        interval_traversed: (intervals) => {
            /*Gets an array of intervals in order, and returns the interval traversed by the end*/
            return intervals.reduce((t, e) => t + e)
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
        interval_stack: (intervals, stack_size = 3, as_pitches = false) => {
            const decToBase = (n, b) => {
                if (n == 0) return [0]
                let digits = []
                while (n) {
                    digits.push(n % b)
                    n = Math.floor(n / b)
                }
                digits.reverse()
                return digits
            }

            let all_perm = []
            intervals = this.get.unique_elements(intervals)
            let base = intervals.length
            let mapping = {}
            let result = []
            for (let i = 0; i < intervals.length; i++) mapping[i] = intervals[i]
            let max = base ** stack_size
            for (let i = 0; i < max; i++) {
                let res = decToBase(i, base)
                let fill_in = stack_size - res.length
                fill_in = Array(fill_in).fill(0)
                all_perm.push([...fill_in, ...res])
            }
            for (let vector of all_perm) {
                result.push(vector.map((el) => mapping[el]))
            }
            result.sort((a, b) => a.reduce((t, e) => t + e) - b.reduce((t, e) => t + e))
            if (as_pitches) {
                let pitches = []
                for (let l of result) {
                    let ls = [0]
                    for (let item of l) {
                        ls.push(ls[ls.length - 1] + item)
                    }
                    pitches.push(ls)
                }
                result = pitches
            }
            return result
        },

        /** Returns the inversion of a given set of pitches
         *
         * @param  {Array<Number>} scale - a collection of pitches (not necessarily pitch-classes)
         * @param  {Boolean} cache - if true, the result will be cached for faster retrieval
         * @return {Array<Number>} The inverted input
         * @memberOf EDO#get
         * @example
         * let edo = new EDO(12) // define a tuning system
         * edo.get.inversion([0,2,4,5,7,9,11]) //univertable collection
         * //returns [0, 2,  4, 6, 7, 9, 11]*/
        inversion: (scale, cache = true) => {
            if(this.cat_getset(["scale_"+scale,'inverted'])) return this.cat_getset(["scale_"+scale,'inverted'])

            let steps = this.convert.to_steps(scale)
            let r_steps = [...steps]
            r_steps.reverse()

            let i_scale = this.convert.intervals_to_scale(r_steps)
            if (cache) this.cat_getset(["scale_"+scale,'inverted'],i_scale)
            return i_scale
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
        lattice: (hor = 3, ver = 4, as_notes = false) => {
            let lattice = ""
            for (let i = this.edo; i >= -this.edo; i -= ver) {
                let line = ""
                for (let j = 0; j < this.edo; j++) {
                    let num = this.mod(i + (j * hor), this.edo)
                    let note
                    if (as_notes) note = this.convert.pc_to_name(num)
                    else note = String(num)
                    line += note + " ".repeat(3 - note.length)
                }
                lattice += line + "\n\n"
            }
            return lattice
        },

        /** <p>Returns the Levenshtein distance from one collection of pitches to another</p>
         * @param {Array<Number>} collection1 - A collection of pitches
         * @param {Array<Number>} collection1 - Another collection of pitches
         * @param {Boolean} [ratio_calc=false] - When true, the function computes the
         * levenshtein distance ratio of similarity between two collections
         * @returns {Number}
         * @example
         * let edo = new EDO(12) //define tuning
         * edo.get.levenshtein([0,2,4,7,9],[0,2,4,5,7,9,11]) //returns 2
         *
         * @example
         * edo.get.levenshtein([0,2,4,7,9],[0,2,4,5,7,9,11],true) //returns 0.9230769230769231
         * @memberOf EDO#get*/
        levenshtein: (collection1,collection2, ratio_calc = false) => {



            let s = collection1
            let t = collection2

            //initialize matrix with 0

            let rows = s.length + 1
            let cols = t.length + 1
            let distance = Array.from({length: rows}, e => Array(cols).fill(0));
            let col
            let row
            //Populate matrix of zeros with the indices of each character of both strings
            for (let i = 1; i < rows; i++) {
                for (let k = 1; k < cols; k++) {

                    distance[i][0] = i
                    distance[0][k] = k
                }
            }

            // Iterate over the matrix to compute the cost of deletions,insertions and/or substitutions
            let cost = 0
            for (col = 1; col < cols; col++) {
                for (row = 1; row < rows; row++) {
                    if (s[row - 1] == t[col - 1]) cost = 0 //If the characters are the same in the two strings in a given position [i,j] then the cost is 0
                    else {
                        // In order to align the results with those of the Python Levenshtein package, if we choose to calculate the ratio
                        // the cost of a substitution is 2. If we calculate just distance, then the cost of a substitution is 1.
                        if (ratio_calc) cost = 2
                        else cost = 1
                    }
                    let res = Math.min.apply(Math, [distance[row - 1][col] + 1, distance[row][col - 1] + 1, distance[row - 1][col - 1] + cost])
                    distance[row][col] = res
                }
            }
            if (ratio_calc) {
                let Ratio = ((s.length + t.length) - distance[row - 1][col - 1]) / (s.length + t.length)

                return Ratio
            } else {
                return distance[s.length][t.length]
            }
        },

        // /** <p>Returns a "likely" root from a collection of pitches</p>
        //  *  <p>Given a set of pitches, the algorithm returns the pitch that contains the other pitches in lower positions in its overtone series.<br>
        //  *      E.g. If we consider C-E-G <code>(0,4,7)</code>, E and G appear as overtones of C at lower positions than C and G appear as overtones of E, and C and E as overtones of G.</p>
        //  *      <p>Note: a root can be highly dependent on context, therefore this algorithm at its current state cannot provide a decisive answer.</p>
        //  * @param  {Array<Number>} pitches - a collection of pitch classes
        //  * @param  {Array<Number>} [limit=19] - The overtone limit by which pitch-classes are approximated
        //  * @return {Number} The pitch-class of the likely root.
        //  * @memberOf EDO#get
        //  * @example
        //  * let edo = new EDO(12) // define a tuning system
        //  * edo.get.likely_root([0,5,9])
        //  * //returns 5*/
        // likely_root: (pitches, limit = 17) => {
        //     pitches = this.get.unique_elements(pitches).sort((a, b) => a - b)
        //     let catalog = {}
        //     let ratios = this.get.modes(pitches)
        //         .map((mode) =>
        //             mode.filter((interval) => interval != 0)
        //                 .map((interval) => this.get.ratio_approximation(interval, limit).octave)
        //                 .reduce((a, e) => a + e)
        //         )
        //
        //     let min = Math.min.apply(Array, ratios)
        //     let pos = ratios.indexOf(min)
        //     return pitches[pos]
        // },

        // likely_root2: (pitches) => {
        //     let scale = this.scale(pitches)
        //     let modes = scale.get.modes()
        //     modes = modes.map((mode,i)=>{
        //         // mode.tiers = {
        //         //     1:[], //has a 5th, has a 3rd, can be stacked in 3rds
        //         //     2:[], //has a 5th, has a 3rd, has no contradictions [1,2,3,5]
        //         //     3:[], //has a 5th, has a 3rd, has contradictions but not with 5th and 3rd [1,2,2,3,5]
        //         //     4:[], //has a 5th, has a 3rd, has contradictions but not with BOTH 5ths and 3rds [1,2,3,3,5] / [1,2,3,5,5]
        //         //     5:[], //has a 5th, has a 3rd, has contradictions with both 5ths and 3rds [1,2,3,3,5,5]
        //         //     6:[], //has a 5th, has NO 3rd, has no contradictions [1,5,7]
        //         //     7:[], //has a 5th, has NO 3rd, has contradictions [1,5,5,7] / [1,5,7,7]
        //         //     8:[], //has no 5th, has no contradictions [1,2,3,4,6,7]
        //         //     9:[] //has no 5th, has contradiction [1,2,3,3,6,7]
        //         // }
        //         // let roles = this.scale(mode).get.scale_degree_roles()
        //         // mode.tiers[1].push(...roles.filter(r=>(r.indexOf(5)!=-1 && r.indexOf(3)!=-1 && this.get.unique_elements(r).length==r.length)))
        //         // edo.get.stacked(set1.pitches,[3,4])
        //         // console.log(mode.tiers)
        //         // return mode
        //         console.log(this.get.stacked(mode,[3,4]))
        //     })
        // },



        /** Returns the Maximal number of differences for a a scale of cardinality N
         * @param  {Number} N - The cardinality of the scale (how many pitches it has)
         * @return {Number}
         * @memberOf EDO#get
         * @example
         * let edo = new EDO() // create a tuning context
         * edo.get.maximal_rahn_difference(7) //maximal rahn difference for a scale of length 7
         * //returns 126
         * @see Rahn, J. (1991). "Coordination of interval sizes in seven-tone collections." Journal of Music Theory 35(1/2): 33-60.
         * @see Carey, N. (2007). "Coherence and sameness in well-formed and pairwise well-formed scales." Journal of Mathematics and Music 1(2): 79-98.
         * */
        maximal_rahn_difference: (N) => {
            return (N*(N-1)*(N-1))/2
        },

        /** Returns the Maximal number of coherence failures as described in the paper by Carey (see citation)
         * This agrees with Balzano coherency and Rothenberg Propriety, but provides a continues measure rather than a discrete one.
         * @param  {Number} N - The cardinality of the scale (how many pitches it has)
         * @return {Number}
         * @memberOf EDO#get
         * @example
         * let edo = new EDO() // create a tuning context
         * edo.get.maximal_carey_coherence_failures(7) * //returns 140

         * @see Carey, N. (2007). "Coherence and sameness in well-formed and pairwise well-formed scales." Journal of Mathematics and Music 1(2): 79-98.
         * @see Rahn, J. (1991). "Coordination of interval sizes in seven-tone collections." Journal of Music Theory 35(1/2): 33-60.
         * */
        maximal_carey_coherence_failures: (N) => {
            return (N*(N-1)*(N-2)*((3*N)-5))/24
        },

        /**
         * <p>Returns the disposition of <code>chord2</code> that minimizes movement from <code>chord1</code>.</p>
         * <p>Note: <code>chord1</code> and <code>chord2</code> must have the same number of pitches</p>
         * @param  {Array<Number>} chord1 - an origin chord in some disposition
         * @param  {Array<Number>} chord2 - an destination chord
         * @returns {Array<Number>}
         * @memberOf EDO#get
         * @example
         * let edo = new EDO(12) // define a tuning system
         * edo.get.minimal_voice_leading([7,0,3],[4,8,11])
         * //returns [8,11,4]
         * */
        minimal_voice_leading: (chord1, chord2) => {
            let permutations = this.get.permutations(chord2)
            let dist = permutations.map(perm=>{
                perm = perm.map((n,i)=>{
                    let res = Math.abs(perm[i]-chord1[i])
                    res = (res>Math.ceil(this.edo/2))?this.edo-res:res
                    return res
                }).reduce((a,el)=>a+el,0)
                return perm
            })
            let min = dist.reduce((min,el)=>(el<min)?el:min,Infinity)
            let pos = dist.indexOf(min)

        return permutations[pos]






        },

        /** Returns the normal order of a given set of pitches
         * <p>Remark: "intervallic units" conform to the current tuning system used. E.g., 0-11 in 12EDO, 0-16 in 17EDO, etc.</p>
         * @param  {Array<Number>} scale - a collection of pitch-classes
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
        modes: (scale, cache = true, avoid_duplications = true) => {
            let edo = this.edo
            if(this.cat_getset(["scale_"+scale,'modes'])) return this.cat_getset(["scale_"+scale,'modes'])



            let length = scale.length
            let doubled = scale.concat(scale)


            let modes = []

            for (let i = 0; i < length; i++) {
                let shift = this.edo - doubled[i]
                let mode = doubled.slice(i, i + length)
                mode = mode.map((el) => (el + shift) % this.edo)
                modes.push(mode)
            }
            if (avoid_duplications) modes = this.get.unique_elements(modes)
            if (cache) this.cat_getset(["scale_"+scale,'modes'],modes)

            return modes
        },

        /**
         * <p>Extracts every possible "motive" from a given melody.</p>
         * <p>A motive can be intervalic (default) such that it looks at the intervallic units rather than the pitch classes.
         * The function also keeps track of the number of times each motive appeared.</p>
         * <p>Remark: "intervals" conform to the current tuning system used. E.g., 0-11 occupy 1 octave in 12EDO, 0-16 in 17EDO, etc.</p>
         * @param  {Array<Number>} melody - a collection of pitches to find (in order)
         * @param  {Boolean} [intervallic=true] - looks at the intervals rather than the pitch classes.
         * @param  {Boolean} [allow_skips=true] - if false, the search will only be done on consecutive items
         * @param  {Number} [maximal_length=8] - Do not look for motives longer than this value
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
        motives: (melody, intervallic = true, allow_skips = false,maximal_length=8) => {
            let motives = []
            if (!intervallic) {
                let all_subsets = this.get.unique_elements(this.get.subsets(melody, allow_skips).filter(s=>s.length<=maximal_length))
                all_subsets.forEach((subset) => {
                    let incidence = this.get.subset_indices(subset, melody, allow_skips).length
                    motives.push({motive: subset, incidence: incidence})
                })
            } else {
                let all_subsets = this.get.subsets(melody, allow_skips).filter(s=>s.length<=maximal_length).map((subset) => this.convert.to_steps(subset))
                let unique_subsets = this.get.unique_elements(all_subsets)

                motives = unique_subsets.map((subset) => {
                    let count = 0
                    for (let i = 0; i < all_subsets.length; i++) {
                        if (this.is.same(subset, all_subsets[i])) count++
                    }
                    return {motive: subset, incidence: count}
                })
            }


            motives = motives.filter((motive) => motive.motive.length > 0)
            motives = motives.sort((a, b) => b.incidence - a.incidence || b.motive.length - a.motive.length)

            return motives
        },

        /** Returns all necklaces from a given set of steps
         * <p>Remark: "intervals" conform to the current tuning system used. E.g., 0-11 occupy 1 octave in 12EDO, 0-16 in 17EDO, etc.</p>
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
        necklace: (lst) => {
            let necklaces = []
            let unique_steps = this.get.unique_elements(lst)
            let map = {}
            let n = []
            unique_steps.forEach((step, i) => {
                map[i] = step
                let count = lst.reduce((t, el) => {
                    return (el == step) ? t + 1 : t
                }, 0)
                n.push(count)
            })
            let mynecklace = new FixedContentNecklace(n)

            let result = Array.from(mynecklace.execute('fast'))

            result.forEach((entry) => {
                let new_arr = entry.map((el) => map[el])
                necklaces.push(new_arr)
            })
            return necklaces
        },

        /** Returns the pitch and its position where it first appeared in a melody
         * @param  {Array<Number>} melody - a melody to be analyzed
         * @param  {Boolean} as_PC - when true, the algorithm views all notes as similar if they belong to the same PC
         * @return {Array<Array<Number>>} a "tuple" of [pitch,position]
         * @memberOf EDO#get
         * @example
         * let edo = new EDO(12)
         * edo.get.new_pitches([2,1,0,5,4,3,0,2,8,4,1,0,9,1])
         * //returns
         * [
         *  [2, 0],
         *  [1, 1],
         *  [0, 2],
         *  [5, 3],
         *  [4, 4],
         *  [3, 5],
         *  [8, 8],
         *  [9, 12],
         * ]
         * */
        new_pitches: (melody, as_PC = true) => {
            let result = []
            let seen = []

            for (let i = 0; i < melody.length; i++) {
                if (as_PC) {
                    if (seen.indexOf(this.mod(melody[i], this.edo)) == -1) {
                        seen.push(melody[i])
                        result.push([melody[i], i])
                        if (seen.length == this.edo) break
                    }
                } else {
                    if (seen.indexOf(melody[i]) == -1) {
                        seen.push(melody[i])
                        result.push([melody[i], i])
                    }
                }
            }
            return result
        },

        /** Returns all the ngrams up to a given n from a given melody.
         * @param  {Array<Number>} melody - a melody to be analyzed
         * @param  {Number} [n=3] - The maximal length ngram to be generated
         * @return {Array<Object>} A dictionary that given an ngram key, returns the prediction.
         * @memberOf EDO#get
         * @example
         * let edo = new EDO(12) //Create a tuning context
         * edo.get.ngrams([4,4,5,7,7,5,4,2,0,0,2,4,4,2,2])
         * //returns
         * {
         *  '0': [ 0, 2 ],
         *  '2': [ 0, 4, 2 ],
         *  '4': [ 4, 5, 2, 4, 2 ],
         *  '5': [ 7, 4 ],
         *  '7': [ 7, 5 ],
         *  '4 4': [ 5, 2 ],
         *  '4 5': [ 7 ],
         *  '5 7': [ 7 ],
         *  '7 7': [ 5 ],
         *  '7 5': [ 4 ],
         *  '5 4': [ 2 ],
         *  '4 2': [ 0, 2 ],
         *  '2 0': [ 0 ],
         *  '0 0': [ 2 ],
         *  '0 2': [ 4 ],
         *  '2 4': [ 4 ]
         * }
         * */
        ngrams: (melody, n = 3) => {
            let ngrams = {}
            for (; n > 1; n--) {
                for (let i = 0; i < melody.length - (n - 1); i++) {
                    let key = []
                    for (let j = i; j < i + (n - 1); j++) {
                        key.push(melody[j])
                    }
                    key = key.join(' ')
                    if (Array.isArray(ngrams[key])) ngrams[key].push(melody[i + (n - 1)])
                    else ngrams[key] = [melody[i + (n - 1)]]
                }
            }
            return ngrams
        },

        /** Returns the normal order of a given set of pitches
         * <p>Remark: "pitch classes" conform to the current tuning system used. E.g., 0-11 in 12EDO, 0-16 in 17EDO, etc.</p>
         * @param  {Array<Number>} lst - a collection of pitch-classes
         * @param  {Boolean} cache - if true, the result will be cached for faster retrival
         * @return {Array<Number>} The normal order of the input
         * @memberOf EDO#get
         * @example
         * let edo = new EDO(12) //Create a tuning context
         * edo.get.normal_order([0,2,4,5,7,9,11])
         * //returns [ 0, 1, 3, 5, 6, 8, 10 ]*/
        normal_order: (lst, cache = true) => {
            if (lst.length == 0) return []
            let edo = this.edo
            if(this.cat_getset(["scale_"+lst,'normal_order'])) return this.cat_getset(["scale_"+lst,'normal_order'])


            let pitches = []
            lst.forEach((pitch) => {
                pitches.push(pitch % this.edo)
            })


            pitches = this.get.unique_elements(pitches)

            pitches.sort((a, b) => a - b)
            let modes = this.get.modes(pitches)
            let organize = function (modes)     {
                let smallest = edo
                let filtered_modes = []
                modes.forEach(mode => {
                    if (mode[mode.length - 1] < smallest) smallest = mode[mode.length - 1]
                })
                modes.forEach(mode => {
                    if (mode[mode.length - 1] == smallest) filtered_modes.push(mode)
                })
                if (filtered_modes.length == 1) return filtered_modes[0]
                else {
                    let last = filtered_modes[0][filtered_modes[0].length - 1]
                    let truncated_modes = filtered_modes.map((mode) => {
                        return mode.slice(0, -1)
                    })
                    let normal_order = organize(truncated_modes)
                    normal_order.push(last)
                    return normal_order
                }
                return 0
            }

            let result = organize(modes)
            if (cache) this.cat_getset(["scale_"+lst,'normal_order'],result)
            return result
        },

        /** Returns the given pitches, stacked using the given intervals
         * @param  {Array<Number>} pitches - a collection of pitches
         * @param  {Array<Number>} intervals - The intervals with which to stack
         * @param  {Boolean} transposed_to_0 - When true, the returned sets will be transposed to start from 0
         * @return {Array<Array<Number>>} All the stacks that can be created with the given pitches using the given intervals
         * @memberOf EDO#get
         * @example
         * let edo = new EDO(12) //Create a tuning context
         * edo.get.stacked([0,2,4,6,9],[3,4])
         * //returns [ [ 2, 6, 9, 12, 16 ] ]
         *
         * edo.get.stacked([0,2,4,6,9],[3,4,5],true)
         * //returns [ [ 0, 4, 9, 14, 18 ], [ 0, 4, 7, 10, 14 ] ]
         * */
        stacked: (pitches, intervals,transposed_to_0=false) => {
            let perms = this.get.permutations(pitches)

            let available =[]
            for (let perm = 0; perm < perms.length; perm++) {
                let p = perms[perm]
                for (let i = 0; i <p.length; i++) {
                    if(i==0) 1+1
                    let multiplier =1
                    while(p[i]<p[i-1]) {
                        p.splice(i,1,p[i]+(this.edo*multiplier))
                        multiplier++
                    }
                    if(intervals.indexOf(p[i]-p[i-1])==-1 && i!=0) {
                        p=false
                        continue
                    }
                }
                if(p) {
                    if(transposed_to_0) available.push(this.get.transposition(p,p[0]*-1,false))
                    else available.push(p)
                }
            }
            return available
        },


        /** Returns the maximal sum of step difference from the mean in a scale of that cardinality
         * @param  {Number} cardinality - the number of notes in a scale
         * @return {Number} The maximal sum of step error from the mean a scale in that cardinality can have
         * @memberOf EDO#get
         * @example
         * let edo = new EDO(12) //Create a tuning context
         * edo.get.step_maximal_mean_error_in_cardinality(7) //returns 8.571428571428571
         * */
        step_maximal_mean_error_in_cardinality: (cardinality) => {
            let steps = Array.from(Array(cardinality-1).fill(1))
            let scale = this.scale(this.convert.intervals_to_scale(steps), false)
            return scale.get.step_mean_error()
        },

        /** Returns the minimal sum of step difference from the mean in a scale of that cardinality
         * @param  {Number} cardinality - the number of notes in a scale
         * @return {Number} The minimal sum of step error from the mean a scale in that cardinality can have
         * @memberOf EDO#get
         * @example
         * let edo = new EDO(12) //Create a tuning context
         * edo.get.step_minimal_mean_error_in_cardinality(7) //returns 2.8571428571428568
         * */
        step_minimal_mean_error_in_cardinality: (cardinality) => {
            let split = this.get.evenly_split(cardinality)
            let scale = this.scale(this.convert.intervals_to_scale(split), false)
            return scale.get.step_mean_error()
        },

        /** Returns the maximal and minimal sums of step difference from the mean in a scale of that cardinality
         * @param  {Number} cardinality - the number of notes in a scale
         * @return {Object} The minimal and maximal sum of step error from the mean a scale in that cardinality can have
         * @memberOf EDO#get
         * @see EDO#get.step_minimal_mean_error_in_cardinality()
         * @see EDO#get.step_maximal_mean_error_in_cardinality()
         * @example
         * let edo = new EDO(12) //Create a tuning context
         * edo.get.step_min_max_mean_error_in_cardinality(7)
         * //returns { min: 2.8571428571428568, max: 8.571428571428571 }
         * */
        step_min_max_mean_error_in_cardinality: (cardinality) => {
            return {min:this.get.step_minimal_mean_error_in_cardinality(cardinality),max:this.get.step_maximal_mean_error_in_cardinality(cardinality)}
        },

        /** Returns the maximal and minimal sums of step difference possible in that tuning system
         * @param  {Boolean} [cache=true] - option caching for faster retrival
         * @return {Object} The minimal and maximal sum of step error from the mean a scale in that tuning system
         * @memberOf EDO#get
         * @see EDO#get.step_minimal_mean_error_in_cardinality()
         * @see EDO#get.step_maximal_mean_error_in_cardinality()
         * @see EDO#get.step_min_max_mean_error_in_cardinality()
         * @example
         * let edo = new EDO(12) //Create a tuning context
         * edo.get.step_min_max_error_in_EDO()
         * //returns { min: 0, max: 12 }
         * */
        step_min_max_error_in_EDO: (cache=true) => {
            if(this.cat_getset(["min_max_error_in_EDO"])) return this.cat_getset(["min_max_error_in_EDO"])
            let arr = []
            for (let i = 2; i <= this.edo; i++) arr.push(this.get.step_min_max_mean_error_in_cardinality(i))
            let min = arr.sort((a,b)=>a['min']-b['min'])[0]['min']
            let max = arr.sort((a,b)=>b['max']-a['max'])[0]['max']
            let result = {min:min,max:max}
            if(cache) this.cat_getset(["min_max_error_in_EDO"],result)
            return result
        },

        /** Returns the elements of array1, but not if they are found in array 2
         * @param  {Array<Number>} array1 - a collection of numbers (pitch-classes, or anything for that matter)
         * @param  {Array<Number>} array2 - a collection of numbers (PCs or any)
         * @param  {Boolean} [normal=false] - when true, the returned set will be in normal order
         * @return {Array<Number>} All of the elements of array1 that are not in array2
         * @memberOf EDO#get
         * @example
         * let edo = new EDO(12) //Create a tuning context
         * edo.get.without([0,1,3,4,6,7,9,10],[0,4,9])
         * //returns [1,3,6,7,10]
         *
         * edo.get.without([0,1,3,4,6,7,9,10],[0,4,9],true)
         * //returns [0,2,5,6,9]*/
        without: (array1, array2, normal = false) => {
            let copy = [...array1]
            array2.forEach((note) => {
                do {
                    var index = copy.indexOf(note);
                    if (index != -1) copy.splice(index, 1);
                } while (index!=-1)

            })
            if (normal) copy = this.get.normal_order(copy)

            return copy
        },

        /**
         * <p>Gets an array with element-wise possibilities, and returns every subset given these possibilities</p>
         * <p>For instance, given <code>[4,[7,8],[9,10,11]]</code> the function will return every set starting with 4, with EITHER 7 or 8 in the 2nd position, and EITHER 9, 10, or 11 in the 3rd. </p>
         * @param  {Array<Number>} arr - element-wise possibilities
         * @example
         * edo.get.partitioned_subsets([4,[7,8],[10,11]])
         * //returns
         * [ [ 4, 7, 10 ], [ 4, 7, 11 ], [ 4, 8, 10 ], [ 4, 8, 11 ] ]
         * @return {Array<Array<Number>>}
         * @memberOf EDO#get
         */
        partitioned_subsets: (arr) => {
            arr = arr
                .map((el) => !Array.isArray(el) ? [el] : el)

            let findings = []
            const recur = function (sub) {

                for (let i = 0; i < sub.length; i++) {
                    if (sub[i].length > 1) {
                        sub[i].forEach((el) => {
                            if (i < sub.length - 1) {
                                let thing = [...sub.slice(0, i), [el], ...sub.slice(i + 1)]
                                recur(thing)
                            } else {
                                findings.push([...sub.slice(0, i), [el]])
                            }
                        })
                        break
                    } else {
                        if (i == sub.length - 1) findings.push(sub)
                    }
                }
            }

            recur(arr)
            findings = findings.map((subset) => subset.map((el) => el[0]))
            return findings


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
        path_n_steps: (destination, motives = [], n_steps = 8) => {
            const up_motives = motives.filter((m) => this.get.interval_traversed(m) > 0)
            const down_motives = motives.filter((m) => this.get.interval_traversed(m) < 0)
            const static_motives = motives.filter((m) => this.get.interval_traversed(m) == 0)
            let success = []
            const run_it = function (used = []) {
                let sum = used.flat().reduce((t, e) => t + e, 0)
                let length = used.flat().length
                if (length > n_steps || (length == n_steps && sum != destination)) return null
                if (length == n_steps && sum == destination) return used
                if (sum < destination) {
                    for (let i = 0; i < up_motives.length; i++) {
                        let result = run_it(used.concat([up_motives[i]]))

                        if (result != null) success.push(result)
                    }
                } else if (sum > destination) {
                    for (let i = 0; i < down_motives.length; i++) {
                        let result = run_it(used.concat([down_motives[i]]))
                        if (result != null) success.push(result)
                    }
                }
                for (let i = 0; i < static_motives.length; i++) {
                    let result = run_it(used.concat([static_motives[i]]))
                    if (result != null) success.push(result)
                }

            }
            run_it()

            return this.get.unique_elements(success)
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
        path_on_tree: (intervals, path, starting_pitch = 0) => {
            let result = [starting_pitch]
            for (let branch of path) {
                result.push(result[result.length - 1] + intervals[branch]) //adds the interval at index=branch to the last value stored.
            }
            return result
        },

        /**
         * Gets an array and returns every possible ordering of that array.
         * @param  {Array<Number>} pitches - (usually) a collection of pitches, but could be used with any type of array
         * @example
         * edo.get.permutations([0, 2, 3])
         * // [[ 0, 2, 3 ],[ 0, 3, 2 ],[ 2, 0, 3 ],[ 2, 3, 0 ],[ 3, 0, 2 ],[ 3, 2, 0 ]]
         * @return {Array<Array<Number>>}
         * @memberOf EDO#get
         */
        permutations: (inputArr,cache=true) => {
            inputArr = inputArr.sort((a,b)=>a-b)
            if(this.cat_getset(['permutations',String(inputArr)])) return this.cat_getset(['permutations',String(inputArr)])
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
            if(cache) this.cat_getset(['permutations',String(inputArr)],result)
            return result;
        },

        /** Returns the distribution (as fractions adding up to 1) of the pitches in a set of pitches
         *
         * @param  {Array<Number>} pitches - a given array of pitches
         * @param  {Boolean} as_PC - When true, the distribution tallies notes based on their pitch-class rather than their absolute pitch.
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
         *
         * edo.get.pitch_distribution([0,12,0,12,7,0])
         * //returns
         * [
         *  {"note": 0,"rate": 0.5},
         *  {"note": 12,"rate": 0.3333333333333333},
         *  {"note": 7,"rate": 0.16666666666666666}
         * ]
         *
         */
        pitch_distribution: (pitches, as_PC = false) => {
            if (as_PC) pitches = pitches.map((pitch) => this.mod(pitch, this.edo))
            let unique = this.get.unique_elements(pitches)

            let dist = unique.map((el) => {
                return {note: el, rate: pitches.filter(x => x == el).length / pitches.length}
            })
            dist = dist.sort((a, b) => b.rate - a.rate)
            return dist
        },

        /** Returns all the pitches available in windows of size <code>size</code>
         *
         * @param  {Array<Number>} pitches - a given array of pitches
         * @param  {Number} [size=8] - The size of the window.
         * @param  {Boolean} [as_PC=true] - When true, notes that belong to the same pitch-class will be counted as the same.
         * @param  {Boolean} [unique=false] - When true, the function does not count pitches if they are already in the window.
         * @param  {Boolean} [avoid_duplicate_windows=false] - When true, if two or more succeeding windows have the same content, the function will only return one of them.
         * @returns {Array<Array<Number>>}
         * @memberOf EDO#get
         * @example
         * let edo = new EDO(12) // create a tuning context
         * edo.get.pitch_fields([8,7,7,8,7,7,8,7,7,15,15,14,12,12,10,8,8,7,5,5]) //Mozart Sym. 40
         *[
         *  [ 7, 8 ],
         *  [ 7, 8 ],
         *  [ 3, 7, 8 ],
         *  [ 3, 7, 8 ],
         *  [ 2, 3, 7, 8 ],
         *  [ 0, 2, 3, 7, 8 ],
         *  [ 0, 2, 3, 7, 8 ],
         *  [ 0, 2, 3, 7, 10 ],
         *  [ 0, 2, 3, 7, 8, 10 ],
         *  [ 0, 2, 3, 8, 10 ],
         *  [ 0, 2, 3, 7, 8, 10 ],
         *  [ 0, 2, 5, 7, 8, 10 ],
         *  [ 0, 5, 7, 8, 10 ]
         *]
         *
         * edo.get.pitch_fields([8,7,7,8,7,7,8,7,7,15,15,14,12,12,10,8,8,7,5,5],5,false,true,true) //as_PC=false, unique=true,avoid_duplicate_windows=true
         * [
         *  [ 7, 8, 12, 14, 15 ],
         *  [ 7, 10, 12, 14, 15 ],
         *  [ 8, 10, 12, 14, 15 ],
         *  [ 7, 8, 10, 12, 14 ],
         *  [ 5, 7, 8, 10, 12 ],
         *  [ 5, 7, 8, 10 ]
         * ]
         */
        pitch_fields: (pitches,size=8,as_PC=true, unique=false,avoid_duplicate_windows=false) => {
            if(unique) {
                let partitions = []
                loop1:
                    for (let i = 0; i < pitches.length-size; i++) {
                        let window = [(as_PC)?this.mod(pitches[i],this.edo):pitches[i]]
                        loop2:
                            for (let j = i+1; j < pitches.length; j++) {
                                if(window.length==size) break loop2
                                let el
                                if(as_PC) el = this.mod(pitches[j],this.edo)
                                else el = pitches[j]
                                if(window.indexOf(el)==-1) window.push(el)
                            }
                        window = window.sort((a,b)=>a-b)
                        if(avoid_duplicate_windows) {
                            if(!this.is.same(partitions[partitions.length-1],window)) partitions.push(window)
                        } else partitions.push(window)


                    }
                return partitions
            }
            else {
                let partitions = []
                for (let i = 0; i <= pitches.length-size; i++) {
                    partitions.push(pitches.slice(i,i+size))
                }
                partitions = partitions.map((p)=>{
                    if(as_PC) p = p.map((note)=>this.mod(note,this.edo))
                    p = this.get.unique_elements(p).sort((a,b)=>a-b)

                    return p
                }).filter((el,i,arr)=>{
                    if(i+1!=arr.length) {
                        return !this.is.same(arr[i],arr[i+1])
                    } else return true
                })
                return partitions
            }
        },

        /** Returns an array of (length) (pseudo)random pitches, with lowest note not lower than range[0],
         * and highest note not higher than range[1].
         *
         * @param  {Number} [length=8] - The number of pitches in the melody
         * @param  {Array<number>} [range=[0, 12]] - the lower and upper limits (inclusive) for the melody
         * @param  {Number} [repetition_minimal_gap=0] - number of intervening notes before a note can repeat (the same pitch-class across different octave is not considered the same note)
         * @param  {Array<number>} [mode] - If mode is provided, the pitches returned will be only ones
         * that appear in the mode provided.
         * @param  {Number} [avoid_leaps_over=5] - The generator will attempt to avoid returning melodies that leap beyond the this IC.
         * @returns {Array<Number>}
         * @memberOf EDO#get
         * @example
         * let edo = new EDO(12) //Create a tuning context
         * edo.get.random_melody(4,[-3,2]) //returns e.g. [ -3, 0, 2, -2 ]
         * edo.get.random_melody(4, [-3, 2],1) //returns e.g. [ 1, -3, 2, -3 ]
         * edo.get.random_melody(6, [0, 17], 6,[0, 2, 4, 5, 7, 9, 11]) // returns e.g. [ 16, 12, 14, 7, 11, 5 ]
         * edo.get.random_melody(6, [0, 17], 3,[0, 2, 4, 5, 7, 9, 11],3) // returns e.g. [ 14, 16, 12, 9, 11, 14 ]
         */
        random_melody: (length = 8, range = [0, 12], repetition_minimal_gap = 4, mode, avoid_leaps_over = 5) => {
            let counter = 0
            let melody = []
            let pitch_pool = []
            for (let i = range[0]; i <= range[1]; i++) {
                if (mode) {
                    if (mode.indexOf(this.mod(i, this.edo)) == -1) continue
                }
                pitch_pool.push(i)
            }
            while (melody.length < length && counter < 1000) {
                counter++
                let submelody = melody.slice(Math.max(melody.length - repetition_minimal_gap, 0), melody.length)
                // if(!allow_pc_repetition && submelody.length>0) submelody = this.get.normal_order(submelody) //normal order

                let allow_pitches = pitch_pool.filter((pitch) => {
                    if (submelody.indexOf(pitch) == -1) return true
                    else return false
                })
                if (melody.length > 0) {
                    let leapless = []
                    do {
                        leapless = allow_pitches.filter((pitch) => {
                            if (Math.abs(pitch - melody[melody.length - 1]) <= avoid_leaps_over) return true
                            return false
                        })
                        avoid_leaps_over++
                    } while (leapless.length == 0)
                    allow_pitches = leapless
                }

                let ind = Math.floor(Math.random() * (allow_pitches.length));
                melody.push(allow_pitches[ind])

            }
            return melody

        },

        /** Returns an array of (length) (pseudo)random pitches, with lowest note not lower than range[0],
         * and highest note not higher than range[1].
         *
         * @param  {Array<Number>} contour - The contour. For instance [0,2,1,2,0] = [low high mid high low] but you can have as many "heights" as you'd like.
         * @param  {Array<number>} [range=[0, 12]] - the lower and upper limits (inclusive) for the melody
         * @param  {Array<number>} [mode] - If mode is provided, the pitches returned will be only ones
         * that appear in the mode provided.
         * @returns {Array<Number>}
         * @memberOf EDO#get
         * @example
         * let edo = new EDO(12) //Create a tuning context
         * edo.get.random_melody_from_contour([0,3,1,3,2],[0,12],[0,2,4,5,7,9,11]); //returns e.g. [ 2, 11, 7, 11, 9 ]
         */
        random_melody_from_contour: (contour, range = [0, 12], mode) => {
            let available_pitches = []
            let used_pitches = []
            let contour_ordered_unique = this.get.unique_elements([...contour]).sort((a, b) => a - b)
            let len = contour_ordered_unique.length - used_pitches.length
            for (let i = range[0]; i <= range[1]; i++) {
                if (mode) {
                    if (mode.indexOf(this.mod(i, this.edo)) != -1) available_pitches.push(i)
                } else {
                    available_pitches.push(i)
                }
            }
            while (used_pitches.length < len) {
                let item_i = Math.floor(Math.random() * available_pitches.length)
                let item = available_pitches.splice(item_i, 1)[0]
                used_pitches.push(item)
                len = contour_ordered_unique.length
            }
            used_pitches = used_pitches.sort((a, b) => a - b)

            let lexicon = {}
            for (let i = 0; i < contour_ordered_unique.length; i++) {
                lexicon[contour_ordered_unique[i]] = used_pitches[i]
            }
            contour = contour.map((el) => lexicon[el])
            return contour
        },

        /** Returns an array of (length) based on an ngram analysis of a given input.
         *
         * @param  {Array<Object>} ngrams - A list of ngrams (as returned from [EDO.get.ngrams()]{@link EDO#get.ngrams})
         * @param  {Array<number>} [start=[0]] - The starting pitch / phrase (multiple pitches) of the melody
         * @param  {Array<number>} [length=16] - The length of the output melody
         * @returns {Array<Number>}
         * @memberOf EDO#get
         * @example
         * let edo = new EDO(12) //Create a tuning context
         * let ngrams = edo.get.ngrams([4,4,5,7,7,5,4,2,0,0,2,4,4,2,2],4)
         * edo.get.random_melody_from_ngram(ngrams);
         * //returns
         * [0, 2, 4, 4, 2, 2, 4, 4, 2, 2, 0, 0, 2, 4, 4, 2]
         * @see EDO#get.ngrams
         */
        random_melody_from_ngram: (ngrams, start = [0], length = 16) => {
            let melody = [...start]
            let escape = 100 + length
            loop1:
                while (melody.length < length & escape > 0) {
                    loop2:
                        for (let i = melody.length; i > 0; i--) {
                            let sub = melody.slice(melody.length - i)
                            let entry = ngrams[sub.join(" ")]
                            if (Array.isArray(entry)) {
                                let random_pitch = entry[Math.floor(Math.random() * entry.length)]
                                melody.push(random_pitch)
                                break loop2;
                            }
                        }
                    escape--
                }
            return melody
        },

        /** Returns a random melody of length based on a distribution (as generated by [EDO.get.pitch_distribution()]{@link EDO#get.pitch_distribution}).
         *
         * @param  {Array<Object>} dist - A stratistical distribution of pitches (as returned from [EDO.get.pitch_distribution()]{@link EDO#get.pitch_distribution})
         * @param  {Array<number>} [length=8] - The length of the output melody
         * @returns {Array<Number>}
         * @memberOf EDO#get
         * @example
         * let edo = new EDO(12) //Create a tuning context
         * let dist = edo.get.pitch_distribution([4,4,5,7,7,5,4,2,0,0,2,4,4,2,2])
         * edo.get.random_melody_from_distribution(dist);
         * //returns
         * [4, 4, 2, 2, 0, 2, 2, 7]
         * @see EDO#get.pitch_distribution
         */
        random_melody_from_distribution: (dist, length = 8) => {
            let melody = []
            dist = dist.sort((a, b) => a.rate - b.rate)
            let multiplier = Math.floor(1 / dist[0].rate)
            dist = dist.map((el) => [...new Array(Math.ceil(multiplier * el.rate)).fill(el.note)])
            dist = dist.flat()
            while (melody.length < length) {
                let ind = Math.floor(Math.random() * (dist.length))
                melody.push(dist[ind])
            }
            return melody
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
         * //returns {
         *  "cents_offset": -1.955000865387433
         *  "decimal": 1.5
         *  "log_position": 0.5849625007211562
         *  "octave": 1
         *  "ratio": "3:2"
         *  }
         *
         *
         */
        ratio_approximation: (interval, limit = 17) => {
            let closest_ratio = 0
            let closest_name = ""
            let numeric = 0
            let interval_in_cents = this.convert.interval_to_cents(interval)
            let ratios = this.get.simple_ratios(limit = limit)
            for (let ratio in ratios) {
                let side_a = Math.abs(ratios[ratio]['cents'] - interval_in_cents)
                let side_b = Math.abs(interval_in_cents - closest_ratio)
                if (side_a < side_b) {
                    closest_ratio = ratios[ratio]['cents']
                    closest_name = ratio
                    numeric = ratios[ratio]['value']
                }
            }
            let num_den = closest_name.split(':')
            let numerator = num_den[0]
            let denominator = num_den[1]
            return {
                ratio: closest_name,
                cents_offset: interval_in_cents - closest_ratio,
                decimal: numeric,
                octave: Math.log2(parseInt(denominator)),
                log_position: Math.log2(numeric)
            }
        },

        /** Returns the retrograde of a given set of pitches (their reversed order)
         *<p>Remark: "pitches" conform to the current tuning system used. E.g., 0-11 occupy 1 octave in 12EDO, 0-16 in 17EDO, etc.</p>
         * @param  {Array<Number>} scale - a collection of pitches (not necessarily pitch-classes)
         * @return {Array<Number>} The reversed input
         * @memberOf EDO#get
         * @example
         * let edo = new EDO(12) // define a tuning system
         * edo.get.retrograde([0,2,4,5,7,9,11])
         * //returns [11,9,7,5,4,2,0]*/
        retrograde: (pitches) => {
            return pitches.reverse()
        },

        /**
         * <p>Returns a given collection of pitches, rotated n times.
         * @param  {Array<Number>} pitches - a collection of numbers (not necessarily pitch-classes, not necessarily unique)
         * @param  {Number} n - Number of rotations
         * @return {Array<Number>}
         * @memberOf EDO#get
         * @example
         * let edo = new EDO(12) // define a tuning system
         * edo.get.rotated([0,2,4,5,7],2) //returns [4,5,7,0,2]
         * edo.get.rotated([0,2,4,5,7],-1) //returns [7,0,2,4,5]
         * */
        rotated: (pitches,n) => {
            n=this.mod(n,pitches.length)
            return [...pitches.slice(n),...pitches].slice(0,pitches.length)
        },


        /**
         * <p>Returns all the rotations (inversions) of an array of pitches</p>
         * @param  {Array<Number>} pitches - a collection of numbers (not necessarily pitch-classes, not necessarily unique)
         * @return {Array<Array<Number>>}
         * @memberOf EDO#get
         * @example
         * let edo = new EDO(12) // define a tuning system
         * edo.get.rotations([0,4,7,4])
         * //returns [ [ 0, 4, 7, 4 ], [ 4, 7, 4, 0 ], [ 7, 4, 0, 4 ], [ 4, 0, 4, 7 ] ]
         * */
        rotations: (pitches) => {
            let rotations = []
            for (let i = 0; i < pitches.length; i++) {
                rotations.push([...pitches.slice(i, pitches.length), ...pitches.slice(0, i)])
            }
            return rotations
        },

        /**
         * <p>Returns all the melodies that can be constructed without any leaps (regardless of how many notes in the melody need to be skipped until next scalar note is found)</p>
         * <p>Remark: "intervallic units" conform to the current tuning system used. E.g., 0-11 occupy 1 octave in 12EDO, 0-16 in 17EDO, etc.</p>
         * @param  {Array<Number>} melody - a collection of pitches (not necessarily pitch-classes, not necessarily unique)
         * @param  {Array<Number>} [steps=[1,2]] - which intervallic units to consider as steps
         * @param  {Boolean} [look_back=true] - When true, the algorithm creates alternate paths to already resolves melodies. When false, resolved melodies will not be considered and a new path will begin.
         * @return {Array<Object>} object with property <code>pitch</code> indicating the pitch, and property <code>index</code> representing its original position in the melody.
         * @memberOf EDO#get
         * @example
         * let edo = new EDO(12) // define a tuning system
         * let melody = [2,2,4,2,7,6,2,2,4,2,9,7] //happy birthday song
         * edo.get.scalar_melodies(melody)
         * //returns
         * [
         *  [
         *      { pitch: 2, index: 0 },
         *      { pitch: 2, index: 1 },
         *      { pitch: 4, index: 2 },
         *      { pitch: 2, index: 3 },
         *      { pitch: 2, index: 6 },
         *      { pitch: 2, index: 7 },
         *      { pitch: 4, index: 8 },
         *      { pitch: 2, index: 9 }
         *  ],
         *  [
         *      { pitch: 7, index: 4 },
         *      { pitch: 6, index: 5 },
         *      { pitch: 4, index: 8 },
         *      { pitch: 2, index: 9 }
         *  ],
         *  [
         *      { pitch: 7, index: 4 },
         *      { pitch: 9, index: 10 },
         *      { pitch: 7, index: 11 }
         *  ],
         * ]
         * */
        scalar_melodies: (melody,steps=[1,2],look_back=true)=> {
            steps.push(0)
            let melodies = []
            melody.forEach((note,ind)=> {
                let in_any=false
                for (let i = 0; i < melodies.length; i++) {
                    let mel = melodies[i]
                    let last_note = mel[mel.length-1].pitch
                    let step_size = Math.abs(note-last_note)
                    let scalar = this.is.element_of(step_size,steps)
                    if(scalar) {
                        melodies[i].push({pitch:note,index:ind})
                        in_any=true
                    }
                }
                if(!in_any) {
                    let possible = []
                    if(look_back) {
                        let look_for=[]
                        steps.forEach(s=>{
                            look_for.push(note+s)
                            look_for.push(note-s)
                        })
                        look_for=this.get.unique_elements(look_for)
                        look_for.forEach((n)=>{
                            melodies.map(m=>m.map(el=>el.pitch)).forEach((m,index1)=>{
                                if(m.includes(n)) {
                                    let last = m.lastIndexOf(n)
                                    possible.push([note,ind,index1,last])
                                    // possible.push([m,m.lastIndexOf(n)])
                                }
                            })
                        })
                        possible = possible.map(el=>{
                            let mel = melodies[el[2]].slice(0,el[3]+1)
                            mel = [...mel,{pitch:el[0],index:el[1]}]
                            return mel
                        })
                        melodies = [...melodies,...possible]
                    }
                    if(possible.length==0) melodies.push([{pitch:note,index:ind}])

                }
            })
            return melodies
        },

        /** Generates all possible necklaces (unique scales without their modes) based on input parameters.
         *<p>Remark: "intervallic units" / "step sizes" conform to the current tuning system used. E.g., 0-11 in 12EDO, 0-16 in 17EDO, etc.</p>
         * @param  {Number} min_step - The smallest step size that can be used to form scales. If min_step=3, no scale will contain
         * intervallic units smaller than 3 (so no intervals of size 2, or 1 will be found in any scale)
         * @param  {Number} max_step - The largest step that can be used to form scales. If max_step=3, no scale will contain
         * intervallic units larger than 3 (so no intervals of size >3 will be found in any scale)
         * @param  {Number} min_sizes - The minimal amount of variety in step size needed to make a scale. if min_sizes=2,
         * then scales with step sizes that belong to fewer than 2 intervallic units will not be included.
         *
         * In the case of min_sizes=2, the following scales will be excluded: [0,1,2,3,4,5,6,7,8,9,10,11],
         * [0,2,4,6,8,10], [0,3,6,9], etc.
         *
         * * @param  {Number} max_sizes - The maximal amount of variety in step size allowed to make a scale.
         * if max_sizes=2, then scales that use more than 2 unique step sizes will be excluded.
         *
         * In the case of max_sizes=2, the following scale will be excluded: [0,1,4,5,7,10,11], because it has >2 (3)
         * step sizes. step size=1 between 0 and 1, step size=2 between 5 and 7, and step size = 3 between 1 and 4.
         * @return {Array<Scale>} all the scales that abide by the criteria given
         * @memberOf EDO#get*/
        scales: (min_step = 1, max_step = this.edo - 1, min_sizes = 1, max_sizes = 12, max_num_of_pitches=this.edo, min_num_of_pitches=2,cache = false) => {
            // TODO: allow to choose minimum amount of pitches per scale
            let EDO = this

            min_step = min_step%EDO.edo
            max_step = (max_step>=EDO.edo)?EDO.edo-1:max_step

            //get all unique combinations of size s from set of intervals set
            const calc_comb = (s, set) => {
                let solutions = []
                for (let i = 0; i < set.length; i++) {
                    let n = set[i]
                    let m = Math.floor(s / n) //Max times n fits in s
                    if (s / n == m && set.length == 1) solutions.push(Array(m).fill(n))
                    let new_set = [...set]
                    new_set.splice(i, 1)
                    if (new_set.length > 0) {
                        for (let k = m; k != 0; k--) {
                            let new_sum = s - (k * n)
                            if (new_sum > 0) {
                                let new_result = calc_comb(new_sum, new_set)
                                if (new_result.length > 0) {
                                    for (let r = 0; r < new_result.length; r++) {
                                        let solution = Array(k).fill(n).concat(new_result[r].flat())
                                        solution.sort((a, b) => a - b)
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
            const get_step_sizes = function (min_step, max_step) {
                let step_sizes = []
                for (let i = max_step; i != min_step - 1; i--) {
                    step_sizes.push(i)
                }
                return step_sizes
            }

            //returns all possible step combination between min_sizes and max_sized from step_sizes
            const get_interval_combinations = function (min_sizes, max_sizes, step_sizes) {
                let step_combinations = []
                for (let window_size = min_sizes; window_size <= max_sizes; window_size++) {
                    step_combinations = step_combinations.concat(combinations(step_sizes, window_size))
                }
                return step_combinations
            }

            //get the unique interval partitions for each set of possible interval combinations
            const unique_for_all = function (interval_combinations) {
                let collection = []
                interval_combinations.forEach((combo) => {
                    let unique_step_combination = calc_comb(EDO.edo, combo)
                    if (unique_step_combination.length > 0) {
                        collection = collection.concat(unique_step_combination)
                    }
                })
                return collection
            }

            // Get all combinations with given steps summing to an octave
            function get_necklace_families (steps,max_sizes,min_notes,max_notes,edo=EDO.edo) {
                let all = []
                function run_it(elements,goal, tally=Array.from(Array(elements.length).fill(0)),index=0) {
                    let current = tally.reduce((ag,e,i)=>(e*elements[i])+ag,0)
                    let num_of_notes = tally.reduce((ag,e)=>e+ag,0)
                    let num_of_sizes = tally.filter((e)=>e>0).length
                    if(num_of_sizes>max_sizes) return
                    if(num_of_notes>max_notes) return
                    if(current==goal && num_of_sizes>=min_sizes && num_of_notes>=min_notes) all.push(tally)
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

                run_it(steps,edo)
                all = all.map(arr=>arr.map((n,i)=>Array(n).fill(steps[i])).flat())
                return all
            }

            //make all possible necklaces out of interval combinations given in [combos]
            const make_all_necklaces = function (combos) {
                let all_necklaces = []
                for (let i = 0; i < combos.length; i++) {
                    let combo = combos[i]
                    let necklaces = EDO.get.necklace(combo)
                    all_necklaces = all_necklaces.concat(necklaces)
                }
                return all_necklaces

            }

            const get_all_scales = (all_necklaces) => {
                let all_scales = []

                all_necklaces.forEach((necklace) => {
                    all_scales.push(EDO.convert.intervals_to_scale(necklace))
                })
                return all_scales
            }

            let step_sizes = get_step_sizes(min_step, max_step)

            // let interval_combinations = get_interval_combinations(min_sizes, max_sizes, step_sizes)
            let combos = get_necklace_families(step_sizes,max_sizes,min_num_of_pitches,max_num_of_pitches)


            // let combos = unique_for_all(interval_combinations).filter(combo=>combo.length<=max_num_of_pitches)
            let all_necklaces = make_all_necklaces(combos)

            let _scales = get_all_scales(all_necklaces)
            let scales = []
            _scales.forEach((scale) => scales.push(new Scale(scale, this,cache).normal()))
            scales = this.sort_scales(scales)


            return scales


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
         *<p>Remark: "intervallic units" conform to the current tuning system used. E.g., 0-11 occupy 1 octave in 12EDO, 0-16 in 17EDO, etc.</p>
         *
         * @param  {Number} destination - the destination note. This is an int that represents some interval away from 0.
         * @param  {Array<Number> | Number} intervals - the intervallic units to be used (usually at least one positive interval to move up and one negative to move down)
         * @return {Array<Array<Number>>} an sorted array of the intervals needed to reach the destination starting from 0.
         * @memberOf EDO#get
         * @example
         * //The quickest way to get to E (from 0) moving up with P5s and down with m3s
         * let path = edo.get.shortest_path(7,[5,-3]) // returns [ -3, 5, 5 ]
         * */
        shortest_path: (destination, intervals = [5, -3], used = [], life_span = 10) => {

            let up_interval = []
            let down_interval = []
            for (let int of intervals) {
                if (int > 0) up_interval.push(int)
                else if (int < 0) down_interval.push(int)
            }

            let paths = []
            const shortest_path_array = function (destination, up_interval = [3, 4], down_interval = [-1, -2], used = [], life_span = 10) {
                if (life_span < 0) return null

                let sum = used.reduce((a, b) => a + b, 0)
                if (sum == destination && (paths.length == 0 || paths.length > used.length)) {
                    paths = [...used]
                    return
                } else if (sum == destination && (paths.length != 0 || paths.length <= used.length)) {
                    return
                }

                if (sum < destination) {
                    for (let num of up_interval) {
                        shortest_path_array(destination, up_interval, down_interval, used.concat([num]), life_span - 1)
                    }
                } else if (sum > destination) {
                    for (let num of down_interval) {
                        shortest_path_array(destination, up_interval, down_interval, used.concat([num]), life_span - 1)
                    }
                }

            }


            shortest_path_array(destination, up_interval, down_interval, used, life_span)
            paths = paths.sort((a, b) => a - b)
            return paths

        },

        /** Returns simple ratios in fraction form, decimal form, and their representation in cents with a given limit.
         * @param  {Number} [limit=17] - the limit
         * @param  {Boolean} cache - if true, the result will be cached for faster retrival
         * @return {Object}
         * @memberOf EDO#get
         */
        simple_ratios: (limit = 17, cache = true) => {
            if(this.cat_getset(["simple_ratios",limit])) return this.cat_getset(["simple_ratios",limit])
            let primes = this.get.primes_in_range(limit)
            let ratios = {}
            for (let i = 2; i < limit + 1; i++) {
                for (let j = 1; j < i; j++) {
                    if (((primes.indexOf(i) < 0) && (primes.indexOf(j) < 0)) || (i % 2 == 0 && j % 2 == 0) || (i % j == 0 && j > 2)) continue
                    ratios[String(i) + ':' + String(j)] = {cents: this.convert.ratio_to_cents(i / j), cents_in_octave: this.mod(this.convert.ratio_to_cents(i / j),1200), value: i / j}
                }
            }
            if(cache) this.cat_getset(["simple_ratios",limit],ratios)
            return ratios
        },

        /** Returns the given pitches, such that they are shifted to start from <code>start_at</code>.
         * <p>Remark: "pitches" conform to the current tuning system used. E.g., 0-11 occupy 1 octave in 12EDO, 0-16 in 17EDO, etc.</p>
         * @param  {Array<Number>} pitches - an array of pitches (or pitch-classes)
         * @param  {Number} start_at - The number to which everything will be shifted
         * @param  {Boolean} [as_PCs=true] - when false the shift will respect the octave, when true, the array will be returned containing only Pitch Classes
         * @return {Array<Number>}
         * @memberOf EDO#get
         *
         * @example
         * let edo = new EDO(12) //Create a tuning context
         * edo.get.starting_at([1,5,8],0)
         * //returns [0,4,7] //Everything shifted such that the starting pitch is 0
         * @example
         * edo.get.starting_at([5,1,8],2,false)
         * //returns [2,-2,5] //Everything shifted such that the starting pitch is 2, and octave is respected
         */
        starting_at: (pitches, start_at = 0, as_PCs = true) => {
            let shift_by = (pitches[0] * -1) + start_at
            let result = pitches.map((pitch) => (as_PCs) ? this.mod(pitch + shift_by, this.edo) : pitch + shift_by)
            return result
        },

        /**
         * Gets a subset to find and returns the indices from a given array (arr) that form that subset
         * @param  {Array<Number>} find - a collection of pitches to find (in order)
         * @param  {Array<Number>} arr - a bigger collection where we search
         * @param  {Boolean} [allow_skips=true] - if false, the search will only be done on consecutive items
         * @example
         * get.subset_indices([0, 2, 3], [0, 0, 2, 0, 2, 3, 3])
         * // returns [[ 0, 2, 5 ], [ 0, 2, 6 ],[ 0, 4, 5 ], [ 0, 4, 6 ],[ 1, 2, 5 ], [ 1, 2, 6 ],[ 1, 4, 5 ], [ 1, 4, 6 ],[ 3, 4, 5 ], [ 3, 4, 6 ]]
         * @return {Array<Array<Number>>}
         * @memberOf EDO#get
         */
        subset_indices: (find, arr, allow_skips = true) => {
            let paths = []

            const run_it_with_skips = function (find, arr, path = [], ind = 0) {
                if (find.length == 0) return path
                let find_this = find[0]
                for (let i = ind; i < arr.length; i++) {
                    if (arr[i] == find_this) {
                        let res = run_it_with_skips(find.slice(1), arr, [...path, i], i + 1)
                        if (res) paths.push(res)
                    }
                }
            }

            const run_it_no_skips = function (find, arr) {
                loop1:
                    for (let i = 0; i < arr.length - (find.length - 1); i++) {
                        loop2:
                            for (let j = 0; j < find.length; j++) {
                                if (find[j] != arr[i + j]) continue loop1
                                if (j == find.length - 1) {
                                    let arr = new Array(find.length).fill(0)
                                    arr.forEach((el, ind) => arr[ind] = i + ind)
                                    paths.push(arr)

                                }
                            }
                    }

            }
            if (allow_skips) run_it_with_skips(find, arr)
            else run_it_no_skips(find, arr)

            return paths
        },

        /** Returns all the subsets (in order) from a given array of pitches.
         * @param  {Array<Number>} pitches - a given array of pitches
         * @param  {Boolean} [allow_skips=true] - if set to false, function will only return subsets that have consecutive members
         * @param  {Boolean} [normal=true] - When true, the returned subsets are converted to normal order
         * @example
         * //returns [[0], [2], [3], [0, 2], [0, 3], [2, 3], [0, 2, 3]]
         * get.subsets([0,2,3],true)
         * @example
         * //returns [[0], [2], [3], [0, 2], [2, 3], [0, 2, 3]]
         * edo.get.subsets([0,2,3],false)
         * @returns {Array<Array<Number>>}
         * @memberOf EDO#get
         */
        subsets: (pitches, allow_skips = true, normal = false) => {
            if (allow_skips) {
                pitches = pitches.reduce(
                    (subsets, value) => subsets.concat(
                        subsets.map(set => [...set, value])
                    ),
                    [[]]
                )
            } else {
                let subsets = []
                for (let window = 1; window < pitches.length + 1; window++) {
                    for (let i = 0; i < pitches.length - window + 1; i++) {
                        subsets.push(pitches.slice(i, i + window))
                    }
                }
                pitches = subsets
            }

            pitches = pitches.filter((el) => el.length > 0)
            if (normal) {
                pitches = pitches.map((subset) => this.get.normal_order(subset))
                pitches = this.get.unique_elements(pitches)
            }
            return pitches
        },

        /** Transposes the input by a given amount
         *<p>Remark: "a single octave" conform to the current tuning system used. E.g., 0-11 occupy 1 octave in 12EDO, 0-16 in 17EDO, etc.</p>
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
        transposition: (pitches, amount = 0, as_PC = true) => {
            pitches = pitches.map((pitch) => pitch + amount)
            if (as_PC) pitches = pitches.map((pitch) => this.mod(pitch, this.edo))
            return pitches
        },




        /** Returns the union of two sets
         *
         * @param  {...Array<Number>} collections - Any number of arrays of pitches.
         * @returns {Array<Number>}
         * @memberOf EDO#get
         * @example
         * let edo = new EDO(12) //Create a tuning context
         * edo.get.union([0,1,2],[3,4,5],[6])
         * //returns [0,1,2,3,4,5,6]
         */
        union: (...collections) => {
            let union = []
            return union.concat(...collections)
        },

        /** Gets an array that may have duplications and returns the array without duplications
         * This should only be used for Arrays with nested Arrays or nested Objects. 1-dimensional arrays should use unique_in_array
         *
         * @param  {Array<number|Array<Number>>} list - an array with duplications
         * @returns {Array<Number>} an array without duplications
         * @memberOf EDO#get
         * @example
         * let edo = new EDO(12) //Create a tuning context
         * edo.get.unique_elements([1,[2,3],2,[2,3],2]) //notice that it accepts nested elements as well
         * //returns [ 1, [ 2, 3 ], 2 ]
         */
        unique_elements: (list) => {

            let unique = new Set(list.map(JSON.stringify));
            unique = Array.from(unique).map(JSON.parse);

            return unique
        },

        /** Generates a well-formed scale in the current EDO with a given cardinality.
         * @param  {Number} [cardinality=7] - The number of pitches in the scale
         * @returns {Array<Number>} A well formed scale
         * @memberOf EDO#get
         * @example
         * let edo = new EDO(12) //Create a tuning context
         * edo.get.well_formed_scale(5) //returns [0,2,4,7,9]
         * @see Clough, J. and J. Douthett (1991). "Maximally even sets." Journal of Music Theory 35(1/2): 93-173.
         */
        well_formed_scale: (cardinality=7) => {
            let scale = [...Array(cardinality).keys()].map(n=>Math.floor((n*this.edo)/cardinality))
            return scale
        },

        /** Gets a melody, and attempts to remove chromatic passing tones
         *
         * @param  {Array<number>} melody - an array representing a melody
         * @returns {Array<Number>} The array without the chromatic passing tones
         * @memberOf EDO#get
         * @example
         * let edo = new EDO(12) //Create a tuning context
         * let melody = [12,10,9,8,7,6,8,10,11,12,10,9,8,7,6,8,10,11,12,14,19,15] //syrinx
         * edo.get.without_chromatic_notes(melody)
         * //returns [12, 6, 8, 12, 6, 8, 12, 14, 19, 15]
         */
        without_chromatic_notes: (melody)=> {
            melody = melody.filter((n,i,m)=>{
                let adder = 0
                if(i>0) {
                    if(m[i-1]>m[i]) adder=-1
                    else if(m[i-1]<m[i]) adder=1
                }
                if(m[i]+adder==m[i+1]) return false
                return true

            })

            return melody
        },

        primes_in_range: (upper = 17, lower = 2) => {
            let primes = []
            for (let num = lower; num <= upper; num++) {
                if (num > 1) {
                    for (let i = 2; i < num; i++) {
                        if (num % i == 0) break
                        else primes.push(num)
                    }
                }
            }
            return primes
        },
        divisors: (n) => {
            let divisors = []
            for (let i = 2; i < Math.ceil(n / 2); i++) {
                if (n % parseInt(i) == 0) divisors.push(i)
            }
            return divisors
        },


    }

    /**A collection of functions to import and manipulate a midi file
     * @namespace EDO#midi*/
    midi = {
        /** <p>Imports a midi file</p>
         *
         * @param  {String} file_path - The path of the file
         * @returns {JSON} the midi file as JSON
         * @memberOf EDO#midi
         */
        import: (file_path) => {
            if (environment != 'server') return alert("This is currently supported only on server-side")
            let midi = load_file(file_path)
            midi = midiParser.parse(midi);
            midi.track = midi.track.map(track=>{
                track.event = track.event.map((e,i,all)=>{
                    if(i==0) e.onset = e.deltaTime
                    else {
                        e.onset = all[i-1].onset+e.deltaTime
                    }
                    return e
                })
                return track
            })


            return midi
        },

        /** <p>Gets a midi file and returns only the note on events from all tracks in correct order as one big array</p>
         *
         * @param  {JSON} parsed_midi - The returned JSON from [EDO.midi.import()]{@link EDO#midi.import}
         * @returns {Array<Number|Array<Number>>} Returns an array of pitches (or arrays of pitches if there's more than one note played simultaneously)
         * @memberOf EDO#midi
         * @see EDO#midi.import
         * @example
         * let edo = new EDO(12) // define a tuning system
         * let bach = edo.midi.import('midi/Bach - Prelude1.mid') //parsing Bach prelude in C major midi file which has multiple tracks
         * edo.midi.strip(bach) //returns all tracks as one array of pitches
         * [
         *     60, 64, 67, 72, 76, 67, 72, 76, 60, 64, 67, 72,
         *     76, 67, 72, 76, 60, 62, 69, 74, 77, 69, 74, 77,
         *     60, 62, 69, 74, 77, 69, 74, 77, 59, 62, 67, 74,
         *     77, 67, 74, 77, 59, 62, 67, 74, 77, 67, 74, 77,
         *     60, 64, 67, 72, 76, 67, 72, 76, 60, 64, 67, 72,
         *     76, 67, 72, 76, 60, 64, 69, 76, 81, 69, 76, 81,
         *     60, 64, 69, 76, 81, 69, 76, 81, 60, 62, 66, 69,
         *     74, 66, 69, 74, 60, 62, 66, 69, 74, 66, 69, 74,
         *     59, 62, 67, 74,
         *     ... 441 more items
         * ]
         */
        strip: (parsed_midi) =>{
            let p = parsed_midi
            let all_times = []
            p.track = p.track.map(t=>{
                t.event = t.event.filter(e=>{
                    return e.type==9
                }).map(e=>{
                    let el = {pitch:e.data[0],onset:e.onset}
                    return el
                }).map((e,i,all)=>{
                    let onset = e.onset
                    if (all_times.indexOf(onset)==-1) all_times.push(onset)

                    return all.filter((element)=>element.onset==onset)
                })
                t.event = this.get.unique_elements(t.event)
                return t
            })
            all_times.sort((a,b)=>a-b)
            p.track = p.track.map(t=>{
                t.event = t.event.map(e=>{
                    e = e.map(ev=>{
                        ev.onset = all_times.indexOf(ev.onset)
                        return ev
                    })
                    return e
                })
                return t
            })
            p.track = p.track.map(t=>{
                t = t.event.reduce((a,e)=>{
                    e.forEach(n=>{
                        if(a[n.onset]==undefined) a[n.onset] = [n.pitch]
                        else a[n.onset].push(n.pitch)
                    })
                    return a
                },[])
                return t
            })
            p.track = p.track
            //     .map(t=>{
            //     t = t.map(n=>{
            //         return (n.length==1)? n[0]: n
            //     })
            //     return t
            // })
                .filter(t=>{
                return t.length>0
            })
                // .map(t=>{
                //     console.log(this.convert.midi_to_name(t))
                //     return t
                // })
            let all_tracks = []
            p.track.forEach((t)=>{
                t.forEach((n,i)=>{
                    if(all_tracks[i]==undefined) all_tracks[i]=[...n]
                    else all_tracks[i] = [...all_tracks[i],...n]
                })

            })
            all_tracks=all_tracks.map(e=>(e.length==1)?e[0]:e)
            return all_tracks

        },

        /** <p>Gets a midi file and chunks all notes to partitions of a certain timeframe</p>
         *<p>Remark: "pitch classes" conform to the current tuning system used. E.g., 0-11 in 12EDO, 0-16 in 17EDO, etc.</p>
         * @param  {JSON} parsed_midi - The returned JSON from [EDO.midi.import()]{@link EDO#midi.import}
         * @param  {Number} [ticks=480] - The number of ticks for each partition (the "harmonic rhythm")
         * @param  {Boolean} [unique=true] - When true, even if a note is repeated within a given timeframe it will appear once.
         * @param  {Boolean} [as_PC=false] - When true, instead of returning the midi note number, the pitches will be returned as pitch classes
         * @param  {Boolean} [ordered=false] - When true, each chord will be sorted by pitch height (rather than the order in which it appeared in the midi file)
         * @returns {Array<Array<Number>>} The midi file returns as array of chords corresponding the to the given timeframe
         * @example
         * let edo = new EDO(12) // define a tuning system
         * let bach = edo.midi.import('midi/Bach - Prelude1.mid') //parsing Bach prelude in C major midi file
         * bach = edo.midi.chordify(bach,960,true,false,true) //chordifying
         * edo.convert.midi_to_name(bach) //replacing the midi values with note names
         * //returns
         * [
         *  [ 'C4', 'E4', 'G4', 'C5', 'E5' ],
         *  [ 'C4', 'D4', 'A4', 'D5', 'F5' ],
         *  [ 'B3', 'D4', 'G4', 'D5', 'F5' ],
         *  [ 'C4', 'E4', 'G4', 'C5', 'E5' ],
         *  [ 'C4', 'E4', 'A4', 'E5', 'A5' ],
         *  [ 'C4', 'D4', 'F#4', 'A4', 'D5' ],
         *  [ 'B3', 'D4', 'G4', 'D5', 'G5' ],
         *  [ 'B3', 'C4', 'E4', 'G4', 'C5' ],
         *  [ 'A3', 'C4', 'E4', 'G4', 'C5' ],
         *  [ 'D3', 'A3', 'D4', 'F#4', 'C5' ],
         *  [ 'G3', 'B3', 'D4', 'G4', 'B4' ],
         *  [ 'G3', 'Bb3', 'E4', 'G4', 'C#5' ],
         *  [ 'F3', 'A3', 'D4', 'A4', 'D5' ],
         *  [ 'F3', 'Ab3', 'D4', 'F4', 'B4' ],
         *  [ 'E3', 'G3', 'C4', 'G4', 'C5' ],
         *  [ 'E3', 'F3', 'A3', 'C4', 'F4' ],
         *  [ 'D3', 'F3', 'A3', 'C4', 'F4' ],
         *  [ 'G2', 'D3', 'G3', 'B3', 'F4' ],
         *  [ 'C3', 'E3', 'G3', 'C4', 'E4' ],
         *  [ 'C3', 'G3', 'Bb3', 'C4', 'E4' ],
         *  [ 'F2', 'F3', 'A3', 'C4', 'E4' ],
         *  [ 'F#2', 'C3', 'A3', 'C4', 'Eb4' ],
         *  [ 'Ab2', 'F3', 'B3', 'C4', 'D4' ],
         *  [ 'G2', 'F3', 'G3', 'B3', 'D4' ],
         *  [ 'G2', 'E3', 'G3', 'C4', 'E4' ],
         *  [ 'G2', 'D3', 'G3', 'C4', 'F4' ],
         *  [ 'G2', 'D3', 'G3', 'B3', 'F4' ],
         *  [ 'G2', 'Eb3', 'A3', 'C4', 'F#4' ],
         *  [ 'G2', 'E3', 'G3', 'C4', 'G4' ],
         *  [ 'G2', 'D3', 'G3', 'C4', 'F4' ],
         *  [ 'G2', 'D3', 'G3', 'B3', 'F4' ],
         *  [ 'C2', 'C3', 'G3', 'Bb3', 'E4' ],
         *  ['C2', 'C3', 'D3', 'F3', 'A3', 'C4', 'F4'],
         *  ['C2', 'B2', 'D4', 'E4', 'F4', 'G4', 'B4', 'D5', 'F5'],
         *  [ 'C2', 'C3', 'E4', 'G4', 'C5' ]
         * ]
         *
         * @memberOf EDO#midi
         * @see EDO#midi.import
         */
        chordify: (parsed_midi,ticks=480,unique=true,as_PC=false,ordered=false) =>{
            let p = parsed_midi
            let max = 0
            p = p.track.map(t=>{
                t.event = t.event.filter(e=>e.type==9) // return only note on events
                t.event.map(e=>(e.onset>max)?max=e.onset:max=max) //gets duration of file
                return [...t.event]
            }).flat().sort((a,b)=>a.onset-b.onset)
            let partitions = Array.from(Array(Math.ceil(max/ticks)).keys())
                .map(e=>e*ticks)
                .map((e,i,arr)=> {
                    if(arr.length-1>i) return p.filter(el=>el.onset>=arr[i] && el.onset<arr[i+1])
                    else return p.filter(el=>el.onset>=arr[i])
                })
                .map(e=>{
                    e = e.map(n=>{
                        if(as_PC) return this.mod(n.data[0],this.edo)
                        return n.data[0]
                    })
                    if(ordered) e.sort((a,b)=>a-b)
                    if(unique) e=this.get.unique_elements(e)
                    return e
                })
            return partitions
        }

    }

    /**A collection of functions to import and manipulate a midi file
     * @namespace EDO#xml*/
    xml = {
        /** <p>Imports a music xml file and loads it as a JSON.</p>
         *
         * @param  {String} file_path - The path of the file
         * @returns {JSON}
         * @memberOf EDO#import
         */
        import: (file_path) => {
            if (environment != 'server') return alert("This is currently supported only on server-side")

            var xml = load_file(file_path)
            let parsed
            parseXML(xml, function (err, result) {
                parsed = result
            });
            return parsed
        }
    }

    /**A collection of functions that return a boolean
     * @namespace EDO#is*/
    is = {

        /**
         * Returns True if arr is an element in an array of arrays (bigger_arr)
         * @param  {Array<Number>} arr - a collection of pitches (not necessarily pitch classes)
         * @param  {Array<Array<Number>>} bigger_arr - an array of arrays containing a collection of pitches (not necessarily pitch classes)
         * @return {Boolean}
         * @memberOf EDO#is
         * @example
         * let edo = new EDO(12) // define a tuning system
         * edo.is.element_of([2,4],[[1,2,3,4],[1,2,4]])
         * //returns false (the set [2,4] is NOT equal to [1,2,3,4] or to [1,2,4])
         * @example
         * let edo = new EDO(12) // define a tuning system
         * edo.is.element_of([2,4],[[1,2,3,4],[1,2,4],[2,4]])
         * //returns true
         */
        element_of: (arr, bigger_arr) => {
            if (arr.length == 0 || bigger_arr.length == 0) return false
            arr = JSON.stringify(arr)
            let arr2 = JSON.stringify(bigger_arr)
            return arr2.indexOf(arr) != -1
        },

        /**
         * Returns true the two given collections of pitches are a rotation of one another.
         * @param  {Array<Number>} collection1 - a collection of pitches (not necessarily pitch classes)
         * @param  {Array<Number>} collection2 - a collection of pitches (not necessarily pitch classes)
         * @return {Boolean}
         * @memberOf EDO#is
         * @example
         * let edo = new EDO(12) // define a tuning system
         * edo.is.rotation([0,2,4,5,7,9,11],[2,4,5,7,9,11,0])
         * //returns true
         */
        rotation:(collection1,collection2)=> {
            let double = [...collection2,...collection2]
            for (let i = 0; i < collection2.length; i++) {
                if(this.is.same(collection1,double.slice(i,i+collection2.length))) return true
            }
            return false
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
        same: (arr1, arr2) => {
            arr1 = JSON.stringify(arr1)
            arr2 = JSON.stringify(arr2)
            return arr1 == arr2
        },

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
        subset: (thing, thing2) => {

            for (let note of thing) {
                if (!thing2.includes(note)) return false
            }
            return true
        },

        /**
         * Returns true the two given collections of pitches are a transposition of one another.
         * <p>Remark: "pitches" conform to the current tuning system used. E.g., 0-11 occupy 1 octave in 12EDO, 0-16 in 17EDO, etc.</p>
         * @param  {Array<Number>} collection1 - a collection of pitches (not necessarily pitch classes)
         * @param  {Array<Number>} collection2 - a collection of pitches (not necessarily pitch classes)
         * @return {Boolean}
         * @memberOf EDO#is
         * @example
         * let edo = new EDO(12) // define a tuning system
         * edo.is.transposition([0,2,4,5,7,9,11],[5,7,9,10,0,2,4]) //C major and F major
         * //returns true
         */
        transposition: (collection1,collection2) => {
            let c1 = collection1
            let c2 = collection2
            return this.is.same(c1,c2.map(n=>this.mod(n-c2[0]-c1[0],this.edo)))
        }
    }

    /**<p>A collection of functions that make visual representations</p>
     * <p>Note: EDO.show can only be used client-side</p>
     * @namespace EDO#show
     * */
    show = {

        /**
         * <p>Plots the contour of a given melody.</p>
         * <img src = "img/contour.png">
         * @param  {String} container_id - The ID of a DOM element in which the contour will be shown.
         * @param  {Array<Number>} pitches - The melody.
         * @param  {Boolean} [replace=false] - When false, any time the function is called a new contour will be appended to the object. When true, it will replace the contents of the container.
         * @param  {Number|Array<Number,Number>} [size] - Size (in px) of the plot. When no values are passed, the plot will take the size of the container. If 1 value is passed, it will be used for both dimensions. Otherwise pass data as [width,height].
         *
         * @example
         * <script src="edo.js"></script>
         * <script src="raphael.min.js"></script>
         * <div id="container" style="width:900px;height:600px; margin:0 auto;"></div>
         * <script>
         * let edo = new EDO(12)
         * perms = edo.get.permutations([1,2,3,4])
         * perms.sort((a,b)=>b[0]-a[0] || b[b.length-1]-a[a.length-1])
         * for(let perm of perms) {
         *      edo.show.contour('container', perm,false,150)
         *  }
         * </script>
         * @see /demos/contour_plotter.html
         * @memberOf EDO#show
         */
        contour: (container_id, pitches, replace = false, size) => {
            let container = document.getElementById(container_id)
            let width, height
            if (!size) {
                width = container.offsetWidth
                height = container.offsetHeight
            } else {
                if (Array.isArray(size)) {
                    width = size[0]
                    height = size[1]

                } else {
                    width = size
                    height = size
                }
            }

            let div = document.createElement('div')
            div.style.width = width + "px";
            div.style.height = height + "px";
            div.style.display = "inline"
            let div_id = div.setAttribute("id", "paper_" + Date.now());

            if (replace) container.innerHTML = ""
            container.appendChild(div)
            const paper = new Raphael(div, width, height);
            let background = paper.rect(0, 0, width, height).attr('fill', '000').attr('stroke', 'white')

            const scale = (num, in_min, in_max, out_min, out_max) => {
                return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
            }

            let max_pitch = Math.max.apply(Math, pitches)
            let min_pitch = Math.min.apply(Math, pitches)
            let margin = 15
            let scaled_pitches = pitches.map((pitch) => Math.floor(scale(pitch, min_pitch, max_pitch, height - margin, margin)))
            let pos = margin
            let pos_shift = Math.floor((width - (margin * 2)) / (pitches.length - 1))
            let path_str = "M" + margin + "," + scaled_pitches[0]
            let circle_set = paper.set()
            let circle_r = height / 45
            circle_set.push(paper.circle(margin, scaled_pitches[0], circle_r))
            for (let i = 1; i < scaled_pitches.length; i++) {
                pos += pos_shift
                path_str += "L" + pos + "," + scaled_pitches[i]
                circle_set.push(paper.circle(pos, scaled_pitches[i], circle_r))
            }
            let path = paper.path(path_str).attr('stroke', 'red').attr('stroke-width', 2)
            circle_set.attr('fill', 'white')
            circle_set.toFront()
        },


        /**
         * Makes a fractal tree with branches diverging by given intervals
         * <img src = "img/fractal_tree.png">
         * @param  {String} container_id - The ID of a DOM element in which the tree will be shown.
         * @param  {Number} [length=200] - The length (or height) or the tree's "trunk".
         * @param  {Number} [angle_span=90] - the angle between branches.
         * @param  {Array<Number>} [mode=[0,2,4,5,7,9,11]] - If provided, the tree will conform to that mode.
         * @param  {Array<Number>} [intervals=[-1,1]] - If mode is provided, each interval represents the number of scale degrees away from the current node. If mode is not provided, the intervals represent the interval away from the current node.
         * @param  {Number} [iterations=5] - The number of sub-branches on the tree
         * @param  {Number} [length_mul=0.7] - The factor by which every new sub-branch's length is to its parent.

         * @example
         * <script src="edo.js"></script>
         * <script src="raphael.min.js"></script>
         * <div id="container" style="width:900px;height:600px; margin:0 auto;"></div>
         * <script>
         *  let edo = new EDO()
         *  edo.show.interval_fractal_tree(container_id)
         * </script>


         * @see /demos/fractal_tree.html
         * @memberOf EDO#show
         */
        interval_fractal_tree: (container_id, length = 200, angle_span = 90, mode = [0, 2, 4, 5, 7, 9, 11], intervals = [-1, 1], iterations = 5, length_mul = 0.7) => {
            const self = this
            const container = document.getElementById(container_id)
            container.innerHTML = ""
            const edo = this.edo
            let width = container.offsetWidth
            let height = container.offsetWidth
            const paper = new Raphael(container, width, height);
            const point_on_circle = function (center = [0, 0], radius = 50, angle = 90) {
                /*Finding the x,y coordinates on circle, based on given angle*/

                //center of circle, angle in degree and radius of circle
                angle = angle * Math.PI / 180
                let x = Math.floor(center[0] + (radius * Math.cos(angle)))
                let y = Math.floor(center[1] + (radius * Math.sin(angle)))

                return [x, y]
            }

            const normalize = (num, in_min, in_max, out_min, out_max) => {
                return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
            }

            class Branch {
                constructor(length = 300, angle = 0, x = 0, y = 0, circle_r = 20, angle_span = 90, length_mul = 0.70, iterations = 5, intervals = [-1, 1], starting_pitch = 0, mode = null) {
                    if (mode) this.diatonic = true
                    else this.diatonic = false

                    this.mode = mode
                    this.iterations = iterations
                    this.length_mul = length_mul
                    this.angle_span = angle_span
                    this.length = length
                    this.angle = angle
                    this.circle_r = circle_r
                    this.circle_o = point_on_circle([x, y], length - (circle_r), angle - 90)
                    this.start = [x, y]
                    this.line_center = point_on_circle(this.start, (this.length - (this.circle_r * 2)) / 2, this.angle - 90)
                    this.line_end = point_on_circle(this.start, this.length - (this.circle_r * 2), this.angle - 90)
                    this.end = point_on_circle([x, y], length, angle - 90)
                    this.sub_branches = intervals.length
                    this.intervals = intervals
                    this.starting_pitch = starting_pitch
                }

                draw_branch() {
                    let start = this.start
                    let end = this.line_end
                    paper.path('M' + start.join(',') + 'L' + end.join(',')).attr('stroke', 'white')
                    let c_center = this.circle_o
                    let hue = Math.floor(normalize(this.starting_pitch, 0, edo - 1, 0, 360))
                    let rgb = Raphael.hsl2rgb(hue, 100, 50)
                    paper.circle(c_center[0], c_center[1], this.circle_r).attr('fill', rgb)
                    this.text = paper.text(c_center[0], c_center[1], this.starting_pitch)
                        .attr('fill', 'blue')
                        .attr('font-size', 25)

                    if (this.iterations > 0) {
                        let angle_span = Math.floor(this.angle_span / 2) - this.angle_span
                        let angle_add = this.angle_span / (this.sub_branches - 1)
                        let new_length = this.length * this.length_mul
                        for (let i = 0; i < this.sub_branches; i++) {
                            let starting_pitch = 100
                            if (this.diatonic) {
                                let index = this.mode.indexOf(this.starting_pitch)
                                starting_pitch = this.mode[self.mod((index + this.intervals[i]), this.mode.length)]
                            } else {
                                starting_pitch = mod((this.starting_pitch + this.intervals[i]), edo)
                            }
                            let new_angle = this.angle + angle_span + (i * angle_add)
                            let new_x = this.end[0]
                            let new_y = this.end[1]
                            let new_branch = new Branch(new_length, new_angle, new_x, new_y, this.circle_r, this.angle_span, this.length_mul, this.iterations - 1, this.intervals, starting_pitch, this.mode)
                            new_branch.draw_branch()

                        }
                    }
                }
            }

            paper.clear()
            let background = paper.rect(0, 0, width, height).attr('fill', '000')
            let tree = new Branch(length = length,
                0,
                Math.floor(width / 2),
                height,
                20,
                angle_span,
                length_mul,
                iterations,
                intervals,
                0,
                mode)
            tree.draw_branch()
        },

        /**
         * Graphs a given necklace in a container.
         * <img src='img/Necklace.png'>
         * @param  {Object} args - An object with the necklace arguments
         * @param  {Paper} args.paper - A Raphael Paper object on which the necklace will be drawn
         * @param  {Array<Number>} args.pitches - The pitches of the necklace
         * @param  {Number} [args.cx] - The center x coordinate of the necklace (in relation to the paper object).
         * @param  {Number} [args.cy] - The center y coordinate of the necklace (in relation to the paper object).
         * @param  {Number} [args.radius] - The center y coordinate of the necklace (in relation to the paper object)
         * @param  {Boolean} [args.ring=true] - When false, the necklace ring will be hidden.
         * @param  {Boolean} [args.inner_strings=true] - When false, the necklace's inner strings will be hidden.
         * @param  {Number} [args.PC_at_midnight=0] - The pitch-class starting the necklace at the very top (midnight)
         * @param  {Number} [args.string_width=1] - The width of the strings of the necklace.
         * @param  {Number} [args.node_radius] - The radius of each node on the necklace
         *
         *
         * @example
         * <script src="edo.js"></script>
         * <script src="raphael.min.js"></script>
         * <div id="container" style="width:900px;height:600px; margin:0 auto;"></div>
         * <script>
         *  let edo = new EDO(12)
         *  let paper = edo.make_DOM_svg('container',1200,1200,true).paper
         *  edo.show.necklace({paper:paper,pitches:[0,2,4,5,7,9,11]})
         * </script>
         * @see /demos/necklace.html
         * @memberOf EDO#show
         */
        necklace: (args) => {
            args.cx = args.cx || args.paper.width / 2
            args.cy = args.cy || args.paper.height / 2
            args.radius = args.radius || (args.paper.width / 2) - 30
            args.ring = (args.ring == undefined) ? true : args.ring
            args.inner_strings = (args.inner_strings == undefined) ? true : args.inner_strings
            args.outer_strings = (args.outer_strings == undefined) ? true : args.outer_strings
            args.PC_at_midnight = args.PC_at_midnight || 0
            args.string_width = args.string_width || 1
            args.node_color = args.node_color || "black"
            args.node_radius = args.node_radius || (args.paper.height * Math.PI / (this.edo * 4)) / 2 - 5
            const parent = this

            class Necklace {
                constructor(parent, args) {
                    this.cx = args.cx
                    this.cy = args.cy
                    this.radius = args.radius
                    this.pitches = args.pitches
                    this.PC_at_midnight = args.PC_at_midnight
                    this.show_ring = args.ring
                    this.show_inner_strings = args.inner_strings
                    this.show_outer_strings = args.outer_strings
                    this.parent = parent
                    this.edo = parent.edo
                    this.nodes = []
                    this.strings = []
                    this.paper = args.paper
                    this.node_color = args.node_color
                    this.node_radius = args.node_radius
                    this.string_width = args.string_width
                    this.draw_all()


                }

                draw_all() {
                    if (this.show_ring) this.draw_ring()
                    this.draw_nodes()
                    this.draw_strings(this.string_width)
                    for (let node of this.nodes) {
                        node.drawing.toFront()
                        node.text.toFront()
                    }
                }

                draw_ring(color = 'white', stroke_width = 3) {
                    let paper = this.paper
                    //if already exists, remove the old one
                    if (this.ring) {
                        this.ring.remove()
                        this.ring = undefined
                    }

                    //draw the ring
                    this.ring = paper.circle(this.cx, this.cy, this.radius).attr('stroke', color)
                        .attr('stroke-width', stroke_width)
                }

                draw_nodes() {
                    //remove nodes
                    for (let node of this.nodes) {
                        node.drawing.remove()
                        node.text.remove()
                    }
                    this.nodes = []
                    let node_radius = this.node_radius
                    node_radius = Math.max(node_radius, 1)
                    //node parameters
                    for (let note of this.pitches) {
                        let angle = (note * (360 / this.edo)) - 90
                        let rad_angle = angle * Math.PI / 180
                        let cx = Math.floor(this.cx + (this.radius * Math.cos(rad_angle)))
                        let cy = Math.floor(this.cy + (this.radius * Math.sin(rad_angle)))
                        let node = new Node(this, node_radius, cx, cy, (note + this.PC_at_midnight) % this.edo)
                        this.nodes.push(node)
                    }


                    for (let node of this.nodes) node.draw()

                }

                draw_strings(stroke_width) {
                    //remove strings
                    for (let string of this.strings) {
                        string.drawing.remove()
                    }
                    this.strings = []

                    //draw outer strings
                    if (this.show_outer_strings) {
                        for (let i = 0; i < this.nodes.length; i++) {
                            let node1 = this.nodes[i]
                            let node2 = this.nodes[(i + 1) % this.nodes.length]
                            let str = new Str(this, node1.cx, node1.cy, node2.cx, node2.cy, stroke_width)
                            this.strings.push(str)
                        }
                    }


                    //draw inner-strings
                    if (this.show_inner_strings) {
                        for (let i = 0; i < this.nodes.length - 2; i++) {
                            for (let j = 2; j < this.nodes.length; j++) {
                                let node1 = this.nodes[i]
                                let node2 = this.nodes[j]
                                let str = new Str(this, node1.cx, node1.cy, node2.cx, node2.cy, stroke_width)
                                this.strings.push(str)
                            }
                        }
                    }


                    for (let string of this.strings) {
                        string.draw()
                    }
                }
            }

            class Node {
                constructor(necklace, radius, cx, cy, name) {
                    this.necklace = necklace
                    this.radius = radius
                    this.cx = cx
                    this.cy = cy
                    this.name = name

                }

                draw() {
                    let paper = this.necklace.paper
                    //if already exists, remove the old one
                    if (this.drawing) {
                        this.drawing.remove()
                        this.drawing = undefined
                    }

                    this.drawing = paper.set()

                    this.circle = paper.circle(this.cx, this.cy, this.radius)
                        .attr('stroke', 'white')
                        .attr('fill', this.necklace.node_color)
                    this.drawing.push(this.circle)
                    this.text = paper.text(this.cx, this.cy, this.name)
                        .attr('fill', 'white')
                        .attr('font-size', this.radius)

                    this.drawing.push(this.text)

                }
            }

            class Str {
                constructor(necklace, x1, y1, x2, y2, stroke_width) {
                    this.necklace = necklace
                    this.x1 = x1
                    this.y1 = y1
                    this.x2 = x2
                    this.y2 = y2
                    this.length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)
                    this.stroke_width = stroke_width

                }

                draw() {
                    let paper = this.necklace.paper
                    //if already exists, remove the old one
                    if (this.drawing) {
                        this.drawing.remove()
                        this.drawing = undefined
                    }

                    let hue = Math.floor(rescale(this.length, 0, this.necklace.radius * 2, 0, 360))
                    let rgb = Raphael.hsl2rgb(hue, 100, 50)
                    this.drawing = paper.path("M" + this.x1 + "," + this.y1 + "L" + this.x2 + "," + this.y2)
                        .attr('stroke', rgb.hex)
                        .attr('stroke-width', this.stroke_width)

                }

            }

            let neck = new Necklace(parent, args)
            return neck
        },

        /**
         * Graphs nested necklaces.
         * <img src='img/nested_necklaces.png'>
         *
         * @param  {String} container_id - The ID of a DOM element in which the contour will be shown.
         * @param  {Array<Array<Number>>} necklaces - The necklaces to be drawn
         * @param  {Boolean} [replace=false] - When true, the contents of the container will be replaced by the function. When false, it will be appended.
         * @param  {Number} [radius = 600] - Radius (in px) of the ring.
         * @param  {Boolean} [ring = false] - When true, the ring of the scale will be drawn
         * @param  {Number} [min_node_radius] - When passed, the radius of each node won't be smaller than the value passed
         *
         * @example
         * <script src="edo.js"></script>
         * <script src="raphael.min.js"></script>
         * <div id="container" style="width:900px;height:900px; margin:0 auto;"></div>
         * <script>
         * const divisions = 12
         * let edo = new EDO(divisions)
         * let scale = edo.scale([0,2,4,5,7,9,11])
         * let necklaces = scale.get.scale_degree_transpositions().map((trans)=>trans[0])
         * edo.show.nested_necklaces("container",necklaces,true,900)
         * //Graphs all of the common tone transpositions of the major scale
         * </script>
         * @see /demos/necklace.html
         * @memberOf EDO#show
         */
        nested_necklaces: (container_id, necklaces, replace = true, radius = 600, ring = false, min_node_radius, strings = true) => {
            let parent = this
            let height = radius
            let width = radius
            let new_necklace_radius = height / 2 - (height / 20)
            let num_of_necklaces = necklaces.length
            let necklace_radius_offset = Math.min(new_necklace_radius / (num_of_necklaces))

            const SVG = this.make_DOM_svg(container_id, width, height, replace)
            const paper = SVG.paper

            let node_radius = Math.min((paper.height * Math.PI / (this.edo * 4)) / 2 - 5, paper.height * Math.PI / (num_of_necklaces * num_of_necklaces * 2), (paper.height * Math.PI / (this.edo * num_of_necklaces)) / 2 - 5)
            if (min_node_radius) node_radius = Math.max(node_radius, min_node_radius)

            for (let necklace of necklaces) {
                let args = {
                    paper: paper,
                    pitches: necklace,
                    radius: new_necklace_radius,
                    ring: ring,
                    inner_strings: false,
                    node_radius: node_radius,
                    outer_strings: strings
                }
                this.show.necklace(args)
                new_necklace_radius -= necklace_radius_offset
            }

        },

        /**
         * Graphs necklaces on every node of a parent necklace recursively.
         * <img src='img/necklace_fractal.png'>
         * @param  {Object} args - The arguments of the necklaces
         * @param  {String} args.container_id - The ID of a DOM element in which the necklaces will be shown.
         * @param  {Array<Array<Number>>} args.necklaces - The necklaces to be drawn
         * @param  {Number} [args.canvas_width=900] - The width of the drawable area
         * @param  {Number} [args.canvas_height=900] - The height of the drawable area
         * @param  {Number} [args.initial_radius=250] - The radius of the top-level necklace
         * @param  {Number} [args.radius_multiplier=0.5] - The rate of change in radius size for every new level of necklace.
         * @param  {Number} [args.offset_x=0] - Initial necklace's x offset from the center
         * @param  {Number} [args.offset_y=50] - Initial necklace's y offset from the center
         * @param  {Number} [args.minimum_node_radius=20] - The smallest radius a node can have
         * @param  {Boolean} [args.ring=true] - When false, the necklace's ring will be hidden
         * @param  {Boolean} [args.replace=false] - When true, the contents of the container will be replaced by the function. When false, it will be appended.
         *
         * @example
         * <script src="edo.js"></script>
         * <script src="raphael.min.js"></script>
         * <div id="container" style="width:900px;height:900px; margin:0 auto;"></div>
         * <script>
         * const divisions = 12
         * let edo = new EDO(divisions)
         * edo.show.necklace_fractal({container_id:'container',necklaces:[[0,3,6],[0,4,8],[0,6]]})
         * </script>
         * @memberOf EDO#show
         */
        necklace_fractal: (args) => {

            const container_id = args.container_id
            const necklaces = args.necklaces
            const offset_x = args.offset_x
            const offset_y = args.offset_y || 50
            const radius_multiplier = args.radius_multiplier || 0.5
            const initial_radius = args.initial_radius || 250
            const minimum_node_radius = args.minimum_node_radius || 20
            const show_ring = (args.ring == undefined) ? true : args.ring
            const canvas_width = args.canvas_width || 900
            const canvas_height = args.canvas_height || 900
            const replace = (args.replace == undefined) ? false : args.replace

            const SVG = this.make_DOM_svg(container_id, canvas_width, canvas_height, replace)
            const paper = SVG.paper
            const parent = this
            const necklace_nester = function (necklaces, nodes, new_radius = initial_radius) {
                let new_necklaces = [...necklaces]
                let necklace = new_necklaces.splice(0, 1)[0]
                if (nodes) {
                    nodes.forEach((node) => {
                        let neck = parent.show.necklace({
                            paper: paper,
                            ring: show_ring,
                            radius: new_radius,
                            pitches: necklace,
                            cx: node.cx,
                            cy: node.cy + new_radius,
                            PC_at_midnight: node.name,
                            node_radius: Math.max(new_radius / 8, minimum_node_radius)
                        })
                        if (new_necklaces.length > 0) necklace_nester(new_necklaces, neck.nodes, neck.radius * radius_multiplier)
                    })
                } else {
                    let neck = parent.show.necklace({
                        cx: paper.width / 2 + offset_x,
                        ring: show_ring,
                        paper: paper,
                        radius: new_radius,
                        pitches: necklace,
                        cy: new_radius + offset_y,
                        node_radius: Math.max(new_radius / 8, minimum_node_radius)
                    })

                    if (new_necklaces.length > 0) necklace_nester(new_necklaces, neck.nodes, neck.radius * radius_multiplier)
                }
            }

            necklace_nester(necklaces)
        },


    }

    mod(n, m=this.edo) {
        return ((n % m) + m) % m;
    }

    // Get / Set cache catalog
    cat_getset(keys,value) {
        function getValue(obj, key,  ...rest) {
            if (obj === undefined) return undefined
            if (rest.length == 0 && obj.hasOwnProperty(key)) {
                if(Array.isArray(obj[key])) JSON.parse(JSON.stringify(obj[key]))
                if(typeof obj[key] === 'object' ) return JSON.parse(JSON.stringify(obj[key]))
                return obj[key]
            }
            return getValue(obj[key], ...rest)
        }
        function setValue(obj,value, key,  ...rest) {

            if (rest.length == 0) {
                obj[key] = value
                return obj[key]
            }
            if(obj[key]===undefined) obj[key] = {}
            return setValue(obj[key],value, ...rest)
        }
        if(value===undefined) return getValue(this.catalog,...keys)
        else {
            if(Array.isArray(value)) value=Array.from(value)
            else if(typeof value === 'object' ) return JSON.parse(JSON.stringify(value))
            return setValue(this.catalog,value,...keys)
        }
    }

    // empty cache catalog
    purge_cache() {
        this.catalog={}
    }

}

/** <p>Class representing a set of pitch classes within an EDO system (e.g., 0-11 in 12EDO, 0-16 in 17EDO, etc.)</p>
 * <p>(This class should have been called "Set" but because Set is a reserved work in JavaScript (as in most languages), "Scale" was selected as a compromise).</p> */
class Scale {
    /**
     * <p>Creates a set of pitch classes within the context of the edo system.</p>
     * <p>Unlike the [EDO Class]{@link EDO}, this class mostly contains methods which are more directed at manipulating a set of pitch classes (regardless of their octave) or for methods which necessitate the context of a scale (like sequences).
     * At the center of this class stand 6 collections (see "Namespaces" below) of functions.</p>
     * <ul>
     *  <li> [Scale.to]{@link Scale#to} is a set of functions used to change between equivalent representations of the set.</li>
     *  <li> [Scale.count]{@link Scale#count} is a set of functions used to count stuff.</li>
     *  <li> [Scale.get]{@link Scale#get} is a set of functions used to manipulate and track, and generate stuff.</li>
     *  <li> [Scale.is]{@link Scale#is} is a set of functions used for boolean truth statements.</li>
     *  <li> [Scale.export]{@link Scale#export} is a set of functions used to export files.</li>
     *  <li> [Scale.show]{@link Scale#show} is a set of functions used to visualize various things.</li></ul>
     *  <p>
     *      In addition to the namespaces, Scale also has 5 methods that can be chained together:
     * <ul>
     *  <li> [Scale.invert()]{@link Scale#invert} returns the inversion of the original Scale object as a new Scale object.</li>
     *  <li> [Scale.mode(n)]{@link Scale#mode} returns the nth mode of the original Scale object as a new Scale object.</li>
     *  <li> [Scale.normal()]{@link Scale#normal} returns the normal order of the original Scale object as a new Scale object.</li>
     *  <li> [Scale.prime()]{@link Scale#prime} returns the prime form of the original Scale object as a new Scale object.</li>
     *  <li> [Scale.complement()]{@link Scale#complement} returns the complement of the scale in the current EDO.</li>
     *  </ul>
     *  </p>
     *  <p>Remark: "pitch-classes" conform to the current tuning system used. E.g., 0-11 occupy 1 octave in 12EDO, 0-16 in 17EDO, etc.</p>
     * @param {Array<number>} pitches - The pitch classes of the set.
     * @param {EDO} parent - and EDO context
     * @example
     * //Basic usage 1:
     * let edo = new EDO(12) //create a new EDO context with 12 divisions.
     * let scale = new Scale([0,2,4,5,7,9,11],edo) //pass the pitch-classes and edo context to the scale
     *
     * //Basic usage 2 (preferred):
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
    constructor(pitches, parent, cache=true) {
        this.parent = parent


        let smallest = Math.min.apply(Math, pitches)
        let diff_from_zero = 0 - smallest

        this.pitches = pitches.map((pitch) => pitch + diff_from_zero)
        this.edo = this.parent.edo
        this.pitches = this.pitches.map((pitch) => pitch % parent.edo)
        this.pitches = this.parent.get.unique_elements(this.pitches)
        this.pitches.sort((a, b) => a - b)
        this.length = this.count.pitches()
        this.name = this.get.name(false)
        this.cache=cache
    }



    /**A collection of functions that return an amount
     * @namespace*/
    count = {

        /**
         * <p>Returns the number of times a certain chord (or interval) quality (specified in intervallic units above the root) exists in the scale.</p>
         * <p>E.g. <code>scale.count.chord_quality([4, 7, 11])</code> counts the number of times a major 7th (if in 12 EDO) appears in a scale</p>
         * <p>Remark: "intervallic units" conform to the current tuning system used. E.g., 0-11 occupy 1 octave in 12EDO, 0-16 in 17EDO, etc.</p>
         * @param {Array<Number|Array<Number>>} intervals - intervallic units above 0
         * @return {Number}
         * @example
         * let edo = new EDO(12) //Create a tuning context
         * let scale = edo.scale([0,2,4,5,7,9,11]) //define new scale (Major)
         * //Major 7th
         * scale.count.chord_quality([4, 7, 11]) //returns 2
         *
         * let scale = edo.scale([0,2,3,5,6,8,9,11]) //define new scale (Octatonic)
         * //diminished triad
         * scale.count.chord_quality([3, 6]) //returns 8
         *
         * @example
         * //(in 12-EDO) count how many major OR minor triads are in the diatonic scale
         * let scale = edo.scale([0,2,4,5,7,9,11]) //define new scale (Major)
         * //count how many times in the diatonic scale, the 1st interval is a pitch-class of 3 OR PC4, and the 2nd interval a PC7
         * scale.count.chord_quality([[3,4], 7]) //returns 6
         * @memberOf Scale#count*/
        chord_quality: (intervals) => {
            let scale = this.pitches
            let count = 0
            intervals = this.parent.get.partitioned_subsets(intervals)

            //modes including repetitions
            let modes = this.parent.get.modes(this.pitches, false, false)

            modes.forEach((mode) => {
                intervals.forEach((subset) => {
                    subset = subset.map((note) => mode.indexOf(note) != -1)
                    if (subset.indexOf(false) == -1) count++
                })
            })

            return count
        },

        /**
         * Returns the maximal number of consecutive steps of size 'size' in the scale (and its rotations).
         * @param {Number} size - the size of the step
         * @returns {Number}
         * @memberOf Scale#count
         *
         * @example
         * let edo = new EDO(12) //Create a tuning context
         * let scale = edo.scale([0,2,4,5,7,9,11]) //define new scale (Major)
         * scale.count.consecutive_steps(2) //returns 3
         * */
        consecutive_steps: (size,cache = this.cache) => {
            if(this.cat_getset(['consecutive_steps',size])) return this.cat_getset(['consecutive_steps',size])

            let counts = []
            let steps = this.to.steps()
            steps = [...steps, ...steps]
            if (steps.indexOf(size) == -1) return 0
            let count = 0
            for (let step of steps) {
                if (step == size) count++
                else {
                    counts.push(count)
                    count = 0
                }
            }
            counts = counts.sort((a, b) => b - a)
            let result = counts[0]
            result = Math.min.apply(Math, [result, this.edo])
            if(cache) this.cat_getset(['consecutive_steps',size],result)
            return result

        },

        /**
         * Returns the number of imperfections (notes that do not have a P5 above them) in the scale.
         * @param {Number} [tolerance=10] - allowed tolerance in cents (away from pure P5)
         * @param {Boolean} [cache] - when true, the result will be cached for faster retrieval.
         * @return {Number}
         * @memberOf Scale#count
         *
         * @example
         * let edo = new EDO(12) //Create a tuning context
         * let scale = edo.scale([0,2,4,5,7,9,11]) //define new scale (Major)
         * scale.count.imperfections() //returns 1
         * scale.count.imperfections(0) //returns 7
         */
        imperfections: (tolerance = 10, cache = this.cache) => {

            if(this.cat_getset('# imperfections')) return this.cat_getset('# imperfections')

            let scale = this.pitches
            let imperfections = 0
            let valid_intervals = []
            let p5 = this.parent.convert.ratio_to_cents(3 / 2)
            for (let i = 1; i < this.edo; i++) {
                if (Math.abs(this.parent.convert.interval_to_cents(i) - p5) <= tolerance) valid_intervals.push(i)
                else if (valid_intervals.length > 0) break
            }
            let octavescale = scale.map((note) => note + this.edo)
            let doublescale = scale.concat(octavescale)
            scale.forEach((note) => {
                let valid = false

                valid_intervals.forEach((interval) => {
                    if (doublescale.indexOf(note + interval) != -1) valid = true

                })
                if (!valid) imperfections++
            })
            if (cache) this.cat_getset('# imperfections',imperfections)
            return imperfections

        },

        /**
         * <p>Returns the number of intervals of a specified size in the scale.</p>
         * <p>When an array is passed, the function returns total amount of intervals found from the array.</p>
         * <p>Remark: "intervallic units" conform to the current tuning system used. E.g., 0-11 occupy 1 octave in 12EDO, 0-16 in 17EDO, etc.</p>
         * @param {Number | Array<Number>} interval - some interval class.
         * @return {Number}
         * @memberOf Scale#count
         * @example
         * let edo = new EDO(12) //Create a tuning context
         * let scale = edo.scale([0,2,4,5,7,9,11]) //define new scale (Major)
         * scale.count.interval([3,4]) //returns 7 (the amount of IC3 in the scale + the amount of IC4 in the scale)
         *
         * @see Scale#count.chord_quality

         * */
        interval: (interval) => {
            if (!Array.isArray(interval)) interval = [interval]
            let scale = this.pitches
            let count = 0
            for (let note of scale) {
                for (let int of interval) {

                    if (scale.indexOf((note + int) % this.edo) != -1) count++
                }
            }


            return count
        },

        /**
         * <p>Returns the number of Major Thirds (approximations of 5:4 with a tolerance of 20 cents) in the scale.</p>
         *
         * <p>(To count other intervals or set a different tolerance use [Scale.count.ratio()]{@link Scale#count.ratio})</p>
         * @return {Number}
         * @memberOf Scale#count
         * @see Scale#count.ratio
         * @example
         * let edo = new EDO(12) //define context
         * let scale = edo.scale([0,2,4,5,7,9,11]) //new Scale object
         * scale.count.M3s() //returns 3 (C-E, F-A, G-B)
         */
        M3s: () => {
            return this.count.interval(this.parent.M3s)
        },

        /**
         * <p>Returns the number of Minor Thirds (with a tolerance of 20 cents) in the scale.</p>
         *
         * <p>(To count other intervals or set a different tolerance use [Scale.count.ratio()]{@link Scale#count.ratio})</p>
         * @return {Number}
         * @memberOf Scale#count
         * @see Scale#count.ratio
         * @example
         * let edo = new EDO(12) //define context
         * let scale = edo.scale([0,2,4,5,7,9,11]) //new Scale object
         * scale.count.m3s() //returns 4
         */
        m3s: () => {
            return this.count.interval(this.parent.m3s)
        },

        /**
         * <p>Returns the min/max number of unique combinations that can be made from the set of this necklace family.</p>
         * @return {Number}
         * @memberOf Scale#count
         * */
        //TODO: Make better caching here
        min_max_n_chords_in_necklace: (cache = this.cache) => {

            let family = this.get.necklace_family()
            if(this.parent.cat_getset(['necklace_family',String(family)])) return this.parent.cat_getset(['necklace_family',String(family)])

            let min = Infinity
            let max = 0

            let scales = this.get.necklace_family_members().map(n=>this.parent.scale(n))
            scales.forEach(s=>{
                let count = s.count.n_chords()
                if(count>max) max = count
                if(count<min) min = count
            })

            // This is now accessible to other family members
            if(cache) this.parent.cat_getset(['necklace_family',String(family)],{min,max})

            return {min,max}
        },

        /**
         * <p>Returns the number of major and minor (sounding) triads in the scale.</p>
         *
         * <p>For other chord qualities use a combination of [Scale.count.chord_quality()]{@link Scale#count.chord_quality} and [EDO.convert.ratio_to_interval()]{@link EDO#convert.ratio_to_interval}</p>
         * @return {Number}
         * @memberOf Scale#count
         *
         * @example
         * let edo = new EDO(12) //define context
         * let scale = edo.scale([0,2,4,5,7,9,11]) //Major
         * scale.count.major_minor_triads() //returns 6
         * @see Scale#count.chord_quality
         * @see EDO#convert.ratio_to_interval*/
        major_minor_triads: () => {
            let major = this.count.chord_quality([[...this.parent.M3s], [...this.parent.P5s]])
            let minor = this.count.chord_quality([[...this.parent.m3s], [...this.parent.P5s]])

            return major + minor
        },

        /**
         * <p>Returns the number of unique modes in the scale.</p>
         * @return {Number}
         * @memberOf Scale#count
         * @example
         * let edo = new EDO(12) //define context
         * let scale = edo.scale([0,2,4,5,7,9,11]) //Major
         * scale.count.modes() //returns 7
         *
         * scale = edo.scale([0,2,4,6,8,10]) //Whole-tone
         * scale.count.modes() //returns 1
         * */
        modes: () => {
            return this.get.modes().length
        },

        /**
         * <p>Returns the number of unique combinations that can be made from the set or subsets of it.</p>
         * @return {Number}
         * @memberOf Scale#count
         * @example
         * let edo = new EDO(12) //define context
         * let scale = edo.scale([0,2,4,7,9]) //pentatonic
         * scale.count.n_chords() //returns 15
         * */
        n_chords: (prime_form=false,cache = this.cache) => {
            if(this.cat_getset(['n_chords_count',(prime_form)?"prime_form":"regular"])) return this.cat_getset(['n_chords_count',(prime_form)?"prime_form":"regular"])
            let n_chords = 1 //1 because the collection of all pitches should also be counted
            for (let i = 2; i < this.count.pitches(); i++) {
                // Consideration: It's possible to pass the cache of the main object, but this results in a serious memory leak in big projects.
                //Perhaps cache should be passed as false (as it is now)
                n_chords+=this.get.n_chords(i,true,prime_form,false).length
            }
            if(cache) this.cat_getset(['n_chords_count',(prime_form)?"prime_form":"regular"],n_chords)
            return n_chords
        },

        /**
         * <p>Returns the number of unique (with regards to diatonicity) n_chords that can be made from the set or subsets of it.</p>
         * @return {Number}
         * @memberOf Scale#count
         * @example
         * let edo = new EDO(12) //define context
         * let scale = edo.scale([0,2,4,7,9]) //pentatonic
         * scale.count.n_chords_diatonic() //returns 15
         * */
        n_chords_diatonic: (cache = this.cache) => {
            if(this.cat_getset(['n_chords_diatonic_count'])) return this.cat_getset(['n_chords_diatonic_count'])
            let n_chords = 1 //1 because the collection of all pitches should also be counted
            for (let n = 2; n < this.pitches.length; n++) {
                let combo = this.get.n_chords_diatonic(n)
                combo = combo.map(d=>d.combos.length).reduce((ag,e)=>ag+e,0)
                n_chords+=combo
            }
            if(cache) this.cat_getset(['n_chords_diatonic_count'],n_chords)
            return n_chords
        },

        /**
         * <p>Returns the number of Perfect Fifths (with a tolerance of 5 cents) in the scale.</p>
         *
         * <p>(To count other intervals or set a different tolerance use @Scale.count.ratio())</p>
         * @return {Number}
         * @memberOf Scale#count
         * @example
         * let edo = new EDO(12) //define context
         * let scale = edo.scale([0,2,4,5,7,9,11]) //new Scale object
         * scale.count.P5s() //returns 6 (C-G, D-A, E-B, F-C, G-D, A-E)
         */
        P5s: () => {
            return this.count.interval(this.parent.P5s)
        },

        /**
         * <p>Returns the number of pitches in the scale (its cardinality).</p>
         * @return {Number}
         * @memberOf Scale#count
         * @example
         * let scale = edo.scale([0,2,4,5,7,9,11]) //new Scale object
         * scale.count.pitches() //returns 7
         */
        pitches: () => {
            return this.pitches.length
        },

        /**
         * <p>Returns the number of (Rahn's) differences in the scale.</p>
         * @return {Number}
         * @memberOf Scale#count
         * @example
         * let scale = edo.scale([0,2,4,5,7,9,11]) //The diatonic scale
         * scale.count.rahn_differences() //returns 56
         * @see Rahn, J. (1991). "Coordination of interval sizes in seven-tone collections." Journal of Music Theory 35(1/2): 33-60.
         * @see Scale#get.generic_intervals
         */
        rahn_differences: () => {
            let total = 0
            for (let i = 1; i < this.count.pitches(); i++) {
                let gi = this.get.generic_intervals(i)
                gi = gi.map(a=>a.instances)

                let nck = this.parent.get.n_choose_k(gi,2)
                let product = nck.map(el=>el[0]*el[1]).reduce((ag,el)=>ag+el,0)
                total+=product
            }
            return total
        },

        /**
         * <p>Returns the number of (Rahn's) contradictions in the scale.</p>
         * @return {Number}
         * @memberOf Scale#count
         * @example
         * let scale = edo.scale([0,2,4,5,7,9,11]) //The diatonic scale
         * scale.count.rahn_contradictions() //returns 0
         * @see Rahn, J. (1991). "Coordination of interval sizes in seven-tone collections." Journal of Music Theory 35(1/2): 33-60.
         */
        rahn_contradictions: (cache = this.cache) => {
            if(this.cat_getset('rahn_contradictions')) return this.cat_getset('rahn_contradictions')
            let all = []
            let total = 0
            let scale_degrees = [...Array(this.pitches.length).keys()]
            let combinations = this.parent.get.combinations(scale_degrees,2).sort((a,b)=>a[0]-b[0] || a[1]-b[1])
            let pairwise = combinations.map(c=>{
                let obj = this.get.pairwise_generic_specific_intervals(c[0],c[1])
                obj.scale_degs = c
                obj.pitches = [this.pitches[c[0]],this.pitches[c[1]]]
                return obj
            })
            for (let i = 0; i < pairwise.length-1; i++) {
                let p1 = pairwise[i]
                for (let j =i+1; j < pairwise.length; j++) {
                    let p2 = pairwise[j]
                    if((p1.generic<p2.generic && p1.specific>p2.specific) || (p2.generic<p1.generic && p2.specific>p1.specific)){
                        all.push([p1,p2])
                        total++
                    }
                }
            }
            // all = all.sort((a,b)=>(a[0].specific==b[0].specific)?a[1].specific-b[1].specific:a[0].specific-b[0].specific)
            // all.forEach(pair=>{
            //     console.log(pair[1].pitches)
            //     // console.log("Span1:",pair[0].generic,"Span2:",pair[1].generic,"Size1:",pair[0].specific,"Size2:",pair[1].specific,"int1:",pair[0].pitches,'int2:',pair[1].pitches)
            // })
            if(cache) this.cat_getset('rahn_contradictions',total)
            return total
        },

        /**
         * <p>Returns the number of (Rahn's) ambiguities in the scale.</p>
         * @return {Number}
         * @memberOf Scale#count
         * @example
         * let scale = edo.scale([0,2,4,5,7,9,11]) //The diatonic scale
         * scale.count.rahn_ambiguities() //returns 1
         * @see Rahn, J. (1991). "Coordination of interval sizes in seven-tone collections." Journal of Music Theory 35(1/2): 33-60.
         * @see Scale#get.specific_intervals
         */
        rahn_ambiguities: (cache = this.cache) => {
            if(this.cat_getset('rahn_ambiguities')) return this.cat_getset('rahn_ambiguities')
            let total = 0
            let scale_degrees = [...Array(this.pitches.length).keys()]
            let combinations = this.parent.get.combinations(scale_degrees,2).sort((a,b)=>a[0]-b[0] || a[1]-b[1])
            let pairwise = combinations.map(c=>{
                let obj = this.get.pairwise_generic_specific_intervals(c[0],c[1])
                obj.scale_degs = c
                obj.pitches = [this.pitches[c[0]],this.pitches[c[1]]]
                return obj
            })
            for (let i = 0; i < pairwise.length-1; i++) {
                let p1 = pairwise[i]
                for (let j =i+1; j < pairwise.length; j++) {
                    let p2 = pairwise[j]
                    if(p1.specific==p2.specific && p1.generic!=p2.generic ){
                        total++
                    }
                }
            }
            if(cache) this.cat_getset('rahn_ambiguities',total)
            return total
        },

        /**
         * Counts how many times some ratio appears in the scale within a given tolerance.
         * @param {Number} ratio
         * @param {Number} [tolerance=10] - a tolerance in cents
         * @return {Number}
         * @function
         * @memberOf Scale#count*/
        ratio: (ratio, tolerance = 10) => {
            /**/
            let intervals = this.parent.convert.ratio_to_interval(ratio, tolerance)
            return this.count.interval(intervals)
        },

        /**
         * <p>Returns the number of rotational symmetries in the scale.</p>
         * @return {Number}
         * @memberOf Scale#count
         *
         * @example
         * let edo = new EDO(12) //define context
         * let scale = edo.scale([0,2,3,5,6,8,9,11]) //Octatonic
         * scale.count.rotational_symmetries() //returns 4
         */
        rotational_symmetries: () => {
            return this.edo / this.count.transpositions()
        },

        /**
         * Counts how many simple ratios appear in the scale.
         * @param {Number} [limit=17] - some harmonic limit
         * @param {Number} [tolerance=15] - a tolerance in cents
         * @returns simple_ratio
         * @memberOf Scale#count
         *
         * */
        simple_ratios: (limit = 17, tolerance = 15) => {
            let ratios = this.parent.get.simple_ratios(limit = limit)
            let unique = 0
            let total = 0
            for (let ratio in ratios) {
                let result = this.count.ratio(ratios[ratio]['value'], tolerance)
                if (result > 0) {
                    unique++
                    total += result
                }
            }
            return {discrete: unique, instances: total}
        },

        /**
         * <p>Returns the number of unique tetrachords available in the scale.</p>
         * @return {Number}
         * @function
         * @memberOf Scale#count
         *
         * @example
         * let edo = new EDO(12) //define context
         * let scale = edo.scale([0,2,4,5,7,9,11]) //major
         * scale.count.tetrachords() //returns 20*/
        tetrachords: () => {
            return this.get.tetrachords().length
        },

        /**
         * <p>Returns the number of Major and Minor (sounding) Thirds (with a tolerance of 20 cents) in the scale</p>.
         *
         * <p>(To count other intervals or set a different tolerance use [Scale.count.ratio()]{@link Scale#count.ratio})</p>
         * @return {Number}
         * @see Scale#count.ratio
         * @memberOf Scale#count
         * @example
         * let edo = new EDO(12) //define context
         * let scale = edo.scale([0,2,4,5,7,9,11]) //new Scale object
         * scale.count.thirds() //returns 7
         */
        thirds: () => {
            return this.count.interval(this.parent.M3s.concat(this.parent.m3s))
        },

        /**
         * Returns number of unique transpositions available for the scale.
         * @param {Boolean} [cache] - when true, the result will be cached for faster retrieval.
         * @return {Number}
         * @function
         * @memberOf Scale#count*/
        transpositions: (cache = this.cache) => {
            if(this.cat_getset('# transpositions')) return this.cat_getset('# transpositions')
            let scale = this.pitches
            let scales = [scale]
            for (let i = 0; i < this.parent.edo; i++) {
                let t_scale = []
                scale.forEach((note) => {
                    t_scale.push((note + i + 1) % this.edo)
                })
                t_scale.sort((a, b) => a - b)
                if (this.parent.is.element_of(t_scale, scales)) return scales.length
                scales.push(t_scale)

            }
            let result = scales.length
            if (cache) this.cat_getset('# transpositions',result)
            return result
        },

        /**
         * <p>Returns the number of unique trichords available in the scale.</p>
         * @return {Number}
         * @function
         * @memberOf Scale#count
         *
         * @example
         * let edo = new EDO(12) //define context
         * let scale = edo.scale([0,2,4,5,7,9,11]) //major
         * scale.count.trichords() //returns 15*/
        trichords: () => {
            return this.get.trichords().length
        },

        /**
         * <p>Returns the number of elements in the scale that are not in the provided arr.</p>
         * <p>Remark: "pitch-classes" conform to the current tuning system used. E.g., 0-11 in 12EDO, 0-16 in 17EDO, etc.</p>
         * @param  {Array<Number>} arr - a collection of pitch classes
         * @return {Array<Number>}
         * @function
         * @memberOf Scale#count
         *
         * @example
         * let edo = new EDO(12) //define context
         * let scale = edo.scale([0,2,4,5,7,9,11]) //major
         * scale.count.unique_elements([2]) //6*/
        unique_elements: (arr) => {

            let p = this.pitches
            let unique=p.length
            p.forEach(n=>{
                if(arr.indexOf(n)!=-1) unique--
            })
            return unique
        }



    }

    /**A collection of functions that exports various file formats
     * @namespace*/
    export = {
        /**Generates a scala file with the current tuning of the scale
         * @param {String} [filename] - When not provided, the file name will be the name of the scale
         * @param {String} [dir=true] - The directory to which the file will be saved
         * @memberOf Scale#export
         *
         * @example
         * let edo = new EDO(17) //define context
         * let scale = edo.scale([0,1,4,5,7,13,16]) //some scale in 17-EDO
         * scale.export.scala("my_tuning.scl") //outputs /scala/my_tuning.scl
         */
        scala: (filename, dir = "scala/",) => {
            let scale_name = this.get.name()
            filename = filename || scale_name + ".scl"
            let file = "! " + filename + "\n"
            file += "!\n" + scale_name + " " + JSON.stringify(this.get.pitches()) + "\n"
            file += String(this.count.pitches() + 1) + "\n!\n"
            let scale_in_cents = this.to.cents()
            for (let pitch of scale_in_cents) {
                file += String(pitch) + "\n"
            }
            file += "2/1"
            save_file(filename, dir, file)
        }
    }

    /**A collection of functions manipulates the scale and returns diverse information about it
     * @namespace*/
    get = {

        /** Returns the area of the polygon created by the nodes of the set on the bracelet.
         * With radius left to its default value, the area of the entire bracelet is 1, so this function will return a value between 0 to 1.
         * @param  {Number} [r = 0.56418958354776] - The radius of the circle/bracelet. The default value is the radius of a circle with area=1
         * @returns {Number} The area of the polygon. with the default settings if also conveys the percentage of the circle being occupied. (0=0% - 1=100%)
         * @memberOf Scale#get
         * @see EDO#get.area
         * @example
         * let edo = new EDO(12) //define context
         * let scale = edo.scale([0,1,2,3,4,5,6,7,8,9,10,11]) //chromatic scale
         * scale.get.coordinates() //returns 0.9549296585513847
         *
         * scale = edo.scale([0,4,7]) //major triad
         * scale.get.area() //returns 0.376564638493296
         */
        area: (r=0.56418958354776 /*radius of circle with area=1*/) => {
            const angle_discrete = 360/this.edo
            const coors = this.get.coordinates([0,0],r)
            let part_a=0
            let part_b=0
            for (let i = 0; i < coors.length; i++) {
                part_a+=(coors[i][0]*coors[(i+1)%coors.length][1])
                part_b+=(coors[i][1]*coors[(i+1)%coors.length][0])
            }
            let area = Math.abs((part_a-part_b)/2)
            return area
        },

        //TODO: Write documentation
        /** <p>Documentation missing.</p>
         * @memberOf Scale#get
         * @see EDO#get.unevenness()
         */
        binary_unevenness: (collapsed=true) => {
            function get_errors(scale, level=1) {
                let even_split = scale.edo/2
                let as_steps = scale.to.steps()
                let cardinal_edo = new EDO(scale.count.pitches())
                let best_split = cardinal_edo.get.evenly_split(2) //Best split within the context of the EDO
                let segments = [as_steps.slice(0,best_split[0]),as_steps.slice(best_split[0])]
                let segment_sum = segments.map(segment => segment.reduce((ag, e) => ag + e, 0))
                let segment_error = segment_sum.map(s => Math.abs(s - even_split))
                let sum_of_errors = segment_error.reduce((agg, e) => agg + e, 0)
                let mean_of_sum_of_errors = sum_of_errors/2
                let segment_errors = []
                for (let i = 0; i < segments.length; i++) {

                    if(segments[i].length>=2) {
                        let segment = segments[i]
                        let segment_span = segment.reduce((ag, e) => ag + e, 0)
                        let segment_edo = new EDO(segment_span)
                        let segment_scale = segment_edo.scale(segment_edo.convert.intervals_to_scale(segment),false)
                        let result = get_errors(segment_scale,level+1)
                        segment_errors.push(result)
                    }
                }
                let segment_sums = segments.map(segment=>segment.reduce((ag, e) => ag + e, 0))
                if(segment_errors.length==0) return {this_level_segments: segment_sums, this_level_mean_error:mean_of_sum_of_errors, level:level}
                else return {this_level_segments: segment_sums, this_level_mean_error:mean_of_sum_of_errors,lower_levels:segment_errors,level:level}

            }
            let modes = []
            for (let i = 0; i < this.count.pitches(); i++) {
                let mode = this.mode(i)
                let result = get_errors(mode)

                modes.push({mode: mode.pitches, level:0,lower_levels:[result]})
            }

            function collapse(obj) {
                let flattened = {}
                function do_collapse(part) {
                    let level = part['level']
                    if(!(level in flattened)) flattened[level] = []
                    flattened[level].push(part['this_level_mean_error'])
                    if('lower_levels' in part) {
                        part['lower_levels'].forEach(segment=> {
                            do_collapse(segment)
                        })
                    }
                }
                modes.forEach(mode=>{
                    do_collapse(mode)
                })
                delete flattened['0']
                for (let key in flattened) {
                    flattened[key] = flattened[key].reduce((ag,e)=>ag+e,0)/flattened[key].length
                }
                let sums = []
                for (let key in flattened) sums.push(flattened[key])
                return sums.reduce((ag,e)=>ag+e,0)/sums.length
            }



            if(collapsed) return collapse(modes)
            else return modes

        },


        /** <p>Returns the intervals and combinations of intervals that only occur once in the set.</p>
         * <p>For instance, in the diatonic set (0 2 4 5 7 9 11) an interval of 6 semitones only occurs once (between 5 and 11). It is therefore a "diagnostic" interval within the diatonic scale.</p>
         * @returns {Array<Array<Number>>} An array containing all diagnostic combinations
         * @memberOf Scale#get
         * @see EDO#get.diagnostic_intervals
         */
        diagnostic_combinations: (cache = this.cache) => {
            if(this.cat_getset('diagnostic_combinations')) return this.cat_getset('diagnostic_combinations')
            let combinations = []
            for (let i = 2; i < this.count.pitches(); i++) {
                let n_chords = this.get.n_chords(i)
                n_chords = n_chords.map(n=>[n,this.get.position_of_quality(n).length])
                n_chords.forEach(n=>{
                    if(n[1]==1) combinations.push(n[0])
                })
            }
            if(cache) this.cat_getset('diagnostic_combinations',combinations)
            return combinations
        },

        /** <p>Returns the (specific) intervals that only occur once in the set.</p>
         * <p>For instance, in the diatonic set (0 2 4 5 7 9 11) an interval of 6 semitones only occurs once (between 5 and 11). It is therefore a "diagnostic" interval within the diatonic scale.</p>
         * @returns {Array<Number>} An array containing all diagnostic intervals (or an empty array if none are available)
         * @memberOf Scale#get
         * @see EDO#get.diagnostic_intervals
         * @example
         * let edo = new EDO(12) //define context
         * let scale = edo.scale([0,2,4,5,7,9,11]) //The diatonic set
         * scale.get.diagnostic_intervals() //returns [6]
         */
        diagnostic_intervals: (cache = this.cache) => {
            if(this.cat_getset('diagnostic_intervals')) return this.cat_getset('diagnostic_intervals')
            let intervals = []
            for (let i = 1; i <= Math.floor(this.edo/2); i++) {
                let specific = this.get.specific_intervals(i)
                if(!specific) continue
                if(specific.length==0) continue
                let all1 = true
                specific.forEach(s=>{
                    if(s.instances!=1) all1=false
                })
                if(all1) intervals.push(specific[0].specific)
            }
            if(cache) this.cat_getset('diagnostic_intervals',intervals)
            return intervals
        },

        /** <p>Returns the current edo (number of equal divisions of the octave) used by the scale
         * @memberOf Scale#get
         * @example
         * let edo = new EDO(12) //define context
         * let scale = edo.scale([0,2,4,5,7,9,11]) //The diatonic set
         * scale.get.edo() //returns 12
         */
        edo: () => this.edo,

        /** Returns the difference between the current scale and a given set.
         * @param  {Array<Number>} [set = [0,2,4,5,7,9,11]] - The set the current scale is compared to
         * @param  {Boolean} [consider_all_modes=false] - Indicates whether the algorithm should consider every possible mode of the current scale to assess which is closest to the comparison set, or whether it should only consider the current set in its current mode.
         * @param  {Number} [valid_diviations_max = 1] - The maximal amount each constituent can be "altered" to still be considered a "valid" alteration of the comparison set.
         *
         * @returns {Object}
         * @memberOf Scale#get
         * @example
         * let edo = new EDO(12) //define context
         * let scale = edo.scale([0,2,4,5,7,8,10]) //
         * scale.get.set_difference() //returns
         * {
         *  valid: true, //Whether it's a valid alteration of the comparison set or not
         *  alterations: 2, //The amount of pitches that were altered between the sets
         *  delta: [0, 0, 0, 0, 0, -1, -1], //The alteration vector
         *  mode: [0, 2, 4, 5, 7, 8, 10] // The mode of the scale that was used
         * }
         */
        set_difference: (set = [0,2,4,5,7,9,11],consider_all_modes=false,valid_diviations_max=1) =>{

            let modes = (consider_all_modes)?this.count.pitches():1
            let deltas = []
            let valids =[]
            let alterations=[]
            let mode = []

            for (let i = 0; i < modes; i++) {
                let p = this.mode(i).pitches
                let delta = []
                for (let i = 0; i < p.length; i++) {
                    delta.push(p[i]-set[i])
                }
                let valid = delta.map(el=>Math.abs(el)<=valid_diviations_max).reduce((ag,el)=>(ag && el),true)
                let alteration = delta.reduce((ag,el)=>(el!=0)?ag+1:ag,0)
                deltas.push(delta)
                valids.push(valid)
                mode.push(i)
                alterations.push(alteration)
            }

            for (let i = valids.length-1; i >=0 ; i--) {
                if(!valids[i]) {
                    valids.splice(i,1)
                    deltas.splice(i,1)
                    alterations.splice(i,1)
                    mode.splice(i,1)
                }
            }
            let min_alter = Math.min(...alterations)
            let min_ind = alterations.indexOf(min_alter)
            return {valid:valids[min_ind]||false,alterations:alterations[min_ind],delta:deltas[min_ind],mode:valids[min_ind]?this.mode(mode[min_ind]).pitches:undefined}
        },

        /** Returns a vector indicating the delta between two different sets of the same cardinality.
         * @param  {Array<Number>} [set = [0,2,4,5,7,9,11]] - The set the current scale is compared to
         *
         * @returns {Object}
         * @memberOf Scale#get
         * @example
         * let edo = new EDO(12) //define context
         * let scale = edo.scale([0,2,4,5,7,8,10])
         * scale.get.per_note_set_difference() //returns [0, 0, 0, 0, 0, 1, 1]
         */
        per_note_set_difference: (set = [0,2,4,5,7,9,11]) => {
            let pitches = this.pitches

            let delta = pitches.map((p,i)=>{
                return set[i]-p
            })
            return delta
        },

        /** Returns the [x,y] coordinates of the nodes of the scale.
         * @param  {Array<Number>} [circle_center=[0,0]] - The center of the circle
         * @param  {Number} [r=0.56418958354776] - The radius of the circle. By default the radius is of a circle with area=1
         * @returns {Array<Array<Number,Number>>} An array with tuples each corresponding to the x,y position of every pitch
         * @memberOf Scale#get
         * @see EDO#get.coordinates
         * @example
         * let edo = new EDO(12) //define context
         * let scale = edo.scale([0,3,7]) //minor triad
         * scale.get.coordinates()
         * //returns [
         *  [00.56418958354776]
         *  [0.564189583547763.454664838020213e-17]
         *  [-0.2820947917738801-0.48860251190292314]
         * ]
         */
        coordinates: (circle_center=[0,0],r=0.56418958354776) => {
            return this.parent.get.coordinates(this.pitches,circle_center,r)
        },

        /** Returns all the transpositions of the scale that are constructed on the scale degrees of the original scale,
         * As well the the number of notes altered to get from the original scale to the new scale as a "Tuple"
         * @param  {Boolean} [normalize=true] - when true, all of the transpositions will be constructed by altering the original scale
         * @returns {Array<Array<Number>,Number>} An array containing all of the stacks
         * @memberOf Scale#get
         * @example
         * let edo = new EDO(12) //define context
         * let scale = edo.scale([0,3,7]) //minor triad
         * scale.get.common_tone_transpositions()
         * //returns
         *
         * [
         *  [ [ 0, 3, 7 ], 0 ],
         *  [ [ 0, 4, 9 ], 2 ],
         *  [ [ 0, 5, 8 ], 2 ],
         *  [ [ 3, 6, 10 ], 2 ],
         *  [ [ 3, 8, 11 ], 2 ],
         *  [ [ 2, 7, 10 ], 2 ],
         *  [ [ 4, 7, 11 ], 2 ]
         * ]
         */
        common_tone_transpositions: (sort) => {
            let modes = this.get.modes()
            let result = []
            this.pitches.forEach((pitch) => {
                modes.forEach((mode, inversion) => {
                    let transposition = mode.map((note) => this.parent.mod(note + pitch, this.edo))
                    if(sort) transposition = transposition.sort((a, b) => a - b)
                    let CT = this.parent.count.common_tones(this.pitches, transposition)
                    result.push({
                        transposition: transposition,
                        common_tones: CT,
                        altered_tones: this.count.pitches() - CT,
                        common_tone: pitch,
                        as_scale_degree: inversion + 1
                    })
                })
            })
            result = this.parent.get.unique_elements(result)
            return result
        },

        /** <p>Returns all the pitch-classes (of the current tuning system) that the scale does not use.</p>
         * <p>Remark: "pitch classes" conform to the current tuning system used. E.g., 0-11 in 12EDO, 0-16 in 17EDO, etc.</p>
         * @param {boolean} [from_0=false] - when true, the output will be normalized to 0.
         * @returns {Array<Number>}
         * @memberOf Scale#get
         * @example
         * let edo = new EDO(12) // define a tuning system
         * let scale = edo.scale([0,2,4,5,7,9,11])
         * scale.get.complement()
         * //returns [1, 3, 6, 8, 10]
         *
         * scale.get.complement(true)
         * //returns [0, 2, 5, 7, 9]
         */
        complement: (from_0) => {
            return this.parent.get.complementary_set(this.pitches, from_0)
        },

        /** <p>Returns the pitch classes of a chord "shape" on a given scale degree.</p>
         * <p>for instance, in the C major scale, the shape 1,2,3,5 on 1 gives C D E G, and starting on 2, gives D E F A.</p>
         * <p>Remark: "pitch classes" conform to the current tuning system used. E.g., 0-11 in 12EDO, 0-16 in 17EDO, etc.</p>
         * @param {Array<Number>} shape - The "shape" starting from 1.
         * @param {Number} [scale_degree=1] - The scale degree on which to apply the shape (starting from 1)
         * @returns {Array<Number>} - The resultant pitch classes from that shape on that scale degree.
         * @memberOf Scale#get
         * @example
         * let edo = new EDO(12) // define a tuning system
         * let scale = edo.scale([0,2,4,5,7,9,11])
         * scale.get.chord_quality_from_shape([1,5,6],1)
         * //returns [0, 7, 9]
         *
         * scale.get.chord_quality_from_shape([1,3,4,5,7],7)
         * //returns [11, 2, 4, 5, 9]
         *
         * scale.get.chord_quality_from_shape([1,7,3,13,9],5) //Get a 7,9,13 (no 5) chord, on scale degree 5, in this specific voicing.
         */
        chord_quality_from_shape: (shape,scale_degree=1) =>{
            shape = shape.map(note=>{
                note = this.parent.mod(note,this.pitches.length)
                return (note==0)?this.pitches.length:note
            })
            return shape.map(note=>{
                let pos = this.parent.mod((note+scale_degree)-2,this.pitches.length)
                return this.pitches[pos]
            })
        },

        /** <p>Returns a melody by providing a list of generic intervals to traverse within the scale.</p>
         * @param {Array<Number>} intervals - A list of generic intervals (how many scale degrees away from current)
         * @param {Number} [starting_scale_degree=1] - The first note of the melody
         * @param {Number} [starting_pitch=0] - The first pitch of the melody
         * @returns {Array<Number>} - The a diatonic melody
         * @memberOf Scale#get
         * @example
         * let edo = new EDO(12) // define a tuning system
         * let scale = edo.scale([0,2,4,5,7,9,11]) //major
         * scale.get.melody_from_intervals([7,-1,-2,1,1,1,-7,5,-1,-6,5,-1]) //Over the rainbow
         * //returns [0, 12, 11, 7,  9, 11, 12,  0,  9, 7, -3,  5, 4]
         */
        melody_from_intervals: (intervals,starting_scale_degree=1,starting_pitch=0) => {
            let scale_degrees = [starting_scale_degree]
            intervals.forEach(interval=> {
                let last_scale_degree = scale_degrees[scale_degrees.length-1]
                scale_degrees.push(last_scale_degree+interval)
            })
            let melody = scale_degrees.map(s=>{
                let pc = this.get.pitches()[this.parent.mod(s-1,this.count.pitches())]
                let octave = Math.floor((s-1)/this.count.pitches())
                return pc + (octave*this.edo)
            })

            melody = melody.map(p=>p+(starting_pitch-melody[0]))


            return melody
        },

        /** <p>Given a generic interval ("scale degrees apart") returns all of the specific intervals.</p>
         * @param {Number} generic_interval_size- The generic interval
         * @returns {Array<Object>}
         * @memberOf Scale#get
         * @example
         * let edo = new EDO(12) // define a tuning system
         * let scale = edo.scale([0,2,4,5,7,9,11])
         * scale.get.generic_intervals(3) //3 scale-degrees apart (e.g 4ths)
         * //returns
         * [
         *  {"generic":3,"specific":5,"pitches":[[0,5],[2,7],[4,9],[7,0],[9,2],[11,4]],"instances":6},
         *  {"generic":3,"specific":6,"pitches":[[5,11]],"instances":1}
         * ]
         * @see Rahn, J. (1991). "Coordination of interval sizes in seven-tone collections." Journal of Music Theory 35(1/2): 33-60.
         * @see Scale#get.specific_intervals
         */
        generic_intervals: (generic_interval_size=1) => {

            let arr = []
            let g= generic_interval_size
            if(g<1) return NaN
            let mod = this.parent.mod
            let p =this.pitches
            let len = p.length
            let map = {}
            for (let i = 0; i < len; i++) {
                let note1 = p[i]
                let note2 = p[mod(i+g,len)]
                let spec = mod(note2-note1,this.edo)
                if(!map[spec]) map[spec]=[[note1,note2]]
                else map[spec].push([note1,note2])
            }
            for(let key in map) {
                arr.push({generic:g,specific:parseInt(key),instances:map[key].length,pitches:map[key]})
            }
            return arr
        },

        /** <p>Given a specific interval (in semitones or whatever the smallest division is) returns all of the generic intervals.</p>
         * @param {Number} specific_interval_size- The specific interval size (in semitones or whatever the smallest division is)
         * @returns {Array<Object>}
         * @memberOf Scale#get
         * @example
         * let edo = new EDO(12) // define a tuning system
         * let scale = edo.scale([0,2,4,5,7,9,11])
         * scale.get.specific_intervals(6)
         * //returns
         * [
         *  {"generic":"3","specific":6,"pitches":[[5,11]],"instances":1},
         *  {"generic":"4","specific":6,"pitches":[[11,5]],"instances":1}
         * ]
         * @see Rahn, J. (1991). "Coordination of interval sizes in seven-tone collections." Journal of Music Theory 35(1/2): 33-60.
         * @see Scale#get.generic_intervals
         */
        specific_intervals: (specific_interval_size=1) => {
            let arr = []
            let s= specific_interval_size
            let mod = this.parent.mod
            let p =this.pitches
            let len = p.length
            let map = {}
            loop1:
            for (let i = 0; i < len; i++) {
                loop2:
                for (let g = 1; g < len; g++) {
                    let note1=p[i]
                    let note2 = p[mod(i+g,len)]

                    let diff =  mod(note2-note1,this.edo)
                    if(diff==s) {
                        if(!map[g]) map[g]=[[note1,note2]]
                        else map[g].push([note1,note2])
                        break loop2
                    } else if (diff>s) break loop2
                }
            }
            for(let key in map) {
                arr.push({generic:key,specific:s,pitches:map[key],instances:map[key].length})
            }
            return arr

        },

        /** Returns the interval vector of the scale.
         * @param  {Boolean} cache - When true, the result will be cached for faster retrieval
         * @returns {Array<Number>} An array representing the vector
         * @memberOf Scale#get
         *
         * @example
         * let edo = new EDO(12) //define context
         * let scale = edo.scale([0,2,4,5,7,9,11]) //major scale
         * scale.get.interval_vector() //returns [ 1, 5, 2, 3, 3, 1 ]
         */
        interval_vector: (cache = this.cache) => {
            if(this.cat_getset('interval_vector')) return this.cat_getset('interval_vector')

            let scale_split = Math.floor(this.edo / 2)
            let vector = Array.from(new Array(scale_split).fill(0))
            let normal = this.get.normal_order()
            for (let i = 0; i < normal.length - 1; i++) {
                for (let j = i + 1; j < normal.length; j++) {
                    let IC = normal[j] - normal[i]
                    if (IC > scale_split) IC = this.edo - IC
                    if (IC == 0) IC = scale_split
                    vector[IC - 1]++
                }

            }

            if (cache) this.cat_getset('interval_vector',vector)
            return vector


        },

        /** <p>Returns the scale's inversion</p>

         * @param {Boolean} [cache] - When true, the result will be cached for future retrieval
         * @returns {Array<Number>} the inverted pitches
         * @memberOf Scale#get
         *
         * @example
         * let edo = new EDO(12) //define context
         * let scale = edo.scale([0,2,4,5,7,9,11]) //major scale
         * scale.get.inversion() //returns [0, 2, 4, 6, 7, 9, 11]*/
        inversion: (cache = this.cache) => {
            /*Inverts the intervals of the scale*/
            if(this.cat_getset('inverted')) return this.cat_getset('inverted')

            let scale = this.parent.get.inversion(this.pitches, cache = cache)
            if (cache) this.cat_getset('inverted',scale)

            return scale
        },

        /** <p>Returns the smallest multiplier between the sizes of steps</p>
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

            let steps = this.get.step_sizes()
            if (steps.length == 1) return 1
            let size = this.edo
            for (let i = 0; i < steps.length - 1; i++) {
                if (steps[i + 1] / steps[i] < size) size = steps[i + 1] / steps[i]
            }
            return size
        },

        /** <p>Calculates the attraction between note1 to note2 according to Lerdahl's formula in TPS</p>
         * @see Lerdahl, F. (2004). Tonal pitch space, Oxford University Press.
         * @param {Number} note1 - The first pitch-class
         * @param {Number} note2 - The second pitch-class
         * @returns {Number} The value of attraction between note1 and note2
         * @memberOf Scale#get
         *
         * @example
         * let edo = new EDO(12) //define tuning
         * let scale = edo.scale([0,2,4,5,7,9,11]) //major scale
         * scale.get.lerdahl_attraction(1,0) //returns 4*/
        lerdahl_attraction: (note1, note2) => {
            if (note1 == note2) return 0
            note1 = {pitch: note1}
            note2 = {pitch: note2}

            // first we check which level each pitch belongs to:
            // 1 if C, 2 if E or G, and 3 for everything else

            const get_note_anchoring_strength = (note) => {
                if (note == 0) return 4
                else {
                    if (this.parent.P5s.indexOf(note) >= 0 || this.parent.M3s.indexOf(note) >= 0) return 3
                    else return 1
                }
            }

            note1.anchoring = get_note_anchoring_strength(note1.pitch)
            note2.anchoring = get_note_anchoring_strength(note2.pitch)

            let dist = Math.abs(note1.pitch - note2.pitch)
            if (dist > this.edo / 2) dist = this.edo - dist
            dist = dist * 12 / this.edo

            //if neither note is more stable
            if (note2.anchoring == note1.anchoring) return 0

            // original Lerdahl uses square of distance.
            // return (note2['anchoring']/note1['anchoring'])*(1/math.pow(dist,2))
            // I find that omitting the square generalizes better
            return (note2.anchoring / note1.anchoring) * (1 / dist)
        },

        /** <p>Returns a graphic vector showing the tendencies of each note in the scale</p>
         * @returns {Array<String>} The attraction vector
         * @see Scale.get.lerdahl_attraction()
         * @see Lerdahl, F. (2004). Tonal pitch space, Oxford University Press.
         * @example
         * let edo = new EDO(12) //define tuning
         * let scale = edo.scale([0,2,4,5,7,9,11]) //major scale
         * scale.get.lerdahl_attraction_vector() //returns [*,<>,*,<>,*,<<,>>]
         * @memberOf Scale#get*/
        lerdahl_attraction_vector: () => {

            let vector = []
            for (let i = 0; i < this.pitches.length; i++) {
                let note = this.pitches[i]
                let ln = this.pitches[this.parent.mod(i - 1, this.pitches.length)]
                let un = this.pitches[this.parent.mod(i + 1, this.pitches.length)]
                ln = this.get.lerdahl_attraction(note, ln)
                un = this.get.lerdahl_attraction(note, un)
                if (ln < 1 && un < 1) vector.push('*')
                else if (ln < 1 && un >= 1) vector.push('>>')
                else if (ln >= 1 && un < 1) vector.push('<<')
                else if (ln >= 1 && un >= 1) vector.push('<>')
            }
            return vector

        },

        /** <p>Returns the Levenshtein distance of the scale to another scale</p>
         * @param {Array<Number>} t - Some collection of pitches to perferm the comparison with
         * @param {Boolean} [ratio_calc=false] - When true, the function computes the
         levenshtein distance ratio of similarity between two strings
         * @returns {Number}
         * @example
         * let edo = new EDO(12) //define tuning
         * let scale = edo.scale([0,2,4,7,9]) //a major pentatonic scale
         * scale.get.levenshtein([0,2,4,5,7,9,11]) //returns 2
         *
         * @example
         * scale.get.levenshtein([0,2,4,5,7,9,11],true) //returns 0.9230769230769231
         * @memberOf Scale#get
         * @see EDO#get.levenshtein
         * */
        levenshtein: (t, ratio_calc = false) => {
           return this.parent.get.levenshtein(this.pitches,t,ratio_calc)
        },

        /** <p>Returns true if a scale has the Myhill Property</p>
         * @param {Number} [constant=2] - The exact number of specific intervals necessary for each generic interval
         * @returns {Boolean}
         * @example
         * let edo = new EDO(12) //define tuning
         * let scale = edo.scale([0,2,4,7,9]) //a major pentatonic scale
         * scale.get.myhill_property() //true
         * @see Clough, J. and G. Myerson (1985). "Variety and multiplicity in diatonic systems." Journal of Music Theory 29(2): 249-270.
         * */
        myhill_property: (constant = 2)=>{
            let map = {}
            let mod = this.parent.mod
            let n = this.count.pitches()
            let p = this.pitches
            for (let i = 1; i < n; i++) {
                map[i]=new Set()
                for (let j = 0; j < n; j++) {
                    map[i].add(mod(p[mod(j+i,n)]-p[j],this.edo))
                    if(map[i].size>constant) return false
                }
            }
            for (let i = 1; i <n ; i++) {
                if(map[i].size!=constant) return false
            }

            return true
        },

        /** Returns all the various modes (normalized to 0, that include all pitches) available from this scale
         * @param  {Boolean} cache - When true, the result will be cached for faster retrieval
         * @returns {Array<Array<Number>>} An array of the different modes
         * @memberOf Scale#get
         *
         * @see EDO#get.modes
         *
         * @example
         * let edo = new EDO(12) //define context
         * let scale = edo.scale([0,2,4,7,9]) //pentatonic scale
         * scale.get.modes()
         * //returns
         * [
         *  [ 0, 2, 4, 7, 9 ],
         *  [ 0, 2, 5, 7, 10 ],
         *  [ 0, 3, 5, 8, 10 ],
         *  [ 0, 2, 5, 7, 9 ],
         *  [ 0, 3, 5, 7, 10 ]
         * ]
         */
        modes: (cache = this.cache) => {
            if(this.cat_getset('modes')) return this.cat_getset('modes')

            let modes = this.parent.get.modes(this.pitches)
            if (cache) this.cat_getset('modes',modes)
            return modes
        },

        /**
         * <p>Same as [EDO.get.motives()]{@link EDO#get.motives} only instead of considering pitches as pitch classes, it looks at them as scale degrees.</p>
         * <p>As such, in the scale <code>[0,2,4,5,7,9,11]</code>, <code>[0,2,4]</code> and <code>[2,4,5]</code> are considered the same motive
         * This is because while the former has steps of size <code>[2,2]</code> and the latter <code>[2,1]</code> they both represent moving
         * 2 scale degrees up step wise in the scale <code>[1,1]</code>.</p>
         * @param  {Array<Number>} melody - a collection of pitches to find (in order)
         * @param  {Boolean} [allow_skips=true] - if false, the search will only be done on consecutive items
         * @return {Array<motive>}
         * @memberOf Scale#get
         * @see {@link EDO#get.motives}
         * @example
         * let edo = new EDO(12) // define a tuning system
         * let melody = [8,7,7,8,7,7,8,7,7,15,15,14,12,12,10,8,8,7,5,5] // Mozart Symphony no. 40
         * let scale = edo.scale([0,2,3,5,7,8,10]) //natural minor
         * scale.get.motives_diatonic(melody) // find diatonic motives in the melody
         *                      .slice(0,3) //show top 3
         * //returns (motives are represented in change in scale degrees)
         * [
         *  { motive: [ 0 ], incidence: 9 },
         *  { motive: [ -1 ], incidence: 6 },
         *  { motive: [ -1, 0 ], incidence: 5 }
         * ]
         */
        motives_diatonic: (melody, allow_skips = false,maximal_length=8) => {
            let scale = this.pitches
            let not_in_scale = melody.filter((note) => scale.indexOf(this.parent.mod(note, this.edo)) == -1)
            if (not_in_scale.length > 0) return null

            scale = this.parent.get.unique_elements(scale).sort((a, b) => a - b)

            let scale_degrees = melody.map((note) => scale.indexOf(note) + 1)
            let motives = this.parent.get.motives(scale_degrees, true, allow_skips,maximal_length)
            return motives

        },

        /** <p>Returns every n_chord (bichord (<code>n=2</code>), trichord (<code>n=3</code>), tetrachord (<code>n=4</code>), etc.) available in this scale</p>
         * @param  {Number} n - Number of pitches in every chord
         * @param  {Boolean} [normalize=true] - When true, the function will return n_chords in normal order. otherwise it will return them as they appear in the scale
         * @param  {Boolean} [prime_form=false] - When true, the function will return n_chords in prime form
         * @param  {Boolean} [cache] - When true, the result will be cached for faster retrieval
         * @returns {Array<Number>} An array containing all n_chords
         * @memberOf Scale#get
         *
         * @example
         * let edo = new EDO(12) //define context
         * let scale = edo.scale([0,2,4,7,9]) //pentatonic scale
         * scale.get.n_chords(3) //same as scale.get.trichords()
         * [
         *  [ 0, 2, 4 ],
         *  [ 0, 2, 7 ],
         *  [ 0, 3, 5 ],
         *  [ 0, 4, 7 ],
         *  [ 0, 3, 7 ],
         *  [ 0, 2, 5 ]
         * ]
         *
         * @see Scale#get.trichords
         * @see Scale#get.tetrachords
         */
        n_chords: (n,normalize = true, prime_form=false,cache = this.cache) => {
            if((!normalize) && prime_form) return undefined
            if(this.cat_getset(['n_chords',(normalize)?'normalized':'unnormalized',(prime_form)?"prime":"not_prime",n])) {
                return this.cat_getset(['n_chords',(normalize)?'normalized':'unnormalized',(prime_form)?"prime":"not_prime",n])
            }

            let unique = this.parent.get.unique_elements
            let p = this.parent


            const combine = function(pitches, n) {
                function fn (p,c=[]) {
                    if(c.length==n) all.push(c)
                    else {
                        for (let i = 0; i < p.length; i++) if(c.length<n) fn([...p.slice(i+1)],[...c,p[i]])
                    }
                }
                let all = [];
                fn(pitches);

                return all;
            }

            let regular = combine(this.get.pitches(),n)

            let normal = unique(regular.map(r=>p.get.normal_order(r,cache)))
            let prime =  unique(normal.map(r=>p.scale(r).prime().pitches))
            if (cache) {
                this.cat_getset(['n_chords','unnormalized',"not_prime",n],regular)
                this.cat_getset(['n_chords','normalized',"not_prime",n],normal)
                this.cat_getset(['n_chords','normalized',"prime",n],prime)
            }
            if(prime_form) return prime
            if(normalize) return normal

            return regular
        },
        // n_chords: (n, normalize = true, prime_form=false,cache = false) => {
        //     let iasd = 0
        //     if((!normalize) && prime_form) return undefined
        //     if(this.cat_getset(['n_chords',(normalize)?'normalized':'unnormalized',(prime_form)?"prime":"not_prime",n])) {
        //         return this.cat_getset(['n_chords',(normalize)?'normalized':'unnormalized',(prime_form)?"prime":"not_prime",n])
        //     }
        //     let unique = this.parent.get.unique_elements
        //     let mod = this.parent.mod
        //     let p = this.parent
        //     let regular = []
        //
        //     const run_it = (i = 0, n_chord = []) => {
        //         iasd++
        //         if (n_chord.length == n) {
        //             if (unique(n_chord).length == n_chord.length) regular.push(n_chord.sort((a, b) => a - b))
        //             return
        //         }
        //         for (let j = i; j < this.pitches.length + (n - 1); j++) {
        //             run_it(j + 1, [...n_chord, this.pitches[mod(j, this.pitches.length)]])
        //         }
        //     }
        //     run_it()
        //
        //     regular = unique(regular)
        //
        //     let normal = unique(regular.map(r=>p.get.normal_order(r)))
        //     let prime =  unique(normal.map(r=>p.scale(r).prime().pitches))
        //     console.log(iasd)
        //     if (cache) {
        //         this.cat_getset(['n_chords','unnormalized',"not_prime",n],regular)
        //         this.cat_getset(['n_chords','normalized',"not_prime",n],normal)
        //         this.cat_getset(['n_chords','normalized',"prime",n],prime)
        //     }
        //     if(prime_form) return prime
        //     if(normalize) return normal
        //
        //     return regular
        // },



        /** <p>Return every quality available in the scale for a combination of <code>n</code> scale degrees.</p>
         * @param  {Number} n - Number of pitches in every chord
         * @returns {Array<steps_quality_obj>}
         * @memberOf Scale#get
         * @see Scale#get.steps_to_qualities
         */
        n_chords_diatonic: (n) => {
            let t_edo = new EDO(this.count.pitches())
            let t_scale = t_edo.scale(Array.from(Array(this.count.pitches()).keys()))
            let combinations = t_scale.get.n_chords(n)
            let modes = this.get.modes()
            let n_chords = combinations.map((combo) => {
                let steps = this.parent.convert.to_steps(combo)
                return this.get.steps_to_qualities(steps)
            })
            n_chords = n_chords.map((chord) => {
                chord.combos = chord.combos.sort((a, b) => a.positions.length - b.positions.length)
                return chord
            })
            return n_chords
        },

        /**
         * <p>The name of the scale in the form EDO-Code, EDO being the number of divisions of the octave in the current
         * system, and code being the binary value of the scale (see example below).</p>
         * <p>For simplicity consider a system with 4 divisions. Such a system has 4 possible pitches: <code>[0,1,2,3]</code>.<br>
         *     The scale vector is a binary representation of the pitch-classes used in the scale in reversed order. So the scale
         *     [0,2] would have a representation of: <code>[0,1,0,1]</code><br>
         *         As such, the name for this scale will be 4-5</p>
         * @memberOf Scale#get
         * */
        name: (cache = this.cache) => {
            if(this.cat_getset('name')) return this.cat_getset('name')
            let normal = this.get.normal_order()
            let total = 0
            normal.forEach((i) => {
                total += Math.pow(2, i)
            })
            let name = String(this.parent.edo) + "-" + String(parseInt(total))
            if(cache) this.cat_getset('name',name)
            return name


        },

        /**
         * <p>Returns the steps of the scale in descending order</p>
         * @memberOf Scale#get
         * @example
         * let edo = new EDO(12) //define context
         * let scale = edo.scale([0,2,4,7,9]) //pentatonic scale
         * scale.get.necklace_family() // returns [ 3, 3, 2, 2, 2 ]
         * */
        necklace_family: (cache = this.cache) => {
            if(this.cat_getset('necklace_family')) return this.cat_getset('necklace_family')
            let steps = this.to.steps(cache)
            let necklace_family = steps.sort((a,b)=>b-a)
            if(cache) this.cat_getset('necklace_family',necklace_family)
            return necklace_family
        },

        /**
         * <p>Returns the steps of the scale in descending order</p>
         * @memberOf Scale#get
         * @see Scale#get.necklace_family()
         * @example
         * let edo = new EDO(12) //define context
         * let scale = edo.scale([0, 3, 5, 8, 10]) //pentatonic scale
         * scale.get.necklace_family_members()
         * //   [
         *          [ 0, 3, 5, 8, 10 ],
         *          [ 0, 3, 6, 8, 10 ]
         *      ]
         * */
        necklace_family_members: (cache = this.cache) => {
            if(this.cat_getset(['necklace_family_members'])) return this.cat_getset(['necklace_family_members'])
            let result = this.parent.get.necklace(this.get.necklace_family(false)).map(n=>this.parent.convert.intervals_to_scale(n))
            if(cache) this.cat_getset(['necklace_family_members'],result)
            return result
        },

        /** <p>Returns all of the sets whose constituents are at most <code>size</code> away from the original constituent, where no more than <code>alterations</code> constituents were altered.</p>
         * @param  {Number} [size=1] - Maximal alteration size (e.g. if 2, 3 can be altered into 2, 1, 4, or 5)
         * @param  {Number} [alterations=1] - Maximal number of constituents that can be altered.
         * @param  {Boolean} [normalize=true] - When true, the function will return the sets in normal order.
         * @param  {Boolean} [maintain_cardinality=true] - When true, the function will only return sets that have the same number of pitches as the original set.
         * @returns {Array<Number>} An array containing all neighboring sets
         * @memberOf Scale#get
         *
         * @example
         * let edo = new EDO(12) //define context
         * let scale = edo.scale([0,4,7])
         * scale.get.neighborhood() //returns
         * [
         *  [ 0, 3, 6 ],
         *  [ 0, 3, 7 ],
         *  [ 0, 2, 7 ],
         *  [ 0, 4, 8 ],
         *  [ 0, 4, 6 ]
         * ]
         */
        neighborhood: (size=1,alterations=1,normalize=true,maintain_cardinality=true) =>{
            let card = this.count.pitches()
            let parent = this.parent
            let pitches = this.pitches
            let sizes = Array.from(Array(size).keys()).map(el=>[el+1,-(el+1)]).flat()
            let alter = Array.from(Array(alterations), () => Array.from(Array(card)).map(arr=>0))
            alter = alter.map((arr,ind)=>{
                let con = Array.from(Array(ind+1).fill(1))
                arr = con.concat(arr).slice(0,card)
                arr = this.parent.get.unique_elements(this.parent.get.permutations(arr))
                return arr
            }).flat()

            const helper = function(arr,index,sizes) {
                let narr=[]
                for (let i = 0; i < sizes.length; i++) {
                    let temp = Array.from(arr)

                    temp[index] = parent.mod(temp[index]+sizes[i],parent.edo)
                    narr.push(temp)
                }
                return narr
            }
            alter = alter.map(a=>{
                let new_arrays = [Array.from(pitches)]
                let indices = a.reduce((a, e, i) => (e === 1) ? a.concat(i) : a, [])
                for (let i = 0; i < indices.length; i++) {
                    new_arrays = new_arrays.map(arr=>{
                        let h = helper(arr,indices[i],sizes)
                        return h
                    }).flat()
                }
                return new_arrays
            }).flat()
            if(normalize) alter =alter.map(arr=>parent.get.normal_order(arr))
            if(maintain_cardinality) alter =alter.filter(arr=>arr.length==card)
            alter = parent.get.unique_elements(alter)
            return alter
        },


        /** <p>Returns the scale's pitches in normal order</p>

         * @param {Boolean} [cache] - When true, the result will be cached for future retrieval
         * @returns {Array<Number>} The pitches in normal order
         * @memberOf Scale#get
         *
         * @example
         * let edo = new EDO(12) //define context
         * let scale = edo.scale([0,2,4,5,7,9,11]) //major scale
         * scale.get.normal_order() //returns [0, 1, 3, 5, 6, 8, 10] */
        normal_order: (cache = this.cache) => {
            /*
            Returns the scale in normal order

            :param cache:
            :return:
            */
            if(this.cat_getset(['normal_order'])) return this.cat_getset(['normal_order'])

            let lst = this.pitches
            let result = this.parent.get.normal_order(lst, cache = cache)

            if (cache) this.cat_getset(['normal_order'],result)
            return result

        },

        /** <p>Returns the generic and specific intervals for a pair of scale degrees</p>

     * @param {Number} SD1 - The first scale degree
     * @param {Number} SD2 - The second scale degree
     * @returns {Array<Number>}
     * @memberOf Scale#get
     *
     * @example
         * * @see Rahn, J. (1991). "Coordination of interval sizes in seven-tone collections." Journal of Music Theory 35(1/2): 33-60.
     * */
        pairwise_generic_specific_intervals: (SD1,SD2) => {
            let mod = this.parent.mod
            let p = this.pitches
            let len = p.length
            let specific = mod(p[mod(SD2,len)]-p[mod(SD1,len)],this.edo)
            let generic = mod(SD2 - SD1,len)
            return {specific:specific,generic:generic}
        },

        /** <p>Returns every ordering (permutation) of notes in the scale</p>
         *
         * <p>Uses [EDO.get.permutations()]{@link EDO#get.permutations}</p>
         * @returns {Array<Array<Number>>} The permutations of the scale
         * @memberOf Scale#get
         * @see EDO#get.permutations
         *
         * @example
         * let edo = new EDO(12) //define context
         * let scale = edo.scale([0,3,7]) //minor triad
         * scale.get.permutations()
         * //returns
         * [
         *  [ 0, 4, 7 ],
         *  [ 0, 7, 4 ],
         *  [ 4, 0, 7 ],
         *  [ 4, 7, 0 ],
         *  [ 7, 0, 4 ],
         *  [ 7, 4, 0 ]
         * ]
         * */
        permutations: () => {
            return this.parent.get.permutations(this.pitches)
        },

        /** Returns the scale's pitches as pitch classes
         * <p>Remark: "pitch classes" conform to the current tuning system used. E.g., 0-11 in 12EDO, 0-16 in 17EDO, etc.</p>
         * @returns {Array<Number>} The scale's pitches as pitch-classes
         * @memberOf Scale#get
         */
        pitches: () => {
            return this.pitches
        },

        /** <p>Gets a list of intervallic units above a root, and returns all the positions in the scale where this
         chord quality can be created</p>
         *<p>Remark: "intervallic units" conform to the current tuning system used. E.g., 0-11 occupy 1 octave in 12EDO, 0-16 in 17EDO, etc.</p>
         * @returns {Array<Number>} The pitch-classes (that appear in the scale) on which the quality can be built
         * @memberOf Scale#get
         * @example
         * let edo = new EDO(12) //define context
         * let scale = edo.scale([0,2,4,5,7,9,11]) //major scale
         * scale.get.position_of_quality([4,7]) (a major triad)
         * //returns [0,5,7] because you can construct a major triad on 0, 5, and 7*/
        position_of_quality: (intervals,cache = this.cache) => {
            if(this.cat_getset(["position_of_quality",String(intervals)])) return this.cat_getset(["position_of_quality",String(intervals)])
            let result = []
            let double_scale = [...this.pitches, ...this.pitches]
            for (let pitch of this.pitches) {
                let int = intervals.map((interval) => (interval + pitch) % this.edo)
                let s = [...int]
                if (this.parent.is.subset(s, double_scale)) result.push(pitch)
            }
            if(cache) this.cat_getset(["position_of_quality",String(intervals)],result)
            return result
        },

        /** <p>Returns the scale's pitches in prime form</p>
         * (Notice, the prime form calculation conforms to Rahn's prime form rather than Forte's)
         * @param {Boolean} [cache] - When true, the result will be cached for future retrieval
         * @returns {Array<Number>} The pitches in prime form
         * @memberOf Scale#get
         *
         * @example
         * let edo = new EDO(12) //define context
         * let scale = edo.scale([0,2,4,5,7,9,11]) //major scale
         * scale.get.prime_form() //returns [0, 1, 3, 5, 6, 8, 10]*/
        prime_form: (cache = this.cache) => {
            /*Returns the scale in prime form*/
            if(this.cat_getset(['prime_form'])) return this.cat_getset(['prime_form'])
            let i_self = this.parent.scale(this.get.inversion())
            let norm_ord = this.parent.scale(this.get.normal_order())
            let i_norm_ord = this.parent.scale(i_self.get.normal_order())
            let scale_steps = norm_ord.to.steps()
            let i_scale_steps = i_norm_ord.to.steps()
            let result = norm_ord.pitches
            for (let i = 0; i < scale_steps.length; i++) {
                if (scale_steps[i] < i_scale_steps[i]) {
                    result = norm_ord.pitches
                    break
                } else if (scale_steps[i] > i_scale_steps[i]) {
                    result = i_norm_ord.pitches
                    break
                }

            }
            if (cache) this.cat_getset(['prime_form'],result)
            return result
        },

        /** <p>Returns the scale's pitches in prime form</p>

         * @param {Number} multiplier - The number by which to multiply the set
         * @param {Boolean} [sort=false] - When true, the returned result will be sorted
         * @returns {Array<Number>} The pitches after multiplication
         * @memberOf Scale#get
         *
         * @example
         * let edo = new EDO(12) //define context
         * let scale = edo.scale([0,2,4,7,9]) //pentatonic scale
         * scale.get.product(2) //returns [ 0, 4, 8, 2, 6 ]
         * scale.get.product(5,true) //returns [ 0, 8, 9, 10, 11 ]*/
        product: (multiplier,sort=false) => {

            let res =  this.pitches.map(n=>this.parent.mod(n*multiplier,this.edo))
            if(sort) res = res.sort((a,b)=>a-b)
            return res
        },

        /** <p>Returns note combination of a given length who are restricted to only using specified intervals that are members of the scale</p>

         * @param {Array<Number>} intervals - A list of allowed intervals
         * @param {Number} length - The length of the returned combinations. If not specific length will default to the length of the scale
         * @returns {Array<Number>} The pitches after multiplication
         * "intervals" conform to the current tuning system used. 0-11 occupy 1 octave in 12EDO, 0-16 in 17EDO, etc.
         * @memberOf Scale#get
         *
        */
        quality_with_intervals: (intervals=[7],length) => {
            let all = []
            let TET = this.edo
            let helper = function (scale, sizes,length,last) {
                if(!length) length= scale.length
                if(!last) last = [scale.shift()]
                if(last.length==length) return last

                let result = sizes.map(size=>{

                    let note = (last[last.length-1]+size)%TET
                    let ind = scale.indexOf(note)
                    if(ind==-1) return false
                    else {
                        let new_scale = [...scale]
                        new_scale.splice(ind,1)
                        let new_last = [...last,note]
                        return helper(new_scale,sizes,length,new_last)
                    }
                }).reduce((ag,el)=>el?[...ag,el]:ag,[]).flat()

                const chunk = function(array, size) {
                    if (!array.length) {
                        return [];
                    }
                    const head = array.slice(0, size);
                    const tail = array.slice(size);

                    return [head, ...chunk(tail, size)];
                };
                return chunk(result.flat(),length)
            }

            let modes = this.parent.get.rotations(this.pitches)
            for (let i = 0; i < modes.length; i++) {
                all = all.concat(helper(modes[i],intervals,length))
            }


            return all
        },

        /** <p>Returns all of the rotations of the scale (not normalized to 0).</p>
         *
         * <p>To get the rotations normalized to zero (the modes) use [Scale.get.modes()]{@link Scale#get.modes}</p>
         * @returns {Array<Array<Number>>} The rotations of the scale
         * @memberOf Scale#get
         * @example
         * let edo = new EDO(12) //define context
         * let scale = edo.scale([0,3,7]) //minor triad
         * scale.get.rotations()
         * //returns [[0,3,7],[3,7,0],[7,0,3]]*/
        rotations: () => {
            let rotations = []
            let rotate = [...this.pitches]
            while (!this.parent.is.element_of(rotate, rotations)) {
                rotations.push(rotate)
                rotate = [...rotate.slice(1), ...rotate.slice(0, 1)]
            }
            return rotations
        },

        /** <p>Returns the Rothenberg Propriety value for this scale</p>
         * @see Rothenberg, D. (1977). "A model for pattern perception with musical applications part I: Pitch structures as order-preserving maps." Mathematical Systems Theory 11(1): 199-234.
         * @param {Boolean} [cache] - When true, the result will be cached for future retrieval.
         * @returns {('strictly proper'|'proper'|'improper')} The step sizes
         * @example
         * let edo = new EDO(12) //define tuning
         * let scale = edo.scale([0,2,4,7,9]) //a major pentatonic scale
         * scale.get.rothenberg_propriety()
         * //returns "strictly proper"
         * @memberOf Scale#get*/
        rothenberg_propriety: (cache = this.cache) => {
            if(this.cat_getset(['rothenberg'])) return this.cat_getset(['rothenberg'])
            let scale = this.pitches
            let map = []
            let steps = Array(scale.length - 1).fill(0).map((el, i) => i + 1)
            let intervals = this.to.steps()
            steps.forEach((step) => {
                let double_intervals = intervals.concat(intervals)
                let interval_classes = []
                for (let i = 0; i < intervals.length; i++) {
                    let sli = double_intervals.slice(i, i + step)
                    sli = sli.reduce((t, e) => t + e)
                    interval_classes.push(sli)
                }
                map.push({min: Math.min.apply(Math, interval_classes), max: Math.max.apply(Math, interval_classes)})
            })
            let strictly_proper = true
            let proper = true
            for (let i = 1; i < map.length; i++) {
                if (map[i]['min'] <= map[i - 1]['max']) strictly_proper = false
                if (map[i]['min'] < map[i - 1]['max']) proper = false
            }

            let result = ""
            if (strictly_proper) result = "strictly proper"
            else if (proper) result = "proper"
            else result = "improper"
            if (cache) this.cat_getset(['rothenberg'],result)
            return result
        },

        /** <p>Returns the sum of the roughness of every pair in the set in a certain mode or averaged across all modes</p>
         * @param {Boolean} [all_modes=false] - When true, the algorithm returns the roughness value for all of the modes
         * @param {Number} [base_freq=440] - The frequency to associate with the pitch-class 0
         * @returns Number
         * @example
         * let edo = new EDO(12) //define tuning
         * let scale = edo.scale([0,2,4,7,9]) //a major pentatonic scale
         * scale.get.roughness()
         * //returns 0.21543265646088483
         * @memberOf Scale#get
         * @see EDO#get.sine_pair_dissonance
         * */
        roughness: (all_modes=false,base_freq=440) => {
            const get_scale_roughness =function (scale) {
                    let pairs = scale.parent.get.n_choose_k(scale.pitches,2)
                    pairs = pairs.map(p=>scale.parent.convert.midi_to_freq(p,69,base_freq))
                        .map(p=>scale.parent.get.sine_pair_dissonance(p[0],p[1],1,1))
                        .reduce((ag,e)=>ag+e,0)

                    return pairs
            }
            if(all_modes) {
                let roughness_arr = []
                for (let i = 0; i < this.count.pitches(); i++) {
                    roughness_arr.push(get_scale_roughness(this.mode(i)))
                }
                return roughness_arr
            }
            else {
                return get_scale_roughness(this)
            }

        },

        /** <p>Returns the sameness quotient according to Carey (2007) (see citation)</p>
         * @returns Number
         * @example
         * let edo = new EDO(12) //define tuning
         * let scale = edo.scale([0,2,4,6,8,10]) //a whole-tone scale
         * scale.get.sameness_quotient() //returns 1
         *
         * scale = edo.scale([0,2,4,5,7,9,11]) //the diatonic scale
         * scale.get.sameness_quotient() //returns 0.5555555555555556
         * @see Carey, N. (2007). "Coherence and sameness in well-formed and pairwise well-formed scales." Journal of Mathematics and Music 1(2): 79-98.
         * @memberOf Scale#get*/
        sameness_quotient: () => {
            let D_S = this.count.rahn_differences()
            let max_D = this.parent.get.maximal_rahn_difference(this.count.pitches())
            return 1-(D_S/max_D)
        },

        /** <p>Returns the coherence quotient according to Carey (2007) (see citation)</p>
         * @returns Number
         * @example
         * let edo = new EDO(12) //define tuning
         * let scale = edo.scale([0,2,4,7,9]) //The pentatonic scale
         * scale.get.coherence_quotient() //returns 1
         * @see Carey, N. (2007). "Coherence and sameness in well-formed and pairwise well-formed scales." Journal of Mathematics and Music 1(2): 79-98.
         * @memberOf Scale#get*/
        coherence_quotient: (cache = this.cache) => {
            if(this.cat_getset(['coherence_quotient'])) return this.cat_getset(['coherence_quotient'])
            let all_amb = this.count.rahn_ambiguities()
            let all_cont = this.count.rahn_contradictions()
            let total = all_amb + all_cont
            let maximal_failures = this.parent.get.maximal_carey_coherence_failures(this.count.pitches())
            let CQ = 1-(total/maximal_failures)
            if(cache) this.cat_getset(['coherence_quotient'],CQ)
            return CQ
        },

        /** Returns all the transpositions of the scale that are constructed on the scale degrees of the original scale,
         * As well the the number of notes altered to get from the original scale to the new scale as a "Tuple"
         * @param  {Boolean} [normalize=true] - when true, all of the transpositions will be constructed by altering the original scale
         * @returns {Array<Array<Number>,Number>} An array containing all of the stacks
         * @memberOf Scale#get
         * @example
         * let edo = new EDO(12) //define context
         * let scale = edo.scale([0,2,4,5,7,9,11]) //major scale
         * scale.get.scale_degree_transpositions()
         * //returns
         *
         * [
         *  [ [0, 2, 4, 5, 7, 9, 11], 0 ],
         *  [ [0, 2, 4, 5, 7, 9, 10], 1 ],
         *  [ [0, 2, 4, 6, 7, 9, 11], 1 ],
         *  [ [1, 2, 4, 6, 7, 9, 11], 2 ],
         *  [ [1, 2, 4, 6, 8, 9, 11], 3 ],
         *  [ [1, 3, 4, 6, 8, 9, 11], 4 ],
         *  [ [1, 3, 4, 6, 8, 10, 11], 5 ]
         * ]
         */
        scale_degree_transpositions: (normalize = true) => {


            let transpositions = []
            let intervals = this.to.steps()
            intervals = intervals.slice(0, -1) //removing the last step because we don't need the octave completion
            for (let note of this.pitches) {
                let transposition = [note]
                for (let interval of intervals) {
                    let next_note = this.parent.mod(transposition.slice(-1)[0] + interval, this.edo)
                    transposition.push(next_note)
                }
                if (normalize) transposition.sort((a, b) => a - b)
                let CT = this.count.pitches() - this.parent.count.common_tones(this.pitches, transposition)
                transpositions.push([transposition, CT])
            }
            transpositions.sort((a, b) => a[1] - b[1])
            transpositions = this.parent.get.unique_elements(transpositions)
            return transpositions

        },

        /** Returns the scale as steps, broken to their repetitive segments.
         * @param  {Boolean} [minimize=false] - when true, the scale will be rotated to the mode that minimizes the number of segments
         * @returns {Array<Array<Number>>} An array containing the scale's steps in segments
         * @memberOf Scale#get
         * @example
         * let edo = new EDO(12) //define context
         * let scale = edo.scale([0,2,4,5,7,9,11]) //major scale
         * scale.get.segments()
         * //returns [[2,2],[1],[2,2,2],[1]]
         *
         * let scale2 = edo.scale([0,2,4,7,10])
         * scale2.get.segments(true) // returns [[3,3],[2,2,2]] (rather than [[2,2],[3,3],[2]] without minimizing)
         */
        segments: (minimize=false, cache = this.cache) => {
            if(this.cat_getset(["segments",(minimize)?"minimized":"unminimized"])) return this.cat_getset(["segments",(minimize)?"minimized":"unminimized"])
            let steps = this.to.steps()
            if (minimize) {
                let step_set = new Set(steps)
                if(step_set.size==1) {}
                else {
                    while (steps[0]==steps[steps.length-1]) steps = steps.concat(steps).slice(1, 1+steps.length)
                }

            }
            let all = []
            while(steps.length>0){
                let sub = steps.splice(0,1)
                while(steps[0]==sub[0]) sub.push(steps.splice(0,1)[0])
                all.push(sub)
            }

            if(cache) {
                let modes = this.get.modes()
                modes.forEach(mode=>{
                    let main_key = "scale_" + String(mode)
                    let keys = [main_key,"segments",(minimize)?"minimized":"unminimized"]
                    this.parent.cat_getset(keys,all)
                })
            }

            return all
        },

        /** <p>Transposes a melody within the scale by a given number of scale degrees</p>
         * @param {Array<Number>} seq - The original melody / sequence to be "transposed"
         * @param {Number} transposition - The number of scale degrees (up or down) by which to shift the melody.
         * @returns {Array<Number>} The transposed pitches
         * @memberOf Scale#get
         *
         * @example
         * let edo = new EDO(12) //define tuning
         * let scale = edo.scale([0,2,4,7,9]) //a major pentatonic scale
         * scale.get.sequence_transposition([0,2,4],1) //returns [ 2, 4, 7 ]*/
        sequence_transposition: (seq, transposition) => {
            let mod = this.parent.mod
            let new_seq = []
            for (let note of seq) {
                let scale_degree = this.pitches.indexOf(mod(note, this.edo))
                let octave_shift = Math.floor(note / this.edo)
                scale_degree = scale_degree + transposition
                octave_shift += Math.floor(scale_degree / this.pitches.length)
                scale_degree = mod(scale_degree, this.pitches.length)
                let pitch = this.pitches[scale_degree] + (this.edo * octave_shift)
                new_seq.push(pitch)
            }
            return new_seq
        },

        /** <p>Same as {@link EDO.get.shortest_path()} but for diatonic cases.</p>
         * <p>Instead of thinking in "intervals" it thinks in steps and scale degrees.
         so in the context of C major, moving from E to G is a move of size 3 (scale degrees),
         and from C to E is also 3 (scale degrees) even though in one case it's a minor third and in
         the other its a Major third.</p>

         <p>In this function the starting point is scale_degree 1</p>

         * @param {Number} destination_scale_degree
         * @param {Number} up_steps
         * @param {Number} down_steps
         * @memberOf Scale#get
         * */
        shortest_path: (destination_scale_degree, up_steps = 1, down_steps = -1) => {
            /*same as EDO.shortest_path only for diatonic cases
            Instead of thinking in "intervals" it thinks in steps and scale degrees.
            so in the context of C major, moving from E to G is a move of size 3 (scale degrees),
            and from C to E is also 3 (scale degrees) eventhough in once case it's a minor third and in
            the other its a Major third.

            In this function the starting point is scale_degree 1
            */
            let temp_edo = new EDO(this.count.pitches())
            let result = temp_edo.get.shortest_path(destination_scale_degree - 1, up_steps, down_steps)
            console.log(result)

        },

        /** <p>Returns a list of lists of size "levels" made out of scale degrees with "skip" steps skipped apart.</p>
         * @param  {Number} levels - The number of levels to the stack
         * @param  {Number} skip - The number of scale steps to skip between each level on the stack
         * @returns {Array<Array<Number>>} An array containing all of the stacks
         * @memberOf Scale#get
         * @example
         * [0,2,4,5,7,9,11] in 12-TET Scale.get.stacks(3,1)
         * @example
         * let edo = new EDO(12) //define context
         * let scale = edo.scale([0,2,4,5,7,9,11]) //major scale
         * scale.get.stacks(3,1) //get all tercial stacks of 3
         * //returns [[0, 3, 6], [0, 3, 7], [0, 4, 7]]
         *
         * scale.get.stacks(5,2) //get all quartal stacks of 5
         * //returns
         * [
         *  [ 0, 5, 11, 4, 9 ],
         *  [ 0, 5, 10, 3, 9 ],
         *  [ 0, 5, 10, 3, 8 ],
         *  [ 0, 6, 11, 4, 9 ],
         *  [ 0, 5, 10, 4, 9 ]
         * ]
         */
        stacks: (levels, skip) => {
            let scale = this.pitches

            let diapason = ((skip + 1) * (levels - 1)) + 1
            let modes = this.get.modes()
            let stacks = []
            modes.forEach((mode) => {
                let notes = []
                for (let i = 0; i < diapason; i += skip + 1) {
                    notes.push(mode[i % mode.length])
                }
                let temp = new Set(notes)
                if (temp.size == levels) stacks.push(notes)
            })
            stacks = this.parent.get.unique_elements(stacks)
            return stacks
        },


        /** <p>Returns the mean difference between each step in the set, and an equally-dividing step-size. (In a scale of cardinality-7, the difference between each step, and the minimal step-size in 7-EDO)</p>
         * @returns {Number} The mean difference
         * @memberOf Scale#get
         * @example
         * let edo = new EDO(12) //define context
         * let scale = edo.scale([0,2,4,5,7,9,11]) //major scale
         * scale.get.step_mean_error() //returns 0.4081632653061225
         *
         * let scale = edo.scale([0,2,4,6,8,10]) //whole-tones
         * scale.get.step_mean_error() //returns 0
         */
        step_mean_error: (cache = this.cache) => {
            if(this.cat_getset(['step_mean_error'])) return this.cat_getset(['step_mean_error'])
            let steps = this.to.steps()
            let cardinality = this.count.pitches()
            let mean_step = 12/cardinality
            let step_err = steps.map(s=>Math.abs(s-mean_step))
            let total_err = step_err.reduce((ag,e)=>ag+e,0)
            if(cache) this.cat_getset(['step_mean_error'],total_err)
            return total_err
        },



        /** <p>Returns a list of unique step sizes that appear in the scale.</p>
         * @returns {Array<Number>} The step sizes
         * @example
         * let edo = new EDO(12) //define tuning
         * let scale = edo.scale([0,2,4,5,7,9,11]) //major scale
         * scale.get.step_sizes()
         * //returns [1,2]
         * @memberOf Scale#get*/
        step_sizes: (cache = this.cache) => {
            if(this.cat_getset(['step_sizes'])) return this.cat_getset(['step_sizes'])
            let lst = this.parent.get.unique_elements(this.to.steps())
            lst.sort((a, b) => a - b)
            if (cache) this.cat_getset(['step_sizes'],lst)
            return lst


        },

        /**
         * @typedef {Object} quality_position_obj
         * @property {Array<Number>} quality - Some chord quality
         * @property {Array<Number>} positions - The positions where this quality is available
         */

        /**
         * @typedef {Object} steps_quality_obj
         * @property {Array<Number>} steps - The given steps
         * @property {Array<quality_position_obj>} combos - An array of qualities and their positions
         */

        /** <p>from a given array of steps taken, returns all of the available qualities and their positions</p>
         * @param {Array<Number>} steps - steps in the scale in the form of [1,1,2,1..] (1=one step, 2= two steps, etc)
         * @returns {quality_position_obj} The step sizes
         * @example
         * let edo = new EDO(12) //define tuning
         * let scale = edo.scale([0,2,4,5,7,9,11]) //major scale
         * scale.get.steps_to_qualities([1,1]) //two successive steps
         * //returns
         *  {
         *      "steps":[1,1],
         *      "combos":[
         *          {"quality":[0,2,4],"positions":[0,5,7]},
         *          {"quality":[0,2,3],"positions":[2,9]},
         *          {"quality":[0,1,3],"positions":[4,11]}
         *          ]
         *  }
         * @memberOf Scale#get*/
        steps_to_qualities: (steps) => {
            let modes = this.get.modes()
            steps = this.parent.convert.intervals_to_pitches(steps)
            let combos = modes.map((mode) => steps.map((scale_degree) => mode[scale_degree]))
            combos = combos.map((el) => this.parent.get.normal_order(el))
            combos = this.parent.get.unique_elements(combos)
            combos = combos.map((cmb) => {
                return {quality: cmb, positions: this.get.position_of_quality(cmb)}
            })
            return {steps: this.parent.convert.to_steps(steps), combos: combos}
        },

        /** Returns the sets that the scale is contained in from a given list of sets
         * @param  {Array<Array<Number>>} scales - a list of scales
         * @returns {Array<Array<Number>>} the scales that contain the Scale object
         * @memberOf Scale#get
         * @example
         * let edo = new EDO(12) //define context
         * let scale = edo.scale([0,3,7]) //minor triad
         * scale.get.supersets([[0,1,2,3,4,5,6,7],[0,3,4,7],[0,1,2]])
         * //returns [[0,1,2,3,4,5,6,7],[0,3,4,7]]*/
        supersets: (scales) => {
            let sets = []
            for (let scale of scales) {
                let modes = this.parent.get.modes(scale)
                for (let mode of modes) {
                    if (this.is.subset(mode)) sets.push(scale)
                }
            }
            sets = this.parent.get.unique_elements(sets)
            return sets
        },

        /** <p>Returns every tetrachord (normalized to 0) available in this scale</p>
         * <p>Note: for a collection of all pitch subsets of length n (rather than 4) use [Scale.get.n_chords()]{@link Scale#get.n_chords}</p>
         * @param  {Boolean} cache - When true, the result will be cached for faster retrieval
         * @returns {Array<Number>} An array containing all tetrachords
         * @memberOf Scale#get
         *
         * @example
         * let edo = new EDO(12) //define context
         * let scale = edo.scale([0,2,4,7,9]) //pentatonic scale
         * scale.get.tetrachords()
         * //returns [ [ 0, 2, 4, 7 ], [ 0, 3, 5, 7 ], [ 0, 2, 5, 7 ], [ 0, 3, 5, 8 ] ]
         *
         * @see Scale#get.trichords
         * @see Scale#get.n_chords
         */
        tetrachords: (cache = this.cache) => {
            /*
            Returns a list of every tetrachord (normalized to 0) available in this scale.

            :param cache:
            :return:
            */
            let tetrachords = this.get.n_chords(4, true,false, cache)
            return tetrachords
        },

        /** <p>Returns every possible interpretation of the scale's intervals in terms of their possible scale degree</p>
         * @param  {Object} [interval_map] - a map of every interval and the role it can play in the scale (for instance PC6 in 12EDO  can be both an augmented 4th and a diminished 5th. see code for clarity). This paramater must be passed in EDO systems other than 12.
         * @returns {Array<Array<Number>>} An array containing every interpretation of the scale degrees.
         * @memberOf Scale#get
         *
         * @example
         * let edo = new EDO(12) //define context
         * let scale = edo.scale([0,2,4,7,9]) //pentatonic scale
         * scale.get.scale_degree_roles()
         * //returns [ [ 1, 2, 3, 5, 6 ] ] (the last note can be interpreted as a major 6th, or a diminished 7th)
         *
         */
        scale_degree_roles: (interval_map) => {
            if(this.edo!=12 && !interval_map) return []
            if(!interval_map) {
                interval_map = {
                    0:[1],
                    1:[2],
                    2:[2],
                    3:[2,3],
                    4:[3],
                    5:[4],
                    6:[4],
                    7:[5],
                    8:[6],
                    9:[6],
                    10:[6,7],
                    11:[7]
                }

            }
            let interpretations = this.parent.get.partitioned_subsets(this.pitches.map(n=>interval_map[n]))
            return interpretations
        },

        /** <p>Returns the scale's pitches transposed by a certain amount</p>
         * @param {Number} amount - The amount by which to transpose the pitches
         * @returns {Array<Number>} The transposed pitches
         * @memberOf Scale#get
         *
         * @example
         * let edo = new EDO(12) //define tuning
         * let scale = edo.scale([0,2,4,7,9]) //a major pentatonic scale
         * scale.get.transposition(5) //returns [ 5, 7, 9, 0, 2 ]*/
        transposition: (amount) => {
            return this.parent.get.transposition(this.pitches, amount)
        },

        /** <p>Returns the transpositions of the scale that include the given pitches verbatim.</p>
         * @param {Array<Number>} pitches - The pitches to find
         * @returns {Array<Object>} - The property 'pitches' includes the pitches of the transposition. The property 'common_tones' tallies how many pitches the original scale and the transposed scale have in common..
         * @memberOf Scale#get
         *
         * @example
         * let edo = new EDO(12) //define tuning
         * let scale = edo.scale([0,2,4,5,5,9,11]) //a major scale
         * scale.get.transpositions_with_pitches(1,4,8)
         * [
         *  {pitches: [9,11,1,2,4,6,8], alterations: 4}, //The transposition starting on 9 contains 1,4,8 verbatim. It has 4 tones in common with the original scale.
         *  {pitches: [4,6,8,9,11,1,3], alterations: 3}, //The transposition starting on 4 ... It has 3 tones in common...
         *  {pitches: [11,1,3,4,6,8,10], alterations: 2} //The transposition starting on 11 ... It has 2 tones in common...
         * ]*/
        transpositions_with_pitches: (pitches) => {
            let scales = []
            for (let i = 0; i < this.edo; i++) {
                let new_scale = this.parent.get.starting_at(this.pitches, i)
                scales.push({
                    pitches: new_scale,
                    common_tones: this.count.pitches() - this.get.levenshtein([...new_scale].sort((a, b) => a - b))
                })
            }
            scales = scales.filter((scale) => {
                let temp = pitches.map((pitch) => scale.pitches.indexOf(pitch) != -1)
                temp = temp.reduce((a, el) => a * el, true)
                return temp
            })
            scales = scales.sort((a, b) => b.common_tones - a.common_tones)
            return scales
        },

        /** <p>Returns every trichord (normalized to 0) available in this scale</p>
         * <p>Note: for a collection of all pitch subsets of length n (rather than 3) use [Scale.get.n_chords()]{@link Scale#get.n_chords}</p>
         * @param  {Boolean} cache - When true, the result will be cached for faster retrieval
         * @returns {Array<Number>} An array containing all trichords
         * @memberOf Scale#get
         *
         * @example
         * let edo = new EDO(12) //define context
         * let scale = edo.scale([0,2,4,7,9]) //pentatonic scale
         * scale.get.trichords()
         * //returns
         * [
         *  [ 0, 2, 4 ],
         *  [ 0, 2, 7 ],
         *  [ 0, 3, 5 ],
         *  [ 0, 4, 7 ],
         *  [ 0, 3, 7 ],
         *  [ 0, 2, 5 ]
         * ]
         *
         * @see Scale#get.tetrachords
         * @see Scale#get.n_chords
         */
        trichords: (cache = this.cache) => {
            /*
            Returns a list of every trichord (normalized to 0) available in this scale.

            :param cache:
            :return:
            */
            let trichords = this.get.n_chords(3, true,false, cache)
            return trichords

        },

        /** <p>Returns a numeric value of how unevenlyy a set's steps are distributed.</p>
         *<p>The measure is done by splitting the set into n parts and checking by how much each part differs from an ideal even split of the set (the current edo / n).</p>
         *<p>For example, 2 whole-steps and 2 major-3rds can be represented as [2 2 4 4], [2 ,4, 2, 4]. While the first distribution is imbalanced (the small steps are bunched together, and the big steps are bunched together), the 2nd distribution represents an even split</p>
         *<p>The normalization occurs within the current EDO and cardinality. 1 for the most uneven set in the tuning context with the same number of notes; and 0 for the most even set within that context</p>
         * @returns {Number}
         * @see Clough, John, and Jack Douthett. "Maximally even sets." Journal of music theory 35.1/2 (1991): 93-173.
         * @see Scale#get.necklace_family()
         * @see Scale#get.necklace_family_members()
         * @memberOf Scale#get
         *
         * @example
         * let edo = new EDO(12) //Create a tuning context
         * edo.get.unevenness([0,2,4,5,7,9,11]) //returns 0
         * // It returns 0 because in the universe of scale with steps [1 1 2 2 2 2 2], the scale above has the least "unevenness"
         */
        unevenness: (normalize = false, cache = this.cache) => {
            if(this.cat_getset(['unevenness',(normalize)?'normalized':'unnormalized'])) return this.cat_getset(['unevenness',(normalize)?'normalized':'unnormalized'])


            let min_uneven = Infinity
            let max_uneven = 0

            if (normalize) {
                let minimally_even_set = Array.from(Array(this.count.pitches()).keys())
                max_uneven = this.parent.scale(minimally_even_set).get.unevenness(false)

                let maximally_even_family = this.parent.scale(this.parent.convert.intervals_to_scale(this.parent.get.evenly_split(this.count.pitches()))).get.necklace_family_members()
                maximally_even_family.forEach(m=>{
                    let u = this.parent.scale(m).get.unevenness()
                    if(u<min_uneven) min_uneven=u
                })

            }


            let cardinality = this.count.pitches()
            let temp_edo = new EDO(cardinality)
            let mode_unevenness = []

            for (let mode_num = 0; mode_num < cardinality; mode_num++) {
                let mode_errors = []
                for (let parts = 2; parts <= Math.ceil(cardinality / 2); parts++) {

                    let ideal_segment_size = this.edo / parts //Ideal perfect splitting to n segments
                    let split = temp_edo.get.evenly_split(parts) //Best split within the context of the EDO
                    let as_steps = this.mode(mode_num).to.steps() // The scale as steps
                    let segments = []
                    for (let i = 0; i < parts; i++) segments.push(as_steps.splice(0, split[i]))
                    let segment_sum = segments.map(segment => segment.reduce((ag, e) => ag + e, 0))
                    let segment_error = segment_sum.map(s => Math.abs(s - ideal_segment_size))
                    let sum_of_errors = segment_error.reduce((agg, e) => agg + e, 0)
                    let mean_of_sum_of_errors = sum_of_errors/parts
                    mode_errors.push(mean_of_sum_of_errors)
                }
                mode_unevenness.push(mode_errors.reduce((ag, e) => ag + e, 0))
            }

            let set_unevenness = mode_unevenness.reduce((ag, e) => ag + e, 0) / cardinality
            if(cache) this.cat_getset(['unevenness','unnormalized'],set_unevenness)
            if (normalize) {
                if (max_uneven == 0) return 0
                if (max_uneven == min_uneven) return 0
                set_unevenness = (set_unevenness - min_uneven) / (max_uneven - min_uneven)
                if(cache) this.cat_getset(['unevenness','normalized'],set_unevenness)
            }
            return set_unevenness
        },



        /** <p>Returns the scale without the pitches in <code>to_remove</code> array</p>
         * @param  {Array<Number>} to_remove - The pitches to be removed from the original scale
         * @param  {Boolean} [normal=false] - When true, the returned array will be in normal order.
         * @returns {Array<Number>} An array containing the original scale with pitches <code>to_remove</code> removed.
         * @memberOf Scale#get
         *
         * @example
         * let edo = new EDO(12) //define context
         * let scale = edo.scale([0,2,4,5,7,9,11])
         * scale.get.without([5,11]) //returns [0,2,4,7,9]
         */
        without: (to_remove, normal = false) => {
            return this.parent.get.without(this.pitches, to_remove, normal)
        },

    }

    /**A collection of functions that returns a Boolean about various features regarding the scale
     * @namespace*/
    is = {

        /**<p>Returns true if the scale a deep scale</p>
         * @returns {Boolean}
         * @memberOf Scale#is
         * @example
         * let edo = new EDO(12) //define context
         * let scale = edo.scale([0,2,4,5,7,9,11]) //major scale
         * scale.is.deep() //returns true
         * @see Clough, J., et al. (1999). "Scales, sets, and interval cycles: A taxonomy." Music Theory Spectrum 21(1): 74-104.
         * */
        deep: () => {
            let vector = this.get.interval_vector()
            let vector_set = new Set(this.get.interval_vector())
            return vector.length==vector_set.size
        },

        /**<p>Returns true if the scale is distributionally even</p>
         * @returns {Boolean}
         * @memberOf Scale#is
         *
         * @example
         * let edo = new EDO(12) //define context
         * let scale = edo.scale([0,2,4,5,7,9,11]) //major scale
         * scale.is.distributionally_even() //returns true
         * @see Clough, J., et al. (1999). "Scales, sets, and interval cycles: A taxonomy." Music Theory Spectrum 21(1): 74-104.
         * */
        distributionally_even: () => {
            let map = {}
            for (let i = 1; i < this.count.pitches(); i++) {
                let gen = this.get.generic_intervals(i)
                gen.forEach(interval=>(map[interval.generic])?map[interval.generic].push(interval.specific):map[interval.generic]=[interval.specific])
            }
            for (let i = 1; i < this.count.pitches(); i++) {
                if(map[String(i)].length>2) return false
            }
            return true
        },

        /**<p>Returns a list of (lower-order) EDOs if the scale can be represented in them.</p>
         <p>For instance 12-EDO <code>[0,3,6,9]</code> also exists in in 4-EDO as <code>[0,1,2,3]</code>. Therefore the function will return <code>[4]</code></p>
         * @param {Boolean} cache - When true, the result will be cached for faster retrieval in subsequent calls.
         * @returns {Boolean}
         * @memberOf Scale#is
         *
         * @example
         * let edo = new EDO(12) //define context
         * let scale = edo.scale([0,3,6,9]) //fully diminished chord
         * scale.is.in_lower_edos() //returns [4]*/
        in_lower_edos: (cache = this.cache) => {
            if(this.cat_getset(['lower_EDOs'])) return this.cat_getset(['lower_EDOs'])
            let scale = this.pitches
            let edos = []
            for (let divisor of this.parent.edo_divisors) {
                let valid = true
                for (let note of scale) {
                    if (note % divisor != 0) {
                        valid = false
                        break
                    }
                }
                if (valid) edos.push(parseInt(this.edo / divisor))
            }
            if (cache) this.cat_getset(['lower_EDOs'],edos)
            return edos

        },

        /**<p>Returns true if the scale is invertible and false if it isn't</p>
         * @param {Boolean} [cache] - when true, the result will be cached for future retrieval
         * @returns {Boolean}
         * @memberOf Scale#is
         *
         * @example
         * let edo = new EDO(12) //define context
         * let scale = edo.scale([0,2,4,5,7,9,11]) //major
         * scale.is.invertible() //returns false*/
        invertible: (cache = this.cache) => {
            if(this.cat_getset(['invertible'])) return this.cat_getset(['invertible'])
            let scale = this.get.normal_order()
            let i_scale = this.parent.scale(this.get.inversion()).get.normal_order()
            let result = true
            if (this.parent.is.same(scale, i_scale)) result = false
            if (cache) this.cat_getset(['invertible'],result)
            return result
        },

        /**<p>Returns true if the scale is maximally even</p>
         * @returns {Boolean}
         * @memberOf Scale#is
         *
         * @example
         * let edo = new EDO(12) //define context
         * let scale = edo.scale([0,2,4,5,7,9,11]) //major scale
         * scale.is.maximally_even() //returns true
         * @see Clough, J., et al. (1999). "Scales, sets, and interval cycles: A taxonomy." Music Theory Spectrum 21(1): 74-104.
         * */
        maximally_even: () => {
            let map = {}
            for (let i = 1; i < this.count.pitches(); i++) {
                let gen = this.get.generic_intervals(i)
                gen.forEach(interval=>(map[interval.generic])?map[interval.generic].push(interval.specific):map[interval.generic]=[interval.specific])
            }
            for (let i = 1; i < this.count.pitches(); i++) {
                if(map[String(i)].length>2) return false
                if(map[String(i)].length==2) {
                    if(Math.abs(map[String(i)][0]-map[String(i)][1]) != 1) return false
                }
            }
            return true
        },

        /**<p>Returns true if the scale has the Myhill property</p>
         * @returns {Boolean}
         * @memberOf Scale#is
         *
         * @example
         * let edo = new EDO(12) //define context
         * let scale = edo.scale([0,2,4,5,7,9,11]) //major scale
         * scale.is.myhill_property() //returns true
         * @see Scale#get.myhill_property
         * @see Clough, J., et al. (1999). "Scales, sets, and interval cycles: A taxonomy." Music Theory Spectrum 21(1): 74-104.
         * */
        myhill_property: () => {
            return this.get.myhill_property()
        },

        /**<p>Checks if the scale is a mode / rotation of another scale</p>
         *
         * <p>To check again multiple scale see [Scale.is.one_of]{@link Scale#is.one_of}</p>
         * @param {Array<Number>} scales - a collection of scales (or necklaces)
         * @returns {Boolean}
         * @memberOf Scale#is
         * @see Scale#is.one_of
         *
         * @example
         * let edo = new EDO(12) //define context
         * let scale = edo.scale([0,2,4,5,7,9,11]) //major
         * scale.is.mode_of([0,2,3,5,7,9,10]) //returns true
         * */
        mode_of: (scale) => {
            let modes = this.parent.get.modes(scale)
            return (this.parent.is.element_of(this.pitches, modes))
        },

        /**<p>Checks if the scale is a mode of limited transpositions</p>
         * @returns {Boolean}
         * @memberOf Scale#is
         * @see Scale#is.MOLT
         *
         * @example
         * let edo = new EDO(12) //define context
         * let scale = edo.scale([0,2,4,6,8,10]) //whole-tones
         * scale.is.MOLT() //returns true
         * */
        MOLT: () => {
            return this.count.transpositions()<this.edo
        },

        /**
         * <p>Returns True if the scale is in normal order and False if it isn't</p>
         * @returns {Boolean}
         * @memberOf Scale#is
         * @example
         * let edo = new EDO(12) //define context
         * let scale = edo.scale([0,2,4,5,7,9,11]) //major
         * scale.is.normal_order() //returns false
         * */
        normal_order: () => {
            return this.parent.is.same(this.pitches, this.get.normal_order())
        },

        /**<p>Checks if the scale (as a whole!) is one of the scales given in a list of scales (or in one of their modes)</p>
         * @param {Array<Array<Number>>} scales - a collection of scales (more accurately, necklaces)
         * @returns {Boolean}
         * @memberOf Scale#is
         *
         * @example
         * let edo = new EDO(12) //define context
         * let scale = edo.scale([0,2,4,5,7,9,11]) //major
         * scale.is.one_of([[0,2,3,5,7,9,10],[0,1,2,3,4,5,6,7,8,9]]) //returns true*/
        one_of: (scales) => {
            /**/
            let scale = this.pitches
            let all_modes = scales.map((item) => this.parent.get.modes(item))
            all_modes = all_modes.flat(1)
            if (this.parent.is.element_of(scale, all_modes)) return true
            return false
        },

        /**
         * <p>Returns True if the scale is in prime form and False if it isn't.</p>
         * (Notice, the prime form calculation conforms to Rahn's prime form rather than Forte's)
         * @returns {Boolean}
         * @memberOf Scale#is
         *
         * @example
         * let edo = new EDO(12) //define context
         * let scale = edo.scale([0,2,4,5,7,9,11]) //major
         * scale.is.prime_form() //returns false
         * */
        prime_form: () => {
            return this.parent.is.same(this.pitches, this.get.prime_form())
        },

        /**<p>Returns true if the scale is a subset of one of multiple scales provided.</p>
         * @param {Array<Number>|Array<Array<Number>>} scales - another scale, or a collection of scales
         * @param {Boolean} [include_modes=true] - When true, the function will return true also when the scale is a subset of one of the modes of the scales in question. When false, the scale must appear verbatim to return true
         * @returns {Boolean}
         * @memberOf Scale#is
         *
         * @example
         * let edo = new EDO(12) //define context
         * let scale = edo.scale([0,2,4,5,7,9,11]) //major
         * scale.is.subset([[0,2,4,5],[7,9,11]]) //returns false*/
        subset: (scales) => {

            const is_subset_of_one = function (scale1, scale2) {
                for (let note of scale1) {
                    if (scale2.indexOf(note) == -1) return false
                }
                return true
            }
            if (!Array.isArray(scales[0])) scales = [scales]
            scales = scales.map((scale) => {
                return this.parent.scale(scale).get.modes()
            }).flat()
            for (let scale of scales) {
                if (is_subset_of_one(this.pitches, scale)) return true
            }
            return false
        },
    }

    /**A collection of functions that convert data from one representation to another
     * @namespace*/
    to = {

        /**
         * Returns the scale's representation in cents [0,100,300, etc.]
         * @returns {Array<Number>}
         * @memberOf Scale#to
         * @example
         * let edo = new EDO(12) //define context
         * let scale = edo.scale([0,2,4,5,7,9,11]) //new Scale object
         * scale.to.cents() //returns [0,200,400,500,700,900,1100]
         * */
        cents: () => {
            return this.pitches.map((note) => note * this.parent.cents_per_step)
        },

        /**
         * Returns the current scale in the specified edo (if it exists in it). If this scale cannot be expressed in the desired tuning, the fundtion will return undefined.
         * @param {Number} [new_edo] - The number of equal divisions of the target tuning system
         * @returns {Scale}
         * @memberOf Scale#to
         * @example
         * let edo = new EDO(12) //define context
         * let scale = edo.scale([0,2,4,5,7,9,11]) //new Scale object
         * scale.to.EDO(24) //returns a Scale Object corresponding to [0, 4, 8, 10, 14, 18, 22] in 24EDO
         * */
        EDO: (new_edo, force=false) => {
            let current_edo = this.get.edo()
            let quotient = current_edo/new_edo
            let new_pitches = this.get.pitches().map(pitch=>pitch/quotient)
            let new_system = new EDO(new_edo)
            if(force) {
                return new_system.scale(new_pitches)
            }
            let valid = new_pitches.reduce((agg,pitch)=>(pitch==Math.floor(pitch)) && agg,true)

            if(valid) {
                return new_system.scale(new_pitches)
            }
        },


        /**
         * Instead of pitch-classes, this returns the scale represented by intervals (steps between notes)
         * <p>Remark: "steps" and "pitch classes" conform to the current tuning system used. E.g., 0-11 occupy 1 octave in 12EDO, 0-16 in 17EDO, etc.</p>
         * @param {Boolean} [cache] - when true, the result is cached for future retrieval
         * @returns {Array<Number>}
         * @memberOf Scale#to
         * @example
         * let edo = new EDO(12) //define context
         * let scale = edo.scale([0,2,4,5,7,9,11]) //new Scale object
         * scale.to.steps() //returns [2,2,1,2,2,2,1]
         * */
        steps: (cache = this.cache) => {
            if(this.cat_getset(['steps'])) return this.cat_getset(['steps'])
            let intervals = this.parent.convert.to_steps([...this.pitches,this.edo], cache = cache)
            // let intervals = [1,1,1,3,4,5]
            if (cache) this.cat_getset(['steps'],intervals)
            return intervals
        }
    }

    /**<p>A collection of functions that make visual representations</p>
     * <p>Note: Scale.show can only be used client-side</p>
     * @namespace Scale#show
     * */
    show = {
        /**
         * <p>Makes a fractal tree corresponding to the scale with branches diverging by given step sizes.</p>
         * <img src='img/fractal_tree.png'>
         * @param  {String} container_id - The ID of a DOM element in which the tree will be shown.
         * @param  {Number} [length=200] - The length (or height) or the tree's "trunk".
         * @param  {Number} [angle_span=90] - the angle between branches.
         * @param  {Array<Number>} [intervals=[-1,1]] - Each interval represents the number of scale degrees away from the current node.
         * @param  {Number} [iterations=5] - The number of sub-branches on the tree
         * @param  {Number} [length_mul=0.7] - The factor by which every new sub-branch's length is to its parent.

         * @example
         * <script src="edo.js"></script>
         * <script src="raphael.min.js"></script>
         * <div id="container" style="width:900px;height:600px; margin:0 auto;"></div>
         * <script>
         *  let edo = new EDO()
         *  edo.show.interval_fractal_tree(container_id)
         * </script>


         * @see /demos/fractal_tree.html
         * @memberOf Scale#show*/
        interval_fractal_tree: (container_id, length = 200, angle_span = 90, intervals = [-1, 1], iterations = 5, length_mul = 0.7) => {
            this.parent.show.interval_fractal_tree(container_id, length, angle_span, this.pitches, intervals, iterations, length_mul)
        },

        /**
         * <p>Graphs the scale's necklace.</p>
         ** <img src='img/Necklace.png'>
         * @param  {String} container_id - The ID of a DOM element in which the contour will be shown.
         * @param  {Boolean} [replace=false] - When false, any time the function is called a new contour will be appended to the object. When true, it will replace the contents of the container.
         * @param  {Number|Array<Number,Number>} [radius] - Radius (in px) of the ring. When no values are passed, the ring will take the size of the container.
         *
         * @example
         * <script src="edo.js"></script>
         * <script src="raphael.min.js"></script>
         * <div id="container" style="width:900px;height:600px; margin:0 auto;"></div>
         * <script>
         *  let edo = new EDO()
         *  let scale = edo.scale([0,2,4,5,7,9,11])
         *  scale.show.necklace('container')
         * </script>
         * @see /demos/necklace.html
         * @memberOf Scale#show*/
        necklace: (container_id, replace = true, radius = 600) => {
            return this.parent.show.necklace(container_id, this.pitches, replace, radius)
        }
    }


    /**
     * Returns a Scale object with pitches corresponding to the nth mode of the original scale
     * @param {Number} n - Mode number to be returned (starting at 0)
     * @returns {Scale}
     * */
    mode(n = 0) {
        let modes = this.get.modes()
        let mode = modes[this.parent.mod(n, modes.length)]
        return new Scale(mode, this.parent, this.cache)
    }

    /**
     * Returns a Scale object with pitches corresponding to the inversion of the original scale.
     * @returns {Scale}
     * */
    invert() {
        let pitches = this.get.inversion()
        return new Scale(pitches, this.parent, this.cache)
    }

    /**
     * Returns a Scale object with pitches corresponding to the normal order of the original scale.
     * @returns {Scale}
     * */
    normal() {
        let pitches = this.get.normal_order()
        return new Scale(pitches, this.parent, this.cache)
    }

    /**
     * Returns a Scale object with pitches corresponding to the prime form of the original scale.
     * @returns {Scale}
     * */
    prime() {
        let pitches = this.get.prime_form()
        return new Scale(pitches, this.parent, this.cache)
    }

    /**
     * Returns a Scale object with pitches corresponding to the complement of the original scale in the current EDO.
     * @returns {Scale}
     * */
    complement() {
        let pitches = this.get.complement(true)
        return new Scale(pitches, this.parent, this.cache)
    }



    // Get / Set cache catalog
    cat_getset(keys,value) {
        if(!Array.isArray(keys)) keys = [keys]
        let main_key = "scale_" + String(this.pitches)
        keys = [main_key,...keys]
        function getValue(obj, key,  ...rest) {
            if (obj === undefined) return undefined
            if (rest.length == 0 && obj.hasOwnProperty(key)) {
                if(Array.isArray(obj[key])) return JSON.parse(JSON.stringify(obj[key]))
                if(typeof obj[key] === 'object' ) return JSON.parse(JSON.stringify(obj[key]))
                return obj[key]
            }
            return getValue(obj[key], ...rest)
        }
        function setValue(obj,value, key,  ...rest) {
            if(Array.isArray(value)) value = Array.from(value)
            if (rest.length == 0) {
                obj[key] = value
                return undefined
            }
            if(obj[key]===undefined) obj[key] = {}
            return setValue(obj[key],value, ...rest)
        }
        if(value===undefined) return getValue(this.parent.catalog,...keys)
        else {
            if(Array.isArray(value)) value=Array.from(value)
            else if(typeof value === 'object' ) return JSON.parse(JSON.stringify(value))
            return setValue(this.parent.catalog, value, ...keys)
        }
    }

}

/** <p>Class for rhythm / tempo manipulation</p>
 * <p>(This is not really part of a "tuning system" per se, but a need to interact with rhythm seems fitting for such a library).</p> */
class Time {
    constructor() {

    }

    /**A collection of functions manipulates an input
     * @namespace Time#get*/
    get = {
        /** Get all unique subdivisions of a given <code>num_of_beats</code>, without their rotations.
         *
         * @param  {Number} num_of_beats - The amount of beats to subdivide
         * @param  {Number} minimal_subdivision - The smallest allowed subdivision (the returned result will not include subdivisions smaller than this value)
         * @param  {Number} maximal_subdivision - The largest allowed subdivision (the returned result will not include subdivisions larger than this value)
         * @returns {Array<Array<Number>>} All possible subdivisions.
         * @memberOf Time#get
         * @example
         * let time = new Time()
         * time.get.subdivisions(12,2,3)
         * //returns
         * [
         *  [ 2, 2, 2, 2, 2, 2 ],
         *  [ 2, 2, 2, 3, 3 ],
         *  [ 2, 2, 3, 2, 3 ],
         *  [ 3, 3, 3, 3 ]
         * ]*/
        subdivisions: (num_of_beats,minimal_subdivision = 1, maximal_subdivision = num_of_beats) => {
            let edo = new EDO(num_of_beats)
            let scales = edo.get.scales(minimal_subdivision,maximal_subdivision).map(scale=>scale.to.steps())
            return scales
        },

        /** returns the ratios to a <code>max_ratio</code> from a given <code>base_ratio</code>.
         *
         * @param  {Number} base_ratio - The number to be used as a baseline (=:1)
         * @param  {Number} max_ratio - The maximal ratio to be returned
         * @returns {Object} A list of ratios given the <code>base_ratio</code>
         * @memberOf Time#get
         * @example
         * let time = new Time()
         * time.get.ratios(110,3)
         * //returns { '1': 110, '2': 220, '3': 330, '1/2': 55, '1/3': 36.666666666666664 } */
        ratios: (base_ratio=1,max_ratio=10) =>{
            let beats = {}
            for (let i = 1; i <=max_ratio ; i++) {

                beats[i]=base_ratio*i
                if(i==1) continue
                beats["1/"+String(i)] = base_ratio/i
            }
            return beats
        },

        /** Multiplies each element in the <code>base</code>with the entire <code>base</code>, <code>iteration</code> times.
         *
         * @param  {Number} base - some rhythmic cell
         * @param  {Number} iteration - The amount of times to apply the algorithms to the cell
         * @returns {Array<Number>} The fractal
         * @memberOf Time#get
         * @example
         * let time = new Time()
         * time.get.fractal([2,4,3],1)
         * //returns [2, 4, 3]
         *
         * time.get.fractal([2,4,3],2)
         * //returns [4, 8,  6, 8, 16, 12, 6, 12, 9]
         *
         * time.get.fractal([2,4,3],3)
         * //returns
         * [8, 16, 12, 16, 32, 24, 12, 24,
         *  18, 16, 32, 24, 32, 64, 48, 24,
         *  48, 36, 12, 24, 18, 24, 48, 36,
         *  18, 36, 27]*/
        fractal: (base=[2,2,3],iteration=1) =>{
            const do_it = function (arr,it) {
                if(it<=1) return arr
                else {
                    it--
                    arr = arr.map(el=>{
                        return base.map(b=>{
                            return b*el
                        })
                    }).flat()
                    return do_it([...arr],it)
                }

            }
            return do_it([...base],iteration)


        },

        /** Returns an array of arrays representing different sized beats coalescing with the pattern.
         *
         * @param  {Array<Number>} array - A beat pattern
         * @returns {Array<Number>} An ordered array showing as tuples [beat_size,number_of_alignments]
         * @memberOf Time#get
         * @example
         * let time = new Time()
         * time.get.beat([2,4,4,4,4,4,4,4])
         * //returns
         * [
         *  [ 2, 8 ], //a beat of size 2 aligns with the pattern 8 times (every element in the pattern falls on a beat)
         *  [ 4, 7 ], //a beat of size 4 aligns with the pattern 7 times (in this case, all the elements align if the first element is seen as a pickup)
         *  [ 3, 3 ] //a beat of size 3 aligns with the pattern 3 times
         * ]
         *
         * */
        beat: (array) =>{
            let beats = []
            let min = Math.min(...array)
            let max = Math.max(...array)
            let edo = new EDO()
            for (let i = min; i <= max; i++) {
                let max_oc = 0
                let intervals = edo.convert.intervals_to_pitches(array).slice(1)
                for (let j = 0; j < array.length; j++) {
                    let len = intervals.filter(el=>Math.round(el/i)==el/i).length
                    if(len>max_oc) max_oc=len
                    intervals = edo.convert.intervals_to_pitches(array.slice(j)).slice(1)
                }
                if(max_oc!=0) beats.push([i,max_oc])

            }
            beats = beats.sort((a,b)=>b[1]-a[1])
            return beats

        },

        /** Returns the rhythmic motives as they appear verbatim, from most common to least common.
         * @memberOf Time#get
         * @param {Array<Number>} pattern - The pattern to be repeated
         * @param {Number} times - The number of times to repeat
         * @returns The pattern repeating
         * @example
         * let time = new Time()
         * time.get.repeated([2,1,1],3) // returns  [2,1,1,2,1,1,2,1,1]
         */
        repeated: (pattern,times=2)=>Array.from(new Array(times), () => pattern).flat(),

        /** Returns the rhythmic motives as they appear verbatim, from most common to least common.
         *
         * @param  {Array<Number>} array - A beat pattern
         * @param  {Number} [maximal_length=8] - The maximal motive length to be searched
         * @param  {Boolean} [show_singulars=false] - Whether to show "motives" that appear only once.
         * @returns {Array<Object>} motive:[an array with the motive], incidence: the number of times that motive appears in the input
         * @memberOf Time#get
         * @example
         * let time = new Time()
         * time.get.motives([2,2,4,2,2,4,3,3,6,3])
         * //returns
         * [
         *    { motive: [ 2, 2, 4 ], incidence: 2 }
         *    { motive: [ 2, 2 ], incidence: 2 },
         *    { motive: [ 2, 4 ], incidence: 2 }
         * ]
         * @see Time#get.relational_motives
         * */
        motives: (array,maximal_length=8,show_singulars=false) => {
            let edo = new EDO()
            return edo.get.motives(array,false,false,maximal_length)
                .filter(el=>(el.incidence>1 || show_singulars) && el.motive.length>1)
        },

        /** Returns the rhythmic motives in terms of relationships (rather than verbatim durations like in [Time.get.motives]{@link Time#get.motives} ), from most common to least common.
         *
         * @param  {Array<Number>} array - A beat pattern
         * @param  {Number} [maximal_length=8] - The maximal motive length to be searched
         * @param  {Boolean} [show_singulars=false] - Whether to show "motives" that appear only once.
         * @returns {Array<Object>} motive:[an array with the motive], incidence: the number of times that motive appears in the input
         * @memberOf Time#get
         * @example
         * let time = new Time()
         * time.get.relational_motives([2,2,4,2,2,4,3,3,6,3])
         * //returns
         * [
         *  { motive: [ 1, 2 ], incidence: 3, position: [ 0, 3, 6 ] }, //motive of duration=[same,double] appears 3 times, at positions 0, 3, and 6 of the original input
         *  { motive: [ 1, 2, 0.5 ], incidence: 2, position: [ 0, 6 ] }, //motive of duration=[same,double,half] appears 2 times, at positions 0, and 6 of the original input
         *  { motive: [ 2, 0.5 ], incidence: 2, position: [ 1, 7 ] } //motive of duration=[double,half] appears 2 times, at positions 1, and 7 of the original input
         * ]
         * @see Time#get.motives
         *
         * */
        relational_motives: (array,maximal_length=8,show_singular = false)=> {
            let ratios = this.convert.beats_to_ratios(array)
            let motives = this.get.motives(ratios,maximal_length,show_singular)
            let edo = new EDO()
            motives = motives.map(motive=>{
                let position = edo.get.subset_indices(motive.motive,ratios,false).map(i=>i[0])
                motive.position = position
                return motive
            })
            return motives
        },

        /** Returns the position of every subdivision of a given beat(s).
         *
         * @param  {Array<Number>} arrays - Any number of beat patterns separated by commas.
         * @returns {Array<String>} The flushing out of each pattern into its subdivisional representation.
         * @memberOf Time#get
         * @example
         * let time = new Time()
         * let sub = time.get.subdivisions(12) //get all subdivisions of 12 beats
         * let rhythms = time.get.explicit(...sub)
         * rhythms.forEach(r=>console.log(r))
         * //returns
         *  "2  .  2  .  2  .  2  .  2  .  2  . "
         *  "2  .  2  .  2  .  3  .  .  3  .  . "
         *  "2  .  2  .  3  .  .  2  .  3  .  . "
         *  "3  .  .  3  .  .  3  .  .  3  .  . "
         *
         * */
        explicit: (...arrays) =>{
            arrays = arrays.map(arr=>{
                arr = arr.map(el=>{
                    el = [String(el),...Array.from(Array(el-1).fill("."))]
                    el = el.map(e=>(e.length==1)?e+" ":e)
                    return el
                })
                return arr.flat().join(" ")
            })
            return arrays
        },


        /** Returns a binary representation of ONE complete cycle of all given beat patterns
         *
         * @param  {...Array<Number>|Number} patterns - beat patterns as arrays or integers seperated by commas.
         * @returns {Array<Array<Number>>} Returns a binary representation of ONE complete cycle of all given beat patterns
         * @memberOf Time#get
         * @example
         * let time = new Time()
         * time.get.counterpoint_cycle([1,1,2],3)
         * //returns
         * [1,1,1,0,1,1,1,0,1,1,1,0]
         * [1,0,0,1,0,0,1,0,0,1,0,0]
         *
         * time.get.counterpoint_cycle([1,2,1,3,1],[3,1])
         * //returns
         * [1,1,0,1,1,0,0,1]
         * [1,0,0,1,1,0,0,1]
         * */
        counterpoint_cycle: (...patterns) => {
            patterns = patterns.map(p=>(Array.isArray(p))?p:[p]).map(p=>this.convert.binary(p))
            let lengths = patterns.map(p=>p.length)

            let product = lengths.reduce((a,e)=>a*e,1)

            // let gcd = GCD(...lengths)
            let divisible = false
            product=Math.max(...lengths)
            while(!divisible) {
                divisible = Boolean(lengths.map(l=>Number(Number.isInteger(product/l))).reduce((ar,el)=>ar*el,1))
                if(divisible) break
                product++
            }
            patterns = patterns.map(p=>this.get.repeated(p,product/p.length))
            return patterns

        },
    }

    /**A collection of functions that resizes the elements of an array or the array itself
     * @namespace Time#resize*/
    resize = {
        /** Returns a given array with its elements "resized" by a given multiplier.
         *
         * @param  {Array<Number>} input - The original array.
         * @param  {Number} [by=1] - The number by which to resize the elements
         * @param  {false|"up"|"down"|"closest"} [round=false] - When not false, this determines how the elements are to be rounded when not integers
         * @param  {Boolean} [remove_0s=false] - When true, 0s will be completely erased from the array.
         * @returns {Array<Number>} The resized input
         * @memberOf Time#resize
         * @example
         * let time = new Time()
         * time.resize.by_product([2,4,1,3],0.45) // returns [ 0.9, 1.8, 0.45, 1.35 ]
         * time.resize.by_product([2,4,1,3],0.45,"up") // returns [ 1, 2, 1, 2 ]
         * time.resize.by_product([2,4,1,3],0.45,"closest",false) // returns [ 1, 2, 0, 1 ]
         * time.resize.by_product([2,4,1,3],0.45,"closest",true) // returns [ 1, 2, 1 ]
         * */
        by_product: (input,by=1,round=false,remove_0s=false) =>{
            input = input.map(el=>el*by).map(el=>{
                switch(round) {
                    case "closest": return Math.round(el)
                    case "down":return Math.floor(el)
                    case "up":return Math.ceil(el)
                    case false: return el
                }
            })
            if(remove_0s) input = input.filter(el=>el!=0)

            return input
        },

        /** Returns a given array with its elements "resized" by an added sum.
         *
         * @param  {Array<Number>} input - The original array.
         * @param  {Number} [by=1] - The number by which to resize the elements
         * @param  {Boolean} [remove_0s=false] - When true, 0s will be completely erased from the array.
         * @returns {Array<Number>} The resized input
         * @memberOf Time#resize
         * @example
         * let time = new Time()
         * time.resize.by_sum([2,4,1,3],-1,false) //[ 1, 3, 0, 2 ]
         * time.resize.by_sum([2,4,1,3],-1,true) //[ 1, 3, 2 ]
         * */
        by_sum: (input,by,remove_0s)=>(remove_0s)?input.map(d=>d+by).filter(el=>el!=0): input.map(d=>d+by),

    }

    /**A collection of functions that convert an input into other equivalent representations
     * @namespace Time#convert*/
    convert = {
        binary: (pattern) =>{
            return pattern.map(e=>{
                if(e==0) return [0]
                e = Array.from([...new Array(e).fill(0)])
                e[0]=1
                return e
            }).flat()

        },

        /** Returns the new tempo, if the number of <code>beats_in_old_tempo</code> occupies the same time as the number of <code>beats_in_new_tempo</code>, and the old tempo being <code>old_tempo</code>.
         *
         * @param  {Number} beats_in_old_tempo - The number of beats in the old tempo
         * @param  {Number} beats_in_new_tempo - The equivalent number of beats in the new tempo
         * @param  {Number} old_tempo - The old tempo
         * @returns {Number} The new tempo
         * @memberOf Time#convert
         * @example
         * let time = new Time()
         * time.convert.beats_to_tempo(4,6,60) // returns 90 */
        beats_to_tempo: (beats_in_old_tempo=4,beats_in_new_tempo=6,old_tempo=60) =>(beats_in_new_tempo/beats_in_old_tempo)*old_tempo,

        /** Returns the new tempo, if the number of <code>beats_in_old_tempo</code> occupies the same time as the number of <code>beats_in_new_tempo</code>, and the old tempo being <code>old_tempo</code>.
         *
         * @param  {Array<Number>} array - An array of beats
         * @param  {Boolean} [relate_only_to_first=false] - When true, all ratios will be calculated based on the first value. Otherwised, they'll be calculated based on their relationship with the previous beat.
         * @returns {Array<Number>} An array with the ratios
         * @memberOf Time#convert
         * @example
         * let time = new Time()
         * time.convert.beats_to_ratios([2,3,2,1]) // [ 1.5, 0.6666666666666666, 0.5 ] */
        beats_to_ratios: (array,relate_only_to_first=false)=>array.map((el,i,arr)=>(i>0)?arr[i]/arr[(relate_only_to_first)?0:i-1]:1).slice(1),




        /** Returns an array of beats as expressed in their duration in milliseconds
         *
         * @param  {Array<Number>} beats - An array of beats
         * @param  {Number} [bpm=60] - The tempo
         * @param  {Number} [units_per_beat=1] - The number of units each beat subdivides to.
         * @returns {Array<Number>} An array with the pattern in milliseconds
         * @memberOf Time#convert
         * @example
         * let time = new Time()
         * time.convert.beats_to_msec([2,3,2,1],120,2) // [ 500, 750, 500, 250 ] */
        beats_to_msec: (beats,bpm=60,units_per_beat=1) =>beats.map(b=>((60/bpm*1000)*b)/units_per_beat)

    }
}




export { EDO, Scale, Time};



