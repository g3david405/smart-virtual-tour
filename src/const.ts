export const ACCESS_TOKEN_COOKIES = 'JoygoodAccess';
export const REFRESH_TOKEN_COOKIES = 'JoygoodRefresh';

export const BASE_URL = (): string => {
	const host = window.location.hostname;
	switch (host) {
		case 'localhost':
			return 'http://localhost:8080/api';
		default:
			return '/api';
	}
};
