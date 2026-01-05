<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { loginApi } from "@/api/login";
import { ElMessage } from "element-plus";
import { useI18n } from 'vue-i18n'  
const { t } = useI18n()
const form = ref({
  username: "",
  password: ""
});
const router = useRouter();
// 登录按钮逻辑
const handleLogin = async () => {
  const result = await loginApi(form.value);
  if(result.code){
    ElMessage.success(t("login.loginSuccess"));

    localStorage.setItem("loginUser",JSON.stringify(result.data));

    router.push("/index");

  }else{
    ElMessage.error(t("login.loginFail"));
  }
  // 这里可以加 axios 请求登录
};

// 清空表单
const clearForm = () => {
  form.value.username = "";
  form.value.password = "";
};
</script>


<template>
  <div class="login-container">
    <div class="login-box">
      <h2 class="title">{{ t("login.title") }}</h2>

      <el-form :model="form" label-width="60px">
        <!-- 账号输入 -->
        <el-form-item :label="t('login.username')">
          <el-input v-model="form.username" :placeholder="t('login.usernamePlaceholder')" />
        </el-form-item>

        <!-- 密码输入 -->
        <el-form-item :label="t('login.password')">
          <el-input
            v-model="form.password"
            type="password"
            show-password
            :placeholder="t('login.passwordPlaceholder')"
          />
        </el-form-item>

        <!-- 按钮组 -->
        <el-form-item>
          <div class="button-group">
            <el-button type="primary" @click="handleLogin"> {{ t("login.login") }}</el-button>
            <el-button type="info" @click="clearForm"> {{ t("login.clear") }}</el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>


<style scoped>
.login-container {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 120px;
  background: #f1f1f1;
}

.login-box {
  width: 360px;
  padding: 30px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.1);
}

.title {
  text-align: center;
  margin-bottom: 25px;
  font-size: 22px;
  font-weight: bold;
}

/* 按钮组居中 */
.button-group {
  display: flex;
  justify-content: center;
  gap: 15px;
}

/* 可选：按钮宽度统一 */
.button-group .el-button {
  min-width: 100px;
}
</style>
