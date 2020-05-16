<template>
	<div class="sidebar">
		<el-menu
			class="sidebar-el-menu"
			:default-active="onRoutes"
			:collapse="collapse"
			background-color="#324157"
			text-color="#bfcbd9"
			active-text-color="#20a0ff"
			unique-opened
			router
		>
			<template v-for="item in items">
				<template v-if="item.subs">
					<el-submenu :index="item.index" :key="item.index">
						<template slot="title">
							<i :class="item.icon"></i>
							<span slot="title">{{ item.title }}</span>
						</template>
						<template v-for="subItem in item.subs">
							<el-submenu v-if="subItem.subs" :index="subItem.index" :key="subItem.index">
								<template slot="title">
									{{ subItem.title }}
								</template>
								<el-menu-item v-for="(threeItem, i) in subItem.subs" :key="i" :index="threeItem.index">{{ threeItem.title }}</el-menu-item>
							</el-submenu>
							<el-menu-item v-else :index="subItem.index" :key="subItem.index">{{ subItem.title }}</el-menu-item>
						</template>
					</el-submenu>
				</template>
				<template v-else>
					<el-menu-item :index="item.index" :key="item.index">
						<i :class="item.icon"></i>
						<span slot="title">{{ item.title }}</span>
					</el-menu-item>
				</template>
			</template>
		</el-menu>
	</div>
</template>

<script>
import bus from '../common/bus';
export default {
	data() {
		return {
			collapse: false,
			items: [
				{
					icon: 'el-icon-lx-people',
					index: 'useradmin',
					title: '用户管理'
				},
				{
					icon: 'el-icon-lx-read',
					index: 'course',
					title: '课程管理'
				},
				{
					icon: 'el-icon-lx-newsfill',
					index: 'videoadmin',
					title: '视频管理'
				},
				{
					icon: 'el-icon-lx-tagfill',
					index: 'carousel',
					title: '广告管理'
				},
				// {
				// 	icon: 'el-icon-lx-home',
				// 	index: 'icon',
				// 	title: '图标'
				// },
				// {
				// 	icon: 'el-icon-lx-home',
				// 	index: 'test',
				// 	title: '测试用例'
				// }
			],
			itemsTea: [
				{
					icon: 'el-icon-lx-read',
					index: 'mycourses',
					title: '我的课程'
				},
				{
					icon: 'el-icon-lx-newsfill',
					index: 'myvideos',
					title: '我的视频'
				},
				// {
				// 	icon: 'el-icon-lx-home',
				// 	index: 'icon',
				// 	title: '图标'
				// },
				// {
				// 	icon: 'el-icon-lx-home',
				// 	index: 'test',
				// 	title: '测试用例'
				// }
			]
		};
	},
	computed: {
		onRoutes() {
			return this.$route.path.replace('/', '');
		}
	},
	created() {
		// 通过 Event Bus 进行组件间通信，来折叠侧边栏
		bus.$on('collapse', msg => {
			this.collapse = msg;
			bus.$emit('collapse-content', msg);
		});
		let userName=localStorage.getItem('ms_username');
		if(userName	!='admin')
		this.items=this.itemsTea;
	}
};
</script>

<style scoped>
.sidebar {
	display: block;
	position: absolute;
	left: 0;
	top: 70px;
	bottom: 0;
	overflow-y: scroll;
}
.sidebar::-webkit-scrollbar {
	width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
	width: 250px;
}
.sidebar > ul {
	height: 100%;
}
</style>
