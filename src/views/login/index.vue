<script setup>
import { ref } from "vue";

const form = ref({
  username: "",
  password: ""
});

const handleLogin = () => {
  console.log("登录信息：", form.value);
};
</script>

<template>
  <div class="login-container">
    <div class="login-box">
      <h2 class="title">学校系统登录</h2>

      <el-form :model="form" label-width="60px">
        <el-form-item label="账号">
          <el-input v-model="form.username" placeholder="请输入账号"></el-input>
        </el-form-item>

        <el-form-item label="密码">
          <el-input
            v-model="form.password"
            type="password"
            show-password
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" style="width: 100%" @click="handleLogin">
            登录
          </el-button>
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

  /* --- 关键修改：往上提 --- */
  align-items: flex-start;
  padding-top: 120px;
  /* ---------------------- */

  background: #f1f1f1;
}

.login-box {
  width: 350px;
  padding: 30px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.1);
}

.title {
  text-align: center;
  margin-bottom: 20px;
  font-size: 22px;
  font-weight: bold;
}
</style>
