import request from '../utils/request';

var getToken = sessionStorage.getItem("token");

//获取课程的信息
export const GetCourseInfo = ({
	pageSize,
	pageIndex
}) => {
	const data = {
		"pageNum": pageIndex,
		"pageSize": pageSize
	}
	return request({
		url: 'api/Teacher/GetCourseInfo',
		headers: {
			Authorization: "Bearer " + getToken
		},
		data,
		method: 'post'
	})
}
//添加课程
export const AddCourse = (data) => {
	return request({
	url: 'api/Teacher/AddCourse',
	headers: {
		Authorization: "Bearer " + getToken
	},
	data,
	method: 'post',
	})
}
//获取课程的信息
export const GetVideo = ({
	pageSize,
	pageIndex,
	videoName
}) => {
	const data = {
		"pageNum": pageIndex,
		"pageSize": pageSize,
		"query": {
			SL_vName: videoName
		}
	}
	console.log(data)
	return request({
		url: 'api/Teacher/GetVideoInfo',
		headers: {
			Authorization: "Bearer " + getToken
		},
		data,
		method: 'post'
	})
}

