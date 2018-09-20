Object.assign = function(target, sources) {
  if (__DEV__) {
    if (target == null) {
      throw new TypeError('Object.assign target cannot be null or undefined')
    }
    if (typeof target !== 'object' && typeof target !== 'function') {
      throw new TypeError(
        'This error is a performance optimization and not spec compliant.'
      )
    }
  }
  for (var nextIndex = 1; nextIndex < arguments.length; nextIndex++) {
    var nextSource = arguments[nextIndex]
    if (nextSource == null) {
      continue
    }
    if (__DEV__) {
      if (typeof nextSource !== 'object' && typeof nextSource !== 'function') {
        throw new TypeError(
          'In this environment the sources for assign MUST be an object. ' +
            'This error is a performance optimization and not spec compliant.'
        )
      }
    }
    var keys = Object.keys(nextSource)
    for (var i = 0, il = keys.length; i < il; i++) {
      var key = keys[i]
      target[key] = nextSource[key]
    }
  }
  return target
}
