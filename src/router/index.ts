import routes from './routes'
import { Router, type RouteMeta } from './core/router'
import { Jump } from './core/jump'
import { useJumpLogin } from '@/hooks'

export * from './utils'

/**
 * 路由跳转方法
 */
export const router = new Router(routes)

/**
 * 链接跳转方法
 */
export const jump = new Jump()

jump.beforeEnter((meta: RouteMeta) => {
  const code = router.getRoutePermission(meta.path)

  if (code === 401) {
    useJumpLogin(meta.path, meta.query)
  }

  return code === 200
})
