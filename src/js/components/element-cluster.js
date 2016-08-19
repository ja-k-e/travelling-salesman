class Cluster {
  constructor({ nodes }) {
    this.nodes = nodes
    this.id = `C${utilId()}`
    this.setCenter()
  }

  setCenter() {
    let max_x = 0, min_x = Infinity;
    let max_y = 0, min_y = Infinity;

    this.nodes.forEach(node => {
      if(node.x < min_x) min_x = node.x;
      if(node.x > max_x) max_x = node.x;
      if(node.y < min_y) min_y = node.y;
      if(node.y > max_y) max_y = node.y;
    })

    this.x = (max_x - min_x) / 2 + min_x
    this.y = (max_y - min_y) / 2 + min_y
  }
}