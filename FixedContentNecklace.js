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
module.exports = FixedContentNecklace
