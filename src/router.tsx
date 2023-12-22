import React from 'react';
import { RawData, Report, ReportRecord } from './pages/Report';
import { Login } from './pages/Login';
import {
	ActionFunctionArgs,
	createBrowserRouter,
	ParamParseKey,
	Params,
	redirect,
	useRouteError,
} from 'react-router-dom';

import { fetchRefresh } from './api/auth';
import { isStatusOk } from './api/utils/apiCaller';
import { clearTokenCookies, GetTokenResp, updateTokenCookies } from './utils/auth';
import App from './App';
import { fetchUsers } from './api/users';
import { GetUsersResp } from './types/users';
import { ReportParentRoute } from './components/ReportParentRoute';

import { Headers } from './components/Headers';
import { SideBar } from './components/SideBar';
import { BottomNav } from './components/BottomNav';
import { UserList } from './components/UserList';
import { UserInfo } from 'components/UserInfo';
import { LittleHelper } from 'pages/LittleHelper';
import { Account } from 'pages/Account';
import { MeasureStatis } from 'pages/MeasureStatis';
import { ReportTabs } from 'components/ReportTabs';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import useMediaQuery from '@mui/material/useMediaQuery';


const ResponsiveArrowBackIcon = () => {
	const isMobile = useMediaQuery('(max-width:600px)');
	return isMobile ? <ArrowBackIcon /> : null;
};
const Paths = {
	report: '/report/:user_id',
};

interface Args extends ActionFunctionArgs {
	params: Params<ParamParseKey<typeof Paths.report>>;
}
// /report 頁面本身所使用的 React 元素或組件
const ReportHomeComponent = () => {
	return (
		<div>
			<h2>Report Home Page</h2>
		</div>
	);
};

const router = createBrowserRouter([
	{
		path: '/',
		element: <App />,
		loader: rootLoader,
		children: [
			{
				id: 'report',
				path: '/report',
				element: <ReportParentRoute />,
				loader: reportLoader,
				errorElement: <ReportErrorBoundary />,
				children: [
					// /report 頁面本身的配置
					{
						path: '/report/',
						element: <ReportHomeComponent />,
					},
					{
						path: '/report/:user_id',
						element: (
							<div style={{ display: 'flex', flexDirection: 'column', maxHeight: '100vh' }}>
								<Headers />
								<div style={{ display: 'flex', flexDirection: 'row' }}>
									<SideBar />
									<UserList />
									<div style={{ top: '7vh', width: '100%' }}>
										<div style={{ position: 'sticky', top: 0 }}>
											<div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
												<ResponsiveArrowBackIcon />
												<UserInfo />
											</div>

											{/* write a if else statement that if in mobile display show arrow, otherwise, display: 'none' */}


											<ReportTabs
												Panel1={
													<div style={{ height: '70vh', overflow: 'auto' }}>
														<Report />
													</div>
												}
												Panel2={
													<div style={{ height: '70vh', overflow: 'auto' }}>
														<ReportRecord />
													</div>}
											/>
										</div>
									</div>
								</div>
								<BottomNav />
							</div>
						),
					},
					{
						path: '/report/:user_id/:data_type',
						element: (
							<div style={{ display: 'flex', flexDirection: 'column', maxHeight: '100vh' }}>
								<Headers />
								<div style={{ display: 'flex', flexDirection: 'row' }}>
									<SideBar />
									<UserList />
									<div style={{ top: '7vh', width: '100%' }}>
										<div style={{ position: 'sticky', top: 0 }}>
											<UserInfo />
											<ReportTabs
												Panel1={
													<div style={{ height: '76vh', overflow: 'auto' }}>
														<RawData />
													</div>
												}
												Panel2={
													<div style={{ height: '70vh', overflow: 'auto' }}>
														<ReportRecord />
													</div>
												}
											/>
										</div>
									</div>
								</div>
								<BottomNav />
							</div>
						),
					},
				],
			},
		],
	},
	{
		path: '/login',
		element: <Login />,
		loader: loginLoader,
	},
	{
		path: '/',
		element: <App />,
		loader: rootLoader,
		children: [
			{
				id: 'LittleHelper',
				path: '/LittleHelper',
				//element: <ReportParentRoute />,
				loader: pageLoader,
				errorElement: <ReportErrorBoundary />,
				children: [
					{
						path: '/LittleHelper/:user_id',
						element: (
							<div style={{ display: 'flex', flexDirection: 'column' }}>
								<Headers />
								<div style={{ display: 'flex', flexDirection: 'row' }}>
									<SideBar />
									<UserList />
									<div style={{ top: '7vh', width: '100%' }}>
										<LittleHelper />
									</div>
								</div>
								<BottomNav />
							</div>
						),
					},
				],
			},
		],
	},
	{
		path: '/',
		element: <App />,
		loader: rootLoader,
		children: [
			{
				id: 'Account',
				path: '/Account',
				//element: <ReportParentRoute />,
				loader: pageLoader,
				errorElement: <ReportErrorBoundary />,
				children: [
					{
						path: '/Account/:user_id',
						element: (
							<div style={{ display: 'flex', flexDirection: 'column' }}>
								<Headers />
								<div style={{ display: 'flex', flexDirection: 'row' }}>
									<SideBar />
									<UserList />
									<div style={{ top: '7vh', width: '100%' }}>
										<Account />
									</div>
								</div>
								<BottomNav />
							</div>
						),
					},
				],
			},
		],
	},
	{
		path: '/',
		element: <App />,
		loader: rootLoader,
		children: [
			{
				id: 'MeasureStatis',
				path: '/MeasureStatis',
				//element: <ReportParentRoute />,
				loader: pageLoader,
				errorElement: <ReportErrorBoundary />,
				children: [
					{
						path: '/MeasureStatis/:user_id',
						element: (
							<div style={{ display: 'flex', flexDirection: 'column' }}>
								<Headers />
								<div style={{ display: 'flex', flexDirection: 'row' }}>
									<SideBar />
									<UserList />
									<div style={{ top: '7vh', width: '100%' }}>
										<MeasureStatis />
									</div>
								</div>
								<BottomNav />
							</div>
						),
					},
				],
			},
		],
	},
]);



