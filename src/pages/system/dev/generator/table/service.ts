import { request } from '@umijs/max';

export async function getAllTable() {
  return request(`/qz/api/database/tables`, {
    method: 'GET',
  });
}
