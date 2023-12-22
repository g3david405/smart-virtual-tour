import React, { useEffect, useState, useRef } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { Box } from '@mui/material';
// import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import Button from '@mui/material/Button';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { ReportContext } from 'components/ReportParentRoute/ReportParentRoute';
import { getDateRange } from 'utils/reportSettings';
import { DateRange, Period } from 'types/reportSettings';
import { PeriodString } from 'constants/reportSettings';
import './Popup.css';

// MuiStack-root
interface DatePickerValueProps {
	onClose: () => void;
}
interface PopupProps {
	onClose: () => void;
	selectedDate: Dayjs;
	setselectedDate: React.Dispatch<React.SetStateAction<Dayjs>>;
	selectedPeriod: string;
	setselectedPeriod: React.Dispatch<React.SetStateAction<Period>>;
}
type CombinedProps = DatePickerValueProps & PopupProps;
const Popup: React.FC<CombinedProps> = ({
	onClose,
	selectedDate,
	setselectedDate,
	selectedPeriod = 'theDay',
	setselectedPeriod,
}) => {
	const [value, setValue] = React.useState('');
	const [datevalue, setdateValue] = React.useState<Dayjs | null>(dayjs());
	const { dateRange, period, setDateRange, setPeriod } = useOutletContext<ReportContext>();
	const [localPeriod, setLocalPeriod] = useState<Period>(period ?? PeriodString.TODAY);
	const [localDateRange, setLocalDateRange] = useState<DateRange>(
		dateRange
			? { start: new Date(dateRange.start), end: new Date(dateRange.end) }
			: getDateRange(period ?? PeriodString.TODAY, dayjs(datevalue).toDate()),
	);
	const isFirstMount = useRef(true);
	const navigate = useNavigate();
	const [isConfirmed, setIsConfirmed] = useState(false);
	const [error, setError] = React.useState(false);
	// const [helperText, setHelperText] = React.useState('Choose wisely');

	const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const selectedValue = event.target.value;
		let period: Period;

		switch (selectedValue) {
			case 'theDay':
				period = PeriodString.TODAY;
				break;
			case 'past7Days':
				period = PeriodString.WEEK;
				break;
			case 'past14Days':
				period = PeriodString.BIWEEK;
				break;
			case 'past30Days':
				period = PeriodString.MONTH;
				break;
			case 'past90Days':
				period = PeriodString.QUARTER;
				break;
			default:
				period = PeriodString.TODAY;
		}

		setValue(selectedValue);
		setError(false);
		setLocalPeriod(period);
	};

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		onSaveSetting();
		console.log(localDateRange);
		console.log('save setting');
		console.log('rerendered');
		onClose();
	};

	useEffect(() => {
		if (!isFirstMount.current) {
			// do not run this logic on first mount, otherwise local date range will always reset to default
			setLocalDateRange(getDateRange(localPeriod, dayjs(datevalue).toDate()));
		} else {
			isFirstMount.current = false;
		}
	}, [localPeriod, datevalue]);

	useEffect(() => {
		if (isConfirmed) {
			setIsConfirmed(false);
			navigate(-1);
		}
	}, [dateRange, isConfirmed]);

	function onSaveSetting() {
		console.log('localDateRange: ', localDateRange);
		console.log('localPeriod: ', localPeriod);
		setDateRange(localDateRange);
		setPeriod(localPeriod);
		setIsConfirmed(true);
		if (datevalue !== null) {
			setselectedDate(datevalue);
		}
		setselectedPeriod(localPeriod);
		console.log('selectedDate: ', selectedDate);
		console.log('selectedPeriod: ', selectedPeriod);
	}
	return (
		<LocalizationProvider dateAdapter={AdapterDayjs}>
			<Box
				style={{ flexDirection: 'column' }}
				sx={{
					display: 'flex',
					flexDirection: 'column',
					width: '280px', // Set the width of the popup
					height: '45vh', // Set the height of the popup
					position: 'fixed',
					top: '50%', // Center vertically
					left: '50%', // Center horizontally
					transform: 'translate(-50%, -50%)', // Center both horizontally and vertically
					backgroundColor: 'white',
					padding: '20px 0px 0px 20px',
					borderRadius: '8px',
					boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
					overflow: 'auto',
				}}
			>
				<div
					style={{ display: 'flex', flexDirection: 'column' }}
					// sx={{ display: 'flex', flexDirection: 'column' }}
					// components={['DatePicker']}
				>
					<DatePicker
						sx={{ width: '80%' }}
						label='日期'
						defaultValue={selectedDate}
						value={datevalue}
						onChange={(date) => setdateValue(date)}
					/>
					<form onSubmit={handleSubmit}>
						<FormControl error={error} variant='standard'>
							{/* <FormLabel id='demo-error-radios'>Pop quiz: MUI is...</FormLabel> */}
							<RadioGroup
								aria-labelledby='demo-error-radios'
								name='quiz'
								value={value}
								onChange={(event) => {
									const selectedValue = (event.target as HTMLInputElement).value as Period;
									setLocalPeriod(selectedValue);
									handleRadioChange(event as unknown as React.ChangeEvent<HTMLInputElement>);
								}}
							>
								<FormControlLabel value='theDay' control={<Radio />} label='當天' />
								<FormControlLabel value='past7Days' control={<Radio />} label='過去7天' />
								<FormControlLabel value='past14Days' control={<Radio />} label='過去14天' />
								<FormControlLabel value='past30Days' control={<Radio />} label='過去30天' />
								<FormControlLabel value='past90Days' control={<Radio />} label='過去90天' />
							</RadioGroup>
							<div style={{ display: 'flex', justifyContent: 'flex-end', width: '260px' }}>
								<Button sx={{ mt: 1, mr: 1, color: 'black' }} onClick={onClose}>
									取消
								</Button>
								<Button sx={{ mt: 1, mr: 1, color: 'light-blue' }} type='submit'>
									確定
								</Button>
							</div>
						</FormControl>
					</form>
				</div>
			</Box>
		</LocalizationProvider>
	);
};

export default Popup;
