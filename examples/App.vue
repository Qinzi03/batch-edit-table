<template>
  <div id="app">
    <batchEditTable
      height="300px"
      :tableData="tableData"
      :propList="propList"
      :notSplitCellPropList="notSplitCellPropList"
      :total="tableData.length"
      :showCheckbox="false"
      @columnIconClick="onIconClick"
    ></batchEditTable>
  </div>
</template>
<script>
import batchEditTable from "../src/batchEditTable";

export default {
  name: "App",
  components: { batchEditTable },
  data() {
    return {
      notSplitCellPropList: ["parentName", "parentAge"],
      propList: [
        { label: "选择", prop: "childCheckbox" },
        { label: "姓名", prop: "parentName", isShowBatchEdit: true },
        { label: "年龄", prop: "parentAge" },
        { label: "孩子姓名", prop: "childName" },
        { label: "孩子年龄", prop: "childAge" }
      ],
      tableData: [
        {
          parentName: 1,
          parentAge: 55,
          children: [
            { childName: 22, childAge: 33 },
            { childName: 25, childAge: 33 },
            { childName: 26, childAge: 33 }
          ]
        }
      ]
    };
  },
  mounted() {},
  methods: {
    onIconClick({ propItem, scope, index }) {
      alert("hello");
    }
  }
};
</script>
<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
