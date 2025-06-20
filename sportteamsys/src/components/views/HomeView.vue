<template>
  <div class="home-container">
    <el-card class="home-card">
      <h1>运动组队系统</h1>
      <p>无兄弟！不运动！</p>
      <div class="button-group">
        <el-button type="primary" size="large" @click="goToLogin">登录</el-button>
        <el-button size="large" @click="goToRegister">注册</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'HomeView',
  methods: {
    goToLogin() {
      this.$router.push('/login');
    },
    goToRegister() {
      this.$router.push('/register');
    }
  }
}
</script>

<style scoped>
.home-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: rgba(255, 255, 255, 0)
  
}
.home-card {
  width: 400px;
  padding: 30px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  margin-bottom: 100px;
  background-color: rgba(255, 255, 255, 0.3);
}
h1 {
  text-align: center;
  margin-bottom: 20px;
}
p {
  text-align: center;
  margin-bottom: 30px;
}
.button-group {
  display: flex;
  justify-content: center;
  gap: 20px; /* 按钮之间的间距 */
}
.el-button {
  width: 120px; /* 设置固定宽度 */
  font-size: 16px; /* 增大字体 */
  padding: 12px 0; /* 增大内边距 */
}
</style>