const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/index.js",

  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.[contenthash].js",
    clean: true,
  },

  mode: "development",

  resolve: {
    extensions: [".js", ".jsx"],
  },

  module: {
    rules: [
      // Babel loader xử lý JSX + ES6
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: "babel-loader",
      },

      // CSS loader
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },

      // Ảnh / font
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/i,
        type: "asset/resource",
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
  ],

  devServer: {
    static: {
      directory: path.join(__dirname, "public"),
    },
    port: 3000,
    open: true,
    hot: true,
    historyApiFallback: true,
  },
};