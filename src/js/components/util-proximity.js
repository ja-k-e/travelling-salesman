let PROXIMITY = {}

function utilProximity({ item1, item2 }) {
  let existing = PROXIMITY[`${item1.id}_${item2.id}`] || PROXIMITY[`${item2.id}_${item1.id}`]
  if(existing) return existing;

  let proximity = Math.sqrt(Math.pow(item2.x - item1.x, 2) + Math.pow(item2.y - item1.y, 2))
  PROXIMITY[`${item1.id}_${item2.id}`] = proximity
  return proximity
}