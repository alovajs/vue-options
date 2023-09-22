/**
 * 将useHook的返回对象按函数和非函数拆分
 * @param useHookReturns useHook的返回对象
 * @returns 拆分后的对象
 */
export const splitStatesAndFn = (useHookReturns: Record<string, any>) => {
		const states = {} as Record<string, any>,
			fns = {} as Record<string, (...args: any) => any>;
		Object.keys(useHookReturns).forEach(key => {
			const item = useHookReturns[key];
			if (typeof item === 'function') {
				fns[key] = item;
			} else {
				states[key] = item;
			}
		});
		return [states, fns];
	},
	/**
	 * 判断是否为普通对象
	 * @param arg 任意参数
	 * @returns 判断结果
	 */
	isPlainObject = (arg: any): arg is Record<string, any> => Object.prototype.toString.call(arg) === '[object Object]',
	/**
	 * 自定义断言函数，表达式为false时抛出错误
	 * @param expression 判断表达式，true或false
	 * @param msg 断言消息
	 */
	myAssert = (expression: boolean, msg: string) => {
		if (!expression) {
			throw new Error(`[alova]${msg}`);
		}
	};
