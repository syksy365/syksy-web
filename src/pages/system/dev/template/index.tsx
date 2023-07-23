import { PageContainer } from '@ant-design/pro-components';
import { Badge, Tabs } from 'antd';
import { useEffect, useState } from 'react';
import { UnControlled as CodeMirror } from 'react-codemirror2';
import { getCodeTemplateAll, putCodeTemplate } from './service';
import styles from './index.less';
const { TabPane } = Tabs;
require('codemirror/lib/codemirror.css');
require('codemirror/theme/material.css');
require('codemirror/theme/eclipse.css');
require('codemirror/mode/velocity/velocity');
require('codemirror/addon/selection/active-line');

export default () => {
  const [codeMirrorData, setCodeMirrorData] = useState<any>({
    controller: '',
    domain: '',
    service: '',
    mapper: '',
    xml: '',
  });
  const [badgeStatus, setBadgeStatus] = useState<
    'processing' | 'success' | 'error' | 'default' | 'warning'
  >('processing');

  const loadData = async () => {
    const r = await getCodeTemplateAll();
    for (const template of r.data) {
      codeMirrorData[template.genre] = template.content;
    }
    setCodeMirrorData(Object.assign({}, codeMirrorData));
    setBadgeStatus('success');
  };

  useEffect(() => {
    loadData();
  }, []);
  const operations = <Badge status={badgeStatus} />;

  const onChange = (value: string, genre: string) => {
    setBadgeStatus('processing');
    putCodeTemplate(genre, value).then(() => {
      setBadgeStatus('success');
    });
  };

  return (
    <PageContainer>
      <Tabs
        tabBarExtraContent={operations}
        style={{ backgroundColor: 'white', padding: '24px' }}
        className={styles}
      >
        <TabPane tab="controller" key="controller">
          <CodeMirror
            value={codeMirrorData['controller']}
            options={{
              mode: 'velocity',
              theme: 'eclipse',
              lineNumbers: true,
              styleActiveLine: true,
              coverGutterNextToScrollbar: false,
            }}
            onChange={(editor: any, data: any, value: string) => onChange(value, 'controller')}
          />
        </TabPane>
        <TabPane tab="domain" key="domain">
          <CodeMirror
            value={codeMirrorData['domain']}
            options={{
              mode: 'velocity',
              theme: 'eclipse',
              lineNumbers: true,
              styleActiveLine: true,
              coverGutterNextToScrollbar: false,
            }}
            onChange={(editor: any, data: any, value: string) => onChange(value, 'domain')}
          />
        </TabPane>
        <TabPane tab="service" key="service">
          <CodeMirror
            value={codeMirrorData['service']}
            options={{
              mode: 'velocity',
              theme: 'eclipse',
              lineNumbers: true,
              styleActiveLine: true,
              coverGutterNextToScrollbar: false,
            }}
            onChange={(editor: any, data: any, value: string) => onChange(value, 'service')}
          />
        </TabPane>
        <TabPane tab="mapper" key="mapper">
          <CodeMirror
            value={codeMirrorData['mapper']}
            options={{
              mode: 'velocity',
              theme: 'eclipse',
              lineNumbers: true,
              styleActiveLine: true,
              coverGutterNextToScrollbar: false,
            }}
            onChange={(editor: any, data: any, value: string) => onChange(value, 'mapper')}
          />
        </TabPane>
        <TabPane tab="xml" key="xml">
          <CodeMirror
            value={codeMirrorData['xml']}
            options={{
              mode: 'velocity',
              theme: 'eclipse',
              lineNumbers: true,
              styleActiveLine: true,
              coverGutterNextToScrollbar: false,
            }}
            onChange={(editor: any, data: any, value: string) => onChange(value, 'xml')}
          />
        </TabPane>
      </Tabs>
    </PageContainer>
  );
};
