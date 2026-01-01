<script lang="ts" setup>
import { reactive, onMounted, ref } from 'vue'
import { queryClazzPageApi } from '@/api/clazzs'
import { queryStuPageApi } from '@/api/stu'
import { ElMessage } from 'element-plus';
const searchStu = ref({
    name: '',
    degree: '',
    clazzId: '',
})
const degrees = [
    { name: '初中', value: 1 },
    { name: '高中', value: 2 },
    { name: '大专', value: 3 },
    { name: '本科', value: 4 },
    { name: '硕士', value: 5 },
    { name: '博士', value: 6 },
];

const currentPage = ref(1);
const pageSize = ref(10);
const background = ref(true);
const total = ref(0);

const clazzList = ref([{}]);
const selectedStus = ref([]);
const stuList = ref([{}]);

const search = async () => {
    const result = await queryStuPageApi(
        searchStu.value.name,
        searchStu.value.degree,
        searchStu.value.clazzId,
        currentPage.value,
        pageSize.value
    )
    if (result.code === 1) {
        stuList.value = result.data.rows;
        total.value = result.data.total;
    }
    
}

const clear = () => {
    searchStu.value = { name: '', degree: '', clazzId: '' };
    queryStu();
}

const addStu = () => {
    console.log('addStu')
}

const deleteBatch = (selectedStus) => {
    console.log('deleteBatch', selectedStus)
}

// 分页相关
// 分页相关
const handleSizeChange = (size) => {
    pageSize.value = size;
    queryStu();
};

const handleCurrentChange = (page) => {
    currentPage.value = page;
    queryStu();
};



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

const queryStu = async () => { 
    try {
        const result = await queryStuPageApi(searchStu.value.name, searchStu.value.degree, searchStu.value.clazzId, currentPage.value, pageSize.value);
        stuList.value = [];
        if (result.code === 1) {
            stuList.value = result.data.rows;
            total.value = result.data.total;
            console.log('stuList', stuList.value);
        } else {
            ElMessage.error('获取学员列表失败');
        }
    } catch (error) {
        ElMessage.error('获取学员列表出错');
    }

};
onMounted(() => {
    queryClazzList();
    queryStu();

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
                <el-select v-model="searchStu.clazzId" placeholder="请选择所属班级" clearable>
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

    <!-- 表格 -->
    <div class="container">
        <el-table :data="stuList" border style="width: 100%" @selection-change="handleSelectionChange">

            <el-table-column type="selection" width="55" align="center" />
            <el-table-column prop="name" label="姓名" width="90" align="center" />
            <el-table-column prop="no" label="学号" width="120" align="center" />
            <el-table-column prop="clazzName" label="班级" width="130" align="center" />
            
            <el-table-column label="性别" width="80" align="center">
                <template #default="scope">
                    {{ scope.row.gender == 1 ? '男' : '女' }}
                </template>
            </el-table-column>

            <el-table-column prop="phone" label="手机号" width="120" align="center" />

            <el-table-column prop="degree" label="最高学历" width="90" align="center">
                <template #default="{ row }">
                    <span>
                        {{degrees.find(degree => degree.value === row.degree)?.name || '其他'}}
                    </span>
                </template>
            </el-table-column>
            
             <el-table-column prop="violationCount" label="违纪次数" width="90" align="center" />
             <el-table-column prop="violationScore" label="违纪扣分" width="90" align="center" />


            <el-table-column prop="updateTime" label="最后操作时间" width="150" align="center" />
            <el-table-column label="操作" align="center">
                <template #default="scope">
                    <!-- 之所以scope能看到所有attribute 是因为在调用search（）时已经把数据全部取回来了 -->
                    <el-button type="primary" size="small" @click="openEdit(scope.row)">编辑</el-button>
                    <el-button type="warning" size="small" @click="openViolation(scope.row)">违纪</el-button>
                    <el-button type="danger" size="small" @click="openDelete(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>



    </div>

    <!-- 分頁器 -->
    <div class="container">
        <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize"
            :page-sizes="[5, 10, 20, 30, 50, 75, 100]" :background="background"
            layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange"
            @current-change="handleCurrentChange" />
    </div>



</template>

<style>
.container {
    margin: 10px 0px;
}
</style>