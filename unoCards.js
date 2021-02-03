const SKIP = "skip";
const PLUS2 = "plus2";
const PLUS4 = "plus4";
const REVERSE = "reverse";
const COLOUR_CHANGE = "change";

const WILD = "wild";

const RED = "red";
const YELLOW = "yellow";
const GREEN = "green";
const BLUE = "blue";

// currently no limit on any type of card therefore all cards are allowed the same number of times
const cards = [
    "0", //only 1 per colour
    "1", // rest till REVERSE 2 per colour
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    SKIP,
    PLUS2,
    PLUS4,
    REVERSE
];

// currently no limit on any type of card therefore all cards are allowed the same number of times
/*
const wildCards = [
    WILD_PLUS4, // 4 are alowed
    WILD // 4 are alowed
]
*/
//multiply Math.random by 14*4 = 56 for colour cards, + 2 for wildcards, So 58

const getCardAtRandom = () => {
    //last numbers are rarely reached to increase chances of wild cards by a small bit
    //multiply by 62
    //check for wild cards between 56 and 62
    
    const num = Math.floor(Math.random()*62); 
    // numbers start with 0

    if(num < 14) {
        return {
            colour: RED,
            value: cards[num]
        };
    }
    else if(num < 28) {
        return {
            colour: GREEN,
            value: cards[num-14]
        };
    }
    else if(num < 42) {
        return {
            colour: BLUE,
            value: cards[num-28]
        };
    }
    else if(num < 56) {
        return {
            colour: YELLOW,
            value: cards[num-42]
        };
    }
    else if( num < 59 ) {
        return {
            colour: WILD,
            value: COLOUR_CHANGE
        };
    }
    else{
        return {
            colour: WILD,
            value: PLUS4
        };
    }
};

const getCards = ( count ) => {
    const userCards = [];
    for( let i=0; i<count; i++ ){
        userCards.push(getCardAtRandom());
    }
    return userCards;
};

module.exports = {
    getCardAtRandom: getCardAtRandom,
    getCards: getCards,
    cardColour: {
        WILD,
        RED,
        YELLOW,
        GREEN,
        BLUE
    }
};