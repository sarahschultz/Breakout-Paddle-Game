const grid = document.querySelector('.grid')
const scoreDisplay = document.querySelector('#score')
const blockWidth = 100
const blockHeight = 20
const ballDiameter = 20
const boardWidth = 560
const boardHeight = 300
let xDirection = -2
let yDirection = 2

const userStart = [230, 10] //where our user will always start on the grid
let currentPosition = userStart

const ballStart = [270, 40]
let ballCurrentPosition = ballStart

let timerId
let score = 0


//create individual block class
class Block {
    constructor(xAxis, yAxis){
        //this is our base anchor plot point
        this.bottomLeft = [xAxis, yAxis] 
    //will be the bottom left of the block i.e. the anchor point and where they are on the grid.
        this.bottomRight = [xAxis + blockWidth, yAxis]
        this.topLeft = [xAxis, yAxis + blockHeight]
        this.topRight = [xAxis + blockWidth, yAxis + blockHeight]
    }
}

// All of my blocks:
const blocks = [
    new Block(10, 270),
    new Block(120, 270),
    new Block(230, 270),
    new Block(340, 270),
    new Block(450, 270),
    new Block(10, 240),
    new Block(120, 240),
    new Block(230, 240),
    new Block(340, 240),
    new Block(450, 240),
    new Block(10, 210),
    new Block(120, 210),
    new Block(230, 210),
    new Block(340, 210),
    new Block(450, 210),
]


//draw all of my blocks
function addBlocks() {
    for (let i = 0; i < blocks.length; i++) {
      const block = document.createElement('div')
      block.classList.add('block')
      block.style.left = blocks[i].bottomLeft[0] + 'px'  
      block.style.bottom = blocks[i].bottomLeft[1] + 'px'  
      grid.appendChild(block)
      console.log(blocks[i].bottomLeft)
    }
}

addBlocks()

//add user
const user = document.createElement("div")
user.classList.add("user")
drawUser()
grid.appendChild(user)



//Create a ball to play with
const ball = document.createElement("div")
ball.classList.add("ball")
grid.appendChild(ball)
drawBall()

//move user
function moveUser(e) {
    switch (e.key) {
        case 'ArrowLeft':
            if (currentPosition[0] > 0) {
                currentPosition[0] -= 10
                console.log(currentPosition[0] > 0)
                drawUser()   
            }
            break
            case 'ArrowRight':
                if (currentPosition[0] < (boardWidth - blockWidth)) {
                    currentPosition[0] += 10
                    console.log(currentPosition[0])
                    drawUser()   
                }
            break
    }
}
document.addEventListener('keydown', moveUser)
        
                        
//draw the user
    function drawUser(){
        user.style.left = currentPosition[0] + "px"
        user.style.bottom = currentPosition[1] + "px"   
    }
        
//draw the ball
    function drawBall(){
        ball.style.left = ballCurrentPosition[0] + "px"
        ball.style.bottom = ballCurrentPosition[1] + "px"
    }
    
//Move the ball
function moveBall(){
    //we have to add x and y axis to make it move, like adding them together would make the ball look like it's flying diagonally. So we'll need over on x-axis 2 ([0]+=2) and up on y-axis 2 ([1]+=2)
    ballCurrentPosition[0] += xDirection
    ballCurrentPosition[1] += yDirection
    drawBall()
    checkForCollisions()
}
//alright need some logic to keep the ball in the grid then the blocks
timerId = setInterval(moveBall, 30)


//check for the ball colliding into shit
function checkForCollisions() {
    //check for block collisions phew - let's use a for loop for those bad boys
    //check if the ball is in between the block's bottom left x-axis and bottom right x-axis and of course the height. So... IF it's in there, THEN it's a collision
    for (let i = 0; i < blocks.length; i++){
        if(
          (ballCurrentPosition[0] > blocks[i].bottomLeft[0] && ballCurrentPosition[0] < blocks[i].bottomRight[0]) &&
          ((ballCurrentPosition[1] + ballDiameter) > blocks[i].bottomLeft[1] && ballCurrentPosition[1] < blocks[i].topLeft[1]) 
        )
        {
            const allBlocks = Array.from(document.querySelectorAll(".block"))
            allBlocks[i].classList.remove("block") //now have to remove the block from the array
            blocks.splice(i, 1)//just the one item at that index
            changeDirection()
            score++
            scoreDisplay.innerHTML = score

            //check for win condition
            if (blocks.length === 0) {
                scoreDisplay.innerHTML = "You Win"
                alert("You Win!")
                clearInterval(timerId)
                document.removeEventListener("keydown", moveUser)
            }
        }
    }
//this is where we'll set the boundaries for which the ball to sense a collision lation in the changeDirection function
    if (
        ballCurrentPosition[0] >= (boardWidth - ballDiameter) || 
        ballCurrentPosition[1] >= (boardHeight - ballDiameter) ||
        ballCurrentPosition[0] <= 0
        ) {
        changeDirection()
    }

    //check for user collisions
    if
        (
        (ballCurrentPosition[0] > currentPosition[0] && ballCurrentPosition[0] < currentPosition[0] + blockWidth) &&
        (ballCurrentPosition[1] > currentPosition[1] && ballCurrentPosition[1] < currentPosition[1] + blockHeight ) 
        )
    {
    changeDirection()
    }
 
//check for game over! (because you're a loser if the ball falls through under the "paddle" i.e. user)
    if (ballCurrentPosition [1] <= 0) {
        clearInterval(timerId)
        scoreDisplay.innerHTML = "You Lose!!"
        alert("You Lose!!")
        document.removeEventListener("keydown", moveUser)
    }
}

function changeDirection() {
    if (xDirection === 2 && yDirection === 2) {
      yDirection = -2
      return
    }
    if (xDirection === 2 && yDirection === -2) {
      xDirection = -2
      return
    }
    if (xDirection === -2 && yDirection === -2) {
      yDirection = 2
      return
    }
    if (xDirection === -2 && yDirection === 2) {
      xDirection = 2
      return
    }
}
