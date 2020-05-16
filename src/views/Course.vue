<template>
	<div>
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item>
					<i class="el-icon-lx-cascades"></i>
					课程管理
				</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="container">
			<div class="handle-box">				
				<el-input v-model="query.courseId" placeholder="课程编号" class="handle-input mr10"></el-input>
				<el-input v-model="query.courseName" placeholder="课程名" class="handle-input mr10"></el-input>
				<el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
			</div>
			<el-card>
				<el-row :gutter="50">
					<el-col :span="2"><el-button icon="el-icon-lx-add" @click="addVisible = true" type="success" size="mini">添加课程</el-button></el-col>
				</el-row>
				<el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header" @selection-change="handleSelectionChange">
					<el-table-column type="selection" width="55" align="center"></el-table-column>
					<el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
					<el-table-column prop="courseName" label="Name"></el-table-column>
					<el-table-column label="价钱/元">
						<template slot-scope="scope">
							<span>￥{{ scope.row.price }}</span>
						</template>
					</el-table-column>
					<el-table-column label="是否停用">
						<template slot-scope="scope">
							<el-switch v-model="scope.row.stopFlag == 1" @change="userStateChanged(scope.row)"></el-switch>
						</template>
					</el-table-column>
					<el-table-column label="操作" width="240" align="center">
						<template slot-scope="scope">
							<el-button type="text" icon="el-icon-lx-people" @click="handleDistribution(scope.$index, scope.row)">分配</el-button>
							<el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
							<el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
						</template>
					</el-table-column>
				</el-table>
				<div class="pagination">
					<el-pagination
						background
						layout="total, prev, pager, next,jumper"
						:current-page="query.pageIndex"
						:page-size="query.pageSize"
						:total="pageTotal"
						@current-change="handlePageChange"
					></el-pagination>
				</div>
			</el-card>
		</div>

		<!-- 编辑弹出框 -->
		<el-dialog title="编辑" :visible.sync="editVisible" width="70%">
			<el-tabs v-model="activeName">
				<el-tab-pane label="用户课程" name="first">
					设置在轮播显示
					<el-button type="warning" icon="el-icon-star-off" circle style=" margin-bottom: 15px;" @click="addCarousel"></el-button>
					<!-- from表单区域 -->
					<el-form ref="formsRef" :model="form" label-width="70px">
						<el-form-item label="课程id"><el-input v-model="form.id" disabled></el-input></el-form-item>
						<el-form-item label="课程名称"><el-input v-model="form.courseName"></el-input></el-form-item>
						<el-form-item label="价钱"><el-input v-model="form.price"></el-input></el-form-item>
						<el-upload
							class="upload-demo"
							ref="upload"
							drag
							:action="this.loadURL.imgUrl"
							:on-success="handleVideoSuccess"
							:auto-upload="false"
							:limit="1"
						>
							<i class="el-icon-upload"></i>
							<div class="el-upload__text">
								将课程图片拖到此处，或
								<em>点击上传</em>
							</div>
							<div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
						</el-upload>
					</el-form>
				</el-tab-pane>
				<el-tab-pane label="视频管理" name="second">
					<el-upload class="upload-demo" drag action="https://jsonplaceholder.typicode.com/posts/" multiple>
						<i class="el-icon-upload"></i>
						<div class="el-upload__text">
							将文件拖到此处，或
							<em>点击上传</em>
						</div>
						<div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
					</el-upload>
				</el-tab-pane>
			</el-tabs>

			<span slot="footer" class="dialog-footer">
				<el-button @click="editVisible = false">取 消</el-button>
				<el-button type="primary" @click="saveEdit">确 定</el-button>
			</span>
		</el-dialog>

		<!-- 分配教师弹出框 -->

		<el-dialog title="分配教师" :visible.sync="distributionVisible" width="70%">
			<el-row :gutter="20" style="margin-bottom: 15px;">
				<el-col :span="16">
					<el-input placeholder="请输入内容" v-model="teaSearch" class="input-with-select">
						<el-select v-model="select" slot="prepend" placeholder="请选择" style="width: 90px;">
							<el-option label="教师ID" value="1"></el-option>
							<el-option label="教师名字" value="2"></el-option>
						</el-select>
						<el-button slot="append" icon="el-icon-search" @click="searchTea"></el-button>
					</el-input>
				</el-col>
				<el-col :span="4">
					<el-select v-model="selectResult" placeholder="请选择" style="width:150px;">
						<el-option v-for="item in searchData" :key="item.id" :label="item.realName" :value="item.id"></el-option>
					</el-select>
				</el-col>
			</el-row>
			<p>已分配的老师</p>
			<ul class="bdtop">
				<li class="icon-li" v-for="(item, index) in myTeaList" :key="item.id" style="width: 100px;">
					<div class="icon-li-content">
						<el-tag type="success" closable @close="removeTeacherById(item.id, index)" style="width: auto;">{{ item.realName }}</el-tag>
					</div>
				</li>
			</ul>

			<span slot="footer" class="dialog-footer">
				<el-button @click="distributionVisible = false">取 消</el-button>
				<el-button type="primary" @click="saveDistribution">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import { GetCourseInfo, StopCourseById, EditCourseIndfo, AllocationTeacher, CancelAllocation, GetUserByCourseId, AddCarousel } from '@/api/course.js';
