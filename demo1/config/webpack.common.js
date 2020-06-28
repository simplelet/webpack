const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const SpeedMeasureWebpackPlugin = require('speed-measure-webpack-plugin');

//speed-measure-webpack-plugin插件可以测量各个插件和loader所花费的时间
let spm = new SpeedMeasureWebpackPlugin();

const config = {
	//__dirname总是指向被执行js文件的绝对路径，在/d1/d2/myscript.js文件中写了__dirname，它的值就是 /d1/d2 。
	entry: ['./src/index.js'],
	output: {
		path: path.join(__dirname, '../dist'),
		/**
		 * hash 每次修改任何一个文件，所有文件名的hash至都将改变
		 * chunkhash 根据不同的入口文件(Entry)进行依赖文件解析、构建对应的chunk，生成对应的哈希值
		 * contenthash 是针对文件内容级别的，只有你自己模块的内容变了，那么hash值才改变
		 */
		filename: '[name][hash:6].js',
		// 假如最终编译出来的代码部署在 CDN 上，资源的地址为:'https://AAA/BBB/YourProject/XXX'，那么可以将生产的publicPath配置为://AAA/BBB/。
		publicPath: '/' //通常是CDN地址
	},
	module: {
		rules: [
			{
				test: /\.jsx?$/,
				use: [
					'cache-loader',
					{
						/**
						 preset-env 处理es6+规范语法的插件集合
						 preset-stage 处理尚处在提案语法的插件集合
						 preset-react 处理react语法的插件集合
						*/
						loader: 'babel-loader',
						options: {
							presets: [['@babel/preset-env', {
								"modules": false,
								//当我们需要按需polyfill时只需配置下useBuiltIns就行了，它会根据目标环境自动按需引入core-js和regenerator-runtime。
								"useBuiltIns": "entry", //"entry" || "usage"
								"targets": "ie >= 8"
							}], '@babel/preset-react'],
							plugins: [
								[
									//1.将转换后的代码的公共部分抽离到一个包中，由所有的文件共同引用，可以减少可观的代码量
									//2.可以为代码创建一个sandboxed environment（沙箱环境）
									'@babel/plugin-transform-runtime',
									{
										"corejs": 3  //将变量隔离在局部作用域中
									}
								],
								'@babel/plugin-syntax-dynamic-import' //按需加载
							]
						}
					}
				],
				exclude: /node_modules/ //排除后，有效提升编译效率
			},
			{
				/**
				 * style-loader 动态创建 style 标签，将 css 插入到 head 中
				 * css-loader 负责处理 @import 等语句
				 * postcss-loader 和 autoprefixer，自动生成浏览器兼容性前缀
				 * less-loader 负责处理编译 .less 文件,将其转为 css
				 */
				test: /\.(le|c|sc)ss$/,
				use: ['style-loader', 'css-loader', {
					loader: 'postcss-loader',
					options: {
						plugins: function () {
							return [
								require('autoprefixer')({
									"overrideBrowserslist": [
										">0.25%",
										"not dead"
									]
								})
							]
						}
					}
				}, 'less-loader'],
				exclude: /node_modules/
			},
			{
				//url-loader 和 file-loader 的功能类似，但是 url-loader 可以指定在文件大小小于指定的限制时，返回 DataURL
				test: /\.(png|jpg|gif|jpeg|webp|svg|eot|ttf|woff|woff2)$/,
				use: [
					{
						loader: 'url-loader',
						options: {
							limit: 10240, //10kb
							esModule: false, //esModule 设置为 false，否则，<img src={require('XXX.jpg')} /> 会出现 <img src=[Module Object] />
							name: '[name]_[hash:6].[ext]',
							outputPath: 'assets' //打包在assets件夹下
						}
					}
				],
				exclude: /node_modules/
			},
			// {
			// 	test: /\.html$/,
			// 	use: ['html-withimg-loader']
			// }
		]
	},
	plugins: [
		new HtmlWebpackPlugin({
			//title:'Demo2 Title', //生成html文件的标题
			template: './public/index.html', //html模板所在的文件路径
			filename: 'index.html', //打包后的文件名
			minify: {
				removeAttributeQuotes: false, //是否删除属性的双引号
				collapseWhitespace: false, //是否折叠空白
			},
			//hash: true //是否加上hash，默认是 false
		}),
		//每次打包前清空dist目录，不需要传参数喔，它可以找到 outputPath
		new CleanWebpackPlugin(),
		//分离css
		new MiniCssExtractPlugin({
			filename:'[name].css'
		}),
		//将抽离出来的css文件进行压缩
		new OptimizeCssAssetsWebpackPlugin(),
		new webpack.HotModuleReplacementPlugin(), //热更新插件
		//用 webpack 内置插件 DefinePlugin 来定义环境变量
		new webpack.DefinePlugin({
			DEV: JSON.stringify('dev'), //字符串
			FLAG: 'true' //FLAG 是个布尔类型
		})
	],
	//resolve 配置webpack如何寻找模块所对应的文件。
	resolve: {
		//resolve.modules 配置 webpack 去哪些目录下寻找第三方模块，默认情况下，只会去 node_modules 下寻找
		modules: ['./src/components', 'node_modules'], //从左到右依次查找, import React from 'react',先寻找./src/components/react,找不到再去node_modules找
		//resolve.alias 别名
		alias: {
			'react-example': '@react' //react-example的别名为@react
		},
		//例如：先找 .web.js，如果没有，再找 .js
		extensions: ['.web.js', '.js']
		//resolve.mainFields 默认配置是 ['browser', 'main']，即首先找对应依赖 package.json 中的 brower 字段，如果没有，找 main 字段。
	}
}

module.exports = spm.wrap(config);
