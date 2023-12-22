import axios, { AxiosError, AxiosRequestConfig, Method } from 'axios';
import { Cookies } from 'react-cookie';
import { ACCESS_TOKEN_COOKIES, REFRESH_TOKEN_COOKIES, BASE_URL } from '../../const';

export type ApiPayload = {
	status: number;
	payload: unknown;
};

type CallAPIArgs = {
	endpoint: string;
	authType?: string;
	method?: Method;
	body?: unknown;
};

const api = axios.create({
	baseURL: BASE_URL(),
	headers: {
		'content-type': 'application/json',
	},
});

const callApi = async ({
	authType,
	endpoint,
	method = 'get',
	body,
}: CallAPIArgs): Promise<ApiPayload> => {
	// if not clear, old interceptors will still be used
	api.interceptors.request.clear();

	api.interceptors.request.use((config) => {
		const cookies = new Cookies();
		let token: string;
		switch (authType) {
			default:
			case 'access_token':
				token = cookies.get(ACCESS_TOKEN_COOKIES) || '';
				break;
			case 'refresh_token':
				token = cookies.get(REFRESH_TOKEN_COOKIES) || '';
				break;
		}

		if (token.length) {
			config.headers.Authorization = `Bearer ${token}`;
		}

		return config;
	});

	try {
		const requestConfig: AxiosRequestConfig = {
			url: endpoint,
			method,
			data: body,
		};
		// 如果 status 不在 200 ~ 300 之間，axios 會直接 throw error
		const { data, status } = await api.request(requestConfig);

		return { status, payload: data };
	} catch (error) {
		const err = error as AxiosError;
		if (err.isAxiosError && err.response) {
			const { status } = err.response;

			if (status === 401) {
				const cookies = new Cookies();
				cookies.remove(ACCESS_TOKEN_COOKIES, { path: '/' });
				cookies.remove(REFRESH_TOKEN_COOKIES, { path: '/' });
				if (window.location.pathname !== '/login') {
					window.location.href = '/login';
				}
			}

			return {
				status,
				payload: err.response?.data,
			};
		}

		if (error instanceof Error) {
			console.warn(`[callAPI] Error occurred when call ${endpoint} (${error.message})`);

			return {
				status: 500,
				payload: err.response?.data,
			};
		}

		return {
			status: 500,
			payload: err.response?.data,
		};
	}
};

export const isStatusOk = (statusCode: number) => statusCode >= 200 && statusCode < 300;

export default callApi;
