/*Other To Do's 
  1. Have countdown timer restart and reshuffle card
  2. consolidate duplicate variables
  3. when I write the blog maybe look thru Sandy's and some of the other code to see what they did different and gather best practices from doing so
*/

const cardsArray = document.querySelectorAll('.card');
let timer = document.getElementById('timer');
let flips = 0
document.getElementById('flips').innerHTML = 'Flips: ' + flips;

// this function needs to reset the timer
let seconds;
let startTimer = function() {
  seconds = 50;
  timer.innerHTML = 'Timer: ' + seconds;
  seconds--;
  let countdown = function() {
    timer.innerHTML = 'Timer: ' + seconds--;
    if (seconds < 0) {
      clearInterval(interval);
    }
  }
  let interval = setInterval(countdown,1000);
}
startTimer();

//reset game
let reset = document.getElementById('reset');

let restart = function(){
  for(let i = 0; i < cardsArray.length; i++){
    cardsArray[i].className = 'card';
  }
  seconds = 0;
  setTimeout(function () {
    startTimer();
    flips = 0;
    document.getElementById('flips').innerHTML = 'Flips: ' + flips;
  }, 1000);
}
reset.addEventListener('click',restart);

//Populate card fronts
for (let i = 0; i < cardsArray.length; i++){
  let img = document.createElement('img');
  img.src = 'https://freddooley.com/wp-content/uploads/2019/11/Tech.png';
  let cardFront = cardsArray[i].children[0];
  cardFront.appendChild(img);
}

//Make card bank
let syntaxBank = [
                  ['consol.log( );','puts, print, p'],
                  ['===','=='],
                  ['!==','!='],
                  ['if( ){...}else{...}','if...else...end'],
                  ['parseInt(float)','float.to_i'],
                  ['s[s.length-1]','s[-1]'],
                  ['int.to_String( )','int.to_s'],
                  ['//','#'],
                  ['let, var, const var_name','var_name'],
                  ['function isFalse( ){ }','def is_false?'],
                  ['while( ){ }','while...do...end'],
                  ['.includes','.include?'],
                  ['camelCase','snake_case'],
                  ['.indexOf( )','.index( )'],
                  ['\'${ }\'','\'#{ }\'']
                ];

let javascript = function(){
  let js = [];
  for(let i = 0; i < syntaxBank.length; i++){
    js.push(syntaxBank[i][0]);
  }
  return js;
}
let js = javascript();

let rubyStrip = function(){
  let ruby = [];
  for(let i = 0; i < syntaxBank.length; i++){
    ruby.push(syntaxBank[i][1]);
  }
  return ruby;
}
let ruby = rubyStrip();

const languages = {JS:js,Ruby:ruby};

let setUpGame = function () {
  //pick 8 cards
  let pick8 = function(){
    var temp = [];
    while (temp.length < 8){
      var randI = Math.floor(Math.random()*syntaxBank.length);
      if (!temp.includes(syntaxBank[randI])){
        temp.push(syntaxBank[randI]);
      }
    }
    return temp;
  }
  let cards8 = pick8();

  //shuffle
  let shuffle = function(){
    //turning into a 1D array
    let cards8_1d = [];
    for (let i = 0; i < cards8.length; i++){
      for(let j = 0; j < cards8[i].length; j++){
        cards8_1d.push(cards8[i][j]);
      }
    }
    //Fisher-Yates shuffle
    let i = cards8_1d.length, randI, temp;
    while(--i > 0){
      randI = Math.floor(Math.random()*cards8_1d.length);
      temp = cards8_1d[randI];
      cards8_1d[randI] = cards8_1d[i];
      cards8_1d[i] = temp;
    }
    return cards8_1d;
  }
  let shuffled = shuffle();

  //populate HTML card backs with the the shuffled data and coresponding style
  for(let i = 0; i < cardsArray.length; i++){
    let cardBack = cardsArray[i].children[1];
    cardBack.children[0].innerHTML = shuffled[i];
    if(js.includes(shuffled[i])){
      cardBack.children[1].innerHTML = 'JS';
      cardBack.children[1].title = 'JS';
      cardBack.style.backgroundColor = '#ffde59';
    } else {
      let img = document.createElement('img');
      img.src = '/Assets/card_back.png/';
      cardBack.children[1].appendChild(img);
      cardBack.children[1].title = 'Ruby';
      cardBack.style.backgroundColor = '#ffaeae';
    }
  }
}
setUpGame();

// ------------------------------------Game Play------------------------------------
//have this funciton just return a single card's index
let findIndex = function(event) {
  let cardBackChildren = event.target.parentElement.nextElementSibling.children
  let backText = cardBackChildren[0].innerHTML;
  let backLanguage = cardBackChildren[1].title;
  let i = languages[backLanguage].indexOf(backText);
  return i;
}

let alreadyFipped = function (event) {
  //if the user clicks on the backText or backLanguage
  if(event.target.parentElement.parentElement.className.includes('visible')) {
    return true;
  //if the user clicks on the back of the card
} else if (event.target.parentElement.className.includes('visible')) {
    return true;
  //otherwise we have not clicked on an already turned over card
  } else {
    return false;
  }
}

let flipCard = function(event){
  event.target.parentElement.parentElement.classList.toggle('visible');
}

let firstCardEvent;
let firstCardI = "";

let playGame = function(event){
  //if we are clicking on an already flipped card don't run the game sequence
  if(!alreadyFipped(event)) {
    flips += 1;
    document.getElementById('flips').innerHTML = 'Flips: ' + flips;
    flipCard(event);

    if (firstCardI === ""){
      firstCardI = findIndex(event);
      firstCardEvent = event;

    } else {

      let secondCardI = findIndex(event);
      let secondCardEvent = event;
      cards.removeEventListener('click',playGame);

      setTimeout(function(){
        if(firstCardI !== secondCardI){
          //Timeout so that the second card doesn't flip back automatically
          flipCard(firstCardEvent);
          flipCard(secondCardEvent);
        }
        firstCardI = "";
        cards.addEventListener('click',playGame);
      },1500);
    }
  }
}

// Adding the event listener
let cards = document.getElementById('grid');
cards.addEventListener('click',playGame);
