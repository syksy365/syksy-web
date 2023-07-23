import { request } from '@umijs/max';

export async function getOrganizationByParentId(id?: string) {
  return request(`/qz/api/upms/org/parent/${id}`, {
    method: 'GET',
  });
}

export async function getList() {
  return request('/qz/api/upms/org/list', {
    method: 'GET',
  });
}

export async function expandOrg(id: string, expand: boolean) {
  return request(`/qz/api/upms/org/expand/${id}`, {
    method: 'put',
    params: { expand: expand },
  });
}

export async function addOrg(name: string, parentId: string) {
  return request(`/qz/api/upms/org`, {
    method: 'POST',
    data: {
      name: name,
      parentId: parentId,
    },
  });
}

export async function deleteOrg(id: string) {
  return request(`/qz/api/upms/org/${id}`, {
    method: 'DELETE',
  });
}

export async function editOrg(id: string, name: string) {
  return request(`/qz/api/upms/org/${id}`, {
    method: 'put',
    params: {
      name: name,
    },
  });
}

export function dataConversion(data: any, treeData: any[], initExpandedKeys: string[]) {
  for (const r of data) {
    const treeNode: any = {};
    treeNode.value = r.name;
    treeNode.defaultValue = r.name;
    treeNode.key = r.id;
    treeNode.expand = r.expand;
    treeNode.parentKey = r.parentId;
    treeNode.isEditable = false;
    treeNode.menuVisible = false;
    treeNode.buttonStyle = {
      visibility: 'hidden',
      position: 'absolute',
      right: 0,
    };
    if (r.expand) {
      initExpandedKeys.push(r.id);
    }
    if (r.children) {
      treeNode.children = new Array<any>();
      dataConversion(r.children, treeNode.children, initExpandedKeys);
    }
    treeData.push(treeNode);
  }
}

export async function getLevel(id: string) {
  return request(`/qz/api/upms/org/level/${id}`);
}