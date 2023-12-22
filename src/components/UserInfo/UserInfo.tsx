import React, { useEffect, useState } from 'react';
import './UserInfo.css';
import { useParams } from 'react-router-dom';
//import TimelineIcon from '@mui/icons-material/Timeline';
import { fetchUsers } from '../../api/users';
import { isStatusOk } from '../../api/utils/apiCaller';
import { GetUsersResp } from '../../types/users';
//import MenuIcon from '@mui/icons-material/Menu';

export const UserInfo = () => {
	const { user_id } = useParams();
	const [userName, setUserName] = useState('');

	useEffect(() => {
		const fetchUserData = async () => {
			const upsRes = await fetchUsers();
			if (isStatusOk(upsRes.status)) {
				const fetchedUsers = upsRes.payload as GetUsersResp;

				// Find the user with the matching ID
				const matchingUser = fetchedUsers._data.user_profiles.find(
					(user) => user.user_id === user_id,
				);

				// If a matching user is found, set the user name
				if (matchingUser) {
					setUserName(matchingUser.display_name);
				}
			}
		};
		fetchUserData();
	}, [user_id]);

	return (
		<div
			className='userinfo'
			style={{
				display: 'flex',
				// flexDirection: 'column',
				width: '100%',
			}}
		>
			<div
				style={{
					display: 'flex',
					flexDirection: 'row',
					width: '100%',
					height: '13.15vh',
					paddingLeft: '1rem',
					borderBottom: '1px solid #E0E0E0',
				}}
			>
				<img src='/face.png' style={{ height: '80px', width: '80px' }} />
				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'space-around',
						paddingLeft: '1rem',
					}}
				>
					<p style={{ fontSize: '1.5rem' }}>{userName ? `${userName}` : 'Loading...'}</p>
					<p style={{ color: '858585', fontSize: '0.8rem' }}>
						性別: 男 生日: 1999/01/01 疾病史：無
					</p>
				</div>
			</div>
		</div>
	);
};
