export var B = { 'l': 1 }

export var D = (v) => {
  Object.assign(B, v)
}

export var C = () => {
  return B
}
