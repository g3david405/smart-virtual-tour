import React, { useState, useEffect } from 'react';
import { FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import './UserList.css';
import { fetchUsers } from '../../api/users';
import { isStatusOk } from '../../api/utils/apiCaller';
import { UserProfiles, GetUsersResp } from '../../types/users';
import { NavLink, useLocation } from 'react-router-dom';

export const UserList = () => {
	const options = [
		{ value: '', text: 'All' },
		{ value: '1', text: 'status1' },
		{ value: '2', text: 'status2' },
		{ value: '3', text: 'status3' },
	];
	const emptyUserProfiles: UserProfiles = { user_profiles: [] };
	const [selected, setSelected] = useState<string>(options[0].value);
	const [users, setUsers] = useState(emptyUserProfiles);
	const location = useLocation();

	let linkTo = '/report';

	switch (true) {
		case location.pathname.includes('report') || location.pathname.includes('Report'):
			linkTo = '/report/';
			break;
		case location.pathname.includes('LittleHelper'):
			linkTo = '/LittleHelper/';
			break;
		case location.pathname.includes('MeasureStatis'):
			linkTo = '/MeasureStatis/';
			break;
		case location.pathname.includes('Account'):
			linkTo = '/Account/';
			break;
		default:
			// default case, if none of the conditions are met
			linkTo = '/';
			break;
	}

	const handleChange = (event: SelectChangeEvent<string>) => {
		setSelected(event.target.value);
	};

	const [selectedUser, setSelectedUser] = useState<string | null>(null);

	useEffect(() => {
		const fetchUserData = async () => {
			const upsRes = await fetchUsers();
			if (isStatusOk(upsRes.status)) {
				const users = upsRes.payload as GetUsersResp;
				setUsers(users._data);
			}
		};

		fetchUserData();
	}, []);

	const handleUserClick = (userId: string) => {
		setSelectedUser(userId);
	};

	return (
		<div
			className='userlist'
			style={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'flex-start',
				paddingTop: '1.5rem',
			}}
		>
			<FormControl className='dropdown' style={{ left: '1rem' }}>
				<InputLabel id='statusDropdown_label'>Status</InputLabel>
				<Select
					labelId='statusDropdown_label'
					id='statusDropdown'
					value={selected}
					onChange={handleChange}
				>
					{options.map((option) => (
						<MenuItem key={option.value} value={option.value}>
							{option.text}
						</MenuItem>
					))}
				</Select>
			</FormControl>
			<div
				style={{ display: 'flex', flexDirection: 'column', width: '20vw', paddingTop: '1.5rem' }}
			>
				{users.user_profiles.map((user, index, array) => (
					<NavLink
						key={user.user_id}
						to={`${linkTo}${user.user_id}`}
						onClick={() => handleUserClick(user.user_id)}
						style={{
							textDecoration: 'none',
							color: 'inherit',
						}}
						className={location.pathname === `${linkTo}/${user.user_id}` ? 'activeUser' : ''}
					>
						<div
							className={`userCard ${
								selectedUser === user.user_id ? 'activeUser' : '' // Apply the class conditionally
							}`}
							style={{
								display: 'flex',
								flexDirection: 'row',
								alignItems: 'center',
								borderTop: '1px solid #e0e0e0',
								borderBottom: index === array.length - 1 ? '1px solid #e0e0e0' : 'none',
							}}
						>
							<img src='/face.png' style={{ height: '70px' }} alt='user' />
							<div
								style={{
									height: '50px',
									display: 'flex',
									justifyContent: 'space-between',
									flexDirection: 'column',
								}}
							>
								<p>{user.display_name}</p>
								<p style={{ color: '#858585', fontSize: '0.8rem' }}>上次更新：小時前</p>
							</div>
						</div>
					</NavLink>
				))}
			</div>
		</div>
	);
};
