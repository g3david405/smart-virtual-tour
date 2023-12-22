import React, { forwardRef } from 'react';
import {
	CartesianGrid,
	Legend,
	Line,
	LineChart,
	ReferenceLine,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts';
import { ContentType } from 'recharts/types/component/Tooltip';
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';
import { Props } from 'recharts/types/component/DefaultLegendContent';
import { axisProps, dotProps, referenceLine } from 'types/chart';

interface LineChartProps {
	data?: unknown[];
	xAxisProps: axisProps;
	yAxisProps: axisProps;
	dataKey?: string;
	LineElements?: React.ReactNode; // this is for multi series line chart
	strokeColor?: string;
	withReferenceLine?: boolean;
	reference?: referenceLine;
	withLegend?: boolean;
	legendProps?: Props;
	CustomTooltip?: ContentType<ValueType, NameType>;
	isMultiSeries?: boolean; // default to be false
}

function getDefaultDot(dotProps: dotProps) {
	const { cx, cy } = dotProps;
	const color = '#00B0B8';
	return (
		<svg x={cx - 3} y={cy - 3} width={6} height={6} fill={color} key={`${cx}-${cy}`}>
			<circle cx={3} cy={3} r={3} />
		</svg>
	);
}

export const CustomLineChart = forwardRef<any, LineChartProps>(
	(
		{
			data,
			xAxisProps,
			yAxisProps,
			dataKey,
			strokeColor,
			withReferenceLine,
			reference,
			withLegend,
			legendProps,
			CustomTooltip,
			LineElements,
			isMultiSeries = false,
		}: LineChartProps,
		ref,
	) => {
		console.log('render chart');
		console.log('data', data);
		const CommonElement = (
			<>
				<CartesianGrid strokeDasharray='0.5' />
				<XAxis
					axisLine={false}
					dataKey={xAxisProps.dataKey}
					tickFormatter={xAxisProps.tickFormatter}
					ticks={xAxisProps.ticks}
					tickSize={0}
					tick={{
						fontFamily: 'Roboto, "Noto Sans TC", sans-serif',
						fontSize: '12px',
						fontWeight: '400',
						color: '#616161',
					}}
					domain={xAxisProps.domain}
					allowDataOverflow={xAxisProps.allowDataOverflow}
					type={xAxisProps.type}
					allowDuplicatedCategory={false}
					tickMargin={15}
					interval={0}
				/>
				<YAxis
					axisLine={false}
					dataKey={yAxisProps.dataKey}
					tickFormatter={yAxisProps.tickFormatter}
					ticks={yAxisProps.ticks}
					tickCount={3}
					tickSize={0}
					tick={{
						fontFamily: 'Roboto, "Noto Sans TC", sans-serif',
						fontSize: '12px',
						fontWeight: '400',
						color: '#616161',
					}}
					domain={yAxisProps.domain}
					allowDataOverflow={yAxisProps.allowDataOverflow}
					type={yAxisProps.type}
					orientation={'right'}
					allowDuplicatedCategory={false}
					tickMargin={15}
				/>
				<Tooltip content={CustomTooltip} />
				{withLegend && (
					<Legend
						iconType='circle'
						payload={legendProps?.payload}
						// text color of legend
						formatter={(value) => <span style={{ color: '#212121' }}>{value}</span>}
						align='right'
						verticalAlign='top'
						wrapperStyle={{
							top: -23,
							right: -10,
							fontFamily: 'Roboto, "Noto Sans TC", sans-serif',
							fontSize: '14px',
							color: '#212121',
						}}
						// content={renderLegend}
					/>
				)}
				{withReferenceLine && reference?.isXLimit && (
					<>
						{reference.xLines?.map((x, i) => (
							<ReferenceLine
								x={x.value}
								stroke={x.color}
								strokeDasharray='3 3'
								key={`reference-${i}`}
							/>
						))}
					</>
				)}
				{withReferenceLine && reference?.isYLimit && (
					<>
						{reference.yLines?.map((y, i) => (
							<ReferenceLine
								y={y.value}
								stroke={y.color}
								strokeDasharray='3 3'
								key={`reference-${i}`}
							/>
						))}
					</>
				)}
			</>
		);

		if (isMultiSeries)
			return (
				<ResponsiveContainer width={'100%'} aspect={2} style={{ marginTop: '35px' }}>
					{/* set margin on left and right to center the line chart  */}
					<LineChart margin={{ top: 0, right: -18, left: 21, bottom: 0 }} ref={ref}>
						{CommonElement}
						{LineElements}
					</LineChart>
				</ResponsiveContainer>
			);
		return (
			<ResponsiveContainer width={'100%'} aspect={2} style={{ marginTop: '35px' }}>
				{/* set margin on left and right to center the line chart  */}
				<LineChart data={data} margin={{ top: 0, right: -18, left: 21, bottom: 0 }} ref={ref}>
					{CommonElement}
					<Line
						type='linear'
						dataKey={dataKey}
						stroke={strokeColor}
						activeDot={{ r: 6 }}
						dot={getDefaultDot}
					/>
				</LineChart>
			</ResponsiveContainer>
		);
	},
);

CustomLineChart.displayName = 'CustomLineChart';
