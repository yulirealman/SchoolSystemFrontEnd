<script lang="ts" setup>
import { reactive, onMounted, ref } from 'vue'
import { queryClazzPageApi } from '@/api/clazzs'
import { queryStuPageApi, addStuApi, getStuByIdApi, updateStuApi, deleteStuByIdApi, updateViolationStuApi } from '@/api/stu'
import { ElMessage, ElMessageBox } from 'element-plus';
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const searchStu = ref({
    name: '',
    degree: '',
    clazzId: '',
})
const degrees = [
    { name: 'stu.inputArea.degrees.middleSchool', value: 1 },
    { name: 'stu.inputArea.degrees.highSchool', value: 2 },
    { name: 'stu.inputArea.degrees.college', value: 3 },
    { name: 'stu.inputArea.degrees.bachelor', value: 4 },
    { name: 'stu.inputArea.degrees.master', value: 5 },
    { name: 'stu.inputArea.degrees.doctor', value: 6 },
];
const dialogViolationFormRef = ref();
const dialogViolationForm = ref({
    id: '',
    violationScore: '',
});

const currentPage = ref(1);
const pageSize = ref(10);
const background = ref(true);
const total = ref(0);

const clazzList = ref([{}]);
const selectedStus = ref([]);
const stuList = ref([{}]);
const dialogFormTitle = ref("");
const dialogFormRef = ref();
const dialogFormVisible = ref(false);
const dialogViolationVisible = ref(false);
const stuForm = ref({
    name: '',
    no: '',
    gender: null,
    phone: '',
    idCard: '',
    isCollege: null,
    address: '',
    degree: '',
    clazzId: '',
    graduationDate: '',
});
const rules = {
    name: [{ required: true, message: t("stu.dialog.nameRule"), min: 2, max: 20 }],
    no: [{ required: true, message: t("stu.dialog.noRule") }],
    phone: [{ required: true, message: t("stu.dialog.phoneRule") }],
    gender: [{ required: true, message: t("stu.dialog.genderRule") }],
    idCard: [{ required: true, message: t("stu.dialog.idCardRule") }],
    isCollege: [{ required: true, message: t("stu.dialog.isCollegeRule") }],
    clazzId: [{ required: true, message: t("stu.dialog.clazzIdRule") }],

};
let handleSelectionChange = (selection) => {
    selectedStus.value = selection.map(item => item.id);
};

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
    dialogFormTitle.value = t('stu.dialog.titleAdd');

    if (dialogFormRef.value) {
        dialogFormRef.value.resetFields();

    }
    stuForm.value = { name: '', no: '', gender: null, phone: '', idCard: '', isCollege: null, address: '', degree: '', clazzId: '', graduationDate: '' };

    dialogFormVisible.value = true;
}

const openEdit = async (row) => {
    dialogFormTitle.value = t('stu.dialog.titleEdit');
    if (dialogFormRef.value) {
        dialogFormRef.value.resetFields();
    }

    dialogFormVisible.value = true;

    const result = await getStuByIdApi(row.id);
    if (result.code === 1) {
        stuForm.value = result.data;
        ElMessage.success(t("stu.table.editOps.querySuccessMessage"));
    } else {
        ElMessage.error(t("stu.table.editOps.queryFailMessage"));
    }
};



const deleteStu = async (row) => {
    // 先算要显示的 message
    const message = t("stu.table.deleteOps.confirmMessage", { name: row.name });
    ElMessageBox.confirm(message, t("stu.table.deleteOps.title"), {
        confirmButtonText: t("stu.table.deleteOps.confirm"),
        cancelButtonText: t("stu.table.deleteOps.cancel"),
        type: 'warning',
    })
        .then(async () => {
            const result = await deleteStuByIdApi(row.id);
            if (result.code === 1) {
                ElMessage.success(t("stu.table.deleteOps.deleteSuccess"));
                search();
            } else {
                ElMessage.error(t("stu.table.deleteOps.deleteFail"));
            }
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: t("stu.table.deleteOps.cancelMessage"),
            })
        })
};


const deleteStuBatch = async (ids) => {
    // 先算要显示的 message
    if (ids.length === 0) {
        ElMessage.error(t("stu.batchDelete.alertMessage"));
        return;
    }
    const message = t("stu.batchDelete.confirmMessage");

    ElMessageBox.confirm(message, t("stu.batchDelete.title"), {
        confirmButtonText: t("stu.batchDelete.confirm"),
        cancelButtonText: t("stu.batchDelete.cancel"),
        type: 'warning',
    })
        .then(async () => {
            const result = await deleteStuByIdApi(ids);
            if (result.code === 1) {
                ElMessage.success(t("stu.batchDelete.deleteSuccess"));
                search();
            } else {
                ElMessage.error(t("stu.batchDelete.deleteFail"));
            }
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: t("stu.batchDelete.cancelMessage"),
            })
        })
};


const openViolation = (row) => {

    if (dialogViolationFormRef.value) {
        dialogViolationFormRef.value.resetFields();
    }
    dialogViolationVisible.value = true;
    dialogFormTitle.value = t("stu.table.violationOps.title");
    dialogViolationForm.value.id = row.id;

};

