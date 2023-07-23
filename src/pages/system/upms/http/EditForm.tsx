import React, { useEffect, useRef } from 'react';
import { Radio, Form } from 'antd';
import {
  ModalForm,
  ProFormSwitch,
  ProFormDateTimeRangePicker,
  ProFormTextArea,
} from '@ant-design/pro-components';
import type { ProFormInstance } from '@ant-design/pro-components';

import { editRoute } from './service';

interface CreateFormProps {
  initialValues?: any;
  modalVisible: boolean;
  onVisibleChange: (visible: boolean) => void;
  saveCallBack: () => void;
}

const EditForm: React.FC<CreateFormProps> = (props) => {
  const formRef = useRef<ProFormInstance>();

  useEffect(() => {
    if (props.initialValues) {
      formRef?.current?.setFieldsValue(props.initialValues);
    }
  }, [props.initialValues, props.modalVisible]);

  const { modalVisible, onVisibleChange, saveCallBack } = props;
  const onFinish = async (data: any) => {
    await editRoute(data, props.initialValues.id);
    saveCallBack();
    return true;
  };

  return (
    <ModalForm
      formRef={formRef}
      title="接口编辑"
      modalProps={{
        maskClosable: false,
        destroyOnClose: true,
      }}
      width="500px"
      visible={modalVisible}
      onVisibleChange={(visible: boolean) => onVisibleChange(visible)}
      onFinish={async (value) => onFinish(value)}
    >
      <ProFormSwitch name="onOff" label="启停" />
      <ProFormDateTimeRangePicker
        name="validPeriod"
        label="接口有效期"
        allowClear
        fieldProps={{
          allowEmpty: [true, true],
          getPopupContainer: (trigger: any) => trigger.parentElement,
        }}
      />
      <Form.Item label="校验类型" name="checkType">
        <Radio.Group>
          <Radio value={-1}>免登录</Radio>
          <Radio value={0}>登录</Radio>
          <Radio value={1}>授权</Radio>
        </Radio.Group>
      </Form.Item>

      <ProFormTextArea name="remark" label="备注" />
    </ModalForm>
  );
};

export default EditForm;
