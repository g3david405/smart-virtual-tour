import { Button, Typography, Modal } from '@mui/material';
import { ReportContext } from 'components/ReportParentRoute/ReportParentRoute';
import { reportPeriodName } from 'constants/reportSettings';
import React, { memo, useState } from 'react';
import { useOutletContext, useNavigate, useLocation } from 'react-router-dom';
import { displayDateRange } from 'utils/time';
import Popup from '../../pages/DateFilter/Popup';

import dayjs, { Dayjs } from 'dayjs';
import { Period } from 'types/reportSettings';
import { PeriodString } from 'constants/reportSettings';

interface Props {
	username: string | undefined;
}

export const ReportHeader = memo(({ username = 'N/A' }: Props) => {
	const location = useLocation();
	const navigate = useNavigate();
	const { dateRange, period } = useOutletContext<ReportContext>();
	const [isPopupOpen, setPopupOpen] = useState(false); // 用於管理彈跳視窗可見性的狀態

	const handleSelectRangeClick = () => {
		navigate(location.pathname + '/#', { state: { isPopupOpen: true } });
		setPopupOpen(true); // 當按鈕被點擊時將 isPopupOpen 設為 true
	};

	const handleClosePopup = () => {
		navigate(-1);
		setPopupOpen(false); // 當彈跳視窗被關閉時將 isPopupOpen 設為 false
	};

	if (!dateRange || !period) {
		return <></>;
	}

	const displayPeriod = reportPeriodName[period];
	const displayDate = displayDateRange(dateRange.start, dateRange.end);

	const [selectedDate, setselectedDate] = useState<Dayjs>(dayjs());
	const [selectedPeriod, setselectedPeriod] = useState<Period>(PeriodString.TODAY);

	// console.log('render囉');
	return (
		<header style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 0' }}>
			<div>
				<Typography
					sx={{
						marginBottom: '8px',
						fontSize: '20px',
						lineHeight: '22px',
						fontWeight: '400',
						color: '#212121',
					}}
				>{`${username}的${displayPeriod}`}</Typography>
				<Typography
					sx={{
						fontSize: '25px',
						lineHeight: '22px',
						fontWeight: '400',
						color: '#616161',
					}}
				>
					{displayDate}
				</Typography>
			</div>
			<div>
				{/* 用於打開彈跳視窗的按鈕 */}
				<Button
					variant='outlined'
					sx={{
						color: 'black',
						border: '1px solid #9E9E9E',
						'&:hover': { background: 'transparent', border: '1px solid #9E9E9E' },
					}}
					onClick={handleSelectRangeClick}
				>
					選擇範圍
				</Button>

				{/* 彈跳視窗組件 */}
				<Modal open={isPopupOpen} onClose={handleClosePopup}>
					<Popup
						onClose={handleClosePopup}
						selectedDate={selectedDate}
						setselectedDate={setselectedDate}
						selectedPeriod={selectedPeriod}
						setselectedPeriod={setselectedPeriod}
					/>
				</Modal>
			</div>
		</header>
	);
});

ReportHeader.displayName = 'ReportHeader';
