<template>
  <div class="find-team-view">
    <h2>寻找组队页面</h2>
    
    <!-- 新增筛选区域 -->
    <div class="filter-section">
      <div class="filter-row">
        <label>水平等级：</label>
        <select v-model="filterLevel">
          <option value="">全部</option>
          <option value="1">新手</option>
          <option value="2">入门</option>
          <option value="3">普通</option>
          <option value="4">高手</option>
          <option value="5">大师</option>
        </select>
      </div>
      
      <div class="filter-row">
        <label>状态：</label>
        <select v-model="filterStatus">
          <option value="">全部</option>
          <option value="1">招募中</option>
          <option value="2">已解散</option>
          <option value="3">已完成</option>
          <option value="4">已满员</option>
        </select>
      </div>
      
      <div class="filter-row">
        <label>运动类型：</label>
        <select v-model="filterSportType">
          <option value="">全部</option>
          <option v-for="sport in availableSports" :key="sport" :value="sport">
            {{ sport }}
          </option>
        </select>
      </div>
    </div>
    
    <div class="team-list" v-if="filteredTeams.length > 0">
      <TeamCard 
        v-for="team in filteredTeams" 
        :key="team.tid" 
        :teamInfo="team"
      />
    </div>
    <div v-else>
      暂无符合条件的团队
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import TeamCard from './TeamCard.vue';

const teamList = ref([]);
const sportTypes = ref([]); // 存储运动类型数据
const filterLevel = ref('');
const filterStatus = ref('');
const filterSportType = ref(''); // 新增运动类型筛选条件

// 计算属性：获取可用的运动名称（仅包含存在的值并去重）
const availableSports = computed(() => {
  const sports = new Set();
  teamList.value.forEach(team => {
    if (team.sname) {
      sports.add(team.sname);
    }
  });
  return Array.from(sports);
});

// 计算属性：过滤后的团队列表
const filteredTeams = computed(() => {
  const filtered = teamList.value.filter(team => {
    const levelMatch = !filterLevel.value || team.level == filterLevel.value;
    const statusMatch = !filterStatus.value || team.tstatus == filterStatus.value;
    const sportTypeMatch = !filterSportType.value || team.sname === filterSportType.value; // 使用 sname 字段过滤
    return levelMatch && statusMatch && sportTypeMatch;
  });
  
  // 按 runtime 降序排序
  return filtered.sort((a, b) => {
    return new Date(b.runtime) - new Date(a.runtime);
  });
});

onMounted(async () => {
  try {
    // 使用Promise.all实现并行请求
    const [teamResponse, sportTypeResponse] = await Promise.all([
      fetch('http://localhost:8080/Allteam'),
      fetch('http://localhost:8080/sport/findAll')
    ]);
    
    if (!teamResponse.ok || !sportTypeResponse.ok) {
      throw new Error(`HTTP error!`);
    }
    
    const teamData = await teamResponse.json();
    const sportTypeData = await sportTypeResponse.json();
    
    teamList.value = teamData;
    sportTypes.value = sportTypeData;
  } catch (error) {
    console.error('初始化数据获取失败:', error);
  }
});
</script>

<style scoped>
.find-team-view {
  padding: 20px;
}

/* 新增筛选区域样式 */
.filter-section {
  margin-bottom: 20px;
  padding: 15px;
  background-color: #f5f7fa;
  border-radius: 8px;
}

.filter-row {
  margin-bottom: 10px;
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

.filter-row select:focus {
  border-color: #409eff;
}

.team-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
}
</style>