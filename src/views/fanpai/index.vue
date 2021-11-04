<template>
  <div class="wrapper">
    <div class="actions">
      <button @click="handleFlipAll">全部翻转</button>
      <button @click="handleFlipQueue">依次翻转</button>
    </div>
    <div class="list">
      <div
        v-for="item in listData"
        :key="item.id"
        class="item"
        :ref="`item_${item.id}`"
        :class="{ 'flip': item.flip}"
        @click="item.flip = !item.flip"
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
    const listData = ref([
      {
        id: 1,
        flip: false
      },
      {
        id: 2,
        flip: false
      },
      {
        id: 3,
        flip: false
      },
      {
        id: 4,
        flip: false
      },
      {
        id: 5,
        flip: false
      },
      {
        id: 6,
        flip: false
      },
      {
        id: 7,
        flip: false
      },
      {
        id: 8,
        flip: false
      },
      {
        id: 9,
        flip: false
      }
    ])
    return {
      listData
    }
  },
  methods: {
    // 全部一起翻转
    handleFlipAll () {
      this.listData.forEach(item => (item.flip = !item.flip))
    },
    // 依次翻转
    async handleFlipQueue () {
      for (let i = 0, len = this.listData.length; i < len; i++) {
        await new Promise((resolve) => {
          const node = this.$refs[`item_${this.listData[i].id}`] as HTMLElement
          const fn = function () {
            node.removeEventListener('transitionend', fn)
            resolve(1)
          }
          node.addEventListener('transitionend', fn)
          this.listData[i].flip = !this.listData[i].flip
        })
      }
    }
  }
})
</script>

<style lang="scss" scoped>
.wrapper {
  height: 100%;
  background-color: rgba($color: yellow, $alpha: 0.6);
}
.actions {
  padding: 0 30px;
  height: 80px;
  line-height: 80px;
  button {
    margin: 0 10px;
    padding: 0 10px;
    height: 32px;
    background: cornflowerblue;
    border-radius: 3px;
    border: 0;
    color: #fff;
    cursor: pointer;
  }
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
