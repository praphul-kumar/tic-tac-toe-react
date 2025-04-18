const adjectives = [
  "Swift",
  "Shadow",
  "Mighty",
  "Cosmic",
  "Epic",
  "Funky",
  "Turbo",
  "Silent",
  "Crazy",
  "Electric",
];

const animals = [
  "Tiger",
  "Falcon",
  "Penguin",
  "Dragon",
  "Knight",
  "Wolf",
  "Panther",
  "Rhino",
  "Eagle",
  "Lynx",
];

export function generateGametag() {
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const animal = animals[Math.floor(Math.random() * animals.length)];
  const number = Math.floor(Math.random() * 100);
  return `${adj}${animal}${number}`;
}
