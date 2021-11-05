<template>
  <div class="wrapper">
    <div class="actions">
      <button @click="handleFlipAll">全部翻转</button>
      <button @click="handleFlipQueue">依次翻转</button>
      <button @click="handleShuffle">洗牌</button>
      <button @click="handleShuffleQueue">依次洗牌</button>
      <p class="tip">* 所有的操作都做了排斥处理，即一个操作正在进行的时候，是无法进行其他操作的。</p>
    </div>
    <div class="list">
      <div
        v-for="item in listData"
        :key="item.id"
        class="item"
        :ref="`item_${item.id}`"
        @click="handleFlipCurrent(item)"
      >
        <div class="stick front" />
        <div class="stick back" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

type Item = { id: number, fliped: boolean}

export default defineComponent({
  setup () {
    const listData = ref([
      {
        id: 1,
        fliped: false
      },
      {
        id: 2,
        fliped: false
      },
      {
        id: 3,
        fliped: false
      },
      {
        id: 4,
        fliped: false
      },
      {
        id: 5,
        fliped: false
      },
      {
        id: 6,
        fliped: false
      },
      {
        id: 7,
        fliped: false
      },
      {
        id: 8,
        fliped: false
      },
      {
        id: 9,
        fliped: false
      }
    ])
    const animating = ref(false)
    return {
      listData,
      animating
    }
  },
  methods: {
    handleReset (item: Item, node: HTMLElement) {
      if (item.fliped) {
        node.style.transform = 'rotateY(0deg)'
        item.fliped = false
      } else {
        node.style.transform = 'rotateY(180deg)'
        item.fliped = true
      }
    },
    // 翻转一个
    handleFlipCurrent (item: Item) {
      if (this.animating) return
      this.animating = true
      const node = this.$refs[`item_${item.id}`] as HTMLElement
      const fn = () => {
        node.removeEventListener('transitionend', fn)
        this.animating = false
      }
      node.addEventListener('transitionend', fn)
      this.handleReset(item, node)
    },
    // 全部一起翻转
    handleFlipAll () {
      if (this.animating) return
      this.animating = true
      for (let i = 0, len = this.listData.length; i < len; i++) {
        const node = this.$refs[`item_${this.listData[i].id}`] as HTMLElement
        if (i === 0) {
          const fn = () => {
            node.removeEventListener('transitionend', fn)
            this.animating = false
          }
          node.addEventListener('transitionend', fn)
        }
        this.handleReset(this.listData[i], node)
      }
    },
    // 依次翻转
    async handleFlipQueue () {
      if (this.animating) return
      this.animating = true
      for (let i = 0, len = this.listData.length; i < len; i++) {
        await new Promise((resolve) => {
          const node = this.$refs[`item_${this.listData[i].id}`] as HTMLElement
          const fn = () => {
            node.removeEventListener('transitionend', fn)
            resolve(1)
            if (i === len - 1) {
              this.animating = false
            }
          }
          node.addEventListener('transitionend', fn)
          this.handleReset(this.listData[i], node)
        })
      }
    },
    // 一起洗牌（推荐）
    async handleShuffle () {
      if (this.animating) return
      this.animating = true
      const flipData = this.listData.filter(item => item.fliped !== false)
      if (flipData.length) {
        // 保证所有的卡牌翻转回初始状态
        flipData.forEach(item => (item.fliped = false))
        const node = this.$refs[`item_${flipData[0].id}`] as HTMLElement
        await new Promise((resolve) => {
          const fn = function () {
            node.removeEventListener('transitionend', fn)
            resolve(1)
          }
          node.addEventListener('transitionend', fn)
        })
      }
      // 之后将所有的卡牌进行收缩
      for (let i = 0, len = this.listData.length; i < len; i++) {
        if (i === 4) continue
        const node = this.$refs[`item_${this.listData[i].id}`] as HTMLElement
        // 计算每个卡片 x 和 y 偏移量
        const x = 220 - (i % 3) * 220
        const y = 280 - ~~(i / 3) * 280
        node.style.transform = `translate3d(${x}px, ${y}px, 0)`
      }
      // 等待收缩完毕
      await new Promise((resolve) => {
        const node = this.$refs[`item_${this.listData[0].id}`] as HTMLElement
        const fn = function () {
          node.removeEventListener('transitionend', fn)
          setTimeout(() => {
            resolve(1)
          }, 200)
        }
        node.addEventListener('transitionend', fn)
      })
      // 进行释放
      for (let i = 0, len = this.listData.length; i < len; i++) {
        if (i === 4) continue
        const node = this.$refs[`item_${this.listData[i].id}`] as HTMLElement
        if (i === 0) {
          const fn = () => {
            node.removeEventListener('transitionend', fn)
            this.animating = false
          }
          node.addEventListener('transitionend', fn)
        }
        node.style.transform = 'translate3d(0, 0, 0)'
      }
    },
    // 依次洗牌
    async handleShuffleQueue () {
      if (this.animating) return
      this.animating = true
      const flipData = this.listData.filter(item => item.fliped !== false)
      if (flipData.length) {
        // 保证所有的卡牌翻转回初始状态
        flipData.forEach(item => (item.fliped = false))
        const node = this.$refs[`item_${flipData[0].id}`] as HTMLElement
        await new Promise((resolve) => {
          const fn = function () {
            node.removeEventListener('transitionend', fn)
            resolve(1)
          }
          node.addEventListener('transitionend', fn)
        })
      }
      for (let i = 0, len = this.listData.length; i < len; i++) {
        if (i === 4) continue
        await new Promise((resolve) => {
          const node = this.$refs[`item_${this.listData[i].id}`] as HTMLElement
          const fn = function () {
            node.removeEventListener('transitionend', fn)
            node.style.transitionDuration = '0.6s'
            resolve(1)
          }
          node.addEventListener('transitionend', fn)
          // 计算每个卡片 x 和 y 偏移量
          const x = 220 - (i % 3) * 220
          const y = 280 - ~~(i / 3) * 280
          node.style.transitionDuration = '0.2s'
          node.style.transform = `translate3d(${x}px, ${y}px, 0)`
        })
      }
      for (let i = 0, len = this.listData.length; i < len; i++) {
        if (i === 4) continue
        await new Promise((resolve) => {
          const node = this.$refs[`item_${this.listData[i].id}`] as HTMLElement
          const fn = () => {
            node.removeEventListener('transitionend', fn)
            node.style.transitionDuration = '0.6s'
            resolve(1)
            if (i === len - 1) {
              this.animating = false
            }
          }
          node.addEventListener('transitionend', fn)
          node.style.transitionDuration = '0.2s'
          node.style.transform = 'translate3d(0, 0, 0)'
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
  position: relative;
  padding: 0 30px 20px;
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
.tip {
  position: absolute;
  top: 66px;
  left: 40px;
  margin: 0;
  font-size: 12px;
  line-height: 1;
  color: #999;
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
  transition: transform 0.6s ease-in-out;
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
</style>
