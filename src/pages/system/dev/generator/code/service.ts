import { request } from '@umijs/max';

export async function putPostCode(data: any) {
  return request(`/qz/api/generator/code`, {
    method: 'PUT',
    data: data,
  });
}
