<script lang="ts" setup>
import { reactive, onMounted, ref } from 'vue'
import { queryClazzPageApi } from '@/api/clazzs'
import { queryStuPageApi, addStuApi, getStuByIdApi, updateStuApi, deleteStuByIdApi, updateViolationStuApi } from '@/api/stu'
import { ElMessage, ElMessageBox } from 'element-plus';
import { isFixedColumn } from 'element-plus/es/components/table/src/util.mjs';
import { id } from 'element-plus/es/locales.mjs';
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
    name: [{ required: true, message: "请输入学员姓名，2-20个字", min: 2, max: 20 }],
    no: [{ required: true, message: "学号为必填选项" }],
    phone: [{ required: true, message: "手机号为必填选项" }],
    gender: [{ required: true, message: "性别为必填选项" }],
    idCard: [{ required: true, message: "身份证号为必填选项" }],
    isCollege: [{ required: true, message: "是否院校学院为必填选项" }],
    clazzId: [{ required: true, message: "班级为必填选项" }],

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
    dialogFormTitle.value = "新增学员";

    if (dialogFormRef.value) {
        dialogFormRef.value.resetFields();

    }
    stuForm.value = { name: '', no: '', gender: null, phone: '', idCard: '', isCollege: null, address: '', degree: '', clazzId: '', graduationDate: '' };

    dialogFormVisible.value = true;
}

const openEdit = async (row) => {
    dialogFormTitle.value = "编辑学员";
    if (dialogFormRef.value) {
        dialogFormRef.value.resetFields();
    }

    dialogFormVisible.value = true;

    const result = await getStuByIdApi(row.id);
    if (result.code === 1) {
        stuForm.value = result.data;
        ElMessage.success("获取学员信息成功");
    } else {
        ElMessage.error("获取学员信息失败：" + result.msg);
    }
};



const deleteStu = async (row) => {
    // 先算要显示的 message
    const message = `确定要删除学员 ${row.name} 吗？`
    ElMessageBox.confirm(message, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
    })
        .then(async () => {
            const result = await deleteStuByIdApi(row.id);
            if (result.code === 1) {
                ElMessage.success('删除成功');
                search();
            } else {
                ElMessage.error("删除失败：" + result.msg);
            }
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '删除取消',
            })
        })
};


const deleteStuBatch = async (ids) => {
    // 先算要显示的 message
    if (ids.length === 0) {
        ElMessage.error("请选择要删除的员工");
        return;
    }
    const message = `确定要删除选中的 ${ids.length} 个员工吗？`

    ElMessageBox.confirm(message, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
    })
        .then(async () => {
            const result = await deleteStuByIdApi(ids);
            if (result.code === 1) {
                ElMessage.success('删除成功');
                search();
            } else {
                ElMessage.error("删除失败：" + result.msg);
            }
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '删除取消',
            })
        })
};


const openViolation = (row) => {

    if (dialogViolationFormRef.value) {
        dialogViolationFormRef.value.resetFields();
    }
    dialogViolationVisible.value = true;
    dialogFormTitle.value = "违规记录";
    dialogViolationForm.value.id = row.id;

};

const submitViolation = async () => {
    if (!dialogViolationFormRef.value) return;

    dialogViolationFormRef.value.validate(async (valid) => {

        if (valid) {
            let result;

            result = await updateViolationStuApi(dialogViolationForm.value);

            if (result.code === 1) {
                ElMessage.success('保存成功');
                dialogViolationVisible.value = false;

                search();
            } else {
                ElMessage.error("保存失败：" + result.msg);
            }

        } else {
            ElMessage.error("表单验证失败，请检查输入项");
        }
    });

}
const violationRules = {
    violationScore: [
        { required: true, message: '请输入违纪分数', trigger: 'blur' },
        { pattern: /^\d+$/, message: '必须是数字', trigger: 'blur' }
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
                ElMessage.success('保存成功');
                dialogFormVisible.value = false;
                search();
            } else {
                ElMessage.error("保存失败：" + result.msg);
            }

        } else {
            ElMessage.error("表单验证失败，请检查输入项");
        }
    });

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
        <el-button type="danger" @click="deleteStuBatch(selectedStus)">- 批量删除</el-button>

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
                    <el-button type="danger" size="small" @click="deleteStu(scope.row)">删除</el-button>
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
                        <el-form-item label="姓名" prop="name">
                            <el-input v-model="stuForm.name" placeholder="请输入学员姓名" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="学号" prop="no">
                            <el-input v-model="stuForm.no" placeholder="请输入学员学号" />
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="性别" prop="gender">
                            <el-select v-model="stuForm.gender" placeholder="请选择性别" style="width: 100%">
                                <el-option label="男" :value="1" />
                                <el-option label="女" :value="2" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="手机号" prop="phone">
                            <el-input v-model="stuForm.phone" placeholder="请输入手机号" />
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="身份证号" prop="idCard">
                            <el-input v-model="stuForm.idCard" placeholder="请输入身份证号" />
                        </el-form-item>
                    </el-col>

                    <el-col :span="12">
                        <el-form-item label="是否院校" prop="isCollege">
                            <el-select v-model="stuForm.isCollege" placeholder="请选择是否院校学院" style="width: 100%">
                                <el-option label="是" :value="1" />
                                <el-option label="否" :value="0" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="联系地址" prop="address">
                            <el-input v-model="stuForm.address" placeholder="请输入联系地址" />
                        </el-form-item>
                    </el-col>

                    <el-col :span="12">
                        <el-form-item label="最高学历" prop="degree">
                            <el-select v-model="stuForm.degree" placeholder="请选择最高学历" style="width: 100%">
                                <el-option label="初中" :value="1" />
                                <el-option label="高中" :value="2" />
                                <el-option label="大专" :value="3" />
                                <el-option label="本科" :value="4" />
                                <el-option label="硕士" :value="5" />
                                <el-option label="博士" :value="6" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="毕业时间" prop="graduationDate">
                            <el-date-picker type="date" v-model="stuForm.graduationDate" value-format="YYYY-MM-DD"
                                placeholder="请选择毕业时间" style="width: 100%" />
                        </el-form-item>
                    </el-col>

                    <el-col :span="12">
                        <el-form-item label="班级" prop="clazzId">
                            <el-select v-model="stuForm.clazzId" placeholder="请选择班级" style="width: 100%">
                                <el-option v-for="clazz in clazzList" :key="clazz.id" :label="clazz.name"
                                    :value="clazz.id" />
                            </el-select>
                        </el-form-item>
                    </el-col>

                </el-row>



            </el-form>

            <!-- Footer -->
            <template #footer>
                <el-button @click="dialogFormVisible = false">取消</el-button>
                <el-button type="primary" @click="submit">保存</el-button>
            </template>
        </el-dialog>
    </div>


    <div class="container">
        <el-dialog v-model="dialogViolationVisible" :title="dialogFormTitle" width="400px">
            <el-form :model="dialogViolationForm" label-width="120px" ref="dialogViolationFormRef"
                :rules="violationRules" label-position="top">

                <el-row :gutter="24">
                    <el-col :span="24">
                        <el-form-item label="请输入违纪分数" prop="violationScore">
                            <el-input v-model="dialogViolationForm.violationScore" placeholder="请输入违纪分数" />
                        </el-form-item>
                    </el-col>

                </el-row>
            </el-form>

            <!-- Footer -->
            <template #footer>
                <el-button @click="dialogViolationVisible = false">取消</el-button>
                <el-button type="primary" @click="submitViolation">保存</el-button>
            </template>
        </el-dialog>
    </div>

</template>

<style>
.container {
    margin: 10px 0px;
}
</style>