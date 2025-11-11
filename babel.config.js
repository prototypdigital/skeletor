module.exports = {
	presets: [
		"module:metro-react-native-babel-preset",
		"@babel/preset-react",
		{
			runtime: "automatic", // enables new JSX transform
		},
	],
};
