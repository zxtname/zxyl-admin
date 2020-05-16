import request from '../utils/request';

var getToken=sessionStorage.getItem("token");
//mock测试用例
export const fetchData = query => {
    return request({
        url: './table.json',
        method: 'get',
        params: query
    });
};
//登陆接口
export const login = ({ username, password }) => {
  const data = {
   Name:username,
   Password:password
  }
  // console.log(data)
  return request({
    url: 'api/Authroize',
    data,
    method: 'post'
  })
}

//获取用户信息
export const getUserInfo = (token="") => {
	if(token=="")
	{
		token=getToken;
	}
	// console.log(getToken)
  return request({
    url: 'api/PubUser/GetAccess',
    headers: {Authorization:"Bearer "+token},
    method: 'get'
  })
}

//用户管理中获取用户的信息
export const getPage = (params) => {	
  return request({
    url: 'api/PubUser/GetPage',
    headers: {Authorization:"Bearer "+getToken},
    method: 'post',
	data:params
  })
}

