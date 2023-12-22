import { BloodSugarTestingTime } from 'constants/measurements';

export type measurementItem = {
	name: string;
	label: string;
	unit?: string;
};

type defaultMeasurement = {
	value: number;
};

type bloodPressure = {
	diastolic: number;
	systolic: number;
};

type bloodSugar = defaultMeasurement & {
	testing_time: BloodSugarTestingTime;
};

export type MeasurementDocument = {
	blood_oxygen: defaultMeasurement;
	blood_pressure: bloodPressure;
	blood_sugar: bloodSugar;
	body_fat: defaultMeasurement;
	body_temperature: defaultMeasurement;
	body_weight: defaultMeasurement;
	pulse_rate: defaultMeasurement;
	measurement_time: string;
};

export type GetRawDataResp = {
	_data: MeasurementDocument[];
	_id: string;
};

export type StandardRange = {
	max: number;
	min: number;
	unit?: string;
};

export type MeasurementStandard = {
	blood_oxygen: StandardRange;
	blood_pressure_systolic: StandardRange;
	blood_pressure_diastolic: StandardRange;
	blood_sugar_pre_meal: StandardRange;
	blood_sugar_post_meal: StandardRange;
	blood_sugar_anytime: StandardRange;
	body_fat: StandardRange;
	body_temperature: StandardRange;
	body_weight: StandardRange;
	pulse_rate: StandardRange;
};

export type GetUserStandardResp = {
	_data: MeasurementStandard;
	_id: string; // this is the user_id
};
