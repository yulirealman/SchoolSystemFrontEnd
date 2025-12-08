import request from '@/utils/request'

export async function queryAllApi(){
    return request.get('/depts')
}


export async function addApi(dept){
    return request.post('/depts',dept)
} 