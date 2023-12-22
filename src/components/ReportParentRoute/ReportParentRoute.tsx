import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { DateRange, Period } from 'types/reportSettings';

export interface ReportContext {
	period: Period | undefined;
	dateRange: DateRange | undefined;
	setPeriod: React.Dispatch<React.SetStateAction<Period | undefined>>;
	setDateRange: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
}

export const ReportParentRoute = () => {
	const [period, setPeriod] = useState<Period | undefined>(undefined);
	const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

	return (
		<>
			<Outlet context={{ period, setPeriod, dateRange, setDateRange }} />
		</>
	);
};