async function rootLoader() {
	try {
		const isAuth = await authStatus();
		if (!isAuth) {
			return redirect('/login');
		}
		return null;
	} catch (err) {
		console.log('failed to fetch refresh');
		return redirect('/login');
	}
}

async function loginLoader() {
	try {
		const isAuth = await authStatus();
		if (isAuth) {
			return redirect('/');
		}
		return null;
	} catch (err) {
		console.log('failed to fetch refresh');
	}
}

export async function reportLoader({ params }: Args) {
	// exception is handled by errorElement of react-router
	const res = await fetchUsers();
	const { status, payload } = res;
	if (isStatusOk(status)) {
		const usersResp = payload as GetUsersResp;
		const users = usersResp._data.user_profiles;
		const targetUser = users.find((u) => u.user_id === params['user_id']);
		// user_id in url path does no match with any users for the signed-in account
		if (!targetUser) {
			throw new Error('invalid path [:user_id]');
		}
		return targetUser;
	}
	// maybe due to bad request / internal server error / other network error
	throw new Error('failed to fetch users');
}

export async function pageLoader({ params }: Args) {
	// exception is handled by errorElement of react-router
	const res = await fetchUsers();
	const { status, payload } = res;
	if (isStatusOk(status)) {
		const usersResp = payload as GetUsersResp;
		const users = usersResp._data.user_profiles;
		const targetUser = users.find((u) => u.user_id === params['user_id']);
		// user_id in url path does no match with any users for the signed-in account
		if (!targetUser) {
			throw new Error('invalid path [:user_id]');
		}
		return targetUser;
	}
	// maybe due to bad request / internal server error / other network error
	throw new Error('failed to fetch users');
}

async function authStatus() {
	try {
		const res = await fetchRefresh();
		if (isStatusOk(res.status)) {
			updateTokenCookies(res.payload as GetTokenResp);
			return true;
		} else {
			clearTokenCookies();
			return false;
		}
	} catch (err) {
		console.log('fetching refresh failed 123');
		return false;
	}
}

function ReportErrorBoundary() {
	const error = useRouteError();
	console.error(error);

	return <div>failed to fetch users...</div>;
}

export default router;
