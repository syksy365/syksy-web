import React from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { ProCard } from '@ant-design/pro-components';

import Cache from './cache';

export default () => {
  return (
    <PageContainer>
      <ProCard ghost gutter={8}>
        <ProCard title="缓存" colSpan={8} hoverable bordered><Cache /></ProCard>
        <ProCard colSpan={8} hoverable bordered></ProCard>
        <ProCard colSpan={8} hoverable bordered></ProCard>
      </ProCard>
    </PageContainer>
  );
};
