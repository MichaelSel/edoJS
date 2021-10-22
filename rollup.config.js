import { terser } from 'rollup-plugin-terser';

// output directory for build files
const outputDir = "dist/";

// PS: just an example configuration. Alter it according to your needs.

export default {
    // input source code file
    input: './edo.js',
    output: [
        {
            // for only web-browser imports
            file: outputDir  + 'edo.js',
            format: 'iife',
            name: 'edo.js', // the global which can be used during imports. You can access classes like `edojs.EDO` for example
        },
        {
            // for UMD import (works both in browsers and node.js)
            file: outputDir + 'edo.umd.js',
            format: 'umd',
            name: 'edo.js' // the global which can be used during imports
        },
        {
            // for ESM imports
            file: outputDir + 'edo.es.js',
            format: 'es'
        },
        {
            // IIFE format with minification applied
            file: outputDir + 'edo.min.js',
            format: 'iife',
            name: 'edo.js', // the global which can be used during imports. You can access classes like `edojs.EDO` for example
            plugins: [terser()]
        }
    ]
};
