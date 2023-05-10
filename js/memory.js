"use strict";

// Card Class
class Card {
    constructor(cardObject){
        this.card1 = cardObject.card1;
        this.card2 = cardObject.card2;
        this.set = cardObject.set;
        this.sound = cardObject.sound;
    }
}


// linking field + click function
const myField = document.getElementById('field');
myField.addEventListener('click', onClickCard);


// Variables for board sizing (onSelectFields)
const fieldBoard = document.getElementById('fieldBoard')
fieldBoard.addEventListener('change', onSelecFieldSize);
// resets the game if player selects differen size
fieldBoard.addEventListener('change', resetGame);

// variable for username + event
const displayName = document.getElementById("displayName");
window.addEventListener("load", inputUsername)

//BUTTONS
const resetButton = document.getElementById("btn3");
const startButton = document.getElementById("startbtn");
const stopButton = document.getElementById("stopbtn");

//BUTtON EVENTS
// resets the game
resetButton.addEventListener("click", resetGame);





// VALUE HOLDERS
//  value holder for selected field-size in onSelectFields();
let boardClass = "";
// value holder for outcome onSelectFields()
let myCardSet = "";
// place holder for card imported from JSON
let myCardArray = "";
//user picks  value
let tile1 = "";
let tile2 = "";
// score holders
let tries = 0;
let score = 0;




// fetch API + creates new card
fetch("js/cards.json")
.then(response => response.json())
 .then(data => {
 myCardArray = data.map(card => new Card(card));
console.log(myCardArray)
});





// FUNCTIONS

// creating card + link to image + link to screen
function populateField(myCardSet){
    myField.innerHTML = "";
    myCardSet.forEach(card =>{
        // create div + img + img cover
        let newTile = document.createElement('div');
        let newCard = document.createElement('img');
        let cover = document.createElement('img');

        // give class board(4,5,6 based on selection) + link image
        newTile.setAttribute("class", boardClass);
        let imageURL = "img/" + card.card1 +".jpg";
        // connecting array elents to images to get a auto fill 
        newCard.setAttribute("src", imageURL);
        newCard.setAttribute("data-id", card.card1);
        // sets the cover image
        cover.setAttribute("src", "img/cover.png",);
        // giving cover tiles the class name of "covered"
        cover.setAttribute("class", "covered");
        // cards getting their own name based on array name
        newCard.setAttribute("name", card.card1);

        // Creating a tile in field(html)
        newTile.appendChild(newCard);
        newTile.appendChild(cover);
        myField.appendChild(newTile);
      
    });
}


//sets class name to "uncovered" when clicked 
//works together with evaluateMatch to find match
function onClickCard(e){

// sets class to uncovered when clicked / will make cover display none
    if(e.target.className === "covered"){
        e.target.className = "uncovered";
    }

    // pushed click into array
    if(tile1 === ""){
        tile1 = e.target.parentNode.childNodes
    }else if(tile2 === ""  && tile1 !== ""){
        tile2 = e.target.parentNode.childNodes

        // prevents double clicking target
    }if(tile1 === tile2){
        tile2 = "";
    }

    //checks for match
    if(tile1 !== "" && tile2 !== ""){
        evaluateMatch(tile1, tile2);
    }


}


// removes click  then adds it back after delay
function evaluateMatch(){

// removes abilitie to click cards
myField.removeEventListener("click", onClickCard)

if(tile1[0].name === tile2[0].name){
    playAudio(tile1[0].name);
}
  // checks if card is a match + adds a delay
    setTimeout(nextMove, 1500) ;
}


// checks if card is a match then removes or covers tile
function nextMove(img1,img2){
    img1 = tile1[0].name
    img2 = tile2[0].name

   //if match,  tiles dissapear
    if(img1 === img2){
        tile1[0].className = "uncovered"
        tile2[0].className = "uncovered"
        // gives tries and score +1
        keepScore(true);

    // if no match, tiles turn red
    }else if(img1 !== img2){
        tile1[1].className = "covered"
        tile2[1].className = "covered"
        //lets gives tries + 1
        keepScore(false);
        } 

        // resets values for next card
        tile1 = "";
        tile2 = "";
        // add back click to myfield
        myField.addEventListener("click", onClickCard);
}


// fisher shuffle to make the tiles random
function shuffle(array) {
    var m = array.length, t, i;
  
    // While there remain elements to shuffle…
    while (m) {
  
      // Pick a remaining element…
      i = Math.floor(Math.random() * m--);
  
      // And swap it with the current element.
      t = array[m];
      array[m] = array[i];
      array[i] = t;
    }
  
    return array;
  }



// Function to select board size
function onSelecFieldSize(e){
    // select value of fieldBoard (HTML)
   let size = fieldBoard.value
   // shuffle card array
   const randomCards = shuffle(myCardArray);
   //place holder for switch outcome
   let cloneCards = '';

    switch(size){
        case "4": 
        // assinging board4 value + using first 8 elements of myCardArray
        boardClass = "board4";
        cloneCards = randomCards.slice(0,8);
        //highscore(); // was board4() but functions didnt work on board5 board6
        break;

        case "5": 
        // assinging board5 value + using first 12 elements of myCardArray
        boardClass = "board5";
        cloneCards = randomCards.slice(0,12);
        // not working myBoard5();
        break;
        
        case "6": 
        // assinging board6 value + using first 18 elements of myCardArray
        boardClass = "board6";
        cloneCards = randomCards.slice(0,18);
        /// not working myBoard6();
        break;

    }
    let myCardSet = cloneCards;
    myCardSet = myCardSet.concat(cloneCards)
    myCardSet = shuffle(myCardSet);
    populateField(myCardSet);
  }


// lets user select a name and saves it in localstorage
function inputUsername(){
    let username = localStorage.getItem("username");
    if(!username){
        username = prompt("Please enter username");
        localStorage.setItem("username", username);
    }
    displayName.innerHTML = "Welcome" + "<br>" + "<br>" + username;

    if(username === localStorage.getItem("username")){
        alert("Welcome back," + " " + username)
    }
}


// increments score of layer
function keepScore(outcome){
    // tries counter get +!
    if (outcome === false){
        tries ++;

    // tries and score counter + 1
    }else if(outcome === true){
        score ++;
        tries ++;
    }
    // show tries + score on screen
    document.getElementById("attempts").innerHTML = tries;
    document.getElementById("score").innerHTML =  score;   

}


// plays animal sound when there is match
function playAudio(match){
const audio = new Audio("./audio/"+match+ ".wav");
    audio.playbackRate = 1.8;
    audio.play();
}


// resets game
function resetGame(){
    // resets card values
   tile1 = "";
   tile2 = "";

    // resets scores + innerHTML
   tries = 0;
   score = 0;
   document.getElementById("attempts").innerHTML = tries;
   document.getElementById("score").innerHTML =  score;   

   
    // resets all the cards 
    onSelecFieldSize();

    // fixes bugg when player resets game while cards are evaluating (you where not able to click the cards after that)
    myField.addEventListener('click', onClickCard);

}




