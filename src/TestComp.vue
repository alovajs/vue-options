<template>
  <div>
    <div>
      <span v-if="testRequest.loading">加载中...</span>
      <span v-else-if="testRequest.error">{{ testRequest.error.message }}</span>
      <div v-else>
        <span
          v-for="item in testRequest.data"
          :key="item"
          :style="{ marginRight: '10px' }">
          {{ item }}
        </span>
      </div>
      <div>
        <button @click="testRequest$send">重新请求</button>
        <button @click="testRequest$abort">中断</button>
      </div>
    </div>

    <div>
      <span v-if="testWatcher.loading">加载中...</span>
      <span v-else-if="testWatcher.error">{{ testWatcher.error.message }}</span>
      <div v-else>
        <span
          v-for="item in testWatcher.data"
          :key="item"
          :style="{ marginRight: '10px' }">
          {{ item }}
        </span>
      </div>
      <div>
        <button @click="testWatcher$send">重新请求</button>
        <button @click="changeState1">改变状态1 {{ state1 }}</button>
        <button @click="changeState2">改变状态2 {{ state2 }}</button>
      </div>
    </div>

    <!-- <span v-if="uploadingFile">上传中</span>
    <span>{{ uploading }}</span>
    <span>{{ res }}</span> -->
  </div>
</template>

<script>
import { getData } from './api.js';
import { useRequestOptional, useWatcherOptional, wrapOptional } from './optionalHook';

export default {
  mixins: [
    useRequestOptional('testRequest', getData, {
      // immediate: false
    }),
    useWatcherOptional('testWatcher', getData, ['state1', 'state2'], {
      debounce: [0, 1000]
    })
  ],
  // mixins: [wrapOptional('testRequest', useRequest, getData)],
  data() {
    return {
      state1: 1,
      state2: 1
    };
  },
  mounted() {
    this.testRequest$onSuccess(event => {
      console.log('testRequest', event);
    });
    this.testWatcher$onSuccess(event => {
      console.log('testWatcher', event);
    });
  },
  unmounted() {
    console.log('unmounted');
  },
  destroyed() {
    console.log('destroyed');
  },
  methods: {
    changeState1() {
      this.state1++;
    },
    changeState2() {
      this.state2++;
    }
  }
}
</script>

<style>
#app {
  padding: 10px;
}
</style>
