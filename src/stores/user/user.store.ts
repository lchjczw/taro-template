import extend from 'extend'
import { defineStore } from 'pinia'
import { setStorageSync } from '@tarojs/taro'
import { notNil } from '@txjs/bool'
import { useEvents } from '@/hooks'
import { constants } from '@/utils'
import { getCurrentToken, getUserProfile } from './user.LSD'
import { USERS_ENUM } from './user.enum'

export const useUserStore = defineStore(USERS_ENUM.ID, {
  state: () => ({
    /** 当前登录 TOKEN */
    [USERS_ENUM.USER_TOKEN]: null as string | null,
    /** 用户信息 */
    [USERS_ENUM.USER_INFO]: null as UserInfo | null
  }),

  getters: {
    /**
     * 当前是否用户已经登录
     * * `true` 已登录
     * * `false` 未登录
     */
    hasLogged: (state) => notNil(state[USERS_ENUM.USER_TOKEN]) && notNil(state[USERS_ENUM.USER_INFO])
  },

  actions: {
    writeToken(value: string) {
      try {
        setStorageSync(
          USERS_ENUM.USER_TOKEN,
          value
        )
        this[USERS_ENUM.USER_TOKEN] = value
      } catch (e) {
        useEvents.trigger(
          constants.STORAGE_EVENT,
          {
            eventName: 'store:users:writeToken',
            errorLog: e.toString()
          }
        )
      }
    },

    writeUserProfile(data: Partial<UserInfo>) {
      try {
        const $data = getUserProfile()
        const userProfile = extend(true, $data || {}, data)

        setStorageSync(
          USERS_ENUM.USER_INFO,
          userProfile
        )
        this[USERS_ENUM.USER_INFO] = userProfile
      } catch (e) {
        useEvents.trigger(
          constants.STORAGE_EVENT,
          {
            eventName: 'store:users:writeUserProfile',
            errorLog: e.toString()
          }
        )
      }
    },

    /**
     * 更新用户数据
     */
    updateAll() {
      this[USERS_ENUM.USER_TOKEN] = getCurrentToken()
      this[USERS_ENUM.USER_INFO] = getUserProfile()
    }
  }
})
