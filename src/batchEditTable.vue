<template>
  <div>
    <el-table
      ref="table"
      v-loading="isLoading"
      :data="tableData"
      stripe
      highlight-current-row
      border
      v-bind="$attrs"
      cell-class-name="table__cell"
      v-on="$listeners"
    >
      <el-table-column v-if="showCheckbox" type="selection" align="center">
      </el-table-column>
      <el-table-column
        v-if="showIndex"
        type="index"
        label="序号"
        align="center"
      >
      </el-table-column>

      <template v-for="item in propList">
        <el-table-column
          :key="item.prop"
          align="center"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          :min-width="item['min-width']"
          :fixed="item.fixed"
          :sortable="item.sortable ? 'custom' : false"
          :filters="item.filters"
          :column-key="item.columnKey"
          :show-overflow-tooltip="item.prop !== 'childCheckbox'"
        >
          <template #header="scope">
            <slot
              v-if="$slots[`${item.prop}Header`]"
              :scope="scope"
              :name="`${item.prop}Header`"
            >
            </slot>
            <template v-else>
              <span v-if="item.prop === 'childCheckbox'">
                <el-checkbox
                  v-model="isCheckAll"
                  :indeterminate="isIndeterminate"
                  @change="changeSelectAllChildHandle"
                ></el-checkbox>
              </span>
              <template v-else>
                {{ item.label }}
              </template>
            </template>
          </template>
          <template slot-scope="scope">
            <!-- 父级数据展示 -->
            <template v-if="notSplitCellPropList.includes(item.prop)">
              <div class="flex-box">
                <slot v-if="$slots[item.prop]" :scope="scope" :name="item.prop">
                </slot>
                <div v-else class="cellText">{{ scope.row[item.prop] }}</div>

                <i
                  v-if="item.isShowBatchEdit"
                  :key="item.prop"
                  class="el-icon-edit-outline table-icon"
                  @click="onHandleColumn(item, scope)"
                ></i>
              </div>
            </template>
            <!-- 子级数据展示cell拆分 -->
            <template v-else>
              <div
                v-for="(itemChild, index) in scope.row[childName]"
                :key="index"
                class="flex-box self-cell"
              >
                <slot
                  v-if="$slots[item.prop]"
                  :scope="{
                    row: itemChild,
                    $index: scope.$index,
                    parentRow: scope.row
                  }"
                  :index="index"
                  :name="item.prop"
                >
                </slot>
                <template v-else>
                  <el-checkbox
                    v-if="item.prop === 'childCheckbox'"
                    :value="childChecked.includes(itemChild.childIndexBySys)"
                    @change="changeCheckChildHandle(itemChild)"
                  ></el-checkbox>
                  <template v-else-if="notHasSelfSlot(item.prop)">
                    <div class="cellText">{{ itemChild[item.prop] }}</div>
                  </template>
                </template>
                <i
                  v-if="isShowBatchEdit(item, itemChild, index)"
                  :key="item.prop"
                  class="el-icon-edit-outline table-icon"
                  @click="onHandleColumn(item, scope, index)"
                ></i>
              </div>
            </template>
          </template>
        </el-table-column>
      </template>
      <el-table-column v-if="showOperate" label="操作" align="center">
        <slot></slot>
      </el-table-column>
    </el-table>
    <div v-show="showPagination" class="footer">
      <el-pagination
        :current-page.sync="paginationConf.pageNum"
        :page-size.sync="paginationConf.pageSize"
        :total="total"
        :page-sizes="paginationConf.pageSizes"
        :layout="paginationConf.layout"
        background
        @size-change="onSizeChange"
        @current-change="onCurrentChange"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
