<template>
  <el-menu
    mode="horizontal"
    :default-active="activeIndex"
    class="navbar-container"
    router
  >
    <div class="logo-title">
      <img src="../../assets/logo.svg" alt="Logo" class="logo" />
      <span class="title">运动组队系统</span>
    </div>
    
    <div class="menu-items">
      <el-menu-item index="/" class="menu-item" v-if="!isLoggedIn">主页</el-menu-item>
      <el-menu-item index="/login" class="menu-item" v-if="!isLoggedIn">登录</el-menu-item>
      <el-menu-item index="/register" class="menu-item" v-if="!isLoggedIn">注册</el-menu-item>
      <el-menu-item class="menu-item" v-if="isLoggedIn"  >欢迎！{{nickname}}</el-menu-item>
      <el-menu-item class="menu-item" v-if="isLoggedIn">
        <el-button type="text" @click="handleLogout">退出</el-button>
      </el-menu-item>
    </div>
  </el-menu>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()
const store = useStore()
const activeIndex = ref(route.path)

const isLoggedIn = computed(() => store.state.user.isLoggedIn)

const handleLogout = () => {
  store.dispatch('logout')
  localStorage.removeItem('user')
  ElMessage.success('已退出登录')
  router.push('/login')
}

const nickname = computed(() => store.state.user.nickname)
</script>

<style scoped>
.navbar-container {
  position: fixed; /* 添加固定定位 */
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000; /* 确保导航栏在最顶层 */
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  height: 60px;
  background-color: rgba(255, 255, 255, 0.95); /* 半透明背景 */
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  color: #333;
  width: 100%; /* 确保全宽 */
}

.logo-title {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.logo {
  width: 40px;
  height: 40px;
  margin-right: 10px;
}

.title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.menu-items {
  display: flex;
}

.menu-item {
  color: #333 !important;
}

.menu-item:hover {
  background-color: rgba(0, 0, 0, 0.05) !important;
}

.menu-item.is-active {
  background-color: rgba(0, 0, 0, 0.1) !important;
  border-bottom: none !important;
  color: #409EFF !important;
}
.user-info {
  display: flex;
  align-items: center;
  margin-left: auto;
}
.nickname {
  margin-right: 10px;
  color: #333;
}

</style>