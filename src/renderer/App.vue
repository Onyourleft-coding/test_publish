<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App",
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
::-webkit-scrollbar {
  width: 6px;
  height: 4px;
  border-radius: 3px;
}
::-webkit-scrollbar-button {
  width: 6px;
  height: 0;
  border-radius: 3px;
}
::-webkit-scrollbar-track {
  background: 0 0;
}
::-webkit-scrollbar-thumb {
  background: #245fd9;
  -webkit-transition: 0.3s;
  transition: 0.3s;
}
::-webkit-scrollbar-thumb:hover {
  background-color: #245fd9;
}
::-webkit-scrollbar-thumb:active {
  background-color: #245fd9;
}
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-track-piece {
  background-color: transparent;
  -webkit-border-radius: 3px;
}
::-webkit-scrollbar-thumb:vertical {
  height: 6px;
  background-color: #d0d0d0;
  -webkit-border-radius: 3px;
}
::-webkit-scrollbar-thumb:horizontal {
  width: 6px;
  background-color: #d0d0d0;
  -webkit-border-radius: 3px;
}
::-webkit-scrollbar-thumb:vertical:hover,
::-webkit-scrollbar-thumb:horizontal:hover {
  background-color: #d0d0d0;
}
p {
  margin: 0;
  padding: 0;
}
</style>
