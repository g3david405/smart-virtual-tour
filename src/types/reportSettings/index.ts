import { Agent, PeriodString } from 'constants/reportSettings';

export type Period =
	| PeriodString.TODAY
	| PeriodString.WEEK
	| PeriodString.BIWEEK
	| PeriodString.MONTH
	| PeriodString.QUARTER;

export type DateRange = {
	start: Date;
	end: Date;
};

export type ReportSetting = {
	agent: Agent;
	period: Period;
};

export type GetReportSettingsResp = {
	_data: ReportSetting;
	_id: string;
};

export type ReportSettingReq = {
	period: Period;
};
