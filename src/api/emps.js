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

