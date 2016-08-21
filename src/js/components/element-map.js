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
    this.node_count = points.length
    this.setGlobals()
    this.matchQualifier = this.matchQualifier
    this.setRelationship = this.setRelationship
    this.setNodes(points)
    this.setNodesProximities()
    this.sortNodesByDistC()
    this.setOriginNode()
    this.connectNodes1()
    this.connectNodes2()
    if(this.debug) utilDrawMap(this);
  }

  // global vars
  setGlobals() {
    // normalizing the perimeter
    this.width = this.perimeter.E - this.perimeter.W
    this.height = this.perimeter.S - this.perimeter.N
    this.chains = []
    this.path = []
    this.distances = { first: 0, optimized: 0 }
    this.path_scrub = 6 // +1 = how many at a time
    this.path_step = 3 // how many to jump ahead. 1 is super cray, but half scrub is pretty good
  }

  // build nodes from array from points
  setNodes(points) {
    this.nodes = {}
    this.nodes_keys = []
    // for each point
    let points_len = points.length
    for(let p = 0; p < points_len; p++) {
      let point = points[p]
      // create a node
      let node = new Node({
        x: point.x - this.perimeter.W,
        y: point.y - this.perimeter.N,
        width: this.width,
        height: this.height
      })
      this.nodes[node.id] = node
      this.nodes_keys.push(node.id)
    }
  }

  // for each node, get its distances to each node
  setNodesProximities() {
    let nodes = this.nodes
    // for each node
    let keys_len = this.nodes_keys.length
    for(let k = 0; k < keys_len; k++) {
      let key = this.nodes_keys[k]
      this.nodes[key].setProximities(this.nodes_keys, this.nodes)
    }
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

  // set the origin value of the last node
  setOriginNode() {
    let key = this.nodes_keys[this.nodes_keys.length - 1]
    this.nodes[key].setAsOrigin()
  }




  // first pass connect the nodes
  connectNodes1() {
    let keys_len = this.nodes_keys.length
    for(let k = 0; k < keys_len; k++) {
      let key = this.nodes_keys[k]
      let node = this.nodes[key]
      // tell the world
      // this.notify('Node #' + node.id);
      node.connect(this)
    }

    // find the last two nodes that arent connected and connect them
    var last_nodes = []
    for(var k = 0; k < keys_len; k++) {
      let key = this.nodes_keys[k]
      var node = this.nodes[key]
      if(!node.isConnected()) last_nodes.push(node);
      if(last_nodes.length === 2) break;
    }

    let last_0 = last_nodes[0], last_1 = last_nodes[1];
    this.setRelationship(last_1, last_0)
    console.log(this.chains)
    // chains is most likely non unique which means chaining is broken.
    // seek professional help.
    // TODO: corrupt paths. right now, the relationships arent valid
  }



  // loop through all nodes and create sending/receiving pairs.
  connectNodes2() {
    var count = this.nodes_keys.length;
    var traversed = 0;
    var curr_node = this.nodes[this.nodes_keys[0]];
    // initial rev node will not have an id match.
    // this gets set each loop
    var prev_node = { id: 'not a chance' };

    // start at closest node to center
    while(traversed < count) {
      // add current node id to path
      this.path.push(curr_node.id)
      // get the next point
      var next_node = this.getNextNodeInPath(curr_node, prev_node)
      if(next_node) { // TODO: this condition shouldnt be necessary
        // set the master send and receive values
        curr_node.send_to = next_node.id
        next_node.receive_from = curr_node.id
        // set previous node for next loop
        prev_node = curr_node
        // set current node for next loop
        curr_node = next_node
      } else {
        console.warn('we here', curr_node, prev_node)
      }
      // increase traversed count
      traversed++
    }

    // now we have our path.
    // step through the path, grab 5 points forward, determine shortest route for 2,3,4 to get between 1 and 5.
    // if so, update the values
    this.path = this.traverseArray(this.path, 0);
    this.notify('Generated Path', this.path)

    // very important. recalculate distance.
    let keys_len = this.nodes_keys.length
    for(var i = 0; i < keys_len; i++) {
      var node = this.nodes[this.nodes_keys[i]]
      if(node.send_to) {
        var dist = node.proximities_by_id[node.send_to]
        this.distances.optimized += dist
      }
    }

    // at this point, this.chains should be an array containing one array containing all of our values
    if(this.chains[0].length !== this.node_count) console.warn('chain logic is broken');
  }



  // return the next node, in send => receive priority order
  getNextNodeInPath(curr, prev) {
    // concatenate the current nodes connections
    var arr = curr.tmp_snd.concat(curr.tmp_rec)
    // grab the first id that isnt this node's sender
    for(var i = 0; i < arr.length; i++) {
      if(arr[i] !== prev.id) return this.nodes[arr[i]];
    }
    return false
  }

  traverseArray(arr, i) {
    // make a modifiable copy
    var tmp_arr = arr.slice();

    var path_i   = arr[i];
    var start    = this.nodes[path_i];
    var end_idx  = Math.min(i + this.path_scrub, arr.length - 1);

    // tell the world
    // assholes are knots in ropes in sailing.
    // that is exactly what we are doing here.
    // thanks Thomas Horton for the tidbit.
    this.notify('AssBlast P#' + i + '-' + end_idx);

    var ok_scrub = end_idx - i;
    var end      = this.nodes[arr[end_idx]];
    var betweens = [];
    // generate between items
    for(var b = 1; b < ok_scrub; b++) {
      betweens.push(this.nodes[arr[i + b]]);
    }
    var perms = utilPermutations(betweens)
    var d = Infinity;
    var match = null;

    // for each permutation, get its distance
    for(var p = 0; p < perms.length; p++) {
      var dist = utilDistanceForSet(start, end, perms[p]);
      // if best distance, set it
      if(dist < d) { d = dist; match = p; }
    }

    var compare_1 = perms[match].map((a) => { return a.id; }).join('-');
    var compare_2 = betweens.map((a) => { return a.id; }).join('-');

    // console.log(compare_2);

    // if different
    if(compare_1 !== compare_2) {
      // redefine based on match
      var matching = perms[match];
      var prev = start;
      for(var t = 0; t < matching.length; t++) {
        var m = matching[t];
        tmp_arr[i + t + 1] = m.id;
        var node = this.nodes[m.id];
        // set the send of pref
        this.nodes[prev.id].send_to = node.id;
        // set the receive for current loop
        this.nodes[node.id].receive_from = prev.id;
        prev = this.nodes[node.id];
      }
      var last = matching[matching.length - 1];
      this.nodes[end.id].receive_from = last.id;
      this.nodes[last.id].send_to = end.id;
    }

    // if still going, call again with modified array
    if(i < arr.length - this.path_scrub) {
      return this.traverseArray(tmp_arr, i + this.path_step);
    // if note going, set path
    } else {
      return tmp_arr;
    }
  }



  // determining if a node qualifies as a match to another node
  matchQualifier(node1, node2) {
     // if already a match, ignore
    if(
      node1.tmp_snd.indexOf(node2.id) !== -1 ||
      node1.tmp_rec.indexOf(node2.id) !== -1 ||
      node2.tmp_snd.indexOf(node1.id) !== -1 ||
      node2.tmp_rec.indexOf(node1.id) !== -1
    ) return false;

    // TODO: logic, prevent complete loops
    // if chain proximity, trying to prevent loops
    let same_chain = false;
    let chains_len = this.chains.length
    for(let c = 0; c < chains_len; c++) {
      let chain = this.chains[c]
      if(chain.indexOf(node2.id) !== -1 && chain.indexOf(node1.id) !== -1) {
        same_chain = true
        break
      }
    }
    if(same_chain) return false;

    // if center node has one already
    if(node1.is_origin && (node1.tmp_snd.length + node1.tmp_rec.length > 1)) return false;
    if(node2.is_origin && (node2.tmp_snd.length + node2.tmp_rec.length > 1)) return false;

    // pass
    return true
  }

  setRelationship(sender, receiver) {
    // update the distance traveled
    this.distances.first += sender.proximities_by_id[receiver.id]

    // set on sender
    sender.tmp_snd.push(receiver.id);
    // set on receiver
    receiver.tmp_rec.push(sender.id);

    // figuring out which if any chain for sender and receiver
    var snd_chain = null;
    var rec_chain = null;

    // finding chains for the parent and the prospect sender
    let chains_len = this.chains.length
    for(var i = 0; i < chains_len; i++) {
      // checking for a parent chain
      if(this.chains[i].indexOf(sender.id) !== -1) {
        snd_chain = this.chains[i]
        if(rec_chain) break;
      }
      // checking for a prospect chain
      if(this.chains[i].indexOf(receiver.id) !== -1) {
        rec_chain = this.chains[i]
        if(snd_chain) break;
      }
    }

    // if sender chain and no receiver chain, add receiver to sender chain
    var snd_index, rec_index;
    if(snd_chain && !rec_chain) {
      snd_index = this.chains.indexOf(snd_chain)
      this.chains[snd_index] = snd_chain.concat([receiver.id])
    // if receiver chain and no sender chain, add sender to receiver chain
    } else if(!snd_chain && rec_chain) {
      rec_index = this.chains.indexOf(rec_chain)
      this.chains[rec_index] = rec_chain.concat([sender.id])
    // if no sender or receiver chain, add a new chain
    } else if(!snd_chain && !rec_chain) {
      this.chains.push([sender.id, receiver.id])
    // if sender chain is receiver chain more than for the last nodes,
    // our logic that got us here is broken
    } else if(snd_chain === rec_chain) {
      this.notify('Chain Match: should happen once for last nodes')
    // if sender chain is not the receiver chain, merge the this.chains
    } else {
      // we have two different this.chains
      snd_index = this.chains.indexOf(snd_chain)
      // merge the two this.chains
      snd_chain = snd_chain.concat(rec_chain)
      // set the index
      this.chains[snd_index] = snd_chain
      // remove the receiver chain now that it is merged
      this.chains.splice(this.chains.indexOf(rec_chain), 1)
    }
  }

  notify(message) {
    console.log(message)
  }
}
