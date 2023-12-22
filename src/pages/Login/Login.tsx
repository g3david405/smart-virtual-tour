import React, { useState, useEffect } from 'react';
import { Container, Box, Button } from '@mui/material';
import { Navigate } from 'react-router-dom';
import { fetchLogin } from '../../api/auth';
import { isStatusOk } from '../../api/utils/apiCaller';
import { GetTokenResp, updateTokenCookies } from '../../utils/auth';
import { fetchUsers } from '../../api/users';
import { UserProfiles, GetUsersResp } from '../../types/users';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import OutlinedInput from '@mui/material/OutlinedInput';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';


type userInput = {
	phone_number: string;
	password: string;
};

export const Login = () => {
	const defaultUserInput: userInput = {
		phone_number: '',
		password: '',
	};
	const emptyUserProfiles: UserProfiles = { user_profiles: [] };
	const [userInput, setUserInput] = useState(defaultUserInput);
	const [isLogin, setIsLogin] = useState(false);
	const [users, setUsers] = useState(emptyUserProfiles);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		try {
			const res = await fetchLogin(userInput);
			const { status, payload } = res;
			if (isStatusOk(status)) {
				const jwtResp = payload as GetTokenResp;
				updateTokenCookies(jwtResp);
				setIsLogin(true);
				const upsRes = await fetchUsers();
				// const {status,payload}=upsRes;

				if (isStatusOk(upsRes.status)) {
					const users = upsRes.payload as GetUsersResp;
					setUsers(users._data);
				}

				return;
			}
			alert('wrong phone number or password');
		} catch (error) {
			console.log(error);
		}
	};

	const checkbox = document.getElementById('rememberAccount') as HTMLInputElement | null;

	if (checkbox != null) {
		// ✅ Set checkbox checked
		checkbox.checked = true;

		// 👇️ true
		console.log(checkbox.checked);

		// ✅ Set checkbox unchecked
		checkbox.checked = false;
	}

	// hide or reveal 帳密
	const [ShowPhoneNumber, setShowPhoneNumber] = useState(false);
	const handleClickShowPhoneNumber = () => {
		setShowPhoneNumber((prevShowPhoneNumber) => !prevShowPhoneNumber);
	};

	const [showPassword, setShowPassword] = useState(false);
	const handleClickShowPassword = () => {
		setShowPassword((prevShowPassword) => !prevShowPassword);
	};

	// 當帳號及密碼皆輸入時isEntered=true
	const [isEntered, setIsEntered] = useState(false);

	useEffect(() => {
		if (userInput.phone_number && userInput.password) {
			setIsEntered(true);
		} else {
			setIsEntered(false);
		}
	}, [userInput]);


	// 記住帳密
	// Add a new state variable for the checkbox
	const [rememberAccount, setRememberAccount] = useState(false);

	// Update the checkbox state when it's clicked
	const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		e.preventDefault();
		console.log('checkbox changed');
		setRememberAccount(e.target.checked);

		// Use the checkbox state when saving or removing from localStorage
		if (rememberAccount) {
			localStorage.setItem('phone_number', userInput.phone_number);
			localStorage.setItem('password', userInput.password);
		} else {
			localStorage.removeItem('phone_number');
			localStorage.removeItem('password');
		}
	};


	useEffect(() => {
		const savedPhoneNumber = localStorage.getItem('phone_number');
		const savedPassword = localStorage.getItem('password');

		// Update the checkbox state when loading from localStorage
		if (savedPhoneNumber && savedPassword) {
			setUserInput({ phone_number: savedPhoneNumber, password: savedPassword });
			setRememberAccount(true);
		}
	}, [userInput]);

	if (isLogin) {
		if (users.user_profiles.length > 0)
			return <Navigate to={'/Report/' + users.user_profiles[0].user_id} replace />;

		return <Navigate to={'/'} replace />;
	}

	return (
		<Container sx={{ height: '100%' }}>
			<Box
				sx={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					height: '100%',
					marginTop: '80px',
				}}
			>
				<form onSubmit={(e) => handleSubmit(e)}>
					<img src='/logo.jpg' style={{ height: '65px', padding: '0 0 10px 12px' }} />
					<FormControl variant='outlined' sx={{ display: 'block', marginBottom: '20px' }}>
						<InputLabel htmlFor='phone-number-input' sx={{ color: 'black', opacity: '.5' }}>
							手機號碼/帳號
						</InputLabel>
						<OutlinedInput
							id='phone-number-input'
							label='手機號碼/帳號'
							required
							type={ShowPhoneNumber ? 'text' : 'password'}
							value={userInput.phone_number}
							onChange={(e) =>
								setUserInput((prevState) => ({ ...prevState, phone_number: e.target.value }))
							}
							endAdornment={
								<InputAdornment position='end'>
									<IconButton onClick={handleClickShowPhoneNumber} edge='end'>
										{ShowPhoneNumber ? <VisibilityOff /> : <Visibility />}
									</IconButton>
								</InputAdornment>
							}
						/>
					</FormControl>

					<FormControl variant='outlined' sx={{ display: 'block', marginBottom: '20px' }}>
						<InputLabel htmlFor='password-input' sx={{ color: 'black', opacity: '.5' }}>
							密碼
						</InputLabel>
						<OutlinedInput
							id='password-input'
							label='密碼'
							required
							type={showPassword ? 'text' : 'password'}
							value={userInput.password}
							onChange={(e) =>
								setUserInput((prevState) => ({ ...prevState, password: e.target.value }))
							}
							endAdornment={
								<InputAdornment position='end'>
									<IconButton onClick={handleClickShowPassword} edge='end'>
										{showPassword ? <VisibilityOff /> : <Visibility />}
									</IconButton>
								</InputAdornment>
							}
						/>
					</FormControl>

					<input type="checkbox" name="rememberAccount" id="rememberAccount" checked={rememberAccount} onChange={handleCheckboxChange} style={{ marginBottom: '30px' }} />
					<span style={{ color: 'black', opacity: '.5' }}> 記住帳號和密碼</span>
					<Button
						variant='contained'
						sx={{ background: isEntered ? '#00B0B8' : '#E0E0E0', color: isEntered ? '#white' : '#7B7B7B', '&:hover': { background: isEntered ? '#00B0B8' : '#E0E0E0' }}}
						disableRipple
						fullWidth
						type='submit'
					>
						登入
					</Button>
				</form>
			</Box>
		</Container>
	);
};
