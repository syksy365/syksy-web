import React, { useRef, useState, useEffect } from 'react';
import { Tag, Table } from 'antd';
import { ProTable, ModalForm, ProDescriptions } from '@ant-design/pro-components';
import type { ProColumns, ActionType } from '@ant-design/pro-components';
import { queryUser } from '../service';
import { RightOutlined, DownOutlined } from '@ant-design/icons';
import styles from './index.less';
interface CreateFormProps {
  modalVisible: boolean;
  onVisibleChange: (visible: boolean) => void;
  saveCallBack: (selectedRowKeys: string[]) => void;
  notRoleId: string;
}
const TableList: React.FC<CreateFormProps> = (props) => {
  const { modalVisible, onVisibleChange, saveCallBack } = props;
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>(new Array<any>());
  const [params, setParams] = useState<any>();

  useEffect(() => {
    if (!props.modalVisible) {
      return;
    }
    setParams({ "notRoleId": props.notRoleId });
  }, [props.modalVisible, props.notRoleId]);

  const onAddRouteLink = () => {
    saveCallBack(selectedRowKeys);
    return true;
  };
  const actionRef = useRef<ActionType>();
  const columns: ProColumns[] = [
    {
      title: '账户名',
      dataIndex: 'username',
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
    Table.EXPAND_COLUMN,
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
    }
  ];

  const onSelect = (record: any, selected: boolean) => {
    if (selected) {
      selectedRowKeys.push(record.id);
      setSelectedRowKeys(selectedRowKeys.slice());
    } else {
      setSelectedRowKeys(selectedRowKeys.filter((item) => item !== record.id).slice());
    }
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
      </ProDescriptions>
    );
  };

  return (
    <div className={styles}>
      <ModalForm
        title="用户"
        modalProps={{
          maskClosable: false,
        }}
        width={768}
        visible={modalVisible}
        onVisibleChange={(visible: boolean) => onVisibleChange(visible)}
        onFinish={async () => onAddRouteLink()}
      >
        <ProTable
          search={false}
          actionRef={actionRef}
          tableAlertRender={false}
          rowSelection={{ onSelect: onSelect }}
          expandable={{
            expandedRowRender: (record) => expandedRowRender(record),
            expandIcon: ({ expanded, onExpand, record }) =>
              expanded ? (
                <DownOutlined onClick={(e) => onExpand(record, e)} />
              ) : (
                <RightOutlined onClick={(e) => onExpand(record, e)} />
              ),
          }}
          rowKey="id"
          request={(p, sorter, filter) => queryUser({ ...p, sorter, filter }).then((r: any) => { return r.data })}
          columns={columns}
          pagination={{
            pageSize: 10,
          }}
          params={params}
          toolbar={{
            search: {
              defaultValue: params?.username,
              allowClear: true,
              placeholder: '请输入账户名',
              onSearch: (value: string) => {
                setParams({ username: value });
              },
            },
          }}
        />
      </ModalForm>
    </div>
  );
};

export default TableList;
