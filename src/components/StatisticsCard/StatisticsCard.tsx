import React, { memo } from 'react';
import {
	BloodPressureType,
	BloodPressureTypeLabel,
	BloodSugarTestTimeObj,
	BloodSugarTestingTime,
	BloodSugarTestingTimeLabel,
	BloodSugarTestingTimeSum,
	MeasurementsName,
	intervalByDataType,
	measurementObject,
} from 'constants/measurements';
import { statistic } from 'types/statistics';
import { Card, CardContent, CardHeader, Typography } from '@mui/material';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { Box } from '@mui/material';
import { ChipsProps } from 'components/Chips/Chips';
import { ReactComponent as BloodOxygenSVG } from 'icons/vital_blood_oxygen.svg';
import { ReactComponent as BloodPressureSVG } from 'icons/vital_blood_pressure.svg';
import { ReactComponent as BloodSugarSVG } from 'icons/vital_blood_sugar.svg';
import { ReactComponent as BodyFatSVG } from 'icons/vital_body_fat.svg';
import { ReactComponent as BodyTempSVG } from 'icons/vital_body_temperature.svg';
import { ReactComponent as BodyWeightSVG } from 'icons/vital_body_weight.svg';
import { ReactComponent as PulseSVG } from 'icons/vital_pulse.svg';
import CustomLineChart from 'components/Chart';
import { axisProps } from 'types/chart';
import { getTicks, getColor } from 'utils/charts';
import { Line } from 'recharts';
import { GetRawDataResp, MeasurementStandard, StandardRange } from 'types/measurement';
import { RefLine } from 'types/chart';
import { dotProps } from 'types/chart';
import { SelectedType, useMeasurementStandardQuery } from 'pages/Report/Report';
import { isStatusOk } from 'api/utils/apiCaller';
import { displayDateRange, formatDateToRFC3339 } from 'utils/time';
import { fetchRawData } from 'api/rawData';
import { useQuery } from '@tanstack/react-query';
import { filterRawData } from 'utils/rawData';
import { Link, matchPath, useOutletContext } from 'react-router-dom';
import classes from './StatisticsCard.module.css';
import { TooltipProps } from 'recharts';
import { ValueType, NameType } from 'recharts/types/component/DefaultTooltipContent';
import { ChartData } from 'types/chart';
import { formatDateToString } from 'utils/time';
import { ReportContext } from 'components/ReportParentRoute/ReportParentRoute';
import { DateRange, Period } from 'types/reportSettings';
import { PeriodString } from 'constants/reportSettings';
import { useLocation } from 'react-router-dom';

interface Props {
	name: MeasurementsName;
	statistics: statistic[];
	withChips?: boolean;
	ChipsElem?: React.ReactElement<ChipsProps>;
	selectedType: SelectedType;
}

// this interface is defined to clarify what data will be pass through <Link/> state to /report/:user_id/:data_type
export interface ChartStateViaLink {
	selectedType: SelectedType;
	statistics: statistic[];
	measurementStandard: MeasurementStandard;
}

export const useRawDataQuery = (dataType: MeasurementsName, dateRange: DateRange | undefined) => {
	const location = useLocation();
	const match = matchPath({ path: '/report/:user_id' }, location.pathname);
	return useQuery({
		queryKey: [dataType, dateRange?.start, dateRange?.end, match],
		queryFn: async () => {
			if (!match || !match.params.user_id) {
				throw new Error('failed to fetch raw data - no user_id');
			}
			if (!dateRange) return [] as ChartData[];
			const start = formatDateToRFC3339(dateRange.start);
			const end = formatDateToRFC3339(dateRange.end);
			console.log(start, end);
			const res = await fetchRawData(
				match.params.user_id,
				encodeURIComponent(start),
				encodeURIComponent(end),
				dataType,
			);
			const { status, payload } = res;
			if (!isStatusOk(status)) {
				throw new Error('failed to fetch raw data');
			}
			const rawDataResp = payload as GetRawDataResp;
			return filterRawData(rawDataResp._data, dataType);
		},
		initialData: [] as ChartData[],
	});
};

