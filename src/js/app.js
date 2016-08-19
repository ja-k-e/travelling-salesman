let c = new Cluster({
  nodes: [
    new Node({ x: 10, y: 10 }),
    new Node({ x: 20, y: 20 }),
    new Node({ x: 200, y: 200 })
  ]
})
console.log(c)