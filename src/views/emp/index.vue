<script setup>
    import { ref,watch, onMounted } from 'vue';
    import {queryPageApi} from '@/api/emp';
    
    const searchEmp = ref({ name: '', gender: '', date:[],begin:'',end:'' });

    watch(() => searchEmp.value.date, (newVal,oldVal) => {
         if(newVal.length==2){
            searchEmp.value.begin = newVal[0];
            searchEmp.value.end = newVal[1];
        }else{
            searchEmp.value.begin = '';
            searchEmp.value.end = '';
        }
        
    }, { deep: true });

    onMounted(() => {
        search();
    })

    const search = async () => {
        const result = await queryPageApi(searchEmp.value.name, searchEmp.value.gender, searchEmp.value.begin, searchEmp.value.end, currentPage.value, pageSize.value)
        if(result.code === 1){
            empList.value = result.data.rows ;
            total.value = result.data.total;
        }
    }

    const clear = () => {
        searchEmp.value = { name: '', gender: '', date:[],begin:'',end:'' };
        search();
    }


    const empList = ref([{
    }]);

    const currentPage = ref(1);    
    const pageSize = ref(10);
    const background  = ref(true);
    const total = ref(0);
    const handleSizeChange = (size) => {
        search();
    };
    const handleCurrentChange = (page) => {
        search();
    };
</script>

<template>
    <!-- h1 -->
    <h1>员工管理</h1>
    

    <div class="container"> 
        <el-form :inline="true" :model="searchEmp" class="demo-form-inline">
            <el-form-item label="姓名">
                <el-input v-model="searchEmp.name" placeholder="请输入员工姓名" />
            </el-form-item>
             
            <el-form-item label="性别">
            <el-select v-model="searchEmp.gender"  placeholder="请选择性别" clearable   >
                <el-option label=" 男" value="1" />
                <el-option label="女" value="2" />
            </el-select>
            </el-form-item>
            <el-form-item label="入职时间">
            <el-date-picker
                v-model="searchEmp.date"
                type="daterange"

                value-format="YYYY-MM-DD"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                placeholder="请选择入职时间"
            />
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="search">查询</el-button>
                <el-button type="info" @click="clear">清空</el-button>
            </el-form-item>
        </el-form>
    </div>


    <div class="container">
        <el-button type="primary" @click="">+ 新增员工</el-button>
        <el-button type="danger" @click="">- 批量删除</el-button>

    </div>

    <div class="container">
        <el-table :data="empList" border style="width: 100%" >
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column prop="name" label="姓名" width="120" align="center" />
            <el-table-column label="性别" width="120" align="center">
                <template #default="scope">
                    {{ scope.row.gender == 1 ? '男' : '女' }}
                </template>
            </el-table-column>
            <el-table-column prop="image" label="头像" width="120" align="center">
                <template #default="scope">
                    <img :src="scope.row.image" height="40px" />
                </template>
            </el-table-column>
            <el-table-column prop="deptName" label="所属部门" width="120" align="center" /> 
            <el-table-column prop="job" label="职位" width="120" align="center">
                <template #default="scope">
                    <span v-if="scope.row.job == 1">班主任</span>
                    <span v-else-if="scope.row.job == 2">讲师</span>
                    <span v-else-if="scope.row.job == 3">学工主管</span>
                    <span v-else-if="scope.row.job == 4">教研主管</span>
                    <span v-else-if="scope.row.job == 5">咨询师</span> 
                    <span v-else>其他</span>
                </template>
            </el-table-column>
            <el-table-column prop="entryDate" label="入职日期" width="180" align="center" />    
            <el-table-column prop="updateTime" label="最后操作时间" width="200" align="center" />
            <el-table-column label="操作" align="center" >
                <template #default="scope">
                    <el-button type="primary" size="small" @click="" >编辑</el-button>
                    <el-button type="danger" size="small" @click="">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
            


    </div>

    <div class="container">
        <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[5,10 , 20, 30, 50, 75 , 100]"
            :background="background"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
        />
    </div>


</template>

<style scoped>
    .container{
        margin: 10px 0px;
    }
</style>
