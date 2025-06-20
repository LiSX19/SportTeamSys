
<template>
  <div class="login-container">
    <el-card class="login-card">
      <el-form :model="loginForm" :rules="rules" ref="loginFormRef" label-position="top">
        <div class="login-title">
          <h2>用户登录</h2>
        </div>
        <el-form-item label="用户ID" prop="uid">
          <el-input
            v-model.number="loginForm.uid"
            prefix-icon="el-icon-user"
            placeholder="请输入用户ID"
          ></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            prefix-icon="el-icon-lock"
            placeholder="请输入密码"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleLogin">登录</el-button>
          <el-button @click="resetForm">重置</el-button>
          <el-button @click="goToRegister">去注册</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { ElMessage } from 'element-plus';
import axios from 'axios';

export default {
  name: 'LoginView',
    mounted() {
    this.$nextTick(() => {
      if (this.$refs.loginFormRef) {
        this.$refs.loginFormRef.clearValidate();
      } else {
        console.error('表单引用初始化失败');
        this.$forceUpdate(); // 强制更新视图
      }
    });
  },
  data() {
    return {
      loginForm: {
        uid: null,
        password: '',
      },
      rules: {
        uid: [{ required: true, message: '请输入用户ID', trigger: 'blur' }],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '密码长度不能少于6位', trigger: 'blur' },
        ],
      },
    };
  },
  methods: {
    async handleLogin() {
        await this.$nextTick(); // 确保DOM更新完成
  
      if (!this.$refs.loginFormRef) {
        console.error('当前refs状态:', this.$refs);
        await this.$forceUpdate();
        await this.$nextTick();
        
        if (!this.$refs.loginFormRef) {
          ElMessage.error('系统错误，请刷新页面');
          return;
        }
      }
      try {
        if (!this.$refs.loginFormRef) {
          throw new Error('表单引用未初始化');
        }
        
        const valid = await this.$refs.loginFormRef.validate();
        if (!valid) return;

        const loginResponse = await axios.post('http://localhost:8080/user/login', {
          uid: this.loginForm.uid,
          password: this.loginForm.password
        });

        if (loginResponse.data) {
          const userInfoResponse = await axios.get(`http://localhost:8080/userInfo/${this.loginForm.uid}`);
          const userData = userInfoResponse.data;
          console.log('用户信息:', userData);
          
          this.$store.dispatch('login', {
            uid: this.loginForm.uid,
            nickname: userData.nickname,
            sex: userData.sex,
            birthday: userData.birthday,
            phone: userData.phone
          });
          
          localStorage.setItem('user', JSON.stringify({
            uid: this.loginForm.uid,
            nickname: userData.nickname,
            sex: userData.sex,
            birthday: userData.birthday,
            phone: userData.phone,
            isLoggedIn: true
          }));
          
          ElMessage.success(`登录成功，欢迎 ${userData.nickname}！`);
          console.log(this.$store.state.user)
          this.$router.push({ name: 'Main' });
        } else {
          ElMessage.error('用户ID不存在或密码错误');
        }
      } catch (error) {
        ElMessage.error(`操作失败: ${error.response?.data?.message || error.message}`);
        console.error(error);
      }
    },
    resetForm() {
      if (!this.$refs.loginFormRef) {
        ElMessage.warning('表单尚未准备好');
        return;
      }
      this.$refs.loginFormRef.resetFields();
    },
    goToRegister() {
      this.$router?.push({ name: 'Register' }) || 
        ElMessage.error('路由不可用');
    }
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: rgba(255, 255, 255, 0)
}
.login-card {
  width: 400px;
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  margin-bottom: 100px;
  background-color: rgba(255, 255, 255, 0.8)
}
.login-title {
  text-align: center;
  margin-bottom: 20px;
}
</style>