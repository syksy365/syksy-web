import React, { useEffect, useRef } from 'react';
import { request } from '@umijs/max';
import { ModalForm, ProFormText } from '@ant-design/pro-components';
import type { ProFormInstance } from '@ant-design/pro-components';
interface CreateFormProps {
  modalVisible: boolean;
  onVisibleChange: (visible: boolean) => void;
  saveCallBack: () => void;
}

const EditPassword: React.FC<CreateFormProps> = (props) => {
  const formRef = useRef<ProFormInstance>();

  useEffect(() => {
    if (!props.modalVisible) {
      return;
    }
    formRef?.current?.resetFields();
  }, [props.modalVisible]);


  const { modalVisible, onVisibleChange, saveCallBack } = props;

  const onUpdate = async (data: any) => {
    await request('/qz/api/upms/user/password', {
      method: 'put',
      data: data,
    });
    saveCallBack();
    return true;
  };

  return (
    <ModalForm
      title="修改密码"
      width="380px"
      formRef={formRef}
      modalProps={{
        maskClosable: false,
      }}
      visible={modalVisible}
      onVisibleChange={(visible: boolean) => onVisibleChange(visible)}
      onFinish={async (value: any) => onUpdate(value)}
    >
      <ProFormText.Password
        name="oldPassword"
        label="原密码"
        rules={[{ required: true, message: '请输入原密码!' }]}
      />
      <ProFormText.Password
        name="newPassword"
        label="新密码"
        rules={[{ required: true, message: '请输入新密码!' }]}
      />
      <ProFormText.Password
        name="confirmNewPassword"
        label="再次输入新密码"
        rules={[{
          required: true,
          message: '请再次输入新密码!'
        },
        ({ getFieldValue }) => ({
          validator(_, value) {
            if (!value || getFieldValue('newPassword') === value) {
              return Promise.resolve();
            }
            return Promise.reject(new Error('新密码两次输入不匹配!'));
          },
        }),
        ]}
      />
    </ModalForm>
  );
};

export default EditPassword;
