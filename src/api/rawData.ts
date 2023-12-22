import { MeasurementAll, MeasurementsName } from 'constants/measurements';
import callApi, { ApiPayload } from './utils/apiCaller';

export const fetchRawData = async (
	userID: string,
	start: string,
	end: string,
	dataType: MeasurementsName | MeasurementAll.name,
): Promise<ApiPayload> => {
	const res = await callApi({
		endpoint: `/measurement/record/${userID}?start=${start}&end=${end}&data_type=${dataType}`,
		method: 'GET',
	});

	return res;
};
