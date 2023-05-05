import { getStorageSync } from '@tarojs/taro'
import { USERS_ENUM } from './user.enum'

export const getCurrentToken = () => {
  try {
    const value = getStorageSync(
      USERS_ENUM.USER_TOKEN
    )

    if (value == '') {
      throw new Error('token is empty')
    }

    return value as string
  } catch {
    return null
  }
}

export const getUserProfile = () => {
  try {
    const value = getStorageSync(
      USERS_ENUM.USER_IFNO
    )

    if (value == '') {
      throw new Error('user profile is empty')
    }

    return value as UserInfo
  } catch {
    return null
  }
}
