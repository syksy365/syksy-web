import type { BasicLayoutProps } from '@ant-design/pro-components';
import { history} from '@umijs/max';

function canOperate(menuOperateData: any, name: any){
  const pathname = history.location.pathname;
  if (menuOperateData != null) {
    for (const menu of menuOperateData) {
      const queue = [];
      queue.unshift(menu);
      while (queue.length != 0) {
        const item: any = queue.shift();
        const children = item.children;
        if (item.path == pathname) {
          if (children) {
            for (let i = 0; i < children.length; i++) {
              if (children[i].genre == 'action' && children[i].name == name) {
                return true;
              }
            }
          }
        }
        if (children) {
          for (let i = 0; i < children.length; i++) {
            queue.push(children[i]);
          }
        }
      }
    }
  }
  return false;
}

/**
 * 路由访问权限判定
 * @param allMenuData 后端加载的菜单数据
 * @param route 需要判定的路由
 */
function canAccess(menuOperateData: any, route: any) {
  if (menuOperateData != null) {
    for (const menu of menuOperateData) {
      const queue = [];
      queue.unshift(menu);
      while (queue.length != 0) {
        const item: any = queue.shift();
        if (item.path == route.path) {
          return true;
        }
        const children = item.children;
        if (children) {
          for (let i = 0; i < children.length; i++) {
            queue.push(children[i]);
          }
        }
      }
    }
  }
  return false;
}

// src/access.ts
export default function access(initialState: { menuOperateData?: BasicLayoutProps | undefined }) {
  const { menuOperateData } = initialState || {};
  return {
    canAccess: (route: any) => {
      return canAccess(menuOperateData, route);
    },
    canOperate:(name: string)=> {
      return canOperate(menuOperateData, name);
    }
  };
}
