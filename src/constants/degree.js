export const getDegreeMap = (t) => ({
  1: t('charts.degrees.middleSchool'),
  2: t('charts.degrees.highSchool'),
  3: t('charts.degrees.college'),
  4: t('charts.degrees.bachelor'),
  5: t('charts.degrees.master'),
  6: t('charts.degrees.doctor')
})

export const getDegreeOptions = (t) => ([
  { value: 1, label: t('charts.degrees.middleSchool') },
  { value: 2, label: t('charts.degrees.highSchool') },
  { value: 3, label: t('charts.degrees.college') },
  { value: 4, label: t('charts.degrees.bachelor') },
  { value: 5, label: t('charts.degrees.master') },
  { value: 6, label: t('charts.degrees.doctor') }
])
