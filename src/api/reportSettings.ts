import { ReportSettingReq } from 'types/reportSettings';
import callApi, { ApiPayload } from './utils/apiCaller';

export const fetchUserReportSettings = async (userID: string): Promise<ApiPayload> => {
	const res = await callApi({
		endpoint: `/measurements/users/${userID}/report-settings`,
		method: 'GET',
	});

	return res;
};

export const putUserReportSettings = async (
	userID: string,
	settings: ReportSettingReq,
): Promise<ApiPayload> => {
	const res = await callApi({
		endpoint: `/measurements/users/${userID}/report-settings`,
		method: 'PUT',
		body: settings,
	});

	return res;
};
