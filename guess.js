// Setting Game Name
let gameName = "Guess The Word";
document.title = gameName;
document.querySelector("h1").innerHTML = gameName;
document.querySelector("footer").innerHTML = `${gameName} Game Created By Elzero Web School`;

// قائمة الكلمات
const arabicWords = [
  "الامبراطوره", "الملكه", "الاميره", "الجميله", "كيوته",
  "الفاتنه", "الراقيه", "العظيمه", "المبدعه", "الأنيقه"
];

const englishWords = [
  "EMPRESS", "MAJESTY", "PRINCESS", "BEAUTY", "PRETTY",
  "ROYALTY", "DIVINE", "QUEEN", "GLAMOUR", "ELEGANT"
];

// المتغيرات العامة
let currentLang = "ar"; // اللغة الافتراضية "عربي"
let wordToGuess = "";
let numberOfTries = 6;
let numberOfLetters = 0;
let currentTry = 1;
let numberOfHints = 2;

// تعريف جميع الأزرار وعناصر التحكم في أعلى الكود لمنع أخطاء الـ Scope
const arBtn = document.getElementById("lang-ar");
const enBtn = document.getElementById("lang-en");
const guessButton = document.querySelector(".check");
const hintButton = document.querySelector(".hint");

// إضافة المستمعات (Event Listeners)
arBtn.addEventListener("click", () => switchLanguage("ar"));
enBtn.addEventListener("click", () => switchLanguage("en"));
guessButton.addEventListener("click", handleGuesses);
hintButton.addEventListener("click", getHint);

function switchLanguage(lang) {
  currentLang = lang;
  if (lang === "ar") {
    arBtn.classList.add("active");
    enBtn.classList.remove("active");
    document.documentElement.setAttribute("dir", "rtl");
  } else {
    enBtn.classList.add("active");
    arBtn.classList.remove("active");
    document.documentElement.setAttribute("dir", "ltr");
  }
  startNewGame();
}

function startNewGame() {
  // اختيار الكلمة حسب اللغة المحددة
  const wordList = currentLang === "ar" ? arabicWords : englishWords;
  wordToGuess = wordList[Math.floor(Math.random() * wordList.length)];
  
  // إعادة ضبط إعدادات المحاولة والـ Hints
  numberOfLetters = wordToGuess.length;
  currentTry = 1;
  numberOfHints = 2;

  // إعادة زر الفحص والمساعدة
  guessButton.disabled = false;
  hintButton.disabled = false;
  document.querySelector(".hint span").innerHTML = numberOfHints;
  document.querySelector(".message").innerHTML = "";

  generateInput();
}

function generateInput() {
  const inputsContainer = document.querySelector(".inputs");
  inputsContainer.innerHTML = "";

  for (let i = 1; i <= numberOfTries; i++) {
    const tryDiv = document.createElement("div");
    tryDiv.classList.add(`try-${i}`);
    tryDiv.innerHTML = `<span>Try ${i}</span>`;

    if (i !== 1) tryDiv.classList.add("disabled-inputs");

    for (let j = 1; j <= numberOfLetters; j++) {
      const input = document.createElement("input");
      input.type = "text";
      input.id = `guess-${i}-letter-${j}`;
      input.setAttribute("maxlength", "1");
      tryDiv.appendChild(input);
    }

    inputsContainer.appendChild(tryDiv);
  }

  inputsContainer.children[0].children[1].focus();
  addInputListeners();
}

function addInputListeners() {
  const inputsInCurTry = document.querySelectorAll(`.try-${currentTry} input`);
  inputsInCurTry.forEach((input, index) => {
    input.addEventListener("input", () => {
      const nextInput = document.querySelector(`#guess-${currentTry}-letter-${index + 2}`);
      if (nextInput) nextInput.focus();
    });

    input.addEventListener("keydown", (event) => {
      const currentIndex = Array.from(inputsInCurTry).indexOf(event.target);
      if (event.key === "Backspace") {
        if (input.value === "") {
          const prevInput = document.querySelector(`#guess-${currentTry}-letter-${currentIndex}`);
          if (prevInput) prevInput.focus();
        } else {
          input.value = "";
        }
      }
    });
  });
}

function handleGuesses() {
  let successGuess = true;
  for (let i = 1; i <= numberOfLetters; i++) {
    const inputField = document.querySelector(`#guess-${currentTry}-letter-${i}`);
    const letter = inputField.value.toLowerCase();
    const actualLetter = wordToGuess[i - 1].toLowerCase();

    if (letter === actualLetter) {
      inputField.classList.add("in-place");
    } else if (wordToGuess.toLowerCase().includes(letter) && letter !== "") {
      inputField.classList.add("not-in-place");
      successGuess = false;
    } else {
      inputField.classList.add("no");
      successGuess = false;
    }
  }

  if (successGuess) {
    document.querySelector(".message").innerHTML = `You Win! The word is <span>${wordToGuess}</span>`;
    let allTries = document.querySelectorAll(".inputs > div");
    allTries.forEach((tryDiv) => tryDiv.classList.add("disabled-inputs"));
    guessButton.disabled = true;
    hintButton.disabled = true;
  } else {
    document.querySelector(`.try-${currentTry}`).classList.add("disabled-inputs");
    currentTry++;

    let el = document.querySelector(`.try-${currentTry}`);
    if (el) {
      document.querySelector(`.try-${currentTry}`).classList.remove("disabled-inputs");
      document.querySelector(`#guess-${currentTry}-letter-1`).focus();
      addInputListeners();
    } else {
      guessButton.disabled = true;
      hintButton.disabled = true;
      document.querySelector(".message").innerHTML = `Game Over! The word was <span>${wordToGuess}</span>`;
    }
  }
}

function getHint() {
  if (numberOfHints > 0) {
    numberOfHints--;
    document.querySelector(".hint span").innerHTML = numberOfHints;

    const enabledInputs = document.querySelectorAll(`.try-${currentTry} input`);
    const emptyInputs = Array.from(enabledInputs).filter((input) => input.value === "" && !input.disabled);

    if (emptyInputs.length > 0) {
      const randomIndex = Math.floor(Math.random() * emptyInputs.length);
      const randomInput = emptyInputs[randomIndex];
      const indexToFill = Array.from(enabledInputs).indexOf(randomInput);
      randomInput.value = wordToGuess[indexToFill].toUpperCase();
      randomInput.classList.add("in-place");
      randomInput.disabled = true;
    }
  }
}

window.onload = function () {
  startNewGame();
};