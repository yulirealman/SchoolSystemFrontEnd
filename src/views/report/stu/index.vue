<script setup>
import * as echarts from 'echarts'
import { onMounted, ref, watch, onBeforeUnmount } from 'vue'
import { queryStudentDegreeDataApi, queryStudentCountApi } from '@/api/reports'
import { getDegreeMap } from '@/constants/degree'
import { useI18n } from 'vue-i18n'

/* ---------------- i18n ---------------- */
const { t, locale } = useI18n()

/* ---------------- refs ---------------- */
const clazzChartRef = ref(null)
const studentChartRef = ref(null)

/* ---------------- chart instances ---------------- */
let clazzChart = null
let studentChart = null

/* ---------------- data ---------------- */
const clazzData = ref({
  clazzList: [],
  dataList: []
})

const studentData = ref([])

/* ---------------- render functions ---------------- */
const renderClazzChart = () => {
  if (!clazzChart) return

  clazzChart.setOption({
    title: {
      text: t('charts.classCount')
    },
    tooltip: {
      trigger: 'item'
    },
    xAxis: {
      data: clazzData.value.clazzList
    },
    yAxis: {},
    series: [
      {
        type: 'bar',
        data: clazzData.value.dataList,
        barWidth: '50%'
      }
    ]
  })
}

const renderStudentChart = () => {
  if (!studentChart) return

  const degreeMap = getDegreeMap(t)

  const pieData = studentData.value.map(item => ({
    name: degreeMap[item.name] ?? item.name,
    value: item.value
  }))

  studentChart.setOption({
    title: {
      text: t('charts.studentDegree'),
      left: 'center'
    },
    tooltip: {
      trigger: 'item',
      formatter: `{b} : {c}${t('charts.people')} ({d}%)`
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        name: t('charts.degree'),
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
  clazzChart = echarts.init(clazzChartRef.value)
  studentChart = echarts.init(studentChartRef.value)

  clazzData.value = await getClazzData()
  studentData.value = await getStudentDegreeData()

  renderClazzChart()
  renderStudentChart()

  window.addEventListener('resize', resizeCharts)
})

/* ---------------- watch language change ---------------- */
watch(locale, () => {
  renderClazzChart()
  renderStudentChart()
})

/* ---------------- resize ---------------- */
const resizeCharts = () => {
  clazzChart?.resize()
  studentChart?.resize()
}

onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeCharts)
  clazzChart?.dispose()
  studentChart?.dispose()
})

/* ---------------- api ---------------- */
const getClazzData = async () => {
  const result = await queryStudentCountApi()
  if (result.code === 1) {
    return {
      clazzList: result.data.clazzList,
      dataList: result.data.dataList
    }
  }
  return { clazzList: [], dataList: [] }
}

const getStudentDegreeData = async () => {
  const result = await queryStudentDegreeDataApi()
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
    <div ref="clazzChartRef" class="chart"></div>
    <div ref="studentChartRef" class="chart"></div>
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
</style>
