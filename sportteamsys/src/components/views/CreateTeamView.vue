<script setup>
import { ref, onMounted, computed } from 'vue'
import { useStore } from 'vuex'
import { ElMessage } from 'element-plus'
import axios from 'axios'

const store = useStore()
const formRef = ref(null)
const sports = ref([])
const stypeFilter = ref('') // 运动类型筛选值

// 计算属性：获取所有不重复的运动类型
const uniqueSportTypes = computed(() => {
  const types = new Set()
  sports.value.forEach(sport => types.add(sport.stype))
  return Array.from(types)
})

// 计算属性：根据筛选条件过滤运动列表
const filteredSports = computed(() => {
  if (!stypeFilter.value) return sports.value
  
  return sports.value.filter(sport => 
    (!stypeFilter.value || sport.stype === stypeFilter.value)
  )
})

// 筛选运动
const filterSports = () => {
  // 清空已选的运动ID
  if (stypeFilter.value !== '' && form.value.sid) {
    const selectedSport = sports.value.find(s => s.sid === form.value.sid)
    if (selectedSport && selectedSport.stype !== stypeFilter.value) {
      form.value.sid = ''
    }
  }
}

const levels = [
  { value: 1, label: '新手' },
  { value: 2, label: '入门' },
  { value: 3, label: '普通' },
  { value: 4, label: '高手' },
  { value: 5, label: '大师' }
]

const form = ref({
  sid: '',
  sponsor: store.state.user.uid, // 从store获取当前用户uid
  level: '',
  need: 3,
  runtime: '', // 活动日期
  recruitStart: new Date().toISOString().split('T')[0], // 默认为当前日期
  recruitEnd: '' // 招募截止日期
})

const rules = {
  sid: [{ required: true, message: '请选择运动类型', trigger: 'change' }],
  level: [{ required: true, message: '请选择水平要求', trigger: 'change' }],
  need: [{ required: true, message: '请输入需要人数', trigger: 'blur' }],
  runtime: [
    { required: true, message: '请选择活动日期', trigger: 'change' },
    { 
      validator: (rule, value, callback) => {
        if (!form.value.recruitEnd) return callback()
        const activityDate = new Date(value)
        const recruitEndDate = new Date(form.value.recruitEnd)
        if (activityDate <= recruitEndDate) {
          callback(new Error('活动日期必须晚于招募截止日期'))
        } else {
          callback()
        }
      },
      trigger: 'change'
    }
  ],
  recruitEnd: [
    { required: true, message: '请选择招募截止日期', trigger: 'change' },
    { 
      validator: (rule, value, callback) => {
        const recruitEndDate = new Date(value)
        const recruitStartDate = new Date(form.value.recruitStart)
        if (recruitEndDate <= recruitStartDate) {
          callback(new Error('招募截止日期必须晚于招募开始日期'))
        } else {
          callback()
        }
      },
      trigger: 'change'
    }
  ]
}

const fetchSports = async () => {
  try {
    const response = await axios.get('http://localhost:8080/sport/findAll')
    sports.value = response.data
  } catch (error) {
    ElMessage.error('获取运动列表失败: ' + (error.response?.data?.message || error.message))
    console.error('API请求失败:', error)
  }
}

// 验证逻辑：禁用早于或等于招募截止日期的活动日期
const disabledActivityDate = (date) => {
  if (!form.value.recruitEnd) return false
  const recruitEndDate = new Date(form.value.recruitEnd)
  return date.getTime() <= recruitEndDate.getTime()
}

// 提交表单
const submitForm = () => {
  formRef.value.validate(async (valid) => {
    if (!valid) return

    try {
      // 合并日期和时间
      const payload = {
        ...form.value,
        starttime: form.value.recruitStart, // 使用招募开始日期作为starttime
        endtime: form.value.recruitEnd,     // 使用招募截止日期作为endtime
        tstatus: null                       // 添加：将tstatus字段置为空值
      }

      const response = await axios.post('http://localhost:8080/team/insert', payload, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      if (response.data === "插入成功") {
        ElMessage.success(response.data)
        resetForm()
      } else {
        ElMessage.error(response.data.message || '创建组队失败')
      }
    } catch (error) {
      ElMessage.error('创建组队失败: ' + (error.response?.data?.message || error.message))
      console.error('API请求失败:', error)
    }
  })
}

// 重置表单
const resetForm = () => {
  formRef.value.resetFields()
  form.value.need = 3 // 重置默认值
}

onMounted(fetchSports)
</script>

<template>
  <div class="create-team-view">
    <h2>发起组队</h2>
    <el-form :model="form" label-width="120px" :rules="rules" ref="formRef">
      <!-- 运动类型筛选 -->
      <el-form-item label="运动分类" prop="stypeFilter">
        <el-select
          v-model="stypeFilter"
          placeholder="全部类型"
          clearable
          @change="filterSports"
        >
          <el-option
            v-for="type in uniqueSportTypes"
            :key="type"
            :label="type"
            :value="type"
          />
        </el-select>
      </el-form-item>

      <!-- 运动选择 -->
      <el-form-item label="运动名称" prop="sid">
        <el-select 
          v-model="form.sid" 
          placeholder="请选择运动" 
          filterable
          @focus="fetchSports"
        >
          <el-option
            v-for="sport in filteredSports"
            :key="sport.sid"
            :label="sport.sname"
            :value="sport.sid"
          >
            <span>{{ sport.sname }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ sport.stype }}</span>
          </el-option>
        </el-select>
      </el-form-item>

      <!-- 水平选择 -->
      <el-form-item label="水平要求" prop="level">
        <el-select v-model="form.level" placeholder="请选择水平">
          <el-option
            v-for="level in levels"
            :key="level.value"
            :label="level.label"
            :value="level.value"
          />
        </el-select>
      </el-form-item>

      <!-- 需求人数 -->
      <el-form-item label="需要人数" prop="need">
        <el-input-number 
          v-model="form.need" 
          :min="1" 
          :max="20" 
          controls-position="right"
        />
      </el-form-item>

      <!-- 活动日期 -->
      <el-form-item label="活动日期" prop="runtime">
        <el-date-picker
          v-model="form.runtime"
          type="date"
          placeholder="选择日期"
          value-format="YYYY-MM-DD"
          :disabled-date="disabledActivityDate"
        />
      </el-form-item>

      <!-- 招募截止日期 -->
      <el-form-item label="招募截止日期" prop="recruitEnd">
        <el-date-picker
          v-model="form.recruitEnd"
          type="date"
          placeholder="选择招募截止日期"
          value-format="YYYY-MM-DD"
          :disabled-date="disabledRecruitEndDate"
        />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm">提交</el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped>
.create-team-view {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
  background-color: rgba(255, 255, 255, 0.5);
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border-radius: 10px;
}

.el-select {
  width: 100%;
}
</style>