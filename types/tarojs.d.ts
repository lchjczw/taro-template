interface SystemInfo extends Taro.getSystemInfoSync.Result {
  hasSafeArea: boolean
  isMobile: boolean
  isPC: boolean
  isIOS: boolean
  isAnd: boolean
}

interface AccountInfo {
  appId: string
  version?: string
  envVersion?: 'develop' | 'trial' | 'release' | 'gray'
}
