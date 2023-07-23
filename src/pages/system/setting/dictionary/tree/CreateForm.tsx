import React, { useEffect, useRef } from 'react';
import { ModalForm, ProFormText, ProFormTextArea, ProFormSelect } from '@ant-design/pro-components';
import type { ProFormInstance } from '@ant-design/pro-components';

import { Cascader, Form } from 'antd';
import { add, update } from './service';
import { list } from '../service';

interface CreateFormProps {
  formConfig: any;
  modalVisible: boolean;
  onVisibleChange: (visible: boolean) => void;
  saveCallBack: () => void;
}

const CreateForm: React.FC<CreateFormProps> = (props) => {
  const formRef = useRef<ProFormInstance>();


  useEffect(() => {
    if (!props.modalVisible) {
      return;
    }
    if (props.formConfig.isNew) {
      formRef?.current?.resetFields();
    }
    if (props.formConfig.initialValues) {
      formRef?.current?.setFieldsValue(props.formConfig.initialValues);
    }
  }, [props.formConfig.initialValues, props.formConfig.isNew, props.modalVisible]);

  const { modalVisible, onVisibleChange, saveCallBack } = props;

  const listDic = async (params: any) => {
    params.genre = 'tree';
    const res = await list(params);
    const dicArray = new Array();
    for (const dic of res.data) {
      dicArray.push({ label: dic.name, value: dic.id });
    }
    return dicArray;
  }

  const onFinish = async (data: any) => {
    if (props.formConfig.isNew) {
      await add(data);
    } else {
      await update(props.formConfig.initialValues.id, data);
    }
    saveCallBack();
    return true;
  };

  return (
    <ModalForm
      title={props.formConfig.title}
      width="380px"
      formRef={formRef}
      modalProps={{
        maskClosable: false,
      }}
      visible={modalVisible}
      onVisibleChange={(visible: boolean) => onVisibleChange(visible)}
      onFinish={async (value: any) => onFinish(value)}
    >
      <Form.Item
        name="levelIds"
        label="上级"
      >
        <Cascader
          fieldNames={{ label: 'name', value: 'id', children: 'children' }}
          options={props.formConfig.treeData}
          changeOnSelect
          getPopupContainer={(trigger: any) => trigger.parentElement}
        />
      </Form.Item>
      <ProFormSelect
        width="md"
        name="dicId"
        label="类目"
        hasFeedback
        request={(params) => listDic({ params })}
        rules={[{ required: true, message: '请选择类目!', type: 'string' }]}
        fieldProps={{
          showSearch: true,
          optionFilterProp: 'label',
          getPopupContainer: (trigger: any) => trigger.parentElement,
        }}
      />
      <ProFormText
        name="name"
        label="名称"
        tooltip="最长为 20 位"
        rules={[{ required: true, message: '请输入名称!' }]}
      />
      <ProFormText
        name="code"
        label="编码"
        tooltip="最长为 20 位"
        rules={[{ required: true, message: '请输入编码!' }]}
      />
      <ProFormTextArea name="customize" label="自定义" />
    </ModalForm>
  );
};

export default CreateForm;
