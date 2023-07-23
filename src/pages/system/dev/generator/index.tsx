import React, { useState, useEffect } from 'react';
import { ProCard } from '@ant-design/pro-components';
import { PageContainer } from '@ant-design/pro-components';
import { Button, Drawer } from 'antd';
import Code from './code';
import Form from './form';
import Table from './table';
import Config from './config';
import { getConfig, getFormValue } from './config/service';

export default () => {
  const [formValue, setFormValue] = useState<any>();
  const [typeCheck, setTypeCheck] = useState<string[]>([]);
  const [visible, setVisible] = useState(false);
  const [config, setConfig] = useState<any>();
  const [sourceCode, setSourceCode] = useState<any[]>();

  const loadConfig = async () => {
    const r = await getConfig();
    if (r.data.fileType) {
      setTypeCheck(r.data.fileType);
    }
    setConfig(r.data);
  };

  useEffect(() => {
    loadConfig();
  }, []);



  const onConfig = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  /**
   * 配置更新后触发
   */
  const updateConfigCallBack = () => {
    loadConfig();
    setVisible(false);
  };

  /**
   * 选择数据库表触发
   * @param record
   */
  const onSelectTable = (record: any) => {
    setFormValue(getFormValue(record.tableName, config));
  };

  /**
   * 预览代码触发
   * @param data
   */
  const onPreview = (data: any[]) => {
    setSourceCode(data);
  };

  return (
    <PageContainer>
      <ProCard split="vertical">
        <ProCard
          title="数据库表"
          extra={
            <Button key="primary" type="primary" size="small">
              刷新
            </Button>
          }
          bordered
          headerBordered
          colSpan={{
            xs: '50px',
            sm: '100px',
            md: '200px',
            lg: '250px',
            xl: '300px',
          }}
        >
          <Table onSelect={onSelectTable} />
        </ProCard>
        <ProCard
          title="代码"
          extra={
            <Button key="primary" type="primary" size="small" onClick={() => onConfig()}>
              设置
            </Button>
          }
          bordered
          headerBordered
          direction="column"
          gutter={[0, 16]}
        >
          <ProCard type="inner" bordered>
            <Form value={formValue} typeCheck={typeCheck} onPreview={onPreview} />
          </ProCard>
          <ProCard type="inner" bordered>
            <Code typeCheck={typeCheck} sourceCode={sourceCode} />
          </ProCard>
        </ProCard>
        <Drawer
          width={520}
          placement="right"
          destroyOnClose={true}
          closable={false}
          onClose={onClose}
          visible={visible}
        >
          <Config updateCallBack={updateConfigCallBack} />
        </Drawer>
      </ProCard>
    </PageContainer>
  );
};
