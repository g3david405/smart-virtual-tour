import { MeasurementsName } from 'constants/measurements';
import { statistic } from 'types/statistics';

export function transformStatisticsResp(stats: statistic[]): Record<string, statistic[]> {
	const transformedStats: Record<string, statistic[]> = {};
	stats.forEach((s) => {
		if (s.name.includes(MeasurementsName.BloodSugar)) {
			if (Object.prototype.hasOwnProperty.call(transformedStats, MeasurementsName.BloodSugar)) {
				transformedStats[MeasurementsName.BloodSugar]?.push(s);
			} else {
				transformedStats[MeasurementsName.BloodSugar] = [s];
			}
		} else if (s.name.includes(MeasurementsName.BloodPressure)) {
			if (Object.prototype.hasOwnProperty.call(transformedStats, MeasurementsName.BloodPressure)) {
				transformedStats[MeasurementsName.BloodPressure]?.push(s);
			} else {
				transformedStats[MeasurementsName.BloodPressure] = [s];
			}
		} else if (isValueInEnum(MeasurementsName, s.name)) {
			// s.name is checked to be value of enum MeasurementsName
			transformedStats[s.name] = [s];
		}
	});

	return transformedStats;
}

function isValueInEnum(enumType: Record<string, string>, value: string): boolean {
	return Object.values(enumType).includes(value);
}
