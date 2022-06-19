let touchstartX = 0
let touchstartY = 0
let touchendX = 0
let touchendY = 0
let square
const app = document.querySelector('#game')

const game = {
  size: 5,
  cells: [],
}

for (let x = 0; x < game.size; x++) {
  for (let y = 0; y < game.size; y++) {
    game.cells.push({ row: x, col: y, value: null })
  }
}

function createSquares() {
  game.cells.forEach((cell, i) => {
    cell.number = i
    const item = addNode('div')
    addClass(item, 'square')
    append(app, item)
    //
    const itemIn = addNode('div')
    append(item, itemIn)
    //
  })
  square = document.querySelectorAll('.square')
  game.trace = true
  setRandomValue()
  game.trace = true
  setRandomValue()
}

createSquares()

app.addEventListener(
  'touchstart',
  function (event) {
    touchstartX = event.changedTouches[0].screenX
    touchstartY = event.changedTouches[0].screenY
  },
  false
)

app.addEventListener(
  'touchend',
  function (event) {
    console.log(event.changedTouches[0]);
    touchendX = event.changedTouches[0].screenX
    touchendY = event.changedTouches[0].screenY
    handleGesure()
  },
  false
)

// добавить координаты к ячейкам
// game.cells.forEach((cell, i) => {
//   square[i].firstChild.textContent = cell.row + ',' + cell.col
// })

function setRandomValue() {
  let emptyCells = game.cells.filter((cell) => cell.value === null) // && cell.row === 0
  const randomCell = getRandomArrayElement(emptyCells)

  if (emptyCells.length && game.trace === true) {
    game.cells
      .filter((cell) => cell.row === randomCell.row && cell.col === randomCell.col)
      .map((cell) => {
        cell.value = Math.random() > 0.8 ? 4 : 2
        addClassSquare(cell, 'rank', 100)
        addClassSquare(cell, 'new', 100)
        delClassSquare(cell, 'new', 300)
      })
    delete game.trace
  }
}

document.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowUp') {
    moveTop()
    setRandomValue()
  }
  if (event.key === 'ArrowRight') {
    moveRight()
    setRandomValue()
  }
  if (event.key === 'ArrowDown') {
    moveBottom()
    setRandomValue()
  }
  if (event.key === 'ArrowLeft') {
    moveLeft()
    setRandomValue()
  }
})

// обновить клетки в массиве
function updateCellsValues(array) {
  array.forEach((cell, i) => {
    if (cell.row === array[i].row && cell.col === array[i].col) {
      cell.value = array[i].value
    }
  })
}

// движение вверх
function moveTop() {
  for (let col = 0; col < game.size; col++) {
    game.cells
      .filter((c) => c.col === col)
      .forEach((cell, i, cells) => {
        let nextCell = cells.find((c) => c.value !== null && c.row > cell.row)
        let previousCell = cells.find((c) => c.value === null && c.row < cell.row)

        if (cell.value !== null) {
          moveCell(previousCell, cell, nextCell, 'top')
        }
      })
  }
  updateCellsValues(game.cells)
}

// движение вниз
function moveBottom() {
  for (let col = 0; col < game.size; col++) {
    game.cells
      .filter((c) => c.col === col)
      .reverse()
      .forEach((cell, i, cells) => {
        let nextCell = cells.find((c) => c.value !== null && c.row < cell.row)
        let previousCell = cells.find((c) => c.value === null && c.row > cell.row)

        if (cell.value !== null) {
          moveCell(previousCell, cell, nextCell, 'bottom')
        }
      })
  }
  updateCellsValues(game.cells)
}

// движение на право
function moveRight() {
  for (let row = 0; row < game.size; row++) {
    game.cells
      .filter((c) => c.row === row)
      .reverse()
      .forEach((cell, i, cells) => {
        let nextCell = cells.find((c) => c.value !== null && c.col < cell.col)
        let previousCell = cells.find((c) => c.value === null && c.col > cell.col)

        if (cell.value !== null) {
          moveCell(previousCell, cell, nextCell, 'right')
        }
      })
  }
  updateCellsValues(game.cells)
}

// движение на лево
function moveLeft() {
  for (let row = 0; row < game.size; row++) {
    game.cells
      .filter((c) => c.row === row)
      .forEach((cell, i, cells) => {
        let nextCell = cells.find((c) => c.value !== null && c.col > cell.col)
        let previousCell = cells.find((c) => c.value === null && c.col < cell.col)

        if (cell.value !== null) {
          moveCell(previousCell, cell, nextCell, 'left')
        }
      })
  }
  updateCellsValues(game.cells)
}

function append(parent, element) {
  return parent.append(element)
}
function addNode(element) {
  return document.createElement(element)
}
function addClass(element, className) {
  return element.classList.add(className)
}
function removeClass(element, className) {
  return element.classList.remove(className)
}
function getRandomNumber(min, max) {
  return Math.round(Math.random() * (min - max) + max)
}
function getRandomArrayElement(array) {
  return array[Math.floor(Math.random() * array.length)]
}

function animate({ duration, draw, timing }) {
  let start = performance.now()

  requestAnimationFrame(function animate(time) {
    let timeFraction = (time - start) / duration
    if (timeFraction > 1) timeFraction = 1

    let progress = timing(timeFraction)

    draw(progress)

    if (timeFraction < 1) {
      requestAnimationFrame(animate)
    }
  })
}

