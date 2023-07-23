import React, { useState, useRef } from 'react';
import { Button, Modal, Tooltip } from 'antd';
import { useAccess } from '@umijs/max';
import { ProTable } from '@ant-design/pro-components';
import type { ProColumns, ActionType } from '@ant-design/pro-components';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { page, get, remove } from './service';
import CreateForm from './CreateForm';

interface FormConfig {
  title: string;
  isNew: boolean;
  initialValues?: any;
}

export default (props: any) => {
  const access = useAccess();
  const { confirm } = Modal;
  const actionRef = useRef<ActionType>();
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [params, setParams] = useState<any>({ dicId: props.dicId });

  const [formConfig, setFormConfig] = useState<FormConfig>({
    title: '新建项',
    isNew: true,
  });

  /**
   * 编辑按钮触发
   */
  const onEdit = async (id: string) => {
    const res = await get(id);
    setFormConfig({
      title: '编辑项',
      isNew: false,
      initialValues: res.data,
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
        await remove(id);
        actionRef.current?.reload();
      },
    });
  };

  const columns: ProColumns[] = [
    {
      title: '名称',
      dataIndex: 'name',
      sorter: (a: any, b: any) => a.name - b.name,
      formItemProps: {
        rules: [
          {
            required: true,
            message: '名称为必填项',
          },
        ],
      },
      filters: false,
    },
    {
      title: '编码',
      dataIndex: 'code',
      sorter: (a: any, b: any) => a.code - b.code,
      filters: false,
    },
    {
      title: '操作',
      valueType: 'option',
      align: 'center',
      filters: false,
      width: '90px',
      render: (text, row) =>
        [
          <Button key="edit" type="link" size="small" disabled={!access.canOperate("项-列表-编辑")} onClick={() => onEdit(row.id)}>
            编辑
          </Button>,
          <Button key="delete" type="link" size="small" disabled={!access.canOperate("项-列表-删除")} onClick={() => onDelete(row.id)}>
            删除
          </Button>
        ]
    },
  ];

  const onPage = async (p: any) => {
    const r = await page(p);
    return r.data;
  };

  /**
   * 新建按钮触发
   */
  const onNew = () => {
    setFormConfig({
      title: '新建项-列表',
      isNew: true,
      initialValues: { dicId: props.dicId },
    });
    handleModalVisible(true);
  };

  /**
   * 账户新建或编辑保存触发回调
   */
  const saveCallBack = () => {
    actionRef.current?.reload();
  };

  return (
    <>
      <ProTable
        actionRef={actionRef}
        columns={columns}
        rowKey="id"
        search={false}
        cardBordered={true}
        pagination={{
          showSizeChanger: true,
        }}

        params={{ dicId: props.dicId }}
        request={(p, sorter, filter) => onPage({ ...p, sorter, filter })}
        toolbar={{
          search: {
            allowClear: true,
            placeholder: '请输入名称或编码',
            onSearch: (value: string) => {
              const newParams = Object.assign({}, params);
              newParams.pattern = value;
              setParams(newParams);
            },
          },
          actions: [<>
            {props.dicId && access.canOperate("项-列表-新建") ? <Button
              key="add"
              type="primary"
              size="small"
              onClick={() => {
                onNew();
              }}
            >
              新建
            </Button> :
              <Tooltip title={props.dicId ? "无权限" : "请先选择左侧类目"}>
                <Button
                  key="add"
                  type="primary"
                  size="small"
                  disabled
                  onClick={() => {
                    onNew();
                  }}
                >
                  新建
                </Button>
              </Tooltip>
            }
          </>]
        }}
      />
      <CreateForm
        formConfig={formConfig}
        saveCallBack={saveCallBack}
        onVisibleChange={(visible: boolean) => handleModalVisible(visible)}
        modalVisible={createModalVisible}
      />
    </>
  );
};
