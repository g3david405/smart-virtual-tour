import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import './ReportTabs.css';

interface ReportTabsProps {
	Panel1: React.ReactNode;
	Panel2: React.ReactNode;
}

interface TabPanelProps {
	children?: React.ReactNode;
	index: number;
	value: number;
}

function CustomTabPanel(props: TabPanelProps) {
	const { children, value, index, ...other } = props;

	return (
		<div
			role='tabpanel'
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}
		>
			{value === index && (
				<Box sx={{ p: 3 }}>
					<Typography>{children}</Typography>
				</Box>
			)}
		</div>
	);
}

function a11yProps(index: number) {
	return {
		id: `simple-tab-${index}`,
		'aria-controls': `simple-tabpanel-${index}`,
	};
}

export const ReportTabs: React.FC<ReportTabsProps> = ({ Panel1, Panel2 }) => {
	const [value, setValue] = React.useState(0);

	const handleChange = (event: React.SyntheticEvent, newValue: number) => {
		setValue(newValue);
	};

	return (
		<Box sx={{ width: '100%' }}>
			<Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
				<Tabs
					value={value}
					onChange={handleChange}
					aria-label='basic tabs example'
					sx={{
						'& button:hover': { color: '#0abab5' },
						'& button.Mui-selected': { color: '#0abab5' },
					}}
					TabIndicatorProps={{
						style: {
							backgroundColor: '#0abab5',
						},
					}}
				>
					<Tab label='圖表' {...a11yProps(0)} className='Tab' />
					<Tab label='記錄' {...a11yProps(1)} className='Tab' />
				</Tabs>
			</Box>
			<CustomTabPanel value={value} index={0}>
				{Panel1}
			</CustomTabPanel>
			<CustomTabPanel value={value} index={1}>
				{Panel2}
			</CustomTabPanel>
		</Box>
	);
};
