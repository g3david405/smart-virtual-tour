import {
	BloodPressureType,
	BloodPressureTypeLabel,
	BloodSugarTestingTime,
	BloodSugarTestingTimeLabel,
} from 'constants/measurements';
import { AxisDomain } from 'recharts/types/util/types';

export type ChartData = {
	date: Date;
	value: number;
	// for rendering blood sugar sum graph
	type?: BloodPressureType | BloodSugarTestingTime;
};

export type dotProps = {
	cx: number;
	cy: number;
	payload: Record<string, string>;
};

export type axisProps = {
	dataKey: string;
	ticks?: (string | number)[];
	tickFormatter?: (value: number) => string;
	type?: 'category' | 'number';
	domain?: AxisDomain;
	allowDataOverflow?: boolean;
};

export type RefLine = {
	value: number;
	color: string;
};

export type referenceLine = {
	isXLimit: boolean;
	isYLimit: boolean;
	xLines?: RefLine[];
	yLines?: RefLine[];
};

export type CustomLegendPayload =
	| {
			value: BloodPressureTypeLabel;
			color: string;
	  }[]
	| {
			value: BloodSugarTestingTimeLabel;
			color: string;
	  }[]
	| undefined;
