import { request } from '@umijs/max';

export async function page(params?: any) {
  return request('/qz/api/setting/dic/item/list/page', {
    params,
  });
}

export async function get(id: string) {
  return request(`/qz/api/setting/dic/item/list/${id}`);
}

export async function add(data: any) {
  return request('/qz/api/setting/dic/item/list', {
    method: 'post',
    data: data,
  });
}

export async function update(id: string,data: any) {
  return request(`/qz/api/setting/dic/item/list/${id}`, {
    method: 'put',
    data: data,
  });
}

export async function remove(id: string) {
  return request(`/qz/api/setting/dic/item/list/${id}`, {
    method: 'delete',
  });
}
