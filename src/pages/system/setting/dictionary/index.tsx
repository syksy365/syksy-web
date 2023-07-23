import React, { useState, useRef } from 'react';
import { PageContainer, ProCard, ProList } from '@ant-design/pro-components';
import type { ActionType } from '@ant-design/pro-components';
import { useAccess } from '@umijs/max';
import { Button, Modal, Tag, Input, Select } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { getDic, deleteDic, page } from './service';
import styles from './index.less';
import List from './list/index';
import Tree from './tree/index';
import DicForm from './DicForm';

const { confirm } = Modal;
const { Search } = Input;
const { Option } = Select;

interface FormConfig {
  title: string;
  isNew: boolean;
  initialValues?: any;
}

export default () => {
  const access = useAccess();
  const actionRef = useRef<ActionType>();
  const [dicModalVisible, handleDicModalVisible] = useState<boolean>(false);
  const [dicId, setDicId] = useState<string>();
  const [dicGenre, setDicGenre] = useState<string>('list');
  const [params, setParams] = useState<any>();

  const [formConfig, setFormConfig] = useState<FormConfig>({
    title: '新建类目',
    isNew: true,
  });

  const onLoadDic = async (p: any) => {
    const result = await page(p);
    return result.data;
  };

  const onEdit = async (id: string) => {
    const res = await getDic(id);
    setFormConfig({
      title: '修改类目',
      isNew: false,
      initialValues: res.data,
    });
    handleDicModalVisible(true);
  };

  const onDelete = (id: any) => {
    confirm({
      title: '确定删除吗?',
      icon: <ExclamationCircleOutlined />,
      async onOk() {
        await deleteDic(id);
        actionRef.current?.reload();
      },
    });
  };
  const rowSelection = {
    type: 'radio' as 'radio',
    onSelect: (record: any) => {
      setDicId(record.id);
      setDicGenre(record.genre)
    },
  };

  /**
   * 新建按钮触发
   */
  const onNewForm = () => {
    setFormConfig({
      title: '新建类目',
      isNew: true,
      initialValues: { genre: 'list' },
    });
    handleDicModalVisible(true);
  };

  /**
   * 新建或修改类目成功后回调
   */
  const saveCallBack = () => {
    actionRef.current?.reload();
  };

  const [name, setName] = useState<string>();
  const [genre, setGenre] = useState<string>();
  const onSearch = (value: string) => {
    setName(value);
    setParams({ "name": value, "genre": genre });
  }
  const onChange = (value: string) => {
    setGenre(value);
    setParams({ "name": name, "genre": value });
  }
  return (
    <PageContainer>
      <ProCard split="vertical">
        <ProCard
          className={styles.dic}
          title="类目"
          extra={
            <Button
              key="add"
              type="primary"
              disabled={!access.canOperate("类目-新建")}
              size="small"
              onClick={() => onNewForm()}
            >
              新建
            </Button>
          }
          bordered
          headerBordered
          colSpan={{
            xs: '120px',
            sm: '170px',
            md: '300px',
            lg: '450px',
            xl: '450px',
          }}
        >
          <ProList<any>
            actionRef={actionRef}
            headerTitle={
              <span>
                <Search placeholder="请输入名称" allowClear={true} onSearch={onSearch} style={{ width: 180 }} />
                <Select placeholder="请选择类型" allowClear={true} onChange={onChange} style={{ width: 120, marginLeft: 10 }}>
                  <Option value="list">列表</Option>
                  <Option value="tree">树</Option>
                </Select>
              </span>
            }
            pagination={{
              defaultPageSize: 10,
              hideOnSinglePage: true,
              simple: true,
              size: 'small',
            }}
            size="small"
            rowKey="id"
            params={params}
            request={(p, sorter, filter) => onLoadDic({ ...p, sorter, filter })}
            split={true}
            tableAlertRender={false}
            rowSelection={rowSelection}
            showActions="hover"
            metas={{
              title: {
                dataIndex: 'name',
              },
              subTitle: {
                dataIndex: 'genre',
                render: (text) => {
                  if (text == 'list') {
                    return <Tag color="blue">列表</Tag>
                  } else {
                    return <Tag color="#5BD8A6">树</Tag>
                  }
                }
              },
              description: {
                dataIndex: 'remark',
              },
              actions: {
                render: (text, row) => {
                  if (row.fixed) {
                    return;
                  }
                  return [
                    <Button key="edit" type="link" size="small" disabled={!access.canOperate("类目-编辑")} onClick={() => onEdit(row.id)}>
                      编辑
                    </Button>,
                    <Button key="delete" type="link" size="small" disabled={!access.canOperate("类目-删除")} onClick={() => onDelete(row.id)}>
                      删除
                    </Button>
                  ]
                }
              },
            }}
          />
        </ProCard>
        <ProCard title="项" bordered headerBordered>
          {dicGenre == 'list' && <List dicId={dicId} />}
          {dicGenre == 'tree' && <Tree dicId={dicId} />}
        </ProCard>
      </ProCard>
      <DicForm
        title={formConfig.title}
        isNew={formConfig.isNew}
        initialValues={formConfig.initialValues}
        onVisibleChange={(visible: boolean) => handleDicModalVisible(visible)}
        modalVisible={dicModalVisible}
        saveCallBack={saveCallBack}
      />
    </PageContainer>
  );
};
