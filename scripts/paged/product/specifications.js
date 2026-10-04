export function renderSpecifications(product) {
  const specTableBody = document.querySelector('.specifications-table-body');
  if (specTableBody) {
    let html = ``
    for(let key in product.specifications) {

      html += `<tr>
            <td class="spec-label">${key}</td>
            <td class="spec-value">${product.specifications[key]}</td>
          </tr>`
    }
    specTableBody.innerHTML = html;
  }
}

