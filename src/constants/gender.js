export const getGenderMap = (t) => ({
  1: t('charts.gender.male'),
  2: t('charts.gender.female')
})

export const getGenderOptions = (t) => ([
  { value: 1, label: t('charts.gender.male') },
  { value: 2, label: t('charts.gender.female') }
])
