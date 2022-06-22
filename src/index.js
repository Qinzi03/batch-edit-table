import batchEditTable from "./batchEditTable.vue";

batchEditTable.install = Vue =>
  Vue.component(batchEditTable.name, batchEditTable); // 给组件配置install方法

export default batchEditTable;