function addClassSquare(cellNumber, className, time = null) {
  const memory = cellNumber.value
  setTimeout(() => {
    if (className === 'rank') {
      square[cellNumber.number].firstChild.classList.add(`rank-${memory}`)
      square[cellNumber.number].firstChild.textContent = cellNumber.value
    } else {
      square[cellNumber.number].firstChild.classList.add(className)
    }
  }, time)
}

function delClassSquare(cellNumber, className, time = null) {
  const memory = cellNumber.value
  setTimeout(() => {
    if (className === 'rank') {
      square[cellNumber.number].firstChild.classList.remove(`rank-${memory}`)
      square[cellNumber.number].firstChild.textContent = ''
    } else {
      square[cellNumber.number].firstChild.classList.remove(className)
    }
  }, time)
}

function moveCell(previousCell, cell, nextCell, move = 'right') {
  // console.log(previousCell, cell, nextCell)
  let translate
  let direction
  let abs = 0
  let minus = '-'

  if (move === 'right' || move === 'left') {
    translate = 'translateX'
    direction = ['col']
  } else if (move === 'top' || move === 'bottom') {
    translate = 'translateY'
    direction = ['row']
  }

  if (move === 'right' || move === 'bottom') {
    abs = 1
    minus = ''
  }

  if (nextCell && cell.value === nextCell.value) {
    game.trace = true
    let countMoveCell1 = nextCell[`${direction}`] - cell[`${direction}`]
    if (previousCell) {
      countMoveCell1 += cell[`${direction}`] - previousCell[`${direction}`]
    }
    delClassSquare(cell, 'rank', 100)
    cell.value *= 2
    addClassSquare(cell, 'rank', 100)
    delClassSquare(nextCell, 'rank', 100)
    nextCell.value = null
    addClassSquare(cell, 'merge', 100)
    delClassSquare(cell, 'merge', 300)
    animate({
      duration: 100,
      timing: function (timeFraction) {
        return timeFraction
      },
      draw: function (progress) {
        square[nextCell.number].firstChild.style.transform = `${translate}(${minus}${
          abs > 0
            ? Math.abs(progress * (countMoveCell1 * 100) + countMoveCell1 * 10)
            : progress * (countMoveCell1 * 100) + countMoveCell1 * 10
        }px)`
        square[nextCell.number].firstChild.style.zIndex = 1
        if (progress === 1) {
          square[nextCell.number].firstChild.style.transform = ''
          square[nextCell.number].firstChild.style.zIndex = ''
        }
      },
    })
    if (previousCell) {
      game.trace = true
      let countMoveCell = cell[`${direction}`] - previousCell[`${direction}`]
      previousCell.value = cell.value
      delClassSquare(cell, 'rank', 100)
      addClassSquare(previousCell, 'rank', 100)
      cell.value = null
      addClassSquare(previousCell, 'merge', 100)
      delClassSquare(previousCell, 'merge', 300)
      animate({
        duration: 100,
        timing: function (timeFraction) {
          return timeFraction
        },
        draw: function (progress) {
          square[cell.number].firstChild.style.transform = `${translate}(${minus}${
            abs > 0
              ? Math.abs(progress * (countMoveCell * 100) + countMoveCell * 10)
              : progress * (countMoveCell * 100) + countMoveCell * 10
          }px)`
          square[cell.number].firstChild.style.zIndex = 1
          if (progress === 1) {
            square[cell.number].firstChild.style.transform = ''
            square[cell.number].firstChild.style.zIndex = ''
          }
        },
      })
    }
  } else if (previousCell) {
    game.trace = true
    let countMoveCell = cell[`${direction}`] - previousCell[`${direction}`]
    previousCell.value = cell.value
    delClassSquare(cell, 'rank', 100)
    addClassSquare(previousCell, 'rank', 100)
    cell.value = null
    animate({
      duration: 100,
      timing: function (timeFraction) {
        return timeFraction
      },
      draw: function (progress) {
        square[cell.number].firstChild.style.transform = `${translate}(${minus}${
          abs > 0
            ? Math.abs(progress * (countMoveCell * 100) + countMoveCell * 10)
            : progress * (countMoveCell * 100) + countMoveCell * 10
        }px)`
        square[cell.number].firstChild.style.zIndex = 1
        if (progress === 1) {
          square[cell.number].firstChild.style.transform = ''
          square[cell.number].firstChild.style.zIndex = ''
        }
      },
    })
  }
}

function handleGesure() {
  let x = Math.abs(touchstartX - touchendX)
  let y = Math.abs(touchstartY - touchendY)

  console.log('X', touchstartX, touchendX, x);
  console.log('Y', touchstartY, touchendY, y);
  console.log(y < x);

  if (touchendY < touchstartY && y > x) {
    moveTop()
    setRandomValue()
  }
  if (touchendX > touchstartX && y < x) {
    moveRight()
    setRandomValue()
  }
  if (touchendY > touchstartY && y > x) {
    moveBottom()
    setRandomValue()
  }
  if (touchendX < touchstartX && y < x) {
    moveLeft()
    setRandomValue()
  }
  if (touchendY == touchstartY) {
    console.log('tap!');
}
}