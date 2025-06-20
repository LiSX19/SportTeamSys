<template>
  <div class="history-view">
    <h2>历史组队页面</h2>
    
    <div class="filter-section">
      <div class="filter-row">
        <label>参与状态：</label>
        <select v-model="filterStatus">
          <option value="">全部</option>
          <option value="1">已报名</option>
          <option value="2">已退出</option>
          <option value="3">已完成</option>
        </select>
      </div>
    </div>
    
    <div class="history-list" v-if="historyList.length > 0">
      <div 
        class="history-card" 
        v-for="item in filteredHistory" :key="item.tid"
        @mouseenter="hoverCard(item, true)"
        @mouseleave="hoverCard(item, false)"
        @click="goToDetail(item)"
        :class="{ 'card-hover': item.isHovered }"
      >
        <div class="card-header">
          <span class="sport-name">{{ item.sname }}</span>
          <span class="status" :class="getStatusClass(item.mstatus)">
            {{ getStatusText(item.mstatus) }}
          </span>
        </div>
        
        <div class="card-body">
          <div class="info-row">
            <span class="label">团队状态：</span>
            <span class="value">{{ getTeamStatusText(item.tstatus) }}</span>
          </div>
          
          <div class="info-row">
            <span class="label">创建时间：</span>
            <span class="value">{{ formatDate(item.runtime) }}</span>
          </div>
        </div>
      </div>
    </div>
    
    <div v-else class="empty-tip">
      {{ loading ? '加载中...' : '暂无历史组队记录' }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

const store = useStore();
const router = useRouter(); // 引入 Vue Router
const historyList = ref([]);
const loading = ref(true);
const filterStatus = ref('');

// 计算属性：动态获取用户UID
const userUid = computed(() => {
  return store.state.user.uid;
});

// 获取历史记录
onMounted(async () => {
  try {
    const response = await fetch(`http://localhost:8080/history/findById/${userUid.value}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    historyList.value = await response.json();
  } catch (error) {
    console.error('获取历史记录失败:', error);
  } finally {
    loading.value = false;
  }
});

// 参与状态文本 (mstatus)
const getStatusText = (mstatus) => {
  const statusMap = {
    1: '已报名',
    2: '已退出',
    3: '已完成',
    4: '已解散',
    5: '发起者'
  };
  return statusMap[mstatus] || '未知';
};

// 参与状态样式 (mstatus)
const getStatusClass = (mstatus) => {
  const classMap = {
    1: 'registered',  // 已报名
    2: 'quit',        // 已退出
    3: 'completed',   // 已完成
    4: 'disbanded',   // 已解散
    5: 'creator'      // 发起者
  };
  return classMap[mstatus] || 'unknown';
};

// 团队状态文本 (tstatus)
const getTeamStatusText = (tstatus) => {
  const statusMap = {
    1: '招募中',
    2: '已解散',
    3: '已完成招募',
    4: '已满员'
  };
  return statusMap[tstatus] || '未知';
};

// 日期格式化
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString();
};

// 过滤后的历史记录
const filteredHistory = computed(() => {
  if (!filterStatus.value) return historyList.value;
  return historyList.value.filter(item => item.mstatus == filterStatus.value);
});

// 新增：处理鼠标悬停状态
const hoverCard = (item, isHovered) => {
  item.isHovered = isHovered;
};

// 新增：跳转到详情页
const goToDetail = (item) => {
  // 使用 Vue Router 进行跳转并传递 tid
  router.push({
    name: 'TeamDetail',
    params: { tid: item.tid }
  });
};
</script>

<style scoped>
/* 新增状态样式 */
.status.registered {
  background-color: #fdf6ec;
  color: #e6a23c;
}

.status.completed {
  background-color: #f0f9eb;
  color: #67c23a;
}

.status.disbanded {
  background-color: #fef0f0;
  color: #f56c6c;
}

.status.creator {
  background-color: #ecf5ff;
  color: #409eff;
}
.history-view {
  padding: 20px;
}

.filter-section {
  margin-bottom: 20px;
  padding: 15px;
  background-color: #f5f7fa;
  border-radius: 8px;
}

.filter-row {
  display: flex;
  align-items: center;
}

.filter-row label {
  width: 80px;
  font-size: 14px;
  color: #606266;
}

.filter-row select {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  color: #606266;
  outline: none;
}

.history-list {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}

.history-card {
  flex: 1;
  min-width: 250px;
  border: 1px solid #eaeaea;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
}

.card-hover {
  transform: scale(1.03);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #f0f0f0;
}

.sport-name {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.status {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.status.joined {
  background-color: #f0f9eb;
  color: #67c23a;
}

.status.quit {
  background-color: #fef0f0;
  color: #f56c6c;
}

.status.ended {
  background-color: #ecf5ff;
  color: #409eff;
}

.status.unknown {
  background-color: #f0f0f0;
  color: #909399;
}

.card-body {
  font-size: 14px;
}

.info-row {
  margin: 8px 0;
  display: flex;
}

.label {
  color: #666;
  width: 80px;
}

.value {
  flex: 1;
}

.empty-tip {
  text-align: center;
  color: #909399;
  padding: 40px 0;
}
</style>