<template>
  <div class="profile-view">
    <el-card class="profile-card">
      <h2 class="profile-title">个人信息</h2>
      
      <el-descriptions border :column="1" size="large">
        <el-descriptions-item label="用户ID">
          <span class="info-text">{{ user.uid }}</span>
        </el-descriptions-item>
        <el-descriptions-item label="昵称">
          <span class="info-text">{{ user.nickname }}</span>
        </el-descriptions-item>
        <el-descriptions-item label="性别">
          <span class="info-text">
            {{ user.sex === 'male' ? '男' : user.sex === 'female' ? '女' : '未知' }}
          </span>
        </el-descriptions-item>
        <el-descriptions-item label="生日">
          <span class="info-text">{{ formatDate(user.birthday) }}</span>
        </el-descriptions-item>
        <el-descriptions-item label="电话">
          <span class="info-text">{{ user.phone }}</span>
        </el-descriptions-item>
      </el-descriptions>
    </el-card>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';
import { ElDescriptions, ElDescriptionsItem } from 'element-plus';

const store = useStore();

// 从Vuex获取用户信息
const user = computed(() => store.state.user);

// 格式化日期显示
const formatDate = (dateString) => {
  if (!dateString) return '未设置';
  try {
    return new Date(dateString).toLocaleDateString();
  } catch {
    return dateString;
  }
};
</script>

<style scoped>
.profile-view {
  padding: 2rem;
}

.profile-card {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.profile-title {
  text-align: center;
  margin-bottom: 2rem;
  color: #333;
  font-size: 2rem;
  font-weight: bold;
}

.el-descriptions {
  font-size: 1.2rem;
}

.el-descriptions-item__label {
  font-size: 1.2rem;
  font-weight: bold;
  width: 120px;
}

.info-text {
  font-size: 1.2rem;
}

/* 响应式布局 */
@media (max-width: 768px) {
  .profile-card {
    max-width: 95%;
    padding: 1rem;
  }
  
  .profile-title {
    font-size: 1.5rem;
  }
  
  .el-descriptions,
  .el-descriptions-item__label,
  .info-text {
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .profile-view {
    padding: 1rem;
  }
  
  .profile-title {
    font-size: 1.2rem;
    margin-bottom: 1rem;
  }
  
  .el-descriptions-item__label {
    width: 80px;
  }
}
</style>