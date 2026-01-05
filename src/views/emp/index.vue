<script setup>
// ---------------------------
// 导入依赖
// ---------------------------
import { ref, watch, onMounted } from 'vue';
import { queryPageApi, addEmpApi, updateEmpApi, getEmpByIdApi, deleteEmpByIdApi } from '@/api/emps';
import { queryDeptListApi } from '@/api/depts';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useI18n } from 'vue-i18n'
const { locale, t } = useI18n()

const jobs = ref([
    { name: 'emp.dialog.positions.professor', value: 1 },
    { name: 'emp.dialog.positions.associateProfessor', value: 2 },
    { name: 'emp.dialog.positions.assistantProfessor', value: 3 },
    { name: 'emp.dialog.positions.instructor', value: 4 },
    { name: 'emp.dialog.positions.lecturer', value: 5 },
    { name: 'emp.dialog.positions.ta', value: 6 },
    { name: 'emp.dialog.positions.researcher', value: 7 },
    { name: 'emp.dialog.positions.adminStaff', value: 8 },
    { name: 'emp.dialog.positions.techStaff', value: 9 },
    { name: 'emp.dialog.positions.others', value: 10 },
]);


const genders = ref([
    { name: t('emp.inputArea.male'), value: 1 },
    { name: t('emp.inputArea.female'), value: 2 }
]);



// ---------------------------
// 搜索区：搜索参数 + 监听器
// ---------------------------
const searchEmp = ref({ name: '', gender: '', date: [], begin: '', end: '' });

// 监听日期范围变化 → 自动同步 begin/end
watch(() => searchEmp.value.date, (newVal) => {
    if (newVal.length == 2) {
        searchEmp.value.begin = newVal[0];
        searchEmp.value.end = newVal[1];
    } else {
        searchEmp.value.begin = '';
        searchEmp.value.end = '';
    }
}, { deep: true });


// ---------------------------
// 生命周期：进入页面自动查询
// ---------------------------
onMounted(() => {
    search();
    queryDeptList();
});


// ---------------------------
// 查询列表函数
// ---------------------------
const empList = ref([{}]);
const currentPage = ref(1);
const pageSize = ref(10);
const background = ref(true);
const total = ref(0);

const search = async () => {
    const result = await queryPageApi(
        searchEmp.value.name,
        searchEmp.value.gender,
        searchEmp.value.begin,
        searchEmp.value.end,
        currentPage.value,
        pageSize.value
    )
    if (result.code === 1) {
        empList.value = result.data.rows;
        total.value = result.data.total;
    }
};

