<script setup>
// ---------------------------
// 导入依赖
// ---------------------------
import { ref, watch, onMounted } from 'vue';
import { queryClazzPageApi, addClazzApi, updateClazzApi, getClazzByIdApi, deleteClazzByIdApi } from '@/api/clazzs';
import { queryAllEmps } from '@/api/emps';

import { ElMessage, ElMessageBox } from 'element-plus';
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const subjects = ref([
    { name: 'clazz.dialog.subjects.literature', value: 1 },
    { name: 'clazz.dialog.subjects.history', value: 2 },
    { name: 'clazz.dialog.subjects.philosophy', value: 3 },
    { name: 'clazz.dialog.subjects.economics', value: 4 },
    { name: 'clazz.dialog.subjects.law', value: 5 },
    { name: 'clazz.dialog.subjects.education', value: 6 },
    { name: 'clazz.dialog.subjects.management', value: 7 },
    { name: 'clazz.dialog.subjects.science', value: 8 },
    { name: 'clazz.dialog.subjects.engineering', value: 9 },
    { name: 'clazz.dialog.subjects.agriculture', value: 10 },
    { name: 'clazz.dialog.subjects.medicine', value: 11 },
    { name: 'clazz.dialog.subjects.art', value: 12 },
]);
const statusMap = {
    '已开班': 'clazz.table.statusActive',
    '未开班': 'clazz.table.statusInactive',
    '结课': 'clazz.table.statusEnd'
}


const emps = ref({
    name: '',
    gender: '',
    begin: '',
    end: '',
    page: 1,
    pageSize: 10
});


const masters = ref([]);

const queryMasterList = async () => {
    const result = await queryAllEmps({
        name: '',
        gender: '',
        begin: '',
        end: '',
        page: 1,
        pageSize: 100
    });
    if (result.code === 1) {
        masters.value = result.data.rows;
    }
}


// ---------------------------
// 搜索区：搜索参数 + 监听器
// ---------------------------
const searchClazz = ref();
searchClazz.value = { name: '', begin: '', end: '', date: [], page: 1, pageSize: 10 };
// 监听日期范围变化 → 自动同步 begin/end
watch(() => searchClazz.value.date, (newVal) => {
    if (newVal.length == 2) {
        searchClazz.value.begin = newVal[0];
        searchClazz.value.end = newVal[1];
    } else {
        searchClazz.value.begin = '';
        searchClazz.value.end = '';
    }
}, { deep: true });


// ---------------------------
// 生命周期：进入页面自动查询
// ---------------------------
onMounted(() => {
    search();

    queryMasterList();
});


// ---------------------------
// 查询列表函数
// ---------------------------
const clazzList = ref([{}]);
const currentPage = ref(1);
const pageSize = ref(10);
const background = ref(true);
const total = ref(0);

const search = async () => {
    const result = await queryClazzPageApi(
        searchClazz.value.name,
        searchClazz.value.begin,
        searchClazz.value.end,
        currentPage.value,
        pageSize.value
    );
    if (result.code === 1) {

        clazzList.value = result.data.rows;
        total.value = result.data.total;
    }
};

// 清空搜索条件
const clear = () => {
    searchClazz.value = { name: '', begin: '', end: '', date: [], page: 1, pageSize: 10 };
    search();
};


// 分页相关
const handleSizeChange = (size) => {
    pageSize.value = size;
    search();
};

const handleCurrentChange = (page) => {
    currentPage.value = page;
    search();
};


// ---------------------------
// 对话框控制（新增 / 编辑）
// ---------------------------
const dialogFormVisible = ref(false);
const dialogFormTitle = ref("");
const dialogFormRef = ref();


// ---------------------------
// 表单数据 & 部门列表
// ---------------------------
const depts = ref([]);


// 班级表单
const clazzForm = ref({
    // name: '',
    // room: '',
    // beginDate: '',
    // endDate: '',
    // teacherId: null,
    // subject: null,

});




// ---------------------------
// 表单校验规则
// ---------------------------
const rules = {
    name: [{ required: true, message: t("clazz.rule.requiredName") }],
    room: [{ required: false, message: t("clazz.rule.notRequiredRoom") }],
    beginDate: [{ required: true, message: t("clazz.rule.requiredBeginDate") }],
    endDate: [{ required: true, message: t("clazz.rule.requiredEndDate") }],
    masterId: [{ required: false, message: t("clazz.rule.notRequiredMasterId") }],
    subject: [{ required: true, message: t("clazz.rule.requiredSubject") }],

};



