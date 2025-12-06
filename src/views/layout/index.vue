<script setup>
import { Avatar, Document, HelpFilled, Histogram, HomeFilled, InfoFilled, Menu, Promotion, Share, Tools, UserFilled } from '@element-plus/icons-vue';



</script>

<template>
  <div class="common-layout">
    <el-container>
      <el-header class="header">
        <span class="title">学校系统</span>

        <span class="right_tool">
          <a href="#">
            <el-icon><EditPen /></el-icon>修改密码 &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
          </a>

          <a href="#">
            <el-icon><SwitchButton /></el-icon>退出登录
          </a>
        </span>
      </el-header>


      <el-container>
        <el-aside width="200px" class="aside">      
          <el-scrollbar>
            <el-menu router="true">


                <el-menu-item index="/index">
                  <el-icon><Promotion/></el-icon>首页
                </el-menu-item>



              <el-sub-menu index="/manage">
                <template #title>
                  <el-icon><Menu/></el-icon>班级学员管理
                </template>


                  <el-menu-item index="/clazz"><el-icon><HomeFilled /></el-icon>班级管理</el-menu-item>
                  <el-menu-item index="/stu"><el-icon><UserFilled /></el-icon>学员管理</el-menu-item>


              </el-sub-menu>

              <el-sub-menu index="/system">
                <template #title>
                  <el-icon><Tools /></el-icon>系统信息管理
                </template>


                  <el-menu-item index="/dept"><el-icon><HelpFilled /></el-icon>部门管理</el-menu-item>
                  <el-menu-item index="/emp"><el-icon><Avatar /></el-icon>员工管理</el-menu-item>


              </el-sub-menu>

              <el-sub-menu index="/report">
                <template #title>
                  <el-icon><Histogram/></el-icon>数据统计管理
                </template>


                  <el-menu-item index="/empReport"><el-icon><InfoFilled /></el-icon>员工信息统计</el-menu-item>
                  <el-menu-item index="/stuReport"><el-icon><Share /></el-icon>学院信息统计</el-menu-item>
                  <el-menu-item index="/log"><el-icon><Document /></el-icon>日志信息统计</el-menu-item>

              </el-sub-menu>

            </el-menu>
          </el-scrollbar>
        </el-aside>
        <el-main router>
          <router-view> </router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style scoped>
.common-layout {
  height: 100vh;
  display: flex;
}

/* Header */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  height: 60px;
  background-color: #409EFF;
  color: #fff;
}

.title {
  font-size: 20px;
  font-weight: bold;
}

/* Right tool links */
.right_tool a {
  color: #fff;
  text-decoration: none;
  font-size: 14px;
}

.right_tool a:hover {
  text-decoration: underline;
  cursor: pointer;
}

/* Sidebar */
.aside {
  background: #f7f7f7;
  border-right: 1px solid #e3e3e3;
  padding: 0; /* Element menu needs no padding */
  height: calc(100vh - 60px); /* Fit minus header height */
}

/* Main content */
.el-main {
  background: #fff;
  padding: 20px;
  overflow: auto;
}

</style>
