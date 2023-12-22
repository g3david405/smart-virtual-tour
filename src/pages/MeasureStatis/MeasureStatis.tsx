import React from 'react';
import { Container, Box } from '@mui/material';
import { useRouteLoaderData } from 'react-router-dom';
import { LoaderData } from 'types/router';
import { pageLoader } from 'router';
// import { isStatusOk } from '../../api/utils/apiCaller';
//import { fetchUsers } from '../../api/users';

export const MeasureStatis = () => {
	const targetUser = useRouteLoaderData('MeasureStatis') as LoaderData<typeof pageLoader>;
	console.log(targetUser);

	return (
		<Container sx={{ height: '100%' }}>
			<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
				量表
			</Box>
		</Container>
	);
};
