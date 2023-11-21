<template>
	<div>
		<span role="loading">{{ testRequest.loading ? 'loading' : 'loaded' }}</span>
		<span role="error">{{ testRequest.error ? testRequest.error.message : '' }}</span>
		<div role="data">{{ JSON.stringify(testRequest.data) }}</div>
		<button
			@click="testRequest$send"
			role="btnSend">
			send
		</button>
		<span role="extraData">{{ testRequest.extraData }}</span>
	</div>
</template>

<script>
import { useRequest } from 'alova';
import { mapAlovaHook } from '../../src';

export default {
	props: {
		method: {
			type: Object,
			required: true
		},
		immediate: {
			type: Boolean,
			default: true
		}
	},
	mixins: mapAlovaHook(function () {
		return {
			testRequest: useRequest(this.method, {
				immediate: this.immediate,
				initialData: {},
				managedStates: {
					extraData: 1
				}
			})
		};
	}),
	emits: ['success', 'error', 'complete'],
	created() {
		this.testRequest$onSuccess(event => {
			this.$emit('success', event);
		});
		this.testRequest$onError(event => {
			this.$emit('error', event);
		});
	},
	mounted() {
		this.testRequest$onComplete(event => {
			this.$emit('complete', event);
		});
	}
};
</script>
