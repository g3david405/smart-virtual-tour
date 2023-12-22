export enum MeasurementsName {
	BloodSugar = 'blood_sugar',
	BloodPressure = 'blood_pressure',
	BloodOxygen = 'blood_oxygen',
	BodyTemperature = 'body_temperature',
	PulseRate = 'pulse_rate',
	BodyFat = 'body_fat',
	BodyWeight = 'body_weight',
}

export enum MeasurementsLabel {
	BloodSugar = '血糖',
	BloodPressure = '血壓',
	BodyTemperature = '體溫',
	BloodOxygen = '血氧',
	PulseRate = '心率',
	BodyFat = '體脂',
	BodyWeight = '體重',
}

export enum MeasurementsUnit {
	BloodSugar = 'mg/dL',
	BloodPressure = 'mmHg',
	BodyTemperature = '˚ C',
	BloodOxygen = '%',
	PulseRate = '/min',
	BodyFat = '%',
	BodyWeight = 'kg',
}

export enum BloodPressureType {
	Systolic = 'systolic',
	Diastolic = 'diastolic',
}

export enum BloodPressureTypeLabel {
	Systolic = '收縮壓',
	Diastolic = '舒張壓',
}

export enum BloodSugarTestingTimeLabel {
	Anytime = '立即',
	Premeal = '飯前',
	Postmeal = '飯後',
}

export enum BloodSugarTestingTime {
	Anytime = 'anytime',
	Premeal = 'pre-meal',
	Postmeal = 'post-meal',
}

export const BloodSugarTestTimeObj = {
	[BloodSugarTestingTime.Anytime]: BloodSugarTestingTimeLabel.Anytime,
	[BloodSugarTestingTime.Premeal]: BloodSugarTestingTimeLabel.Premeal,
	[BloodSugarTestingTime.Postmeal]: BloodSugarTestingTimeLabel.Postmeal,
};

export enum MeasurementAll {
	name = 'all',
	label = '全部',
}

export enum BloodSugarTestingTimeSum {
	name = 'sum',
	label = '全部',
}

type MeasurementInfo = {
	label: MeasurementsLabel;
	unit: MeasurementsUnit;
};

export const measurementObject: { [key in MeasurementsName]: MeasurementInfo } = {
	[MeasurementsName.BloodSugar]: {
		label: MeasurementsLabel.BloodSugar,
		unit: MeasurementsUnit.BloodSugar,
	},
	[MeasurementsName.BloodPressure]: {
		label: MeasurementsLabel.BloodPressure,
		unit: MeasurementsUnit.BloodPressure,
	},
	[MeasurementsName.BloodOxygen]: {
		label: MeasurementsLabel.BloodOxygen,
		unit: MeasurementsUnit.BloodOxygen,
	},
	[MeasurementsName.BodyTemperature]: {
		label: MeasurementsLabel.BodyTemperature,
		unit: MeasurementsUnit.BodyTemperature,
	},
	[MeasurementsName.BodyFat]: {
		label: MeasurementsLabel.BodyFat,
		unit: MeasurementsUnit.BodyFat,
	},
	[MeasurementsName.BodyWeight]: {
		label: MeasurementsLabel.BodyWeight,
		unit: MeasurementsUnit.BodyWeight,
	},
	[MeasurementsName.PulseRate]: {
		label: MeasurementsLabel.PulseRate,
		unit: MeasurementsUnit.PulseRate,
	},
};

export const statsDisplayOrder = [
	MeasurementAll.name,
	MeasurementsName.BloodPressure,
	MeasurementsName.PulseRate,
	MeasurementsName.BloodSugar,
	MeasurementsName.BodyWeight,
	MeasurementsName.BodyFat,
	MeasurementsName.BodyTemperature,
	MeasurementsName.BloodOxygen,
];

export const intervalByDataType = {
	[MeasurementsName.BloodSugar]: 10,
	[MeasurementsName.BloodPressure]: 10,
	[MeasurementsName.BloodOxygen]: 1,
	[MeasurementsName.BodyTemperature]: 1,
	[MeasurementsName.BodyFat]: 1,
	[MeasurementsName.BodyWeight]: 1,
	[MeasurementsName.PulseRate]: 5,
};