const submitViolation = async () => {
    if (!dialogViolationFormRef.value) return;

    dialogViolationFormRef.value.validate(async (valid) => {

        if (valid) {
            let result;

            result = await updateViolationStuApi(dialogViolationForm.value);

            if (result.code === 1) {
                ElMessage.success(t("stu.table.violationOps.violationSuccess"));
                dialogViolationVisible.value = false;

                search();
            } else {
                ElMessage.error(t("stu.table.violationOps.violationFail"));
            }

        } else {
            ElMessage.error(t("stu.table.violationOps.formValidatedFail"));
        }
    });

}
const violationRules = {
    violationScore: [
        { required: true, message: t("stu.table.violationOps.violationPlaceholder"), trigger: 'blur' },
        { pattern: /^\d+$/, message: t("stu.table.violationOps.violationScoreRule"), trigger: 'blur' }
    ]
};

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

// ---------------------------
const submit = async () => {

    if (!dialogFormRef.value) return;

    dialogFormRef.value.validate(async (valid) => {

        if (valid) {
            let result;

            // 判断新增还是编辑
            if (stuForm.value.id) {

                result = await updateStuApi(stuForm.value);
                console.log('updateStuApi', stuForm.value);
            } else {

                result = await addStuApi(stuForm.value);
            }

            if (result.code === 1) {
                ElMessage.success(t('stu.dialog.saveSuccess'));
                dialogFormVisible.value = false;
                search();
            } else {
                ElMessage.error(t('stu.dialog.saveFail') + result.msg);
            }

        } else {
            ElMessage.error(t('stu.dialog.formValidatedFail'));
        }
    });

};



onMounted(() => {
    queryClazzList();
    queryStu();

});
</script>



