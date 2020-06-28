const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common');

module.exports = merge(common, {
	mode: 'development',
	devtool: 'eval-source-map',
	devServer: {
		//配置了 html-webpack-plugin 的情况下， contentBase 不会起任何作用
		// contentBase: path.join(__dirname, '../dist'),
		port: '3004',
		open: true,
		compress: true,
		hot: true
		/**
		 * inline: true, 默认开启 inline 模式，如果设置为false,开启 iframe 模式
		 * clientLogLevel: "silent", 日志等级,当使用内联模式时，在浏览器的控制台将显示消息，
		 * 		如：在重新加载之前，在一个错误之前，或者模块热替换启用时。如果你不喜欢看这些信息，可以将其设置为silent(none即将被移除)。
		 * quite: false, 默认不启用，启用后，除了初始启动信息之外的任何内容都不会被打印到控制台。
		 * stats: "errors-only", 终端仅打印 error, 当启用了quiet或者是noInfo时，此属性不起作用。
		 * overlay: false 启用overlay后，当编译出错时，会在浏览器窗口全屏输出错误，默认是关闭的。
		 */

	}
});
