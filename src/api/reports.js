import request from '@/utils/request'
export const queryLogApi = (page, pageSize) => {
  return request.get('/log/page', {
    params: { page, pageSize }
  })
}

export const queryStudentCountApi = () => {
  return request.get('/report/studentCountData')
}

export const queryStudentDegreeDataApi = () => {
  return request.get('/report/studentDegreeData')
}

export const queryEmpJobDataApi = () => {
  return request.get('/report/empJobData')
}

export const queryEmpGenderDataApi = () => {
  return request.get('/report/empGenderData')
}