<template>
    <h1>{{ t('stu.title') }}</h1>
    <div class="container">

        <el-form :inline="true" :model="searchStu">
            <el-form-item :label="t('stu.inputArea.name')">
                <el-input v-model="searchStu.name" :placeholder="t('stu.inputArea.namePlaceholder')" />
            </el-form-item>

            <el-form-item :label="t('stu.inputArea.degree')">
                <el-select v-model="searchStu.degree" :placeholder="t('stu.inputArea.degreePlaceholder')" clearable>
                    <el-option v-for="item in degrees" :key="item.value" :label="t(item.name)" :value="item.value" />
                </el-select>
            </el-form-item>

            <el-form-item :label="t('stu.inputArea.clazz')">
                <el-select v-model="searchStu.clazzId" :placeholder="t('stu.inputArea.clazzPlaceholder')" clearable>
                    <el-option v-for="item in clazzList" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
            </el-form-item>


            <el-form-item>
                <el-button type="primary" @click="search">{{ t('stu.inputArea.search') }}</el-button>
                <el-button type="info" @click="clear">{{ t('stu.inputArea.clear') }}</el-button>
            </el-form-item>
        </el-form>
    </div>
    <!-- 新增刪除按鍵 -->
    <div class="container">
        <el-button type="success" @click="addStu()">+ {{ t('stu.dialog.button') }}</el-button>
        <el-button type="danger" @click="deleteStuBatch(selectedStus)">- {{ t('stu.batchDelete.batchDelete')
            }}</el-button>

    </div>

    <!-- 表格 -->
    <div class="container">
        <el-table :data="stuList" border style="width: 100%" @selection-change="handleSelectionChange">

            <el-table-column type="selection" width="55" align="center" />
            <el-table-column prop="name" :label="t('stu.table.name')" width="90" align="center" />
            <el-table-column prop="no" :label="t('stu.table.no')" width="120" align="center" />
            <el-table-column prop="clazzName" :label="t('stu.table.clazz')" width="130" align="center" />

            <el-table-column :label="t('stu.table.gender')" width="80" align="center">
                <template #default="scope">
                    {{ scope.row.gender == 1 ? t('stu.table.male') : t('stu.table.female') }}
                </template>
            </el-table-column>

            <el-table-column prop="phone" :label="t('stu.table.phone')" width="120" align="center" />

            <el-table-column :label="t('stu.table.degree')" width="90" align="center">
                <template #default="{ row }">
                    <span>
                        {{
                            t(
                                degrees.find(d => d.value === row.degree)?.name
                        || 'stu.table.others'
                        )
                        }}
                    </span>

                </template>
            </el-table-column>

            <el-table-column prop="violationCount" :label="t('stu.table.violationCount')" width="90" align="center" />
            <el-table-column prop="violationScore" :label="t('stu.table.violationScore')" width="90" align="center" />


            <el-table-column prop="updateTime" :label="t('stu.table.lastUpdateTime')" width="150" align="center" />
            <el-table-column :label="t('stu.table.operation')" align="center">
                <template #default="scope">
                    <!-- 之所以scope能看到所有attribute 是因为在调用search（）时已经把数据全部取回来了 -->
                    <el-button type="primary" size="small" @click="openEdit(scope.row)">{{ t('stu.table.edit')
                        }}</el-button>
                    <el-button type="warning" size="small" @click="openViolation(scope.row)">{{ t('stu.table.violation')
                        }}</el-button>
                    <el-button type="danger" size="small" @click="deleteStu(scope.row)">{{ t('stu.table.delete')
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


    <!-- 新增员工或编辑员工对话框 -->
    <div class="container">
        <el-dialog v-model="dialogFormVisible" :title="dialogFormTitle" width="800px">
            <!-- 基础信息 -->
            <el-form :model="stuForm" label-width="100px" :rules="rules" ref="dialogFormRef">

                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item :label="t('stu.dialog.name')" prop="name">
                            <el-input v-model="stuForm.name" :placeholder="t('stu.dialog.namePlaceholder')" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="t('stu.dialog.no')" prop="no">
                            <el-input v-model="stuForm.no" :placeholder="t('stu.dialog.noPlaceholder')" />
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item :label="t('stu.dialog.gender')" prop="gender">
                            <el-select v-model="stuForm.gender" :placeholder="t('stu.dialog.genderPlaceholder')"
                                style="width: 100%">
                                <el-option :label="t('stu.dialog.male')" :value="1" />
                                <el-option :label="t('stu.dialog.female')" :value="2" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="t('stu.dialog.phone')" prop="phone">
                            <el-input v-model="stuForm.phone" :placeholder="t('stu.dialog.phonePlaceholder')" />
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item :label="t('stu.dialog.idCard')" prop="idCard">
                            <el-input v-model="stuForm.idCard" :placeholder="t('stu.dialog.idCardPlaceholder')" />
                        </el-form-item>
                    </el-col>

                    <el-col :span="12">
                        <el-form-item :label="t('stu.dialog.isCollege')" prop="isCollege">
                            <el-select v-model="stuForm.isCollege" :placeholder="t('stu.dialog.isCollegePlaceholder')"
                                style="width: 100%">
                                <el-option :label="t('stu.dialog.true')" :value="1" />
                                <el-option :label="t('stu.dialog.false')" :value="0" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item :label="t('stu.dialog.address')" prop="address">
                            <el-input v-model="stuForm.address" :placeholder="t('stu.dialog.addressPlaceholder')" />
                        </el-form-item>
                    </el-col>

                    <el-col :span="12">
                        <el-form-item :label="t('stu.dialog.degree')" prop="degree">
                            <el-select v-model="stuForm.degree" :placeholder="t('stu.dialog.degreePlaceholder')"
                                style="width: 100%">
                                <el-option :label="t('stu.inputArea.degrees.middleSchool')" :value="1" />
                                <el-option :label="t('stu.inputArea.degrees.highSchool')" :value="2" />
                                <el-option :label="t('stu.inputArea.degrees.college')" :value="3" />
                                <el-option :label="t('stu.inputArea.degrees.bachelor')" :value="4" />
                                <el-option :label="t('stu.inputArea.degrees.master')" :value="5" />
                                <el-option :label="t('stu.inputArea.degrees.doctor')" :value="6" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item :label="t('stu.dialog.graduationDate')" prop="graduationDate">
                            <el-date-picker type="date" v-model="stuForm.graduationDate" value-format="YYYY-MM-DD"
                                :placeholder="t('stu.dialog.graduationDatePlaceholder')" style="width: 100%" />
                        </el-form-item>
                    </el-col>

                    <el-col :span="12">
                        <el-form-item :label="t('stu.dialog.clazz')" prop="clazzId">
                            <el-select v-model="stuForm.clazzId" :placeholder="t('stu.dialog.clazzPlaceholder')"
                                style="width: 100%">
                                <el-option v-for="clazz in clazzList" :key="clazz.id" :label="clazz.name"
                                    :value="clazz.id" />
                            </el-select>
                        </el-form-item>
                    </el-col>

                </el-row>



            </el-form>

            <!-- Footer -->
            <template #footer>
                <el-button @click="dialogFormVisible = false">{{ t('stu.dialog.cancel') }}</el-button>
                <el-button type="primary" @click="submit">{{ t('stu.dialog.save') }}</el-button>
            </template>
        </el-dialog>
    </div>


    <div class="container">
        <el-dialog v-model="dialogViolationVisible" :title="dialogFormTitle" width="400px">
            <el-form :model="dialogViolationForm" label-width="120px" ref="dialogViolationFormRef"
                :rules="violationRules" label-position="top">

                <el-row :gutter="24">
                    <el-col :span="24">
                        <el-form-item :label="t('stu.table.violationOps.violationScore')" prop="violationScore">
                            <el-input v-model="dialogViolationForm.violationScore" :placeholder="t('stu.table.violationOps.violationPlaceholder')" />
                        </el-form-item>
                    </el-col>

                </el-row>
            </el-form>

            <!-- Footer -->
            <template #footer>
                <el-button @click="dialogViolationVisible = false">{{ t('stu.table.violationOps.cancel') }}</el-button>
                <el-button type="primary" @click="submitViolation">{{ t('stu.table.violationOps.confirm') }}</el-button>
            </template>
        </el-dialog>
    </div>

</template>

<style>
.container {
    margin: 10px 0px;
}
</style>