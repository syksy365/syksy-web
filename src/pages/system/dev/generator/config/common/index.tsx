import React, { useRef, useState } from 'react';
import { ModalForm, ProTable, ProDescriptions } from '@ant-design/pro-components';
import type { ActionType, ProColumns } from '@ant-design/pro-components';

import { Checkbox,Table } from 'antd';
import { list } from '../service';
import { RightOutlined, DownOutlined } from '@ant-design/icons';
interface CreateFormProps {
  modalVisible: boolean;
  onVisibleChange: (visible: boolean) => void;
  saveCallBack: (selectedRowKeys: string[]) => void;
}
const TableList: React.FC<CreateFormProps> = (props) => {
  const { modalVisible, onVisibleChange, saveCallBack } = props;
  const [params, setParams] = useState<any>();
  const [selectedRow, setSelectedRow] = useState<any>();
  const onAddRouteLink = () => {
    if (selectedRow) {
      saveCallBack(selectedRow);
    }
    return true;
  };
  const actionRef = useRef<ActionType>();
  const columns: ProColumns[] = [
    {
      title: '作者',
      dataIndex: 'author',
      width: '50px',
      filters: false,
    },
    Table.EXPAND_COLUMN,
    {
      title: '表前缀',
      dataIndex: 'tablePrefix',
      width: '70px',
      filters: false,
    },
    {
      title: '组id',
      dataIndex: 'groupId',
      filters: false,
    },
  ];

  const onSelect = (record: any) => {
    setSelectedRow(record);
  };

  const expandedRowRender = (record: any) => {
    return (
      <ProDescriptions column={2}>
        <ProDescriptions.Item label="聚合模块">{record.moduleName}</ProDescriptions.Item>
        <ProDescriptions.Item label="组下包">{record.groupPackage}</ProDescriptions.Item>
        <ProDescriptions.Item label="时间类型">{record.dateType}</ProDescriptions.Item>
        <ProDescriptions.Item label="主键类型">{record.idType}</ProDescriptions.Item>
        <ProDescriptions.Item span={2} label="生成文件">
          <Checkbox.Group
            options={['controller', 'domain', 'service', 'mapper', 'xml']}
            disabled
            defaultValue={record.fileType}
          />
        </ProDescriptions.Item>
      </ProDescriptions>
    );
  };

  return (
    <div>
      <ModalForm
        title="公开配置"
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
          rowSelection={{ type: 'radio', onSelect: onSelect }}
          expandable={{
            expandedRowRender: (record) => expandedRowRender(record),
            expandIcon: ({ expanded, onExpand, record }) =>
              expanded ? (
                <DownOutlined onClick={(e) => onExpand(record, e)} />
              ) : (
                <RightOutlined onClick={(e) => onExpand(record, e)} />
              ),
          }}
          rowKey="userId"
          request={(p, sorter, filter) => list({ ...p, sorter, filter }).then((r) => { return r.data })}
          columns={columns}
          pagination={{
            pageSize: 10,
          }}
          params={params}
          toolbar={{
            search: {
              defaultValue: params?.author,
              allowClear: true,
              placeholder: '请输入作者名',
              onSearch: (value: string) => {
                setParams({ author: value });
              },
            },
          }}
        />
      </ModalForm>
    </div>
  );
};

export default TableList;
