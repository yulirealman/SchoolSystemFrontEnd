<script setup>
// ---------------------------
// 导入依赖
// ---------------------------
import { ref, watch, onMounted } from 'vue';
import { queryPageApi, addEmpApi, updateEmpApi, getEmpByIdApi, deleteEmpByIdApi } from '@/api/emps';
import { queryDeptListApi } from '@/api/depts';
import { ElMessage, ElMessageBox } from 'element-plus';

const jobs = ref([
    { name: "班主任", value: 1 },
    { name: "讲师", value: 2 },
    { name: "学工主管", value: 3 },
    { name: "教研主管", value: 4 },
    { name: "咨询师", value: 5 },
    { name: "其他", value: 6 },
]);


const genders = ref([
    { name: '男', value: 1 },
    { name: '女', value: 2 }
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
    username: [{ required: true, message: "请输入员工用户名，2-20个字", min: 2, max: 20 }],
    name: [{ required: true, message: "请输入员工姓名，2-20个字", min: 2, max: 20 }],
    phone: [{ required: true, message: "请输入手机号" }],
    gender: [{ required: true, message: "请选择性别" }],
    job: [{ required: false, message: "请选择职位" }],
    entryDate: [{ required: false, message: "请选择入职日期" }],
    updateDate: [{ required: false, message: "请选择更新日期" }],
};


// ---------------------------
// 打开对话框（新增）
// ---------------------------
const openAdd = () => {
    dialogFormTitle.value = "新增员工";

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
    dialogFormTitle.value = "编辑员工";
    if (dialogFormRef.value) {
        dialogFormRef.value.resetFields();
        empForm.value = { exprList: [] };
    }

    dialogFormVisible.value = true;

    const result = await getEmpByIdApi(row.id);
    if (result.code === 1) {
        empForm.value = result.data;
        empForm.value.exprList = restoreExprList(empForm.value.exprList);
        ElMessage.success("获取员工信息成功");
    } else {
        ElMessage.error("获取员工信息失败：" + result.msg);
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

const deleteEmpBatch = async (ids) => {
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
            const result = await deleteEmpByIdApi(ids);
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
        <el-form :inline="true" :model="searchEmp" class="demo-form-inline">
            <el-form-item label="班级名称">
                <el-input v-model="searchEmp.name" placeholder="请输入班级名称" />
            </el-form-item>


            <el-form-item label="结课时间">
                <el-date-picker v-model="searchEmp.date" type="daterange" value-format="YYYY-MM-DD" range-separator="至"
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
        <el-button type="success" @click="">+ 新增班级</el-button>
    </div>

    <!-- 表格 -->
    <div class="container">
        <el-table :data="empList" border style="width: 100%" @selection-change="handleSelectionChange">
            <el-table-column type="index" label="序号" width="70" align="center" />
            <el-table-column prop="className" label="班级名称" width="120" align="center" />
            <el-table-column prop="classRoom" label="班级教室" width="100" align="center" />
            <el-table-column prop="headTeacher" label="班主任" width="100" align="center" />
            <el-table-column prop="beginTime" label="开课时间" width="120" align="center" />
            <el-table-column prop="endTime" label="结课时间" width="120" align="center" />
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


    <!-- 新增员工或编辑员工对话框 -->
    <div class="container">
        <el-dialog v-model="dialogFormVisible" :title="dialogTitle" width="800px">
            <!-- 基础信息 -->
            <el-form :model="empForm" label-width="100px" :rules="rules" ref="dialogFormRef">

                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="用户名" prop="username">
                            <el-input v-model="empForm.username" placeholder="请输入员工用户名，2-20个字" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="姓名" prop="name">
                            <el-input v-model="empForm.name" placeholder="请输入员工姓名，2-20个字" />
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="性别" prop="gender">
                            <el-select v-model="empForm.gender" placeholder="请选择性别">
                                <el-option label="男" :value="1" />
                                <el-option label="女" :value="2" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="手机号" prop="phone">
                            <el-input v-model="empForm.phone" placeholder="请输入员工手机号" />
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="职位" prop="job">
                            <el-select v-model="empForm.job" placeholder="请选择职位">
                                <el-option v-for="job in jobs" :key="job.value" :label="job.name" :value="job.value" />

                            </el-select>
                        </el-form-item>
                    </el-col>

                    <el-col :span="12">
                        <el-form-item label="薪资" prop="salary">
                            <el-input v-model="empForm.salary" type="number" placeholder="请输入员工薪资" />
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="所属部门" prop="deptId">
                            <el-select v-model="empForm.deptId" placeholder="请选择部门">
                                <el-option v-for="d in depts" :key="d.id" :label="d.name" :value="d.id" />
                            </el-select>

                        </el-form-item>
                    </el-col>

                    <el-col :span="12">
                        <el-form-item label="入职日期" prop="entryDate">
                            <el-date-picker type="date" v-model="empForm.entryDate" value-format="YYYY-MM-DD"
                                placeholder="请选择入职日期" />
                        </el-form-item>
                    </el-col>
                </el-row>

                <!-- 头像上传 -->
                <el-form-item label="头像" prop="image">
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
                                + 添加工作经历
                            </el-button>
                        </el-form-item>
                    </el-col>
                </el-row>



                <div v-for="(item, index) in empForm.exprList" :key="index" class="expr-item">
                    <el-row :gutter="3">

                        <!-- 时间 -->
                        <el-col :span="10">
                            <el-form-item label="时间" label-width="80px" size="small">
                                <el-date-picker v-model="item.date" type="daterange" value-format="YYYY-MM-DD"
                                    range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" size="small" />
                            </el-form-item>
                        </el-col>

                        <!-- 公司 -->
                        <el-col :span="6">
                            <el-form-item label="公司" label-width="60px" size="small">
                                <el-input v-model="item.company" size="small" />
                            </el-form-item>
                        </el-col>

                        <!-- 职位 -->
                        <el-col :span="6">
                            <el-form-item label="职位" label-width="60px" size="small">
                                <el-input v-model="item.job" size="small" />
                            </el-form-item>
                        </el-col>

                        <!-- 删除按钮 -->
                        <el-col :span="2">
                            <el-form-item label-width="0px" size="small">
                                <el-button type="danger" size="small" @click="removeExpr(index)">
                                    -删除
                                </el-button>
                            </el-form-item>
                        </el-col>

                    </el-row>
                </div>





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
