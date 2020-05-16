import request from '../utils/request';

var getToken = sessionStorage.getItem("token");

//获取课程的信息
export const GetCourseInfo = ({
	pageSize,
	pageIndex,
	courseName,
	courseId
}) => {
	const data = {
		"pageNum": pageIndex,
		"pageSize": pageSize,
		"field": "id",
		"order": "asc",
		"query": {
			SL_courseName: courseName,
			SL_id: courseId
		}
	}
	return request({
		url: '/api/Course/GetCourseInfoAdmin',
		data,
		method: 'post'
	})
}
//修改课程的信息
export const EditCourseIndfo = (params) => {
	const model = {
		"id": params.id,
		"courseName": params.courseName,
		"imgUrl": params.imgUrl,
		"price": params.price,		
		"courseAudit": params.courseAudit,
		"stopFlag": params.stopFlag,
		"imgName": params.imgName,
		"isFree": params.isFree,
		"courseCode": params.courseCode,
		"isMadical": params.isMadical,
		"classfyName": params.classfyName
	}
	return request({
		url: '/api/Course/EditCourse',
		data: params,
		method: 'post'
	})
}
//是否停用课程
export const StopCourseById = (id) => {
	const data = id;
	return request({
		url: '/api/Course/DeleteCourse',
		data,
		method: 'post'
	})
}

export const SearchCourse = ({	
	courseName,
	courseId
}) => {
	const data = {
		"pageNum": 1,
		"pageSize": 8,
		"field": "id",
		"order": "asc",
		"query": {
			SL_courseName: courseName,
			SEB_id:courseId
		}
	}
	return request({
		url: '/api/Course/GetCourseInfo',
		data,
		method: 'post'
	})
}
//分配教师操作
export const AllocationTeacher=(data)=>{
	// console.log(data)
	return request({	
		url: '/api/Course/AllocationTeacher',
		data,
		method: 'post'
	})
}
//显示课程的老师
export const GetUserByCourseId=(id)=>{
	// console.log(id)
	return request({	
		url: '/api/Course/GetUserByCourseId',
		params:{id:id},
		method: 'get'
	})
}
//取消老师的分配
export const CancelAllocation=(data)=>{
	return request({	
		url: '/api/Course/CancelAllocation',
		data,
		method: 'post'
	})
}

//轮播的信息
export const GetcarouselInfo=()=>{
	return request({	
		url: '/api/Course/GetcarouselInfo',
		
		method: 'get'
	})
}
//添加轮播的信息
export const AddCarousel=(data)=>{
	return request({
		url: '/api/Course/AddCarousel',
		data,
		method: 'post'
	})
}
//修改轮播的信息
export const EditCarousel=(data)=>{
	return request({
		url: '/api/Course/EditCarousel',
		data,
		method: 'post'
	})
}



