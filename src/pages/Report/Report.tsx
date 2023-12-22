import { Box, Skeleton, Typography } from '@mui/material';
import { Container } from '@mui/system';
import { Chips } from 'components/Chips';
import { ReportHeader } from 'components/ReportHeader';
import { StatisticsCard } from 'components/StatisticsCard';
import { StatusCard } from 'components/StatusCard';

import {
	BloodSugarTestingTime,
	BloodSugarTestingTimeLabel,
	BloodSugarTestingTimeSum,
	MeasurementAll,
	MeasurementsName,
	measurementObject,
	statsDisplayOrder,
} from 'constants/measurements';
import React, { useState, useEffect, memo, useRef } from 'react';
import { useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { reportLoader } from 'router';
import { LoaderData } from 'types/router';
import { isStatusOk } from 'api/utils/apiCaller';
import { fetchStatistics } from 'api/statistics';
import { formatDateToRFC3339 } from 'utils/time';
import { GetStatisticsResp, statistic } from 'types/statistics';
import { transformStatisticsResp } from 'utils/statistics';
import { chip } from 'components/Chips/Chips';
import { sortByName } from 'utils/sort';
import { fetchUserStandard } from 'api/measurementStandard';
import { GetUserStandardResp } from 'types/measurement';
import { matchPath, useRouteLoaderData, useOutletContext } from 'react-router-dom';
import { ReportContext } from 'components/ReportParentRoute/ReportParentRoute';
import { fetchUserReportSettings } from 'api/reportSettings';
import { GetReportSettingsResp, ReportSetting } from 'types/reportSettings';
import { getDateRange } from 'utils/reportSettings';
import { useLocation } from 'react-router-dom';

export type SelectedType = {
	dataType: MeasurementsName | MeasurementAll.name;
	testingTime: BloodSugarTestingTime | BloodSugarTestingTimeSum.name; // this field is for filter blood sugar testing time
};

export interface UserParams {
	user_id: string;
}

export const useMeasurementStandardQuery = () => {
	const location = useLocation();
	const match = matchPath({ path: '/report/:user_id' }, location.pathname);
	return useQuery({
		queryKey: ['measurement_standard', match],
		queryFn: async () => {
			if (!match || !match.params.user_id) {
				throw new Error('failed to fetch users standards - no user_id');
			}
			const res = await fetchUserStandard(match.params.user_id);
			const { status, payload } = res;
			if (!isStatusOk(status)) {
				throw new Error('failed to fetch users standards');
			}
			const userStandardResp = payload as GetUserStandardResp;
			return userStandardResp._data;
		},
	});
};

export const Report = () => {
	const reminderTextRef = useRef<HTMLDivElement | null>(null);
	const targetUser = useRouteLoaderData('report') as LoaderData<typeof reportLoader>;
	const { user_id: targetUserID } = useParams<keyof UserParams>() as UserParams;
	const { dateRange, setDateRange, period, setPeriod } = useOutletContext<ReportContext>();

	const [selectedType, setSelectedType] = useState<SelectedType>({
		dataType: MeasurementAll.name,
		testingTime: BloodSugarTestingTimeSum.name,
	});
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

	// set period and dateRange to global state to initiate stats api call
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

	const statsQuery = useQuery({
		queryKey: ['statistics', dateRange?.start, dateRange?.end, targetUserID],
		queryFn: async () => {
			if (!dateRange) return {} as Record<string, statistic[]>;
			const start = formatDateToRFC3339(dateRange.start);
			const end = formatDateToRFC3339(dateRange.end);
			const res = await fetchStatistics(
				targetUserID,
				encodeURIComponent(start),
				encodeURIComponent(end),
			);
			const { status, payload } = res;
			if (!isStatusOk(status)) {
				throw new Error('failed to fetch users statistics');
			}
			const statisticsResp = payload as GetStatisticsResp;
			return transformStatisticsResp(statisticsResp._data);
		},
		initialData: {} as Record<string, statistic[]>,
		// only start to fetch stats when period and dataRange is set
		enabled: period !== undefined,
	});

	let isAnyAbnormalExists = false;
	function createChipsAndCards(statistics: Record<string, statistic[]>) {
		// Chips 和圖表順序：血壓、脈膊、血糖、體重、體脂、體溫、血氧
		const statsName = Object.keys(statistics).map((key) => ({ name: key }));
		const sortedStatsName = sortByName(statsName, statsDisplayOrder);

		const chipsProps: chip[] = [
			{
				name: MeasurementAll.name,
				label: MeasurementAll.label,
				showWarning: isAnyAbnormalExists,
				handleClick: () => {
					setSelectedType((prevState) => ({ ...prevState, dataType: MeasurementAll.name }));
					// TODO: how to avoid browser to scroll back to the top when rerender?
					// NOTE: to scroll back to the previous position after user clicks on the chip
					setTimeout(() => {
						if (!reminderTextRef.current) return;
						reminderTextRef.current.scrollIntoView({ behavior: 'smooth' });
					}, 100);
				},
				selectedType: selectedType.dataType,
			},
		];
		const statisticsCards: JSX.Element[] = [];

		for (const dataType of sortedStatsName) {
			// create chip of that dataType
			const isAbnormal = statistics[dataType.name as MeasurementsName].some(
				(record) => record.abnormal_count > 0,
			);
			if (isAbnormal) isAnyAbnormalExists = true;
			chipsProps.push({
				name: dataType.name as MeasurementsName,
				label: measurementObject[dataType.name as MeasurementsName].label,
				showWarning: isAbnormal,
				handleClick: () => {
					setSelectedType((prevState) => ({
						...prevState,
						dataType: dataType.name as MeasurementsName,
					}));
					setTimeout(() => {
						if (!reminderTextRef.current) return;
						reminderTextRef.current.scrollIntoView({ behavior: 'smooth' });
					}, 100);
				},
				selectedType: selectedType.dataType,
			});

			// create statistics card of that dataType
			if (
				selectedType.dataType === (dataType.name as MeasurementsName) ||
				selectedType.dataType === MeasurementAll.name
			) {
				statisticsCards.push(
					<StatisticsCard
						key={dataType.name}
						name={dataType.name as MeasurementsName}
						statistics={statistics[dataType.name as MeasurementsName]}
						// currently only bloodSugar card has chips on it
						withChips={dataType.name === MeasurementsName.BloodSugar}
						ChipsElem={
							dataType.name === MeasurementsName.BloodSugar ? (
								<Chips
									chips={createBloodSugarChips(statistics[dataType.name as MeasurementsName])}
								/>
							) : (
								<></>
							)
						}
						selectedType={selectedType}
					/>,
				);
			}
		}

		// if any abnormal count exists, show warning icon in the "all" chip
		chipsProps[0].showWarning = isAnyAbnormalExists;
		return { chipsProps, statisticsCards };
	}

	function createBloodSugarChips(bloodSugarStats: statistic[]): chip[] {
		const chipsProps: chip[] = [];
		const testingTimes: {
			name: BloodSugarTestingTime | BloodSugarTestingTimeSum.name;
			label: BloodSugarTestingTimeLabel | BloodSugarTestingTimeSum.label;
		}[] = [
			{ name: BloodSugarTestingTime.Premeal, label: BloodSugarTestingTimeLabel.Premeal },
			{ name: BloodSugarTestingTime.Postmeal, label: BloodSugarTestingTimeLabel.Postmeal },
			{ name: BloodSugarTestingTime.Anytime, label: BloodSugarTestingTimeLabel.Anytime },
			{ name: BloodSugarTestingTimeSum.name, label: BloodSugarTestingTimeSum.label },
		];

		let isAnyAbnormalExists = false;
		testingTimes.forEach((testingTime) => {
			const matchingStat = bloodSugarStats.find((s) => s.name.includes(testingTime.name));
			if (matchingStat) {
				const isAbnormal = matchingStat.abnormal_count > 0;
				if (isAbnormal) isAnyAbnormalExists = true;
				chipsProps.push({
					name: testingTime.name,
					label: testingTime.label,
					// we don't have reference value for "sum", therefore we have to add up the abnormal count of other testing time to get the 'sum' abnormal count
					showWarning:
						testingTime.name === BloodSugarTestingTimeSum.name ? isAnyAbnormalExists : isAbnormal,
					handleClick: () =>
						setSelectedType((prevState) => ({
							...prevState,
							testingTime: testingTime.name,
						})),
					selectedType: selectedType.testingTime,
				});
			}
		});
		const chipsOrder = [
			BloodSugarTestingTimeSum.name,
			BloodSugarTestingTime.Premeal,
			BloodSugarTestingTime.Postmeal,
			BloodSugarTestingTime.Anytime,
		];

		return sortByName(chipsProps, chipsOrder);
	}

	if (statsQuery.isFetching || reportSettingsQuery.isFetching) {
		return (
			<div>
				<div style={{ display: 'flex' }}>
					<div style={{ flex: 1 }}>
						<Container sx={{ background: '#EEEEEE', minHeight: '100vh', padding: '16px' }}>
							<Skeleton
								variant='rounded'
								width={'100%'}
								height={84}
								animation='wave'
								sx={{ marginBottom: '16px' }}
							/>
							<Skeleton variant='rounded' width={'100%'} height={136} animation='wave' />
							<Skeleton
								variant='text'
								sx={{ fontSize: '5rem', margin: '16px 0' }}
								animation='wave'
							/>
							<Skeleton
								variant='rounded'
								sx={{ marginBottom: '16px' }}
								width={'100%'}
								height={100}
								animation='wave'
							/>
							<Skeleton variant='rounded' width={'100%'} height={483} animation='wave' />
						</Container>
					</div>
				</div>
			</div>
		);
	}

	if (statsQuery.isError || reportSettingsQuery.isError) {
		return (
			<div>
				<div style={{ display: 'flex' }}>
					<div style={{ flex: 1 }}>
						<Container sx={{ background: '#EEEEEE', minHeight: '100vh' }}>
							<ReportHeader username={targetUser.display_name} />
							<span>Something went wrong...</span>
						</Container>
					</div>
				</div>
			</div>
		);
	}

	if (!Object.keys(statsQuery.data).length) {
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

	const { chipsProps, statisticsCards } = createChipsAndCards(statsQuery.data);

	const ReminderText = memo(() => (
		<Typography
			sx={{
				margin: '16px 0',
				fontSize: '14px',
				lineHeight: '22px',
				fontWeight: '400',
				color: '#9E9E9E',
			}}
			ref={reminderTextRef}
		>
			貼心提醒：本建議僅供參考，如需了解數值真實反映狀況，請諮詢醫生或醫療專業人員。
		</Typography>
	));
	ReminderText.displayName = 'ReminderText';

	return (
		<div>
			<div style={{ display: 'flex' }}>
				<div style={{ flex: 1 }}>
					<Container sx={{ background: '#EEEEEE', minHeight: '100vh' }}>
						<ReportHeader username={targetUser.display_name} />
						<StatusCard isNormal={!isAnyAbnormalExists} agent={reportSettingsQuery.data.agent} />
						<ReminderText />
						<Chips chips={chipsProps} />
						<Box sx={{ paddingBottom: '8px' }}>{statisticsCards}</Box>
					</Container>
				</div>
			</div>
		</div>
	);
};
