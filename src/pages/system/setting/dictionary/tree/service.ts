import { request } from '@umijs/max';

export async function list(params?: any) {
  return request('/qz/api/setting/dic/item/tree', {
    params,
  });
}

export async function expand(id: string, ex: boolean) {
  return request(`/qz/api/setting/dic/item/tree/expand/${id}`, {
    method: 'put',
    params: { expand:ex },
  });
}

export async function add(data: any) {
  return request('/qz/api/setting/dic/item/tree', {
    method: 'post',
    data: data,
  });
}

export async function update(id: string, data: any) {
  return request(`/qz/api/setting/dic/item/tree/${id}`, {
    method: 'put',
    data: data,
  });
}

export async function remove(id: string) {
  return request(`/qz/api/setting/dic/item/tree/${id}`, {
    method: 'delete',
  });
}

export async function get(id: string) {
  return request(`/qz/api/setting/dic/item/tree/${id}`);
}

export async function getLevel(id: string, dicId: string) {
  return request(`/qz/api/setting/dic/item/tree/level/${id}`, {
    params: { dicId }
  });
}


