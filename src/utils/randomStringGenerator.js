let characterArray = "abcdefghijklmnopqrstuvwxyz0123456789".split("");

let lengthOfCharacterArray = 36;

let words = new Set();

while (words.size < 40000) {
  let word = "";
  for (let i = 0; i < 5; i++) {
    word += characterArray[Math.floor(Math.random() * lengthOfCharacterArray)];
  }
  words.add(word);
}

console.log([...words]);
