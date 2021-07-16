export * from './fetch'
export * from './file'
export * from './render'

const STRING_PROTOTYPE = '[object String]'
const NUMBER_PROTOTYPE = '[object Number]'
const REGEXP_PROTOTYPE = '[object RegExp]'
const DATE_PROTOTYPE = '[object Date]'
const BOOL_PROTOTYPE = '[object Boolean]'
const ARRAY_PROTOTYPE = '[object Array]'
const OBJECT_PROTOTYPE = '[object Object]'
const FUNCTION_PROTOTYPE = '[object Function]'

function protoString(obj: unknown) {
  return Object.prototype.toString.call(obj)
}

export function isString(str: unknown) {
  return protoString(str) === STRING_PROTOTYPE
}

export function isNumber(num: unknown) {
  return protoString(num) === NUMBER_PROTOTYPE
}

export function isRegExp(reg: unknown) {
  return protoString(reg) === REGEXP_PROTOTYPE
}

export function isBool(bool: unknown) {
  return protoString(bool) === BOOL_PROTOTYPE
}

export function isDate(date: unknown) {
  return protoString(date) === DATE_PROTOTYPE
}

export function isArray(arr: unknown) {
  return protoString(arr) === ARRAY_PROTOTYPE
}

export function isObject(obj: unknown) {
  return protoString(obj) === OBJECT_PROTOTYPE
}

export function isFunction(fn: unknown) {
  return protoString(fn) === FUNCTION_PROTOTYPE
}

function _randomStr() {
  return Math.random().toString(36).slice(2)
}

export function randomID() {
  return `${_randomStr}${_randomStr}`
}
