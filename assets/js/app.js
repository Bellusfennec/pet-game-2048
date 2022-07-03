let touchstartX = 0
let touchstartY = 0
let touchendX = 0
let touchendY = 0
let square
const container = document.querySelector('.container')
const app = document.querySelector('#game')
const newGame = document.querySelectorAll('.newGame')
const score = document.querySelectorAll('.score')
const modal = document.querySelectorAll('.modal')
const settings = document.querySelector('.settings')
const gameSettings = document.querySelector('#gameSettings')
const gameSwitch = document.querySelector('.switch')
const gameMode = document.querySelector('.gameMode')
const bodyModals = document.querySelectorAll('.modalBody')
const storageName = 'game-2048'

let game = {
  size: 4,
  cells: [],
  score: 0,
  bestScore: 0,
  moveTop: false,
  moveRight: false,
  moveBottom: false,
  moveLeft: false,
}

function createArrayCells() {
  container.style.width = `${game.size * 110 + 10}px`
  for (let x = 0; x < game.size; x++) {
    for (let y = 0; y < game.size; y++) {
      game.cells.push({ row: x, col: y, value: null })
    }
  }
}

function createSquares() {
  game.cells.forEach((cell, i) => {
    cell.number = i
    const item = addNode('div')
    addClass(item, 'square')
    append(app, item)
    const itemIn = addNode('div')
    append(item, itemIn)
  })
  square = document.querySelectorAll('.square')
}

if (localStorage.getItem(storageName) !== null) {
  localGame = JSON.parse(localStorage.getItem(storageName))
  game = localGame
  createSquares()
  container.style.width = `${game.size * 110 + 10}px`
  score[0].lastChild.textContent = `${game.score}`
  score[1].lastChild.textContent = `${game.bestScore}`
  game.cells.forEach((cell, i, cells) => {
    if (cell.row === game.cells[i].row && cell.col === game.cells[i].col) {
      cell.value = game.cells[i].value
      if (cell.value > 0) {
        addClassSquare(cell, 'rank')
      }
    }
  })
  switched(localGame.size)
} else {
  score[1].lastChild.textContent = `${game.bestScore}`
  createArrayCells()
  createSquares()
  game.trace = true
  setRandomValue()
  game.trace = true
  setRandomValue()
  updateCellsValues(game.cells)
  switched(game.size)
}

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
    touchendX = event.changedTouches[0].screenX
    touchendY = event.changedTouches[0].screenY
    handleGesure()
  },
  false
)

// добавить координаты к ячейкам
// let acc = 2
// game.cells.forEach((cell, i) => {
//   if (acc < 4097) {
//     square[i].firstChild.textContent = acc
//     square[i].firstChild.classList.add(`rank-${acc}`)
//     console.log(acc);
//     let newAcc = acc * 2
//     acc = newAcc
//   }
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

function check() {
  moveTop(true)
  moveRight(true)
  moveBottom(true)
  moveLeft(true)
  if (!game.moveTop && !game.moveBottom && !game.moveLeft && !game.moveRight) {
    modal[0].style.display = 'block'
  }
  game.moveTop = false
  game.moveBottom = false
  game.moveLeft = false
  game.moveRight = false
}

document.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowUp') {
    moveTop()
    setRandomValue()
    updateCellsValues(game.cells)
    check()
  }
  if (event.key === 'ArrowRight') {
    moveRight()
    setRandomValue()
    updateCellsValues(game.cells)
    check()
  }
  if (event.key === 'ArrowDown') {
    moveBottom()
    setRandomValue()
    updateCellsValues(game.cells)
    check()
  }
  if (event.key === 'ArrowLeft') {
    moveLeft()
    setRandomValue()
    updateCellsValues(game.cells)
    check()
  }
})

// обновить клетки в массиве
function updateCellsValues(array) {
  array.forEach((cell, i, cells) => {
    if (cell.row === array[i].row && cell.col === array[i].col) {
      cell.value = array[i].value
    }
  })
  localStorage.setItem(storageName, JSON.stringify(game))
}

// движение вверх
function moveTop(check = false) {
  for (let col = 0; col < game.size; col++) {
    game.cells
      .filter((c) => c.col === col)
      .forEach((cell, i, cells) => {
        let nextCell = cells.find((c) => c.value !== null && c.row > cell.row)
        let previousCell = cells.find((c) => c.value === null && c.row < cell.row)

        if (cell.value !== null) {
          if (((nextCell && cell.value === nextCell.value) || previousCell) && check) {
            game.moveTop = true
          } else {
            moveCell(previousCell, cell, nextCell, 'top')
          }
        }
      })
  }
}

