<script setup>
import axios from 'axios'
import { ref, onMounted, computed } from 'vue'
import NavBar from './components/views/NavBar.vue'
import { useStore } from 'vuex'

const tableData = ref([])
const store = useStore()
const currentBgIndex = ref(1)

const getRandomBgIndex = () => {
  return Math.floor(Math.random() * 5) + 1
}

// 动态计算背景样式
const backgroundStyle = computed(() => {
  return {
    backgroundImage: `url(/src/bg/bg${currentBgIndex.value}.jpg)`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'fixed',
    minHeight: '100vh',
    backdropFilter: 'blur(2px)'
  }
})

const checkLoginStatus = () => {
  const savedUser = localStorage.getItem('user');
  if (savedUser) {
    try {
      const user = JSON.parse(savedUser);
      if (user && user.isLoggedIn) {
        store.dispatch('login', { // 使用 setup 中的 store 变量
          uid: user.uid,
          nickname: user.nickname,
          sex: user.sex,
          birthday: user.birthday,
          phone: user.phone
        });
      }
    } catch (e) {
      console.error('解析用户信息失败:', e);
      localStorage.removeItem('user');
    }
  }
}


onMounted(() => {
  // 设置随机背景
  currentBgIndex.value = getRandomBgIndex()
  
  checkLoginStatus()
  axios.get('http://localhost:8080/root/user/findAll')
    .then(response => {
      console.log('Response Data:', response.data)
    })
    .catch(error => {
      console.error('Error fetching data:', error.response ? error.response.data : error.message)
    })
})
</script>

<template>
  <!-- 将背景作为固定层 -->
  <div class="background-container" :style="backgroundStyle"></div>
  
  <!-- 内容区域 -->
  <div class="content-container">
    <NavBar />
    <router-view />
  </div>
</template>

<style>
body, html {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}
</style>
<style scoped>

.content-container {
  position: relative;
  min-height: 80vh;
  background-color: rgba(255, 255, 255, 0.2);
}

.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #4050cdaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
.background-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -1; /* 确保背景在最底层 */
}
</style>