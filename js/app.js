/****
*  GLOBAL VARIABLES
***/

NUMBER_OF_ICONS = 8;

// icons is a list that holds 12 unique icons.
// We will randomly choose 8 of them for each game
ICONS = ["paper-plane",
             "diamond",
             "anchor",
             "bolt",
             "cube",
             "leaf",
             "bicycle",
             "bomb",
             "car",
             "camera",
             "key",
             "money"];

TARGET_CARD = null;
MATCHED_PAIRS = 0;
MOVES = 0;
TIMER_ID = 0;

MATCH_ON_GOING = false;
TIME_SPENT = 0;

/****
* Card class
***/

// basic Object-Oriented design for the game card
const Card = function(icon) {
 this.icon = icon;
}

/****
*  New game setting up
***/

const newGame = () => {
    resetStats();
    setMoveCounter(0);
    drawCards();
    setGameTimer();
}

const resetStats = () => {
  TARGET_CARD = null;
  MATCHED_PAIRS = 0;
  MOVES = 0;
  TIME_SPENT = 0;
}


// Method that draws cards onto the deck
const drawCards = () => {
  // Shuffle icons
  let icons = shuffle(ICONS);

  // Each time we select first 8 icons from randomly shuffled
  // icons array and create 2 cards for each of the icon selected.
  let cards = [];

  for (let i = 0; i < NUMBER_OF_ICONS; ++i) {
    for (let j = 0; j < 2; ++j) {
      let thisCard = new Card(icons[i]);
      cards.push(thisCard);
    }
  }

  cards = shuffle(cards);


  // Remove previous cards and append new cards.
  let deck = document.getElementsByClassName('deck')[0]
  deck.innerHTML = "";

  // Iterate through the card list
  //to create HTML implementation for each of them
  for (let i = 0; i < cards.length; ++i) {
    let thisCard = cards[i];

    // Create card container
    let cardElement = document.createElement('li');
    thisCard.htmlNode = cardElement;
    cardElement.classList.add('card');


    // Create game card icon
    let iconElement = document.createElement('i');
    iconElement.classList.add('fa');
    iconElement.classList.add('fa-' + thisCard.icon);

    // Add listerner to each card element
    cardElement.addEventListener('click', (e) => {
      clickCard(thisCard);
    });

    // Put icon onto the card
    cardElement.appendChild(iconElement);
    // Put card onto the deck
    deck.appendChild(cardElement)
  }
}





/****
* Game-related settings
***/

// Wire up the Reset Game button
const resetButtonSetUp = () => {
  const resetButton = document.getElementsByClassName('restart')[0];
  resetButton.addEventListener('click', (e) => {
    e.preventDefault();
    newGame();
  });
}


// Set up pop-up overlay
const setUpOverlay = () => {
  const overlay = document.getElementsByClassName('overlay')[0];
  overlay.addEventListener('click', e => {
    e.preventDefault();
    overlay.style.visibility = 'hidden';
    document.getElementsByClassName('container')[0].classList.remove('blur');
  });

  const button = document.getElementsByClassName('popup-button')[0];
  button.addEventListener('click', (e) => {
    e.preventDefault();
    newGame();
  });
}

// Set up Timer
const setGameTimer = () => {
  clearInterval(TIMER_ID);
  num = 0;
  TIMER_ID = setInterval(() => {
    changeTimer(num++);
  }, 10);
}

const changeTimer = num => {
  TIME_SPENT = num / 100;
  document.getElementsByClassName('timer')[0].innerHTML = TIME_SPENT;
}

// Change moves
const setMoveCounter = num => {
  setStars(num, document.getElementsByClassName('stars')[1].children);
  document.getElementsByClassName('moves')[0].innerHTML = num;
}

// Helper functions that change star's filling
const setBlackStar = listItem => {
  // console.log(starElement.classList);
  starElement = listItem.children[0];
  if (starElement.classList.contains('fa-star-o')) {
    // console.log(true);
    starElement.classList.remove('fa-star-o');
    starElement.classList.add('fa-star');
  }
}

const setWhiteStar = listItem => {
  starElement = listItem.children[0];
  if (starElement.classList.contains('fa-star')) {
    // console.log(true);
    starElement.classList.remove('fa-star');
    starElement.classList.add('fa-star-o');
  }
}


/****
* Game Logic Module
***/

// To save memory, we only use one variable 'TARGET_CARD' to hold
// the target card and a counter to track the num of total
// matched pairs

// Click card listener
const clickCard = (thisCard) => {
  let cardElement = thisCard.htmlNode;

  // click on an open card shall have no effect
  if (MATCH_ON_GOING || cardElement.classList.contains('open')) {
    return;
  }

  // flip an unopen card
  flip(cardElement);
  setMoveCounter(++MOVES);


  if (TARGET_CARD === null) {
    // if this is the first opened card in a pair
    TARGET_CARD = thisCard;
  } else {
    // if not, check if matched with current target
    MATCH_ON_GOING = true;

    // delay checking for animation
    setTimeout(() => {
      if (!checkMatch(thisCard)) {
        flipBackCard(thisCard);
      } else {
        markMatch(thisCard);
    }
    // either way, we need to set TARGET_CARD back to null and
    // mark macthing completed
    TARGET_CARD = null;
    MATCH_ON_GOING = false;
  }, 500);
  }
}


// Method that handles no-match scenario
const flipBackCard = thisCard => {
  // if no match, flip both cards back
  //TODO animation for unmatch
  flip(TARGET_CARD.htmlNode);
  flip(thisCard.htmlNode);
}


// Method that handles matches
const markMatch = thisCard => {
  //TODO animation for matched

  // add proper css decoration
  thisCard.htmlNode.classList.add('match');
  TARGET_CARD.htmlNode.classList.add('match');

  // if match, increment MATCHED_PAIRS
  // and check if game should end
  if (++MATCHED_PAIRS === NUMBER_OF_ICONS) {
    endGame();
  }
}

// Match checker

const checkMatch = (thisCard) => {
  return TARGET_CARD.icon === thisCard.icon;
}

// helper function that flips a card
const flip = (cardElement) => {
  cardElement.classList.toggle('show');
  cardElement.classList.toggle('open');
}

// Methods that end a game
const endGame = () => {
  // stop timer
  clearInterval(TIMER_ID);

  // show end game pop-up
  document.getElementsByClassName('container')[0].classList.add('blur');
  showPopUp(MOVES, TIME_SPENT);
}

// Show winning pop-up message
const showPopUp = (moves, time) => {
  const overlay = document.getElementsByClassName('overlay')[0];
  const popUp = overlay.getElementsByClassName('pop-up')[0];
  // edit pop-up content
  popUp.getElementsByTagName('span')[0].innerText = moves;
  popUp.getElementsByTagName('span')[1].innerText = time;
  setStars(moves, document.getElementsByClassName('stars')[0].children);

  // delay pop-up showing for animation
  setTimeout(() => {
    overlay.style.visibility = 'visible';
  },550);
}

/****
*  Math module
***/

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

// Set stars according moves
const setStars = (num, stars) => {
  if (num === 0) {
    [].forEach.call(stars, (star) => {
      setBlackStar(star);
    })
  }

  if (num >= 6) {
    setWhiteStar(stars[2]);
  }

  if (num >= 12) {
    setWhiteStar(stars[1]);
  }
}



/****
* Game start!
***/

// reset button and overlay only
// needs to be set once for a faster reloading
resetButtonSetUp();
setUpOverlay();
newGame();


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
