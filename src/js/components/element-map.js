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
  constructor({ points, perimeter, _debug = false }) {
    this.debug = _debug
    this.perimeter = perimeter
    this.setGlobals()
    this.setNodes(points)
    this.setNodesProximities()
    this.sortNodesByDistC()
    this.connectNodes()
    if(this.debug) utilDrawMap(this);
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
  setNodesProximities() {
    let nodes = this.nodes
    // for each node
    this.nodes_keys.forEach(key => {
      this.nodes[key].setProximities(this.nodes_keys, this.nodes)
    })
  }

  // sort nodes keys by node distance to center
  sortNodesByDistC() {
    this.nodes_keys.sort((a, b) => {
      let node_a = this.nodes[a]
      let node_b = this.nodes[b]
      if(node_a.dist_c > node_b.dist_c) return -1;
      if(node_a.dist_c < node_b.dist_c) return 1;
      return 0
    })
  }

  // connect the nodes
  connectNodes() {
    this.nodes_keys.forEach(key => {
      this.nodes[key].connect(this.nodes)
    })
  }
}
