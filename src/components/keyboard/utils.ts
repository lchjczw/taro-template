export const INPUT_REGEXP = {
  /** 省份简称 */
  PROVINCE: 'province',
  /** 字母 */
  ALPHA: 'alpha',
  /** 没有字母O */
  NOT_O: 'not-o'
} as const

export type INPUT_REGEXP_TYPE = typeof INPUT_REGEXP[keyof typeof INPUT_REGEXP]

export const INPUT_VALUE = {
  INPUT_1: 1,
  INPUT_2: 2,
  INPUT_3: 3,
  INPUT_4: 4,
  INPUT_5: 5,
  INPUT_6: 6,
  INPUT_7: 7,
  /** 新能源 */
  NEW_ENERGY: 'new-energy'
} as const

export type INPUT_VALUE_TYPE = typeof INPUT_VALUE[keyof typeof INPUT_VALUE]

export const PROVINCE_DATA = [
  '京', '津', '沪', '渝', '苏', '浙', '豫', '粤', '川', '陕',
  '冀', '辽', '吉', '皖', '闽', '鄂', '湘', '鲁', '晋', '黑',
  '赣', '贵', '甘', '桂', '琼', '云', '青', '蒙', '藏', '宁',
  '新'
] as const

export type PROVINCE_DATA_TYPE = typeof PROVINCE_DATA[number]

export const ALPHANUMERIC_DATA = [
  '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K',
  'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U',
  'V', 'W', 'X', 'Y', 'Z'
] as const

export type ALPHANUMERIC_DATA_TYPE = typeof ALPHANUMERIC_DATA[number]

export const getKeyboardInput = () => ([
  {
    value: '',
    RegExp: INPUT_REGEXP.PROVINCE,
    type: INPUT_VALUE.INPUT_1
  },
  {
    value: '',
    RegExp: INPUT_REGEXP.ALPHA,
    type: INPUT_VALUE.INPUT_2
  },
  {
    value: '',
    RegExp: INPUT_REGEXP.NOT_O,
    type: INPUT_VALUE.INPUT_3
  },
  {
    value: '',
    RegExp: INPUT_REGEXP.NOT_O,
    type: INPUT_VALUE.INPUT_4
  },
  {
    value: '',
    RegExp: INPUT_REGEXP.NOT_O,
    type: INPUT_VALUE.INPUT_5
  },
  {
    value: '',
    RegExp: INPUT_REGEXP.NOT_O,
    type: INPUT_VALUE.INPUT_6
  },
  {
    value: '',
    RegExp: INPUT_REGEXP.NOT_O,
    type: INPUT_VALUE.INPUT_7
  },
  {
    value: '',
    RegExp: INPUT_REGEXP.NOT_O,
    type: INPUT_VALUE.NEW_ENERGY,
    classes: INPUT_VALUE.NEW_ENERGY
  }
])
