module.exports = {
	presets: [
		[
			"@babel/preset-env",
			{
				targets: "last 2 Chrome versions, last 2 Firefox versions, last 2 Safari versions, ie 11",
			},
		],
	],
};
