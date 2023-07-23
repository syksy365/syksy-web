import { request } from '@umijs/max';

export async function list(params?: any) {
  return request('/qz/api/generator/configuration/list', {
    params,
  });
}

export async function getConfig() {
  return request('/qz/api/generator/configuration');
}

export async function putConfig(data: any) {
  return request(`/qz/api/generator/configuration`, {
    method: 'PUT',
    data: data,
  });
}

export function getFormValue(tn: string, config: any) {
  const formValue = {
    controllerName: '',
    serviceName: '',
    domainName: '',
    mapperName: '',
    tableName: tn,
  };
  let t = tn.replace(config.tablePrefix, '');
  const tableNameArray = t.split('');
  if (tableNameArray[0] != '_') {
    tableNameArray[0] = tableNameArray[0].toUpperCase();
  }
  for (let i = 0; i < tableNameArray.length; i++) {
    if (tableNameArray[i] == '_') {
      tableNameArray[i + 1] = tableNameArray[i + 1].toUpperCase();
    }
    t = tableNameArray.join('');
  }
  const fileName = t.replace(/_/g, '');

  if (config.fileType.indexOf('controller') != -1) {
    formValue.controllerName = fileName + 'Controller';
  }
  if (config.fileType.indexOf('service') != -1) {
    formValue.serviceName = fileName + 'Service';
  }
  if (config.fileType.indexOf('domain') != -1) {
    formValue.domainName = fileName + 'DO';
  }
  if (config.fileType.indexOf('mapper') != -1) {
    formValue.mapperName = fileName + 'Mapper';
  }
  return formValue;
}
