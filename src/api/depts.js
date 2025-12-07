import request from '@/utils/request'

export async function getAllDepts(){
    return request.get('/depts')
}
