export default [
  {
    name: 'home',
    title: '主页',
    path: '/pages/home/index'
  },
  {
    name: 'subpackages',
    children: [
      {
        name: 'login',
        title: '登录',
        path: '/login/index',
        requiresAuth: false
      }
    ]
  }
]
