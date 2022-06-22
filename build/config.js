/**
 * externals配置 排除utils、components 引入重复打包
 * 以 ${libraryName}/[utils/package]/${key} 标识
 */
var path = require("path");
var fs = require("fs");
var nodeExternals = require("webpack-node-externals");

var externals = {};

externals = [
  Object.assign(
    {
      vue: "vue"
    },
    externals
  )
];

exports.externals = externals;

exports.alias = {
  [libraryName]: path.resolve(__dirname, "../"),
  "@": path.resolve(__dirname, "../examples"),
  packages: path.resolve(__dirname, "../packages")
};

exports.vue = {
  root: "Vue",
  commonjs: "vue",
  commonjs2: "vue",
  amd: "vue"
};

exports.jsexclude = /node_modules/;
