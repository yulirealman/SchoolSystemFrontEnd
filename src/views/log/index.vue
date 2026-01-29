<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { queryLogApi } from '@/api/reports'
const currentPage = ref(1);
const pageSize = ref(15);
const total = ref(0);
const logTableData = ref([{
}])

onMounted(() => {
    search()
})
const search = async () => {
    const result = await queryLogApi(currentPage.value, pageSize.value)
    if (result.code === 1) {
        logTableData.value = result.data.rows
        total.value = result.data.total
    }
}
// 分页相关
const handleSizeChange = (size) => {
    pageSize.value = size;
    search();
};

const handleCurrentChange = (page) => {
    currentPage.value = page;
    search();
};

</script>


<template>
    <el-table :data="logTableData" border style="width: 100%">
        <el-table-column prop="operateEmpName" label="Operator" width="140" />

        <el-table-column prop="operateTime" label="Operate Time" width="180" />

        <el-table-column prop="className" label="Class Name" min-width="260" show-overflow-tooltip />

        <el-table-column prop="methodName" label="Method Name" min-width="220" show-overflow-tooltip />

        <el-table-column prop="costTime" label="Cost (ms)" width="120" />

        <el-table-column prop="methodParams" label="Method Params" min-width="360" show-overflow-tooltip />

        <el-table-column prop="returnValue" label="Return Value" min-width="360" show-overflow-tooltip />

    </el-table>

    <!-- 分頁器 -->
    <div class="container">
        <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize"
            :page-sizes="[15,30, 50, 75, 100]" :background="background"
            layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange"
            @current-change="handleCurrentChange" />
    </div>
</template>
