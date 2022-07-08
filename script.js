//====================================================================================== CONSTANT VARIABLES
const colours = ['red', 'green', 'blue', 'orange', 'purple', 'gray'];//    color: rgb(68, 253, 176)
const rgbs =  [ 'rgb(255, 89, 89)', 'rgb(89, 255, 186)', 'rgb(113, 146, 253)', 'rgb(247, 135, 91)', 'rgb(233, 127, 247)', 'rgb(138, 138, 138)' ];
const startButton = document.getElementById("startButton");
const backButton = document.getElementById("back");
const timerDisplay = document.getElementById("timerDisplay");
const displayPanel = document.getElementById("displayPanel");
const grid = document.getElementById("grid");

//====================================================================================== GAME PLAY VARIABLES
let gameState = "NOT-RUNNING"; //States include: RUNNING, NOT-RUNNING
let gameTime = 0;
// variables updates when user clicks a cell
let savedCell = null; // null at game start
let savedColour = ""; // empty at game start
let colourMatchCount = 0; // + 1 every time a colour match

//====================================================================================== UPDATE FUNCTION - CALLED EVERY SECOND
window.setInterval(update, 1000);

//====================================================================================== REUSABLE FUNCTIONS
function getRandomNum(array){
    let num = Math.floor(Math.random() * array.length); 
    return num;
} // end function getRandomNum

function updateDisplay(text, textColour){
    displayPanel.innerHTML = text;
    displayPanel.style.color = textColour;
}
//== RE-SET FUNCTION (reset global variables)
function resetGlobals(){
    gameTime = 0; //timer reset to 0 at start of game
    savedCell = null; // null at game start
    savedColour = ""; // empty at game start
    colourMatchCount = 0; // + 1 every time a colour match
}
//== FUNCTION HIDE + CLEAR GAME SCREEN ELEMENTS
function hideGameScreen(){ // hide and clear all game screen elements
    backButton.style.display = "none";
    displayPanel.style.display = "none";
    displayPanel.innerHTML = "";
    timerDisplay.style.display = "none";
    timerDisplay.innerHTML = "0 seconds elapsed";
    grid.innerHTML = "";
}
//== FUNCTION TO SHOW GAME SCREEN ELEMENTS
function showGameScreen(){
    displayPanel.style.display = "block";
    timerDisplay.style.display = "block";
    backButton.style.display = "block";
}
//====================================================================================== FUNCTION START BUTTON
function start(){
    console.log('Game Starting');
    gameState = "RUNNING";
    startButton.style.display = "none"; // hide start screen
    showGameScreen();
    buildGrid();
}

//====================================================================================== FUNCTION UPDATE (GAME STATE CHECK - UPDATES GAME TIME)
function update(){
  if(gameState == "RUNNING") {
        gameTime++; // every second 1 is added to the gameTime counter
        timerDisplay.innerHTML = gameTime + " seconds elapsed";  // update timerDisplay every second
    } else if(gameState == "NOT-RUNNING") {
        //game is over - timer stops updating - display panel gets updated   (SEE CELL CLICKED FUNCTION)  
    }
}
//====================================================================================== FUNCTION BACK BUTTON
function back(){
    gameState = "NOT-RUNNING";
    resetGlobals(); // reset global variables for new game
    hideGameScreen();
    startButton.style.display = "inline-block"; // shows start screen
}
//====================================================================================== FUNCTION BUILD GRID
function buildGrid(){

    grid.style.width = "600px";
    grid.style.height = "600px";
    
    // build 6 x 6 grid  
    for (var row = 0; row < 6; row++){
        for(var column = 0; column < 6; column++){
            var cell = document.createElement("div");
            cell.style.display = "inline-block";
            cell.style.width = "96px";
            cell.style.height = "96px";
            cell.style.border = "2px solid black";
            cell.style.borderRadius = "5%";
            cell.style.margin = "0 2px";
            cell.style.boxShadow = "6px 5px 5px rgba(0, 0, 0,.2)";
            cell.onclick = (event)=> { //  add onclick to thumbnail- event is passed as parameter
                cellClicked(event);
            }
            grid.append(cell);

        }
    }

    // random colour cells
    let cells = grid.childNodes; // object holding all cells(children of grid) - creates an object of all grid child elements
    let numbersArray = Object.keys(cells); // create array of numbers(index) - creates an array with the keys (index) of all cells
    console.log(numbersArray);
    
    while(numbersArray.length > 0){ // while the array has elements

        // generate a random colour - happens 18 times(half the length of the array)
        let colourIndex = getRandomNum(colours); //generate random num 0..5 - random num func takes colours array and gets num between 0 and 5
        let colourName = colours[colourIndex]; //colour name(class) //colourIndex(random each time) used to get colour name and rgb code
        let rgb = rgbs[colourIndex]; // corresponding rgb code
        
        for(var i = 0; i < 2; i++){ // do 2 times to make colour pairs- then end and generate new random colour
            let index = getRandomNum(numbersArray); // get random num from between 0 and length of numbers array - length reduces by one each loop
            let cellIndex = parseInt(numbersArray[index]); // returned number from numbersArray won't match up with random number generated after first loop
            let cell = cells[cellIndex];// every cell is individually targeted
            cell.style.background = rgb; 
            cell.className = colourName; 
            numbersArray.splice(index, 1); // remove element from numbers array                                                                       
        } 
    }
} // end function buildGrid

//====================================================================================== ONCLICK FUNCTION - CELL CLICKED
function cellClicked(cell){

    let clickedCell = cell.srcElement;
    let clickedColour = clickedCell.className;
    let clickedRgbCode = clickedCell.style.background;

    //jquery to add/remove click focus styling
    $(clickedCell).siblings().css("border", "2px solid black");// get all siblings of clicked cell and remove styling(won't be any the first time)
    $(clickedCell).css("border", "6px solid black"); // css styling to clicked element only
   
    // match colours & count pairs
    if (savedColour == clickedColour && clickedCell != savedCell){ //clicked cell not equal to saved cell - to ensure double clicking same cell doesn't cause a match
        savedCell.style.background = 'rgb(0, 0 ,0)';
        savedCell.className = 'black';
        clickedCell.style.background = 'rgb(0, 0 ,0)'; 
        clickedCell.className = 'black';       
        savedCell = null; // reset saved cell and saved colour if pair matched - for next loop
        savedColour = "";
        colourMatchCount ++;
    } else{
        savedCell = clickedCell;
        savedColour = clickedColour;
    } 

    // check win conditions
    if(colourMatchCount < grid.childNodes.length/2){  // if less than 18 (less than 18 pairs)
        updateDisplay(clickedColour, clickedRgbCode);
    } else if(colourMatchCount == grid.childNodes.length/2){ // else if 18 pairs have been found(36 cells)
        gameState = "NOT-RUNNING";
        updateDisplay('Game Over<br>' + gameTime + " seconds", 'black');   
    }

} // end function cellClicked
