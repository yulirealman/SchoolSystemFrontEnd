import request from '@/utils/request'
//import { queryClazzPageApi, addClzzApi, updateClzzApi, getClzzByIdApi, deleteClzzByIdApi } from '@/api/clazzs';
export const queryClazzPageApi = (name,begin,end,page,pageSize)=> {
   return request.get(`/clazzs?name=${name}&begin=${begin}&end=${end}&page=${page}&pageSize=${pageSize}`)
}


export const addClzzApi = (clazz) => {
    return request.post('/clazzs',clazz)
}

export const updateClzzApi = (clazz) => {
    return request.put('/clazzs',clazz)
}

export const getClzzByIdApi = (id) => {
    return request.get(`/clazzs/${id}`)
}

export const deleteClzzByIdApi = (ids) => {
    return request.delete(`/clazzs/${ids}`)
}

