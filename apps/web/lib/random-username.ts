const expressions = [
  "happy", "sad", "angry", "excited", "nervous", "calm", "joyful", "bored",
  "confused", "brave", "curious", "lonely", "shy", "bold", "gentle", "kind",
  "polite", "rude", "lazy", "energetic", "sleepy", "clever", "smart", "funny",
  "serious", "silly", "charming", "handsome", "beautiful", "ugly", "elegant",
  "graceful", "clumsy", "strong", "weak", "fast", "slow", "rich", "poor",
  "honest", "dishonest", "loyal", "friendly", "mean", "helpful", "grateful",
  "thankful", "fearless", "courageous", "timid", "ambitious", "lazy", "creative",
  "artistic", "thoughtful", "careless", "humble", "proud", "selfish", "generous",
  "hopeful", "hopeless", "optimistic", "pessimistic", "romantic", "realistic",
  "energetic", "tired", "enthusiastic", "serene", "angsty", "depressed",
  "motivated", "unmotivated", "adaptable", "rigid", "organized", "messy",
  "adventurous", "cautious", "dramatic", "stoic", "cheerful", "grumpy",
  "playful", "strict", "trustworthy", "suspicious", "innocent", "mysterious",
  "talkative", "quiet", "modest", "confident", "sarcastic", "witty", "wise",
  "naive", "realistic", "imaginative"
];
const animals = [
  "lion", "tiger", "cheetah", "leopard", "jaguar", "panther", "elephant", "rhino",
  "hippopotamus", "giraffe", "zebra", "buffalo", "deer", "antelope", "camel",
  "horse", "donkey", "mule", "goat", "sheep", "cow", "bull", "yak", "bison",
  "pig", "boar", "dog", "cat", "wolf", "fox", "bear", "panda", "koala", "kangaroo",
  "rabbit", "hare", "squirrel", "mouse", "rat", "bat", "monkey", "chimpanzee",
  "gorilla", "orangutan", "baboon", "lemur", "otter", "raccoon", "badger",
  "hedgehog", "weasel", "moose", "reindeer", "elk", "donkey", "platypus",
  "beaver", "armadillo", "sloth", "porcupine", "crocodile", "alligator",
  "lizard", "chameleon", "gecko", "snake", "python", "cobra", "anaconda",
  "frog", "toad", "turtle", "tortoise", "dolphin", "whale", "shark", "seal",
  "walrus", "octopus", "squid", "crab", "lobster", "jellyfish", "starfish",
  "penguin", "eagle", "hawk", "falcon", "owl", "sparrow", "crow", "peacock",
  "parrot", "pigeon", "duck", "goose", "swan", "chicken", "rooster", "turkey",
  "flamingo", "ostrich", "vulture", "pelican"
];

const randomExpression = expressions[Math.floor(Math.random() * expressions.length)];
const randomAnimal = animals[Math.floor(Math.random() * animals.length)];

export const generateRandomUsername = (): string => {
  return `${randomExpression}-${randomAnimal}`;
};