var falseHandler = {
  get: (target, name) => {
    if(!(name in target)) {
      target[name] = false
    }
    return target[name]
  }
}

var falseWrapper = {
  get: (target, name) => {
    if(!(name in target)) {
      target[name] = new Proxy([], falseHandler)
    }
    return target[name]
  }
}

var turn = 1

function printWorld() {
  var msg = ""
  for(let i = 0; i < 20; i++) {
    for(let j = 0; j < 20; j++) {
      msg += world[j][i] ? "x" : "-"
    }
    console.log(msg)
    msg = ""
  }
}

function cellToNumber(i, j) {
  // console.log(`In cellToNumber(${i},${j})`)
  return world[i][j] ? 1 : 0
}

var neighborDiffs = [
  [-1, 0],
  [-1, -1],
  [0, -1],
  [1, -1],
  [1, 0],
  [1, 1],
  [0, 1],
  [-1, 1]
]

function liveNeighbors(i, j) {
  var aliveCount = 0
  neighborDiffs.forEach((pair) => {
    aliveCount += cellToNumber(i + pair[0], j + pair[1])
  })
  return aliveCount
}

function addCell(x, y) {
  world[x][y] = true
  cells.push([x,y])
}

function updateWorld() {
  // We don't want to update our world as we're building the next generation, so we use a new copy
  var newWorld = new Proxy([], falseWrapper)
  var newCells = []

  function addCell(x, y) {
    newWorld[x][y] = true
    newCells.push([x,y])
  }

  function checkCellForLife(x, y) {
    var aliveCount = liveNeighbors(x, y) + cellToNumber(x, y)
    switch (aliveCount) {
      case 3:
        addCell(x, y)
        break;

      case 4:
        if(world[x, y]) addCell(x, y)
        break;
    }
  }

  cells.forEach( (cell) => {

    neighborDiffs.forEach( (neighborDiff) => {
      var neighbor = neighborDiff.map((diff, i) => { return cell[i] += diff})
      checkCellForLife(...neighbor)
    })

    checkCellForLife(...cell)
  })

  world = newWorld
  cells = newCells
}

function mainLoop() {
  console.log("\n".repeat(10))
  console.log("=".repeat(30))
  console.log(`\tTurn ${turn}`)
  console.log("=".repeat(30))
  printWorld()
  updateWorld()
  turn++
}

var world = new Proxy([], falseWrapper)
var cells = []
// world[5][4] = true
// world[5][5] = true
// world[4][5] = true
// world[3][5] = true
// world[3][4] = true
// world[3][3] = true
// world[4][3] = true
// world[5][3] = true
// BLINKER
// world[10][9] = true
// world[10][10] = true
// world[10][11] = true
//
// TOAD
// world[17][17] = true
// world[17][18] = true
// world[17][19] = true
// world[18][18] = true
// world[18][19] = true
// world[18][20] = true

// GLIDER
addCell(0, 2)
addCell(1, 2)
addCell(2, 2)
addCell(2, 1)
addCell(1, 0)

console.log(liveNeighbors(5,5))

setInterval(mainLoop, 2000)
// var infinite_loop = 0
// while(infinite_loop === 0) {
//   printWorld()
//   updateWorld()
// }
