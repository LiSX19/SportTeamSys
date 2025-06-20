
<template>
  <div class="team-card" @mouseover="hover = true" @mouseleave="hover = false">
    <div class="card-header">
        <span class="sport-name">{{ teamInfo.sname }}</span>
        
        <span class="level">{{ levelText }}</span>
    </div>
    
    <div class="card-body">
        <div class="info-row">
            <span class="label">发 起 人：</span>
            <span class="value">{{ teamInfo.sponsor }}</span>
        </div>
        <div class="info-row">
            <span class="label">招募时间:</span>
            <span class="value">{{ teamInfo.starttime }} 至 {{ teamInfo.endtime }}</span>
        </div>
        
        <div class="info-row">
            <span class="label">活动时间:</span>
            <span class="value">{{ teamInfo.runtime }}</span>
        </div>
      
      <div class="info-row">
        <span class="label">招募进度:</span>
        <div class="progress-container">
          <span class="progress-text">{{ teamInfo.already }}/{{ teamInfo.need }}</span>
          <div class="progress-bar">
            <div 
              class="progress-fill" 
              :style="{ width: (teamInfo.already / teamInfo.need * 100) + '%' }"
            ></div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="card-footer">
      <!-- 修改：更新状态文本和样式 -->
      <span class="status" :class="statusClass">{{ statusText }}</span>
      
      <!-- 新增：查看详情按钮 -->
      <el-button 
        v-if="hover" 
        type="text" 
        size="small" 
        @click="goToDetail"
      >
        查看详情
      </el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TeamCard',
  props: {
    teamInfo: {
      type: Object,
      required: true,
      default: () => ({
        tid: 0,
        sname: '',
        sponsor: '',
        level: 0,
        already: 0,
        need: 0,
        tstatus: 0,
        runtime: '',
        starttime: '',
        endtime: ''
      })
    }
  },
  data() {
    return {
      hover: false // 控制悬浮状态
    };
  },
  computed: {
    // 修改：更新状态文本
    statusText() {
      switch (this.teamInfo.tstatus) {
        case 1:
          return '招募中';
        case 2:
          return '已解散';
        case 3:
          return '已完成';
        case 4:
          return '已满员';
        default:
          return '未知状态';
      }
    },
    // 修改：更新状态样式
    statusClass() {
      switch (this.teamInfo.tstatus) {
        case 1:
          return 'recruiting';
        case 2:
          return 'disbanded';
        case 3:
          return 'completed';
        case 4:
          return 'full';
        default:
          return 'unknown';
      }
    },
    levelText() {
      const levels = {
        1: '新手',
        2: '入门', 
        3: '普通',
        4: '高手',
        5: '大师'
      };
      return levels[this.teamInfo.level] || '未知';
    }
  },
  methods: {
    goToDetail() {
      this.$router.push({
        name: 'TeamDetail',
        params: { tid: this.teamInfo.tid }
      });
    }
  }
};
</script>

<style scoped>
.team-card {
  border: 1px solid #eaeaea;
  border-radius: 8px;
  padding: 16px;
  margin: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  
  /* 新增：悬浮时的动画效果 */
  transition: transform 0.3s ease-in-out;
}

.team-card:hover {
  transform: scale(1.05); /* 悬浮时放大 5% */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2); /* 增强阴影效果 */
}

.card-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 8px;
}

.sport-name {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.level {
  background-color: #409eff;
  color: white;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.info-row {
  margin: 8px 0;
  display: flex;
  align-items: center;
}

.label {
  color: #666;
  width: 80px;
  font-size: 14px;
}

.value {
  flex: 1;
  font-size: 14px;
}

.progress-container {
  flex: 1;
  display: flex;
  align-items: center;
}

.progress-text {
  width: 50px;
  text-align: right;
  margin-right: 10px;
  font-size: 14px;
}

.progress-bar {
  flex: 1;
  height: 8px;
  background-color: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: #67c23a;
  transition: width 0.3s;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center; /* 确保内容垂直居中 */
  margin-top: 12px;
  padding-top: 8px;
  border-top: 1px solid #f0f0f0;
  font-size: 12px;
}

.status {
  padding: 2px 8px;
  border-radius: 4px;
}

.status.recruiting {
  background-color: #fdf6ec;
  color: #e6a23c;
}

.status.disbanded {
  background-color: #fef0f0;
  color: #f56c6c;
}

.status.completed {
  background-color: #f0f9eb;
  color: #67c23a;
}

.status.full {
  background-color: #ecf5ff;
  color: #409eff;
}

.status.unknown {
  background-color: #f0f0f0;
  color: #909399;
}

.runtime {
  color: #999;
}
</style>