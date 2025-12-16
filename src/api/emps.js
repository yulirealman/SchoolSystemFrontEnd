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
  const pageSize = 100; // 尽量大一点，但别太离谱
  let page = 1;
  let all = [];

  while (true) {
    const res = await queryPageApi(
      params.name,
      params.gender,
      params.begin,
      params.end,
      page,
      pageSize
    );

    if (res.code !== 1) break;

    const rows = res.data.rows;
    all = all.concat(rows);

    if (rows.length < pageSize) break; // 最后一页
    page++;
  }

  return all;
};
