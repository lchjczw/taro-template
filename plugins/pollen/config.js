const shared = require('@txjs/shared')
const bool = require('@txjs/bool')
const { defineConfig } = require('pollen-css/utils')

const reg = /([(-?\d)(\.\d)|\d])+(px)/ig

const toRatio = (size) => {
  if (size === 1) {
    return size
  }
  return size * 2
}

const pxToRpx = (value) => {
  const arr = value.match(reg)
  if (arr) {
    return arr.reduce(
      (str, curr) => str.replace(curr, `${toRatio(parseFloat(curr))}${process.env.PIXEL}`), value
    )
  }
  return value
}

const pxTransform = (obj) => {
  const shallowCopy = Object.assign({}, obj)
  if (process.env.PIXEL === 'rpx') {
    for (const key in obj) {
      shallowCopy[key] = pxToRpx(obj[key])
    }
  }
  return shallowCopy
}

module.exports = defineConfig((pollen) => {
  const modules = shared.pick(pollen, [
    'line',
    'ease',
    'easing',
    'weight'
  ])

  modules.color = {
    ...pollen.color,
    white: '#fff',
    black: '#000',
    active: 'var(--color-grey-200)',
    'grey-100': process.env.COLOR_GREY_100,
    'grey-200': process.env.COLOR_GREY_200,
    'grey-300': process.env.COLOR_GREY_300,
    'grey-400': process.env.COLOR_GREY_400,
    'grey-500': process.env.COLOR_GREY_500,
    'grey-600': process.env.COLOR_GREY_600,
    'grey-700': process.env.COLOR_GREY_700,
    'grey-800': process.env.COLOR_GREY_800,
    'grey-900': process.env.COLOR_GREY_900,
    primary: process.env.COLOR_PRIMARY,
    danger: process.env.COLOR_DANGER,
    success: process.env.COLOR_SUCCESS,
    warn: process.env.COLOR_WARN,
    info: process.env.COLOR_INFO,
    text: process.env.COLOR_TEXT,
    'text-base': process.env.COLOR_TEXT_BASE,
    'text-light': process.env.COLOR_TEXT_LIGHT,
    'text-weak': process.env.COLOR_TEXT_WEAK,
    border: process.env.COLOR_BORDER,
    'border-light': process.env.COLOR_BORDER_LIGHT,
    bgcolor: process.env.COLOR_BGCOLOR,
    'bgcolor-light': process.env.COLOR_BGCOLOR_LIGHT
  }

  modules.size = pxTransform({
    ...shared.pick(pollen.size, [
      'px', 14, 16,
      ...Array(12)
        .fill()
        .map((_, index) => index + 1)
    ]),
    xs: '10px',
    sm: 'var(--size-3)',
    md: '14px',
    lg: 'var(--size-4)',
    xl: '18px',
    xxl: 'var(--size-5)'
  })

  modules.opacity = {
    loading: 0.8,
    disabled: 0.5,
    active: 0.7
  }

  modules.duration = {
    fast: '0.2s',
    slow: '0.3s',
    turtle: '0.5s',
  }

  modules.padding = pxTransform({
    xs: 'var(--size-xs)',
    sm: 'var(--size-3)',
    md: 'var(--size-md)',
    lg: 'var(--size-4)',
    xl: 'var(--size-xl)',
    xxl: 'var(--size-5)',
    6: '22px',
    7: 'var(--size-6)',
    8: '26px',
    9: 'var(--size-7)',
    10: '30px',
    11: 'var(--size-8)',
    12: '34px'
  })

  modules.radius = pxTransform({
    ...pollen.radius,
    sm: '4px',
    md: '6px',
    lg: '8px',
    xl: '12px',
    xxl: '16px'
  })

  modules.shadow = pxTransform(
    pollen.shadow
  )

  modules.elevation = pxTransform(
    pollen.elevation
  )

  for (const key in pollen) {
    if (bool.isNil(modules[key])) {
      modules[key] = false
    }
  }

  return {
    modules,
    selector: 'page',
    output: 'dist/pollen/vars.css',
    media: {
      '(prefers-color-scheme: dark)': {}
    }
  }
})
