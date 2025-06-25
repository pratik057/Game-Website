// Generate a standard deck of cards
export const generateDeck = () => {
  const suits = ["hearts", "diamonds", "clubs", "spades"]
  const values = Array.from({ length: 13 }, (_, i) => i + 1) // 1 (Ace) to 13 (King)

  const deck = []
  for (const suit of suits) {
    for (const value of values) {
      deck.push({ suit, value })
    }
  }

  return deck
}

// Shuffle the deck using Fisher-Yates algorithm
export const shuffleDeck = (deck) => {
  const shuffled = [...deck]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

  