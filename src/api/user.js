import request from '../utils/request';

var getToken = sessionStorage.getItem("token");
//mock测试用例
export const fetchData = query => {
	return request({
		url: './table.json',
		method: 'get',
		params: query
	});
};
//登陆接口
export const login = ({
	username,
	password
}) => {
	const data = {
		Name: username,
		Password: password
	}
	// console.log(data)
	return request({
		url: 'api/Authroize',
		data,
		method: 'post'
	})
}

//获取用户信息
export const getUserInfo = (token = "") => {
	if (token == "") {
		token = getToken;
	}
	// console.log(getToken)
	return request({
		url: 'api/PubUser/GetAccess',
		headers: {
			Authorization: "Bearer " + token
		},
		method: 'get'
	})
}

//用户管理中获取用户的信息
export const getPage = ({
	pageSize,
	pageIndex,
	userName
}) => {
	const data = {
		"pageNum": pageIndex,
		"pageSize": pageSize,
		"field": "id",
		"order": "asc",
		"query": {
			SL_UserName: userName
		}
	}
	return request({
		url: 'api/PubUser/GetPageAdmin',
		headers: {
			Authorization: "Bearer " + getToken
		},
		method: 'post',
		data
	})
}
//查询用户信息
export const searchUser = ({	
	userName,
	userId
}) => {
	const data = {
		"pageNum": 1,
		"pageSize": 8,
		"field": "id",
		"order": "asc",
		"query": {
			SL_UserName: userName,
			SL_id:userId
		}
	}
	return request({
		url: 'api/PubUser/GetPage',
		headers: {
			Authorization: "Bearer " + getToken
		},
		method: 'post',
		data
	})
}

//修改用户操作
export const EditUser = (parms) => {
	return request({
		url: 'api/PubUser/Edit',
		headers: {
			Authorization: "Bearer " + getToken
		},
		method: 'post',
		data:parms
	})
}
//添加用户操作
export const addUser = (parms) => {
	return request({
		url: 'api/PubUser/Add',
		headers: {
			Authorization: "Bearer " + getToken
		},
		method: 'post',
		data:parms
	})
}

export const deleteUser = (id) => {	
	return request({
		url: 'api/PubUser/Delete/'+id,
		headers: {
			Authorization: "Bearer " + getToken
		},
		method: 'post'

	})
}

