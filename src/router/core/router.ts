import { isArray, isNil, notNil } from '@txjs/bool'
import { useUserStore } from '@/stores'

interface BaseRouteMeta {
  title: string
  name: string
  path: string
  query?: Record<string, any>
  roles?: string[]
  requiresAuth?: boolean
}

export interface RouteMeta extends BaseRouteMeta {
  children?: RouteMeta[]
  beforeEnter?: (
    payload: {
      query: Record<string, any>,
      options: BaseRouteMeta
    }
  ) => BaseRouteMeta
  shareMessage?: (
    options: Taro.ShareAppMessageObject
  ) => Taro.ShareAppMessageReturn
}

export class Router<T extends readonly any[]> {
  private routes: Omit<RouteMeta, 'children'>[]
  private names: Record<string, Readonly<RouteMeta>> = {}
  private paths: Record<string, Readonly<RouteMeta>> = {}

  constructor(private readonly sourceRoutes: T) {
    this.routes = this.flat(this.sourceRoutes)
    this.init()
  }

  private init() {
    this.routes.forEach((route) => {
      this.names[route.name] = route
      this.paths[route.path] = route
    })
  }

  private flat(routes: T, parent?: RouteMeta) {
    return routes.reduce((list, curr) => {
      if (isArray(curr.children)) {
        list.push(...this.flat(curr.children, curr))
      } else {
        if (notNil(parent)) {
          curr.path = `/${parent.name}${curr.path}`
        }
        list.push(curr)
      }
      return list
    }, [] as Omit<RouteMeta, 'children'>[])
  }

  /**
   * 路由权限
   */
  getRoutePermission(name: string): number {
    const meta = this.getRouteByMeta(name)

    // 路由不存在
    if (isNil(meta)) {
      return 404
    }

    const usersStore = useUserStore()

    // 需要登录，且未登录
    if ((meta.requiresAuth || isNil(meta.requiresAuth)) && !usersStore.hasLogged) {
      return 401
    }

    return 200
  }

  /**
   * 路由配置
   */
  getRouteByMeta(name: string): RouteMeta | undefined {
    if (name in this.names) {
      return this.names[name]
    }

    const index = name.indexOf('/')

    // 排除不存在的路由
    if (index === -1) {
      return
    }

    if (index > 0) {
      name = `/${name}`
    }

    if (name in this.paths) {
      return this.paths[name]
    }
  }
}
