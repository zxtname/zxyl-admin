<template>
	<div class="album albumvideo">
		<!-- <div>
			<p>{{ uploadParm.JSONRPC }}</p>
			<div class="pic_img">
				<div class="pic_img_box">
					<el-upload
						name="Filedata"
						class="avatar-uploader"
						action="http://v.polyv.net/uc/services/rest?method=uploadfile"
						v-bind:data="uploadParm"
						v-bind:on-progress="uploadVideoProcess"
						v-bind:on-success="handleVideoSuccess"
						v-bind:before-upload="beforeUploadVideo"
						v-bind:show-file-list="false"
					>
						<i v-if="videoForm.showVideoPath == '' && !videoFlag" class="el-icon-plus avatar-uploader-icon" style="font-size: 180px;color: #F0C78A"></i>
						<el-progress v-if="videoFlag == true" type="circle" v-bind:percentage="videoUploadPercent" style="margin-top:7px;"></el-progress>
					</el-upload>														
				</div>
			</div>
		</div>
		<p class="Upload_pictures">
			<span></span>
			<span>最多可以上传1个视频，建议大小50M，推荐格式mp4</span>
		</p>
		<el-button type="primary" @click="test">测试结果</el-button> -->
		{{this.loadURL.imgUrl}}
	</div>
</template>

<script>
// const jsonpc={
// 	{"title": "测试2", "tag":"标签","desc":"描述"}
// }
export default {
	data() {
		return {
			userbarsStaus:true,
			currentUser:{
				userName:'张三',
				imgUrl:"user.jpg"				
			},
			//上传的参数
			uploadParm: {
				writetoken: 'd5163d86-94ab-4b78-8305-49478d80829e',
				JSONRPC: '{"title": "测试2", "tag":"标签","desc":"描述"}'
				// Filedata:null
			},
			videoFlag: false,
			//是否显示进度条
			videoUploadPercent: '',
			//进度条的进度，
			isShowUploadVideo: false,
			//显示上传按钮
			videoForm: {
				showVideoPath: ''
			}
			// fileList: [{name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}, {name: 'food2.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}]
		};
	},
	created() {
		// console.log(JSON.parse(this.uploadParm.JSONRPC));
	},
	methods: {
		test(){
			//login存值
			this.currentUser.userbarsStaus=this.userbarsStaus
			let str1=JSON.stringify(this.currentUser);
			sessionStorage.setItem("token",str1)
			//取值
			var obj=JSON.parse(sessionStorage.getItem("token"));
			console.log(obj.userName)
			console.log(obj.userbarsStaus)
			console.log(obj.imgUrl)
		},
		//方法
		//上传前回调
		beforeUploadVideo(file) {
			// this.Filedata=file
			var fileSize = file.size / 1024 / 1024 < 50;
			if (['video/mp4', 'video/ogg', 'video/flv', 'video/avi', 'video/wmv', 'video/rmvb', 'video/mov'].indexOf(file.type) == -1) {
				layer.msg('请上传正确的视频格式');
				return false;
			}
			if (!fileSize) {
				layer.msg('视频大小不能超过50MB');
				return false;
			}
			this.isShowUploadVideo = false;
		},
		//进度条
		uploadVideoProcess(event, file, fileList) {
			this.videoFlag = true;
			this.videoUploadPercent = file.percentage.toFixed(0) * 1;
		},
		//上传成功回调
		handleVideoSuccess(res, file) {
			console.log(res);
			console.log(file);
			this.isShowUploadVideo = true;
			this.videoFlag = false;
			this.videoUploadPercent = 0;

			//前台上传地址
			//if (file.status == 'success' ) {
			//    this.videoForm.showVideoPath = file.url;
			//} else {
			//     layer.msg("上传失败，请重新上传");
			//}

			//后台上传地址
			if (res.error == 0) {
				this.videoForm.showVideoPath = res.Data;
				this.$message.success('上传成功');
			} else {
				layer.msg(res.Message);
			}
			
		
		}
	}
};
</script>

<style></style>
