let PROXIMITY = {}

function utilProximity({ item1, item2 }) {
  let existing = PROXIMITY[`${item1.id}_${item2.id}`] || PROXIMITY[`${item2.id}_${item1.id}`]
  if(existing) return existing;

  let x_fact = item2.x - item1.x
  let y_fact = item2.y - item1.y
  let proximity = Math.sqrt(x_fact * x_fact + y_fact * y_fact)
  PROXIMITY[`${item1.id}_${item2.id}`] = proximity
  return proximity
}


// trying to alleviate weight of Math.sqrt() when exact distance doesn't matter

let ROUGH_PROXIMITY = {}

function utilRoughProximity({ item1, item2 }) {
  let existing = ROUGH_PROXIMITY[`${item1.id}_${item2.id}`] || ROUGH_PROXIMITY[`${item2.id}_${item1.id}`]
  if(existing) return existing;

  let x_fact = item2.x - item1.x
  let y_fact = item2.y - item1.y
  let proximity = x_fact * x_fact + y_fact * y_fact
  ROUGH_PROXIMITY[`${item1.id}_${item2.id}`] = proximity
  return proximity
}