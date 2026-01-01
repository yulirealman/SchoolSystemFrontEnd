import request from '@/utils/request'
export const queryClazzPageApi = (name,begin,end,page,pageSize)=> {
   return request.get(`/clazzs?name=${name}&begin=${begin}&end=${end}&page=${page}&pageSize=${pageSize}`)
}


export const addClazzApi = (clazz) => {
    return request.post('/clazzs',clazz)
}

export const updateClazzApi = (clazz) => {
    return request.put('/clazzs',clazz)
}

export const getClazzByIdApi = (id) => {
    return request.get(`/clazzs/${id}`)
}

export const deleteClazzByIdApi = (ids) => {
    return request.delete(`/clazzs/${ids}`)
}

