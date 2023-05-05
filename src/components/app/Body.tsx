import { Result } from '../result'
import { APP_KEY } from './App'

import { isNil } from '@txjs/bool'
import { defineComponent, inject } from 'vue'

export default defineComponent({
  setup(_, { slots }) {
    const app = inject(APP_KEY)

    if (isNil(app)) {
      return
    }

    return () => {
      const { props, status } = app
      return (
        <view class={app.bem({ inset: props.inset })}>
          {status.value ? (
            <Result
              status={status.value}
              refresh={props.refresh}
            />
          ) : slots.default?.()}
        </view>
      )
    }
  }
})
