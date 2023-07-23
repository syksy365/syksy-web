import { Tabs, Button } from 'antd';
import React, { useEffect, useState } from 'react';
import { UnControlled as CodeMirror } from 'react-codemirror2';
import { putPostCode } from './service';
import styles from './index.less';
const { TabPane } = Tabs;
require('codemirror/lib/codemirror.css');
require('codemirror/theme/material.css');
require('codemirror/theme/eclipse.css');
require('codemirror/mode/xml/xml');
require('codemirror/mode/clike/clike.js');
require('codemirror/addon/selection/active-line');
export default (param: any) => {
  const [editCode, setEditCode] = useState<any>();
  const [codeMirrorData, setCodeMirrorData] = useState<any>({
    controller: '',
    domain: '',
    service: '',
    mapper: '',
    xml: '',
  });

  const onChange = (value: string, genre: string) => {
    if (codeMirrorData[genre] != value) {
      codeMirrorData[genre] = value;
    }
  };

  const refreshCode = (sourceCode: any) => {
    if (typeof sourceCode == 'undefined') {
      return;
    }
    setEditCode(sourceCode);
    for (const code of sourceCode) {
      onChange(code.content, code.genre);
    }
    setCodeMirrorData(Object.assign({}, codeMirrorData));
  };

  useEffect(() => {
    refreshCode(param.sourceCode);
  }, [param.sourceCode]);



  const [loadingSave, setLoadingSave] = useState<boolean>(false);

  const saveCode = () => {
    setLoadingSave(true);
    for (const code of editCode) {
      code.content = codeMirrorData[code.genre];
    }
    putPostCode(editCode).then(() => {
      setLoadingSave(false);
    });
  };

  /**
   * 重置
   */
  const resetCode = () => {
    setCodeMirrorData({
      controller: '',
      domain: '',
      service: '',
      mapper: '',
      xml: '',
    });
    setEditCode({});
  };





  return (
    <Tabs
      style={{ backgroundColor: 'white', padding: '0px' }}
      className={styles}
      tabBarExtraContent={
        <>
          <Button key="resetCode" size="small" onClick={resetCode} style={{ marginRight: '8px' }}>
            重置
          </Button>
          <Button
            key="saveCode"
            size="small"
            type="primary"
            loading={loadingSave}
            onClick={saveCode}
          >
            保存
          </Button>
        </>
      }
    >
      {param.typeCheck.indexOf('controller') != -1 && (
        <TabPane tab="controller" key="controller">
          <CodeMirror
            value={codeMirrorData['controller']}
            options={{
              mode: 'text/x-java',
              theme: 'eclipse',
              lineNumbers: true,
              styleActiveLine: true,
              coverGutterNextToScrollbar: false,
            }}
            onChange={(editor: any, data: any, value: string) => onChange(value, 'controller')}
          />
        </TabPane>
      )}
      {param.typeCheck.indexOf('service') != -1 && (
        <TabPane tab="service" key="service">
          <CodeMirror
            value={codeMirrorData['service']}
            options={{
              mode: 'text/x-java',
              theme: 'eclipse',
              lineNumbers: true,
              styleActiveLine: true,
              coverGutterNextToScrollbar: false,
            }}
            onChange={(editor: any, data: any, value: string) => onChange(value, 'service')}
          />
        </TabPane>
      )}
      {param.typeCheck.indexOf('domain') != -1 && (
        <TabPane tab="domain" key="domain">
          <CodeMirror
            value={codeMirrorData['domain']}
            options={{
              mode: 'text/x-java',
              theme: 'eclipse',
              lineNumbers: true,
              styleActiveLine: true,
              coverGutterNextToScrollbar: false,
            }}
            onChange={(editor: any, data: any, value: string) => onChange(value, 'domain')}
          />
        </TabPane>
      )}
      {param.typeCheck.indexOf('mapper') != -1 && (
        <TabPane tab="mapper" key="mapper">
          <CodeMirror
            value={codeMirrorData['mapper']}
            options={{
              mode: 'text/x-java',
              theme: 'eclipse',
              lineNumbers: true,
              styleActiveLine: true,
              coverGutterNextToScrollbar: false,
            }}
            onChange={(editor: any, data: any, value: string) => onChange(value, 'mapper')}
          />
        </TabPane>
      )}
      {param.typeCheck.indexOf('xml') != -1 && (
        <TabPane tab="xml" key="xml">
          <CodeMirror
            value={codeMirrorData['xml']}
            options={{
              mode: 'xml',
              theme: 'eclipse',
              lineNumbers: true,
              styleActiveLine: true,
              coverGutterNextToScrollbar: false,
            }}
            onChange={(editor: any, data: any, value: string) => onChange(value, 'xml')}
          />
        </TabPane>
      )}
    </Tabs>
  );
};
