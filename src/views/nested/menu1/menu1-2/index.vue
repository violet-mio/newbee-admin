<template>
  <div style="padding: 30px">
    <router-view #default="{ Component }">
      <transition>
        <el-alert :closable="false" title="menu 1-2" type="success">
          <component :is="Component" />
        </el-alert>
      </transition>
    </router-view>
  </div>
</template>
