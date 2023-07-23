import { request } from '@umijs/max';

export async function queryRoute(params?: any) {
  return request('/qz/api/upms/route/list', {
    params,
  });
}

export async function overloadRoute() {
  return request('/qz/api/upms/route/overload', { method: 'post' });
}

export async function getRoute(id: string) {
  return request(`/qz/api/upms/route/${id}`);
}

export async function editRoute(data: any, id: string) {
  return request(`/qz/api/upms/route/${id}`, {
    method: 'put',
    data: data,
  });
}
