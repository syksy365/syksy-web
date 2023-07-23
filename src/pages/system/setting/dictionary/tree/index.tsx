import { useState, useEffect } from 'react';
import { Table, Modal, Button, Tooltip } from 'antd';
import type { ColumnType } from 'antd/es/table';
import { useAccess } from '@umijs/max';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import CreateForm from './CreateForm';
import { list, expand, remove, get, getLevel } from './service';


function getExpandId(data: any, a: string[]) {
  return data.map((node: any) => {
    if (node.expand) {
      a.push(node.id);
    }
    if (node.children) {
      getExpandId(node.children, a);
    } else {
      return;
    }
  });
}

interface FormConfig {
  title: string;
  isNew: boolean;
  initialValues?: any;
  treeData: any;
}

export default (props: any) => {
  const access = useAccess();
  const [data, setData] = useState<any>();
  const [expandedRowIds, setExpandedRowIds] = useState<string[]>(new Array<string>());
  const onList = async () => {
    if (!props.dicId) {
      return;
    }
    const result = await list({ dicId: props.dicId });
    setData(result.data);
    const expandIds = new Array<string>();
    getExpandId(result.data, expandIds);
    setExpandedRowIds(expandIds);
  };
  useEffect(() => {
    onList();
  }, []);
  const { confirm } = Modal;
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);

  const [formConfig, setFormConfig] = useState<FormConfig>({
    title: '新建项',
    isNew: true,
    initialValues: { dicId: props.dicId },
    treeData: data
  });

  /**
   * 删除按钮触发
   */
  const onDelete = (id: string) => {
    confirm({
      title: '确定删除吗?',
      icon: <ExclamationCircleOutlined />,
      async onOk() {
        await remove(id);
        onList();
      },
    });
  };

  /**
   * 编辑按钮触发
   */
  const onEdit = async (id: string) => {
    const res = await get(id);
    setFormConfig({ title: '编辑项-树', isNew: false, initialValues: res.data, treeData: data });
    handleModalVisible(true);
  };

  /**
   * 新建按钮触发
   */
  const onNew = async (parentId?: string) => {
    let levelIds;
    if (parentId) {
      const res = await getLevel(parentId, props.dicId);
      levelIds = res.data;
    }
    setFormConfig({
      title: '新建项-树',
      isNew: true,
      initialValues: { dicId: props.dicId, levelIds },
      treeData: data
    });
    handleModalVisible(true);
  };

  const onExpand = (expanded: any, record: any) => {
    let a = new Array<string>();
    if (expanded) {
      a = expandedRowIds.slice();
      a.push(record.id);
    } else {
      a = expandedRowIds.filter((item) => item !== record.id);
    }
    setExpandedRowIds(a);
    expand(record.id, expanded);
  };

  /**
   * 菜单新建或编辑保存触发回调
   */
  const saveCallBack = () => {
    onList();
  };

  const columns: ColumnType<any>[] = [
    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: '编码',
      dataIndex: 'code',
      width: '200px',
      ellipsis: true,
    },
    {
      title: '操作',
      align: 'center',
      width: '180px',
      render: (text: any, row: any) => [
        <Button key="add" type="link" size="small" disabled={!access.canOperate("项-树-新建")} onClick={() => onNew(row.id)}>
          新建
        </Button>,
        <Button key="edit" type="link" size="small" disabled={!access.canOperate("项-树-编辑")} onClick={() => onEdit(row.id)}>
          编辑
        </Button>,
        <Button key="delete" type="link" size="small" disabled={!access.canOperate("项-树-删除")} onClick={() => onDelete(row.id)}>
          删除
        </Button>
      ]
    },
  ];



  //display: flex;
  //justify-content: flex-end;

  return (
    <div>
      <Table
        title={() => {
          if (props.dicId && access.canOperate("项-树-新建")) {
            return <div style={{ display: 'flex', justifyContent: 'flex-end' }}><Button
              key="add"
              type="primary"
              size="small"
              onClick={() => {
                onNew();
              }}
            >
              新建
            </Button></div>
          } else {
            return <div style={{ display: 'flex', justifyContent: 'flex-end' }}><Tooltip title={props.dicId ? "无权限" : "请先选择左侧类目"}>
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
            </Tooltip></div>
          }
        }}
        bordered
        pagination={false}
        columns={columns}
        rowKey="id"
        dataSource={data}
        expandable={{
          expandedRowKeys: expandedRowIds,
          onExpand: (expanded: any, record: any) => onExpand(expanded, record),
        }}
      />
      <CreateForm
        formConfig={formConfig}
        saveCallBack={saveCallBack}
        onVisibleChange={(visible: boolean) => handleModalVisible(visible)}
        modalVisible={createModalVisible}
      />
    </div>
  );
};
