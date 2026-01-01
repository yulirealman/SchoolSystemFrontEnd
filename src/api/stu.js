import request from '@/utils/request'   
export const queryStuPageApi = (name,degree,clazzId,page,pageSize)=> {
   return request.get(`/students?name=${name}&degree=${degree}&clazzId=${clazzId}&page=${page}&pageSize=${pageSize}`)
}

export const addStuApi = (stu) => {
    return request.post('/students',stu)
}

export const getStuByIdApi = (id) => {
    return request.get(`/students/${id}`)
}

export const updateStuApi = (stu) => {
    return request.put('/students',stu)
}