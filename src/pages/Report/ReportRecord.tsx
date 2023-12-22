import { Typography, Grid, Box } from '@mui/material';
import { Container } from '@mui/system';
import { ReportHeader } from 'components/ReportHeader';
import { MeasurementAll } from 'constants/measurements';

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { reportLoader } from 'router';
import { LoaderData } from 'types/router';
import { isStatusOk } from 'api/utils/apiCaller';
import { formatDateToRFC3339 } from 'utils/time';
import { statistic } from 'types/statistics';

import { useRouteLoaderData, useOutletContext } from 'react-router-dom';
import { ReportContext } from 'components/ReportParentRoute/ReportParentRoute';
import { fetchUserReportSettings } from 'api/reportSettings';
import { GetReportSettingsResp, ReportSetting } from 'types/reportSettings';
import { getDateRange } from 'utils/reportSettings';
import { filterRawDataForReportCard } from 'utils/rawData';
import { fetchRawData } from 'api/rawData';
import { GetRawDataResp, MeasurementDocument } from 'types/measurement';
import { MeasureDataCard } from 'components/MeasureDataCard';

export interface UserParams {
	user_id: string;
}

export const ReportRecord = () => {
	const targetUser = useRouteLoaderData('report') as LoaderData<typeof reportLoader>;
	const { dateRange, setDateRange, period, setPeriod } = useOutletContext<ReportContext>();
	const { user_id: targetUserID } = useParams<keyof UserParams>() as UserParams;

	//const [count, setCount] = useState(0);

	// const handleIncrement = () => {
	//   setCount(count + 1);
	// };

	// const handleDecrement = () => {
	//   setCount(count - 1);
	// };
	const [isFirstFetch, setIsFirstFetch] = useState(false);

	const reportSettingsQuery = useQuery({
		queryKey: ['report_settings', targetUserID],
		queryFn: async () => {
			setIsFirstFetch(true);
			const res = await fetchUserReportSettings(targetUserID);
			const { status, payload } = res;
			if (!isStatusOk(status)) {
				throw new Error('failed to fetch user report settings');
			}
			const reportSettingsResp = payload as GetReportSettingsResp;
			return reportSettingsResp._data;
		},
		initialData: {} as ReportSetting,
		// only fetch report settings when period in global state is empty
		enabled: period === undefined,
	});

	// console.log(reportSettingsQuery);

	useEffect(() => {
		if (reportSettingsQuery.isSuccess && reportSettingsQuery.data && isFirstFetch) {
			const { period } = reportSettingsQuery.data;
			const { start, end } = getDateRange(period, new Date());
			setPeriod(period);
			setDateRange({ start, end });
			setIsFirstFetch(false);
		}
		return;
	}, [reportSettingsQuery.data]);

	const rawDataQuery = useQuery({
		queryKey: [MeasurementAll.name, dateRange?.start, dateRange?.end, targetUserID],

		queryFn: async () => {
			if (!dateRange) return {} as Record<string, statistic[]>;
			const start = formatDateToRFC3339(dateRange.start);
			const end = formatDateToRFC3339(dateRange.end);
			const res = await fetchRawData(
				targetUserID,
				encodeURIComponent(start),
				encodeURIComponent(end),
				MeasurementAll.name,
			);
			const { status, payload } = res;
			if (!isStatusOk(status)) {
				throw new Error('failed to fetch users rawData');
			}
			const rawDataResp = payload as GetRawDataResp;
			return filterRawDataForReportCard(rawDataResp._data);
		},
		initialData: {} as Record<string, statistic[]>,
		// only start to fetch stats when period and dataRange is set
		enabled: period !== undefined,
	});

	// console.log(rawDataQuery.data);
	if (!Object.keys(rawDataQuery.data).length) {
		return (
			<div>
				<div style={{ display: 'flex' }}>
					<div style={{ flex: 1 }}>
						<Container sx={{ background: '#EEEEEE', minHeight: '100vh' }}>
							<ReportHeader username={targetUser.display_name} />
							<Typography
								sx={{
									textAlign: 'center',
									marginTop: '77px',

									fontSize: '32px',
									lineHeight: '36px',
									fontWeight: '400',
									color: '#9E9E9E',
								}}
							>
								時間內尚未量測
							</Typography>
						</Container>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div>
			<div style={{ display: 'flex' }}>
				<div style={{ flex: 1 }}>
					<Container sx={{ background: '#EEEEEE', minHeight: '100vh' }}>
						<ReportHeader username={targetUser.display_name} />
						<Typography
							sx={{
								marginTop: '77px',

								fontSize: '16px',
								lineHeight: '36px',
								fontWeight: '400',
								color: '#9E9E9E',
							}}
						>
							<Box sx={{ flexGrow: 1 }}>
								<div>
									{Object.entries(rawDataQuery.data).map(([date, data]) => (
										<div key={date}>
											<h2>日期: {date}</h2>
											<Grid container spacing={1} direction='row'>
												{data.map((item: MeasurementDocument, index: number) => (
													<Grid item xs={12} sm={6} md={4} lg={4} key={date + '_' + index}>
														<MeasureDataCard MeasureData={item} />
													</Grid>
												))}
											</Grid>
										</div>
									))}
								</div>
							</Box>
						</Typography>
					</Container>
				</div>
			</div>
		</div>
	);
};
