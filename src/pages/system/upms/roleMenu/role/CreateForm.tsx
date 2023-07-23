import React, { useEffect, useRef } from 'react';
import { ModalForm, ProFormText, ProFormTextArea } from '@ant-design/pro-components';
import type { ProFormInstance } from '@ant-design/pro-components';

import { addRole, editRole } from './service';

interface CreateFormProps {
  title: string;
  initialValues?: any;
  type: string;
  modalVisible: boolean;
  onVisibleChange: (visible: boolean) => void;
  saveCallBack: () => void;
}

const CreateForm: React.FC<CreateFormProps> = (props) => {
  const formRef = useRef<ProFormInstance>();

  useEffect(() => {
    if (props.initialValues) {
      formRef?.current?.setFieldsValue(props.initialValues);
    }
  }, [props.modalVisible]);

  const { modalVisible, onVisibleChange, saveCallBack } = props;
  const onFinish = async (data: any) => {
    if (props.type === 'add') {
      await addRole(data);
    } else {
      await editRole(data, props.initialValues.id);
    }
    saveCallBack();
    return true;
  };

  return (
    <ModalForm
      formRef={formRef}
      title={props.title}
      modalProps={{
        maskClosable: false,
        destroyOnClose: true,
      }}
      width="380px"
      visible={modalVisible}
      onVisibleChange={(visible: boolean) => onVisibleChange(visible)}
      onFinish={async (value) => onFinish(value)}
    >
      <ProFormText
        width="sm"
        name="name"
        label="角色名"
        tooltip="最长为 20 位"
        rules={[{ required: true, message: '请输入角色名!' }]}
      />
      <ProFormTextArea width="sm" name="remark" label="备注" />
    </ModalForm>
  );
};

export default CreateForm;
