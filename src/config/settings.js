// settings.js
const settings = {
	dev: {
		baseURL: "https://attention.cl/api",
	},
	prod: {
		baseURL: "https://attention.cl/api",
	},
};

const getCurrentSettings = () => {
    if (__DEV__) return settings.dev;

    return settings.prod;
}

export default getCurrentSettings();