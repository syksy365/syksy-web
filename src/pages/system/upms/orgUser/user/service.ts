import { request } from '@umijs/max';
import type { TableListParams } from './data';

export async function queryUser(params?: TableListParams) {
  return request('/qz/api/upms/user/list', {
    params,
  });
}

export async function getUser(id: string) {
  return request(`/qz/api/upms/user/${id}`);
}

export async function addUser(data: any) {
  return request('/qz/api/upms/user', {
    method: 'post',
    data: data,
  });
}

export async function updateUser(data: any, id: string) {
  return request(`/qz/api/upms/user/${id}`, {
    method: 'put',
    data: data,
  });
}

export async function removeUser(id: string) {
  return request(`/qz/api/upms/user/${id}`, {
    method: 'delete',
  });
}

export async function resetPassword(id: string) {
  return request(`/qz/api/upms/user/password/${id}`, {
    method: 'put',
  });
}
