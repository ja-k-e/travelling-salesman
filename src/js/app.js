let points = []
let perimeter = {
  N: Infinity, E: 0, S: 0, W: Infinity
}
for(let i = 0; i < 500; i++) {
  let x = Math.round(Math.random() * 2000)
  let y = Math.round(Math.random() * 2000)
  if(y < perimeter.N) perimeter.N = y;
  if(x > perimeter.E) perimeter.E = x;
  if(y > perimeter.S) perimeter.S = y;
  if(x < perimeter.W) perimeter.W = x;

  points.push({ x, y})
}
let m = new Map({
  perimeter: perimeter,
  points: points
})
console.log(m)
console.log(PROXIMITY)