// 清空搜索条件
const clear = () => {
    searchEmp.value = { name: '', gender: '', date: [], begin: '', end: '' };
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

const queryDeptList = async () => {
    const result = await queryDeptListApi();
    if (result.code === 1) {
        depts.value = result.data;
    }
}

// 员工表单
const empForm = ref({
    // image: "",
    // username: "",
    // name: "",
    // gender: null,
    // phone: "",
    // job: null,
    // salary: "",
    // entryDate: "",
    // deptId: null,
    exprList: []
});




// ---------------------------
// 表单校验规则
// ---------------------------
const rules = {
    username: [{ required: true, message: t("emp.dialog.usernameRule"), min: 2, max: 20 }],
    name: [{ required: true, message: t("emp.dialog.nameRule"), min: 2, max: 20 }],
    phone: [{ required: true, message: t("emp.dialog.phoneRule") }],
    gender: [{ required: true, message: t("emp.dialog.genderRule") }],

};


// ---------------------------
// 打开对话框（新增）
// ---------------------------
const openAdd = () => {
    dialogFormTitle.value = t('emp.dialog.titleAdd');

    if (dialogFormRef.value) {
        dialogFormRef.value.resetFields();

    }
    empForm.value = { exprList: [] };

    dialogFormVisible.value = true;
};


// ---------------------------
// 打开对话框（编辑）
// ---------------------------
const openEdit = async (row) => {
    dialogFormTitle.value = t('emp.dialog.titleEdit');
    if (dialogFormRef.value) {
        dialogFormRef.value.resetFields();
        empForm.value = { exprList: [] };
    }

    dialogFormVisible.value = true;

    const result = await getEmpByIdApi(row.id);
    if (result.code === 1) {
        empForm.value = result.data;
        empForm.value.exprList = restoreExprList(empForm.value.exprList);
        ElMessage.success(t('emp.table.editOps.querySuccessMessage'));
    } else {
        ElMessage.error(t('emp.table.editOps.queryFailMessage') + result.msg);
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
// 工作经历：添加 + 删除
// ---------------------------
const addExpr = () => {
    empForm.value.exprList.push({
        company: "",
        job: "",
        begin: "",
        end: "",
        date: [] // 初始化时间数组
    });
};

const removeExpr = (index) => {

    empForm.value.exprList.splice(index, 1);
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
            if (empForm.value.id) {
                empForm.value.exprList = normalizeExprList(empForm.value.exprList);
                result = await updateEmpApi(empForm.value);
            } else {
                empForm.value.exprList = normalizeExprList(empForm.value.exprList);
                result = await addEmpApi(empForm.value);
            }

            if (result.code === 1) {
                ElMessage.success(t('emp.dialog.saveSuccess'));
                dialogFormVisible.value = false;
                search();
            } else {
                ElMessage.error(t('emp.dialog.saveFail'));
            }

        } else {
            ElMessage.error(t('emp.dialog.formValidateFail'));
        }
    });

};



const normalizeExprList = (list) => {
    return list.map(item => ({
        ...item,
        begin: item.date?.[0] || '',
        end: item.date?.[1] || '',
    }));
};

const restoreExprList = (list) => {
    return list.map(item => ({
        ...item,
        date: [item.begin, item.end],
    }));
};

const deleteEmp = async (row) => {
    // 先算要显示的 message
    const message = t('emp.table.deleteOps.confirmMessage').replace('{name}', row.name);
    console.log(row)
    ElMessageBox.confirm(message, t('emp.table.deleteOps.title'), {
        confirmButtonText: t('emp.table.deleteOps.confirm'),
        cancelButtonText: t('emp.table.deleteOps.cancel'),
        type: 'warning',
    })
        .then(async () => {
            const result = await deleteEmpByIdApi(row.id);
            if (result.code === 1) {
                ElMessage.success( t('emp.table.deleteOps.deleteSuccess'));
                search();
            } else {
                ElMessage.error(t('emp.table.deleteOps.deleteFail') + result.msg);
            }
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: t('emp.table.deleteOps.cancelMessage'),
            })
        })
};

