const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');

module.exports = {
	entry: ["babel-polyfill", "./index.js"],
	output: {
		path: path.join(__dirname, "dist"),
		filename: "[name].[contenthash].js",
		// todo:
		// publicPath: "/assets/"  //最终访问的路径就是：localhost:3000/assets/*.js
		// chunkFilename: '[name].[chunkhash:8].js'
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: "babel-loader"
			},
			{
				test: /\.css$/,
				use: ["style-loader", "css-loader"]
			},
			{
				test: /\.(png|svg|jpg|gif)$/,
				use: ['file-loader']
			},
			{
				test: /\.(woff|woff2|eot|ttf|otf)$/,
				use: ['file-loader']
			}
		]
	},
	plugins: [
		new HtmlWebpackPlugin({
			title: 'Demo',
			template: "./index.html"
		}),
		new CleanWebpackPlugin()
	]
}