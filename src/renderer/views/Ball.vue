<template>
  <div id="suspension">
    <div class="ballBox" @click="openWin"></div>
  </div>
</template>

<script>
export default {
  name: "ball",
  data() {
    return {
      biasX: 0,
      biasY: 0,
      isDown: false,
    };
  },
  mounted() {
    const { send } = window.electronApi;

    const suspensionDom = document.getElementById("suspension");
    suspensionDom.addEventListener("mousedown", function (e) {
      this.isDown = true;
      this.biasX = e.x;
      this.biasY = e.y;
      suspensionDom.addEventListener("mousemove", function (e) {
        if (this.isDown) {
          if (e.button === 0) {
            send("move-suspend", {
              biasX: e.screenX - this.biasX,
              biasY: e.screenY - this.biasY,
            });
          }
        }
      });
      suspensionDom.addEventListener("blur", function () {
        this.isDown = false;
      });
      suspensionDom.addEventListener("mouseleave", function () {
        this.isDown = false;
      });
    });
    suspensionDom.addEventListener("blur", function () {
      this.isDown = false;
    });
    suspensionDom.addEventListener("mouseleave", function () {
      this.isDown = false;
    });
    suspensionDom.addEventListener("mouseup", function (e) {
      console.log("mouseup");
      this.isDown = false;
      if (e.button === 0) {
        send("mouse-up", true);
      }
    });
  },
  methods: {
    openWin() {},
  },
};
</script>

<style scoped>
* {
  padding: 0;
  margin: 0;
}
#suspension {
  -webkit-user-select: none;
  cursor: pointer;
  overflow: hidden;
}

#suspension {
  cursor: pointer !important;
  border-radius: 4px;
}
.ballBox {
  /* -webkit-app-region: drag; */
  background-image: url("../assets/icon/icon-ball.png");
  background-repeat: no-repeat;
  background-size: cover;
  height: 80px;
  width: 80px;
}
</style>
