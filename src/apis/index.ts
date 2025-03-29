import request from "@/utils/request";
import * as Types from './model'

export function Login(data:Types.LoginParams) {
  return request({
    url: "/login",
    method: "post",
    data
  })
}

export function Register(data: Types.RegisterParams) {
  return request({
    url: "/register",
    method: "post",
    data
  })
}