// ---------------------------
// 打开对话框（新增）
// ---------------------------
const openAdd = () => {
    dialogFormTitle.value = t("clazz.dialog.titleAdd");

    if (dialogFormRef.value) {
        dialogFormRef.value.resetFields();

    }
    clazzForm.value = {};

    dialogFormVisible.value = true;
};


// ---------------------------
// 打开对话框（编辑）
// ---------------------------
const openEdit = async (row) => {
    dialogFormTitle.value = t("clazz.dialog.titleEdit");
    if (dialogFormRef.value) {
        dialogFormRef.value.resetFields();
    }

    dialogFormVisible.value = true;

    const result = await getClazzByIdApi(row.id);
    if (result.code === 1) {
        clazzForm.value = result.data;
        ElMessage.success(t("clazz.table.messageSuccess"));
    } else {
        ElMessage.error(t("clazz.table.messageFail") + result.msg);
    }
};


// ---------------------------
// 上传校验 + 上传成功处理
// ---------------------------
const beforeUpload = (file) => {
    const isImg = ["image/jpeg", "image/png", "image/jpg"].includes(file.type);
    if (!isImg) {
        ElMessage.error("只能上传 JPG/PNG");
        return false;
    }
    if (file.size > 2 * 1024 * 1024) {
        ElMessage.error("图片不能超过 2M");
        return false;
    }
    return true;
};

const handleUploadSuccess = (res, file) => {
    form.value.image = URL.createObjectURL(file.raw);
};






// ---------------------------
// 保存员工信息（新增 / 编辑）
// ---------------------------
const submit = async () => {

    if (!dialogFormRef.value) return;

    dialogFormRef.value.validate(async (valid) => {

        if (valid) {
            let result;

            // 判断新增还是编辑
            if (clazzForm.value.id) {

                result = await updateClazzApi(clazzForm.value);
            } else {

                result = await addClazzApi(clazzForm.value);
            }

            if (result.code === 1) {
                ElMessage.success(t("clazz.dialog.saveSuccess"));
                dialogFormVisible.value = false;
                search();
            } else {
                ElMessage.error(t("clazz.dialog.saveFail") + result.msg);
            }

        } else {
            ElMessage.error(t("clazz.dialog.formValidateFail"));
        }
    });

};






const openDelete = async (row) => {
    // 先算要显示的 message
    const message = t("clazz.table.deleteConfirm") + ` ${row.name} 吗？`
    console.log(row)
    ElMessageBox.confirm(message, t("clazz.table.deleteTitle"), {
        confirmButtonText: t("clazz.table.confirmButton"),
        cancelButtonText: t("clazz.table.cancelButton"),
        type: 'warning',
    })
        .then(async () => {
            const result = await deleteClazzByIdApi(row.id);
            if (result.code === 1) {
                ElMessage.success(t("clazz.table.messageDeleteSuccess"));
                search();
            } else {
                ElMessage.error(t("clazz.table.messageFailDelete"));
            }
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: t("clazz.table.messageDeleteCancel"),
            })
        })
};

const selectedEmps = ref([]);

let handleSelectionChange = (selection) => {
    selectedEmps.value = selection.map(item => item.id);
};


</script>

