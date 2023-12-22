export type UserProfile = {
	birthday: string;
	display_name: string;
	gender: string;
	height: number;
	id_number: string;
	photo_url: string;
	user_id: string;
	weight: number;
};

export type UserProfiles = {
	user_profiles: UserProfile[];
};

export type GetUsersResp = {
	_data: UserProfiles;
	_id: string;
};
