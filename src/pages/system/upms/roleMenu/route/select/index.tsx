import React, { useRef, useState } from 'react';
import type { ProColumns, ActionType } from '@ant-design/pro-components';
import { ModalForm, ProTable, ProDescriptions } from '@ant-design/pro-components';
import { Table } from 'antd';
import { queryRoute } from '../service';
import { RightOutlined, DownOutlined } from '@ant-design/icons';
import styles from './index.less';
interface CreateFormProps {
  modalVisible: boolean;
  onVisibleChange: (visible: boolean) => void;
  saveCallBack: (selectedRowKeys: string[]) => void;
  routeIsLink: string[];
}
const TableList: React.FC<CreateFormProps> = (props) => {
  const { modalVisible, onVisibleChange, saveCallBack } = props;
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>(new Array<any>());
  const [params, setParams] = useState<any>();
  const onAddRouteLink = () => {
    saveCallBack(selectedRowKeys);
    return true;
  };
  const actionRef = useRef<ActionType>();
  const columns: ProColumns[] = [
    {
      title: '方法',
      width: '70px',
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
    Table.EXPAND_COLUMN,
    {
      title: '在线',
      width: '70px',
      align: 'center',
      dataIndex: 'online',
      filters: true,
      filterMultiple: false,
      valueEnum: {
        true: { text: '在线', status: 'Processing' },
        false: { text: '离线', status: 'Default' },
      },
    },
    {
      title: '启停',
      width: '70px',
      align: 'center',
      dataIndex: 'onOff',
      filters: true,
      filterMultiple: false,
      valueEnum: {
        true: { text: '启用', status: 'Processing' },
        false: { text: '停用', status: 'Default' },
      },
    },
    {
      title: '路径模板',
      dataIndex: 'pattern',
      filters: false,
    },
  ];

  const onSelect = (record: any, selected: boolean) => {
    if (selected) {
      selectedRowKeys.push(record.id);
      setSelectedRowKeys(selectedRowKeys.slice());
    } else {
      setSelectedRowKeys(selectedRowKeys.filter((item) => item !== record.id).slice());
    }
  };
  const getCheckboxProps: any = (record: any) => {
    if (props.routeIsLink.indexOf(record.id) > -1) {
      return { disabled: true };
    } else {
      return null;
    }
  };

  const rowClass = (record: any) => {
    if (props.routeIsLink.indexOf(record.id) > -1) {
      return 'fontColor';
    } else {
      return '';
    }
  };

  const expandedRowRender = (record: any) => {
    return (
      <ProDescriptions column={2}>
        <ProDescriptions.Item label="开始时间" valueType="date">
          {record.startDate}
        </ProDescriptions.Item>
        <ProDescriptions.Item label="结束时间" valueType="date">
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
    <div className={styles}>
      <ModalForm
        title="接口"
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
          rowSelection={{ onSelect: onSelect, getCheckboxProps: getCheckboxProps }}
          rowClassName={(record) => rowClass(record)}
          expandable={{
            expandedRowRender: (record) => expandedRowRender(record),
            expandIcon: ({ expanded, onExpand, record }) =>
              expanded ? (
                <DownOutlined onClick={(e: any) => onExpand(record, e)} />
              ) : (
                <RightOutlined onClick={(e: any) => onExpand(record, e)} />
              ),
          }}
          rowKey="id"
          request={(p, sorter, filter) => queryRoute({ ...p, sorter, filter }).then((r: any) => { return r.data })}
          columns={columns}
          pagination={{
            pageSize: 10,
          }}
          params={params}
          toolbar={{
            search: {
              defaultValue: params?.pattern,
              allowClear: true,
              placeholder: '请输入路径模板',
              onSearch: (value: string) => {
                setParams({ pattern: value });
              },
            },
          }}
        />
      </ModalForm>
    </div>
  );
};

export default TableList;
