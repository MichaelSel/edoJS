# edoJS

A Set-Theory based JavaScript library pitch manipulation and analysis in any tuning system that is based on equal divisions of the octave (i.e., EDO, and also known as "TET").

As such, it allows to describe collections of pitches in psycho-acoustical terms (e.g., roughness or dissonance), it implements experimental algorithms proposed in the music theory literature, and allows for standard and novel set-theory manipulations.  

This library is aimed at music theorists, musicologists, and cognitive scientists working on musical research, for the creation of stimuli for experiments, and for the analysis of musical structures.

## Installation and Usage

To install npm (its dependencies)
```
npm i edo.js
```





Similarly, you can do any type of import.

#### Import Library
Client-Side
CDN source example - https://www.jsdelivr.com/package/npm/edo.js?version=1.2.14&path=dist
```xhtml
<script src="https://cdn.jsdelivr.net/npm/edo.js@1.2.14/dist/edo.js"></script>```
```
Server-Side
```Javascript
// NOTE: here no relative path so node will use the edojs installed from NPM
const EDO = require("edo.js").EDO;
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

## Development

To install development dependencies:
```
npm install --include=dev
```

To build the project

```
npm run build
```

To regenerate the docs

```
npm run docs
```

To test: 

```
npm run test
```

## Author
[Michael Seltenreich](http://www.michaelseltenreich.com) 

## License
[GNU AGPLv3](https://choosealicense.com/licenses/agpl-3.0/)

## Some demos
[DEMOS](https://michaelsel.github.io/edoJS/demos/index.html)

## Full Documentation
[Documentation](https://michaelsel.github.io/edoJS/)
A good place to start: 
[EDO Class](https://michaelsel.github.io/edoJS/EDO.html)

