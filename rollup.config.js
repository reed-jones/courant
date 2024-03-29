import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
// import vue from "rollup-plugin-vue";
import pkg from "./package.json";

export default [
  // browser-friendly UMD build
  {
    input: "src/courant/main.js",
    external: ["vue"],
    output: {
      name: "courant",
      file: pkg.browser,
      format: "umd",
      exports: 'named',
      globals: {
        'vue': 'vue'
      }
    },
    plugins: [
      resolve(), // so Rollup can find `ms`
      commonjs(), // so Rollup can convert `ms` to an ES module
    //   vue(),
    ],
  },

  // CommonJS (for Node) and ES module (for bundlers) build.
  // (We could have three entries in the configuration array
  // instead of two, but it's quicker to generate multiple
  // builds from a single configuration where possible, using
  // an array for the `output` option, where we can specify
  // `file` and `format` for each target)
  {
    input: "src/courant/main.js",
    external: ["vue"],
    output: [
      { file: pkg.main, format: "cjs", exports: 'named' },
      { file: pkg.module, format: "es", exports: 'named' },
    ],
    plugins: [
      resolve(), // so Rollup can find `ms`
      commonjs(), // so Rollup can convert `ms` to an ES module
    //   vue(),
    ],
  },
];
