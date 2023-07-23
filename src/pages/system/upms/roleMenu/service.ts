import { request } from '@umijs/max';

export async function getRoleMenu(roleId: string) {
  return request(`/qz/api/upms/role/menu/${roleId}`);
}

export async function addRoleMenu(roleId: string, menuId: string) {
  return request('/qz/api/upms/role/menu', {
    method: 'post',
    params: {
      roleId: roleId,
      menuId: menuId,
    },
  });
}

export async function removeRoleMenu(roleId: string, menuId: string) {
  return request('/qz/api/upms/role/menu', {
    method: 'delete',
    params: {
      roleId: roleId,
      menuId: menuId,
    },
  });
}

export async function getRouteLink(targetId: string, targetType: string) {
  return request('/qz/api/upms/route/link', {
    params: {
      targetId: targetId,
      targetType: targetType,
    },
  });
}

export async function addRouteLink(routeId: string, targetId: string, targetType: string) {
  return request('/qz/api/upms/route/link', {
    method: 'post',
    params: {
      routeId: routeId,
      targetId: targetId,
      targetType: targetType,
    },
  });
}

export async function removeRouteLink(routeId: string, targetId: string, targetType: string) {
  return request('/qz/api/upms/route/link', {
    method: 'delete',
    params: {
      routeId: routeId,
      targetId: targetId,
      targetType: targetType,
    },
  });
}
