import request from '../utils/request';

var getToken = sessionStorage.getItem("token");

//获取课程的信息
export const GetVideoInfo = ({
	pageSize,
	pageIndex,
	courseName
}) => {
	const data = {
		"pageNum": pageIndex,
		"pageSize": pageSize,
		"field": "id",
		"order": "asc",
		"query": {
			SL_vName: courseName
		}
	}
	return request({
		url: '/api/Video/VideoInfoAdmin',
		data,
		method: 'post'
	})
}
//修改课程的信息
export const EditVideoIndfo = (params) => {
	return request({
		url: '/api/Video/EditVideo',
		data: params,
		method: 'post'
	})
}
//增加视频
export const AddVideo = (model) => {
	return request({
		url: '/api/Video/Add',
		data:model,
		method: 'post'
	})
}

