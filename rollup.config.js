import buble from '@rollup/plugin-buble'
import cleaner from "rollup-plugin-cleaner"
import strip from '@rollup/plugin-strip'

export default {
  input: './src/index.js',
  output: [{
    file: 'dist/index.js',
    format: 'cjs',
    sourcemap: true
  }, {
    file: 'dist/index.es.js',
    format: 'es',
    sourcemap: true
  }],
  plugins: [
    cleaner({
      targets: [
        './dist/'
      ]
    }),

    strip(),

    buble({
      objectAssign: true
    })
  ],
  external(id) { return !/^[\.\/]/.test(id) }
}
