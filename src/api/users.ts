import callApi, { ApiPayload } from './utils/apiCaller';

// fetch users profiles under the same account
export const fetchUsers = async (): Promise<ApiPayload> => {
	const res = await callApi({
		authType: 'access_token',
		endpoint: '/user/profiles',
		method: 'GET',
	});

	return res;
};
