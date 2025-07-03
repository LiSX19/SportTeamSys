<template>
  <div class="profile-view">
    <el-card class="profile-card">
      <h2 class="profile-title">个人信息</h2>
      
      <el-descriptions border :column="1" size="large">
        <el-descriptions-item label="用户ID">
          <span class="info-text">{{ user.uid }}</span>
        </el-descriptions-item>
        <el-descriptions-item label="昵称">
          <el-input v-if="isEditing" v-model="editUser.nickname" />
          <span v-else class="info-text">{{ user.nickname }}</span>
        </el-descriptions-item>
        <el-descriptions-item label="性别">
          <el-select v-if="isEditing" v-model="editUser.sex" placeholder="请选择">
            <el-option label="Male" value="Male" />
            <el-option label="Female" value="Female" />
            <el-option label="Other" value="Other" />
          </el-select>
          <span v-else class="info-text">
            {{ formatSex(user.sex) }}
          </span>
        </el-descriptions-item>
        <el-descriptions-item label="生日">
          <el-date-picker
            v-if="isEditing"
            v-model="editUser.birthday"
            type="date"
            placeholder="选择日期"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
          />
          <span v-else class="info-text">{{ formatDate(user.birthday) }}</span>
        </el-descriptions-item>
        <el-descriptions-item label="电话">
          <el-input v-if="isEditing" v-model="editUser.phone" />
          <span v-else class="info-text">{{ user.phone }}</span>
        </el-descriptions-item>
      </el-descriptions>

      <!-- 操作按钮 -->
      <div class="profile-actions">
        <el-button 
          v-if="!isEditing" 
          type="primary" 
          @click="startEditing"
        >
          编辑
        </el-button>
        
        <div v-else class="edit-actions">
          <el-button type="success" @click="saveChanges" :disabled="!hasChanges">
            保存
          </el-button>
          <el-button @click="cancelEditing">取消</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useStore } from 'vuex';
import { ElDescriptions, ElDescriptionsItem, ElInput, ElButton, ElSelect, ElOption, ElDatePicker } from 'element-plus';
import axios from 'axios'; // 需要确保已安装配置好axios

const store = useStore();

// 从Vuex获取用户信息
const user = computed(() => store.state.user);

// 编辑状态
const isEditing = ref(false);
const editUser = ref({ ...user.value });

// 检查是否有更改
const hasChanges = computed(() => {
  return JSON.stringify(editUser.value) !== JSON.stringify(user.value);
});

// 开始编辑
const startEditing = () => {
  isEditing.value = true;
};

// 取消编辑
const cancelEditing = () => {
  isEditing.value = false;
  editUser.value = { ...user.value };
};

// 保存更改
const saveChanges = async () => {
  if (!hasChanges.value) return;

  try {
    const response = await axios.put(
      `http://localhost:8080/root/user/updateUser/${user.value.uid}`,
      {
        ...editUser.value,
        avatar: null
      }
    );

    if (response.status === 200) {
      // 更新 Vuex 中的用户信息
      store.commit('SET_USER', editUser.value);
      
      // 结束编辑模式
      isEditing.value = false;
    }
  } catch (error) {
    console.error('保存用户信息失败:', error);
  }
};

// 添加 formatDate 函数
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// 新增：格式化性别显示
const formatSex = (sexValue) => {
  switch (sexValue) {
    case 'Male':
      return '男';
    case 'Female':
      return '女';
    case 'Other':
      return '其他';
    default:
      return '未知';
  }
};
</script>

<style scoped>
.profile-view {
  background: linear-gradient(to right, #b1c3df, #6597e8);
  min-height: 65vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  border-radius: 10px;
}

.profile-card {
  width: 100%;
  max-width: 600px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
  border-radius: 12px;
  padding: 2rem;
  background: linear-gradient(to right, #b1c3df, #58dece);
}

.profile-title {
  text-align: center;
  margin-bottom: 2rem;
  color: #333;
  font-size: 1.8rem;
}

.info-text {
  font-weight: 500;
  color: #555;
}

.el-descriptions {
  margin-bottom: 1.5rem;
}

.el-descriptions-item {
  margin-bottom: 1rem;
}

.profile-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.edit-actions .el-button {
  min-width: 100px;
}
</style>
