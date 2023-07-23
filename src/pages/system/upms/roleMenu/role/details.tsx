import { useState, useEffect, useRef } from 'react';
import { ProTable, ProDescriptions } from '@ant-design/pro-components';
import type { ActionType } from '@ant-design/pro-components';
import { Button, Space, Divider, Tabs } from 'antd';
import { useAccess } from '@umijs/max';
import { RightOutlined, DownOutlined } from '@ant-design/icons';
import { getRole, deleteUserRole, addUserRole } from './service';
import { queryUser } from '../../orgUser/user/service';
import styles from './details.less';
import Route from '../route/select';
import User from '../../orgUser/user/select';
import { getRouteLink, addRouteLink, removeRouteLink } from '../service';
const { TabPane } = Tabs;

export default (props: any) => {
  const access = useAccess();
  const actionRef = useRef<ActionType>();
  const [data, setData] = useState<any>();
  const [activeKey, handleActiveKey] = useState<string>("associatedUser");
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [createUserModalVisible, handleUserModalVisible] = useState<boolean>(false);

  const [routeIsLink, setRouteIsLink] = useState<string[]>(new Array());

  /**
   * 加载关联路由数据
   */
  const loadData = async () => {
    const res = await getRouteLink(props.id, 'role');
    res.data.forEach(function (item: any) {
      routeIsLink.push(item.id);
    });
    setRouteIsLink(routeIsLink.slice());
    setData(res.data);
  };


  /**
   * 移除关联用户
   * @param id
   */
  const removeUser = async (id: string) => {
    await deleteUserRole(props.id, id);
    actionRef.current?.reload();
  };
  /**
   * 移除关联路由
   * @param id
   */
  const remove = async (id: string) => {
    await removeRouteLink(id, props.id, 'role');
    loadData();
  };

  const columns: any = [
    {
      title: '方法',
      width: 70,
      dataIndex: 'requestMethod',
    },
    {
      title: '在线',
      search: false,
      width: 70,
      align: 'center',
      dataIndex: 'online',
      valueEnum: {
        true: { text: '在线', status: 'Processing' },
        false: { text: '离线', status: 'Default' },
      },
    },
    {
      title: '启停',
      width: 70,
      align: 'center',
      dataIndex: 'onOff',
      valueEnum: {
        true: { text: '启用', status: 'Processing' },
        false: { text: '停用', status: 'Default' },
      },
    },
    {
      title: '路径模板',
      dataIndex: 'pattern',
    },

    {
      title: '操作',
      key: 'action',
      width: 50,
      render: (text: string, record: any) => (
        <Space size="middle">
          <a
            onClick={() => {
              remove(record.id);
            }}
          >
            移除
          </a>
        </Space>
      ),
    },
  ];

  const userColumns: any = [
    {
      title: '账户名',
      dataIndex: 'username',
      sorter: (a: any, b: any) => a.username - b.username,
      fixed: 'left',
      filters: false
    },
    {
      title: '名字',
      dataIndex: 'name',
    },
    {
      title: '操作',
      key: 'action',
      width: 50,
      render: (text: string, record: any) => (
        <Button type="link" size="small" disabled={!access.canOperate("角色-详情-用户-移除")} onClick={() => removeUser(record.id)}>
          移除
        </Button>
        /**<Access accessible={access.canOperate("角色-详情-用户-移除")}>
          <Space size="middle">
            <a
              onClick={() => {
                removeUser(record.id);
              }}
            >
              移除
            </a>
          </Space>
        </Access>*/
      ),
    },
  ];





  useEffect(() => {
    loadData();
  }, []);


  /**
   * 新增关联路由
   * @param selectedRowKeys
   */
  const saveCallBack = async (selectedRowKeys: string[]) => {
    for (const item of selectedRowKeys) {
      await addRouteLink(item, props.id, 'role');
    }
    loadData();
  };



  /**
   * 新增关联用户
   * @param selectedRowKeys
   */
  const saveUserCallBack = async (selectedRowKeys: string[]) => {
    await addUserRole(props.id, selectedRowKeys);
    actionRef.current?.reload();
  };

  const expandedRowRender = (record: any) => {
    return (
      <ProDescriptions column={2}>
        <ProDescriptions.Item label="开始时间" valueType="dateTime">
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
    <div>
      <ProDescriptions
        title="角色详情"
        column={2}
        request={async () => {
          return getRole(props.id);
        }}
      >
        <ProDescriptions.Item label="角色" span={2} dataIndex="name" />
        <ProDescriptions.Item label="更新时间" dataIndex="updateTime" valueType="dateTime" />
        <ProDescriptions.Item label="创建时间" dataIndex="createTime" valueType="dateTime" />
        <ProDescriptions.Item label="备注" span={2} dataIndex="remark" />
      </ProDescriptions>
      <Divider dashed />
      <Tabs
        size="small"
        onChange={(at: string) => handleActiveKey(at)}
        tabBarExtraContent={
          <>
            {
              "associatedApi" == activeKey ?
                <Button
                  key="saveCode"
                  size="small"
                  disabled={!access.canOperate("角色-详情-接口-添加")}
                  type="primary"
                  onClick={() => handleModalVisible(true)}
                >添加</Button>
                :
                <Button
                  key="saveCode"
                  size="small"
                  disabled={!access.canOperate("角色-详情-用户-添加")}
                  type="primary"
                  onClick={() => handleUserModalVisible(true)}
                >添加</Button>
            }
          </>
        }
      >
        <TabPane tab="关联用户" key="associatedUser">
          <ProTable
            actionRef={actionRef}
            search={false}
            options={false}
            rowKey="id"
            pagination={{
              showSizeChanger: true,
            }}
            params={{ roleId: props.id }}
            request={(params, sorter) => queryUser({ ...params, sorter }).then((r: any) => { return r.data })}
            columns={userColumns}
          />
        </TabPane>
        <TabPane tab="关联接口" key="associatedApi">
          <ProTable
            expandable={{
              expandedRowRender: (record) => expandedRowRender(record),
              expandIcon: ({ expanded, onExpand, record }) =>
                expanded ? (
                  <DownOutlined onClick={(e: any) => onExpand(record, e)} />
                ) : (
                  <RightOutlined onClick={(e: any) => onExpand(record, e)} />
                ),
            }}
            search={false}
            options={false}
            rowKey="id"
            pagination={false}
            dataSource={data}
            columns={columns}
            className={styles.details}
          />
        </TabPane>
      </Tabs>
      <Route
        onVisibleChange={(visible: boolean) => handleModalVisible(visible)}
        modalVisible={createModalVisible}
        saveCallBack={saveCallBack}
        routeIsLink={routeIsLink}
      />
      <User
        onVisibleChange={(visible: boolean) => handleUserModalVisible(visible)}
        modalVisible={createUserModalVisible}
        saveCallBack={saveUserCallBack}
        notRoleId={props.id}
      />
    </div>
  );
};
