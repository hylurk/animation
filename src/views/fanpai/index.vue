<template>
  <div class="wrapper">
    <div class="actions">
      <button @click="handleFlipAll">全部翻转</button>
    </div>
    <div class="list">
      <div
        v-for="(item, index) in Array(9).keys()"
        :key="index"
        class="item"
        :class="{ 'flip': flip}"
        @click="flip = !flip"
      >
        <div class="stick front" />
        <div class="stick back" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  setup () {
    const flip = ref(false)
    return {
      flip
    }
  },
  methods: {
    handleFlipAll () {
      this.flip = !this.flip
    }
  }
})
</script>

<style lang="scss" scoped>
.wrapper {
  height: 100%;
  background-color: rgba($color: yellow, $alpha: 0.6);
}
.list {
  display: flex;
  flex-wrap: wrap;
  width: 640px;
  margin: auto;
}
.item {
  width: 200px;
  height: 260px;
  position: relative;
  transform-style: preserve-3d; // 开启3D透视
  transition: transform 1s ease-in-out;
  margin-right: 20px;
  margin-bottom: 20px;
  &:nth-of-type(3n) {
    margin-right: 0;
  }
}
.stick {
  position: absolute; // 绝对定位，两张图片要重叠在一块
  left: 0;
  top: 0;
  backface-visibility: hidden; // 隐藏div背后的显示
  background-position: center center;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  width: 100%;
  height: 100%;
}
.front {
  background-image: url('images/hb.png');
  background-size: 100%;
}
.back {
  background-image: url('images/money.png');
  background-size: 100%;
  transform: rotateY(180deg); // 反面的图片要翻转过来，这样在翻转到部分的时候就能看到背面的图片
}
.flip {
  transform: rotateY(180deg); // 点击容器，翻转图片
}
</style>
