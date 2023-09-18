import { useRequest, useWatcher } from "alova";

const splitStatesAndFn = obj => {
  const states = {}, fns = {};
  Object.keys(obj).forEach(key => {
    const item = obj[key];
    if (typeof item === 'function') {
      fns[key] = item;
    } else {
      states[key] = item;
    }
  });
  return {
    states,
    fns
  };
}
export function wrapOptional(dataKey, useHook, ...args) {
  let config = {};
  if (typeof args[args.length - 1] === 'object') {
    config = args[args.length - 1]
  } else {
    args.push(config);
  }
  return {
    created() {
      // 在VueOptionalHook中，会延迟访问component和dataKey
      config.dataKey = dataKey;
      config.component = this;
      const { states, fns } = splitStatesAndFn(useHook(...args));
      this[dataKey] = states;
      Object.keys(fns).forEach(key => {
        this[dataKey + '$' + key] = function(...args) {
          return fns[key](...args)
        };
      });
    },
    data() {
      return {
        [dataKey]: {}
      }
    }
  }
}


export function useRequestOptional(dataKey, methodHandler, config = {}) {
  return wrapOptional(dataKey, useRequest, methodHandler, config);
}
export function useWatcherOptional(dataKey, methodHandler, watchingStates, config = {}) {
  return wrapOptional(dataKey, useWatcher, methodHandler, watchingStates, config);
}