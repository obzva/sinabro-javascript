document.querySelector("#app").innerHTML = `
  <input />
  <button>Click</button>
`;

document.querySelector("button").addEventListener("click", () => {
  const currentValue = document.querySelector("input").value;

  document.querySelector("input").value = currentValue + "*";
});

let count = 0;

// setInterval(() => {
//   count++;

//   document.querySelector("#app").innerHTML = `
//   <input />
//   <button>Click</button>
//   <p>count: ${count}</p>
// `;
// }, 5000);

document.querySelector("#app").innerHTML = `
  <button class="btn-add-card" type="button">Add card</button>

  <div class="cards"></div>
`;

let cardCount = 0;

document.querySelector(".btn-add-card").addEventListener("click", () => {
  cardCount++;

  const card = document.createElement("div");

  card.className = "card";
  card.setAttribute("data-number", cardCount);
  card.innerHTML = `
    <p>Card #${cardCount}</p>
    <button class="btn-hello" type="button">Hello</button>
  `;

  // const helloCardCount = cardCount;

  // card.querySelector(".btn-hello").addEventListener("click", () => {
  //   console.log(`😁 hello ${helloCardCount}`);
  //   console.log(`cardCount: ${cardCount}`);
  // });

  document.querySelector(".cards").appendChild(card);
});

document.querySelector(".cards").addEventListener("click", (e) => {
  // console.log("Click from .cards", e);
  // console.log(e.target.matches(".btn-hello"));
  if (e.target.matches(".btn-hello")) {
    // const parentInnerText = e.target.parentElement.children[0].innerText;
    // const number = parentInnerText.slice(parentInnerText.length - 1);

    // const number = e.target.getAttribute("data-number");

    const parent = e.target.parentElement;
    const number = parent.getAttribute("data-number");

    console.log(`😁 hello ${number}`);
  } else {
    console.log("This is not Button");
  }
});
