/**
  perimeter = {
    N: lowest y,
    E: highest x,
    S: highest y,
    W: lowest x
  },
  points = [
    { x, y }
    ...
  ]
  */

class Map {
  constructor({ points, perimeter }) {
    this.perimeter = perimeter
    this.setGlobals()
    this.setNodes(points)
    this.setNodesDist()
    this.sortNodesByDistC()
  }

  // global vars
  setGlobals() {
    // normalizing the perimeter
    this.width = this.perimeter.E - this.perimeter.W
    this.height = this.perimeter.S - this.perimeter.N
  }

  // build nodes from array from points
  setNodes(points) {
    this.nodes = {}
    this.nodes_keys = []
    // for each point
    points.forEach(point => {
      // create a node
      let node = new Node({
        x: point.x - this.perimeter.W,
        y: point.y - this.perimeter.N,
        width: this.width,
        height: this.height
      })
      this.nodes[node.id] = node
      this.nodes_keys.push(node.id)
    })
  }

  // for each node, get its distances to each node
  setNodesDist() {
    let nodes = this.nodes
    // for each node
    this.nodes_keys.forEach(key => {
      // set initial proximities
      this.nodes[key].proximities = []
      // for each node
      this.nodes_keys.forEach(sib => {
        // if not same node
        if(nodes[sib].id !== nodes[key].id) {
          // get the proximity
          let proximity = utilProximity({ item1: nodes[key], item2: nodes[sib] })
          // add the proximity
          this.nodes[key].proximities.push({
            id: nodes[sib].id,
            proximity: proximity
          })
        }
      })
      // sort proximities by proximity
      this.nodes[key].proximities.sort((a, b) => {
        if(a.proximity > b.proximity) return 1;
        if(a.proximity < b.proximity) return -1;
        return 0
      })
    })
  }

  // sort nodes keys by node distance to center
  sortNodesByDistC() {
    this.nodes_keys.sort((a, b) => {
      let node_a = this.nodes[a]
      let node_b = this.nodes[b]
      if(node_a.dist_c > node_b.dist_c) return 1;
      if(node_a.dist_c < node_b.dist_c) return -1;
      return 0
    })
  }
}
