// Generate a standard deck of cards (Ace = 1, King = 13)
export const generateDeck = () => {
  const suits = ["hearts", "diamonds", "clubs", "spades"];
  return suits.flatMap((suit) => Array.from({ length: 13 }, (_, i) => ({ suit, value: i + 1 })));
};

// Shuffle the deck using Fisher-Yates algorithm
export const shuffleDeck = (deck) => {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
};

// Determine the winning side based on bets (Higher bet loses)
export const determineWinningSide = (totalBets, andarCards, baharCards) => {
  const { andar, bahar } = totalBets;

  if (bahar > andar) return "andar";  // If Bahar bet is higher, Andar wins
  if (andar > bahar) return "bahar";  // If Andar bet is higher, Bahar wins

  // If bets are equal, the side with fewer cards wins
  return andarCards.length > baharCards.length ? "bahar" : "andar";
};
