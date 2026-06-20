<template>
  <div class="app-logo" :style="{ width: width }">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
      <g transform="scale(5.12)">
        <path
            fill="currentColor"
            d="m31.4 35.6-19.3 19.3c-1.1 1.1-1.1 3 0 4.1l.6.6c1.1 1.1 3 1.1 4.1 0l31.1-31.1c1.1-1.1 3-1.1 4.1 0l.6.6c1.1 1.1 1.1 3 0 4.1l-24.2 24.2c-1.1 1.1-1.1 3 0 4.1l.6.6c1.1 1.1 3 1.1 4.1 0l28.9-28.8c1.1-1.1 3-1.1 4.1 0l.6.6c1.1 1.1 1.1 3 0 4.1l-45.2 45.2c-1.1 1.1-1.1 3 0 4.1l.6.6c1.1 1.1 3 1.1 4.1 0l50-50c1.1-1.1 3-1.1 4.1 0l.6.6c1.1 1.1 1.1 3 0 4.1l-40.6 40.6c-1.1 1.1-1.1 3 0 4.1l.6.6c1.1 1.1 3 1.1 4.1 0l33.7-28.7c1.5-1.3 3.5.9 2.1 2.3l-7.6 7.6c-1.1 1.1-1.1 3 0 4.1l11.8 11.8c1.8 1.8 5 .5 5-2.1v-70c0-1.6-1.3-2.9-2.9-2.9h-70.1c-2.6 0-3.9 3.1-2.1 5l16.5 16.5c1.2 1.1 1.2 2.9 0 4.1z"
        />
      </g>
    </svg>
  </div>
</template>

<script setup>
defineProps({
  width: {
    type: String,
    default: '180px'
  }
});
</script>

<style scoped>
.app-logo {
  display: inline-block;
  line-height: 0;
}

svg {
  width: 100%;
  height: auto;
  display: block;
}
</style>