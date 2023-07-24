import { request } from '@umijs/max';

export interface LoginParamsType {
  username: string;
  password: string;
  mobile: string;
  captcha: string;
  type: string;
}

export async function fakeAccountLogin(params: LoginParamsType) {
  return request<API.LoginStateType>('/qz/api/login/account', {
    method: 'POST',
    data: params,
  });
}

export async function getFakeCaptcha(mobile: string) {
  return request(`/api/login/captcha?mobile=${mobile}`);
}

export async function outLogin() {
  return request('/qz/api/login/out-login');
}

/**
 * 登录验证码开启状态和有效时长查询
 * @returns 
 */
export async function captchaStatus() {
  return request('/qz/api/captcha/status');
}