// движение вниз
function moveBottom(check = false) {
  for (let col = 0; col < game.size; col++) {
    game.cells
      .filter((c) => c.col === col)
      .reverse()
      .forEach((cell, i, cells) => {
        let nextCell = cells.find((c) => c.value !== null && c.row < cell.row)
        let previousCell = cells.find((c) => c.value === null && c.row > cell.row)

        if (cell.value !== null) {
          if (((nextCell && cell.value === nextCell.value) || previousCell) && check) {
            game.moveBottom = true
          } else {
            moveCell(previousCell, cell, nextCell, 'bottom')
          }
        }
      })
  }
}

// движение на право
function moveRight(check = false) {
  for (let row = 0; row < game.size; row++) {
    game.cells
      .filter((c) => c.row === row)
      .reverse()
      .forEach((cell, i, cells) => {
        let nextCell = cells.find((c) => c.value !== null && c.col < cell.col)
        let previousCell = cells.find((c) => c.value === null && c.col > cell.col)

        if (cell.value !== null) {
          if (((nextCell && cell.value === nextCell.value) || previousCell) && check) {
            game.moveRight = true
          } else {
            moveCell(previousCell, cell, nextCell, 'right')
          }
        }
      })
  }
}

// движение на лево
function moveLeft(check = false) {
  for (let row = 0; row < game.size; row++) {
    game.cells
      .filter((c) => c.row === row)
      .forEach((cell, i, cells) => {
        let nextCell = cells.find((c) => c.value !== null && c.col > cell.col)
        let previousCell = cells.find((c) => c.value === null && c.col < cell.col)

        if (cell.value !== null) {
          if (((nextCell && cell.value === nextCell.value) || previousCell) && check) {
            game.moveLeft = true
          } else {
            moveCell(previousCell, cell, nextCell, 'left')
          }
        }
      })
  }
}

function append(parent, element) {
  return parent.append(element)
}

function addNode(element) {
  return document.createElement(element)
}

function addClass(element, className, time = null) {
  return element.classList.add(className)
  // setTimeout(() => {
  //   element.classList.add(className)
  // }, time)
}

