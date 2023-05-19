import { getStorageSync } from '@tarojs/taro'
import { USERS_ENUM } from './user.enum'

export const getCurrentToken = () => {
  try {
    const value = getStorageSync(
      USERS_ENUM.USER_TOKEN
    )

    if (value == '') {
      throw new Error('stores:user token is empty')
    }

    return value as string
  } catch {
    return null
  }
}

export const getUserProfile = () => {
  try {
    const value = getStorageSync(
      USERS_ENUM.USER_INFO
    )

    if (value == '') {
      throw new Error('stores:user user profile is empty')
    }

    return value as UserInfo
  } catch {
    return null
  }
}
