import { canIUse } from '@tarojs/taro'
import { getSystemInfoSync } from '@/utils'

const compareVersion = (v1: any, v2: any) => {
  v1 = v1.split('.')
  v2 = v2.split('.')
  const len = Math.max(v1.length, v2.length)

  while (v1.length < len) {
    v1.push('0')
  }

  while (v2.length < len) {
    v2.push('0')
  }

  for (let i = 0; i < len; i++) {
    const num1 = parseInt(v1[i], 10)
    const num2 = parseInt(v2[i], 10)

    if (num1 > num2) {
      return 1
    }

    if (num1 < num2) {
      return -1
    }
  }

  return 0
}

export function gte(version: string) {
  const system = getSystemInfoSync()
  return compareVersion(system.SDKVersion, version) >= 0
}

export function canIUseGetUserProfile() {
  return canIUse('getUserProfile')
}

export function canIUseGetUpdateManager() {
  return canIUse('getUpdateManager')
}

export function canIUseGetAccountInfoSync() {
  if (process.env.TARO_ENV === 'alipay') {
    return gte('2.7.17')
  }
  return canIUse('getAccountInfoSync')
}

export function canIUseCreateInterstitialAd() {
  return canIUse('createInterstitialAd')
}

export function canIUseNextTick() {
  return canIUse('nextTick')
}

export function canIUseHideHomeButton() {
  return canIUse('hideHomeButton')
}
