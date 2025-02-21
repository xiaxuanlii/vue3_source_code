//这个文件会帮我们打包packages下的模块,最终打包出js文件

//node dev.js 要打包的名字 -f 打包的格式

//使用的是es6模块化语法, 要在package.json中使用type: module声明
import minimist from "minimist";
import {resolve, dirname} from "path"
import { fileURLToPath } from "url";
import { createRequire } from "module";
import esbuild from "esbuild"

/* 
process.argv
[
  'C:\\Program Files\\nodejs\\node.exe',
  'D:\\code\\vue3-lesson\\scripts\\dev.js',
  'reactivity',
  '-f',
  'esm'
] 
*/
const args = minimist(process.argv.slice(2))
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const require = createRequire(import.meta.url)


const target = args._[0] || "reactivity"
const format = args.f || "iife"
// console.log(target, format, __filename, __dirname, require)

const entry = resolve(__dirname, `../packages/${target}/src/index.ts`)
const pkg = resolve(__dirname, `../packages/${target}/package.json`)

esbuild.context({
  entryPoints: [entry],
  outfile: resolve(__dirname, `../packages/${target}/dist/${target}.js`),
  bundle: true, //reactivity依赖shared, 将依赖文件打包到一起
  platform: "browser", //打包后给浏览器使用
  sourcemap: true, //可以调试源代码
  format, //cjs esm iife
  globalName: pkg.buildOptions?.name
}).then((context) => {
  console.log('start dev');
  return context.watch();
})

