import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Drawer, Modal, Table, Tag, message, Tooltip, Button } from 'antd';
import { useAccess } from '@umijs/max';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import CreateForm from './CreateForm';
import Details from './details';
import { deleteMenu, expandMenu, getLevel, getMenu, queryListMenu, move } from './service';
import { addRoleMenu, getRoleMenu, removeRoleMenu } from '../service';

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
}

const Menu = (props: any, ref: any) => {
  const access = useAccess();
  const [data, setData] = useState<any>();
  const [expandedRowIds, setExpandedRowIds] = useState<string[]>(new Array<string>());


  /**
   * 加载全部菜单数据
   */
  const onListMenu = async () => {
    const result = await queryListMenu();
    setData(result.data);

    const expandIds = new Array<string>();
    getExpandId(result.data, expandIds);
    setExpandedRowIds(expandIds);
  };

  useEffect(() => {
    onListMenu();
  }, []);
  const { confirm } = Modal;
  const [id, setId] = useState<string>();
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [visible, setVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>(new Array<any>());
  const [roleSelectId, setRoleSelectId] = useState<string>();
  const [formConfig, setFormConfig] = useState<FormConfig>({
    title: '新建目录或操作',
    isNew: true,
  });
  const [genre, setGenre] = useState<string>();

  /**
   * 选择角色触发
   * @param roleId 
   */
  const onSelectRole = async (roleId: string) => {
    setRoleSelectId(roleId);
    const r = await getRoleMenu(roleId);
    const roleMenus = r.data;
    selectedRowKeys.splice(0, selectedRowKeys.length)
    roleMenus.forEach(function (item: any) {
      selectedRowKeys.push(item.menuId);
    });
    setSelectedRowKeys(selectedRowKeys.slice());
  }

  /**
   * 新建按钮触发
   */
  const onNewMenu = async (i?: string) => {
    interface initialValuesType {
      genre: string;
      levelIds?: string;
      roleIds?: string[];
    }
    const initialValues: initialValuesType = { genre: 'directory' };
    if (i) {
      const res = await getLevel(i);
      initialValues.levelIds = res.data;
    }
    if (roleSelectId) {
      initialValues.roleIds = [roleSelectId];
    }
    setFormConfig({
      title: '新建目录或操作',
      isNew: true,
      initialValues,
    });
    handleModalVisible(true);
  };


  useImperativeHandle(ref, () => ({
    onNewMenu, onSelectRole
  }));

  /**
   * 移动位置
   * @param id 
   * @param direction 
   */
  const onMove = (i: string, direction: string) => {
    move(i, direction).then(() => {
      onListMenu();
    });
  }

  /**
   * 编辑按钮触发
   */
  const onEditMenu = async (i: string) => {
    const res = await getMenu(i);
    setFormConfig({ title: '编辑目录或操作', isNew: false, initialValues: res.data });
    handleModalVisible(true);
  };

  /**
   * 删除按钮触发
   */
  const onDeleteMenu = (i: string) => {
    confirm({
      title: '确定删除吗?',
      icon: <ExclamationCircleOutlined />,
      async onOk() {
        await deleteMenu(i);
        onListMenu();
      },
    });
  };

  /**
   * 点击名字触发详情
   * @param id
   */
  const onDetails = (i: string, g: string) => {
    setGenre(g);
    setVisible(true);
    setId(i);
  };

  const columns: any = [
    {
      title: '目录和操作',
      dataIndex: 'name',
      ellipsis: true,
      render: (name: string, record: any) => {
        return (
          <a onClick={() => onDetails(record.id, record.genre)}>
            {name}
          </a>
        )
      },
    },
    {
      title: '类型',
      align: "center",
      width: 65,
      render: (record: any) => {
        if (record.genre === 'directory') {
          return <Tag color="geekblue">目录</Tag>;
        } else {
          return <CopyToClipboard text={record.name} onCopy={(text: string) => message.success("已复制：" + text)}>
            <Tooltip title="点击复制操作名称">
              <Tag color="green">操作</Tag>
            </Tooltip>
          </CopyToClipboard>
        }
      }
    },
    {
      title: '前端路由',
      dataIndex: 'path',
      width: 200,
      ellipsis: true,
    },
    {
      title: '操作',
      align: 'center',
      width: '165px',
      render: (text: any, record: any) => {
        const option = new Array();
        if (record.genre == 'directory') {
          option.push(<Button key="add" type="link" size="small" disabled={!access.canOperate("菜单-新建")} onClick={() => onNewMenu(record.id)}>新建</Button>);
        }
        option.push(<Button key="edit" type="link" size="small" disabled={!access.canOperate("菜单-编辑")} onClick={() => onEditMenu(record.id)}>编辑</Button>);
        option.push(<Button key="delete" type="link" size="small" disabled={!access.canOperate("菜单-删除")} onClick={() => onDeleteMenu(record.id)}>删除</Button>);
        return option;
      }
    },
    {
      title: '排序',
      align: 'center',
      width: '125px',
      render: (text: any, record: any) =>
        [
          <Button key="up" type="link" size="small" disabled={!access.canOperate("菜单-排序")} onClick={() => onMove(record.id, 'up')}>
            上移
          </Button>,
          <Button key="down" type="link" size="small" disabled={!access.canOperate("菜单-排序")} onClick={() => onMove(record.id, 'down')}>
            下移
          </Button>
        ]
    }
  ];

  /**
   * 菜单展开关闭触发
   * @param expanded
   * @param record
   */
  const onExpand = (expanded: any, record: any) => {
    let a = new Array<string>();
    if (expanded) {
      a = expandedRowIds.slice();
      a.push(record.id);
    } else {
      a = expandedRowIds.filter((item) => item !== record.id);
    }
    setExpandedRowIds(a);
    expandMenu(record.id, expanded);
  };

  /**
   * 菜单勾选触发
   */
  const rowSelection = {
    onSelect: (record: any, selected: any) => {
      if (roleSelectId) {
        if (selected) {
          selectedRowKeys.push(record.id);
          setSelectedRowKeys(selectedRowKeys.slice());
          addRoleMenu(roleSelectId, record.id);
        } else {
          setSelectedRowKeys(selectedRowKeys.filter((item) => item !== record.id).slice());
          removeRoleMenu(roleSelectId, record.id);
        }
      } else {
        message.warning('请先选择左侧角色');
      }
    },
  };





  /**
   * 详情抽屉触发关闭
   */
  const onClose = () => {
    setVisible(false);
  };

  /**
   * 菜单新建或编辑保存触发回调
   */
  const saveCallBack = () => {
    onListMenu();
  };

  return (
    <>
      <Table
        bordered
        pagination={false}
        columns={columns}
        rowSelection={{
          ...rowSelection,
          checkStrictly: true,
          selectedRowKeys: selectedRowKeys,
        }}
        rowKey="id"
        dataSource={data}
        expandable={{
          expandedRowKeys: expandedRowIds,
          onExpand: (expanded: any, record: any) => onExpand(expanded, record),
        }}
      />
      <CreateForm
        formConfig={formConfig}
        onVisibleChange={(v: boolean) => handleModalVisible(v)}
        modalVisible={createModalVisible}
        saveCallBack={saveCallBack}
      />
      <Drawer
        width={768}
        placement="right"
        destroyOnClose={true}
        closable={false}
        onClose={onClose}
        visible={visible}
      >
        <Details id={id} genre={genre} />
      </Drawer>
    </>
  );
};
export default forwardRef(Menu);