<template>
    <!-- h1 -->
    <h1>{{ t('clazz.title') }}</h1>
    <!-- 輸入欄位 -->
    <div class="container">
        <el-form :inline="true" :model="searchClazz" class="demo-form-inline">
            <el-form-item :label="t('clazz.inputArea.clazzName')">
                <el-input v-model="searchClazz.name" :placeholder="t('clazz.inputArea.clazzNamePlaceholder')" />
            </el-form-item>


            <el-form-item :label="t('clazz.inputArea.endDate')">
                <el-date-picker v-model="searchClazz.date" type="daterange" value-format="YYYY-MM-DD"
                    :range-separator="t('clazz.inputArea.to')"
                    :start-placeholder="t('clazz.inputArea.startPlaceholder')"
                    :end-placeholder="t('clazz.inputArea.endPlaceholder')" />
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="search">{{ t('clazz.inputArea.search') }}</el-button>
                <el-button type="info" @click="clear">{{ t('clazz.inputArea.clear') }}</el-button>
            </el-form-item>
        </el-form>
    </div>

    <!-- 新增刪除按鍵 -->
    <div class="container">
        <el-button type="success" @click="openAdd">+ {{ t('clazz.dialog.button') }}</el-button>
    </div>

    <!-- 表格 -->
    <div class="container">
        <el-table :data="clazzList" border style="width: 100%" @selection-change="handleSelectionChange">
            <el-table-column type="index" :label="t('clazz.table.index')" width="70" align="center" />
            <el-table-column prop="name" :label="t('clazz.table.clazzName')" width="180" align="center" />
            <el-table-column prop="room" :label="t('clazz.table.room')" width="100" align="center" />
            <el-table-column prop="masterName" :label="t('clazz.table.masterName')" width="100" align="center" />


            <el-table-column prop="beginDate" :label="t('clazz.table.beginDate')" width="120" align="center" />
            <el-table-column prop="endDate" :label="t('clazz.table.endDate')" width="120" align="center" />
            <el-table-column prop="status" :label="t('clazz.table.status')" width="100" align="center"
                :formatter="row => t(statusMap[row.status] || row.status)" />

            <el-table-column prop="updateTime" :label="t('clazz.table.lastUpdateTime')" width="200" align="center" />
            <el-table-column :label="t('clazz.table.operation')" align="center">
                <template #default="scope">
                    <!-- 之所以scope能看到所有attribute 是因为在调用search（）时已经把数据全部取回来了 -->
                    <el-button type="primary" size="small" @click="openEdit(scope.row)">{{ t('clazz.table.edit')
                        }}</el-button>
                    <el-button type="danger" size="small" @click="openDelete(scope.row)">{{ t('clazz.table.delete')
                        }}</el-button>
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


    <!-- 新增班级或编辑班级对话框 -->
    <div class="container">
        <el-dialog v-model="dialogFormVisible" :title="dialogFormTitle" width="500px">
            <!-- 基础信息 -->
            <el-form :model="clazzForm" label-width="100px" :rules="rules" ref="dialogFormRef">

                <el-row :gutter="24">
                    <el-col :span="24">
                        <el-form-item :label="t('clazz.dialog.clazzName')" prop="name">
                            <el-input v-model="clazzForm.name" :placeholder="t('clazz.dialog.clazzNamePlaceholder')" />
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="24">
                    <el-col :span="24">
                        <el-form-item :label="t('clazz.dialog.room')" prop="room">
                            <el-input v-model="clazzForm.room" :placeholder="t('clazz.dialog.roomPlaceholder')" />
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="24">
                    <el-col :span="24">
                        <el-form-item :label="t('clazz.dialog.beginDate')" prop="beginDate">
                            <el-date-picker type="date" v-model="clazzForm.beginDate" value-format="YYYY-MM-DD"
                                :placeholder="t('clazz.dialog.beginDatePlaceholder')" style="width: 100%" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24">
                    <el-col :span="24">
                        <el-form-item :label="t('clazz.dialog.endDate')" prop="endDate">
                            <el-date-picker type="date" v-model="clazzForm.endDate" value-format="YYYY-MM-DD"
                                :placeholder="t('clazz.dialog.endDatePlaceholder')" style="width: 100%" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24">
                    <el-col :span="24">
                        <el-form-item :label="t('clazz.dialog.masterName')" prop="masterId">
                            <el-select v-model="clazzForm.masterId" :placeholder="t('clazz.dialog.masterPlaceholder')"
                                style="width: 100%">
                                <el-option v-for="d in masters" :key="d.id" :label="d.name" :value="d.id" />
                            </el-select>

                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24">
                    <el-col :span="24">
                        <el-form-item :label="t('clazz.dialog.subject')" prop="subject">
                            <el-select v-model="clazzForm.subject" :placeholder="t('clazz.dialog.subjectPlaceholder')"
                                style="width: 100%">
                                <el-option v-for="subject in subjects" :key="subject.value" :label="t(subject.name)"
                                    :value="subject.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>








            </el-form>

            <!-- Footer -->
            <template #footer>
                <el-button @click="dialogFormVisible = false">{{ t('clazz.table.cancelButton') }}</el-button>
                <el-button type="primary" @click="submit">{{ t('clazz.table.confirmButton') }}</el-button>
            </template>
        </el-dialog>
    </div>

</template>

<style scoped>
.container {
    margin: 10px 0px;
}

.avatar {
    width: 100px;
    height: 100px;
    border-radius: 8px;
    object-fit: cover;
}

.avatar-uploader .avatar {
    border: 1px solid #dcdfe6;
}

.avatar-uploader-icon {
    font-size: 30px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    border: 1px dashed #d9d9d9;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
