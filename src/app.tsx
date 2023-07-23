import Footer from '@/components/Footer';
import RightContent from '@/components/RightContent';
import { LinkOutlined } from '@ant-design/icons';
import type { Settings as LayoutSettings, MenuDataItem } from '@ant-design/pro-components';
import { SettingDrawer } from '@ant-design/pro-components';
import type { RunTimeLayoutConfig } from '@umijs/max';
import { history, Link } from '@umijs/max';
import defaultSettings from '../config/defaultSettings';
import { currentUser as queryCurrentUser, queryMenuData } from './services/user';
import {
  SmileOutlined,
  HeartOutlined,
  CrownOutlined,
  KeyOutlined,
  ExperimentOutlined,
  SettingOutlined,
} from '@ant-design/icons';

import routes from '../config/routes';

const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/user/login';

const IconMap = {
  smile: <SmileOutlined />,
  heart: <HeartOutlined />,
  crown: <CrownOutlined />,
  key: <KeyOutlined />,
  setting: <SettingOutlined />,
  experiment: <ExperimentOutlined />,
};


const breadthFirstSearchIcon = (path: any) => {
  for (const route of routes) {
    const queue = [];
    queue.unshift(route);
    while (queue.length !== 0) {
      const item: any = queue.shift();
      if (item.icon != null && item.path === path) {
        return IconMap[item.icon as string];
      }
      const children = item.routes;
      if (children) {
        for (let i = 0; i < children.length; i += 1) {
          queue.push(children[i]);
        }
      }
    }
  }
  return null;
};


const loopMenuItem = (menus: MenuDataItem[]): MenuDataItem[] => {
  return menus.filter(item => {
    return item.genre === 'directory';
  }).map(({ icon, children, ...item }) => {
    return ({
      ...item,
      path: item.path || '/',
      key: item.id,
      icon: breadthFirstSearchIcon(item.path),
      children: children && loopMenuItem(children),
    })
  });
}


/**
 * 获取全部菜单数据(包含操作)
 * @returns 
 */
const getAllMenuData = async () => {
  try {
    const r = await queryMenuData();
    const menuOperateData = r.data;
    const menuData = loopMenuItem(JSON.parse(JSON.stringify(menuOperateData)));
    return {
      menuOperateData,
      menuData
    };
  } catch (error) {
    history.push('/user/login');
  }
  return undefined;
};


/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: API.CurrentUser;
  menuData?: any;
  menuOperateData?: any;
  loading?: boolean;
  fetchUserInfo?: () => Promise<API.CurrentUser | undefined>;
  fetchMenuData?: () => Promise<any | undefined>;
}> {
  const fetchUserInfo = async () => {
    try {
      const msg = await queryCurrentUser();
      return msg.data;
    } catch (error) {
      history.push(loginPath);
    }
    return undefined;
  };

  const fetchMenuData = async () => {
    try {
      return await getAllMenuData();
    } catch (error) {

    }
    return undefined;
  };

  // 如果不是登录页面，执行
  if (history.location.pathname !== loginPath) {
    const currentUser = await fetchUserInfo();
    const allMenuData = await fetchMenuData();
    const menuData = allMenuData?.menuData;
    const menuOperateData = allMenuData?.menuOperateData;
    return {
      fetchUserInfo,
      fetchMenuData,
      currentUser,
      settings: defaultSettings,
      menuData,
      menuOperateData,
    };
  }
  return {
    fetchUserInfo,
    fetchMenuData,
    settings: defaultSettings,
  };
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState, setInitialState }) => {
  return {
    menu: {
      // 每当 initialState?.currentUser?.userid 发生修改时重新执行 request
      params: initialState,
      request: async () => {
        return initialState?.menuData;
      },
    },
    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    /**waterMarkProps: {
      content: initialState?.currentUser?.name,
    },**/
    footerRender: () => <Footer />,
    onPageChange: () => {
      const { location } = history;
      // 如果没有登录，重定向到 login
      if (!initialState?.currentUser && location.pathname !== loginPath) {
        history.push(loginPath);
      }
    },
    links: isDev
      ? [
        <Link key="openapi" to="/umi/plugin/openapi" target="_blank">
          <LinkOutlined />
          <span>OpenAPI 文档</span>
        </Link>,
      ]
      : [],
    menuHeaderRender: undefined,
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    // 增加一个 loading 的状态
    childrenRender: (children, props) => {
      // if (initialState?.loading) return <PageLoading />;
      return (
        <>
          {children}
          {!props.location?.pathname?.includes('/login') && (
            <SettingDrawer
              disableUrlParams
              enableDarkTheme
              settings={initialState?.settings}
              onSettingChange={(settings) => {
                setInitialState((preInitialState) => ({
                  ...preInitialState,
                  settings,
                }));
              }}
            />
          )}
        </>
      );
    },
    ...initialState?.settings,
  };
};