import React, { memo } from 'react';
import { Card, Typography } from '@mui/material';
import { ReactComponent as NormalCat } from 'icons/cat_normal.svg';
import { ReactComponent as WarningCat } from 'icons/cat_warning.svg';
import { ReactComponent as NormalDog } from 'icons/dog_normal.svg';
import { ReactComponent as WarningDog } from 'icons/dog_warning.svg';
import classes from './StatusCard.module.css';
import { StatusText } from 'constants/status';
import { Agent } from 'constants/reportSettings';

interface Props {
	isNormal: boolean;
	agent: Agent;
}

export const StatusCard = memo(({ isNormal, agent }: Props) => {
	return (
		<Card sx={{ padding: '8px 16px 16px', boxShadow: 0, borderRadius: '8px' }}>
			<div className={classes['title-wrapper']}>
				<Typography
					sx={{
						maxWidth: '178px',
						margin: '16px 0',
						fontSize: '20px',
						lineHeight: '28px',
						fontWeight: 'bold',
						color: isNormal ? '#0097A7' : '#ED6C02',
					}}
				>
					{isNormal ? StatusText.IsNormalTitle : StatusText.IsAbnormalTitle}
				</Typography>
				{agent === Agent.CAT && (isNormal ? <NormalCat /> : <WarningCat />)}
				{agent === Agent.DOG && (isNormal ? <NormalDog /> : <WarningDog />)}
			</div>
			<div>
				<Typography
					sx={{
						fontSize: '16px',
						lineHeight: '22px',
						fontWeight: '400',
						color: '#616161',
					}}
					className={classes['status-text']}
					dangerouslySetInnerHTML={{
						__html: isNormal ? StatusText.IsNormalText : StatusText.IsAbnormalText,
					}}
				>
					{/* {isNormal ? StatusText.IsNormalText : StatusText.IsAbnormalText} */}
				</Typography>
			</div>
		</Card>
	);
});

StatusCard.displayName = 'StatusCard';
