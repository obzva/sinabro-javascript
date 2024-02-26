import test from "./test.json?raw";

async function main() {
  const products = await getProducts();
  const productMap = {};
  products.forEach((p) => {
    productMap[p.id] = p;
  });
  const countMap = {};

  document.querySelector("#products").innerHTML = products
    .map((p) => getProductHTML(p, countMap[p.id]))
    .join("");

  document.querySelector("#products").addEventListener("click", (e) => {
    const targetElement = e.target;
    const productElement = findElement(targetElement, ".product");
    const productId = productElement.getAttribute("data-product-id");

    if (
      targetElement.matches(".btn-decrease") ||
      targetElement.matches(".btn-increase")
    ) {
      if (countMap[productId] === undefined) countMap[productId] = 0;

      if (targetElement.matches(".btn-decrease")) {
        if (countMap[productId] > 0) {
          countMap[productId]--;
          if (countMap[productId] === 0) delete countMap[productId];
          console.log("🍎 decrease!");
        }
      } else if (targetElement.matches(".btn-increase")) {
        countMap[productId]++;
        console.log("🍏 increase!");
      }

      const cartcount = productElement.querySelector(".cart-count");

      if (countMap[productId] === 0 || countMap[productId] === undefined) {
        cartcount.innerHTML = null;
      } else {
        cartcount.innerHTML = countMap[productId];

        const productIds = Object.keys(countMap);
        document.querySelector(".cart-items").innerHTML = productIds
          .map((id) => getProductHTML(productMap[id], countMap[id]))
          .join("");
      }

      const total = sumAllCounts(countMap);
      document.querySelector(".total-count").innerHTML =
        total > 0 ? `(${total})` : null;
    }
  });

  document.querySelector(".btn-cart").addEventListener("click", () => {
    document.querySelector(".cart-layer").classList.remove("hidden");
  });

  document.querySelector(".btn-close-cart").addEventListener("click", () => {
    document.querySelector(".cart-layer").classList.add("hidden");
  });

  document.querySelector(".cart-dimmed-bg").addEventListener("click", () => {
    document.querySelector(".cart-layer").classList.add("hidden");
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

function getProductHTML(product, count) {
  return `
  <div class="product" data-product-id="${product.id}"">
    <img src="${product.images[0]}" alt="Image-${product.name}">
    <p>${product.name}</p>
    <div class="flex items-center justify-between">
      <span>Price: ${product.regularPrice}</span>
      <div>
        <button type="button" class="btn-decrease disabled:cursor-not-allowed disaled:opacity-50 bg-green-200 text-green-800 hover:bg-green-300 px-3 py-1 rounded-full">-<button>
        <span class="cart-count text-green-800">${
          count && count !== 0 ? count : ""
        }</span>
        <button type="button" class="btn-increase bg-green-200 text-green-800 hover:bg-green-300 px-3 py-1 rounded-full">+<button>
      </div>
    </div>
  </div>
`;
}

main();
