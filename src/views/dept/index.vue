<script lang="ts" setup>

import { id } from 'element-plus/es/locales.mjs';
import { ref, onMounted } from 'vue';
import axios from 'axios';
onMounted(() => {
  search();
})
const depts = ref([
    {
        "id": 1,
        "name": "部门1",
        "createTime": "2023-01-01 00:00:00",
        "updateTime": "2023-01-01 00:00:00"
    }
])

const deptList = ref([])
const search = async () => {
    const result = await axios.get('/depts')
    if (result.data.code === 1) {
        deptList.value = result.data.data 
    }
}


</script>

<template>
    <h1>部门管理</h1>
    <div class="container">
        <el-button type="primary">+新增部门</el-button>
    </div>

  <el-table :data="deptList" border style="width: 100%" >
    <el-table-column type="index" label="序号" width="100" align="center" />
    <el-table-column prop="name" label="部门名称" width="260" align="center" />
    <el-table-column prop="updateTime" label="最后操作时间" width="300" align="center" />
    <el-table-column label="操作" align="center" > 
      <template #default="scope">
        <el-button type="primary" size="small"> <el-icon><EditPen    /></el-icon> 编辑</el-button>
        <el-button type="danger" size="small"> <el-icon><Delete /></el-icon> 删除</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>




<style scoped>
.container {
  margin: 20px 0;
}
</style>
