/* global CHUNK WORLD_WIDTH WORLD_HEIGHT*/


function blankWorld() {
  let world = new Array(WORLD_WIDTH);
  for(let i = WORLD_WIDTH; i--;) {
    world[i] = new Array(WORLD_HEIGHT).fill(false);
  }
  return world;
}


let world = blankWorld();


const TOAD1 = [
  [0, 0],
  [0, 1],
  [0, 2],
  [1, 1],
  [1, 2],
  [1, 3]
];

const GLIDER1 = [
  [0, 2],
  [1, 2],
  [2, 2],
  [2, 1],
  [1, 0]
];
const GLIDER2 = GLIDER1.map((pair) => [-pair[0],-pair[1]]);
const TOAD2 = TOAD1.map((pair) => [-pair[0], -pair[1]]);

function makeShape(points, x, y) {
  points.forEach((pair) => {
    world[pair[0] + x][pair[1] + y] = true;
  });
}

makeShape(GLIDER1, 5, 5);
makeShape(TOAD1, 50, 50);
// makeShape(GLIDER1, 25, 5);
// makeShape(TOAD1, 75, 50);
// makeShape(GLIDER2, 97, 97);
// makeShape(TOAD2, 60, 60);
// makeShape(GLIDER2, 117, 97);
// makeShape(TOAD2, 80, 60);
renderWorld();


function liveNeighbors(x, y) {
  if(x === 0 || y === 0 || x === WORLD_WIDTH - 1 || y === WORLD_HEIGHT - 1) {
    // console.log('hard return from liveNeighbors: ', x, y);
    return 0;
  }
  let count = 0;

  count += (
    world[x-1][y-1] +
    world[x-1][y] +
    world[x-1][y+1] +
    world[x][y-1] +
    world[x][y+1] +
    world[x+1][y-1] +
    world[x+1][y] +
    world[x+1][y+1]
  );
  return count;
}

function updateWorld() {
  // console.log('updating world');
  let newWorld = blankWorld();

  for(let i = 0; i < WORLD_WIDTH; i++) {
    for(let j = 0; j < WORLD_HEIGHT; j++) {
      let alive = liveNeighbors(i, j);
      if(world[i][j] && alive === 2 || alive === 3) newWorld[i][j] = true;
    }
  }

  world = newWorld;
}

function renderWorld() {
  // console.log("rendering world");
  let pixels = [];
  let color = "green";
  for(let i = 0; i < WORLD_WIDTH; i++) {
    for(let j = 0; j < WORLD_HEIGHT; j++) {
      if(world[i][j]) pixels.push({left: i, top: j});
    }
  }
  CHUNK.draw([{pixels, color}]);
}

function mainLoop() {
  renderWorld();
  updateWorld();
}

CHUNK.executeNTimesPerSecond(mainLoop, 30);
