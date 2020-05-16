<template>
	<div>		
		<div class="container" style="height: 700px;">
			<div class="handle-box">
				<!-- <el-button type="primary" icon="el-icon-lx-add" @click="delAllSelection">添加用户</el-button>
				<el-button type="primary" icon="el-icon-delete" class="handle-del mr10" @click="delAllSelection">批量删除</el-button> -->
				<el-input v-model="query.courseName" placeholder="视频名" class="handle-input mr10"></el-input>
				<el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
			</div>
			<el-card style="height: 600px;">
				<el-row :gutter="50">
					<el-col :span="2"><el-button icon="el-icon-lx-add" @click="addVisible = true" type="success" size="mini">添加视频</el-button></el-col>
				</el-row>
				<el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header" @selection-change="handleSelectionChange">
					<el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
					<el-table-column prop="vName" label="视频名称"></el-table-column>
					<el-table-column prop="videoName" label="文件存放名称"></el-table-column>
					<el-table-column prop="videoType" label="视频类型"></el-table-column>
					<el-table-column prop="courseName" label="课程名称"></el-table-column>
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
			<!-- from表单区域 -->
			<el-form ref="formsRef" :model="form" label-width="70px">
				<el-form-item label="课程id"><el-input v-model="form.id" disabled></el-input></el-form-item>
				<el-form-item label="视频名称"><el-input v-model="form.vName"></el-input></el-form-item>
				<el-form-item label="视频类型"><el-input v-model="form.videoType"></el-input></el-form-item>
				<el-form-item label="视频链接" disabled><el-input v-model="form.videoUrl"></el-input></el-form-item>
				<el-upload class="upload-demo" ref="upload" drag :action="this.loadURL.videoUrl" :on-success="handleVideoSuccess" :limit="1">
					<i class="el-icon-upload"></i>
					<div class="el-upload__text">
						将视频拖到此处，或
						<em>点击上传</em>
					</div>
					<div class="el-upload__tip" slot="tip">请上传视频文件</div>
				</el-upload>
			</el-form>

			<span slot="footer" class="dialog-footer">
				<el-button @click="editVisible = false">取 消</el-button>
				<el-button type="primary" @click="saveEdit">确 定</el-button>
			</span>
		</el-dialog>

		<!-- 添加视频的弹窗 -->
		<el-dialog title="添加视频" :visible.sync="addVisible" width="50%">
			<!-- addfrom表单区域 -->
			<el-form ref="addFormRef" :model="addForm" :rules="addFormRules" label-width="80px">
				<el-row :gutter="20" style="margin-bottom: 15px;">
					<el-col :span="16" style="margin-left: 15px;">
						<el-input placeholder="请搜索课程,输入id或者课程名" v-model="searchText" class="input-with-select">
							<el-select v-model="select" :label="selectname" slot="prepend" placeholder="请选择">
								<el-option label="课程名字" value="1"></el-option>
								<el-option label="课程Id" value="2"></el-option>
							</el-select>
							<el-button slot="append" icon="el-icon-search" @click="searchCourse"></el-button>
						</el-input>
					</el-col>
					<el-col :span="4">
						<el-select v-model="addForm.crouserId" placeholder="请选择" style="width:150px;">
							<el-option v-for="item in options" :key="item.id" :label="item.courseName" :value="item.id"></el-option>
						</el-select>
					</el-col>
				</el-row>
				<el-form-item label="视频名称" prop="vName"><el-input v-model="addForm.vName"></el-input></el-form-item>
				<el-form-item label="视频链接" prop="videoUrl"><el-input v-model="addForm.videoUrl" disabled></el-input></el-form-item>
				<el-form-item label="课程id" prop="crouserId"><el-input v-model="addForm.crouserId" disabled></el-input></el-form-item>
			</el-form>
			<el-upload class="upload-demo" ref="addUpload" drag :action="this.loadURL.videoUrl" :on-success="addVideoSuccess" :limit="1">
				<i class="el-icon-upload"></i>
				<div class="el-upload__text">
					将视频拖到此处，或
					<em>点击上传</em>
				</div>
				<div class="el-upload__tip" slot="tip">只能上传视频文件</div>
			</el-upload>
			<span slot="footer" class="dialog-footer">
				<el-button @click="addVisible = false">取 消</el-button>
				<el-button type="primary" @click="addSave">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import { GetVideoInfo, EditVideoIndfo, AddVideo } from '@/api/video.js';
import { SearchCourse } from '@/api/course.js';
// import { UploadImgUrl } from '@/utils/config.js';
export default {
	data() {
		return {
			options: [],
			searchText: '',
			selectname: '',
			select: '1',
			queryCourse: {
				courseName: '',
				courseId: ''
			},
			addVisible: false,
			addForm: {
				vName: '',
				videoUrl: '',
				crouserId: ''
			},
			//添加视频验证规则
			addFormRules: {
				vName: [{ required: true, message: '请输入名称', trigger: 'blur' }, { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }],
				videoUrl: [{ required: true, message: '请上传视频', trigger: 'blur' }],
				crouserId: [{ required: true, message: '请选择用户Id', trigger: 'blur' }]
			},
			query: {
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
		async searchCourse() {
			if (this.select == 1) {
				this.queryCourse.courseName = this.searchText;
				this.queryCourse.courseId = '';
			} else {
				this.queryCourse.courseId = this.searchText;
				this.queryCourse.courseName = '';
			}
			let res = await SearchCourse(this.queryCourse);
			console.log(res);
			this.options = res.data;
		},
		addSave() {
			var that=this.addForm;			
			this.$refs.addFormRef.validate(async valid => {
				if (!valid) return false;
				let { data: res } = await AddVideo(that);
				if (!res) {
					this.$message.error('新增失败');
				} else {
					this.$message.success('新增成功');
					this.$refs.addFormRef.resetFields();
				}
				this.getData();
			});			
			this.addVisible = false;
		},
		//课程是否停用
		async userStateChanged(row) {
			row.stopFlag == 0 ? (row.stopFlag = 1) : (row.stopFlag = 0);
			// console.log(row);
			const { data: res } = await EditVideoIndfo(row);
			if (!res) {
				this.$message.error('状态修改失败');
				return;
			}
			this.$message.success('状态修改成功');
			// console.log(data);
		},
		// 获取用户列表的数据
		async getData() {
			let userName = localStorage.getItem('ms_username');
			if (userName != 'admin') {
				
			} else {
				const res = await GetVideoInfo(this.query);
				if (res.code !== 1) {
					return this.$message.error('获取课程列表失败！');
				}
				// console.log(res);
				this.tableData = res.data;
				this.pageTotal = res.count;
			}
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
			// this.$refs.upload.submit();
			let data = await EditVideoIndfo(this.form);
		},
		// 分页导航
		handlePageChange(val) {
			this.$set(this.query, 'pageIndex', val);
			this.getData();
		},
		//上传成功回调
		async handleVideoSuccess(res, file) {
			// console.log(res);
			// console.log(this.form);
			if (res.Code !== 0) this.$message.error('上传失败');
			this.form.videoUrl = res.Data;
			this.$refs.upload.clearFiles();
			this.$message.success('视频上传成功');
			let data = await EditVideoIndfo(this.form);
		},
		addVideoSuccess(res, file) {
			if (res.Code !== 0) this.$message.error('上传失败');
			this.addForm.videoUrl = res.Data;
			this.$refs.addUpload.clearFiles();
			this.$message.success('视频上传成功');
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
.el-select .el-input {
	width: 130px;
}
.input-with-select .el-input-group__prepend {
	background-color: #fff;
}
</style>
