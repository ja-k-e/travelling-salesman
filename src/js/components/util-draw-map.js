// draw nodes to a canvas
function utilDrawMap(map) {
  console.log(map)
  let _pad = 20
  map.cvs = document.createElement('canvas')
  map.ctx = map.cvs.getContext('2d')
  map.cvs.width = map.width + (_pad * 2)
  map.cvs.height = map.height + (_pad * 2)
  map.cvs.style.width = `${map.cvs.width / 2}px`
  document.body.appendChild(map.cvs)
  let PI = Math.PI
  let keys_len = map.path.length
  for(let k = 0; k < keys_len; k++) {
    let key = map.path[k]
    let sib_key = (k < keys_len - 1) ? map.path[k + 1] : map.path[0]
    let node = map.nodes[key]
    let sib = map.nodes[sib_key]
    map.ctx.beginPath();
    map.ctx.arc(pad(node.x), pad(node.y), 4, 0, 2 * PI);
    map.ctx.fill();
    map.ctx.moveTo(pad(node.x), pad(node.y))
    map.ctx.lineTo(pad(sib.x), pad(sib.y))
    map.ctx.stroke()
  }


  function pad(val) {
    return _pad + val
  }
}