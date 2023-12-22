import React from 'react';
import { ChartData } from 'types/chart';
import { formatDateToString } from 'utils/time';
import classes from './RawDataTable.module.css';
import { Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import { DataTypeParams } from 'pages/Report/RawData';
import { StandardRange } from 'types/measurement';
import {
	BloodPressureType,
	BloodSugarTestTimeObj,
	BloodSugarTestingTime,
	MeasurementsName,
} from 'constants/measurements';
import { useMeasurementStandardQuery } from 'pages/Report/Report';

interface Props {
	rawData: ChartData[];
	dataLabel: string;
	dataUnit: string;
	chartRef?: React.MutableRefObject<any>;
}

export const RawDataTable = ({ rawData, dataLabel, dataUnit, chartRef }: Props) => {
	const { data_type: dataType } = useParams<keyof DataTypeParams>() as DataTypeParams;
	const { data: measurementStandard } = useMeasurementStandardQuery();

	function renderRawData(value: number, isAbnormal: boolean) {
		return <span className={isAbnormal ? classes['warning-text'] : ''}>{value}</span>;
	}

	function isAbnormal(value: number, standardRange: StandardRange | undefined) {
		if (!standardRange) return false;
		return value > standardRange.max || value < standardRange.min;
	}

	function getStandard(criteria: BloodPressureType | BloodSugarTestingTime | undefined) {
		if (
			!criteria &&
			dataType !== MeasurementsName.BloodPressure &&
			dataType !== MeasurementsName.BloodSugar
		) {
			return measurementStandard?.[dataType];
		}
		if (dataType === MeasurementsName.BloodPressure && criteria) {
			if (criteria === BloodPressureType.Systolic) {
				return measurementStandard?.['blood_pressure_systolic'];
			} else {
				return measurementStandard?.['blood_pressure_diastolic'];
			}
		}
		if (dataType === MeasurementsName.BloodSugar && criteria) {
			if (criteria === BloodSugarTestingTime.Anytime) {
				return measurementStandard?.['blood_sugar_anytime'];
			} else if (criteria === BloodSugarTestingTime.Premeal) {
				return measurementStandard?.['blood_sugar_pre_meal'];
			} else {
				return measurementStandard?.['blood_sugar_post_meal'];
			}
		} else return undefined;
	}

	// NOTE: Recharts did not provide api to programmatically show/hide tooltips, therefore we have to directly manipulate chart state.
	// parameter 'index' is the index of rawData
	function activeTooltips(index: number) {
		if (!chartRef?.current) return;
		let targetDataPoint = index;

		// index for bloodPressure is 0, 2, 4, 6...
		// need to map to 1, 2, 3, 4, 5...
		if (dataType === MeasurementsName.BloodPressure) targetDataPoint = index - index / 2;

		// Reference: https://github.com/recharts/recharts/issues/1231
		const activeItem =
			chartRef.current.state.formattedGraphicalItems?.[0].props.points[targetDataPoint];
		if (!activeItem) return;

		// rawData for blood pressure is [8/30 systolic, 8/30 diastolic, 8/29 systolic, 8/29 diastolic...], therefore index has to times 2
		const rawDataIndex =
			dataType === MeasurementsName.BloodPressure ? targetDataPoint * 2 : targetDataPoint;
		chartRef.current.setState(
			{
				activeTooltipIndex: targetDataPoint,
				activeLabel: rawData[rawDataIndex].date,
			},
			() => {
				chartRef.current.handleItemMouseEnter({
					tooltipPayload: [activeItem],
					tooltipPosition: {
						x: activeItem.x,
						y: activeItem.y,
					},
				});
			},
		);
	}

	const TableWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
		return (
			<div className={classes['table-container']}>
				<table className={classes['table']}>
					<thead>
						<tr>
							<th>
								<Typography>{`${dataLabel} ${dataUnit}`}</Typography>
							</th>
							<th>
								<Typography>時間</Typography>
							</th>
						</tr>
					</thead>
					<tbody>{children}</tbody>
				</table>
			</div>
		);
	};

	if (dataType === MeasurementsName.BloodPressure) {
		return (
			<TableWrapper>
				{rawData.map((r, i) => {
					if ((i + 1) % 2 === 0) return null;
					return (
						<tr key={`${dataType}-row-${i}`} onClick={() => activeTooltips(i)}>
							<td>
								<Typography sx={{ display: 'inline-block' }}>
									{renderRawData(r.value, isAbnormal(r.value, getStandard(r?.type)))}
								</Typography>
								{' / '}
								<Typography sx={{ display: 'inline-block' }}>
									{renderRawData(
										rawData[i + 1].value,
										isAbnormal(rawData[i + 1].value, getStandard(rawData[i + 1]?.type)),
									)}
								</Typography>
							</td>
							<td>
								<Typography>{formatDateToString(r.date)}</Typography>
							</td>
						</tr>
					);
				})}
			</TableWrapper>
		);
	}

	if (dataType === MeasurementsName.BloodSugar) {
		return (
			<TableWrapper>
				{rawData.map((r, i) => {
					return (
						<tr key={`${dataType}-row-${i}`} onClick={() => activeTooltips(i)}>
							<td>
								{r.type && (
									<Typography
										sx={{
											display: 'inline-block',
											marginRight: '8px',
											color: isAbnormal(r.value, getStandard(r?.type)) ? '#ED6C02' : '#212121',
										}}
									>
										{BloodSugarTestTimeObj[r.type as BloodSugarTestingTime]}
									</Typography>
								)}
								<Typography sx={{ display: 'inline-block', color: '#212121' }}>
									{renderRawData(r.value, isAbnormal(r.value, getStandard(r?.type)))}
								</Typography>
							</td>
							<td>
								<Typography>{formatDateToString(r.date)}</Typography>
							</td>
						</tr>
					);
				})}
			</TableWrapper>
		);
	}

	return (
		<TableWrapper>
			{rawData.map((r, i) => (
				<tr key={`${dataType}-row-${i}`} onClick={() => activeTooltips(i)}>
					<td>
						<Typography>
							{renderRawData(r.value, isAbnormal(r.value, getStandard(r?.type)))}
						</Typography>
					</td>
					<td>
						<Typography>{formatDateToString(r.date)}</Typography>
					</td>
				</tr>
			))}
		</TableWrapper>
	);
};
