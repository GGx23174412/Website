// main canvas set up
const mainCanvas = document.getElementById("mainCanvas");
const mainContext = mainCanvas.getContext("2d");
mainCanvas.width = 1000;
mainCanvas.height = 1000;
let shotsOnTarget = 0;
let currentStreak = 0;
let longestStreak = 0;
let finalScore = 0;
let gameDuration = 120000;
let timePlayed = 0;
mainContext.font = "20px Impact";
mainContext.fillStyle = "Black";

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
        mainContext.fillRect(this.x, this.y, this.width, this.height);
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
    // Calculate the coordinates relative to canvas, considering offset to client window and eventual scalling due to styling
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

// 
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

// auxiliary variables - these are used in the animation loop (found below)
// to help track time between frames and to determine when to spawn a new object. 
// To ensure uniformity on different cpus a new cookie object will be generated every 500 milliseconds.
let timePlayer = 0;
let timeSinceLastSpawn = 0;
let previousTimestamp = 0;
const spawnInterval = 500;
let request;

// Animation loop - updates animation and requests new frame
function animate(timestamp){
    // Clear canvas
    mainContext.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
    // track time between frames (cpu dependent)
    // and determine when it's time to create a new object
    let timePassed = timestamp - previousTimestamp;
    previousTimestamp = timestamp;
    timeSinceLastSpawn += timePassed;
    if(timeSinceLastSpawn >= spawnInterval){
        cookies.push(new Cookie());
        timeSinceLastSpawn = 0;
    }
    // update and draw timer
    timePlayed += timePassed;
    let timeLeft = gameDuration - timePlayed;
    drawTimer(formatTime(timeLeft));
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

// Start animation loop - initial value of zero required to avoid undefined errors
//animate(0);
function startGame(){
    document.getElementById("gameOverlay").style.visibility = "hidden";
    animate(0);
}

function stopGame(){
    cancelAnimationFrame(request);
    document.getElementById("gameOverlay").style.visibility = "visible";
}


// Formats a number of milliseconds into a MM:SS string
// Parameters: time - number of milliseconds
// Return: a string represent the time in the format "mm:ss"
function formatTime(milliseconds){
    let minutes = Math.floor((milliseconds / 1000) / 60);
    let seconds = Math.floor(milliseconds / 1000) % 60;

    if (seconds < 10){
        seconds = "0" + seconds;
    }
    if (minutes < 10){
        minutes = "0" + minutes;
    }

    return minutes + ":" + seconds;
}
