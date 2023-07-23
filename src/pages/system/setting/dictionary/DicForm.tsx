import React, { useEffect, useRef } from 'react';
import { Form, Radio } from 'antd';
import { ModalForm, ProFormText, ProFormTextArea } from '@ant-design/pro-components';
import type { ProFormInstance } from '@ant-design/pro-components';
import { addDic, updateDic } from './service';

interface CreateFormProps {
  title: string;
  initialValues?: any;
  isNew: boolean;
  modalVisible: boolean;
  onVisibleChange: (visible: boolean) => void;
  saveCallBack: () => void;
}

const CreateForm: React.FC<CreateFormProps> = (props) => {
  const formRef = useRef<ProFormInstance>();


  useEffect(() => {
    if (props.isNew) {
      formRef?.current?.resetFields();
    }
    if (props.initialValues) {
      formRef?.current?.setFieldsValue(props.initialValues);
    }
  }, [props.initialValues, props.isNew, props.modalVisible]);

  const { modalVisible, onVisibleChange, saveCallBack } = props;
  const onFinish = async (data: any) => {
    if (props.isNew) {
      await addDic(data);
    } else {
      await updateDic(props.initialValues.id, data);
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
      <Form.Item label="类型" name="genre" rules={[{ required: true, message: '请选择类型!' }]}>
        <Radio.Group disabled={!props.isNew}>
          <Radio value="list">列表</Radio>
          <Radio value="tree">树</Radio>
        </Radio.Group>
      </Form.Item>
      <ProFormText
        name="name"
        label="名称"
        tooltip="最长为 20 位"
        rules={[{ required: true, message: '请输入名称!' }]}
      />
      <ProFormTextArea name="remark" label="备注" />
    </ModalForm>
  );
};

export default CreateForm;
