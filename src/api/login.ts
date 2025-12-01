import request from "@/utils/request";

// ==================== 响应 DTO ====================
// 登录响应（返回 token 字符串）
type LoginResponse = string;

// 注册响应（成功时返回 null 或空对象）
type RegisterResponse = null;

// 验证码响应（成功时无返回）
type VerifyCodeResponse = void;

// ==================== 请求 DTO ====================
// 登录请求体
interface LoginRequest {
  username: string;
  password: string;
}

// 注册请求体
interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  verifyCode: string;
}

// 发送验证码请求体
interface SendVerifyCodeRequest {
  email: string;
}

// ==================== API 接口 ====================
// 登录接口
export const loginApi = (
  username: string,
  password: string
): Promise<LoginResponse> => {
  return request.post<LoginResponse, LoginRequest>("/user/login", {
    username,
    password,
  });
};

// 注册接口
export const registerApi = (
  username: string,
  email: string,
  password: string,
  verifyCode: string
): Promise<RegisterResponse> => {
  return request.post<RegisterResponse, RegisterRequest>("/user/register", {
    username,
    email,
    password,
    verifyCode,
  });
};

// 获取验证码接口
export const sendVerifyCodeApi = (
  email: string
): Promise<VerifyCodeResponse> => {
  return request.post<VerifyCodeResponse, SendVerifyCodeRequest>(
    "/user/verifyCode",
    { email }
  );
};
