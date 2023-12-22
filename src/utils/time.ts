export function formatDateToRFC3339(date: Date) {
	const year = date.getUTCFullYear();
	const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
	const day = date.getUTCDate().toString().padStart(2, '0');
	const hours = date.getUTCHours().toString().padStart(2, '0');
	const minutes = date.getUTCMinutes().toString().padStart(2, '0');
	const seconds = date.getUTCSeconds().toString().padStart(2, '0');
	const timeZoneOffsetMinutes = date.getTimezoneOffset();
	const timeZoneOffsetHours = Math.abs(Math.floor(timeZoneOffsetMinutes / 60))
		.toString()
		.padStart(2, '0');
	const timeZoneOffsetSign = timeZoneOffsetMinutes >= 0 ? '-' : '+';

	return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}${timeZoneOffsetSign}${timeZoneOffsetHours}:00`;
}

export function formatDateToString(date: Date): string {
	const month = date.getMonth() + 1;
	const day = date.getDate();
	// add 0 in front for single digit number
	const hour = ('0' + date.getHours()).slice(-2);
	const minute = ('0' + date.getMinutes()).slice(-2);
	return `${month}/${day}${hour.padStart(10)}:${minute}`;
}

export function displayDateRange(start: Date, end: Date) {
	const startYear = start.getFullYear();
	const endYear = end.getFullYear();
	const startMonth = start.getMonth();
	const endMonth = end.getMonth();

	if (startYear !== endYear)
		return `${start.getFullYear()}/${
			start.getMonth() + 1
		}/${start.getDate()} - ${end.getFullYear()}/${end.getMonth() + 1}/${end.getDate()}`;

	if (startMonth !== endMonth)
		return `${start.getFullYear()}/${start.getMonth() + 1}/${start.getDate()} - ${
			end.getMonth() + 1
		}/${end.getDate()}`;

	return `${start.getFullYear()}/${start.getMonth() + 1}/${start.getDate()} - ${end.getDate()}`;
}
