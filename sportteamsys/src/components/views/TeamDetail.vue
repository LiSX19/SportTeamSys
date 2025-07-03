<template>
  <div class="team-detail">
    <h1>{{ teamInfo.sname }} 组队详情</h1>
    
    <!-- 新增：显示运动名称和运动种类 -->
    <div class="sport-info">
      <p><strong>运动：</strong>{{ sportName }}</p>
      <p><strong>运动分类：</strong>{{ sportType }}</p>
    </div>

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
          <!-- 新增电话显示 -->
          <span class="member-phone">电话: {{ member.phone }}</span>
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
        @click="disbandTeam"
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
      memberStatus: null,
      sportsData: [] // 存储运动类型数据
    };
  },
  async created() {
    const tid = this.$route.params.tid; // 从路由中获取 tid
    
    try {
      const [teamResponse, sportResponse] = await Promise.all([
        axios.get(`http://localhost:8080/team/${tid}`),
        axios.get('http://localhost:8080/sport/findAll')
      ]);
      
      this.teamInfo = teamResponse.data;
      this.sportsData = sportResponse.data;
    } catch (error) {
      console.error('获取团队详情或运动类型失败:', error);
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
    },
    // 新增：获取对应 sid 的运动信息
    sportInfo() {
      const sid = this.teamInfo.sid;
      return this.sportsData.find(sport => sport.sid === sid) || {};
    },
    sportName() {
      return this.sportInfo.sname || '未知运动';
    },
    sportType() {
      return this.sportInfo.stype || '未知类型';
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
        const tid = this.$route.params.tid;
        console.log('用户ID:', uid);
        console.log("tid:", this.tid);
        

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
            tid: tid,
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
            tid: this.$route.params.tid, // 添加tid
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
    // 解散队伍
    async disbandTeam() {
      try {
        // 构造更新数据，保持其他属性不变，只更新 tstatus 为 2
        const updatedTeam = {
          ...this.teamInfo,
          tstatus: 2 // 更新状态为解散
        };

        // 发送 PUT 请求到指定接口
        const response = await axios.put(
          `http://localhost:8080/team/update/${this.teamInfo.tid}`,
          updatedTeam
        );

        if (response.data) {
          // 更新本地状态
          this.teamInfo.tstatus = 2;

          // 提示用户操作成功
          this.$message.success('队伍解散成功');
        }
      } catch (error) {
        console.error('解散队伍失败:', error);
        this.$message.error('解散队伍失败，请重试');
      }
    }
  }
};
</script>

<style scoped>
.sport-info {
  margin-bottom: 20px;
  background-color: #ffffff;
  border-radius: 10px;
  padding: 15px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.sport-info p {
  margin: 8px 0;
  font-size: 1rem;
  color: #333;
}

.team-detail {
  max-width: 800px;
  margin: 0 auto;
  padding: 30px;
  margin-top: 100px;
  background: linear-gradient(to right, #e0ecff, #d6f0ff);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-radius: 12px;
}

.basic-info {
  background-color: #ffffff;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 25px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.info-item {
  margin-bottom: 15px;
  display: flex;
  align-items: center;
}

.label {
  font-weight: bold;
  color: #333;
  width: 100px;
  flex-shrink: 0;
}

.value {
  color: #555;
  font-size: 1rem;
}

.member-list {
  background-color: #ffffff;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 25px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.member-list ul {
  list-style-type: none;
  padding: 0;
}

.member-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid #eee;
}

.member-list li span {
  flex: 1;
  padding: 6px 8px;
  font-size: 0.95rem;
}

/* 昵称列 */
.member-list li span:first-child {
  font-weight: bold;
  color: #333;
}

/* 电话列 */
.member-list li .member-phone {
  color: #666;
}

/* 状态列 */
.member-list li .mstatus {
  text-align: center;
}

.status,
.mstatus span {
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  display: inline-block;

}

.status.recruiting,
.mstatus.registered {
  background-color: #fef0f0;
  color: #fa7777;
  border-radius: 10px;
}

.status.disbanded,
.mstatus.disbanded {
  background-color: #fef0f0;
  color: #f56c6c;
  border-radius: 10px;
}

.status.completed,
.mstatus.completed {
  background-color: #f0f9eb;
  color: #67c23a;
  border-radius: 10px;
}

.status.full,
.mstatus.creator {
  background-color: #ecf5ff;
  color: #409eff;
  border-radius: 10px;
}

.status.unknown,
.mstatus.quit,
.mstatus.unknown {
  background-color: #f0f0f0;
  color: #909399;
  border-radius: 10px;
}

/* 按钮区域样式 */
.action-buttons {
  margin-top: 20px;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
}

.el-button {
  border-radius: 6px;
  transition: all 0.2s ease-in-out;
}

.el-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
</style>