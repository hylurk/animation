<template>
  <div id="nav">
    <router-link to="/fanpai">
      <h5>翻牌</h5>
      <img src="~@/views/guide/images/fanpai.gif" />
    </router-link>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Guide'
})
</script>

<style lang="scss" scoped>
#nav {
  padding: 30px;
  a {
    display: inline-block;
    text-align: center;
    text-decoration: none;
  }
  h5 {
    margin: 0;
    font-size: 18px;
    line-height: 32px;
  }
  img {
    width: 160px;
  }
}
</style>
