<template>
  <div class="team-detail">
    <h1>{{ teamInfo.sname }} 组队详情</h1>

    <div class="basic-info">
      <div class="info-item">
        <span class="label">发起人：</span>
        <span class="value">{{ teamInfo.sponsor }}</span>
      </div>
      <div class="info-item">
        <span class="label">等级：</span>
        <span class="value">{{ levelText }}</span>
      </div>
      <div class="info-item">
        <span class="label">招募时间：</span>
        <span class="value">{{ teamInfo.starttime }} 至 {{ teamInfo.endtime }}</span>
      </div>
      <div class="info-item">
        <span class="label">活动时间：</span>
        <span class="value">{{ teamInfo.runtime }}</span>
      </div>
      <div class="info-item">
        <span class="label">招募进度：</span>
        <span class="value">{{ teamInfo.already }}/{{ teamInfo.need }}</span>
      </div>
      <div class="info-item">
        <span class="label">状态：</span>
        <span class="status" :class="statusClass">{{ statusText }}</span>
      </div>
    </div>

    <h2>队伍成员</h2>
    <div class="member-list">
      <div v-if="loading">加载中...</div>
      <div v-else-if="members.length === 0">暂无成员</div>
      <ul v-else>
        <li v-for="member in members" :key="member.nickname">
          <span>{{ member.nickname }}</span>
          <span class="mstatus" :class="getMStatusClass(member.mstatus)">
            {{ getMStatusText(member.mstatus) }}
          </span>
        </li>
      </ul>
    </div>

    <!-- 新增：根据状态显示不同按钮 -->
    <div class="action-buttons">
      <!-- 报名参加：仅当 mstatus 为 0 或 2 且未满员时显示 -->
      <el-button 
        v-if="(memberStatus?.mstatus === 0 || memberStatus?.mstatus === 2) && canJoin" 
        type="primary" 
        @click="joinTeam"
      >
        报名参加
      </el-button>

      <!-- 退出队伍：仅当 mstatus 为 1 时显示 -->
      <el-button 
        v-if="memberStatus?.mstatus === 1"
        type="danger"
        @click="leaveTeam"
      >
        退出队伍
      </el-button>

      <!-- 解散队伍：仅当 mstatus 为 5 时显示 -->
      <el-button 
        v-if="memberStatus?.mstatus === 5"
        type="danger"
        @click="quitTeam"
      >
        解散队伍
      </el-button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'TeamDetail',
  data() {
    return {
      teamInfo: {},
      members: [],
      loading: false,
      memberStatus: null
    };
  },
  async created() {
    const tid = this.$route.params.tid; // 从路由中获取 tid
    
    try {
      const response = await axios.get(`http://localhost:8080/team/${tid}`);
      this.teamInfo = response.data;
    } catch (error) {
      console.error('获取团队详情失败:', error);
      this.$message.error('加载团队信息失败');
    }

    this.fetchMembers(tid); // 将 tid 传递给 fetchMembers
    this.fetchMemberStatus(tid); // 将 tid 传递给 fetchMemberStatus
  },
  computed: {
    canJoin() {
      return this.teamInfo.tstatus === 1 && this.teamInfo.already < this.teamInfo.need;
    },
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
    async fetchMembers(tid) { // 接收 tid 参数
      this.loading = true;
      try {
        const response = await axios.get(`http://localhost:8080/findTeamMember/${tid}`); // 使用传入的 tid
        this.members = response.data;
      } catch (error) {
        console.error('获取成员列表失败:', error.message || error);
        console.error('请求的URL:', `http://localhost:8080/findTeamMember/${tid}`);
      } finally {
        this.loading = false;
      }
    },
    getMStatusText(mstatus) {
      const statuses = {
        1: '已报名',
        2: '已退出',
        3: '已完成',
        4: '已解散',
        5: '发起者'
      };
      return statuses[mstatus] || '未知状态';
    },
    getMStatusClass(mstatus) {
      switch (mstatus) {
        case 1:
          return 'registered';
        case 2:
          return 'quit';
        case 3:
          return 'completed';
        case 4:
          return 'disbanded';
        case 5:
          return 'creator';
        default:
          return 'unknown';
      }
    },
    async fetchMemberStatus(tid) { // 接收 tid 参数
      try {
        const uid = this.$store.getters.currentUser.uid;
        if (!uid) return; // 未登录则跳过

        const response = await axios.get(
          `http://localhost:8080/member/mstatus/${uid}/${tid}` // 使用传入的 tid
        );

        // 假设接口直接返回 mstatus 数值（如 0、1、2、5）
        this.memberStatus = { mstatus: response.data };
      } catch (error) {
        console.error('获取用户状态失败:', error);
        // 默认状态为 0（未报名）
        this.memberStatus = { mstatus: 0 };
      }
    },
    // 报名参加
    async joinTeam() {
      try {
        // 从 Vuex 中动态获取用户 ID
        const user = this.$store.getters.currentUser;
        const uid = user.uid;
        console.log('用户ID:', uid);

        // 检查 uid 是否为空
        if (!uid) {
          this.$message.error('用户ID为空，请重新登录');
          console.warn('用户UID为空，无法提交报名');
          return;
        }

        await axios.post(
          'http://localhost:8080/member/insertOrUpdate',
          {
            uid: uid, // 动态获取的用户ID
            tid: this.tid,
            mstatus: 1 // 已报名状态
          }
        );

        // 更新本地状态
        this.memberStatus = { mstatus: 1 };

        // 可以添加提示信息
        this.$message.success('报名成功');
      } catch (error) {
        console.error('报名失败:', error);
        this.$message.error('报名失败，请重试');
      }
    },
    // 退出队伍
    async leaveTeam() {
      try {
        await axios.post(
          'http://localhost:8080/member/insertOrUpdate',
          {
            uid: this.$store.getters.currentUser.uid, // 添加uid
            tid: this.tid, // 添加tid
            mstatus: 2 // 明确指定mstatus为2
          }
        );

        // 更新本地状态
        this.memberStatus = { mstatus: 2 };

        // 可以添加提示信息
        this.$message.success('退出成功');
      } catch (error) {
        console.error('退出失败:', error);
        this.$message.error('退出失败，请重试');
      }
    },
    // 解散队伍（目前只实现UI，功能不实现）
    quitTeam() {
      this.$message.info('该功能暂未实现');
    }
  }
};
</script>

<style scoped>
.team-detail {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  margin-top: 100px;
}

.basic-info {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 20px;
}

.info-item {
  margin-bottom: 10px;
}

.label {
  font-weight: bold;
  color: #333;
}

.value {
  color: #666;
}

.member-list {
  margin-bottom: 20px;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 8px;
}

.member-list ul {
  list-style-type: none;
  padding: 10px;
}

.member-list li {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #eee;
}

.status, .mstatus {
  padding: 2px 8px;
  border-radius: 4px;
}

.status.recruiting, .mstatus.registered {
  background-color: #fdf6ec;
  color: #e6a23c;
}

.status.disbanded, .mstatus.disbanded {
  background-color: #fef0f0;
  color: #f56c6c;
}

.status.completed, .mstatus.completed {
  background-color: #f0f9eb;
  color: #67c23a;
}

.status.full, .mstatus.creator {
  background-color: #ecf5ff;
  color: #409eff;
}

.status.unknown, .mstatus.quit, .mstatus.unknown {
  background-color: #f0f0f0;
  color: #909399;
}

/* 按钮区域样式 */
.action-buttons {
  margin-top: 20px;
  display: flex;
  gap: 10px;
}
</style>