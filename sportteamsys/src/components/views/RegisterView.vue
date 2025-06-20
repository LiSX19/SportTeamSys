<template>
  <div class="register-container">
    <el-card class="register-card">
      <el-form :model="registerForm" :rules="rules" ref="registerFormRef" label-position="top">
        <div class="register-title">
          <h2>运动从此处开始</h2>
        </div>
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="registerForm.nickname" placeholder="请输入昵称"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="registerForm.password"
            type="password"
            placeholder="请输入密码"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input
            v-model="registerForm.confirmPassword"
            type="password"
            placeholder="请再次输入密码"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-select v-model="registerForm.gender" placeholder="请选择性别">
            <el-option label="Male" value="Male"></el-option>
            <el-option label="Female" value="Female"></el-option>
            <el-option label="Other" value="Other"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="生日" prop="birthday">
          <el-date-picker
            v-model="registerForm.birthday"
            type="date"
            placeholder="请选择生日"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="联系方式" prop="contact">
          <el-input v-model="registerForm.contact" placeholder="请输入联系方式"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleRegister">注册</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { ElMessage } from 'element-plus';
import axios from 'axios';

export default {
  name: 'RegisterView',
  data() {
    const validateConfirmPassword = (rule, value, callback) => {
      if (value !== this.registerForm.password) {
        callback(new Error('两次输入的密码不一致'));
      } else {
        callback();
      }
    };

    return {
      registerForm: {
        nickname: '',
        password: '',
        confirmPassword: '',
        gender: '',
        birthday: '',
        contact: ''
      },
      rules: {
        nickname: [
          { required: true, message: '请输入昵称', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '密码长度不能少于6位', trigger: 'blur' },
        ],
        confirmPassword: [
          { required: true, message: '请确认密码', trigger: 'blur' },
          { validator: validateConfirmPassword, trigger: 'blur' },
        ],
        gender: [
          { required: true, message: '请选择性别', trigger: 'change' },
        ],
        birthday: [
          { required: true, message: '请选择生日', trigger: 'change' },
        ],
        contact: [
          { required: true, message: '请输入联系方式', trigger: 'blur' },
        ],
      },
    };
  },
  methods: {
    handleRegister() {
      this.$refs.registerFormRef.validate((valid) => {
        if (valid) {
          const registerData = {
            nickname: this.registerForm.nickname,
            password: this.registerForm.password,
            gender: this.registerForm.gender,
            birthday: this.registerForm.birthday,
            phone: this.registerForm.contact,
            avatar: null
          };

          axios.post('http://localhost:8080/root/user/insertUser', registerData)
            .then((response) => {
              console.log(response);
              const uid = response.data; // 假设后端返回的数据中包含uid字段
              if (uid){
                ElMessage.success({
                  message: `注册成功！您的用户ID是: ${uid}，请牢记您的id`,
                  duration: 10000 // 消息显示10秒
                });
                this.$router.push('/login');
              }
              else {
                ElMessage.error('注册失败！');
              }
            })
        } else {
          ElMessage.error('表单验证失败！');
          return false;
        }
      });
    },
  },
};
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 50px;
  background-color: rgba(255, 255, 255, 0)
}
.register-card {
  width: 400px;
  margin-top: 20px;
  padding: 30px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  margin-bottom: 50px;
  background-color: rgba(255, 255, 255, 0.9);
}
.register-title {
  text-align: center;
  padding-bottom: 20px;
}
</style>