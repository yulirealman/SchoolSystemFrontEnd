<script lang="ts" setup>
import { reactive, onMounted, ref } from 'vue'
import {queryClazzPageApi} from '@/api/clazzs'
import { ElMessage } from 'element-plus';
const searchStu = ref({
    name: '',
    degree: '',
    clazz: '',
})
const degrees = [
  { name: '初中', value: 1 },
  { name: '高中', value: 2 },
  { name: '大专', value: 3 },
  { name: '本科', value: 4 },
  { name: '硕士', value: 5 },
  { name: '博士', value: 6 },
];


const clazzList = ref([{}]);
const selectedStus = ref([]);
const search = () => {
    console.log('submit!')
}

const clear = () => {

}

const addStu = () => {
    console.log('addStu')
}

const deleteBatch = (selectedStus) => {
    console.log('deleteBatch', selectedStus)
}



const queryClazzList = async () => {
  try {
    const result = await queryClazzPageApi("", "", "", 1, 100);
    clazzList.value = []; 
    if (result.code === 1) {
      clazzList.value = result.data.rows.map(item => ({
        id: item.id,
        name: item.name
      }));
    } else {
      ElMessage.error('获取班级列表失败');
    }
  } catch (error) {
    ElMessage.error('获取班级列表出错');
  }
};


onMounted(async () => {
    await queryClazzList();
});
</script>



<template>
    <h1>学员管理</h1>
    <div class="container">

        <el-form :inline="true" :model="searchStu">
            <el-form-item label="姓名">
                <el-input v-model="searchStu.name" placeholder="请输入姓名" />
            </el-form-item>

            <el-form-item label="最高学历">
                <el-select v-model="searchStu.degree" placeholder="请选择最高学历" clearable>
                    <el-option v-for="item in degrees" :key="item.value" :label="item.name" :value="item.value" />
                </el-select>
            </el-form-item>

            <el-form-item label="所属班级">
                <el-select v-model="searchStu.clazz" placeholder="请选择所属班级" clearable>
                    <el-option v-for="item in clazzList" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
            </el-form-item>


            <el-form-item>
                <el-button type="primary" @click="search">查询</el-button>
                <el-button type="info" @click="clear">清空</el-button>
            </el-form-item>
        </el-form>
    </div>
        <!-- 新增刪除按鍵 -->
    <div class="container">
        <el-button type="success" @click="addStu()">+ 新增学员</el-button>
        <el-button type="danger" @click="deleteBatch(selectedStus)">- 批量删除</el-button>

    </div>




</template>

<style>
.container {
    margin: 10px 0px;
}
</style>