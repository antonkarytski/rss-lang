export const GAMES = {
  puzzle: {
    navigationImage: "book.webp",
    key: "puzzle",
    name: "Пазл",
    greetText: "В этой игре необходимо составить предложение из слов, на каждое предложение у вас будет 2 попытки,"+
      " и 30 секунд."
  },
  audiocall: {
    navigationImage: "audio2.png",
    key: "audiocall",
    name: "Аудиовызов",
    greetText: "Тренировка Аудиовызов развивает словарный запас. Вы должны выбрать перевод услышанного слова."
  },
  savannah:{
    navigationImage: "savannah.png",
    key: "savannah",
    name: "Саванна",
    greetText: "Тренировка Саванна развивает словарный запас. Выбирайте правильный перевод слова из предложенных."
  },
  sprint: {
    navigationImage: "sprint.png",
    key: "sprint",
    name: "Спринт",
    greetText: "Тренирует навык быстрого перевода с английского языка на русский. " +
      "Вам нужно выбрать соответствует ли перевод предложенному слову."
  },
}

export const GAMES_ARRAY = Object.values(GAMES)
