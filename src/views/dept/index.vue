<script lang="ts" setup>

import { de, id } from 'element-plus/es/locales.mjs';
import {reactive, ref, onMounted } from 'vue';
import * as deptApi from '@/api/depts'
import {ElMessage} from 'element-plus'
onMounted(() => {
  search();
})

const deptList = ref([])
const search = async () => {
    const result = await deptApi.queryAllApi()
    if (result.code === 1) {
        deptList.value = result.data 
    }
}


const dialogFormVisible = ref(false)
const dept = ref({
    name: ''
})

const formTitle = ref('')

const addDept = () => {
    dept.value = { name: '' };
    dialogFormVisible.value = true;
    formTitle.value = '新增部门';
    if (deptFormRef.value) {
    deptFormRef.value.resetFields();
    }

}
const save = async () => { 

  if(!deptFormRef.value) return;

  deptFormRef.value.validate(async (valid)=>{
    if(valid){
      const result = await deptApi.addApi(dept.value)
      if (result.code === 1) {
        ElMessage.success('保存成功')
        

        dialogFormVisible.value = false;
        search();
      } else {
        ElMessage.error("保存失败：" + result.msg);

      }
    }else{
        ElMessage.error("表单验证失败，请检查输入项");
    }
  });
  



}


//verify 
const rules = ref({
  name: [
    { required: true, message: '请输入部门名称', trigger: 'blur' },
    { min: 2, max: 10, message: '长度至少 2 个字符，最多 10 个字符', trigger: 'blur' }
  ]
});

const  deptFormRef = ref();


  const editDept = async (id) => { 

  formTitle.value = '编辑部门';
  if (deptFormRef.value) {
    deptFormRef.value.resetFields();
  }
  const result = await deptApi.queryByIdApi(id);

  if (result.code === 1) {
    dept.value = result.data;
    dialogFormVisible.value = true;
  }

}
</script>

<template>
    <h1>部门管理</h1>
    <div class="container">
        <el-button type="primary" @click="addDept">+新增部门</el-button>
    </div>

  <el-table :data="deptList" border style="width: 100%" >
    <el-table-column type="index" label="序号" width="100" align="center" />
    <el-table-column prop="name" label="部门名称" width="260" align="center" />
    <el-table-column prop="updateTime" label="最后操作时间" width="300" align="center" />
    <el-table-column label="操作" align="center" > 
      <template #default="scope">
        <el-button type="primary" size="small" @click="editDept(scope.row.id)"> <el-icon><EditPen    /></el-icon> 编辑</el-button>
        <el-button type="danger" size="small"> <el-icon><Delete /></el-icon> 删除</el-button>
      </template>
    </el-table-column>
  </el-table>


    <el-dialog v-model="dialogFormVisible" :title="formTitle" width="500">
    <el-form :model="dept" :rules="rules" ref="deptFormRef">
      <el-form-item label="部门名称" :label-width="formLabelWidth" prop="name">
        <el-input v-model="dept.name" placeholder="请输入部门名称" />
      </el-form-item>

    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="save">确认</el-button>
      </div>
    </template>
  </el-dialog>


</template>




<style scoped>
.container {
  margin: 20px 0;
}
</style>
