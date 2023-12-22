import { ACCESS_TOKEN_COOKIES, REFRESH_TOKEN_COOKIES } from '../const';
import { Cookies } from 'react-cookie';

type tokens = {
	access_token: string;
	refresh_token: string;
};

export type GetTokenResp = {
	_data: tokens;
	_id: string;
};

export const updateTokenCookies = (jwt: GetTokenResp) => {
	const cookies = new Cookies();
	cookies.set(ACCESS_TOKEN_COOKIES, jwt._data.access_token, { path: '/' });
	cookies.set(REFRESH_TOKEN_COOKIES, jwt._data.refresh_token, { path: '/' });
};

export const clearTokenCookies = () => {
	const cookies = new Cookies();
	cookies.remove(ACCESS_TOKEN_COOKIES, { path: '/' });
	cookies.remove(REFRESH_TOKEN_COOKIES, { path: '/' });
};
