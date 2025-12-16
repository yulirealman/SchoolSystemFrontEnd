import request from '@/utils/request'

export const queryPageApi = (name,gender,begin,end,page,pageSize)=> {
   return request.get(`/emps?name=${name}&gender=${gender}&begin=${begin}&end=${end}&page=${page}&pageSize=${pageSize}`)
}

export const addEmpApi = (emp) => {
    return request.post('/emps',emp)
}

export const updateEmpApi = (emp) => {
    return request.put('/emps',emp)
}

export const getEmpByIdApi = (id) => {
    return request.get(`/emps/${id}`)
}

export const deleteEmpByIdApi = (ids) => {
    return request.delete(`/emps?ids=${ids}`)
}

export const queryAllEmps = async (params) => {
  const pageSize = 100
  let page = 1
  let all = []
  let total = 0

  while (true) {
    const res = await queryPageApi(
      params.name,
      params.gender,
      params.begin,
      params.end,
      page,
      pageSize
    )

    if (res.code !== 1) {
      return {
        code: res.code,
        msg: res.msg || 'error',
        data: {
          total: 0,
          rows: []
        }
      }
    }

    const { rows, total: pageTotal } = res.data

    if (page === 1) {
      total = pageTotal // 只在第一页取 total
    }

    all.push(...rows)

    if (rows.length < pageSize) break
    page++
  }

  return {
    code: 1,
    msg: 'success',
    data: {
      total,
      rows: all
    }
  }
}
