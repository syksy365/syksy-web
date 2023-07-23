import React, { useRef, useState } from 'react';
import { PageContainer,ProCard } from '@ant-design/pro-components';
import { Button } from 'antd';
import { useAccess } from '@umijs/max';

import Menu from './menu';
import Role from './role';
import CreateRoleForm from './role/CreateForm';

export default () => {
  const [createRoleModalVisible, handleRoleModalVisible] = useState<boolean>(false);
  const childrenRef = useRef<any>(null);
  const menuRef = useRef<any>(null);
  const access = useAccess();

  /**
   * 新建角色成功后回调
   */
  const saveCallBack = () => {
    childrenRef.current.refresh();
  };

  /**
   * 选择角色触发
   * @param roleId
   */
  const onSelectRole = async (roleId: string) => {
    menuRef.current.onSelectRole(roleId);
  };

  /**
   * 新建菜单
   */
  const onNewMenu = () => {
    menuRef.current.onNewMenu();
  }

  return (
    <PageContainer>
      <ProCard split="vertical">
        <ProCard
          title="角色"
          extra={
            <Button
              key="primary"
              type="primary"
              size="small"
              disabled={!access.canOperate("角色-新建")}
              onClick={() => handleRoleModalVisible(true)}
            >
              新建
            </Button>
          }
          bordered
          headerBordered
          colSpan={{
            xs: '50px',
            sm: '100px',
            md: '150px',
            lg: '200px',
            xl: '250px',
          }}
        >
          <Role onSelect={onSelectRole} ref={childrenRef} />
        </ProCard>
        <ProCard title="菜单" bordered headerBordered
          extra={
            <Button
              key="primary"
              type="primary"
              size="small"
              disabled={!access.canOperate("角色-新建")}
              onClick={() => onNewMenu()}
            >
              新建
            </Button>
          }
        >
          <Menu ref={menuRef} />
        </ProCard>
      </ProCard>
      <CreateRoleForm
        title="新建角色"
        type="add"
        onVisibleChange={(visible: boolean) => handleRoleModalVisible(visible)}
        modalVisible={createRoleModalVisible}
        saveCallBack={saveCallBack}
      />
    </PageContainer>
  );
};
