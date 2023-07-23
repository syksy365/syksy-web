import React, { useEffect, useState } from 'react';
import { ProList } from '@ant-design/pro-components';
import styles from './index.less';
import { getAllTable } from './service';

export default (props: any) => {
  const [data, setData] = useState<any>();

  const onLoadData = async () => {
    const result = await getAllTable();
    setData(result.data);
  };

  useEffect(() => {
    onLoadData();
  }, []);



  const onSelect = (record: any) => {
    props.onSelect(record);
  };

  return (
    <div>
      <ProList<any>
        className={styles.table}
        pagination={{
          defaultPageSize: 10,
          hideOnSinglePage: true,
          size: 'small',
          simple: true,
        }}
        tableAlertRender={false}
        toolBarRender={false}
        size="small"
        rowKey="tableName"
        dataSource={data}
        split={true}
        rowSelection={{
          type: 'radio' as 'radio',
          onSelect: (record: any) => {
            onSelect(record);
          },
        }}
        metas={{
          title: {
            dataIndex: 'tableName',
          },
          description: {
            dataIndex: 'tableComment',
          },
        }}
      />
    </div>
  );
};
