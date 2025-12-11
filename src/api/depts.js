import request from '@/utils/request'

export const queryDeptListApi = () => {
    return request.get('/depts')
}


export const addApi = (dept) => {
    return request.post('/depts',dept)
} 


export const queryByIdApi = (id) => {
    return request.get(`/depts/${id}`)
}

export const updateApi = (dept) => {
    return request.put('/depts',dept)
}

export const deleteByIdApi = (id) => {
    return request.delete(`/depts?id=${id}`)
}