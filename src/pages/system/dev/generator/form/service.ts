import { request } from '@umijs/max';

export async function putPostCode(data: any) {
  return request(`/qz/api/generator/code`, {
    method: 'PUT',
    data: data,
  });
}

export async function postPostPreview(data: any) {
  return request(`/qz/api/generator/code/preview`, {
    method: 'POST',
    data: data,
  });
}
