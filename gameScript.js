// main canvas set up
const mainCanvas = document.getElementById("mainCanvas");
const mainContext = mainCanvas.getContext("2d");
mainCanvas.width = 1000;
mainCanvas.height = 1000;
mainContext.font = "20px Impact";
mainContext.fillStyle = "Black";

// variables to track player's score
let shotsOnTarget = 0;
let currentStreak = 0;
let longestStreak = 0;
let finalScore = 0;

// variables to track in game time - in seconds
let gameDuration = 120;
let timePlayed = 0;

// stores id returned by the setInterval function used to track timePlayed
let gameInterval = null; 

// auxiliary variables - these are used in the animation loop
// to help track time between frames and to determine when to spawn a new object. 
// To ensure uniformity on different cpus a new cookie object will be generated every 500 milliseconds.
let timeSinceLastSpawn = 0;
let previousTimestamp = 0;
const spawnInterval = 500; // milliseconds

// Cookie class - defines a cookie object to be drawn in mainCanvas
class Cookie{
    constructor(){
        // dimensions
        this.width = 100;
        this.height = 100;
        // starting coordinates
        this.y = 0;
        this.x = Math.random() * (mainCanvas.width - this.width);
        // speed - how much y position changes between frames
        this.directionY = (Math.random() * 2) + 3;
        // image to be drawn      
        this.image = new Image();
        this.image.src = "cookieSmall.png";
        // boolean to determine when object reaches bottom of canvas
        this.canBeDeleted = false;
        // boolean to determine if mouse click is whithin the object's rectangle
        this.isShot = false;
    }

    updatePosition(){
        // Note: top left of canvas is coordinate x = 0; y = 0
        // when moving down, y increases
        this.y += this.directionY;
        // Object is marked for deletion if it has passed canvas bottom
        if(this.y >= mainCanvas.height){
            this.canBeDeleted = true;
        }
    }

    draw(){
        //mainContext.fillRect(this.x, this.y, this.width, this.height);
        mainContext.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
}

// draws score text in mainCanvas
function drawScore(){
    mainContext.fillText("Shots on target: " + shotsOnTarget, 10, 30);
    mainContext.fillText("Current streak: " + currentStreak, 10, 50);
    mainContext.fillText("Longest streak: " + longestStreak, 10, 70);
}

function drawTimer(timeStr){
    mainContext.fillText(timeStr, (mainCanvas.width - 100), 30);
}

// Gets the coordinates of a mouse click and checks if any cookie object was hit
// object is hit if mouse click coordinates are within the rectangle defined by the 
// object's x and y coordinates (top left corner) and the object's width and height
window.addEventListener("click", function(e){
    // The event gets the coordinates relative to the client window
    let xWindow = e.x;
    let yWindow = e.y;
    // Calculate the coordinates relative to canvas top left corner, 
    // considering offset to client window and eventual scalling due to styling
    let canvasRect = mainCanvas.getBoundingClientRect();
    let xCanvas = (xWindow - canvasRect.left) / (canvasRect.right - canvasRect.left) * mainCanvas.width;
    let yCanvas = (yWindow - canvasRect.top) / (canvasRect.bottom - canvasRect.top) * mainCanvas.height;
    // check if object is hit and update drawn image and score
    cookies.forEach(object =>{
        if(!object.isShot &&
            xCanvas >= object.x && 
            xCanvas <= (object.x + object.width) &&
            yCanvas >= object.y && 
            yCanvas <= (object.y + object.height)){
                object.isShot = true;
                object.image.src = "coalSmall.png"
                shotsOnTarget++;
                currentStreak++;
        }
    })
})

// array to store cookie objects
let cookies = [];

// Updates the value of longestStreak. A streak is interrupted if an object that's not been shot 
// reaches the bottom of the canvas.
function computeStreak(){
    for(i = 0; i < cookies.length; i++){
        if(cookies[i].canBeDeleted && !cookies[i].isShot){
            if(currentStreak > longestStreak){
                longestStreak = currentStreak;
            }
            currentStreak = 0;
            break;
        }
    }
} 


// Animation loop - updates animation and requests new frame
function animate(timestamp){
    // Clear canvas
    mainContext.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
    // track time between frames
    // and determine when it's time to create a new object
    let timePassed = timestamp - previousTimestamp;
    previousTimestamp = timestamp;
    timeSinceLastSpawn += timePassed;
    if(timeSinceLastSpawn >= spawnInterval){
        cookies.push(new Cookie());
        timeSinceLastSpawn = 0;
    }
    // update and draw timer
    let timeLeft = gameDuration - timePlayed;
    drawTimer(formatTime(timeLeft));
    if(timeLeft <= 0){
        stopGame();
    }
    // draw score
    drawScore();
    // update and draw cookies
    cookies.forEach(object => object.updatePosition());
    cookies.forEach(object => object.draw());
    // Update streak count - must be done before removing objects marked for deletion
    computeStreak();
    // remove objects that can be delete from array
    cookies = cookies.filter(object => !object.canBeDeleted);  
    // request new frame
    request = requestAnimationFrame(animate);
}


function startGame(){
    resetGame();
    document.getElementById("gameOverlay").style.visibility = "hidden";
    animate(0);
    // timer loop to track time (seconds) played - repeates every second
    gameInterval = setInterval(function(){
        timePlayed++;
    }, 1000);
}

function calculateFinalScore(){
    if(currentStreak > longestStreak){
        longestStreak = currentStreak;
    }
    finalScore = shotsOnTarget + longestStreak * 10; 
}

function stopGame(interval, request){
    computeStreak();   
    clearInterval(interval);
    cancelAnimationFrame(request);
    mainContext.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
    cookies = [];
    calculateFinalScore();
    document.getElementById("cookiesShot").innerHTML = shotsOnTarget;
    document.getElementById("bestStreak").innerHTML = longestStreak;
    document.getElementById("score").innerHTML = finalScore;
    document.getElementById("gameOverlay").style.visibility = "visible";
}


// Formats a number of seconds into a MM:SS string
// Parameters: time - number of seconds
// Return: a string represent the time in the format "mm:ss"
function formatTime(time){
    let minutes = Math.floor(time / 60);
    let seconds = time % 60;
    
    if (seconds < 10){
        seconds = "0" + seconds;
    }
    if (minutes < 10){
        minutes = "0" + minutes;
    }

    return minutes + ":" + seconds;
}

function resetGame(){
    shotsOnTarget = 0;
    currentStreak = 0;
    longestStreak = 0;
    timePlayed = 0;
    gameInterval = null;
}