// when user re-click on the same chip, should not trigger a re-render
function StatsCardPropsAreEqual(prevProps: Props, currentProps: Props) {
	return (
		prevProps.selectedType.dataType === currentProps.selectedType.dataType &&
		prevProps.selectedType.testingTime === currentProps.selectedType.testingTime
	);
}

// global state: dateRange
// props: rawData (fetch at <StatisticsCard />), upperLimit & lowerLimit (fetch at <Report />)
export const StatisticsCard = memo(
	({ name, statistics, withChips = false, ChipsElem, selectedType }: Props) => {
		const { dateRange, period } = useOutletContext<ReportContext>();
		const measurementItem = measurementObject[name];
		const { data: measurementStandard } = useMeasurementStandardQuery();

		function renderStatsText(value: number, standardRange: StandardRange | undefined) {
			if (!value) {
				return <span>-</span>;
			}
			if (!standardRange) {
				return <span>{value}</span>;
			}
			const isAbnormal = value > standardRange.max || value < standardRange.min;
			return <span className={isAbnormal ? classes['warning-text'] : ''}>{value}</span>;
		}

		let mean, min, max, abnormalCount, count;
		switch (name) {
			default:
				if (
					name !== MeasurementsName.BodyWeight &&
					name !== MeasurementsName.BodyFat &&
					name !== MeasurementsName.BodyTemperature
				) {
					mean = renderStatsText(Math.round(statistics[0].mean), measurementStandard?.[name]);
					max = renderStatsText(Math.round(statistics[0].max), measurementStandard?.[name]);
					min = renderStatsText(Math.round(statistics[0].min), measurementStandard?.[name]);
				} else {
					mean = renderStatsText(+statistics[0].mean.toPrecision(3), measurementStandard?.[name]);
					max = renderStatsText(+statistics[0].max.toPrecision(3), measurementStandard?.[name]);
					min = renderStatsText(+statistics[0].min.toPrecision(3), measurementStandard?.[name]);
				}
				abnormalCount = renderStatsText(statistics[0].abnormal_count, {
					max: 0,
					min: 0,
				});
				count = statistics[0].count;
				break;
			case MeasurementsName.BloodPressure: {
				const systolic = statistics.find(
					(s) => s.name === MeasurementsName.BloodPressure + '_' + BloodPressureType.Systolic,
				);
				const diastolic = statistics.find(
					(s) => s.name === MeasurementsName.BloodPressure + '_' + BloodPressureType.Diastolic,
				);

				if (systolic && diastolic) {
					mean = (
						<span>
							{renderStatsText(
								Math.round(systolic.mean),
								measurementStandard?.['blood_pressure_systolic'],
							)}{' '}
							/{' '}
							{renderStatsText(
								Math.round(diastolic.mean),
								measurementStandard?.['blood_pressure_diastolic'],
							)}
						</span>
					);
					max = (
						<span>
							{renderStatsText(
								Math.round(systolic.max),
								measurementStandard?.['blood_pressure_systolic'],
							)}{' '}
							/{' '}
							{renderStatsText(
								Math.round(diastolic.max),
								measurementStandard?.['blood_pressure_diastolic'],
							)}
						</span>
					);
					min = (
						<span>
							{renderStatsText(
								Math.round(systolic.min),
								measurementStandard?.['blood_pressure_systolic'],
							)}{' '}
							/{' '}
							{renderStatsText(
								Math.round(diastolic.min),
								measurementStandard?.['blood_pressure_diastolic'],
							)}
						</span>
					);
					abnormalCount = renderStatsText(
						Math.max(systolic.abnormal_count, diastolic.abnormal_count),
						{ max: 0, min: 0 },
					);
					count = systolic.count;
				}
				break;
			}
			case MeasurementsName.BloodSugar: {
				const bloodSugarStatsByTestingTime = statistics.find(
					(s) => s.name === MeasurementsName.BloodSugar + '_' + selectedType.testingTime,
				);

				// for testing time equal 'sum', the abnormal count should be the sum of all others testing time
				let abnormalCountSum = 0;
				statistics.forEach((s) => {
					if (s.name.includes(MeasurementsName.BloodSugar)) {
						abnormalCountSum += s.abnormal_count;
					}
				});

				let bloodSugarStandard;
				switch (selectedType.testingTime) {
					case BloodSugarTestingTime.Premeal:
						bloodSugarStandard = measurementStandard?.['blood_sugar_pre_meal'];
						break;
					case BloodSugarTestingTime.Postmeal:
						bloodSugarStandard = measurementStandard?.['blood_sugar_pre_meal'];
						break;
					case BloodSugarTestingTime.Anytime:
						bloodSugarStandard = measurementStandard?.['blood_sugar_pre_meal'];
						break;
					default:
						bloodSugarStandard = undefined;
				}

				if (bloodSugarStatsByTestingTime) {
					mean = renderStatsText(Math.round(bloodSugarStatsByTestingTime.mean), bloodSugarStandard);
					max = renderStatsText(Math.round(bloodSugarStatsByTestingTime.max), bloodSugarStandard);
					min = renderStatsText(Math.round(bloodSugarStatsByTestingTime.min), bloodSugarStandard);
					const abnormalCountByTestingTime =
						selectedType.testingTime === BloodSugarTestingTimeSum.name
							? abnormalCountSum
							: bloodSugarStatsByTestingTime.abnormal_count;
					abnormalCount = renderStatsText(abnormalCountByTestingTime, { max: 0, min: 0 });
					count = bloodSugarStatsByTestingTime.count;
				}
				break;
			}
		}

		const {
			data: rawData,
			isLoading: isRawDataLoading,
			isError: isRawDataError,
			isSuccess: isRawDataSuccess,
		} = useRawDataQuery(name, dateRange);

		function getVitalIcon(name: string): React.ReactElement {
			switch (name) {
				case MeasurementsName.BloodOxygen:
					return <BloodOxygenSVG />;
				case MeasurementsName.BloodPressure:
					return <BloodPressureSVG />;
				case MeasurementsName.BloodSugar:
					return <BloodSugarSVG />;
				case MeasurementsName.BodyFat:
					return <BodyFatSVG />;
				case MeasurementsName.BodyTemperature:
					return <BodyTempSVG />;
				case MeasurementsName.BodyWeight:
					return <BodyWeightSVG />;
				case MeasurementsName.PulseRate:
					return <PulseSVG />;
				default:
					return <div>loading...</div>;
			}
		}

		function getCustomDot(dotProps: dotProps) {
			const { cx, cy, payload } = dotProps;
			const color = getColor(name, payload.type as BloodPressureType | BloodSugarTestingTime);
			return (
				<svg x={cx - 3} y={cy - 3} width={6} height={6} fill={color} key={`${cx}-${cy}`}>
					<circle cx={3} cy={3} r={3} />
				</svg>
			);
		}

		function getMultiSeriesLineElement(dataType: MeasurementsName) {
			switch (dataType) {
				case MeasurementsName.BloodPressure:
					return (
						<>
							<Line
								dataKey='value'
								stroke='#886EC4'
								data={rawData.filter((d) => d.type === BloodPressureType.Systolic)}
								name='systolic'
								key='systolic'
								activeDot={{ r: 6 }}
								dot={getCustomDot}
							/>
							<Line
								dataKey='value'
								stroke='#00B0B8'
								data={rawData.filter((d) => d.type === BloodPressureType.Diastolic)}
								name='diastolic'
								key='diastolic'
								activeDot={{ r: 6 }}
								dot={getCustomDot}
							/>
						</>
					);
				case MeasurementsName.BloodSugar:
					return (
						<>
							{selectedType.testingTime === BloodSugarTestingTimeSum.name && (
								<Line
									dataKey='value'
									stroke='#9E9E9E'
									// should be all data
									data={rawData}
									name='sum'
									key='sum'
									activeDot={{ r: 6 }}
									dot={getCustomDot}
								/>
							)}
							{selectedType.testingTime === BloodSugarTestingTime.Premeal && (
								<Line
									dataKey='value'
									stroke={getColor(dataType, BloodSugarTestingTime.Premeal)}
									data={rawData.filter((d) => d.type === BloodSugarTestingTime.Premeal)}
									name='pre-meal'
									key='pre-meal'
									activeDot={{ r: 6 }}
									dot={getCustomDot}
								/>
							)}
							{selectedType.testingTime === BloodSugarTestingTime.Postmeal && (
								<Line
									dataKey='value'
									stroke={getColor(dataType, BloodSugarTestingTime.Postmeal)}
									data={rawData.filter((d) => d.type === BloodSugarTestingTime.Postmeal)}
									name='post-meal'
									key='post-meal'
									activeDot={{ r: 6 }}
									dot={getCustomDot}
								/>
							)}
							{selectedType.testingTime === BloodSugarTestingTime.Anytime && (
								<Line
									dataKey='value'
									stroke={getColor(dataType, BloodSugarTestingTime.Anytime)}
									data={rawData.filter((d) => d.type === BloodSugarTestingTime.Anytime)}
									name='anytime'
									key='anytime'
									activeDot={{ r: 6 }}
									dot={getCustomDot}
								/>
							)}
						</>
					);
				default:
					return null;
			}
		}

		function getCustomLegendPayload(dataType: MeasurementsName) {
			switch (dataType) {
				case MeasurementsName.BloodPressure:
					return [
						{
							value: BloodPressureTypeLabel.Systolic,
							color: getColor(dataType, BloodPressureType.Systolic),
						},
						{
							value: BloodPressureTypeLabel.Diastolic,
							color: getColor(dataType, BloodPressureType.Diastolic),
						},
					];
				case MeasurementsName.BloodSugar:
					return [
						{
							value: BloodSugarTestingTimeLabel.Premeal,
							color: getColor(dataType, BloodSugarTestingTime.Premeal),
						},
						{
							value: BloodSugarTestingTimeLabel.Postmeal,
							color: getColor(dataType, BloodSugarTestingTime.Postmeal),
						},
						{
							value: BloodSugarTestingTimeLabel.Anytime,
							color: getColor(dataType, BloodSugarTestingTime.Anytime),
						},
					];
				default:
					return undefined;
			}
		}

		function getReferenceLines(
			dataType: MeasurementsName,
			standards: MeasurementStandard | undefined,
		): RefLine[] {
			const referenceLines = [] as RefLine[];

			if (!standards) return referenceLines;

			switch (dataType) {
				case MeasurementsName.BloodPressure:
					referenceLines.push(
						{ value: standards.blood_pressure_systolic.max, color: '#886EC4' },
						{ value: standards.blood_pressure_systolic.min, color: '#886EC4' },
						{ value: standards.blood_pressure_diastolic.max, color: '#00B0B8' },
						{ value: standards.blood_pressure_diastolic.min, color: '#00B0B8' },
					);
					break;
				case MeasurementsName.BloodSugar:
					if (selectedType.testingTime === BloodSugarTestingTime.Anytime) {
						referenceLines.push(
							{ value: standards.blood_sugar_anytime.max, color: '#ED6C02' },
							{ value: standards.blood_sugar_anytime.min, color: '#ED6C02' },
						);
					}
					if (selectedType.testingTime === BloodSugarTestingTime.Premeal) {
						referenceLines.push(
							{ value: standards.blood_sugar_pre_meal.max, color: '#ED6C02' },
							{ value: standards.blood_sugar_pre_meal.min, color: '#ED6C02' },
						);
					}
					if (selectedType.testingTime === BloodSugarTestingTime.Postmeal) {
						referenceLines.push(
							{ value: standards.blood_sugar_post_meal.max, color: '#ED6C02' },
							{ value: standards.blood_sugar_post_meal.min, color: '#ED6C02' },
						);
					}
					break;
				default:
					referenceLines.push(
						{ value: standards[dataType].max, color: '#ED6C02' },
						{ value: standards[dataType].min, color: '#ED6C02' },
					);
					break;
			}
			return referenceLines;
		}

		const CustomTooltips = ({ active, payload }: TooltipProps<ValueType, NameType>) => {
			if (active && payload && payload.length) {
				const { date, value, type } = payload[0].payload as ChartData;
				const displayDate = formatDateToString(date);
				let displayValue;
				displayValue = value;
				if (name === MeasurementsName.BloodPressure) {
					const systolic = rawData.find(
						(d) => d.date.getTime() === date.getTime() && d.type === BloodPressureType.Systolic,
					);
					const diastolic = rawData.find(
						(d) => d.date.getTime() === date.getTime() && d.type === BloodPressureType.Diastolic,
					);

					if (systolic && diastolic) {
						displayValue = (
							<>
								<Typography>{`收縮壓 ${systolic.value}`}</Typography>
								<Typography>{`舒張壓 ${diastolic.value}`}</Typography>
							</>
						);
					}
				}
				if (name === MeasurementsName.BloodSugar) {
					if (type) {
						displayValue = `${BloodSugarTestTimeObj[type as BloodSugarTestingTime]} ${value}`;
					}
				}
				return (
					<div
						style={{
							background: '#fff',
							padding: '8px',
							borderRadius: '8px',
							boxShadow:
								'0px 2px 4px -1px rgba(0, 0, 0, 0.20), 0px 1px 10px 0px rgba(0, 0, 0, 0.12), 0px 4px 5px 0px rgba(0, 0, 0, 0.14)',
						}}
					>
						<p style={{ fontSize: 12, color: '#616161' }}>{displayDate}</p>
						<div style={{ marginTop: '4px', fontSize: 18, color: '#212121', textAlign: 'center' }}>
							{displayValue}
						</div>
					</div>
				);
			}
			return null;
		};

		function getTicksRange(period: Period, dateRange: DateRange) {
			return { ticksStart: new Date(dateRange.start), ticksEnd: new Date(dateRange.end) };
		}

		if (!dateRange || !period) {
			return (
				<Card sx={{ boxShadow: 0, borderRadius: '4px', marginBottom: '16px' }}>
					<span>fail to render chart</span>
				</Card>
			);
		}

		const { ticksStart, ticksEnd } = getTicksRange(period, dateRange);

		const xAxisProps: axisProps = {
			dataKey: 'date',
			// NOTE: for ticks generation
			// 週報：start_time ~ start_time + 7 days (10/29 00:00 ~ 11/05 00:00)
			// 雙週報：start_time ~ start_time + 14 days (10/29 00:00 ~ 11/12 00:00)
			// 月報：start_time ~ start_time + 4 * 7 days (11/01 00:00 ~ 11/29 00:00)
			// 季報：start_time ~ start_time + 3 months (10/1 00:00 ~ 1/1 00:00)
			// TODO: get start & end from global state
			ticks: getTicks(ticksStart, ticksEnd, period),
			tickFormatter:
				period === PeriodString.QUARTER
					? (tick) => `${new Date(tick).getMonth() + 1}/${new Date(tick).getDate()}`
					: (tick) => `${new Date(tick).getDate()}`,
			type: 'number',
			domain:
				period === PeriodString.WEEK || period === PeriodString.BIWEEK
					? ['dataMin', 'dataMax']
					: ['auto', 'auto'],
			allowDataOverflow: true,
		};

		// CASE: if max temp. is 36.7 and min temp. is 35.5, then max y-axis is 39, and min y-axis is 33
		const yAxisLowerLimit = (dataMin: number) => {
			const result =
				Math.floor((dataMin - intervalByDataType[name] * 1) / intervalByDataType[name]) *
				intervalByDataType[name];

			if (result <= 0) return 0;
			return result;
		};

		const yAxisUpperLimit = (dataMax: number) =>
			Math.ceil((dataMax + intervalByDataType[name] * 1) / intervalByDataType[name]) *
			intervalByDataType[name];

		const yAxisProps: axisProps = {
			dataKey: 'value',
			// TODO: to be clarify
			// domain: [() => 70, () => 120],
			domain: [yAxisLowerLimit, yAxisUpperLimit],
		};

		const yReference = getReferenceLines(name, measurementStandard);
		const customLegendPayload = getCustomLegendPayload(name);
		const multipleSeriesLineElement = getMultiSeriesLineElement(name);
		const isMultiSeries = statistics.length > 1;

		return (
			<Card sx={{ boxShadow: 0, borderRadius: '4px', marginBottom: '16px' }}>
				<Link
					to={`${name}`}
					style={{ textDecoration: 'none', all: 'initial' }}
					// send information required for plotting the chart in /report/:user_id/:data_type
					// NOTE: please be aware that, data will not be available if user directly access /report/:user_id/:data_type
					// But since this application is currently used as webview, direct access to /report/:user_id/:data_type is not possible
					state={
						{
							selectedType: selectedType,
							measurementStandard: measurementStandard,
							statistics: statistics,
						} as ChartStateViaLink
					}
				>
					<CardHeader
						sx={{
							cursor: 'pointer',
							fontSize: '22px',
							lineHeight: '28px',
							fontWeight: '400',
							color: '#616161',
							'& .MuiCardHeader-action': { alignSelf: 'center' },
						}}
						title={`${measurementItem.label} ${measurementItem.unit}`}
						subheader={displayDateRange(dateRange.start, dateRange.end)}
						subheaderTypographyProps={{ color: '#616161' }}
						avatar={getVitalIcon(name)}
						action={<KeyboardArrowRightIcon />}
						titleTypographyProps={{ fontSize: '20px' }}
					></CardHeader>
				</Link>
				<CardContent sx={{ paddingTop: 0 }}>
					{withChips && ChipsElem}
					<Box sx={{ display: 'flex', flexDirection: 'column', marginTop: '12px' }}>
						<Box sx={{ borderBottom: '1px solid #E0E0E0' }}>
							<Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
								<Typography className={classes['sub-header']} sx={{ fontSize: '20px' }}>
									平均值
								</Typography>
								<Typography className={classes['sub-header']} sx={{ fontSize: '20px' }}>
									{mean}
								</Typography>
							</Box>
							<Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
								<Typography className={classes['paragraph']} sx={{ fontSize: '16px' }}>
									最大值
								</Typography>
								<Typography className={classes['paragraph']} sx={{ fontSize: '16px' }}>
									{max}
								</Typography>
							</Box>
							<Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
								<Typography className={classes['paragraph']} sx={{ fontSize: '16px' }}>
									最小值
								</Typography>
								<Typography className={classes['paragraph']} sx={{ fontSize: '16px' }}>
									{min}
								</Typography>
							</Box>
						</Box>

						<Box sx={{ borderBottom: '1px solid #E0E0E0', marginTop: '8px' }}>
							<Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
								<Typography className={classes['sub-header']} sx={{ fontSize: '20px' }}>
									異常次數
								</Typography>
								<Typography className={classes['sub-header']} sx={{ fontSize: '20px' }}>
									{abnormalCount}
								</Typography>
							</Box>
							<Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
								<Typography className={classes['paragraph']} sx={{ fontSize: '16px' }}>
									測量次數
								</Typography>
								<Typography className={classes['paragraph']} sx={{ fontSize: '16px' }}>
									{count}
								</Typography>
							</Box>
						</Box>
					</Box>
					{isRawDataLoading && <span>Loading...</span>}
					{isRawDataError && <span>Failed to show chart</span>}
					{isRawDataSuccess && (
						<CustomLineChart
							data={!isMultiSeries ? rawData : undefined}
							xAxisProps={xAxisProps}
							yAxisProps={yAxisProps}
							dataKey='value'
							strokeColor='#00B0B8'
							withReferenceLine={true}
							reference={{
								isXLimit: false,
								isYLimit: true,
								yLines: yReference,
							}}
							CustomTooltip={CustomTooltips}
							withLegend={isMultiSeries}
							legendProps={{ payload: customLegendPayload }}
							isMultiSeries={isMultiSeries}
							LineElements={multipleSeriesLineElement}
						/>
					)}
				</CardContent>
			</Card>
		);
	},
	StatsCardPropsAreEqual,
);

StatisticsCard.displayName = 'StatisticsCard';
