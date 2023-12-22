// import React, { useState, useEffect, useRef } from 'react';
// import dayjs, { Dayjs } from 'dayjs';
// import { useOutletContext, useNavigate } from 'react-router-dom';
// import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import Radio from '@mui/material/Radio';
// import RadioGroup from '@mui/material/RadioGroup';
// import FormControlLabel from '@mui/material/FormControlLabel';
// import FormControl from '@mui/material/FormControl';
// import FormLabel from '@mui/material/FormLabel';
// import FormHelperText from '@mui/material/FormHelperText';
// import Button from '@mui/material/Button';

// import { getDateRange } from 'utils/reportSettings';
// import { DateRange, Period } from 'types/reportSettings';
// import { PeriodString } from 'constants/reportSettings';
// import { ReportContext } from 'components/ReportParentRoute/ReportParentRoute';

// interface DatePickerValueProps {
// 	onClose: () => void;
// }

// const Popup: React.FC<DatePickerValueProps> = () => {
// 	const { dateRange, period, setDateRange, setPeriod } = useOutletContext<ReportContext>();
// 	const [localPeriod, setLocalPeriod] = useState<Period>(period ?? PeriodString.TODAY);
// 	const isFirstMount = useRef(true);
// 	// use new Date() to avoid direct manipulating dateRange
// 	const [localDateRange, setLocalDateRange] = useState<DateRange>(
// 		dateRange
// 			? { start: new Date(dateRange.start), end: new Date(dateRange.end) }
// 			: getDateRange(period ?? PeriodString.TODAY),
// 	);
// 	const [isConfirmed, setIsConfirmed] = useState(false);
// 	const navigate = useNavigate();

// 	useEffect(() => {
// 		if (!isFirstMount.current) {
// 			// do not run this logic on first mount, otherwise local date range will always reset to default
// 			// setLocalDateRange(getDateRange(localPeriod));
// 		} else {
// 			isFirstMount.current = false;
// 		}
// 	}, [localPeriod]);

// 	useEffect(() => {
// 		if (isConfirmed) {
// 			setIsConfirmed(false);
// 			navigate(-1);
// 		}
// 	}, [dateRange, isConfirmed]);

// 	function onSaveSetting() {
// 		setDateRange(localDateRange);
// 		setPeriod(localPeriod);
// 		setIsConfirmed(true);
// 	}

// 	const [datevalue, setdateValue] = React.useState<Dayjs | null>(dayjs('2022-04-17'));

// 	const [value, setValue] = React.useState('');
// 	const [error, setError] = React.useState(false);
// 	const [helperText, setHelperText] = React.useState('Choose wisely');

// 	const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
// 		setValue((event.target as HTMLInputElement).value);
// 		setHelperText(' ');
// 		setError(false);
// 	};

// 	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
// 		const { start, end } = localDateRange;
// 		event.preventDefault();

// 		if (value === 'theDay') {
// 			setHelperText('You got it!');
// 			start.setDate(start.getDate());
// 			start.setHours(0, 0, 0, 0);
// 			end.setDate(end.getDate());
// 			end.setHours(23, 59, 59);
// 			setError(false);
// 		} else if (value === 'past7Days') {
// 			setHelperText('Sorry, wrong answer!');
// 			start.setMonth(start.getMonth() - 7);
// 			start.setDate(1);
// 			start.setHours(0, 0, 0, 0);
// 			end.setDate(0);
// 			end.setHours(23, 59, 59);
// 			setError(true);
// 		} else if (value === 'past14Days') {
// 			setHelperText('Sorry, wrong answer!');
// 			start.setDate(start.getDate() - 14);
// 			start.setHours(0, 0, 0, 0);
// 			end.setDate(end.getDate() - 14);
// 			end.setHours(23, 59, 59);
// 			setError(true);
// 		} else if (value === 'past30Days') {
// 			setHelperText('Sorry, wrong answer!');
// 			start.setMonth(start.getMonth() - 1);
// 			start.setDate(1);
// 			start.setHours(0, 0, 0, 0);
// 			end.setDate(0);
// 			end.setHours(23, 59, 59);
// 			setError(true);
// 		} else if (value === 'past90Days') {
// 			setHelperText('Sorry, wrong answer!');
// 			start.setMonth(start.getMonth() - 3);
// 			start.setDate(1);
// 			start.setHours(0, 0, 0, 0);
// 			end.setDate(0);
// 			end.setHours(23, 59, 59);
// 			setError(true);
// 		} else {
// 			setHelperText('Please select an option.');
// 			setError(true);
// 		}
// 	};

