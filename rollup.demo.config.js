import buble from "@rollup/plugin-buble"
import nodeResolve from "rollup-plugin-node-resolve"
import commonJS from "rollup-plugin-commonjs"
import livereload from "rollup-plugin-livereload"
import serve from "rollup-plugin-serve"
import postcss from "rollup-plugin-postcss";
import copy from "rollup-plugin-copy"
import cleaner from "rollup-plugin-cleaner"
import fg from 'fast-glob';

export default {
  input: "demo/script.js",
  output: { format: "iife", file: "demo_dist/script.js" },
  plugins: [
    {
      name: 'watch-external',
      async buildStart() {
        const files = await fg('demo/index.html');
        for (let file of files) { this.addWatchFile(file) }
      }
    },

    cleaner({
      targets: [
        './demo_dist/'
      ]
    }),

    copy({
      targets: [{ src: 'demo/index.html', dest: 'demo_dist' }]
    }),

    postcss({
      extensions: ['.css'],
    }),

    buble({
      exclude: "node_modules/**",
      include: "src/**",
      namedFunctionExpressions: false,
      objectAssign: true
    }),

    nodeResolve({
      main: true,
      browser: true
    }),

    commonJS({
      include: '../**',
      sourceMap: false
    }),

    serve({
      contentBase: 'demo_dist',
      port: 3000
    }),

    livereload({
      watch: ["demo_dist/script.js", "demo_dist/index.html"]
    })
  ]
}
