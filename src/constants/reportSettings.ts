export enum PeriodString {
	TODAY = 'current',
	WEEK = 'week',
	BIWEEK = '2week',
	MONTH = 'month',
	QUARTER = 'quarter',
}

enum ReportPeriod {
	TODAILY = '日報',
	WEEKLY = '週報',
	BIWEEKLY = '雙週報',
	MONTHLY = '月報',
	QUARTERLY = '季報',
}

export enum Agent {
	DOG = 'dog',
	CAT = 'cat',
}

export const reportPeriodName = {
	[PeriodString.TODAY]: ReportPeriod.TODAILY,
	[PeriodString.WEEK]: ReportPeriod.WEEKLY,
	[PeriodString.BIWEEK]: ReportPeriod.BIWEEKLY,
	[PeriodString.MONTH]: ReportPeriod.MONTHLY,
	[PeriodString.QUARTER]: ReportPeriod.QUARTERLY,
};
