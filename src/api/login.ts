import request from "@/utils/request";

// 登录接口
export const loginApi = (username: string, password: string) => {
  return request.post("/user/login", { username, password });
};

// 注册接口
export const registerApi = (
  username: string,
  email: string,
  password: string,
  verifyCode: string
) => {
  return request.post("/user/register", {
    username,
    email,
    password,
    verifyCode,
  });
};

// 获取验证码接口
export const sendVerifyCodeApi = (email: string) => {
  return request.post("/user/verifyCode", { email });
};
