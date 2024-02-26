import test from "./test.json?raw";

async function main() {
  const products = await getProducts();
  const countMap = {};

  document.querySelector("#products").innerHTML = products
    .map(
      (product, index) => `
    <div class="product" data-product-id="${product.id}" data-product-index="${index}">
      <img src="${product.images[0]}" alt="Image-${product.name}">
      <p>${product.name}</p>
      <div class="flex items-center justify-between">
        <span>Price: ${product.regularPrice}</span>
        <div>
          <button type="button" class="btn-decrease disabled:cursor-not-allowed disaled:opacity-50 bg-green-200 text-green-800 hover:bg-green-300 px-3 py-1 rounded-full">-<button>
          <span class="cart-count text-green-800"></span>
          <button type="button" class="btn-increase bg-green-200 text-green-800 hover:bg-green-300 px-3 py-1 rounded-full">+<button>
        </div>
      </div>
    </div>
  `
    )
    .join("");

  document.querySelector("#products").addEventListener("click", (e) => {
    const targetElement = e.target;
    const productElement = findElement(targetElement, ".product");
    const productId = productElement.getAttribute("data-product-id");
    const productIndex = productElement.getAttribute("data-product-index");
    const product = products[productIndex];

    if (
      targetElement.matches(".btn-decrease") ||
      targetElement.matches(".btn-increase")
    ) {
      if (countMap[productId] === undefined) countMap[productId] = 0;

      if (targetElement.matches(".btn-decrease")) {
        if (countMap[productId] > 0) {
          countMap[productId]--;
          console.log("🍎 decrease!");
        }
      } else if (targetElement.matches(".btn-increase")) {
        countMap[productId]++;
        console.log("🍏 increase!");
      }

      const cartcount = productElement.querySelector(".cart-count");
      cartcount.innerHTML =
        countMap[productId] === 0 ? "" : countMap[productId];

      document.querySelector(".total-count").innerHTML = `(${sumAllCounts(
        countMap
      )})`;
    }
  });
}

async function getProducts() {
  if (process.env.NODE_ENV === "development") {
    return JSON.parse(test);
  }
  const response = await fetch(
    "https://learnwitheunjae.dev/api/sinabro-js/ecommerce"
  );
  return await response.json();
}

function findElement(startingElement, selector) {
  let currentElement = startingElement;

  while (currentElement !== null) {
    if (currentElement.matches(selector)) return currentElement;
    currentElement = currentElement.parentElement;
  }

  return null;
}

function sumAllCounts(countMap) {
  return Object.values(countMap).reduce((acc, curr) => acc + curr, 0);
}

main();
