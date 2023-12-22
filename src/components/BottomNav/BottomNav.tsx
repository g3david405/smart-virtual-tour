import * as React from 'react';
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { NavLink } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import './BottomNav.css';

export const BottomNav = () => {
	const [value, setValue] = React.useState(0);
	const { user_id } = useParams<{ user_id: string }>();

	return (
		<Box sx={{ width: '100%' }}>
			<BottomNavigation
				className='stickToBottom'
				showLabels
				value={value}
				onChange={(event, newValue) => {
					setValue(newValue);
				}}
			>
				<BottomNavigationAction
					label='數據'
					icon={<StarBorderIcon />}
					component={NavLink}
					to={`/report/${user_id}`}
				/>
				<BottomNavigationAction
					label='小幫手'
					icon={<StarBorderIcon />}
					component={NavLink}
					to={`/LittleHelper/${user_id}`}
				/>
				<BottomNavigationAction
					label='量表'
					icon={<StarBorderIcon />}
					component={NavLink}
					to={`/MeasureStatis/${user_id}`}
				/>
				<BottomNavigationAction
					label='帳戶'
					icon={<StarBorderIcon />}
					component={NavLink}
					to={`/Account/${user_id}`}
				/>
			</BottomNavigation>
		</Box>
	);
};
