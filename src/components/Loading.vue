<template>
  <transition name="fade">
    <div
      v-show="active"
      :class="{'loader-wrapper': true, 'loader-overlay': overlay}"
    >
      <img src="@/assets/loading.svg">
      <p>{{ $t('loading') }}</p>
    </div>
  </transition>
</template>
<script>
export default {
  props: {
    active: {
      type: Boolean,
      default: false
    },
    overlay: {
      type: Boolean,
      default: false
    }
  }
}
</script>
<style lang="scss">
.loader-overlay {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  padding: 0;
  margin: 0;
}

.loader-wrapper {
  padding: 2em 0;
  opacity: 0.9;
  z-index: 39;
  transition: opacity .3s;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  img {
    width: 3rem;
    height: 3rem;
  }

  p {
    font-size: 1.2rem;
    margin-top: .5em;
  }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
