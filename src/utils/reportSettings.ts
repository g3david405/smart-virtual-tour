import { PeriodString } from 'constants/reportSettings';
import { Period } from 'types/reportSettings';

export function getDateRange(period: Period, selectedDate: Date): { start: Date; end: Date } {
	let start, end;

	// 預設日期要是今日的上個區間
	// CASE WEEK: 今日 11/6，應該要10/29-11/4
	// CASE MONTH: 今日 11/6，應該要10/1-10/31
	switch (period) {
		default:
		case PeriodString.TODAY:
			start = new Date(selectedDate);
			start.setHours(0, 0, 0, 0);
			end = new Date(selectedDate);
			end.setHours(23, 59, 59, 0);
			break;
		case PeriodString.WEEK:
			start = new Date(selectedDate);
			start.setDate(selectedDate.getDate() - 7);
			start.setHours(0, 0, 0, 0);
			// end = new Date(start);
			// end.setDate(start.getDate() + 6);
			// end.setHours(23, 59, 59, 0);
			break;
		case PeriodString.MONTH:
			start = new Date(selectedDate);
			start.setMonth(selectedDate.getMonth() - 1);
			start.setHours(0, 0, 0, 0);
			// end = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 0);
			// end.setHours(23, 59, 59, 0);
			break;
		case PeriodString.BIWEEK:
			start = new Date(selectedDate);
			start.setDate(selectedDate.getDate() - 14);
			start.setHours(0, 0, 0, 0);
			// end = new Date(start);
			// end.setDate(start.getDate() + 13);
			// end.setHours(23, 59, 59, 0);
			break;
		case PeriodString.QUARTER: {
			start = new Date(selectedDate);
			// 1/1 - 3/31 -> 10/1 - 12/31
			start.setMonth(start.getMonth() - 3);
			start.setHours(0, 0, 0, 0);
		}
	}
	end = new Date(selectedDate);
	return { start, end };
}
