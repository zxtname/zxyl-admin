<template>
	<div>
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item>
					<i class="el-icon-lx-cascades"></i>
					广告管理
				</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="container">
			<el-card>
				<div slot="header" class="clearfix"><span>轮播广告</span></div>
				<el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header" @selection-change="handleSelectionChange">
					<el-table-column prop="courseId" label="ID" width="55" align="center"></el-table-column>
					<el-table-column prop="courseName" label="Name"></el-table-column>
					<el-table-column prop="createTime" label="创建时间"></el-table-column>
					<el-table-column prop="deadline" label="期限时间"></el-table-column>
					<el-table-column label="是否停用">
						<template slot-scope="scope">
							<el-switch v-model="scope.row.stopFlag == 1" @change="userStateChanged(scope.row)"></el-switch>
						</template>
					</el-table-column>
					<el-table-column label="操作" width="180" align="center">
						<template slot-scope="scope">
							<el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
							<el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
						</template>
					</el-table-column>
				</el-table>
			</el-card>
		</div>

		<!-- 编辑弹出框 -->
		<el-dialog title="轮播修改" :visible.sync="editVisible" width="70%">
			<el-form ref="formsRef" :model="form" label-width="70px">
				<el-form-item label="轮播的Id"><el-input v-model="form.id" disabled></el-input></el-form-item>
				<!-- <el-form-item label="课程图片"><el-input v-model="form.imgUrl"></el-input></el-form-item> -->
				<el-form-item label="设置月数"><el-input v-model="form.Month"></el-input></el-form-item>
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

			<span slot="footer" class="dialog-footer">
				<el-button @click="editVisible = false">取 消</el-button>
				<el-button type="primary" @click="saveEdit">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import { GetcarouselInfo, EditCarousel } from '@/api/course.js';
export default {
	name: 'courseAdmin',
	data() {
		return {
			tableData: [],
			multipleSelection: [],
			delList: [],
			editVisible: false,
			form: {},
			idx: -1
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
		//课程是否停用
		async userStateChanged(row) {
			row.stopFlag == 0 ? (row.stopFlag = 1) : (row.stopFlag = 0);
			let query={};
			query.id = row.id;
			query.stopFlag=row.stopFlag;
			const { data: res } = await EditCarousel(query);
			// console.log(res)
			if (!res) {
				this.$message.error('状态修改失败');
				return;
			}
			this.$message.success('状态修改成功');
			// console.log(data);
		},
		// 获取用户列表的数据
		async getData() {
			const res = await GetcarouselInfo();
			if (res.code !== 1) {
				return this.$message.error('获取数据表失败！');
			}
			// console.log(res);
			this.tableData = res.data;
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
			let query = {};
			query.id = this.form.id;
			query.deadline=this.form.deadline;
			query.Month = this.form.Month;
			// console.log(query)
			let { data: res } = await EditCarousel(query);
			if (res.code != 1) this.$message.error("修改失败");
			this.$message.success("操作成功");
		},
		//上传成功回调
		async handleVideoSuccess(res, file) {
			// console.log(res);
			// this.form.imgName = res.Data;
			// console.log(this.form);
			// let data = await EditCourseIndfo(this.form);
			// if (res.Code !== 0) this.$message.error('上传失败');
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
