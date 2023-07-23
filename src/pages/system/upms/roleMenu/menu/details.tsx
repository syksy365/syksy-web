import React, { useState, useEffect } from 'react';
import { ProDescriptions, ProTable } from '@ant-design/pro-components';
import { Button, Divider, Tag } from 'antd';
import { useAccess } from '@umijs/max';
import { RightOutlined, DownOutlined } from '@ant-design/icons';
import { getMenu } from './service';
import styles from './details.less';
import Route from '../route/select';
import Relation from '../../relation';
import { getRouteLink, addRouteLink, removeRouteLink } from '../service';
import { getMenuRelation } from './service';

export default (props: any) => {
  const access = useAccess();
  const [data, setData] = useState<any>();
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [routeIsLink, setRouteIsLink] = useState<string[]>(new Array());
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [relationData, setRelationData] = useState(false);

  /**
  * 加载关联路由数据
  */
  const loadData = async () => {
    const res = await getRouteLink(props.id, 'menu');
    res.data.forEach(function (item: any) {
      routeIsLink.push(item.id);
    });
    setRouteIsLink(routeIsLink.slice());
    setData(res.data);
  };

  /**
  * 移除关联路由
  * @param id
  */
  const remove = async (id: string) => {
    await removeRouteLink(id, props.id, 'menu');
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
        <Button key="delete" type="link" size="small" disabled={!access.canOperate("菜单-详情-接口-移除")} onClick={() => remove(record.id)}>
          移除
        </Button>
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
      await addRouteLink(item, props.id, 'menu');
    }
    loadData();
  };

  const onRelation = async (id: string) => {
    const r = await getMenuRelation(id);
    setRelationData(r.data);
    setIsModalVisible(true);
  };

  const onCancelRelation = () => {
    setIsModalVisible(false);
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

  interface rolesObj {
    [key: string]: any;
  }
  const roleTag = (roles: rolesObj) => {
    const b = new Array();
    for (const key in roles) {
      b.push(<Tag key={key}>{roles[key]}</Tag>);
    }
    return b;
  };
  return (
    <div>
      <ProDescriptions
        title={props.genre == 'directory' ? '目录详情' : '操作详情'}
        column={2}
        request={async () => {
          return getMenu(props.id);
        }}
      >
        <ProDescriptions.Item label="名称" span={2} dataIndex="name" />
        {props.genre == 'directory' ? (
          <ProDescriptions.Item label="前端路由" span={2} dataIndex="path" />
        ) : (
          <></>
        )}
        <ProDescriptions.Item label="更新时间" dataIndex="updateTime" valueType="dateTime" />
        <ProDescriptions.Item label="创建时间" dataIndex="createTime" valueType="dateTime" />
        <ProDescriptions.Item
          label="角色"
          span={2}
          dataIndex="roles"
          render={(dom: React.ReactNode, entity: any) => {
            return roleTag(entity.roles);
          }}
        />
        <ProDescriptions.Item label="备注" span={2} dataIndex="remark" valueType="textarea" />
        <ProDescriptions.Item span={2}>
          <Button key="relation" type="primary" size="small" disabled={!access.canOperate("菜单-关系图")} onClick={() => onRelation(props.id)}>
            关系图
          </Button>
        </ProDescriptions.Item>
      </ProDescriptions>
      <Divider dashed />
      <ProTable
        headerTitle="关联接口"
        toolbar={{
          actions: [
            <Button
              key="add"
              type="primary"
              disabled={!access.canOperate("菜单-详情-接口-添加")}
              size="small"
              onClick={() => handleModalVisible(true)}
            >
              添加
            </Button>
          ],
        }}
        expandable={{
          expandedRowRender: (record) => expandedRowRender(record),
          expandIcon: ({ expanded, onExpand, record }) =>
            expanded ? (
              <DownOutlined onClick={(e) => onExpand(record, e)} />
            ) : (
              <RightOutlined onClick={(e) => onExpand(record, e)} />
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
      <Route
        onVisibleChange={(visible: boolean) => handleModalVisible(visible)}
        modalVisible={createModalVisible}
        saveCallBack={saveCallBack}
        routeIsLink={routeIsLink}
      />
      <Relation visible={isModalVisible} onCancel={onCancelRelation} data={relationData} />
    </div>
  );
};
