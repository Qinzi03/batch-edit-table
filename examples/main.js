// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import App from "./App";
import ElementUI from "element-ui";
// import "../node_modules/element-ui/packages/theme-chalk/src/index";

import "element-ui/lib/theme-chalk/index.css";
Vue.config.productionTip = false;
Vue.use(ElementUI, {
  size: "mini"
});
/* eslint-disable no-new */
new Vue({
  el: "#app",
  components: { App },
  render: h => h(App)
});