export default {
  name: "batchEditTable",
  props: {
    showIndex: {
      // 默认展示序号
      type: Boolean,
      default: true
    },
    showCheckbox: {
      // 默认展示选择框
      type: Boolean,
      default: true
    },
    showOperate: {
      // 默认不展示操作列
      type: Boolean,
      default: false
    },
    showPagination: {
      // 默认展示分页
      type: Boolean,
      default: true
    },
    showChildCheckbox: {
      // 根据子集列展示选择框
      type: Boolean,
      default: false
    },
    propList: {
      // 列属性
      type: Array,
      default: () => []
    },
    tableData: {
      // 表格数据
      type: Array,
      default: () => []
    },
    total: {
      // 表格数据
      type: Number,
      default: 0
    },
    notSplitCellPropList: {
      // 展示完整单元格 不拆分
      type: Array,
      default: () => []
    },
    childName: {
      // 子数据名下所有list会进行拆分
      type: String,
      default: "children"
    },
    isLoading: {
      type: Boolean,
      default: false
    },
    paginationConfig: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      childChecked: [], // 子列表选中值
      allChildIndex: [], // 所有的子序号值
      childMultipleSelection: [], // 选中值
      initAllSeletion: [], // 所有的选中值
      isCheckAll: false, // 是否全选
      paginationConf: {
        pageSize: 25,
        pageNum: 1,
        layout: "total, sizes, prev, pager, next",
        pageSizes: [10, 25, 50, 100]
      }
    };
  },
  computed: {
    isIndeterminate() {
      return (
        this.childChecked.length > 0 &&
        this.childChecked.length < this.allChildIndex.length
      );
    }
  },
  watch: {
    tableData: {
      immediate: true,
      deep: true,
      handler() {
        this.addChildIndex();
      }
    },
    paginationConfig: {
      immediate: true,
      handler(config) {
        if (typeof config === "object") {
          Object.keys(config).forEach(key => {
            this.paginationConf[key] = config[key];
          });
        }
      }
    },
    isLoading: {
      handler(value) {
        value && this.changeSelectAllChildHandle();
      }
    }
  },
  mounted() {
    this.addChildIndex();
  },
  methods: {
    onHandleColumn(propItem, scope, index) {
      this.$emit("columnIconClick", {
        propItem,
        scope,
        index
      });
    },
    // 给子列表增加序号 用来给子筛选框赋值
    addChildIndex() {
      let index = 1;
      this.allChildIndex = [];
      this.initAllSeletion = [];
      this.tableData.map(item => {
        item[this.childName] &&
          item[this.childName].map(childItem => {
            this.allChildIndex.push(index);
            childItem.childIndexBySys = index++;
            this.initAllSeletion.push(childItem);
            return childItem;
          });
        return item;
      });
    },
    isShowBatchEdit(propItem, row, index) {
      if (!propItem.showBatchEditExpress) {
        return propItem.isShowBatchEdit;
      }
      return (
        propItem.isShowBatchEdit &&
        propItem.showBatchEditExpress(row[propItem.prop], index)
      );
    },
    notHasSelfSlot(prop) {
      return !this.$scopedSlots.hasOwnProperty(prop);
    },
    // 全选
    changeSelectAllChildHandle(value) {
      if (value) {
        this.childChecked = this.allChildIndex;
        this.childMultipleSelection = this.initAllSeletion;
      } else {
        this.childChecked = [];
        this.childMultipleSelection = [];
      }
      this.emitChildMultipleSelection();
    },
    // 点击单个选择框
    changeCheckChildHandle(childRow) {
      if (this.childChecked.includes(childRow.childIndexBySys)) {
        this.childChecked = this.childChecked.filter(
          item => item !== childRow.childIndexBySys
        );
        this.childMultipleSelection = this.childMultipleSelection.filter(
          item => item.childIndexBySys !== childRow.childIndexBySys
        );
      } else {
        this.childChecked.push(childRow.childIndexBySys);
        this.childMultipleSelection.push(childRow);
      }
      this.isCheckAll = this.childChecked.length === this.allChildIndex.length;
      this.emitChildMultipleSelection();
    },
    emitChildMultipleSelection() {
      const concatChild = [];
      this.childMultipleSelection.forEach(item => {
        this.tableData.find((parent, index) => {
          const res =
            parent[this.childName] &&
            parent[this.childName].find(
              child => child.childIndexBySys === item.childIndexBySys
            );
          if (res) {
            const obj = { ...parent, [this.childName]: item };
            concatChild.push(obj);
            return true;
          }
          return false;
        });
      });
      this.$emit("childSelection", concatChild);
    },
    onSizeChange() {
      this.paginationConf.pageNum = 1;
      this.$emit("sizeChange", this.paginationConf);
      this.$emit("update:paginationConf", this.paginationConf);
    },
    onCurrentChange() {
      this.$emit("sizeChange", this.paginationConf);
      this.$emit("update:paginationConf", this.paginationConf);
    }
  }
};
</script>
<style scoped>
.flex-box {
  align-items: center;
  display: flex;
  height: 39px;
  justify-content: center;
  padding: 0 5px;
}
.table-icon {
  font-size: 16px;
  margin-left: 5px;
}

/deep/ .el-table .el-table__cell.table__cell {
  padding: 0;
}

/deep/ .el-table .cell {
  padding: 0 !important;
}
/* 颜色值引用变量，方便统一维护 Todo */
/deep/ .el-table .cell .self-cell {
  border-bottom: 1px solid #ebeef5;
  padding: 6px 5px;
}
/deep/ .el-table .cell .self-cell:last-child {
  border-bottom: none;
}
.cellText {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.footer {
  margin-top: 10px;
  display: flex;
  justify-content: center;
}
</style>
