import { request } from '@umijs/max';

export async function queryListMenu() {
  return request('/qz/api/upms/menu');
}

export async function getDirectory(disabledId?: string) {
  return request('/qz/api/upms/menu/directory',{
    params:{disabledId}
  });
}

export async function expandMenu(id: string, expand: boolean) {
  return request(`/qz/api/upms/menu/expand/${id}`, {
    method: 'put',
    params: { expand: expand },
  });
}

export async function addMenu(data: any) {
  return request(`/qz/api/upms/menu`, {
    method: 'post',
    data: data,
  });
}

export async function editMenu(data: any, id: string) {
  return request(`/qz/api/upms/menu/${id}`, {
    method: 'put',
    data: data,
  });
}

export async function deleteMenu(id: string) {
  return request(`/qz/api/upms/menu/${id}`, {
    method: 'delete',
  });
}

export async function getMenu(id: string) {
  return request(`/qz/api/upms/menu/${id}`);
}

export async function getMenuRelation(id: string) {
  return request(`/qz/api/upms/relation/menu/${id}`);
}

export async function queryListRole() {
  return request('/qz/api/upms/role');
}

export async function getLevel(id: string) {
  return request(`/qz/api/upms/menu/level/${id}`);
}

export async function move(id: string,direction: string) {
  return request(`/qz/api/upms/menu/position/${id}`, {
    method: 'put',
    params: {direction},
  });
}
