import { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { useAccess } from '@umijs/max';
import { ProList } from '@ant-design/pro-components';
import { Modal, Drawer, Button } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { queryListRole, deleteRole, getRole } from './service';
import CreateRoleForm from './CreateForm';
import Details from './details';
import styles from './index.less';

const { confirm } = Modal;
const Role = (props: any, ref: any) => {
  const access = useAccess();
  const [data, setData] = useState<any>();
  const [createRoleModalVisible, handleRoleModalVisible] = useState<boolean>(false);
  const [initialValues, setInitialValues] = useState<any>();

  const onListRole = async () => {
    const result = await queryListRole();
    setData(result.data);
  };

  useEffect(() => {
    onListRole();
  }, []);


  useImperativeHandle(ref, () => ({
    refresh: onListRole,
  }));



  const onEdit = async (id: string) => {
    const res = await getRole(id);
    setInitialValues(res.data);
    handleRoleModalVisible(true);
  };

  const onDelete = (id: any) => {
    confirm({
      title: '确定删除吗?',
      icon: <ExclamationCircleOutlined />,
      async onOk() {
        await deleteRole(id);
        onListRole();
      },
    });
  };

  const saveCallBack = () => {
    onListRole();
  };

  const [visible, setVisible] = useState(false);
  const onClose = () => {
    setVisible(false);
  };

  const [roleId, setRoleId] = useState<string>();
  const onDetails = (id: any) => {
    setVisible(true);
    setRoleId(id);
  };

  const rowSelection = {
    type: 'radio' as 'radio',
    onSelect: (record: any) => {
      props.onSelect(record.id);
    },
  };

  return (
    <div>
      <ProList<any>
        className={styles.roleMenu}
        pagination={{
          defaultPageSize: 10,
          hideOnSinglePage: true,
          simple: true,
          size: 'small',
        }}
        tableAlertRender={false}
        toolBarRender={false}
        size="small"
        rowKey="id"
        dataSource={data}
        split={true}
        rowSelection={rowSelection}
        showActions="hover"
        metas={{
          title: {
            dataIndex: 'name',
            render: (text, row) =>
              <a onClick={() => onDetails(row.id)}
                style={{
                  display: 'block',
                  width: '150px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >{text}</a>
          },
          description: {
            dataIndex: 'remark',
            render: (text) =>
              <span
                style={{
                  display: 'block',
                  width: '150px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >{text}</span>
          },
          actions: {
            render: (text, row) => [
              <Button key="edit" type="link" size="small" disabled={!access.canOperate("角色-编辑")} onClick={() => onEdit(row.id)}>
                编辑
              </Button>,
              <Button key="delete" type="link" size="small" disabled={!access.canOperate("角色-删除")} onClick={() => onDelete(row.id)}>
                删除
              </Button>
            ],
          },
        }}
      />
      <CreateRoleForm
        title="编辑角色"
        type="edit"
        initialValues={initialValues}
        onVisibleChange={(v: boolean) => handleRoleModalVisible(v)}
        modalVisible={createRoleModalVisible}
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
        <Details id={roleId} />
      </Drawer>
    </div>
  );
};
export default forwardRef(Role);
