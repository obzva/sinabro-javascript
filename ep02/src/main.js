import test from "./test.json?raw";

async function main() {
  const products = await getProducts();

  document.querySelector("#products").innerHTML = products
    .map(
      (product, index) => `
    <div class="product" data-product-id="${product.id}" data-product-index="${index}">
      <img src="${product.images[0]}" alt="Image-${product.name}">
      <p>${product.name}</p>
      <div class="flex items-center justify-between">
        <span>Price: ${product.regularPrice}</span>
        <div>
          <button type="button" class="btn-decrease bg-green-200 text-green-800 hover:bg-green-300 px-3 py-1 rounded-full">-<button>
          <span class="text-green-800 hidden">3</span>
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
    // const productId = productElement.getAttribute("data-product-id");
    const productIndex = productElement.getAttribute("data-product-index");
    const product = products[productIndex];

    if (targetElement.matches(".btn-decrease")) {
      console.log("🍎 decrease!");
    } else if (targetElement.matches(".btn-increase")) {
      console.log("🍏 increase!");
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

main();
