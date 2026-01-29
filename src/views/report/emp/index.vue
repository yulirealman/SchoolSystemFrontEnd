<!-- <script setup>
import * as echarts from 'echarts'
import { onMounted, ref, watch, onBeforeUnmount } from 'vue'
import { queryEmpJobDataApi, queryEmpGenderDataApi } from '@/api/reports'
import { getGenderMap } from '@/constants/gender'
import { useI18n } from 'vue-i18n'

/* ---------------- i18n ---------------- */
const { t, locale } = useI18n()

/* ---------------- refs ---------------- */
const empJobChartRef = ref(null)
const empGenderChartRef = ref(null)

/* ---------------- chart instances ---------------- */
let empJobChart = null
let empGenderChart = null

/* ---------------- data ---------------- */
const empJobData = ref({
  jobList: [],
  dataList: []
})

const empGenderData = ref([])

/* ---------------- render functions ---------------- */
const renderEmpJobChart = () => {
  if (!empJobChart) return

  empJobChart.setOption({
    title: {
      text: t('charts.empJob')
    },
    tooltip: {
      trigger: 'item'
    },
    xAxis: {
      data: empJobData.value.jobList
    },
    yAxis: {},
    series: [
      {
        type: 'bar',
        data: empJobData.value.dataList,
        barWidth: '50%'
      }
    ]
  })
}

const renderEmpGenderChart = () => {
  if (!empGenderChart) return

  const genderMap = getGenderMap(t)

  const pieData = empGenderData.value.map(item => ({
    name: genderMap[item.name] ?? item.name,
    value: item.value
  }))

  empGenderChart.setOption({
    title: {
      text: t('charts.empGender'),
      left: 'center'
    },
    tooltip: {
      trigger: 'item',
    //   formatter: `{b} : {c}${t('charts.people')} ({d}%)`
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        name: t('charts.empGender'),
        type: 'pie',
        radius: '60%',
        center: ['50%', '55%'],
        data: pieData,
        label: {
          formatter: '{b}\n{d}%'
        }
      }
    ]
  })
}

/* ---------------- lifecycle ---------------- */
onMounted(async () => {
  empJobChart = echarts.init(empJobChartRef.value)
  empGenderChart = echarts.init(empGenderChartRef.value)

  empJobData.value = await getEmpJobData()
  empGenderData.value = await getEmpGenderData()

  renderEmpJobChart()
  renderEmpGenderChart()

  window.addEventListener('resize', resizeCharts)
})

/* ---------------- watch language change ---------------- */
watch(locale, () => {
  renderEmpJobChart()
  renderEmpGenderChart()
})

/* ---------------- resize ---------------- */
const resizeCharts = () => {
  empJobChart?.resize()
  empGenderChart?.resize()
}

onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeCharts)
  empJobChart?.dispose()
  empGenderChart?.dispose()
})

/* ---------------- api ---------------- */
const getEmpJobData = async () => {
  const result = await queryEmpJobDataApi()
  if (result.code === 1) {
    return {
      jobList: result.data.jobList,
      dataList: result.data.dataList
    }
  }
  return { jobList: [], dataList: [] }
}

const getEmpGenderData = async () => {
  const result = await queryEmpGenderDataApi()
  if (result.code === 1) {
    return result.data.map(item => ({
      name: item.name,
      value: item.value
    }))
  }
  return []
}
</script>

<template>
  <div class="charts-wrapper">
    <div ref="empJobChartRef" class="chart"></div>
    <div ref="empGenderChartRef" class="chart"></div>
  </div>
</template>

<style scoped>
.charts-wrapper {
  display: flex;
  width: 100%;
  height: 100%;
}

.chart {
  flex: 1;
  height: 100%;
}
</style> -->


<script setup>
import * as echarts from 'echarts'
import { onMounted, ref, watch, onBeforeUnmount } from 'vue'
import { queryEmpJobDataApi, queryEmpGenderDataApi } from '@/api/reports'
import { getGenderMap } from '@/constants/gender'
import { useI18n } from 'vue-i18n'

/* ---------------- i18n ---------------- */
const { t, locale } = useI18n()

/* ---------------- refs ---------------- */
const empJobChartRef = ref(null)
const empGenderChartRef = ref(null)

/* ---------------- chart instances ---------------- */
let empJobChart = null
let empGenderChart = null

/* ---------------- data ---------------- */
const empJobData = ref({
  jobList: [],
  dataList: []
})

const empGenderData = ref([])

/* ---------------- render functions ---------------- */
const renderEmpJobChart = () => {
  if (!empJobChart) return

  empJobChart.setOption({
    title: { text: t('charts.empJob') },
    tooltip: { trigger: 'item' },
    xAxis: { data: empJobData.value.jobList },
    yAxis: {},
    series: [
      { type: 'bar', data: empJobData.value.dataList, barWidth: '50%' }
    ]
  })
}

const renderEmpGenderChart = () => {
  if (!empGenderChart) return

  const genderMap = getGenderMap(t)

  // 仿照你第二页 degree chart 的做法
  const pieData = empGenderData.value.map(item => ({
    name: genderMap[item.name] ?? item.name,
    value: item.value
  }))

  empGenderChart.setOption({
    title: { text: t('charts.empGender'), left: 'center' },
    tooltip: { trigger: 'item', formatter: `{b} : {c}${t('charts.people')} ({d}%)` },
    legend: { orient: 'vertical', left: 'left' },
    series: [
      {
        name: t('charts.empGender'),
        type: 'pie',
        radius: '60%',
        center: ['50%', '55%'],
        data: pieData,
        label: { formatter: '{b}\n{d}%' }
      }
    ]
  })
}

/* ---------------- lifecycle ---------------- */
onMounted(async () => {
  empJobChart = echarts.init(empJobChartRef.value)
  empGenderChart = echarts.init(empGenderChartRef.value)

  empJobData.value = await getEmpJobData()
  empGenderData.value = await getEmpGenderData()

  renderEmpJobChart()
  renderEmpGenderChart()

  window.addEventListener('resize', resizeCharts)
})

/* ---------------- watch language change ---------------- */
watch(locale, () => {
  renderEmpJobChart()
  renderEmpGenderChart()
})

/* ---------------- resize ---------------- */
const resizeCharts = () => {
  empJobChart?.resize()
  empGenderChart?.resize()
}

onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeCharts)
  empJobChart?.dispose()
  empGenderChart?.dispose()
})

/* ---------------- api ---------------- */
const getEmpJobData = async () => {
  const result = await queryEmpJobDataApi()
  if (result.code === 1) return { jobList: result.data.jobList, dataList: result.data.dataList }
  return { jobList: [], dataList: [] }
}

const getEmpGenderData = async () => {
  const result = await queryEmpGenderDataApi()
  if (result.code === 1) return result.data.map(item => ({ name: item.name, value: item.value }))
  return []
}
</script>

<template>
  <div class="charts-wrapper">
    <div ref="empJobChartRef" class="chart"></div>
    <div ref="empGenderChartRef" class="chart"></div>
  </div>
</template>

<style scoped>
.charts-wrapper { display: flex; width: 100%; height: 100%; }
.chart { flex: 1; height: 100%; }
</style>