const deleteEmpBatch = async (ids) => { 
    // 先算要显示的 message
    if(ids.length === 0) {
        ElMessage.error(t('emp.batchDelete.alertMessage'));
        return;
    }
    const message =  t('emp.batchDelete.confirmMessage');

    ElMessageBox.confirm(message, t('emp.batchDelete.title'), {
        confirmButtonText: t('emp.batchDelete.confirm'),
        cancelButtonText: t('emp.batchDelete.cancel'),
        type: 'warning',
    })
        .then(async () => {
            const result = await deleteEmpByIdApi(ids);
            if (result.code === 1) {
                ElMessage.success(t('emp.batchDelete.deleteSuccess'));
                search();
            } else {
                ElMessage.error(t('emp.batchDelete.deleteFail'));
            }
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: t('emp.batchDelete.cancelMessage'),
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
    <h1>{{ t('emp.title') }}</h1>
    <!-- 輸入欄位 -->
    <div class="container">
        <el-form :inline="true" :model="searchEmp">
            <el-form-item :label="t('emp.inputArea.name')">
                <el-input v-model="searchEmp.name" :placeholder="t('emp.inputArea.namePlaceholder')" />
            </el-form-item>

            <el-form-item :label="t('emp.inputArea.gender')">
                <el-select v-model="searchEmp.gender" :placeholder="t('emp.inputArea.genderPlaceholder')" clearable style="width: 100%">
                    <el-option v-for="item in genders" :key="item.value" :label="t(item.name)" :value="item.value" />
                </el-select>
            </el-form-item>
            <el-form-item :label="t('emp.inputArea.entryDate')">
                <el-date-picker v-model="searchEmp.date" type="daterange" value-format="YYYY-MM-DD" :range-separator="t('emp.inputArea.to')"
                    :start-placeholder="t('emp.inputArea.startDatePlaceholder')" :end-placeholder="t('emp.inputArea.endDatePlaceholder')" placeholder="请选择入职时间" />
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="search">{{ t('emp.inputArea.search') }}</el-button>
                <el-button type="info" @click="clear">{{ t('emp.inputArea.clear') }}</el-button>
            </el-form-item>
        </el-form>
    </div>

    <!-- 新增刪除按鍵 -->
    <div class="container">
        <el-button type="primary" @click="openAdd()">+ {{ t('emp.dialog.button') }}</el-button>
        <el-button type="danger" @click="deleteEmpBatch(selectedEmps)">- {{ t('emp.batchDelete.batchDelete') }}</el-button>

    </div>

    <!-- 表格 -->
    <div class="container">
        <el-table :data="empList" border style="width: 100%" @selection-change="handleSelectionChange">

            <el-table-column type="selection" width="55" align="center" />
            <el-table-column prop="name" :label="t('emp.table.name')" width="120" align="center" />
            <el-table-column prop="gender" :label="t('emp.table.gender')" width="120" align="center">
                <template #default="scope">
                    {{ scope.row.gender == 1 ? t('emp.table.male') : t('emp.table.female') }}
                </template>
            </el-table-column>
            <el-table-column prop="image" :label="t('emp.table.avatar')" width="120" align="center">
                <template #default="scope">
                    <img :src="scope.row.image" height="40px" />
                </template>
            </el-table-column>
            <el-table-column prop="deptName" :label="t('emp.table.dept')" width="120" align="center" />

            <el-table-column prop="job" :label="t('emp.table.position')" width="120" align="center">
                <template #default="{ row }">
                    <span>
                        {{jobs.find(job => job.value === row.job)?.name || t('emp.table.other')}}
                    </span>
                </template>
            </el-table-column>

            <el-table-column prop="entryDate" :label="t('emp.table.entryDate')" width="180" align="center" />
            <el-table-column prop="updateTime" :label="t('emp.table.lastUpdateTime')" width="200" align="center" />
            <el-table-column :label="t('emp.table.operation')" align="center">
                <template #default="scope">
                    <!-- 之所以scope能看到所有attribute 是因为在调用search（）时已经把数据全部取回来了 -->
                    <el-button type="primary" size="small" @click="openEdit(scope.row)">{{ t('emp.table.edit') }}</el-button>
                    <el-button type="danger" size="small" @click="deleteEmp(scope.row)">{{ t('emp.table.delete') }}</el-button>
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


    <!-- 新增员工或编辑员工对话框 -->
    <div class="container">
        <el-dialog v-model="dialogFormVisible" :title="dialogFormTitle" width="800px">
            <!-- 基础信息 -->
            <el-form :model="empForm" label-width="100px" :rules="rules" ref="dialogFormRef">

                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item :label="t('emp.dialog.username')" prop="username">
                            <el-input v-model="empForm.username" :placeholder="t('emp.dialog.usernamePlaceholder')" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="t('emp.dialog.name')" prop="name">
                            <el-input v-model="empForm.name" :placeholder="t('emp.dialog.namePlaceholder')" />
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item :label="t('emp.dialog.gender')" prop="gender">
                            <el-select v-model="empForm.gender" :placeholder="t('emp.dialog.genderPlaceholder')" style="width: 100%">
                                <el-option :label="t('emp.dialog.male')" :value="1" />
                                <el-option :label="t('emp.dialog.female')" :value="2" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="t('emp.dialog.phone')" prop="phone">
                            <el-input v-model="empForm.phone" :placeholder="t('emp.dialog.phonePlaceholder')" />
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item :label="t('emp.dialog.position')" prop="job">
                            <el-select v-model="empForm.job" :placeholder="t('emp.dialog.positionPlaceholder')" style="width: 100%">
                                <el-option v-for="job in jobs" :key="job.value" :label="t(job.name)" :value="job.value" />

                            </el-select>
                        </el-form-item>
                    </el-col>

                    <el-col :span="12">
                        <el-form-item :label="t('emp.dialog.salary')" prop="salary">
                            <el-input v-model="empForm.salary" type="number" :placeholder="t('emp.dialog.salaryPlaceholder')" />
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item :label="t('emp.dialog.dept')" prop="deptId">
                            <el-select v-model="empForm.deptId" :placeholder="t('emp.dialog.deptPlaceholder')" style="width: 100%">
                                <el-option v-for="d in depts" :key="d.id" :label="d.name" :value="d.id" />
                            </el-select>

                        </el-form-item>
                    </el-col>

                    <el-col :span="12">
                        <el-form-item :label="t('emp.dialog.entryDate')" label-width="100px" prop="entryDate">
                            <el-date-picker type="date" v-model="empForm.entryDate" value-format="YYYY-MM-DD"
                                :placeholder="t('emp.dialog.entryDatePlaceholder')" style="width: 100%" />
                        </el-form-item>
                    </el-col>
                </el-row>

                <!-- 头像上传 -->
                <el-form-item :label="t('emp.dialog.avatar')" prop="image">
                    <el-upload class="avatar-uploader" :show-file-list="false" action="#"
                        :on-success="handleUploadSuccess" :before-upload="beforeUpload">
                        <img v-if="empForm.image" :src="empForm.image" class="avatar" />
                        <el-icon v-else class="avatar-uploader-icon">
                            <Plus />
                        </el-icon>
                    </el-upload>
                </el-form-item>

                <!-- 工作经历 -->
                <el-row :gutter="10">

                    <el-col :span="24">
                        <el-form-item label="工作经历" prop="exprList">
                            <el-button type="success" @click="addExpr" size="small">
                                + {{ t('emp.dialog.workExprButton') }}
                            </el-button>
                        </el-form-item>
                    </el-col>
                </el-row>



                <div v-for="(item, index) in empForm.exprList" :key="index" class="expr-item">
                    <el-row :gutter="3">

                        <!-- 时间 -->
                        <el-col :span="10">
                            <el-form-item :label="t('emp.dialog.workExprDate')" label-width="80px" size="small">
                                <el-date-picker v-model="item.date" type="daterange" value-format="YYYY-MM-DD"
                                    :range-separator="t('emp.dialog.to')" :start-placeholder="t('emp.dialog.workExprStartDatePlaceholder')" :end-placeholder="t('emp.dialog.workExprEndDatePlaceholder')" size="small" />
                            </el-form-item>
                        </el-col>

                        <!-- 公司 -->
                        <el-col :span="6">
                            <el-form-item :label="t('emp.dialog.workExprCompany')" label-width="60px" size="small">
                                <el-input v-model="item.company" size="small" />
                            </el-form-item>
                        </el-col>

                        <!-- 职位 -->
                        <el-col :span="6">
                            <el-form-item :label="t('emp.dialog.workExprPosition')" label-width="60px" size="small">
                                <el-input v-model="item.job" size="small" />
                            </el-form-item>
                        </el-col>

                        <!-- 删除按钮 -->
                        <el-col :span="2">
                            <el-form-item label-width="0px" size="small">
                                <el-button type="danger" size="small" @click="removeExpr(index)">
                                    - {{ t('emp.dialog.workExprDelete') }}
                                </el-button>
                            </el-form-item>
                        </el-col>

                    </el-row>
                </div>





            </el-form>

            <!-- Footer -->
            <template #footer>
                <el-button @click="dialogFormVisible = false">{{ t('emp.dialog.cancel') }}</el-button>
                <el-button type="primary" @click="submit">{{ t('emp.dialog.save') }}</el-button>
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
