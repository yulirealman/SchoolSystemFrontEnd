<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { queryLogApi } from '@/api/reports'
import { useI18n } from 'vue-i18n'
const { locale, t } = useI18n()
const currentPage = ref(1);
const pageSize = ref(10);
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
    <div class="container">
        <h1>{{ t('log.title') }}</h1>
        <el-table :data="logTableData" border style="width: 100%">
            <el-table-column prop="operateEmpName" :label="t('log.operator')" width="140" />

            <el-table-column prop="operateTime" :label="t('log.operateTime')" width="180" />

            <el-table-column prop="className" :label="t('log.className')" min-width="260" show-overflow-tooltip />

            <el-table-column prop="methodName" :label="t('log.methodName')" min-width="220" show-overflow-tooltip />
            <el-table-column prop="costTime" :label="t('log.costTime')" width="120" />

            <el-table-column prop="methodParams" :label="t('log.methodParams')" min-width="360" show-overflow-tooltip />

            <el-table-column prop="returnValue" :label="t('log.returnValue')" min-width="360" show-overflow-tooltip />
        </el-table>

        <!-- 分頁器 -->
        <div class="container">
            <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize"
                :page-sizes="[10, 30, 50, 75, 100]" :background="background"
                layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange"
                @current-change="handleCurrentChange" />
        </div>
    </div>

</template>
