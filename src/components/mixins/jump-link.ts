import type { PropType } from 'vue'
import type { Interceptor } from '@txjs/shared'

import { getCurrentPages } from '@tarojs/taro'
import { isString, isFunction } from '@txjs/bool'
import { jump } from '@/router'

type LinkQuery = string | Record<string, any>

type LinkType = 'navigateTo' | 'reLaunch' | 'redirectTo' | 'switchTab'

export const jumpLinkSharedProps = {
  url: String,
  linkQuery: [String, Object] as PropType<LinkQuery>,
  linkType: String as PropType<LinkType>,
  linkBefore: Function as PropType<Interceptor>
}

const jumpLinkImplement = (
  path: string,
  query?: LinkQuery,
  interceptor?: Interceptor,
  linkType: LinkType = 'navigateTo'
) => {
  if (path) {
    if (linkType === 'navigateTo' && getCurrentPages().length > 9) {
      linkType = 'redirectTo'
    }

    switch (linkType) {
      case 'reLaunch':
      case 'switchTab':
      case 'navigateTo':
      case 'redirectTo':
        jump[linkType]({
          path,
          query,
          beforeEnter: interceptor
        })
        break
    }
  }
}

export const jumpLink = (
  url: string,
  query?: LinkQuery,
  linkType?: LinkType | Interceptor,
  interceptor?: Interceptor
) => {
  if (isFunction(linkType)) {
    interceptor = linkType
  }

  jumpLinkImplement(
    url,
    query,
    interceptor,
    isString(linkType) ? linkType : undefined
  )
}
