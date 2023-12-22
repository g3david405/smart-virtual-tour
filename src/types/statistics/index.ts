// this is what the backend return
export type statistic = {
	name: string;
	min: number;
	max: number;
	mean: number;
	count: number;
	abnormal_count: number;
};

export type GetStatisticsResp = {
	_data: statistic[];
	_id: string;
};
