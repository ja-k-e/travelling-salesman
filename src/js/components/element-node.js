class Node {
  constructor({ x, y, width, height }) {
    this.x = x
    this.y = y
    this.is_origin = false
    this.tmp_snd = []
    this.tmp_rec = []
    this.isConnected = this.isConnected
    this.setAsOrigin = this.setAsOrigin

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

  setAsOrigin() {
    this.is_origin = true
  }

  setProximities(keys, nodes) {
    // set initial proximities
    this.proximities = []
    this.proximities_by_id = {}
    let keys_len = keys.length
    // for each node
    for(let k = 0; k < keys_len; k++) {
      let sib = keys[k]
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
        // easy key-based ref to the proximity
        this.proximities_by_id[sib_node.id] = proximity

      }
    }
    // sort proximities by proximity
    this.proximities.sort((a, b) => {
      if(a.proximity > b.proximity) return 1;
      if(a.proximity < b.proximity) return -1;
      return 0
    })

  }

  isConnected() {
    // determining if node has both edges connected
    return this.tmp_snd.length + this.tmp_rec.length > 1
  }

  connect(map) {
    // if this node has already been hooked up as a receiver
    if(this.isConnected()) return;
    // set our initial closest values for the two stems
    var closest_1 = false, closest_2 = false;

    // for each node
    let prox_len = this.proximities.length
    for(let p = 0; p < prox_len; p++) {
      // if this is connected, move on
      if(this.isConnected()) return;
      // if we have already found what we need, move on
      if(closest_1 && closest_2) return;
      // grab the proximity node object { id, distance }
      let sib = this.proximities[p]
      // grab the actual node from the proximity id
      // the "edge node candidate"
      let sib_node = map.nodes[sib.id]

      // if it is checking itself, go to the next one (wreck yourself)
      // TODO: we shouldnt have this node in its proximities, so this should be gravy.
      // if(this.id === sib_node.id) continue;

      // if matchable
      if(map.matchQualifier(this, sib_node)) {
        // if we havent defined the first closest
        if(!closest_1) {
          closest_1 = true
          // set relationship with node as sender
          map.setRelationship(this, sib_node)
        // if we havent defined the second closest
        } else if(!closest_2) {
          closest_2 = true
          // set relationship with sib_node as sender
          map.setRelationship(sib_node, this)
        // we have what we need, update our datum
        } else {
          // TODO: this doesnt happen???
          console.warn('this firing is unexpected')
          break
        }
      }
    }
  }
}
