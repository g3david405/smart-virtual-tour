import { BloodPressureType, MeasurementsName } from 'constants/measurements';
import { ChartData } from 'types/chart';
import { MeasurementDocument } from 'types/measurement';

export function filterRawData(data: MeasurementDocument[], name: MeasurementsName): ChartData[] {
	const chartData: ChartData[] = [];
	switch (name) {
		case MeasurementsName.BloodPressure:
			data.forEach((d) => {
				chartData.push({
					date: new Date(d.measurement_time),
					value: d[name].systolic,
					type: BloodPressureType.Systolic,
				});
				chartData.push({
					date: new Date(d.measurement_time),
					value: d[name].diastolic,
					type: BloodPressureType.Diastolic,
				});
			});
			break;
		case MeasurementsName.BloodSugar:
			data.forEach((d) => {
				chartData.push({
					date: new Date(d.measurement_time),
					value: d[name].value,
					type: d[name].testing_time,
				});
			});
			break;
		default:
			data.forEach((d) => {
				chartData.push({
					date: new Date(d.measurement_time),
					value: d[name].value,
				});
			});
	}
	return chartData;
}

export function filterRawDataForReportCard(
	data: MeasurementDocument[],
): Record<string, MeasurementDocument[]> {
	const groupedData = data.reduce(
		(result: Record<string, MeasurementDocument[]>, item: MeasurementDocument) => {
			const strdate = item.measurement_time.split('T')[0];
			if (!result[strdate]) {
				result[strdate] = [];
			}
			result[strdate].push(item);
			return result;
		},
		{},
	);

	return groupedData;
}
