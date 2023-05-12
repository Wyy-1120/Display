<template>
  <div>
    <svg width="400" height="400">
      <defs>
          <marker
            id="arrow1"
            viewBox="0 0 10 10"
            refX="5"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" />
          </marker>
        </defs>
      <line v-for="(line, index) in lines" :key="index" :x1="line.startX" :y1="line.startY" :x2="line.endX" :y2="line.endY" :stroke-width="line.width" :stroke="line.color" :marker-end="line.arrowhead" />
    </svg>
    <button @click="addArrowheadLine">Add Arrowhead Line</button>
    <button @click="removeLastLine">Remove Last Line</button>
    <button @click="customizeLine(0)">Customize First Line</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      lines: []
    };
  },
  methods: {
    addArrowheadLine() {
      this.lines.push({
        startX: 100,
        startY: 100,
        endX: 300,
        endY: 300,
        color: "black",
        width: 2,
        arrowhead: "url(#arrow1)"
      });
    },
    removeLastLine() {
      this.lines.pop();
    },
    customizeLine(index) {
      this.lines[index].startX = 50;
      this.lines[index].startY = 200;
      this.lines[index].endX = 350;
      this.lines[index].endY = 200;
      this.lines[index].color = "red";
      this.lines[index].width = 4;
    }
  }
};
</script>

<style>

</style>