// 	// function handlePrevDateRange() {
// 	// 	const { start, end } = localDateRange;
// 	// 	switch (localPeriod) {
// 	// 		case PeriodString.TODAY: {
// 	// 			start.setDate(start.getDate());
// 	// 			start.setHours(0, 0, 0, 0);
// 	// 			end.setDate(end.getDate());
// 	// 			end.setHours(23, 59, 59);
// 	// 			break;
// 	// 		}
// 	// 		case PeriodString.WEEK: {
// 	// 			start.setMonth(start.getMonth() - 7);
// 	// 			start.setDate(1);
// 	// 			start.setHours(0, 0, 0, 0);
// 	// 			end.setDate(0);
// 	// 			end.setHours(23, 59, 59);
// 	// 			break;
// 	// 		}
// 	// 		case PeriodString.BIWEEK: {
// 	// 			start.setDate(start.getDate() - 14);
// 	// 			start.setHours(0, 0, 0, 0);
// 	// 			end.setDate(end.getDate() - 14);
// 	// 			end.setHours(23, 59, 59);
// 	// 			break;
// 	// 		}
// 	// 		case PeriodString.MONTH: {
// 	// 			start.setMonth(start.getMonth() - 1);
// 	// 			start.setDate(1);
// 	// 			start.setHours(0, 0, 0, 0);
// 	// 			end.setDate(0);
// 	// 			end.setHours(23, 59, 59);
// 	// 			break;
// 	// 		}
// 	// 		case PeriodString.QUARTER: {
// 	// 			start.setMonth(start.getMonth() - 3);
// 	// 			start.setDate(1);
// 	// 			start.setHours(0, 0, 0, 0);
// 	// 			end.setDate(0);
// 	// 			end.setHours(23, 59, 59);
// 	// 			break;
// 	// 		}
// 	// 	}
// 	// 	setLocalDateRange({ start, end });
// 	// }

// 	return (
// 		<LocalizationProvider dateAdapter={AdapterDayjs}>
// 			<DemoContainer components={['DatePicker']}>
// 				<DatePicker
// 					label='Controlled picker'
// 					value={datevalue}
// 					onChange={(newValue) => {
// 						setdateValue(newValue);
// 						handleRadioChange;
// 					}}
// 				/>

// 				<form onSubmit={handleSubmit}>
// 					<FormControl sx={{ m: 3 }} error={error} variant='standard'>
// 						<FormLabel id='demo-error-radios'>Pop quiz: MUI is...</FormLabel>
// 						<RadioGroup
// 							aria-labelledby='demo-error-radios'
// 							name='quiz'
// 							value={value}
// 							onChange={(e) => setLocalPeriod(e.target.value as Period)}
// 						>
// 							<FormControlLabel
// 								value='theDay'
// 								control={<Radio checked={localPeriod === PeriodString.TODAY} />}
// 								label='當天'
// 							/>
// 							<FormControlLabel
// 								value='past7Days'
// 								control={<Radio checked={localPeriod === PeriodString.WEEK} />}
// 								label='過去7天'
// 							/>
// 							<FormControlLabel
// 								value='past14Days'
// 								control={<Radio checked={localPeriod === PeriodString.BIWEEK} />}
// 								label='過去14天'
// 							/>
// 							<FormControlLabel
// 								value='past30Days'
// 								control={<Radio checked={localPeriod === PeriodString.MONTH} />}
// 								label='過去30天'
// 							/>
// 							<FormControlLabel
// 								value='past90Days'
// 								control={<Radio checked={localPeriod === PeriodString.QUARTER} />}
// 								label='過去90天'
// 							/>
// 						</RadioGroup>
// 						<FormHelperText>{helperText}</FormHelperText>
// 						<Button sx={{ mt: 1, mr: 1 }} type='submit' variant='outlined'>
// 							Check Answer
// 						</Button>
// 					</FormControl>
// 				</form>
// 			</DemoContainer>
// 		</LocalizationProvider>
// 	);
// };

// export default Popup;
import React from 'react';

function tmp() {
	return <div>Hi</div>;
}

export default tmp;