import { searchUser } from '@/api/user.js';
// import { UploadImgUrl } from '@/utils/config.js';
export default {
	name: 'courseAdmin',
	data() {
		return {
			myTeaList: [],
			selectResult: '',
			searchData: [],
			queryTea: {
				userName: '',
				userId: ''
			},
			select: '1',
			teaSearch: '',
			distributionVisible: false, //分配窗口
			activeName: 'first', //页签
			query: {
				courseId: '',
				courseName: '',
				pageIndex: 1,
				pageSize: 8
			},
			tableData: [],
			multipleSelection: [],
			delList: [],
			editVisible: false,
			pageTotal: 0,
			form: {},
			idx: -1,
			id: -1
		};
	},
	created() {
		this.getData();
	},
	methods: {
		async removeTeacherById(userId, index) {
			// 弹框提示 删除
			const confirmResult = await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).catch(err => err);
			// 点击确定 返回值为：confirm
			// 点击取消 返回值为： cancel
			if (confirmResult !== 'confirm') {
				this.$message.info('已取消删除');
			} else {
				var obj = {};
				obj.courseId = this.form.id;
				obj.userId = userId;
				const res = await CancelAllocation(obj);
				if (res.code != 1) this.$message.error('取消失败');
				this.$message.success('取消成功');
				this.myTeaList.splice(index, 1);
			}
		},
		saveDistribution() {
			var data = {};
			data.userId = this.selectResult;
			// console.log(this.form)
			data.courseId = this.form.id;
			if (this.selectResult != '' && data.courseId != '')
				AllocationTeacher(data)
					.then(res => {
						// console.log(res.data);
						if (res.data == true) this.$message.success('分配成功');
						else this.$message.error('该课程已经分配这位老师');
					})
					.catch(err => {
						this.$message.error('分配失败');
					});
			this.distributionVisible = false;
			// console.log(data)
			// AllocationTeacher()
		},
		searchTea() {
			if (this.select == 1) {
				this.queryTea.courseId = this.teaSearch;
				this.queryTea.courseName = '';
			} else {
				this.queryTea.courseId = '';
				this.queryTea.courseName = this.teaSearch;
			}
			searchUser(this.queryTea)
				.then(res => {
					this.searchData = res.data;
					// console.log(this.searchData);
				})
				.catch(err => {
					this.$message.error('获取数据失败');
				});
			// console.log(res);
		},
		//课程是否停用
		async userStateChanged(row) {
			row.stopFlag == 0 ? (row.stopFlag = 1) : (row.stopFlag = 0);
			// console.log(row);
			const { data: res } = await EditCourseIndfo(row);
			if (!res) {
				this.$message.error('状态修改失败');
				return;
			}
			this.$message.success('状态修改成功');
			// console.log(data);
		},
		// 获取用户列表的数据
		async getData() {
			// fetchData(this.query).then(res => {
			//     console.log(res);
			//     this.tableData = res.list;
			//     this.pageTotal = res.pageTotal || 50;
			// });
			const res = await GetCourseInfo(this.query);
			if (res.code !== 1) {
				return this.$message.error('获取课程列表失败！');
			}
			// console.log(res);
			this.tableData = res.data;
			this.pageTotal = res.count;
		},
		// 触发搜索按钮
		handleSearch() {
			this.$set(this.query, 'pageIndex', 1);
			this.getData();
		},
		// 删除操作
		handleDelete(index, row) {
			// 二次确认删除
			this.$confirm('确定要删除吗？', '提示', {
				type: 'warning'
			})
				.then(() => {
					this.$message.success('删除成功');
					this.tableData.splice(index, 1);
				})
				.catch(() => {});
		},
		// 多选操作
		handleSelectionChange(val) {
			this.multipleSelection = val;
		},
		delAllSelection() {
			const length = this.multipleSelection.length;
			let str = '';
			this.delList = this.delList.concat(this.multipleSelection);
			for (let i = 0; i < length; i++) {
				str += this.multipleSelection[i].name + ' ';
			}
			this.$message.error(`删除了${str}`);
			this.multipleSelection = [];
		},
		// 编辑操作
		handleEdit(index, row) {
			this.idx = index;
			this.form = row;
			this.editVisible = true;
		},
		//分配操作
		handleDistribution(index, row) {
			this.distributionVisible = true;
			this.idx = index;
			this.form = row;
			// console.log(row.id);
			GetUserByCourseId(row.id)
				.then(res => {
					// console.log(res);
					if (res.code != 1) this.$message.error('获取数据失败');
					this.myTeaList = res.data;
				})
				.catch(err => {});
		},
		// 保存编辑
		async saveEdit() {
			this.editVisible = false;
			this.$message.success(`修改第 ${this.idx + 1} 行成功`);
			this.$set(this.tableData, this.idx, this.form);
			this.$refs.upload.submit();
			let data = await EditCourseIndfo(this.form);
		},
		// 分页导航
		handlePageChange(val) {
			this.$set(this.query, 'pageIndex', val);
			this.getData();
		},
		//上传成功回调
		async handleVideoSuccess(res, file) {
			console.log(res);
			this.form.imgName = res.Data;
			console.log(this.form);
			let data = await EditCourseIndfo(this.form);
			if (res.Code !== 0) this.$message.error('上传失败');
		},
		addCarousel() {
			let query = {};
			query.courseId = this.form.id;
			let res = AddCarousel(query).then(res => {
				if(res.code==-1)this.$message.error(res.msg);
				this.$message.success("成功设置课程到轮播")
				
			}).catch(err=>{this.$message.error("获取信息异常")});
		}
	},
	computed: {}
};
</script>

<style scoped>
.handle-box {
	margin-bottom: 20px;
}

.handle-select {
	width: 120px;
}

.handle-input {
	width: 300px;
	display: inline-block;
}
.table {
	width: 100%;
	font-size: 14px;
}
.red {
	color: #ff0000;
}
.mr10 {
	margin-right: 10px;
}
.table-td-thumb {
	display: block;
	margin: auto;
	width: 40px;
	height: 40px;
}
.bdtop {
	border-top: 1px solid #eee;
}
.bdbottom {
	border-bottom: 1px solid #eee;
}
.vcenter {
	display: flex;
	align-items: center;
}
.icon-li {
	display: inline-block;
	padding: 10px;
	width: 120px;
	height: 40px;
}
.icon-li-content {
	display: flex;
	height: 100%;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	cursor: pointer;
}
.icon-li-content i {
	font-size: 36px;
	color: #606266;
}
.icon-li-content span {
	margin-top: 10px;
	color: #787878;
}
</style>
