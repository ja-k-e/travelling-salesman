class Node {
  constructor({ x, y, width, height }) {
    this.x = x
    this.y = y
    this.id = `N${id()}`
    this.rel_x = x - width + width / 2
    this.rel_y = y - height + height / 2
    this.dist_c = utilProximity({
      item1: { x: this.rel_x, y: this.rel_y, id: this.id },
      item2: { x: 0, y: 0, id: 'CENTER' }
    })
  }
}
