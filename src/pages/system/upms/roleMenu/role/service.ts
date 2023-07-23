import { request } from '@umijs/max';

export async function queryListRole() {
  return request('/qz/api/upms/role');
}

export async function addRole(data: any) {
  return request('/qz/api/upms/role', {
    method: 'post',
    data: data,
  });
}

export async function editRole(data: any, id: string) {
  return request(`/qz/api/upms/role/${id}`, {
    method: 'put',
    data: data,
  });
}

export async function deleteRole(id: string) {
  return request(`/qz/api/upms/role/${id}`, {
    method: 'delete',
  });
}

export async function getRole(id: string) {
  return request(`/qz/api/upms/role/${id}`);
}

export async function deleteUserRole(id: string,userId: string) {
  return request(`/qz/api/upms/role/${id}/${userId}`, {
    method: 'delete',
  });
}

export async function addUserRole(id: string,userIds: any) {
  return request(`/qz/api/upms/role/${id}`, {
    method: 'post',
    data: userIds,
  });
}
