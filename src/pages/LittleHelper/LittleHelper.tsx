import React from 'react';
import { Container, Box } from '@mui/material';

// import { isStatusOk } from '../../api/utils/apiCaller';
//import { fetchUsers } from '../../api/users';

export const LittleHelper = () => {
	return (
		<Container sx={{ height: '100%' }}>
			<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
				小幫手
			</Box>
		</Container>
	);
};
