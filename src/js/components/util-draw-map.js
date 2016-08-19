// draw nodes to a canvas
function utilDrawMap(map) {
  let _pad = 20
  map.cvs = document.createElement('canvas')
  map.ctx = map.cvs.getContext('2d')
  map.cvs.width = map.width + (_pad * 2)
  map.cvs.height = map.height + (_pad * 2)
  map.cvs.style.width = `${map.cvs.width / 2}px`
  document.body.appendChild(map.cvs)
  let PI = Math.PI
  map.nodes_keys.forEach(key => {
    let node = map.nodes[key]
    map.ctx.beginPath();
    map.ctx.arc(pad(node.x), pad(node.y), 4, 0, 2 * PI);
    map.ctx.fill();
    map.ctx.moveTo(pad(node.x), pad(node.y))
    let sib_a = map.nodes[node.connect_a]
    let sib_b = map.nodes[node.connect_b]
    map.ctx.lineTo(pad(sib_a.x), pad(sib_a.y))
    map.ctx.moveTo(pad(node.x), pad(node.y))
    map.ctx.lineTo(pad(sib_b.x), pad(sib_b.y))
    map.ctx.stroke()
  })

  function pad(val) {
    return _pad + val
  }
}