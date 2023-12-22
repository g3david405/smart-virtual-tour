import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { MeasurementDocument } from 'types/measurement';

interface MeasureDataCardProps {
	MeasureData: MeasurementDocument;
}

export const MeasureDataCard: React.FC<MeasureDataCardProps> = ({ MeasureData }) => {
	const { measurement_time, body_temperature, pulse_rate, blood_pressure, blood_sugar } =
		MeasureData;

	const dateObject = new Date(measurement_time);

	const hours = dateObject.getHours();
	const minutes = dateObject.getMinutes();

	// Format hours and minutes as HH:mm string
	const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes
		.toString()
		.padStart(2, '0')}`;

	return (
		<Card style={{ minWidth: 200 }}>
			<CardContent>
				<div key={measurement_time}>
					<p>測量時間: {formattedTime}</p>

					{body_temperature ? <p>體溫: {body_temperature.value}</p> : <p>體溫: -</p>}

					{pulse_rate ? <p>心率: {pulse_rate.value}</p> : <p>心率: -</p>}

					{blood_pressure ? (
						<p>
							血壓: {blood_pressure.systolic}/{blood_pressure.diastolic}{' '}
						</p>
					) : (
						<p>血壓: -</p>
					)}

					{blood_sugar ? <p>血糖: {blood_sugar.value}</p> : <p>血糖: -</p>}
				</div>
			</CardContent>
		</Card>
	);
};
