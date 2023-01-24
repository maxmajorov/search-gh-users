const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { SourceMapDevToolPlugin } = require("webpack");
const path = require("path");

const plugins = [
  new HtmlWebpackPlugin({
    template: "./src/index.html",
    filename: "index.html",
  }),
  new SourceMapDevToolPlugin({
    filename: "[file].map",
  }),
];

module.exports = {
  entry: "./src/main.js",
  output: {
    filename: "main.[hash:8].js",
    path: path.join(__dirname, "/dist"),
    sourceMapFilename: "[name].js.map",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        enforce: "pre",
        use: ["source-map-loader"],
      },
    ],
  },
  devServer: {
    port: 3200,
  },
  devtool: "source-map",
  resolve: {
    extensions: [".js"],
  },
  plugins,
};
