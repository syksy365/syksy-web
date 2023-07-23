import { request } from '@umijs/max';

export async function page(params?: any) {
  return request('/qz/api/setting/dic/page', {
    params,
  });
}

export async function list(params?: any) {
  return request('/qz/api/setting/dic', {
    params,
  });
}


export async function getDic(id: string) {
  return request(`/qz/api/setting/dic/${id}`);
}

export async function addDic(data: any) {
  return request('/qz/api/setting/dic', {
    method: 'post',
    data,
  });
}

export async function updateDic(id: string, data: any) {
  return request(`/qz/api/setting/dic/${id}`, {
    method: 'put',
    data,
  });
}

export async function deleteDic(id: string) {
  return request(`/qz/api/setting/dic/${id}`, {
    method: 'delete',
  });
}
