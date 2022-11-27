/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  let characterArray = "abcdefghijklmnopqrstuvwxyz0123456789".split("");

  let lengthOfCharacterArray = 36;

  let words = new Set();

  while (words.size < 40000) {
    let word = "";
    for (let i = 0; i < 5; i++) {
      word +=
        characterArray[Math.floor(Math.random() * lengthOfCharacterArray)];
    }
    words.add(word);
  }

  let wordObjArray = [...words].map((e) => ({ identifier: e }));

  await knex("identifiers").insert(wordObjArray);
};
