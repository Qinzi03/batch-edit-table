// webpack.config.js
const path = require("path");
const vueLoaderConfig = require("./vue-loader.conf");

module.exports = {
  entry: {
    index: path.join(__dirname, "../src/index.js") // 入口文件（就是刚才用于暴露组件的index.js）
  },
  output: {
    path: path.join(__dirname, "../dist"), // 打包后的文件存放在dist文件夹
    publicPath: "/dist/", // 设置公共路径
    filename: "batch-edit-table.min.js", // 打包后输出文件的文件设置为btn.js
    libraryTarget: "umd" // 这个选项会尝试把库暴露给前使用的模块定义系统，这使其和CommonJS、AMD兼容或者暴露为全局变量
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: "vue-loader",
        options: vueLoaderConfig
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.(scss|sass)$/,
        use: ["style-loader", "css-loader", "sass-loader"]
      },
      {
        test: /\.(png|jpg|svg|gif)$/,
        use: ["url-loader"]
      },
      {
        test: /\.js$/,
        exclude: /node_modules|vue\/dist|vue-router\/|vue-loader\/|vue-hot-reload-api\//,
        loader: "babel-loader"
      }
    ]
  }
};