function removeClass(element, className, time = null) {
  return element.classList.remove(className)
  // setTimeout(() => {
  //   element.classList.add(className)
  // }, time)
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
  let time = 100
  let sizeSquare = 100 // 6.25
  let paddingSquare = 10 // 0.625
  let unit = 'px'
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
    delClassSquare(cell, 'rank', time)
    cell.value *= 2
    increaseScore(cell.value)
    addClassSquare(cell, 'rank', time)
    delClassSquare(nextCell, 'rank', time)
    nextCell.value = null
    addClassSquare(cell, 'merge', time)
    delClassSquare(cell, 'merge', time + 200)
    animate({
      duration: time,
      timing: function (timeFraction) {
        return timeFraction
      },
      draw: function (progress) {
        square[nextCell.number].firstChild.style.transform = `${translate}(${minus}${
          abs > 0
            ? Math.abs(progress * (countMoveCell1 * sizeSquare) + countMoveCell1 * paddingSquare)
            : progress * (countMoveCell1 * sizeSquare) + countMoveCell1 * paddingSquare
        }${unit})`
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
      delClassSquare(cell, 'rank', time)
      addClassSquare(previousCell, 'rank', time)
      cell.value = null
      addClassSquare(previousCell, 'merge', time)
      delClassSquare(previousCell, 'merge', time + 200)
      animate({
        duration: time,
        timing: function (timeFraction) {
          return timeFraction
        },
        draw: function (progress) {
          square[cell.number].firstChild.style.transform = `${translate}(${minus}${
            abs > 0
              ? Math.abs(progress * (countMoveCell * sizeSquare) + countMoveCell * paddingSquare)
              : progress * (countMoveCell * sizeSquare) + countMoveCell * paddingSquare
          }${unit})`
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
    delClassSquare(cell, 'rank', time)
    addClassSquare(previousCell, 'rank', time)
    cell.value = null
    animate({
      duration: time,
      timing: function (timeFraction) {
        return timeFraction
      },
      draw: function (progress) {
        // console.log(abs > 0
        //   ? Math.abs(progress * (countMoveCell * sizeSquare) + countMoveCell * paddingSquare)
        //   : progress * (countMoveCell * sizeSquare) + countMoveCell * paddingSquare);
        square[cell.number].firstChild.style.transform = `${translate}(${minus}${
          abs > 0
            ? Math.abs(progress * (countMoveCell * sizeSquare) + countMoveCell * paddingSquare)
            : progress * (countMoveCell * sizeSquare) + countMoveCell * paddingSquare
        }${unit})`
        square[cell.number].firstChild.style.zIndex = 1
        if (progress === 1) {
          square[cell.number].firstChild.style.transform = ''
          square[cell.number].firstChild.style.zIndex = ''
        }
      },
    })
  }
}

function startAnimation() {
  animate({
    duration: time,
    timing: function (timeFraction) {
      return timeFraction
    },
    draw: function (progress) {
      console.log(
        abs > 0
          ? Math.abs(progress * (countMoveCell * 6.25) + countMoveCell * 0.625)
          : progress * (countMoveCell * 6.25) + countMoveCell * 0.625
      )
      square[cell.number].firstChild.style.transform = `${translate}(${minus}${
        abs > 0
          ? Math.abs(progress * (countMoveCell * 6.25) + countMoveCell * 0.625)
          : progress * (countMoveCell * 6.25) + countMoveCell * 0.625
      }rem)`
      square[cell.number].firstChild.style.zIndex = 1
      if (progress === 1) {
        square[cell.number].firstChild.style.transform = ''
        square[cell.number].firstChild.style.zIndex = ''
      }
    },
  })
}

function handleGesure() {
  let x = Math.abs(touchstartX - touchendX)
  let y = Math.abs(touchstartY - touchendY)

  if (touchendY < touchstartY && y > x) {
    moveTop()
    setRandomValue()
    updateCellsValues(game.cells)
  }
  if (touchendX > touchstartX && y < x) {
    moveRight()
    setRandomValue()
    updateCellsValues(game.cells)
  }
  if (touchendY > touchstartY && y > x) {
    moveBottom()
    setRandomValue()
    updateCellsValues(game.cells)
  }
  if (touchendX < touchstartX && y < x) {
    moveLeft()
    setRandomValue()
    updateCellsValues(game.cells)
  }
}
newGame.forEach((button, i) => {
  button.addEventListener('click', () => {
    startNewGame()
  })
})

function increaseScore(value) {
  game.score += value
  score[0].children[1].textContent = `${game.score}`

  animatedIncreaseScore(score[0], value)

  if (game.score > game.bestScore) {
    game.bestScore = game.score
    score[1].children[1].textContent = `${game.bestScore}`
    animatedIncreaseScore(score[1], value)
  }
}

function animatedIncreaseScore(element, value) {
  const span = addNode('span')
  append(element, span)
  span.classList.add('increaseScore')
  span.style.color = `var(--colorRank-${value})`
  span.textContent = `+${value}`
  setTimeout(() => {
    span.parentNode.removeChild(span)
  }, 950)
}

settings.addEventListener('click', () => {
  gameSettings.style.display = 'block'
})

gameSwitch.addEventListener('click', (event) => {
  gameSwitch.classList.toggle('switchOn')
  if (!gameMode.checked) {
    game.size = 5
    startNewGame()
  } else if (gameMode.checked) {
    game.size = 4
    startNewGame()
  }
})

function startNewGame() {
  square.forEach((element) => {
    element.parentNode.removeChild(element)
  })
  game.score = 0
  score[0].lastChild.textContent = `${game.score}`
  game.cells = []
  createArrayCells()
  createSquares()
  game.trace = true
  setRandomValue()
  game.trace = true
  setRandomValue()
  updateCellsValues(game.cells)
  if ((i = 1)) {
    modal[0].style.display = 'none'
  }
}
modal.forEach((item, i) => {
  item.addEventListener('click', (event) => {
    item.style.display = 'none'
  })
})

bodyModals.forEach((bodyModal, i) => {
  bodyModal.addEventListener('click', (event) => {
    event.stopPropagation()
  })
})

function switched(size) {
  if (size === 5) {
    gameMode.checked = true
    gameSwitch.classList.add('switchOn')
  } else if (size === 4) {
    gameMode.checked = false
    gameSwitch.classList.remove('switchOn')
  }
}
