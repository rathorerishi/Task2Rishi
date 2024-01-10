document.addEventListener('DOMContentLoaded', () => {
  const fileInput = document.getElementById('fileInput');
  const importButton = document.getElementById('importButton');
  const displayHandlingButton = document.getElementById('displayHandlingButton');

  importButton.addEventListener('click', () => {
    openModal();
  });

  displayHandlingButton.addEventListener('click', () => {
    openDisplayHandlingModal();
  });
});

function openModal() {
  const modal = document.getElementById('formatModal');
  modal.style.display = 'block';
}

function closeModal() {
  const modal = document.getElementById('formatModal');
  modal.style.display = 'none';
}

function openDisplayHandlingModal() {
  const displayHandlingModal = document.getElementById('displayHandlingModal');
  displayHandlingModal.style.display = 'block';

  // Initialize available fields
  const availableFields = ['Product Id', 'Subcategory', 'Title', 'Price', 'Popularity', 'Description', 'Rating', 'UTM Source', 'UTM Medium'];

  // Populate available fields list
  const availableFieldsList = document.getElementById('availableFieldsList');
  availableFields.forEach(field => {
    const option = document.createElement('option');
    option.value = field;
    option.textContent = field;
    availableFieldsList.appendChild(option);
  });

  // Initialize fields to be displayed
  const fieldsToDisplayList = document.getElementById('fieldsToDisplayList');
  fieldsToDisplayList.innerHTML = '';

  // Add event listeners for the buttons
  document.getElementById('addButton').addEventListener('click', () => {
    moveOptionsBetweenLists(availableFieldsList, fieldsToDisplayList);
  });

  document.getElementById('removeButton').addEventListener('click', () => {
    moveOptionsBetweenLists(fieldsToDisplayList, availableFieldsList);
  });

  document.getElementById('applyDisplayHandling').addEventListener('click', () => {
    applyDisplayHandling(fieldsToDisplayList);
  });
}

function moveOptionsBetweenLists(sourceList, destinationList) {
  const selectedOptions = Array.from(sourceList.selectedOptions);
  selectedOptions.forEach(option => {
    destinationList.appendChild(option);
  });
}


function applyDisplayHandling(fieldsToDisplayList) {
  const selectedFields = Array.from(fieldsToDisplayList.options).map(option => option.value);
  // Implement the logic to update the table based on the selected fields
  console.log('Selected Fields:', selectedFields);
  const fileInput = document.getElementById('fileInput');
  const fileType = document.getElementById('fileType').value;
  const characterEncoding = document.getElementById('characterEncoding').value;
  const delimiter = document.getElementById('delimiter').value;
  const hasHeader = document.getElementById('hasHeader').checked;

  importData(fileType, characterEncoding, delimiter, hasHeader, selectedFields);
}



async function importData(fileType, characterEncoding, delimiter, hasHeader, selectedFields) {
  try {
    const file = fileInput.files[0];
    if (!file) {
      alert('Please choose a file before importing.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    // Append format details to the formData
    formData.append('fileType', fileType);
    formData.append('characterEncoding', characterEncoding);
    formData.append('delimiter', delimiter);
    formData.append('hasHeader', hasHeader);

    const response = await fetch('/uploadFile', {
      method: 'POST',
      body: formData
    });

    const data = await response.json();
    updateProductList(data, selectedFields);
  } catch (error) {
    console.error('Error importing data:', error.message);
  }
}



function updateProductList(data, selectedFields) {
  const productListTable = document.getElementById('product-list');

  // Clear previous content
  productListTable.innerHTML = '';

  // Create table header based on selected fields
  const tableHeader = document.createElement('tr');
  selectedFields.forEach(field => {
    const th = document.createElement('th');
    th.textContent = field;
    tableHeader.appendChild(th);
  });
  productListTable.appendChild(tableHeader);


  console.log("dataaaaaaaaaa", data.products);
  // Check if 'products' property exists in data
  if (data.products) {
    // Determine if the data is in JSON format or CSV format
    const isCSVFormat = Array.isArray(data.products);

    if (isCSVFormat) {
      // Data is in CSV format
      data.products.forEach(product => {
        const productRow = document.createElement('tr');
        productRow.classList.add('product');

        // Add product details to the table using the selected fields
        selectedFields.forEach(field => {
          const td = document.createElement('td');
          // Access the product data using the correct case
          const fieldValue = typeof product[field] !== 'undefined' ? product[field] : '';
          td.textContent = fieldValue;
          productRow.appendChild(td);
        });

        // Append the product row to the product list table
        productListTable.appendChild(productRow);
      });
    } else {
      // Data is in JSON format
      Object.keys(data.products).forEach(uniqueIdentifier => {
        const product = data.products[uniqueIdentifier];
        // console.log("productttt", product);


      // data.products.forEach(product => {

        const productRow = document.createElement('tr');
        productRow.classList.add('product');

        // Add product details to the table using the selected fields
        selectedFields.forEach(field => {
          // console.log("fielddd",field);
          field= field.toLowerCase();
          // console.log("fieldddii",field);
          const td = document.createElement('td');
          // Access the product data using the correct case
          const fieldValue = typeof product[field] !== 'undefined' ? product[field] : ' ';
          td.textContent = fieldValue;
          console.log("fieldvallllllll",fieldValue);
          productRow.appendChild(td);
        });

        // Append the product row to the product list table
        productListTable.appendChild(productRow);
      });
    }
  } else {
    console.error('Invalid data format: "products" property is missing', data);
  }
}



function closeDisplayHandlingModal() {
  const displayHandlingModal = document.getElementById('displayHandlingModal');
  displayHandlingModal.style.display = 'none';
}