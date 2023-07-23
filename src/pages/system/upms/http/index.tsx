import { DownOutlined, RightOutlined } from '@ant-design/icons';
import { PageContainer, ProDescriptions, ProTable } from '@ant-design/pro-components';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { Button, Tag, Table } from 'antd';
import { useAccess } from '@umijs/max';
import React, { useRef, useState } from 'react';
import EditForm from './EditForm';
import { overloadRoute, queryRoute, getRoute, deleteRoute } from './service';
interface CreateFormProps {
  modalVisible: boolean;
  onVisibleChange: (visible: boolean) => void;
}
const TableList: React.FC<CreateFormProps> = () => {
  const access = useAccess();
  const actionRef = useRef<ActionType>();
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [initialValues, setInitialValues] = useState<any>();
  const [scanLoad, setScanLoad] = useState<boolean>(false);

  const onEditRoute = async (id: string) => {
    const r = await getRoute(id);
    setInitialValues(r.data);
    handleModalVisible(true);
  };

  /**
   * 删除HTTP接口
   * @param id
   */
  const onDeleteRoute = async (id: string) => {
    await deleteRoute(id);
    actionRef.current?.reload();
  };

  /**
   * 扫描HTTP接口
   */
  const onScanHttpInterface = async () => {
    setScanLoad(true);
    overloadRoute().then(() => {
      setScanLoad(false);
      actionRef.current?.reload();
    });
  };

  /**
   * 菜单新建或编辑保存触发回调
   */
  const saveCallBack = () => {
    actionRef.current?.reload();
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
      title: '方法',
      width: '70px',
      search: false,
      dataIndex: 'requestMethod',
      filters: true,
      filterMultiple: true,
      valueEnum: {
        GET: {
          text: 'GET',
        },
        POST: {
          text: 'POST',
        },
        PUT: {
          text: 'PUT',
        },
        DELETE: {
          text: 'DELETE',
        },
        '*': {
          text: '*',
        },
      },
    },
    {
      title: '在线',
      search: false,
      width: '80px',
      align: 'center',
      dataIndex: 'online',
      filters: true,
      filterMultiple: false,
      valueType: 'select',
      valueEnum: {
        true: { text: '在线', status: 'Processing' },
        false: { text: '离线', status: 'Default' },
      },
    },
    {
      title: '启停',
      width: '80px',
      align: 'center',
      search: false,
      dataIndex: 'onOff',
      filters: true,
      filterMultiple: false,
      valueEnum: {
        true: { text: '启用', status: 'Processing' },
        false: { text: '停用', status: 'Default' },
      },
    },
    {
      title: '校验类型',
      width: '120px',
      align: 'center',
      search: false,
      dataIndex: 'checkType',
      filters: true,
      filterMultiple: false,
      valueEnum: {
        '-1': {
          text: <Tag color="#52c41a">免登录</Tag>,
        },
        '0': {
          text: <Tag color="#13c2c2">登录</Tag>,
        },
        '1': {
          text: <Tag color="#1890ff">授权</Tag>,
        },
      },
    },
    {
      title: '路径模板',
      filters: false,
      dataIndex: 'pattern',
    },
    {
      title: '处理方法',
      filters: false,
      dataIndex: 'handlerMethod',
      hideInTable: true,
    },
    {
      filters: false,
      title: '操作',
      align: 'center',
      width: 100,
      valueType: 'option',
      render: (text, row) => {
        const op = new Array();
        op.push(
          <Button key="edit" type="link" disabled={!access.canOperate("API资源-编辑")} onClick={() => onEditRoute(row.id)}>
            编辑
          </Button>
        );
        if (!row.online) {
          op.push(
            <Button key="edit" type="link" disabled={!access.canOperate("API资源-删除")} onClick={() => onDeleteRoute(row.id)}>
              删除
            </Button>
          );
        }
        return op;
      },
    },
  ];

  const expandedRowRender = (record: any) => {
    return (
      <ProDescriptions column={2}>
        <ProDescriptions.Item
          label="开始时间"
          valueType="dateTime"
          contentStyle={{ marginRight: '48px' }}
        >
          {record.startDate}
        </ProDescriptions.Item>
        <ProDescriptions.Item label="结束时间" valueType="dateTime">
          {record.endDate}
        </ProDescriptions.Item>
        <ProDescriptions.Item span={2} label="处理方法">
          {record.handlerMethod}
        </ProDescriptions.Item>
        <ProDescriptions.Item span={2} label="备注">
          {record.remark}
        </ProDescriptions.Item>
      </ProDescriptions>
    );
  };

  return (
    <PageContainer>
      <ProTable
        toolbar={{
          actions: [
            <Button
              key="http"
              type="primary"
              size="small"
              disabled={!access.canOperate("全局API资源扫描")}
              loading={scanLoad}
              onClick={() => onScanHttpInterface()}
            >
              全局API资源扫描
            </Button>
          ],
        }}
        actionRef={actionRef}
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
        search={{
          labelWidth: 'auto',
        }}
        request={(params, sorter, filter) => queryRoute({ ...params, sorter, filter }).then((r: any) => { return r.data })}
        columns={columns}
      />
      <EditForm
        initialValues={initialValues}
        onVisibleChange={(visible: boolean) => handleModalVisible(visible)}
        modalVisible={createModalVisible}
        saveCallBack={saveCallBack}
      />
    </PageContainer>
  );
};

export default TableList;
