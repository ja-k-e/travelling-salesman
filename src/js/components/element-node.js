class Node {
  constructor({ x, y, width, height }) {
    this.x = x
    this.y = y
    this.connect_a = null
    this.connect_b = null
    this.id = `N${utilId()}`
    this.rel_x = x - width + width / 2
    this.rel_y = y - height + height / 2
    this.dist_c = utilProximity({
      item1: { x: this.rel_x, y: this.rel_y, id: this.id },
      item2: { x: 0, y: 0, id: 'CENTER' }
    })
    this.setProximities = this.setProximities
    this.connect = this.connect
  }

  setProximities(keys, nodes) {
    // set initial proximities
    this.proximities = []
    // for each node
    keys.forEach(sib => {
      let sib_node = nodes[sib]
      // if not same node
      if(sib_node.id !== this.id) {
        // get the proximity
        let proximity = utilProximity({
          item1: { x: this.rel_x, y: this.rel_y, id: this.id },
          item2: { x: sib_node.rel_x, y: sib_node.rel_y, id: sib_node.id }
        })
        // add the proximity
        this.proximities.push({
          id: sib_node.id,
          proximity: proximity
        })
      }
    })
    // sort proximities by proximity
    this.proximities.sort((a, b) => {
      if(a.proximity > b.proximity) return 1;
      if(a.proximity < b.proximity) return -1;
      return 0
    })
  }

  connect(nodes) {
    // for each node
    this.proximities.forEach(sib => {
      // if this isnt connected
      if(this.connect_a && this.connect_b) return;
      // get the open slot
      let slot = this.connect_a ? 'connect_b' : 'connect_a'
      let sib_node = nodes[sib.id]
      // if not same node, and not full
      if(sib_node.id !== this.id && !sib_node.connect_b) {
        // get the open sibling slot
        let sib_slot = sib_node.connect_a ? 'connect_b' : 'connect_a'
        // set sibling slot
        sib_node[sib_slot] = this.id
        // set this slot
        this[slot] = sib_node.id
      }
    })
  }
}
