# edoJS

A JavaScript library for pitch set manipulation in any EDO tuning system.

## Usage

#### Import Library
Client-Side
```xhtml
<script src="edo.js"></script>
```

Server-Side
```Javascript
const EDO = require("./edo").EDO
```

#### Basic Usage
```javascript
let edo = new EDO(12) //create a new EDO context with 12 divisions.
 
//once the object has been created, you can access its functions.

//invert pitches 
edo.get.inversion([0,2,4,5,7,9,11]) //returns [0, 2,  4, 6, 7, 9, 11] 
 
edo.convert.ratio_to_interval(3/2) //returns [7]
 
edo.count.pitches([0, 3, 3, 2, 4, 3, 4]) //returns [[3,3],[4,2], [2,1], [0,1]] 
// (3 appears 3 times, 4 appears 2 times, etc.)
 
edo.is.subset([2,4],[1,2,3,4,5]) //returns true (the set [2,4] IS a subset of [1,2,3,4,5])
```

## Author
[Michael Seltenreich](http://www.michaelselterneich.com) 

## License
[GNU AGPLv3](https://choosealicense.com/licenses/agpl-3.0/)

## Some demos
[DEMOS](https://michaelsel.github.io/edoJS/demos/index.html)

## Full Documentation
[Documentation](https://michaelsel.github.io/edoJS/)
A good place to start: 
[EDO Class](https://michaelsel.github.io/edoJS/EDO.html)

