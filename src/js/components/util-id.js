function id() {
  var date = Date.now()
  if(date <= id.previous) {
    date = ++id.previous
  } else {
    id.previous = date
  }
  return date
}

id.previous = 0;