<template>
  <section class="app-main">
    <router-view :key="key" #default="{ Component }">
      <transition appear name="fade-transform" mode="out-in">
        <keep-alive :include="cachedViews">
          <component :is="Component" />
        </keep-alive>
      </transition>
    </router-view>
  </section>
</template>

<script>
import { computed, defineComponent } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
export default defineComponent({
  name: "AppMain",
  setup() {
    const route = useRoute;
    const store = useStore()
    const key = computed(() => route.path)
    const cachedViews = computed(() => store.state.tagsView.cachedViews)

    return {
      key,
      cachedViews
    };
  }
});
</script>
<style lang="scss" scoped>
  .app-main {
    /* 50= navbar  50  */
    min-height: calc(100vh - 50px);
    width: 100%;
    position: relative;
    overflow: hidden;
  }
  
  .fixed-header + .app-main {
    padding-top: 50px;
  }
  
  .hasTagsView {
    .app-main {
      /* 84 = navbar + tags-view = 50 + 34 */
      min-height: calc(100vh - 84px);
    }
  
    .fixed-header + .app-main {
      padding-top: 84px;
    }
  }
  </style>
  
  <style lang="scss">
  // fix css style bug in open el-dialog
  .el-popup-parent--hidden {
    .fixed-header {
      padding-right: 15px;
    }
  }
  </style>
  