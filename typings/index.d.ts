import { StatesHook } from 'alova';

type UseHookCallers = Record<string, [(...args: any[]) => any, ...any[]]>;
type UseHookMapGetter<GR extends UseHookCallers> = (this: Vue, context: Vue) => GR;

type PickFunction<T extends Record<string, any>, U = true> = Pick<
	T,
	{
		[K in keyof T]: T[K] extends (...args: any[]) => any ? (U extends true ? K : never) : U extends false ? K : never;
	}[keyof T]
>;
type FlattenObjectKeys<T extends Record<string, unknown>, K = keyof T> = K extends string
	? T[K] extends Record<string, unknown>
		? `${K}$${FlattenObjectKeys<T[K]>}`
		: K
	: never;

/** vue mixin类型 */
interface VueHookMapperMixin<GR extends UseHookCallers> {
	created(): void;
	data(): {
		[K in keyof GR]: PickFunction<ReturnType<GR[K][0]>, false>;
	} & {
		ALOVA_USE_HOOK_STATES$__: Record<string, any>;
	};
	methods: PickFunction<{
		[K in FlattenObjectKeys<{
			[K in keyof GR]: ReturnType<GR[K][0]>;
		}>]: K extends `${infer P}$${infer S}` ? ReturnType<GR[P][0]>[S] : never;
	}>;
}

/**
 * 将useHook的返回值和操作函数动态映射到vueComponent上
 * @param mapGetter usehook映射函数，它将返回映射的集合
 * @returns vue mixins数组
 */
declare function mapAlovaHook<GR extends UseHookCallers>(mapGetter: UseHookMapGetter<GR>): VueHookMapperMixin<GR>[];

/** vue options statesHook */
declare const VueOptionsStateHook: StatesHook<any, any>;
