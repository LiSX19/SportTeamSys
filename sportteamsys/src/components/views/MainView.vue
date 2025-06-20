<template>
  <div class="main-container">
    <!-- 左侧侧栏 -->
    <el-aside width="200px" class="sidebar">
      <h3>运动组队系统</h3>
      <el-menu
        :default-active="activeTab"
        @select="handleMenuSelect"
        background-color="#fff"
        text-color="#333"
        active-text-color="#409EFF"
      >
        <el-menu-item index="find-team">寻找组队</el-menu-item>
        <el-menu-item index="create-team">发起组队</el-menu-item>
        <el-menu-item index="history">历史组队</el-menu-item>
        <el-menu-item index="profile">个人信息</el-menu-item>
      </el-menu>
    </el-aside>

    <!-- 右侧主内容区 -->
    <el-main class="content-area">
      <component :is="currentComponent"></component>
    </el-main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import FindTeamView from './FindTeamView.vue'; 
import CreateTeamView from './CreateTeamView.vue';
import HistoryView from './HistoryView.vue';
import ProfileView from './ProfileView.vue';

const activeTab = ref('find-team'); // 默认显示“寻找组队”页面

// 根据 activeTab 动态计算当前要显示的组件
const currentComponent = computed(() => {
  switch (activeTab.value) {
    case 'find-team':
      return FindTeamView;
    case 'create-team':
      return CreateTeamView;
    case 'history':
      return HistoryView;
    case 'profile':
      return ProfileView;
    default:
      return null;
  }
});

// 处理菜单项点击事件
const handleMenuSelect = (index) => {
  activeTab.value = index;
};

// 新增：将用户登录状态传递给 NavBar
defineExpose({
  userLoggedIn: true, // 假设登录成功后设置为 true
});
</script>

<style scoped>
.main-container {
  display: flex;
  min-height: calc(100vh - 60px);
  padding-top: 60px; 
}

.sidebar {
  position: fixed;
  top: 80px; /* 放在导航栏下方 */
  border-radius: 10px;
  left: -20px;
  padding-left: 30px;
  height: calc(100vh - 60px); /* 减去导航栏高度 */
  background-color: rgba(255, 255, 255, 0.5);
  box-shadow: 2px 0 6px rgba(0, 0, 0, 0.1);
  z-index: 999; /* 低于导航栏 */
  padding-top: 20px;
}

.content-area {
  flex: 1;
  margin-left: 200px;
  padding: 20px;
  min-height: calc(100vh - 60px);
}

.el-menu {
  border-right: none;
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 10px;
}

</style>