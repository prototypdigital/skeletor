module.exports = {
	presets: [
		"module:metro-react-native-babel-preset",
		"@babel/preset-react",
		{
			runtime: "automatic", // enables new JSX transform
		},
	],
	plugins: [
		[
			"module-resolver",
			{
				"alias":{
					"utils": "./src/utils",
					"models": "./src/models",
					"hooks": "./src/hooks",
					"components": "./src/components",
				}
			},
		],
	],
};
