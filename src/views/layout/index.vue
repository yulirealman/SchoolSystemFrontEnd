<script setup>
import {
  Avatar, Document, HelpFilled, Histogram, HomeFilled,
  InfoFilled, Menu, Promotion, Share, Tools, UserFilled
} from '@element-plus/icons-vue'

import { useI18n } from 'vue-i18n'
import { ref, watch } from 'vue'
import { useElementLang } from '@/utils/elementLang'

const { elementLang } = useElementLang()
const { t, locale } = useI18n()

const languages = {
  en: 'English',
  jp: '日本語',
  cn: '中文'
}

const currentLang = ref(elementLang.value)

// 初始化同步
locale.value = elementLang.value

// 关键：双向保持一致
watch(elementLang, (val) => {
  currentLang.value = val
  locale.value = val
})

const switchLanguage = (lang) => {
  elementLang.value = lang
}


</script>

<template>
  <div class="common-layout">
    <el-container>
      <el-header class="header">
        <span class="title">{{ t('common.welcome') }}</span>

        <span class="right_tool">
          <a href="#">
            <el-icon>
              <EditPen />
            </el-icon>{{ t('common.changePassword') }} &nbsp;&nbsp;&nbsp; &nbsp;
          </a>

          <a href="#">
            <el-icon>
              <SwitchButton />
            </el-icon>{{ t('common.logout') }}
          </a>
          <a href="#">
            <el-select v-model="currentLang" placeholder="{{ t('common.language') }}" size="small" @change="switchLanguage"
              style="vertical-align: middle; width: 80px; margin-left: 12px; height: 30px;">
              <el-option v-for="(label, key) in languages" :key="key" :label="label" :value="key" />
            </el-select>
          </a>

        </span>
      </el-header>


      <el-container>
        <el-aside width="200px" class="aside">
          <el-scrollbar>
            <el-menu :router="true">


              <el-menu-item index="/index">
                <el-icon>
                  <Promotion />
                </el-icon>{{ t('common.home') }}
              </el-menu-item>



              <el-sub-menu index="/manage">
                <template #title>
                  <el-icon>
                    <Menu />
                  </el-icon>{{ t('menu.manage.title') }}
                </template>


                <el-menu-item index="/clazz"><el-icon>
                    <HomeFilled />
                  </el-icon>{{ t('menu.manage.clazz') }}</el-menu-item>
                <el-menu-item index="/stu"><el-icon>
                    <UserFilled />
                  </el-icon>{{ t('menu.manage.stu') }}</el-menu-item>


              </el-sub-menu>

              <el-sub-menu index="/system">
                <template #title>
                  <el-icon>
                    <Tools />
                  </el-icon>{{ t('menu.system.title') }}
                </template>


                <el-menu-item index="/dept"><el-icon>
                    <HelpFilled />
                  </el-icon>{{ t('menu.system.dept') }}</el-menu-item>
                <el-menu-item index="/emp"><el-icon>
                    <Avatar />
                  </el-icon>{{ t('menu.system.emp') }}</el-menu-item>


              </el-sub-menu>

              <el-sub-menu index="/report">
                <template #title>
                  <el-icon>
                    <Histogram />
                  </el-icon>{{ t('menu.report.title') }}
                </template>


                <el-menu-item index="/empReport"><el-icon>
                    <InfoFilled />
                  </el-icon>{{ t('menu.report.empReport') }}</el-menu-item>
                <el-menu-item index="/stuReport"><el-icon>
                    <Share />
                  </el-icon>{{ t('menu.report.stuReport') }}</el-menu-item>
                <el-menu-item index="/log"><el-icon>
                    <Document />
                  </el-icon>{{ t('menu.report.log') }}</el-menu-item>

              </el-sub-menu>

            </el-menu>
          </el-scrollbar>
        </el-aside>
        <el-main router>
          <router-view></router-view>
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
  padding: 0;
  /* Element menu needs no padding */
  height: calc(100vh - 60px);
  /* Fit minus header height */
}

/* Main content */
.el-main {
  background: #fff;
  padding: 20px;
  overflow: auto;
}
</style>
