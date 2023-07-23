import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'antd';
import { ProForm, ProFormText, ProFormSwitch, ProFormRadio, ProFormCheckbox } from '@ant-design/pro-components';
import type { ProFormInstance } from '@ant-design/pro-components';
import Common from './common';
import { getConfig, putConfig } from './service';

export default (param: any) => {
  const formRef = useRef<ProFormInstance>();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const loadConfig = async () => {
    const r = await getConfig();
    formRef?.current?.setFieldsValue(r.data);
  };
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  useEffect(() => {
    loadConfig();
  }, [loadConfig]);


  /**
   * 更新配置
   */
  const updateConfig = async () => {
    formRef?.current?.validateFields().then(async () => {
      const data = formRef?.current?.getFieldsValue();
      await putConfig(data);
      param.updateCallBack();
    });
  };

  const saveCallBack = async (selectedRow: any) => {
    selectedRow.fileType = selectedRow.fileType.split(',');
    formRef?.current?.setFieldsValue(selectedRow);
  };

  return (
    <>
      <ProForm
        formRef={formRef}
        submitter={{
          render: () => {
            return (
              <>
                <Button style={{ marginRight: '8px' }} onClick={() => handleModalVisible(true)}>
                  选择公开配置
                </Button>
                <Button type="primary" onClick={() => updateConfig()}>
                  更新
                </Button>
              </>
            );
          },
        }}
      >
        <ProFormSwitch name="open" label="公开配置" />

        <ProFormText width="sm" name="author" label="作者" rules={[{ required: true }]} />
        <ProFormText
          width="sm"
          name="moduleName"
          label="聚合模块"
          tooltip="如果项目是采用Maven聚合模式，则输入子模块名称，否则无需填写"
        />

        <ProFormText
          width="sm"
          name="groupId"
          label="组ID"
          rules={[{ required: true }]}
          tooltip="Maven项目src/main/java下的自定义路径，一般为Maven的Group ID"
        />
        <ProFormText
          width="sm"
          name="groupPackage"
          label="组下包"
          tooltip="组ID下需要分多个文件夹（包），则输入当前组下包名称，否则无需填写"
        />

        <ProFormText width="sm" name="tablePrefix" label="表前缀" tooltip="生成文件名去除表前缀" />
        <ProFormRadio.Group
          rules={[{ required: true }]}
          width="sm"
          name="dateType"
          label="时间类型"
          tooltip="TIME_PACK：java.time；ONLY_DATE：java.util.date；SQL_PACK：java.sql；"
          options={['TIME_PACK', 'ONLY_DATE', 'SQL_PACK']}
          fieldProps={{
            defaultValue: 'TIME_PACK',
          }}
        />

        <ProFormRadio.Group
          rules={[{ required: true }]}
          name="idType"
          label="主键类型"
          tooltip="ASSIGN_ID：雪花算法；ASSIGN_ID：UUID；以上两种只有当插入对象ID 为空，才自动填充；AUTO： 数据库ID自增；INPUT：用户输入ID；NONE：该类型为未设置主键类型(注解里等于跟随全局,全局里约等于 INPUT)"
          options={['ASSIGN_ID', 'ASSIGN_UUID', 'AUTO', 'NONE', 'INPUT']}
          fieldProps={{
            defaultValue: 'ASSIGN_ID',
          }}
        />
        <ProFormCheckbox.Group
          rules={[{ required: true }]}
          name="fileType"
          label="生成文件"
          tooltip="选择生成文件类型"
          options={['controller', 'domain', 'service', 'mapper', 'xml']}
        />
      </ProForm>
      <Common
        onVisibleChange={(visible: boolean) => handleModalVisible(visible)}
        modalVisible={createModalVisible}
        saveCallBack={saveCallBack}
      />
    </>
  );
};
