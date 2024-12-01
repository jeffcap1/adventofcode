/**
 * == Card Strength Order ==
 * A, K, Q, T, 9, 8, 7, 6, 5, 4, 3, 2, J
 * J cards are a wildcard whenever they would make the hand the strongest possible
 *
 * == Match Strength ==
 * Five of a kind --> AAAAA
 * Four of a kind --> AA8AA
 * Full house --> 23332
 * Three of a kind --> TTT98
 * Two Pair --> 23432
 * One Pair --> A23A4
 * High Card --> 23456
 *
 * == Tie Breaker ==
 * Left to Right, first card differnt, bigger strength wins
 *
 * ==  ==
 * 1. Put hands in order of strength
 * 2. Determine total winnings by adding result of multiplying hands (rank * bid)
 * 3. What are total winnings
 */

import fs from 'fs';

// read input file
// const file = new URL('small_input.txt', import.meta.url);
const file = new URL('input.txt', import.meta.url);
const input = fs.readFileSync(file, 'utf-8');
const games = input.split('\n').filter(Boolean);

const cardStrengthMap = {
  a: 14,
  k: 13,
  q: 12,
  t: 10,
  9: 9,
  8: 8,
  7: 7,
  6: 6,
  5: 5,
  4: 4,
  3: 3,
  2: 2,
  j: 1,
};

// will insert to each rank and then sort placement when inserting so everything
// all hands will be sorted by rank after we are done going through the games
const rankByType = {
  fiveOfAKind: [],
  fourOfAKind: [],
  fullHouse: [],
  threeOfAKind: [],
  twoPair: [],
  onePair: [],
  highCard: [],
};

function insertAndRank(cards, bid, handType) {
  if (rankByType[handType].length === 0) {
    rankByType[handType].push({ cards, bid });
    return;
  }

  const rankTypeLength = rankByType[handType].length;

  // find where to insert
  for (let i = 0; i < rankTypeLength; i += 1) {
    if (handType === 'fiveOfAKind' && cards[0] > rankByType[handType][i].cards[0]) {
      rankByType[handType].splice(i, 0, { cards, bid });
      break;
    }

    for (let c = 0; c < cards.length; c += 1) {
      if (cards[c] === rankByType[handType][i].cards[c]) {
        // eslint-disable-next-line no-continue
        continue;
      }

      // this hand is lower than the one already ranked
      if (cards[c] < rankByType[handType][i].cards[c]) {
        break;
      }

      // this hand is higher than the previously ranked one, insert
      rankByType[handType].splice(i, 0, { cards, bid });
      return;
    }
  }

  // this hand is the lowest of all the ranked items, insert at the end
  if (rankTypeLength === rankByType[handType].length) {
    rankByType[handType].push({ cards, bid });
  }
}

function determineHandType(hand) {
  let handType = '';
  const cardCount = {};
  const cards = [];

  hand
    .toLowerCase()
    .split('')
    .forEach((card) => {
      const cardStrength = cardStrengthMap[card];
      // push numeric version of card to hand
      cards.push(cardStrength);
      // keep track of each type of card in our hand
      cardCount[card] = cardCount[card] ? cardCount[card] + 1 : 1;
    });

  const jokerCount = cardCount.j || 0;

  // add joker count to highest card count
  if (jokerCount > 0 && jokerCount < 5) {
    // pulling out joker card so it's not included in calculations
    const { j, ...restCards } = cardCount;
    const highestCardCount = Math.max(...Object.values(restCards));
    const keys = Object.keys(restCards);
    for (let i = 0; i < keys.length; i += 1) {
      if (cardCount[keys[i]] === highestCardCount) {
        cardCount[keys[i]] += jokerCount;
        delete cardCount.j;
        break;
      }
    }
  }

  // determine hand type
  switch (Object.keys(cardCount).length) {
    case 1: {
      handType = 'fiveOfAKind';
      break;
    }
    case 2: {
      handType = Object.values(cardCount).includes(4) ? 'fourOfAKind' : 'fullHouse';
      break;
    }
    case 3: {
      handType = Object.values(cardCount).includes(3) ? 'threeOfAKind' : 'twoPair';
      break;
    }
    case 4: {
      handType = 'onePair';
      break;
    }
    case 5:
    default: {
      handType = 'highCard';
      break;
    }
  }

  return { cards, handType };
}

const numberOfGames = games.length;

games.forEach((game) => {
  const [hand, bidAmount] = game.split(' ');
  const bid = parseInt(bidAmount, 10);
  const { cards, handType } = determineHandType(hand);
  // insert and order by rank
  insertAndRank(cards, bid, handType);
});

const rankedGames = [
  ...rankByType.fiveOfAKind,
  ...rankByType.fourOfAKind,
  ...rankByType.fullHouse,
  ...rankByType.threeOfAKind,
  ...rankByType.twoPair,
  ...rankByType.onePair,
  ...rankByType.highCard,
];

const totalWinnings = rankedGames.reduce((agg, game, index) => agg + game.bid * (numberOfGames - index), 0);
console.log({ totalWinnings });
