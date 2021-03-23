const questions = document.querySelectorAll("input");

const resultsDiv = document.querySelector(".results");
const splashPage = document.getElementById("splash-page");
const score = document.querySelector(".score");
const start = document.querySelector(".start");
const wrongBtn = document.querySelector(".wrong");
const gamePage = document.querySelector("#game-page");
let arr;
let resultArr = [];
let arrayOfOperations = [];
let id = 1;
let timer;
let wrong = 0;
let target;

const checkLocal = () => {
  if (localStorage.getItem("resultArr") === null) {
    resultArr = [];
  } else {
    resultArr = JSON.parse(localStorage.getItem("resultArr"));
  }
};

const saveLocal = (result, level) => {
  checkLocal();

  const resultObject = {
    result: result,
    level: level,
  };
  resultArr.push(resultObject);

  localStorage.setItem("resultArr", JSON.stringify(resultArr));
  return resultArr;
};
checkLocal();

const getRandomNumber = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
};

const submit = document.querySelector(".right");

const build = (min, max) => {
  splashPage.style.display = "none";
  for (let i = 0; i < 10; i++) {
    one = getRandomNumber(min, max);
    two = getRandomNumber(min, max);

    const inputResult = document.createElement("input");
    const operation = document.createElement("div");
    operation.classList.add("operation");
    inputResult.type = "number";
    resultsDiv.appendChild(operation);
    operation.innerText = `${one} * ${two} = `;
    inputResult.setAttribute("id", "result");
    operation.appendChild(inputResult);

    arr = [inputResult, one, two, operation];
    arrayOfOperations.push(arr);
  }

  timer = setInterval(stopwatch2, 100);

  return arrayOfOperations;
};

questions.forEach((el) => {
  el.addEventListener("click", (e) => {
    target = e.target.id;

    el.parentElement.style.backgroundColor = "green";
    const rest = Array.from(questions).filter((elem) => {
      console.log(elem.id);
      if (elem.id !== el.id) {
        elem.parentElement.style.background = "white";
        return elem;
      }
    });
  });
});

// questions10.addEventListener("click", build);
let some = true;
let time = 0;
const checkAnswer = () => {
  for (let i = 0; i < arrayOfOperations.length; i++) {
    const [inputResult, one, two, oper] = arrayOfOperations[i];

    if (parseFloat(inputResult.value) === one * two) {
      goodOrWrong(oper, "GOOD", "green");
    } else {
      goodOrWrong(oper, "WRONG", "red");
      wrong = wrong + 3;
    }
  }

  clearInterval(timer);
  let newResult = (wrong + time2).toFixed(2);

  const best = displayBestResult(target, newResult);

  score.innerHTML = `Najlepszy wynik:<b> ${best}</b> <br>
  Twój wynik to:<b> ${newResult} </b><br>
                     Wynik składa się z liczby sekund + 3 karne punkty za każdą złą odpowiedź <br>
                     Im niższy tym lepszy.`;
};

submit.addEventListener("click", checkAnswer);

const goodOrWrong = (oper, str, color) => {
  const span = document.createElement("span");
  span.style.paddingLeft = "10px";
  span.innerText = str;
  span.style.color = color;

  span.style.position = "absolute";
  span.style.marginTop = "7px";
  oper.appendChild(span);
};

let time2 = 0;
const stopwatch2 = () => {
  score.innerHTML = `${time2.toFixed(2)}`;
  time2 = time2 + 0.1;
};

start.addEventListener("click", (e) => {
  e.preventDefault();

  switchBuild();
});

wrongBtn.addEventListener("click", () => {
  splashPage.style.display = "block";
  arr = [];
  arrayOfOperations = [];
  const operations = document.querySelectorAll(".operation");

  operations.forEach((el) => {
    el.remove();
  });
  clearInterval(timer);
  time2 = 0;
  wrong = 0;
  score.innerHTML = "";
});

const switchBuild = () => {
  switch (target) {
    case "easy":
      build(1, 10);
      break;
    case "normal":
      build(10, 99);
      break;
    case "hard":
      build(100, 500);
      break;
    case "nightmare":
      build(100, 999);
      break;
  }
};

const displayBestResult = (target, newResult) => {
  checkLocal();

  let newArr = saveLocal(newResult, target).filter((object) => {
    if (object.level === target) return object.result;
  });
  newArr = newArr.map((object) => {
    return parseFloat(object.result);
  });
  const best = Math.min(...newArr);

  resultArr = resultArr.filter((object) => {
    if (parseFloat(object.result) === best || object.level !== target) {
      return object;
    }
  });

  localStorage.setItem("resultArr", JSON.stringify(resultArr));
  return best;
};
