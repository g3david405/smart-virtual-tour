import callApi, { ApiPayload } from './utils/apiCaller';

export const fetchStatistics = async (
	userID: string,
	start: string,
	end: string,
): Promise<ApiPayload> => {
	const res = await callApi({
		endpoint: `/measurement/statistics/${userID}?start=${start}&end=${end}`,
		method: 'GET',
	});

	return res;
};
