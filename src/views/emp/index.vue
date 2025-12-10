<script setup>
// ---------------------------
// 导入依赖
// ---------------------------
import { ref, watch, onMounted } from 'vue';
import { queryPageApi, addEmpApi, updateEmpApi,getEmpByIdApi} from '@/api/emps';
import { ElMessage } from 'element-plus';



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
const deptList = [
    { id: 1, name: "教研部" },
    { id: 2, name: "咨询部" },
    { id: 3, name: "行政部" },
    { id: 4, name: "学工部" },
    { id: 5, name: "就业部" },
    { id: 6, name: "人事部" }
];

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
        empForm.value = { exprList: [] };
    }


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
    // 用户要求不改功能 → 保持原样
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


</script>

<template>
    <!-- h1 -->
    <h1>员工管理</h1>

    <!-- 輸入欄位 -->
    <div class="container">
        <el-form :inline="true" :model="searchEmp" class="demo-form-inline">
            <el-form-item label="姓名">
                <el-input v-model="searchEmp.name" placeholder="请输入员工姓名" />
            </el-form-item>

            <el-form-item label="性别">
                <el-select v-model="searchEmp.gender" placeholder="请选择性别" clearable>
                    <el-option label=" 男" value="1" />
                    <el-option label="女" value="2" />
                </el-select>
            </el-form-item>
            <el-form-item label="入职时间">
                <el-date-picker v-model="searchEmp.date" type="daterange" value-format="YYYY-MM-DD" range-separator="至"
                    start-placeholder="开始日期" end-placeholder="结束日期" placeholder="请选择入职时间" />
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="search">查询</el-button>
                <el-button type="info" @click="clear">清空</el-button>
            </el-form-item>
        </el-form>
    </div>

    <!-- 新增刪除按鍵 -->
    <div class="container">
        <el-button type="primary" @click="openAdd()">+ 新增员工</el-button>
        <el-button type="danger" @click="">- 批量删除</el-button>

    </div>

    <!-- 表格 -->
    <div class="container">
        <el-table :data="empList" border style="width: 100%">
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
            <el-table-column label="操作" align="center">
                <template #default="scope">
                    <el-button type="primary" size="small" @click="openEdit(scope.row)">编辑</el-button>
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
                                <el-option label="班主任" :value="1" />
                                <el-option label="讲师" :value="2" />
                                <el-option label="学工主管" :value="3" />
                                <el-option label="教研主管" :value="4" />
                                <el-option label="咨询师" :value="5" />
                                <el-option label="其他" :value="6" />

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
                                <el-option v-for="d in deptList" :key="d.id" :label="d.name" :value="d.id" />
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
                <div style="display: flex; align-items: center; margin: 10px 40px;">
                    <span style="margin-right: 10px;">工作经历</span>
                    <el-button type="success" @click="addExpr" size="small">
                        + 添加工作经历
                    </el-button>
                </div>

                <div style="margin-left: 40px;">
                        <div v-for="(item, index) in empForm.exprList" :key="index" class="expr-item">
                            <el-row :gutter="10" class="expr-row" size="small">

                                <!-- 时间 -->
                                <el-col :span="12">
                                    <el-form-item label="时间" label-width="40px" size="small">
                                        <el-date-picker v-model="item.date" type="daterange" value-format="YYYY-MM-DD"
                                            range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"
                                            size="small" />
                                    </el-form-item>
                                </el-col>

                            <!-- 公司 -->
                            <el-col :span="5">
                                <el-form-item label="公司" label-width="40px" size="small">
                                    <el-input v-model="item.company" size="small" />
                                </el-form-item>
                            </el-col>

                            <!-- 职位 -->
                            <el-col :span="5">
                                <el-form-item label="职位" label-width="40px" size="small">
                                    <el-input v-model="item.job" size="small" />
                                </el-form-item>
                            </el-col>

                            <!-- 删除按钮 -->
                            <el-col :span="2" class="flex items-center">
                                <el-button type="danger" size="small" @click="removeExpr(index)">
                                    删除
                                </el-button>
                            </el-col>

                        </el-row>
                    </div>
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
