import axios from "axios";
import settings from "../config/settings";

const apiClient = axios.create({
	baseURL: settings.baseURL,
	headers: {
		"Content-Type": "application/json",
	},
});

apiClient.interceptors.request.use(
	(request) => {
		return request;
	},
	(error) => {
		console.error("Request error:", error);
		return Promise.reject(error);
	}
);

apiClient.interceptors.response.use(
	(response) => response,
	(error) => {
		// Handle response errors here
		console.error("Response error:", error);
		return Promise.reject(error);
	}
);

export default apiClient;
