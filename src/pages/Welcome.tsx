import React from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { Card } from 'antd';
import styles from './Welcome.less';

export default (): React.ReactNode => (
  <PageContainer>
    <Card>
       欢迎使用轻舟平台支撑系统！
    </Card>
  </PageContainer>
);
