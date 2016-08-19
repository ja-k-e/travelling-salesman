function utilId() {
  var date = Date.now()
  if(date <= utilId.previous) {
    date = ++utilId.previous
  } else {
    utilId.previous = date
  }
  return date
}

utilId.previous = 0;