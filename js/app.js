// GLOBAL VARIABLES
NUMBER_OF_ICONS = 8;

// Icon List:
// 16 slots => 8 pair of icons.
// 'icons' is an array that holds 12 unique icons from Awesome-Fonts
// Each time we shuffle the list and choose the first 8 ones that enter the game

let icons = ["paper-plane",
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

icons = shuffle(icons);

// Card class:
// basic Object-Oriented design for the game card

const Card = function(icon) {
  this.icon = icon;
}

// Card list
// 'cards' is an array that holds 16 cards.
// Each time we select first 8 icons from icon-array
// and create 2 cards for each of the icon selected.
// We shuffle the card list for further use.

let cards = [];

for (let i = 0; i < NUMBER_OF_ICONS; ++i) {
  for (let j = 0; j < 2; ++j) {
    let thisCard = new Card(icons[i]);
    cards.push(thisCard);
  }
}

cards = shuffle(cards);

// Iterate through the card list to create HTML implementation for each of them
// Add listerner to each card element.
// Remove previous cards and append new cards.

let deck = document.getElementsByClassName('deck')[0]
deck.innerHTML = "";

for (let i = 0; i < cards.length; ++i) {
  let thisCard = cards[i];

  // Create card container
  let cardElement = document.createElement('li');
  cardElement.classList.add('card');
  // test use only:
  // cardElement.classList.add('match');

  // Create game card icon
  let iconElement = document.createElement('i');
  iconElement.classList.add('fa');
  iconElement.classList.add('fa-' + thisCard.icon);

  // Add listerner to each card element
  cardElement.addEventListener('click', (e) => {
    clickCard(e.target, thisCard);
  });

  // Put icon onto the card
  // Put card onto the deck
  cardElement.appendChild(iconElement);
  deck.appendChild(cardElement)
}



/*
 Game Logic Module
*/

const clickCard = (cardElement, thisCard) => {
  cardElement.classList.toggle('show');
  cardElement.classList.toggle('open');
}







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
