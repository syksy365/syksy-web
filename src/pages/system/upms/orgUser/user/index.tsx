import React, { useState, useRef } from 'react';
import { Button, Modal, Tag,Table } from 'antd';
import { useAccess } from '@umijs/max';
import { ProTable, ProDescriptions } from '@ant-design/pro-components';

import type { ProColumns, ActionType } from '@ant-design/pro-components';
import { ExclamationCircleOutlined, RightOutlined, DownOutlined } from '@ant-design/icons';
import { queryUser, getUser, removeUser, resetPassword } from './service';
import { getLevel } from '../org/service';
import CreateForm from './CreateForm';

interface FormConfig {
  title: string;
  isNew: boolean;
  initialValues?: any;
}

export default (props: any) => {
  const { confirm } = Modal;
  const access = useAccess();
  const actionRef = useRef<ActionType>();
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [formConfig, setFormConfig] = useState<FormConfig>({
    title: '新建',
    isNew: true,
    initialValues: { onOff: true },
  });

  /**
   * 编辑按钮触发
   */
  const onEdit = async (id: string) => {
    const r = await getUser(id);
    setFormConfig({
      title: '编辑',
      isNew: false,
      initialValues: r.data,
    });
    handleModalVisible(true);
  };

  /**
   * 删除按钮触发
   */
  const onDelete = (id: string) => {
    confirm({
      title: '确定删除吗?',
      icon: <ExclamationCircleOutlined />,
      async onOk() {
        await removeUser(id);
        actionRef.current?.reload();
      },
    });
  };

  const columns: ProColumns[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'index',
      width: '47px',
      fixed: 'left',
      filters: false,
    },
    Table.EXPAND_COLUMN,
    {
      title: '账户名',
      dataIndex: 'username',
      ellipsis: true,
      width: '200px',
      sorter: (a: any, b: any) => a.username - b.username,
      formItemProps: {
        rules: [
          {
            required: true,
            message: '账户名为必填项',
          },
        ],
      },
      fixed: 'left',
      filters: false,
    },
    {
      title: '名字',
      dataIndex: 'name',
      filters: false,
    },
    {
      title: '电子邮箱',
      dataIndex: 'email',
      hideInTable: true,
      filters: false,
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      hideInTable: true,
      filters: false,
    },
    {
      title: '启停',
      dataIndex: 'onOff',
      width: '70px',
      search: false,
      filters: true,
      filterMultiple: false,
      valueEnum: {
        true: { text: '启用', status: 'Processing' },
        false: { text: '停用', status: 'Default' },
      },
    },
    {
      title: '操作',
      align: 'center',
      search: false,
      filters: false,
      width: '110px',
      render: (text, row) => [
        <Button key="edit" type="link" size="small" disabled={!access.canOperate("账户-编辑")} onClick={() => onEdit(row.id)}>
          编辑
        </Button>,
        <Button key="delete" type="link" size="small" disabled={!access.canOperate("账户-删除")} onClick={() => onDelete(row.id)}>
          删除
        </Button>
      ],
    },
  ];

  /**
   * 新建按钮触发
   */
  const onNew = async () => {
    const initialValues = { onOff: true, orgIds: null };
    if (props.orgId && props.orgId.length > 0) {
      const res = await getLevel(props.orgId);
      initialValues.orgIds = res.data;
    }
    setFormConfig({
      title: '新建',
      isNew: true,
      initialValues,
    });
    handleModalVisible(true);
  };



  /**
   * 重置密码
   * @param id
   */
  const onResetPassword = (id: string) => {
    confirm({
      title: '密码将重置为默认密码，确定重置密码吗?',
      icon: <ExclamationCircleOutlined />,
      async onOk() {
        await resetPassword(id);
      },
    });
  };

  /**
   * 账户新建或编辑保存触发回调
   */
  const saveCallBack = () => {
    actionRef.current?.reload();
  };

  interface mapObj {
    [key: string]: any;
  }
  const roleTag = (roles: mapObj) => {
    const b = new Array();
    for (const key in roles) {
      b.push(<Tag key={key}>{roles[key]}</Tag>);
    }
    return b;
  };

  const orgName = (orgs: mapObj) => {
    const b = new Array();
    for (const key in orgs) {
      b.push(orgs[key]);
      b.push(<RightOutlined key={key} />);
    }
    b.pop();
    return b;
  };

  const expandedRowRender = (record: any) => {
    return (
      <ProDescriptions column={2}>
        <ProDescriptions.Item label="电子邮箱" contentStyle={{ marginRight: '48px' }}>
          {record.email}
        </ProDescriptions.Item>
        <ProDescriptions.Item label="手机号">{record.phone}</ProDescriptions.Item>
        <ProDescriptions.Item span={2} label="组织">
          {orgName(record.orgs)}
        </ProDescriptions.Item>
        <ProDescriptions.Item span={2} label="角色">
          {roleTag(record.roles)}
        </ProDescriptions.Item>
        <ProDescriptions.Item
          label="创建时间"
          valueType="dateTime"
          contentStyle={{ marginRight: '48px' }}
        >
          {record.createTime}
        </ProDescriptions.Item>
        <ProDescriptions.Item label="更新时间" valueType="dateTime">
          {record.updateTime}
        </ProDescriptions.Item>
        <ProDescriptions.Item span={2} label="备注" valueType="textarea">
          {record.remark}
        </ProDescriptions.Item>
        <ProDescriptions.Item span={2}>
          <Button
            key="resetPassword"
            type="primary"
            size="small"
            disabled={!access.canOperate("账户-重置密码")}
            onClick={() => onResetPassword(record.id)}
          >
            重置密码
          </Button>
        </ProDescriptions.Item>
      </ProDescriptions>
    );
  };

  return (
    <React.Fragment>
      <ProTable
        actionRef={actionRef}
        columns={columns}
        rowKey="id"
        cardBordered={true}
        pagination={{
          showSizeChanger: true,
        }}
        params={{ orgId: props.orgId }}
        toolBarRender={() => [
          <Button key="primary" type="primary" size="small" disabled={!access.canOperate("账户-新建")} onClick={() => onNew()}>
            新建
          </Button>
        ]}
        request={(params, sorter) => queryUser({ ...params, sorter }).then((r: any) => { return r.data })}
        expandable={{
          expandedRowRender: (record) => expandedRowRender(record),
          expandIcon: ({ expanded, onExpand, record }) =>
            expanded ? (
              <DownOutlined onClick={(e) => onExpand(record, e)} />
            ) : (
              <RightOutlined onClick={(e) => onExpand(record, e)} />
            ),
        }}
      />
      <CreateForm
        formConfig={formConfig}
        saveCallBack={saveCallBack}
        onVisibleChange={(visible: boolean) => handleModalVisible(visible)}
        modalVisible={createModalVisible}
      />
    </React.Fragment>
  );
};
