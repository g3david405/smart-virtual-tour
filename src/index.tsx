import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import router from 'router';
import './index.css';
import { ThemeProvider, createTheme } from '@mui/material';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

const theme = createTheme({
	typography: {
		fontFamily: 'Roboto, "Noto Sans TC", sans-serif',
	},
});

root.render(
	<React.StrictMode>
		<ThemeProvider theme={theme}>
			<RouterProvider router={router}></RouterProvider>
		</ThemeProvider>
	</React.StrictMode>,
);
