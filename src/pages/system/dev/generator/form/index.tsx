import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'antd';
import { QueryFilter, ProFormText } from '@ant-design/pro-components';
import type { ProFormInstance } from '@ant-design/pro-components';
import { postPostPreview } from './service';

export default (param: any) => {
  const formRef = useRef<ProFormInstance>();
  const [loadingPreview, setLoadingPreview] = useState<boolean>(false);
  const [loadingDirectGeneration] = useState<boolean>(false);

  useEffect(() => {
    formRef?.current?.setFieldsValue(param.value);
  }, [param.value]);

  /**
   * 直接生成
   */
  const directGeneration = () => { };

  /**
   * 预览
   */
  const preview = () => {
    formRef?.current?.validateFields().then(async (values: any) => {
      setLoadingPreview(true);
      const r = await postPostPreview(values);
      param.onPreview(r.data);
      setLoadingPreview(false);
    });
  };
  return (
    <QueryFilter
      formRef={formRef}
      onFinish={async () => { }}
      submitter={{
        render: () => [
          <Button key="pv" type="primary" loading={loadingPreview} onClick={preview}>
            预览
          </Button>,
          <Button
            key="dg"
            type="dashed"
            loading={loadingDirectGeneration}
            onClick={directGeneration}
          >
            直接生成
          </Button>,
        ],
      }}
      defaultCollapsed={false}
    >
      <ProFormText name="tableName" label="表名" hidden={true} rules={[{ required: true }]} />
      {param.typeCheck.indexOf('controller') != -1 && (
        <ProFormText name="controllerName" label="controller" rules={[{ required: true }]} />
      )}
      {param.typeCheck.indexOf('service') != -1 && (
        <ProFormText name="serviceName" label="service" rules={[{ required: true }]} />
      )}
      {param.typeCheck.indexOf('domain') != -1 && (
        <ProFormText name="domainName" label="domain" rules={[{ required: true }]} />
      )}
      {(param.typeCheck.indexOf('mapper') != -1 || param.typeCheck.indexOf('xml') != -1) && (
        <ProFormText name="mapperName" label="mapper" rules={[{ required: true }]} />
      )}
    </QueryFilter>
  );
};
