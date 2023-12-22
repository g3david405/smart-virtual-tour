import {
	MeasurementsName,
	BloodSugarTestingTime,
	BloodPressureType,
} from '../constants/measurements';
import { PeriodString } from '../constants/reportSettings';
import { Period } from '../types/reportSettings';

export const getTicks = (start: Date, end: Date, period: Period) => {
	const ticksArray: number[] = [];
	let currentTime = start;
	while (currentTime.getTime() <= end.getTime()) {
		ticksArray.push(currentTime.getTime());
		currentTime = setNewCurrentTime(currentTime, period);
	}

	// except for monthly report, ticks have to show 1 day more beyond end date
	if (period === PeriodString.MONTH) {
		return ticksArray;
	}

	ticksArray.push(currentTime.getTime());

	return ticksArray;
};

function setNewCurrentTime(currentTime: Date, period: Period): Date {
	switch (period) {
		case PeriodString.TODAY:
			currentTime.setDate(currentTime.getDate());
			break;
		case PeriodString.WEEK:
			currentTime.setDate(currentTime.getDate() + 1);
			break;
		case PeriodString.BIWEEK:
			currentTime.setDate(currentTime.getDate() + 2);
			break;
		case PeriodString.MONTH:
			currentTime.setDate(currentTime.getDate() + 7);
			break;
		case PeriodString.QUARTER: {
			currentTime.setMonth(currentTime.getMonth() + 1);
			break;
		}
	}
	return currentTime;
}

export function getColor(
	dataType: MeasurementsName,
	extraType: BloodSugarTestingTime | BloodPressureType,
) {
	let color = '#00B0B8';
	if (dataType === MeasurementsName.BloodSugar) {
		switch (extraType) {
			case BloodSugarTestingTime.Premeal:
				color = '#18A5D3';
				break;
			case BloodSugarTestingTime.Postmeal:
				color = '#F09771';
				break;
			case BloodSugarTestingTime.Anytime:
				color = '#97C626';
				break;
			default:
				color = '#00B0B8';
		}
	}
	if (dataType === MeasurementsName.BloodPressure) {
		switch (extraType) {
			case BloodPressureType.Diastolic:
				color = '#00B0B8';
				break;
			case BloodPressureType.Systolic:
				color = '#886EC4';
				break;
			default:
				color = '#00B0B8';
				break;
		}
	}
	return color;
}
