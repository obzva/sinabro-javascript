import test from "./test.json?raw";

async function main() {
  // fetch products
  const products = await getProducts();

  // map id to product
  const productMap = {};
  products.forEach((p) => {
    productMap[p.id] = p;
  });

  // map id to count
  const countMap = {};

  // render product cards
  document.querySelector("#products").innerHTML = products
    .map((p) => getProductHTML(p, countMap[p.id]))
    .join("");

  // util functions
  function increaseCount(productId) {
    if (countMap[productId] === undefined) countMap[productId] = 0;
    countMap[productId]++;
    console.log("🍏 increase!");
    updateProductCount(productId);
    updateCart();
  }

  function decreaseCount(productId) {
    if (countMap[productId] === undefined) countMap[productId] = 0;
    if (countMap[productId] > 0) {
      countMap[productId]--;
      if (countMap[productId] === 0) delete countMap[productId];
      console.log("🍎 decrease!");
    }
    updateProductCount(productId);
    updateCart();
  }

  function updateProductCount(productId) {
    const productElement = document.querySelector(
      `.product[data-product-id="${productId}"]`
    );
    const cartCountElement = productElement.querySelector(".cart-count");

    if (countMap[productId] === 0 || countMap[productId] === undefined) {
      cartCountElement.innerHTML = null;
    } else {
      cartCountElement.innerHTML = countMap[productId];
    }
  }

  function updateCart() {
    const productIds = Object.keys(countMap);
    document.querySelector(".cart-items").innerHTML = productIds
      .map((id) => getProductHTML(productMap[id], countMap[id]))
      .join("");

    const total = sumAllCounts(countMap);
    document.querySelector(".total-count").innerHTML =
      total > 0 ? `(${total})` : null;
  }

  // add click event listenr on cards of #products
  document.querySelector("#products").addEventListener("click", (e) => {
    const targetElement = e.target;
    const productElement = findElement(targetElement, ".product");
    const productId = productElement.getAttribute("data-product-id");

    if (
      targetElement.matches(".btn-decrease") ||
      targetElement.matches(".btn-increase")
    ) {
      if (targetElement.matches(".btn-decrease")) {
        decreaseCount(productId);
      } else if (targetElement.matches(".btn-increase")) {
        increaseCount(productId);
      }
    }
  });

  // add click event listenr on cards of .cart-items
  document.querySelector(".cart-items").addEventListener("click", (e) => {
    const targetElement = e.target;
    const productElement = findElement(targetElement, ".product");
    const productId = productElement.getAttribute("data-product-id");

    if (
      targetElement.matches(".btn-decrease") ||
      targetElement.matches(".btn-increase")
    ) {
      if (targetElement.matches(".btn-decrease")) {
        decreaseCount(productId);
      } else if (targetElement.matches(".btn-increase")) {
        increaseCount(productId);
      }
    }
  });

  // add click events to handle cart layer
  document.querySelector(".btn-cart").addEventListener("click", () => {
    document.querySelector(".cart-layer").classList.remove("hidden");
    document.querySelector(".cart-bg").classList.add("overflow-y-auto");
    document.querySelector("body").classList.add("overflow-y-hidden");
  });

  document.querySelector(".btn-close-cart").addEventListener("click", () => {
    document.querySelector(".cart-layer").classList.add("hidden");
    document.querySelector(".cart-bg").classList.remove("overflow-y-auto");
    document.querySelector("body").classList.remove("overflow-y-hidden");
  });

  document.querySelector(".cart-dimmed-bg").addEventListener("click", () => {
    document.querySelector(".cart-layer").classList.add("hidden");
    document.querySelector(".cart-bg").classList.remove("overflow-y-auto");
    document.querySelector("body").classList.remove("overflow-y-hidden");
  });
}

// fetch function to get products
//   in local, we don't fetch and use local json
//   in prod, we actually fetch
async function getProducts() {
  if (process.env.NODE_ENV === "development") {
    return JSON.parse(test);
  }
  const response = await fetch(
    "https://learnwitheunjae.dev/api/sinabro-js/ecommerce"
  );
  return await response.json();
}

// find element that matches specified selector iteratively
function findElement(startingElement, selector) {
  let currentElement = startingElement;

  while (currentElement !== null) {
    if (currentElement.matches(selector)) return currentElement;
    currentElement = currentElement.parentElement;
  }

  return null;
}

// get sum of counts
function sumAllCounts(countMap) {
  return Object.values(countMap).reduce((acc, curr) => acc + curr, 0);
}

// get html string of product card
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
