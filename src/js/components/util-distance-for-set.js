// get computed distance for a series of nodes
function utilDistanceForSet(start, end, set) {
  let d = 0
  let curr = start
  for(var i = 0; i < set.length; i++) {
    let set_node = set[i]
    d += curr.proximities_by_id[set_node.id]
    curr = set[i]
  }
  let last = set[set.length - 1]
  if(last.id !== end.id) {
    d += last.proximities_by_id[end.id]
  }
  return d
}