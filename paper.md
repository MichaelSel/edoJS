---
title: 'EDO.js: A comprehensive JavaScript library for interaction with musical set theory in any tuning'
tags:
- JavaScript
- music theory
- music analysis
- music perception
- set theory
- diatonic set theory
- equal divisions of the octave
- TET

authors:
- name: Michael Seltenreich
  orcid: 0000-0002-6061-0674
  affiliation: 1

affiliations:
- name: Department of Music, New York University
  index: 1
  
date: 23 September 2021
bibliography: paper.bib

---

# Summary

EDO.js is a JavaScript library for generating, analyzing, and visualizing pitch-collections within any tuning system of Equal 
Divisions of an Octave (EDO). The current focus is on psychological experiments pertaining to musical 
scale perception and pitch-centric music research more broadly. EDO.js implements major algorithms presented in the
music theory and music cognition literature [e.g., @Balzano:1982; @clampitt; @rahn1991coordination; @vassilakis2001auditory; lerdahl2001tonal; @carey2007coherence], alongside a wide array of additional tools for analyzing and manipulating midi-data and melodies in the framework of musical set theory 
[@forte1973structure] and diatonic set theory.

Two classes are at the core of the package. The EDO class, and a daughter class, the Scale class. The EDO class and the Scale class conceptually diverge only on a single aspect: pitches in the Scale class are regarded as pitch-classes (exist only within an octave) and they have an enharmonic meaning. However, in the EDO class pitches are regarded as specific, and are not confined to a single octave. That is to say, while the Scale class treats C3 and C4 simply as “C”, the EDO class would regard them as separate entities. As such, the Scale class is better suited to engage with scales, their properties, and their structures, while the EDO class is an implementation of useful functions for engaging with more abstract musical structures.

### The EDO Class

The class contains eight sets of functions:

 * Functions used for converting between equivalent representations of the input in various formats (cents, ratios, pitches, intervals, frequencies, etc.)
 * Functions used for quantifying various parameters of a given input (e.g., the number of common tones between two inputs).
 * Boolean assertations on input data (e.g., is a set of pitches a transposition of another?) 
 * Functions used for visualization (e.g., contours, fractal trees, necklaces, fractal necklaces, nested necklaces, etc.). 
 * Functions used for importing and processing of midi files.
 * Functions used for importing and processing MusicXml files.
 * Functions used for exporting output data in various formats (e.g., images).
 * Other functions for analysis, and manipulation (e.g., extracting motives, extracting contour, generating harmonic progressions, extract pitch distribution, generating pseudo-random melodies, and more). 

### The Scale Class

The class contains six sets of functions:

 * Functions for converting between equivalent representations of the scale (e.g., for converting pitches to step sizes). 
 * Functions for quantifying various parameters of a given scale (cardinality, trichords, dissonance, coherence, and others).
 * Boolean assertations about the scale (e.g., is it invertible? Is it a mode-of-limited-transposition?)
 * Functions used for exporting (e.g., Scala files). 
 * Functions used for scale structure visualization (e.g., scalar fractal trees). 
 * Analysis, manipulation, and generation functions (e.g., calculate the coherence quotient, extract diatonic motives, return the Rothernberg Propriety, calculate Vassilakis Roughness, retrieve available n-chords, etc.). 

In addition to the sets of functions described above, the Scale class also contains five chainable methods commonly used in set-theory.

 * `Scale.invert()` returns the inversion of the original set.
 * `Scale.mode(n)` returns the nth mode of the original set.
 * `Scale.normal()` returns the set in normal order.
 * `Scale.prime()` returns the set in its prime form.
 * `Scale.complement()` returns the complement of the set in the current EDO.

For instance, `Scale.mode(3).invert().complement()` will return an instance of a Scale that is equivalent to the complement scale of the inversion of the 3rd mode of the original scale. 

# Statement of need

`Edo.js` is written in JavaScript for deployment on a Node.js server or in a web-browser. The full documentation for the package is available [here](https://michaelsel.github.io/edoJS), and the package is available on [GitHub](https://github.com/MichaelSel/edoJS) or in Node Package Manager ([NPM](https://www.npmjs.com/package/edo.js)).

This library is aimed at music theorists, musicologists, and cognitive scientists working on musical research, for the creation of stimuli for experiments, and for the analysis of musical structures.

# References
