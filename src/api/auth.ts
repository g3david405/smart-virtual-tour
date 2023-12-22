import callApi, { ApiPayload } from './utils/apiCaller';

type LoginRequest = {
	phone_number: string;
	password: string;
};

export const fetchLogin = async (data: LoginRequest): Promise<ApiPayload> => {
	const res = await callApi({
		endpoint: '/account/login',
		method: 'POST',
		body: data,
	});

	return res;
};

export const fetchRefresh = async (): Promise<ApiPayload> => {
	const res = await callApi({
		authType: 'refresh_token',
		endpoint: '/v2/account/access_token',
		method: 'PUT',
	});

	return res;
};

export const testGet = async (): Promise<ApiPayload> => {
	// Assuming your API endpoint expects a phone number, and you want to include it in the URL
	const endpoint = '/test/get';

	try {
		const res = await callApi({
			endpoint,
			method: 'GET',
		});

		// Assuming callApi returns a promise that resolves to the response payload
		return res as ApiPayload; // Adjust this based on your actual response structure
	} catch (error) {
		// Handle errors here, e.g., log or throw
		console.error('Error fetching data:', error);
		throw error;
	}
};
