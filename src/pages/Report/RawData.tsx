import CardHeader from '@mui/material/CardHeader';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import React, { useEffect, useRef } from 'react';
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
import { useLocation, useOutletContext, useParams, useRouteLoaderData } from 'react-router-dom';
import Container from '@mui/material/Container';
import { Link } from 'react-router-dom';
import { ChartStateViaLink, useRawDataQuery } from 'components/StatisticsCard/StatisticsCard';
import { CustomLineChart } from 'components/Chart/LineChart';
import { getColor, getTicks } from 'utils/charts';
import Card from '@mui/material/Card';
import { ChartData, RefLine, axisProps } from 'types/chart';
import { Line, TooltipProps } from 'recharts';
import { MeasurementStandard } from 'types/measurement';
import { dotProps } from 'types/chart';
import { RawDataTable } from 'components/RawDataTable';
import { ValueType, NameType } from 'recharts/types/component/DefaultTooltipContent';
import { displayDateRange, formatDateToString } from 'utils/time';
import { reportLoader } from 'router';
import { LoaderData } from 'types/router';
import { ReportContext } from 'components/ReportParentRoute/ReportParentRoute';
import { getDateRange } from 'utils/reportSettings';
import { PeriodString } from 'constants/reportSettings';
import { Period, DateRange } from 'types/reportSettings';
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs';

export interface DataTypeParams {
	data_type: MeasurementsName;
}

export const RawData = () => {
	const targetUser = useRouteLoaderData('report') as LoaderData<typeof reportLoader>;
	const { data_type: dataType } = useParams<keyof DataTypeParams>() as DataTypeParams;
	const { dateRange, period } = useOutletContext<ReportContext>();
	const { state, pathname } = useLocation();
	const stateViaLink = state as ChartStateViaLink;
	const measurementItem = measurementObject[dataType];
	const { data: rawData } = useRawDataQuery(dataType, dateRange);
	const [title, setTitle] = React.useState<string>(
		`${targetUser.display_name}的${measurementItem.label}`,
	);

	const chartRef = useRef<any>();

	useEffect(() => {
		const fetchTargetUser = async () => {
			const loadedTargetUser = (await useRouteLoaderData('report')) as LoaderData<
				typeof reportLoader
			>;
			// Update the title with the loaded user data
			// Assuming loadedTargetUser has a display_name property
			console.log('loadedTargetUser', loadedTargetUser);
			setTitle(`${loadedTargetUser.display_name}的${measurementItem.label}`);
		};

		fetchTargetUser();
		window.scrollTo(0, 0);
	}, [pathname, setTitle, measurementItem.label]);

	useEffect(() => {
		window.scrollTo(0, 0);
	}, [pathname]);

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
			Math.floor((dataMin - intervalByDataType[dataType] * 1) / intervalByDataType[dataType]) *
			intervalByDataType[dataType];

		if (result <= 0) return 0;
		return result;
	};

	const yAxisUpperLimit = (dataMax: number) =>
		Math.ceil((dataMax + intervalByDataType[dataType] * 1) / intervalByDataType[dataType]) *
		intervalByDataType[dataType];

	const yAxisProps: axisProps = {
		dataKey: 'value',
		// TODO: to be clarify
		// domain: [() => 70, () => 120],
		domain: [yAxisLowerLimit, yAxisUpperLimit],
	};

	function getCustomDot(dotProps: dotProps) {
		const { cx, cy, payload } = dotProps;
		const color = getColor(dataType, payload.type as BloodPressureType | BloodSugarTestingTime);
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
						{stateViaLink.selectedType.testingTime === BloodSugarTestingTimeSum.name && (
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
						{stateViaLink.selectedType.testingTime === BloodSugarTestingTime.Premeal && (
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
						{stateViaLink.selectedType.testingTime === BloodSugarTestingTime.Postmeal && (
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
						{stateViaLink.selectedType.testingTime === BloodSugarTestingTime.Anytime && (
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
				if (stateViaLink.selectedType.testingTime === BloodSugarTestingTime.Anytime) {
					referenceLines.push(
						{ value: standards.blood_sugar_anytime.max, color: '#ED6C02' },
						{ value: standards.blood_sugar_anytime.min, color: '#ED6C02' },
					);
				}
				if (stateViaLink.selectedType.testingTime === BloodSugarTestingTime.Premeal) {
					referenceLines.push(
						{ value: standards.blood_sugar_pre_meal.max, color: '#ED6C02' },
						{ value: standards.blood_sugar_pre_meal.min, color: '#ED6C02' },
					);
				}
				if (stateViaLink.selectedType.testingTime === BloodSugarTestingTime.Postmeal) {
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
			if (dataType === MeasurementsName.BloodPressure) {
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
			if (dataType === MeasurementsName.BloodSugar) {
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

	const yReference = getReferenceLines(dataType, stateViaLink.measurementStandard);
	const customLegendPayload = getCustomLegendPayload(dataType);
	const multipleSeriesLineElement = getMultiSeriesLineElement(dataType);
	const isMultiSeries = stateViaLink.statistics.length > 1;

	const { start, end } = dateRange ?? getDateRange(period ?? PeriodString.WEEK, dayjs().toDate());

	return (
		<Container
			sx={{
				background: '#EEEEEE',
				height: '100vh',
				overflow: 'hidden',
				display: 'flex',
				flexDirection: 'column',
			}}
		>
			<Link to='..' relative='path' style={{ textDecoration: 'none', all: 'initial' }}>
				<CardHeader
					sx={{ cursor: 'pointer' }}
					title={`${title}`}
					subheader={displayDateRange(start, end)}
					avatar={<ArrowBackIcon />}
					titleTypographyProps={{
						marginBottom: '8px',

						fontSize: '20px',
						lineHeight: '22px',
						fontWeight: '400',
						color: '#212121',
					}}
					subheaderTypographyProps={{
						fontSize: '16px',
						lineHeight: '22px',
						fontWeight: '400',
						color: '#616161',
					}}
				></CardHeader>
			</Link>
			<Card
				sx={{
					boxShadow: 0,
					borderRadius: '4px',
					marginBottom: '16px',
					padding: '0 12px 12px',
					flexShrink: 0,
				}}
			>
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
					ref={chartRef}
				/>
			</Card>
			<RawDataTable
				rawData={rawData.filter((d) => {
					if (dataType === MeasurementsName.BloodSugar) {
						if (stateViaLink.selectedType.testingTime === BloodSugarTestingTimeSum.name)
							return true;
						return d.type === stateViaLink.selectedType.testingTime;
					}
					return true;
				})}
				dataLabel={measurementItem.label}
				dataUnit={measurementItem.unit}
				chartRef={chartRef}
			/>
		</Container>
	);
};
