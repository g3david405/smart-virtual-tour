import callApi, { ApiPayload } from './utils/apiCaller';

export const fetchUserStandard = async (userID: string): Promise<ApiPayload> => {
	const res = await callApi({
		endpoint: `/measurement-standards/${userID}`,
		method: 'GET',
	});

	return res;
};
