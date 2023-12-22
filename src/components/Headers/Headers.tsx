import React from 'react';
import './Headers.css';
import SettingsIcon from '@mui/icons-material/Settings';

export const Headers = () => {
	return (
		<div className='header'>
			<div id='productName'>
				<img src='/logo.jpg' style={{ height: '50px' }} />
			</div>
			<div id='settings'>
				<SettingsIcon />
				<img src={'/face.png'} alt='logo' style={{ height: '50px' }} />
			</div>
		</div>
	);
};
