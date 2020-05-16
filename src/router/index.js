import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [{
		path: '/',
		redirect: '/test'
	},
	{
		path: '/',
		component: () => import( /* webpackChunkName: "home" */ '../components/common/Home.vue'),
		meta: {
			title: '自述文件'
		},
		children: [{
				path: '/test',
				component: () => import('@/components/page/test.vue'),
				meta: {
					title: '测试用例'
				}
			},
			{
				path: '/useradmin',
				component: () => import( /* webpackChunkName: "dashboard" */ '@/views/UserAdmin.vue'),
				meta: {
					title: '用户管理'
				}
			},
			{
				path: '/course',
				component: () => import( /* webpackChunkName: "dashboard" */ '@/views/Course.vue'),
				meta: {
					title: '课程管理'
				}
			},
			{
				path: '/videoadmin',
				component: () => import( /* webpackChunkName: "dashboard" */ '@/views/video.vue'),
				meta: {
					title: '视频管理'
				}
			},
			{
				path: '/carousel',
				component: () => import( /* webpackChunkName: "dashboard" */ '@/views/carousel.vue'),
				meta: {
					title: '广告管理'
				}
			},
			{
				path: '/mycourses',
				component: () => import( /* webpackChunkName: "dashboard" */ '@/views/myCourses.vue'),
				meta: {
					title: '我的课程'
				}
			},
			{
				path: '/myvideos',
				component: () => import( /* webpackChunkName: "dashboard" */ '@/views/myVideo.vue'),
				meta: {
					title: '我的视频'
				}
			},
			{
				path: '/icon',
				component: () => import( /* webpackChunkName: "icon" */ '../components/page/Icon.vue'),
				meta: {
					title: '自定义图标'
				}
			},
			{
				path: '/table',
				component: () => import( /* webpackChunkName: "table" */ '../components/page/BaseTable.vue'),
				meta: {
					title: '基础表格'
				}
			},
			{
				path: '/tabs',
				component: () => import( /* webpackChunkName: "tabs" */ '../components/page/Tabs.vue'),
				meta: {
					title: 'tab选项卡'
				}
			},			
			{
				// 权限页面
				path: '/permission',
				component: () => import( /* webpackChunkName: "permission" */ '../components/page/Permission.vue'),
				meta: {
					title: '权限测试',
					permission: true
				}
			},
			{
				path: '/404',
				component: () => import( /* webpackChunkName: "404" */ '../components/page/404.vue'),
				meta: {
					title: '404'
				}
			},
			{
				path: '/403',
				component: () => import( /* webpackChunkName: "403" */ '../components/page/403.vue'),
				meta: {
					title: '403'
				}
			}			
		]
	},
	{
		path: '/login',
		component: () => import( /* webpackChunkName: "login" */ '../components/page/Login.vue'),
		meta: {
			title: '登录'
		}
	},
	{
		path: '*',
		redirect: '/404'
	}
]

const router = new VueRouter({
	routes
})

router.beforeEach((to, from, next) => {
	// 访问登录页，放行
	if (to.path === '/login') return next()
	// 获取token
	const tokenStr = window.sessionStorage.getItem('token')
	// console.log(tokenStr);
	// 没有token, 强制跳转到登录页
	if (!tokenStr) return next('/login')
	next()
})

export default router
