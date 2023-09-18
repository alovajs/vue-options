export default {
  create: data => data,
  export: state => state,
  dehydrate: (_, key, { c: useHookConfig }) => useHookConfig.component[useHookConfig.dataKey][key],
  update: (newVal, _, { c: useHookConfig }) => {
    Object.keys(newVal).forEach(key => {
      useHookConfig.component[useHookConfig.dataKey][key] = newVal[key];
    });
  },
  effectRequest({ handler, removeStates, immediate, watchingStates }, { c: useHookConfig }) {
    const { $, $options } = useHookConfig.component;
    let componentUnmountedFns = [];
    if ($) {
      // vue3为um，生命周期保存在了$中
      // 动态注入生命周期函数，组件卸载时移除对应状态
      componentUnmountedFns = $.um = $.um || [];
    } else {
      // vue2为destroyed，生命周期保存在了$options中
      const lifecycleContext = $options.__proto__;
      componentUnmountedFns = lifecycleContext.destroyed = lifecycleContext.destroyed || [];
    }
    componentUnmountedFns.push(removeStates);
    immediate && handler();
    let timer;
    (watchingStates || []).forEach((state, i) => {
      useHookConfig.component.$watch(state, () => {
        timer && clearTimeout(timer);
        timer = setTimeout(() => {
          handler(i);
          timer = undefined;
        });
      }, { deep: true });
    });
  }
}