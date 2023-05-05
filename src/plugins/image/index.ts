import extend from 'extend'
import { camelize } from '@/utils'

const generateName = (value: string) => value
  .replace(/^\.\//g, '')
  .replace(/\.(png|jpe?g|gif)$/gi, '')
  .replace(/\//g, '-')

const generateFiles = (get: __WebpackModuleApi.RequireContext) => get
  .keys()
  .filter(
    (name) => !/exclude/g.test(name)
  )
  .reduce(
    (ret, name) => {
      ret[camelize(generateName(name))] = get(name)
      return ret
    }, {} as Record<string, string>
  )

const images = {} as Record<string, string>

// 公共图片资源
try {
  const assets = require.context('@/assets', false, /[a-z0-9]+\.(png|jpe?g|gif)$/i)
  extend(images, generateFiles(assets))
} catch (e) {
  console.log(e.message)
}

// 指定小程序图片资源
try {
  const assets = require.context(`@/assets/${process.env.TARO_ENV}`, true, /[a-z0-9]+\.(png|jpe?g|gif)$/i)
  extend(images, generateFiles(assets))
} catch (e) {
  console.log(e.message)
}

/**
 * 返回指定图片引用路径
 */
export const getImage = (fileName: string) => images[camelize(fileName)]
