import React from 'react';
import { NavLink } from 'react-router-dom';
import './SideBar.css';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { useParams } from 'react-router-dom';
export const SideBar = () => {
	const { user_id } = useParams<{ user_id: string }>();

	return (
		<div className='sidebar'>
			<nav>
				<NavLink
					to={`/report/${user_id}`}
					className={({ isActive }) => (isActive ? 'words active' : 'words')}
				>
					<StarBorderIcon />
					數據
				</NavLink>
				<NavLink
					to={`/LittleHelper/${user_id}`}
					className={({ isActive }) => (isActive ? 'words active' : 'words')}
				>
					<StarBorderIcon />
					小幫手
				</NavLink>
				<NavLink
					to={`/MeasureStatis/${user_id}`}
					className={({ isActive }) => (isActive ? 'words active' : 'words')}
				>
					<StarBorderIcon />
					量表
				</NavLink>
				<NavLink
					to={`/Account/${user_id}`}
					className={({ isActive }) => (isActive ? 'words active' : 'words')}
				>
					<StarBorderIcon />
					帳戶
				</NavLink>
			</nav>
		</div>
	);
};
