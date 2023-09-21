import { StatesHook } from 'alova';

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
		// 需要异步执行，在mapAlovaHook中对config注入component和dataKey
		setTimeout(() => {
			const { $, $options } = useHookConfig.component;
			let componentUnmountedFns = [];
			if ($) {
				/* c8 ignore start */
				// vue3，它将在npm run test:vue3中测试到
				// um为生命周期unmounted，它保存在了$中
				// 动态注入生命周期函数，组件卸载时移除对应状态
				componentUnmountedFns = $.um = $.um || [];
				/* c8 ignore stop */
			} else {
				// vue2为destroyed，生命周期保存在了$options中
				const lifecycleContext = $options.__proto__;
				componentUnmountedFns = lifecycleContext.destroyed = lifecycleContext.destroyed || [];
			}
			componentUnmountedFns.push(removeStates);
			immediate && handler();
			let timer: NodeJS.Timeout | void;
			(watchingStates || []).forEach((state, i) => {
				useHookConfig.component.$watch(
					state,
					() => {
						timer && clearTimeout(timer);
						timer = setTimeout(() => {
							handler(i);
							timer = undefined;
						});
					},
					{ deep: true }
				);
			});
		});
	}
} as StatesHook<any, any>;
