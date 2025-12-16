<script setup>
// ---------------------------
// 导入依赖
// ---------------------------
import { ref, watch, onMounted } from 'vue';
import { queryClazzPageApi, addClazzApi, updateClazzApi, getClazzByIdApi, deleteClazzByIdApi } from '@/api/clazzs';
import { queryAllEmps } from '@/api/emps';

import { ElMessage, ElMessageBox } from 'element-plus';

const subjects = ref([
    { name: "语文", value: 1 },
    { name: "数学", value: 2 },
    { name: "英语", value: 3 },
    { name: "物理", value: 4 },
    { name: "化学", value: 5 },
    { name: "生物", value: 6 },
]);

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
    name: [{ required: true, message: "请输入班级名称"}],
    room: [{ required: false, message: "请输入班级教室"}],
    beginDate: [{ required: true, message: "请选开课时间" }],
    endDate: [{ required: true, message: "请选结课时间" }],
    masterId: [{ required: false, message: "请选择班主任" }],
    subject: [{ required: true, message: "请选择课程" }],

};



// ---------------------------
// 打开对话框（新增）
// ---------------------------
const openAdd = () => {
    dialogFormTitle.value = "新增班级";

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
    dialogFormTitle.value = "编辑班级";
    // if (dialogFormRef.value) {
    //     dialogFormRef.value.resetFields();
    // }

    // dialogFormVisible.value = true;

    // const result = await getEmpByIdApi(row.id);
    // if (result.code === 1) {
    //     empForm.value = result.data;
    //     empForm.value.exprList = restoreExprList(empForm.value.exprList);
    //     ElMessage.success("获取员工信息成功");
    // } else {
    //     ElMessage.error("获取员工信息失败：" + result.msg);
    // }
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






const deleteEmp = async (row) => {
    // 先算要显示的 message
    const message = `确定要删除员工 ${row.name} 吗？`
    console.log(row)
    ElMessageBox.confirm(message, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
    })
        .then(async () => {
            const result = await deleteEmpByIdApi(row.id);
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

const selectedEmps = ref([]);

let handleSelectionChange = (selection) => {
    selectedEmps.value = selection.map(item => item.id);
};


</script>

<template>
    <!-- h1 -->
    <h1>班级管理</h1>
    <!-- 輸入欄位 -->
    <div class="container">
        <el-form :inline="true" :model="searchClazz" class="demo-form-inline">
            <el-form-item label="班级名称">
                <el-input v-model="searchClazz.name" placeholder="请输入班级名称" />
            </el-form-item>


            <el-form-item label="结课时间">
                <el-date-picker v-model="searchClazz.date" type="daterange" value-format="YYYY-MM-DD" range-separator="至"
                    start-placeholder="开始日期" end-placeholder="结束日期" />
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="search">查询</el-button>
                <el-button type="info" @click="clear">清空</el-button>
            </el-form-item>
        </el-form>
    </div>

    <!-- 新增刪除按鍵 -->
    <div class="container">
        <el-button type="success" @click="openAdd">+ 新增班级</el-button>
    </div>

    <!-- 表格 -->
    <div class="container">
        <el-table :data="clazzList" border style="width: 100%" @selection-change="handleSelectionChange">
            <el-table-column type="index" label="序号" width="70" align="center" />
            <el-table-column prop="name" label="班级名称" width="180" align="center" />
            <el-table-column prop="room" label="班级教室" width="100" align="center" />
            <el-table-column prop="masterId" label="班主任" width="100" align="center" />
            <el-table-column prop="beginDate" label="开课时间" width="120" align="center" />
            <el-table-column prop="endDate" label="结课时间" width="120" align="center" />
            <el-table-column prop="status" label="状态" width="100" align="center" />
            <el-table-column prop="updateTime" label="最后修改时间" width="200" align="center" />
            <el-table-column label="操作" align="center">
                <template #default="scope">
                    <!-- 之所以scope能看到所有attribute 是因为在调用search（）时已经把数据全部取回来了 -->
                    <el-button type="primary" size="small" @click="">编辑</el-button>
                    <el-button type="danger" size="small" @click="">删除</el-button>
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
        <el-dialog v-model="dialogFormVisible" :title="dialogTitle" width="500px">
            <!-- 基础信息 -->
            <el-form :model="clazzForm" label-width="100px" :rules="rules" ref="dialogFormRef">

                <el-row :gutter="24">
                    <el-col :span="24">
                        <el-form-item label="班级名称" prop="name">
                            <el-input v-model="clazzForm.name" placeholder="请输入班级名称" />
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="24">
                    <el-col :span="24">
                        <el-form-item label="教室" prop="room">
                            <el-input v-model="clazzForm.room" placeholder="请输入班级教室" />
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="24">
                    <el-col :span="24">
                        <el-form-item label="开课时间" prop="beginDate" >
                            <el-date-picker type="date" v-model="clazzForm.beginDate" value-format="YYYY-MM-DD"
                                placeholder="请选择开课时间" style="width: 100%" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24">
                    <el-col :span="24">
                        <el-form-item label="结课时间" prop="endDate">
                            <el-date-picker type="date" v-model="clazzForm.endDate" value-format="YYYY-MM-DD"
                                placeholder="请选择结课时间" style="width: 100%" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24">
                    <el-col :span="24">
                        <el-form-item label="班主任" prop="masterId">
                            <el-select v-model="clazzForm.masterId" placeholder="请选择班主任" style="width: 100%" >
                                <el-option v-for="d in masters" :key="d.id" :label="d.name" :value="d.id" />
                            </el-select>

                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24">
                    <el-col :span="24">
                        <el-form-item label="学科" prop="subject">
                            <el-select v-model="clazzForm.subject" placeholder="请选择学科" style="width: 100%" >
                                <el-option v-for="subject in subjects" :key="subject.value" :label="subject.name" :value="subject.value" />
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
