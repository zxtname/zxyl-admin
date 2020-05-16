<template>
	<div>
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item>
					<i class="el-icon-lx-cascades"></i>
					用户管理
				</el-breadcrumb-item>
			</el-breadcrumb>
		</div>

		<div class="container">
			<div class="handle-box">
				<el-input v-model="query.userName" placeholder="用户名" class="handle-input mr10"></el-input>
				<el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
			</div>
			<el-card>
				<el-row :gutter="50">
					<el-col :span="3"><el-button icon="el-icon-lx-add" @click="addVisible = true" type="success" size="mini">添加用户</el-button></el-col>
					<el-col :span="2"><el-button type="warning" icon="el-icon-delete" @click="delAllSelection" size="mini">批量删除</el-button></el-col>
				</el-row>
				<el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header" @selection-change="handleSelectionChange">
					<el-table-column type="selection" width="55" align="center"></el-table-column>
					<el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
					<el-table-column prop="userName" label="Name"></el-table-column>
					<el-table-column prop="realName" label="真的名字"></el-table-column>
					<el-table-column prop="tel" label="电话号码"></el-table-column>
					<el-table-column label="是否停用">
						<template slot-scope="scope">
							<el-switch v-model="scope.row.stopFlag" @change="userStateChanged(scope.row)"></el-switch>
						</template>
					</el-table-column>
					<el-table-column label="操作" width="180" align="center">
						<template slot-scope="scope">
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
		<el-dialog title="编辑用户信息" :visible.sync="editVisible" width="70%">
			<!-- from表单区域 -->
			<el-form ref="formsRef" :model="form" label-width="70px">
				<el-form-item label="用户id"><el-input v-model="form.id" disabled></el-input></el-form-item>
				<el-form-item label="用户名"><el-input v-model="form.userName"></el-input></el-form-item>
				<el-form-item label="真名"><el-input v-model="form.realName"></el-input></el-form-item>
				<el-form-item label="电话"><el-input v-model="form.tel"></el-input></el-form-item>
				<el-form-item label="密码"><el-input v-model="form.userPwd"></el-input></el-form-item>
				<!-- 上传功能 -->
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
						将上传的头像拖到此处，或
						<em>点击上传</em>
					</div>
					<div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
				</el-upload>
			</el-form>

			<span slot="footer" class="dialog-footer">
				<el-button @click="editVisible = false">取 消</el-button>
				<el-button type="primary" @click="saveEdit">确 定</el-button>
			</span>
		</el-dialog>

		<!-- 添加用户的弹窗 -->
		<el-dialog title="添加用户" :visible.sync="addVisible" width="50%">
			<!-- addfrom表单区域 -->
			<el-form ref="addFormRef" :model="addForm" :rules="addFormRules" label-width="70px">
				<el-form-item label="用户名" prop="userName"><el-input v-model="addForm.userName"></el-input></el-form-item>
				<el-form-item label="电话" prop="tel"><el-input v-model="addForm.tel"></el-input></el-form-item>
				<el-form-item label="密码" prop="userPwd"><el-input v-model="addForm.userPwd"></el-input></el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="addVisible = false">取 消</el-button>
				<el-button type="primary" @click="addSave">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
// import { GetCourseInfo, StopCourseById, EditCourseIndfo } from '@/api/course.js';
import { getPage, EditUser, addUser, deleteUser } from '@/api/user.js';
export default {
	name: 'courseAdmin',
	data() {
		return {
			activeName: 'first', //页签
			query: {
				userName: '',
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
			id: -1,
			addVisible: false, //增加用户显示隐藏
			addForm: {
				userName: '',
				tel: '',
				userPwd: ''
			},
			//添加用户验证规则
			addFormRules: {
				userName: [{ required: true, message: '请输入名称', trigger: 'blur' }, { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }],
				tel: [{ required: true, message: '请输入电话号码', trigger: 'blur' }],
				userPwd: [{ required: true, message: '用户密码', trigger: 'blur' }, { min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur' }]
			}
		};
	},
	created() {
		this.getData();
		// console.log(this.tableData)
	},
	methods: {
		//课程是否停用
		async userStateChanged(row) {
			// row.stopFlag == 0 ? (row.stopFlag = 1) : (row.stopFlag = 0);
			// // console.log(row);
			const { data: res } = await deleteUser(row.id);
			console.log(row.stopFlag);
			if (!res) {
				this.$message.error('状态修改失败');
				return;
			}
			this.$message.success('状态修改成功');
			// console.log(data);
		},
		// 获取用户列表的数据
		async getData() {
			const res = await getPage(this.query);
			if (res.code !== 1) {
				return this.$message.error('获取用户列表失败！');
			}
			// console.log(res);
			this.tableData = res.data;
			this.pageTotal = res.count;
		},
		addSave() {
			// 表单预验证
			// valid：bool类型
			this.$refs.addFormRef.validate(async valid => {
				// console.log(valid)
				if (!valid) return false;
				let { data: res } = await addUser(this.addForm);
				console.log(res);
			});
			// this.addVisible = true;
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
		// 保存编辑
		async saveEdit() {
			this.editVisible = false;
			this.$message.success(`修改第 ${this.idx + 1} 行成功`);
			this.$set(this.tableData, this.idx, this.form);
			this.$refs.upload.submit();

			let data = await EditUser(this.form);
		},
		// 分页导航
		handlePageChange(val) {
			this.$set(this.query, 'pageIndex', val);
			this.getData();
		},
		//上传成功回调
		async handleVideoSuccess(res, file) {
			console.log(res);
			this.form.headUrl = res.Data;
			console.log(this.form);
			let data = await EditUser(this.form);
			if (res.Code !== 0) this.$message.error('上传失败');
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
</style>
