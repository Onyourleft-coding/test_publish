<template>
  <div class="card-content">
    <table class="table-card">
      <thead class="table-th">
        <tr>
          <th class="th-item" v-for="item in tableHeader" :key="item">
            {{ item }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr class="tr-content" v-for="(tItem, key) in tableData" :key="key">
          <td v-if="![4, 5].includes(type)">
            <span v-if="tItem.rank <= 3">
              <img
                v-if="tItem.rank"
                :src="require(`../../assets/icon/icon-rank-${tItem.rank}.png`)"
                alt=""
                class="icon-rank"
              />
            </span>
            <span v-else>
              {{ tItem.rank }}
            </span>
          </td>
          <td>{{ tItem.student }}</td>
          <td>
            {{ type === 5 ? `${tItem.commentCount}次` : `${tItem.score}分` }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: "table",
  props: {
    tableHeader: Array,
    tableData: Array,
    type: Number,
  },
};
</script>

<style scoped>
.card-content {
  height: 380px;
  width: 100%;
  overflow: auto;
}
table {
  border-collapse: collapse;
  table-layout: fixed;
  width: 100%;
}

th,
td {
  padding: 5px;
  text-align: center;
  font-size: 14px;
}
.icon-rank {
  /*display: block;*/
  height: 24px;
  width: 24px;
}
/*.table-card{*/
/*  width: 100%;*/
/*}*/
.table-th {
  background: #fffbf6;
}
.th-item {
  font-weight: bold;
  font-size: 14px;
  height: 20px;
  line-height: 20px;
}
tbody {
  max-height: 380px;
  overflow-y: scroll;
}
tbody tr:not(:last-child) {
  border-bottom: 1px solid #eef6fe;
}

tbody td:first-child {
  text-align: center;
  vertical-align: middle;
}
</style>
