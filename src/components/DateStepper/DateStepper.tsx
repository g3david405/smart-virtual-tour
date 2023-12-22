import React from 'react';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import classes from './DateStepper.module.css';

interface Props {
	dateRange: string;
	onPrevDateRange: () => void;
	onNextDateRange: () => void;
	isPrevDisable?: boolean;
	isNextDisable?: boolean;
}

export const DateStepper = ({
	dateRange,
	onPrevDateRange,
	onNextDateRange,
	isPrevDisable = false,
	isNextDisable = false,
}: Props) => {
	return (
		<div className={classes['date-stepper']}>
			<button onClick={onPrevDateRange} disabled={isPrevDisable}>
				<NavigateBeforeIcon sx={{ color: '#616161' }} />
			</button>
			<span>{dateRange}</span>
			<button onClick={onNextDateRange} disabled={isNextDisable}>
				<NavigateNextIcon sx={{ color: '#616161' }} />
			</button>
		</div>
	);
};
