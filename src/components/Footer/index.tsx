import { GithubOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-components';

export default () => (
  <DefaultFooter
    style={{background:'#f0f2f569'}}
    copyright="2023 Made with ❤ by ABoat365"
    links={[
      {
        key: 'gitee',
        title: <GithubOutlined />,
        href: 'https://gitee.com/syksy',
        blankTarget: true,
      },
    ]}
  />
);
