import React,{ useState } from 'react';
import { request } from '@umijs/max';
import { Button } from 'antd';

import { RestOutlined } from '@ant-design/icons';

export default () => {
  const [loading,setLoading] = useState<boolean>(false);
  const onReset = () => {
    setLoading(true);
    request('/qz/api/setting/cache', {method: 'delete'}).then(() => {
      setLoading(false);
    });
  }

  return (
      <Button
          key="primary"
          type="primary"
          loading = {loading}
          icon={<RestOutlined />} 
          onClick={() => onReset()}
        >
          清除全局缓存
      </Button>
  );
  
};
