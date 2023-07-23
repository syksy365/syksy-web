import React, { useState, useEffect, useRef } from 'react';
import {
  ProForm,
  ModalForm,
  ProFormText,
  ProFormTextArea,
  ProFormSelect,
  ProFormSwitch,
} from '@ant-design/pro-components';
import type { ProFormInstance } from '@ant-design/pro-components';

import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { Form, Upload, Cascader } from 'antd';
import { queryListRole } from '../../roleMenu/role/service';
import { getList } from '../org/service';
import { addUser, updateUser } from './service';

interface CreateFormProps {
  formConfig: any;
  modalVisible: boolean;
  onVisibleChange: (visible: boolean) => void;
  saveCallBack: () => void;
}

const CreateForm: React.FC<CreateFormProps> = (props) => {
  const formRef = useRef<ProFormInstance>();
  const [org, setOrg] = useState<any[]>();

  /**
   * 加载组织
   */
  const loadOrg = async () => {
    const res = await getList();
    setOrg(res.data);
  };

  useEffect(() => {
    if (!props.modalVisible) {
      return;
    }

    loadOrg();

    if (props.formConfig.isNew) {
      formRef?.current?.resetFields();
    }

    if (props.formConfig.initialValues) {
      formRef?.current?.setFieldsValue(props.formConfig.initialValues);
    }
  }, [props.formConfig.initialValues, props.formConfig.isNew, props.modalVisible]);
  const { modalVisible, onVisibleChange, saveCallBack } = props;
  const loading = false;
  const imageUrl = null;
  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>上传</div>
    </div>
  );

  /**
   * 加载角色
   */
  const loadRole = async () => {
    const r = await queryListRole();
    const roleList = r.data;
    const roleArray = new Array();
    for (const role of roleList) {
      roleArray.push({ label: role.name, value: role.id });
    }
    return roleArray;
  };



  const onFinish = async (data: any) => {
    if (props.formConfig.isNew) {
      await addUser(data);
    } else {
      await updateUser(data, props.formConfig.initialValues.id);
    }
    saveCallBack();
    return true;
  };

  return (
    <ModalForm
      title={props.formConfig.title}
      formRef={formRef}
      modalProps={{
        maskClosable: false,
      }}
      visible={modalVisible}
      onVisibleChange={(visible: boolean) => onVisibleChange(visible)}
      onFinish={async (value: any) => onFinish(value)}
    >
      <ProForm.Group>
        <Form.Item label="头像" name="avatar" valuePropName="fileList">
          <Upload name="avatar" listType="picture-card" showUploadList={false}>
            {imageUrl ? (
              <img src={imageUrl} alt="avatar" style={{ width: '100%' }} />
            ) : (
              uploadButton
            )}
          </Upload>
        </Form.Item>
        <ProFormSwitch name="onOff" label="启停" />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormText
          width="md"
          name="username"
          label="账户名"
          tooltip="最长为 20 位"
          rules={[{ required: true }]}
        />
        <ProFormText width="md" name="name" label="名字" />
      </ProForm.Group>
      <ProForm.Group>
        <Form.Item
          name="orgIds"
          label="组织"
          rules={[{ required: true, message: '请选择组织!' }]}
          style={{ width: '328px' }}
        >
          <Cascader
            fieldNames={{ label: 'name', value: 'id', children: 'children' }}
            options={org}
            changeOnSelect
            getPopupContainer={(trigger: any) => trigger.parentElement}
          />
        </Form.Item>
        <ProFormSelect
          width="md"
          name="roleIds"
          label="角色"
          hasFeedback
          request={loadRole}
          fieldProps={{
            mode: 'multiple',
            showSearch: true,
            optionFilterProp: 'label',
            getPopupContainer: (trigger: any) => trigger.parentElement,
          }}
          rules={[{ required: true, message: '请选择角色!', type: 'array' }]}
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormText width="md" name="email" label="电子邮箱" />
        <ProFormText width="md" name="phone" label="手机号" />
      </ProForm.Group>

      <ProFormTextArea name="remark" label="备注" />
    </ModalForm>
  );
};

export default CreateForm;
