export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        name: 'login',
        path: '/user/login',
        component: './user/login',
      },
    ],
  },
  {
    path: '/welcome',
    name: 'welcome',
    icon: 'smile',
    component: './Welcome',
  },
  {
    path: '/upms',
    name: '账户权限',
    access: 'canAccess',
    icon: 'key',
    routes: [
      {
        path: '/upms/org-user',
        access: 'canAccess',
        name: '组织账户',
        component: './system/upms/orgUser',
      },
      {
        path: '/upms/role-menu',
        access: 'canAccess',
        name: '角色菜单',
        component: './system/upms/roleMenu',
      },
      {
        path: '/upms/http',
        access: 'canAccess',
        name: 'API资源',
        component: './system/upms/http',
      }
    ],
  },
  {
    path: '/dev',
    access: 'canAccess',
    name: '辅助开发',
    icon: 'experiment',
    routes: [
      {
        path: '/dev/template',
        access: 'canAccess',
        name: '代码模板',
        component: './system/dev/template',
      },
      {
        path: '/dev/generator',
        access: 'canAccess',
        name: '代码生成',
        component: './system/dev/generator',
      }
    ],
  },
  {
    path:'/setting',
    access: 'canAccess',
    name: '全局设置',
    icon: 'setting',
    routes: [
      {
        path: '/setting/dictionary',
        access: 'canAccess',
        name: '字典',
        component: './system/setting/dictionary',
      },
      {
        path: '/setting/config',
        access: 'canAccess',
        name: '配置',
        component: './system/setting/config',
      }
    ],
  },
  {
    path:'/file',
    access: 'canAccess',
    name: '文件管理',
    icon: 'smile',
    component: './system/file/manager'
  },
  {
    path: '/',
    redirect: '/welcome',
  },
  {
    component: './404',
  },
];
