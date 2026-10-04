export async function renderDescription(product) {
  if (!product.description) {
    console.error("couldn't render product description, product.description is not valid/is not found")
  }
  const descriptionText = document.querySelector('.description-text');
  if (descriptionText) {
    descriptionText.innerHTML = product.description;
  }
}
