import mapWatcher from '../src/mapWatcher';

describe('mapWatcher', () => {
	test('single watch with handler', () => {
		const fn1 = () => {},
			fn2 = () => {};
		let watchers = mapWatcher({
			testRequest: {
				loading: fn1,
				data: fn2
			}
		});
		expect(watchers).toStrictEqual({
			'alovaHook$.testRequest.loading': fn1,
			'alovaHook$.testRequest.data': fn2
		});

		watchers = mapWatcher({
			'testRequest.loading': fn1,
			'testRequest.data': fn2
		});
		expect(watchers).toStrictEqual({
			'alovaHook$.testRequest.loading': fn1,
			'alovaHook$.testRequest.data': fn2
		});
	});

	test('single watch with detail object', () => {
		const obj1 = {
				handler() {},
				deep: true
			},
			obj2 = {
				handler() {}
			};
		let watchers = mapWatcher({
			testRequest: {
				loading: obj1,
				data: obj2
			}
		});
		expect(watchers).toStrictEqual({
			'alovaHook$.testRequest.loading': obj1,
			'alovaHook$.testRequest.data': obj2
		});

		watchers = mapWatcher({
			'testRequest.loading': obj1,
			'testRequest.data': obj2
		});
		expect(watchers).toStrictEqual({
			'alovaHook$.testRequest.loading': obj1,
			'alovaHook$.testRequest.data': obj2
		});
	});

	test('batch watch', () => {
		const fn1 = () => {},
			fn2 = () => {};
		let watchers = mapWatcher({
			'testRequest, testRequest2': {
				loading: fn1,
				data: fn2
			}
		});
		expect(watchers).toStrictEqual({
			'alovaHook$.testRequest.loading': fn1,
			'alovaHook$.testRequest.data': fn2,
			'alovaHook$.testRequest2.loading': fn1,
			'alovaHook$.testRequest2.data': fn2
		});

		watchers = mapWatcher({
			'testRequest.loading, testRequest.data': fn1
		});
		expect(watchers).toStrictEqual({
			'alovaHook$.testRequest.loading': fn1,
			'alovaHook$.testRequest.data': fn1
		});

		watchers = mapWatcher({
			'testRequest, testRequest2': {
				'loading, data': fn1
			}
		});
		expect(watchers).toStrictEqual({
			'alovaHook$.testRequest.loading': fn1,
			'alovaHook$.testRequest.data': fn1,
			'alovaHook$.testRequest2.loading': fn1,
			'alovaHook$.testRequest2.data': fn1
		});
	});

	test('batch watch with detail oject', () => {
		const obj1 = {
				handler() {},
				deep: true
			},
			obj2 = {
				handler() {}
			};
		let watchers = mapWatcher({
			'testRequest, testRequest2': {
				loading: obj1,
				data: obj2
			}
		});
		expect(watchers).toStrictEqual({
			'alovaHook$.testRequest.loading': obj1,
			'alovaHook$.testRequest.data': obj2,
			'alovaHook$.testRequest2.loading': obj1,
			'alovaHook$.testRequest2.data': obj2
		});

		watchers = mapWatcher({
			'testRequest.loading, testRequest.data': obj1
		});
		expect(watchers).toStrictEqual({
			'alovaHook$.testRequest.loading': obj1,
			'alovaHook$.testRequest.data': obj1
		});

		watchers = mapWatcher({
			'testRequest, testRequest2': {
				'loading, data': obj1
			}
		});
		expect(watchers).toStrictEqual({
			'alovaHook$.testRequest.loading': obj1,
			'alovaHook$.testRequest.data': obj1,
			'alovaHook$.testRequest2.loading': obj1,
			'alovaHook$.testRequest2.data': obj1
		});
	});
});
