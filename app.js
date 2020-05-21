document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.grid')
  let width = 10
  let bombAmount = 20
  let flags = 0
  let squares = []
  let isGameOver = false


  //create board
  function createBoard() {
    //get shuffled game array with random bombs
    const bombsArray = Array(bombAmount).fill('bomb')
    const emptyArray = Array( width*width - bombAmount).fill('valid')
    const gameArray = emptyArray.concat(bombsArray)
    const shuffledArray = gameArray.sort(() => Math.random() - 0.5);

    //create the board
    for (let i = 0; i < width*width; i++) {
      const square = document.createElement('div')
      square.setAttribute('id', i)
      square.classList.add(shuffledArray[i])
      grid.appendChild(square)
      squares.push(square)

      //normal click
      square.addEventListener('click', function(e) {
        click(square)
      })

      //cntrl and left click
      square.oncontextmenu = function(e) {
        e.preventDefault()
        addFlag(square)
      }
  	}

    //add numbers
    for (let i = 0; i < squares.length; i++) {
      let total = 0
      const isLeftEdge = (i % width === 0)
      const isRightEdge = (i % width === width -1)
      if (squares[i].classList.contains('valid')) {
          if (i > 0 && !isLeftEdge && squares[i -1].classList.contains('bomb')) total ++
          if (i > 9 && !isRightEdge && squares[i +1 -width].classList.contains('bomb')) total ++
          if (i > 10 && squares[i -width].classList.contains('bomb')) total ++
          if (i > 11 && !isLeftEdge && squares[i -1 -width].classList.contains('bomb')) total ++
          if (i < 98 && !isRightEdge && squares[i +1].classList.contains('bomb')) total ++
          if (i < 90 && !isLeftEdge && squares[i -1 +width].classList.contains('bomb')) total ++
          if (i < 88 && !isRightEdge && squares[i +1 +width].classList.contains('bomb')) total ++
          if (i < 89 && squares[i +width].classList.contains('bomb')) total ++
          squares[i].setAttribute('data', total)
          if (total > 0) squares[i].classList.add('number')
        }
    }
  }
  createBoard();


  //add Flag with right click
  function addFlag(square) {
    if (isGameOver) return
    if (!square.classList.contains('checked') && (flags < bombAmount)) {
      if (!square.classList.contains('flag')) {
        square.innerHTML = '🚩'
        square.classList.add('flag')
        flags ++
        checkForWin()
      } else {
        square.innerHTML = ''
        square.classList.remove('flag')
        flags --
      }
    }
  }

  let firstClick
  //click on a square actions
  function click(square) {
    if (isGameOver) return
    if (square.classList.contains('checked') || square.classList.contains('flag')) return
    if (!firstClick) firstClick = square.id

    if (firstClick) {
      let currentId = square.id
        if (squares[firstClick].classList.contains('bomb')) {
          gameOver(square)
          } else {
          let total = square.getAttribute('data')
          if (total != 0) {
            square.classList.add('checked')
            if (square.classList.contains('bomb')) square.classList.remove('checked')
            square.innerHTML = total
            setTimeout(() => firstClick = null, 500)
            checkForWin()
            return
          }
        checkSquare(square, currentId)
        }
        square.classList.add('checked')
      }
    }

  //check the square once it has been clicked
  function checkSquare(square, currentId) {
    const isLeftEdge = (currentId % width === 0)
    const isRightEdge = (currentId % width === width -1)

    setTimeout(() => {
      if (currentId > 0 && !isLeftEdge) {
        //can refactor to: const newId = parseInt(currentId) -1   ...this is applicable to the below 7 also
        const newId = squares[parseInt(currentId) -1].id
        const newSquare = document.getElementById(newId)
        click(newSquare, newId)
      }
      if (currentId > 9 && !isRightEdge) {
        const newId = squares[parseInt(currentId) +1 -width].id
        const newSquare = document.getElementById(newId)
        click(newSquare, newId)
      }
      if (currentId > 10) {
        const newId = squares[currentId -width].id
        const newSquare = document.getElementById(newId)
        click(newSquare, newId)
      }
      if (currentId > 11 && !isLeftEdge) {
        const newId = squares[parseInt(currentId) -1 -width].id
        let newSquare = document.getElementById(newId)
        click(newSquare, newId)
      }
      if (currentId < 98 && !isRightEdge) {
        const newId = squares[parseInt(currentId) +1].id
        let newSquare = document.getElementById(newId)
        click(newSquare, newId)
      }
      if (currentId < 90 && !isLeftEdge) {
        const newId = squares[parseInt(currentId) -1 +width].id
        let newSquare = document.getElementById(newId)
       click(newSquare, newId)
      }
      if (currentId < 88 && !isRightEdge) {
        const newId = squares[parseInt(currentId) +1 +width].id
       let newSquare = document.getElementById(newId)
       click(newSquare, newId)
      }
      if (currentId < 89) {
        const newId = squares[parseInt(currentId) +width].id
        let newSquare = document.getElementById(newId)
        click(newSquare, newId)
      }
    }, 10)
  }

  //game over
  function gameOver(square) {
    console.log('BOOOOM! Game over!')
    isGameOver = true

    //show ALL the bombs
    squares.forEach(square => {
     if (square.classList.contains('bomb')) {
       square.classList.remove('flag')
       square.innerHTML = '💣'
      }
    })
  }

  //check for win
  function checkForWin(){
    let matches = 0

    for(let i = 0; i < squares.length; i++) {
      if (squares[i].classList.contains('flag') && squares[i].classList.contains('bomb')) {
        matches ++
      }
      if (matches === bombAmount) {
        console.log('YOU WIN!')
      }
    }
  }
})
