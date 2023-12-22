import React from 'react';
import { Chip } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import ErrorIcon from '@mui/icons-material/Error';
import {
	MeasurementsName,
	MeasurementsLabel,
	MeasurementAll,
	BloodSugarTestingTime,
	BloodSugarTestingTimeLabel,
	BloodSugarTestingTimeSum,
} from 'constants/measurements';

export type chip = {
	name:
		| MeasurementsName
		| MeasurementAll.name
		| BloodSugarTestingTime
		| BloodSugarTestingTimeSum.name;
	label:
		| MeasurementsLabel
		| MeasurementAll.label
		| BloodSugarTestingTimeLabel
		| BloodSugarTestingTimeSum.label;
	showWarning: boolean;
	handleClick: () => void;
	selectedType:
		| MeasurementsName
		| MeasurementAll.name
		| BloodSugarTestingTime
		| BloodSugarTestingTimeSum.name;
};

export interface ChipsProps {
	chips: chip[];
}

export const Chips = ({ chips }: ChipsProps) => {
	const ChipsElem = chips.map((c) => (
		<Chip
			key={`chip-${c.name}`}
			label={c.label}
			sx={{
				'&.MuiChip-filled': {
					background: '#00B0B8',
					color: '#FFF',
					'& .MuiSvgIcon-root': {
						color: '#FFF',
						opacity: 0.7,
					},
					'& .MuiChip-deleteIcon': {
						color: '#FFF',
						opacity: 0.7,
					},
				},
				marginRight: '8px',
				marginBottom: '4px',
			}}
			variant={c.selectedType === c.name ? 'filled' : 'outlined'}
			icon={c.selectedType === c.name ? <CheckIcon /> : <></>}
			// this defines the action on clicking the icon on the right of the chip
			onDelete={c.handleClick}
			// used for displaying the warning icon on the right
			deleteIcon={c.showWarning ? <ErrorIcon /> : <></>}
			onClick={c.handleClick}
		/>
	));
	return <div style={{ marginBottom: '12px' }}>{ChipsElem}</div>;
};
