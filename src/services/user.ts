import { request } from '@umijs/max';

/** 获取当前的用户 GET /api/currentUser */
export async function currentUser(options?: { [key: string]: any }) {
  return request<{
    data: API.CurrentUser;
  }>('/qz/api/upms/user/current', {
    method: 'GET',
    ...(options || {}),
  });
}

export async function query() {
  return request<API.CurrentUser[]>('/api/users');
}

export async function queryCurrent() {
  return request<API.httpRule>('/qz/api/upms/user/current');
}

export async function queryMenuData() {
  return request<API.httpRule>('/qz/api/upms/menu/current');
}

export async function queryNotices(): Promise<any> {
  return request<{ data: API.NoticeIconData[] }>('/api/notices');
}
