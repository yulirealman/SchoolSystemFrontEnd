import Mock from "mockjs";


Mock.mock("/depts", "get", (options) => {
  return {"code":1,"msg":"success","data":[{"id":2,"name":"教研部","createTime":"2023-09-25T09:47:40","updateTime":"2024-08-09T15:17:04"},{"id":3,"name":"咨询部","createTime":"2023-09-25T09:47:40","updateTime":"2024-07-30T21:26:24"},{"id":6,"name":"行政部","createTime":"2023-11-30T20:56:37","updateTime":"2024-07-30T20:56:37"},{"id":1,"name":"学工部","createTime":"2023-09-25T09:47:40","updateTime":"2024-07-25T09:47:40"},{"id":4,"name":"就业部","createTime":"2023-09-25T09:47:40","updateTime":"2024-07-25T09:47:40"},{"id":5,"name":"人事部","createTime":"2023-09-25T09:47:40","updateTime":"2024-07-25T09:47:40"}]};
});


