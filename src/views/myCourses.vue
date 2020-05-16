<template>
	<div>
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item>
					<i class="el-icon-lx-cascades"></i>
					我的课程
				</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="container">			
			<el-card>
				<div slot="header" class="clearfix">
				    <span>我的课程</span>
				  </div>
				  <el-row :gutter="50">
				  	<el-col :span="2"><el-button icon="el-icon-lx-add" @click="addVisible = true" type="success" size="mini">添加课程</el-button></el-col>
				  </el-row>
				<el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header" @selection-change="handleSelectionChange">
					<!-- <el-table-column type="selection" width="55" align="center"></el-table-column> -->
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

			<span slot="footer" class="dialog-footer">
				<el-button @click="editVisible = false">取 消</el-button>
				<el-button type="primary" @click="saveEdit">确 定</el-button>
			</span>
		</el-dialog>
		
		<!-- 增加课程弹出框 -->
		<el-dialog title="添加课程" :visible.sync="addVisible" width="70%">			
					<el-form ref="addFormRef" :model="addForm" :rules="addFormRules" label-width="70px">
						<el-form-item label="课程名称" prop="courseName"><el-input v-model="addForm.courseName"></el-input></el-form-item>
						<el-form-item label="价钱" prop="price"><el-input type='number' v-model="addForm.price" min=0></el-input></el-form-item>
						<el-form-item label="课程图片" prop="imgName"><el-input v-model="addForm.imgName" disabled></el-input></el-form-item>
						<el-upload
							class="upload-demo"
							ref="upload"
							drag
							:action="this.loadURL.imgUrl"
							:on-success="handleVideoSuccess"							
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
				<el-button @click="addVisible = false">取 消</el-button>
				<el-button type="primary" @click="saveAdd">确 定</el-button>
			</span>
		</el-dialog>
		
	</div>
</template>

<script>
import { StopCourseById, EditCourseIndfo, AllocationTeacher, CancelAllocation, GetUserByCourseId } from '@/api/course.js';
import {GetCourseInfo ,AddCourse} from '@/api/teacher.js';
import { searchUser } from '@/api/user.js';
// import { UploadImgUrl } from '@/utils/config.js';
export default {
	name: 'courseAdmin',
	data() {
		return {
			addForm: {
				courseName: '',
				imgName: '',
				price: ''
			},
			//添加用户验证规则
			addFormRules: {
				courseName: [{ required: true, message: '请输入课程名称', trigger: 'blur' }],
				imgName: [{ required: true, message: '请输入图片名称', trigger: 'blur' }],
				price: [{ required: true, message: '请输入价钱', trigger: 'blur' }]
			},
			addVisible:false,
			query: {				
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
		saveAdd(){
			this.$refs.addFormRef.validate(async valid => {
				// console.log(valid)
				if (!valid) return false;
				
				let { data: res } = await AddCourse(this.addForm);
				// console.log(res);
				if(!res) this.$message.error("添加课程失败")
				else this.$message.success("添加课程成功");
			});
			this.addVisible=false;
			
		},
		async removeTeacherById(userId,index) {
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
				if(res.code!=1)
				this.$message.error('取消失败')
				this.$message.success("取消成功")
				this.myTeaList.splice(index, 1);
				
			}
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
		handleVideoSuccess(res, file) {
			console.log(res);
			this.addForm.imgName = res.Data;			
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
