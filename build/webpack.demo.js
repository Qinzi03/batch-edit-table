const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const vueLoaderConfig = require("./vue-loader.conf");

// 压缩单独的css文件
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
// 压缩js文件
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;
const utils = require("./utils");

const config = require("../config");
const isProd = process.env.NODE_ENV === "production";
function resolve(dir) {
  return path.join(__dirname, "..", dir);
}
const webpackConfig = {
  entry: "./examples/main.js",
  output: {
    path: path.resolve(process.cwd(), "./docs"),
    publicPath: process.env.CI_ENV || "",
    filename: "[name].[hash:7].js",
    chunkFilename: isProd ? "[name].[hash:7].js" : "[name].js"
  },
  resolve: {
    extensions: [".js", ".vue", ".json", ".md", ".ts", "tsx"],
    alias: {
      vue$: "vue/dist/vue.esm.js",
      "@": resolve("src")
    },
    modules: ["node_modules"]
  },
  devServer: {
    host: "0.0.0.0",
    port: 8085,
    publicPath: "/",
    hot: true
  },
  performance: {
    // 打包资源大小的提示开关
    hints: false
  },
  // 精确控制bundle 信息展示
  stats: {
    children: false
  },
  module: {
    rules: [
      ...utils.styleLoaders({
        sourceMap: config.dev.cssSourceMap,
        usePostCSS: true
      }),
      {
        test: /\.vue$/,
        loader: "vue-loader",
        options: vueLoaderConfig
      },
      {
        test: /\.js$/,
        loader: "babel-loader",
        include: [
          resolve("src"),
          resolve("test"),
          resolve("node_modules/webpack-dev-server/client")
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: "url-loader",
        options: {
          limit: 10000,
          name: utils.assetsPath("img/[name].[hash:7].[ext]")
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: "url-loader",
        options: {
          limit: 10000,
          name: utils.assetsPath("media/[name].[hash:7].[ext]")
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: "url-loader",
        options: {
          limit: 10000,
          name: utils.assetsPath("fonts/[name].[hash:7].[ext]")
        }
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      template: "./index.html",
      filename: "./index.html",
      inject: true
    }),
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, "../static")
      }
    ])
  ],
  devtool: "#eval-source-map"
};

if (isProd) {
  webpackConfig.externals = {
    vue: "Vue"
  };
  // 分析
  if (process.env.use_analyzer === "true") {
    webpackConfig.plugins.push(new BundleAnalyzerPlugin());
  }
  webpackConfig.devtool = false;
}

module.exports = webpackConfig;
