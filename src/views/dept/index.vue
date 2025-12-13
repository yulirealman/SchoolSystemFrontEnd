<script lang="ts" setup>

import { ref, onMounted } from 'vue';
import { queryDeptListApi, queryByIdApi, addApi, updateApi, deleteByIdApi } from '@/api/depts';
import {ElMessage,ElMessageBox} from 'element-plus'
import { EditPen, Delete } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

onMounted(() => {
  search();
})

const deptList = ref([])
const search = async () => {
    const result = await queryDeptListApi()
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
    formTitle.value = t('dept.add');
    if (deptFormRef.value) {
    deptFormRef.value.resetFields();
    }

}
const save = async () => { 

  if(!deptFormRef.value) return;

  deptFormRef.value.validate(async (valid)=>{

    if(valid){


      let result;
      if(dept.value.id){
        result = await updateApi(dept.value);
      }else{
        result = await addApi(dept.value);
      }

      if (result.code === 1) {
        
        ElMessage.success(t('dept.saveSuccess'))
        

        dialogFormVisible.value = false;
        search();
      } else {
        ElMessage.error(t('dept.saveFail') + result.msg);

      }
    }else{
        ElMessage.error(t('dept.formValidateFail'));
    }
  });
  



}


//verify 
// const rules = ref({
//   name: [
//     { required: true, message: t('dept.inputPlaceholder'), trigger: 'blur' },
//     { min: 2, max: 30, message: t('dept.lengthLimit'), trigger: 'blur' }
//   ]
// });
const rules = {
  name: [
    { 
      required: true, 
      message: () => t('dept.inputPlaceholder'), 
      trigger: 'blur' 
    },
    { 
      min: 2, 
      max: 30, 
      message: () => t('dept.lengthLimit'), 
      trigger: 'blur' 
    }
  ]
}


const  deptFormRef = ref();


  const editDept = async (id) => { 

  formTitle.value = t('dept.edit');
  if (deptFormRef.value) {
    deptFormRef.value.resetFields();
  }
  const result = await queryByIdApi(id);

  if (result.code === 1) {
    dept.value = result.data;
    dialogFormVisible.value = true;
  }

}


const deleteById = async (id) => { 
  ElMessageBox.confirm(t('dept.deleteConfirm'), t('dept.prompt'), {
    confirmButtonText: t('dept.confirm'),
    cancelButtonText: t('dept.cancel'),
    type: 'warning',
  }).then(async () => {// 确认删除
    const result = await deleteByIdApi(id);
    if (result.code === 1) {
      ElMessage.success(t('dept.deleteSuccess'));
      search();
    } else {
      ElMessage.error(t('dept.deleteFail') + result.msg);
    }
  }).catch(() => {
    // 取消删除
    ElMessage.info(t('dept.deleteCancel'));
  });

}
</script>

<template>
    <h1>{{ t('dept.title') }}</h1>
    <div class="container">
        <el-button type="primary" @click="addDept">+{{ t('dept.add') }}</el-button>
    </div>

  <el-table :data="deptList" border style="width: 100%" >
    <el-table-column type="index" :label="t('dept.index')" width="100" align="center" />
    <el-table-column prop="name" :label="t('dept.departmentName')" width="260" align="center" />
    <el-table-column prop="updateTime" :label="t('dept.lastUpdateTime')" width="300" align="center" />
    <el-table-column :label="t('dept.operation')" align="center" > 
      <template #default="scope">
        
        <el-button type="primary" size="small" @click="editDept(scope.row.id)"> <el-icon><EditPen    /></el-icon> {{ t('dept.edit') }}</el-button>
        <el-button type="danger" size="small" @click="deleteById(scope.row.id)"> <el-icon><Delete /></el-icon> {{ t('dept.delete') }}</el-button>
      </template>
    </el-table-column>
  </el-table>


    <el-dialog v-model="dialogFormVisible" :title="formTitle" width="500">
          <!-- {{dept}} -->
    <el-form :model="dept" :rules="rules" ref="deptFormRef">
      <el-form-item :label="t('dept.name')" :label-width="formLabelWidth" prop="name">
        <el-input v-model="dept.name" :placeholder="t('dept.inputPlaceholder')" />
      </el-form-item>

    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ t('dept.cancel') }}</el-button>
        <el-button type="primary" @click="save">{{ t('dept.confirm') }}</el-button>
      </div>
    </template>
  </el-dialog>


</template>




<style scoped>
.container {
  margin: 10px 0;
}
</style>
