# batch-edit-table

> A vue.js project for batch editing table data

## Build Setup

# install
 
​```
npm install batch-edit-table
​```
# use
​```

// main.js
import batchEditTable from 'batch-edit-table'
 
Vue.use(batchEditTable)

​```

| 参数                 | 说明                 | 类型    | 可选值 | 默认值                  |
| -------------------- | -------------------- | ------- | ------ | ----------------------- |
| showIndex            | 默认展示序号         | Boolean | —      | true                    |
| showCheckbox         | 默认展示选择框       | Boolean | -      | true                    |
| showOperate          | 默认不展示操作列     | Boolean | —      | false                   |
| showPagination       | 默认展示分页         | Boolean | —      | true                    |
| showChildCheckbox    | 根据子集列展示选择框 | Boolean | —      | false                   |
| propList             | 列属性               | Array   | —      | []                      |
| tableData            | 表格数据             | Array   |        | []                      |
| total                | 表格数据总条数       | Number  |        | 0                       |
| notSplitCellPropList | 不拆分单元格属性     | Array   |        | []                      |
| childName            | 子数据字段名         | String  |        | 'children'              |
| isLoading            |                      | Boolean |        | false                   |
| paginationConfig     | 分页配置             | Object  |        | {pageSize:25,pageNum:1} |

propList 配置项：
| 参数 | 说明 | 类型 |
| -------------------- | -------------------- | ------- |
| label | 名称 | String |
| prop | 属性名 | String，当值为 childCheckbox 展示子数据多选框列 |
| isShowBatchEdit | 是否展示编辑按钮 | Boolean |
| width | 宽度 | String |

event
| 事件名 | 说明 | 类型 |
| -------------------- | -------------------- | ------- |
| childSelection | 子数据选中事件 | |
| sizeChange | 分页事件 | |
| columnIconClick | 列表中编辑按钮点击事件 | |


