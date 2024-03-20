<template>
  <div>{{ nickName }}</div>
</template>
<script>
export default {
  name: "homeHeader",
  data() {
    return {
      nickName: sessionStorage.getItem("teacherName"),
      // headImg: require(''),
      headTeacher: sessionStorage.getItem("headTeacher"),
    };
  },
};
</script>
<style scoped></style>
