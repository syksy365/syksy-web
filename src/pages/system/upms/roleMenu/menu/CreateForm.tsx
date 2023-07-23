import React, { useState, useEffect,useRef } from 'react';
import {
  ProForm,
  ModalForm,
  ProFormText,
  ProFormTextArea,
  ProFormSelect,
} from '@ant-design/pro-components';
import type { ProFormInstance } from '@ant-design/pro-components';
import { Form, Radio, Cascader } from 'antd';
import { addMenu, editMenu, queryListRole, getDirectory } from './service';

interface CreateFormProps {
  formConfig: any;
  modalVisible: boolean;
  onVisibleChange: (visible: boolean) => void;
  saveCallBack: () => void;
}

const CreateForm: React.FC<CreateFormProps> = (props) => {
  const formRef = useRef<ProFormInstance>();
  const { modalVisible, onVisibleChange, saveCallBack } = props;
  const [pathDisabled, setPathDisabled] = useState<boolean>(false);
  const [genreDisabled, setGenreDisabled] = useState<boolean>(true);
  const [directoryTree, setDirectoryTree] = useState<any>();


  /**
   * 加载菜单目录
   */
  const loadDirectory = async (disabledId?: string) => {
    const res = await getDirectory(disabledId);
    setDirectoryTree(res.data);
  }

  useEffect(() => {
    if (!props.modalVisible) {
      return;
    }

    if (props.formConfig.initialValues) {
      loadDirectory(props.formConfig.initialValues.id);
      formRef?.current?.resetFields();
      if (props.formConfig.isNew) {
        setGenreDisabled(false);
        setPathDisabled(false);
      } else {
        setGenreDisabled(true);
        if (props.formConfig.initialValues.genre == 'directory') {
          setPathDisabled(false);
        } else {
          setPathDisabled(true);
        }
      }
      formRef?.current?.setFieldsValue(props.formConfig.initialValues);
    }
  }, [props.formConfig.initialValues, props.formConfig.isNew, props.modalVisible]);

  const onFinish = async (data: any) => {
    if (props.formConfig.isNew) {
      await addMenu(data);
    } else {
      await editMenu(data, props.formConfig.initialValues.id);
    }
    saveCallBack();
    return true;
  };

  const onChangeGenre = (e: any) => {
    if (e.target.value == 'directory') {
      setPathDisabled(false);
    } else {
      formRef?.current?.resetFields(['path']);
      setPathDisabled(true);
    }
  };

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
        <Form.Item label="类型" name="genre" rules={[{ required: true, message: '请选择类型!' }]}>
          <Radio.Group onChange={(e: any) => onChangeGenre(e)} disabled={genreDisabled}>
            <Radio value="directory">目录</Radio>
            <Radio value="action">操作</Radio>
          </Radio.Group>
        </Form.Item>
      </ProForm.Group>
      <ProForm.Group>
        <Form.Item name="levelIds" label="上级" style={{ width: '328px' }}>
          <Cascader
            fieldNames={{ label: 'name', value: 'id', children: 'children' }}
            options={directoryTree}
            changeOnSelect
            getPopupContainer={(trigger: any) => trigger.parentElement}
          />
        </Form.Item>
      </ProForm.Group>
      <ProForm.Group>
        <ProFormText
          width="md"
          name="name"
          label="名称"
          tooltip="最长为 20 位"
          rules={[{ required: true, message: '请输入名称!' }]}
        />
        <ProFormText
          width="md"
          name="path"
          label="前端路由"
          disabled={pathDisabled}
          tooltip="最长为 20 位"
        />
      </ProForm.Group>
      <ProFormSelect
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
      />
      <ProFormTextArea name="remark" label="备注" />
    </ModalForm>
  );
};

export default CreateForm;
