import { request } from '@umijs/max';

export async function getCodeTemplateAll() {
  return request('/qz/api/generator/template');
}

export function putCodeTemplate(genre: string, data: string) {
  return request(`/qz/api/generator/template/${genre}`, {
    method: 'put',
    headers:{
      'Content-Type': 'text/plain;charset=UTF-8'
    },
    data: data,
  });
}
