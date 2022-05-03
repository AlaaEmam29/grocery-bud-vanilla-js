"use strict";
const form = document.querySelector(".form-grocery"),
  alert = document.querySelector(".alert"),
  groceryInput = document.querySelector("#grocery"),
  clearBtn = document.querySelector(".clear-btn"),
  submitBtn = document.querySelector(".btn-submit"),
  container = document.querySelector(".grocery-container"),
  list = document.querySelector(".grocery-list");
let editElement,
  editFlag = false,
  editID = "";

form.addEventListener("submit", addItem);
clearBtn.addEventListener("click", clearItems);
window.addEventListener("DOMContentLoaded", setUpItems);
function addItem(e) {
  e.preventDefault();
  const value = groceryInput.value;
  const id = new Date().getTime().toString();

  if (value && !editFlag) {
    creatListItem(id, value);
    showAlert("item added to the list", "success");
    addToLocalStorage(id, value);
    setBackToDefault();
  } else if (value && editFlag) {
    editElement.innerHTML = value;
    showAlert("value changed", "warning");
    editLocalStorage(editID, value);
    setBackToDefault();
  } else {
    showAlert("Please Enter Value", "danger");
  }
}

function deleteItem(e) {
  const item = e.currentTarget.parentElement.parentElement,
    id = item.dataset.id;
  list.removeChild(item);
  if (list.children.length === 0) {
    container.classList.replace("d-block", "d-none");
  }
  showAlert("item removed", "danger");
  setBackToDefault();
  removeFromLocalStorage(id);
}
function editItem(e) {
  const item = e.currentTarget.parentElement.parentElement;
  editElement = e.currentTarget.parentElement.previousElementSibling;
  groceryInput.value = editElement.innerHTML;
  editFlag = true;
  editID = item.dataset.id;
  submitBtn.innerHTML = "edit";
}

function showAlert(msg, type) {
  alert.classList.replace("d-none", "d-block");

  alert.classList.add(`alert-${type}`);
  alert.innerHTML = msg;
  setTimeout(() => {
    alert.classList.replace("d-block", "d-none");
    alert.classList.remove(`alert-${type}`);
    alert.innerHTML = ``;
  }, 1200);
}

function setBackToDefault() {
  groceryInput.value = "";
  editFlag = false;
  editID = "";
  submitBtn.innerHTML = "submit";
}

function clearItems() {
  const items = document.querySelectorAll(".grocery-item");
  if (items.length > 0) {
    items.forEach((item) => {
      list.removeChild(item);
    });
  }
  container.classList.replace("d-block", "d-none");

  showAlert("Empty List", "danger");
  setBackToDefault();
  localStorage.removeItem("list");
}
function addToLocalStorage(id, value) {
  const groceryList = { id, value };
  let items = getLocalStorage();
  items.push(groceryList);
  localStorage.setItem("list", JSON.stringify(items));
}
function removeFromLocalStorage(id) {
  let items = getLocalStorage();
  items = items.filter((item) => {
    if (item.id !== id) {
      return item;
    }
  });
  localStorage.setItem("list", JSON.stringify(items));
  console.log(getLocalStorage());
}
function editLocalStorage(id, value) {
  let items = getLocalStorage();
  items = items.map((item) => {
    if (item.id === id) {
      item.value = value;
    }
    return item;
  });
  localStorage.setItem("list", JSON.stringify(items));
}
function getLocalStorage() {
  return localStorage.getItem("list")
    ? JSON.parse(localStorage.getItem("list"))
    : [];
}

function setUpItems() {
  let items = getLocalStorage();
  if (items.length > 0) {
    items.forEach((item) => {
      creatListItem(item.id, item.value);
    });
  }
}
function creatListItem(id, value) {
  container.classList.replace("d-none", "d-block");
  const element = document.createElement("article");
  let attr = document.createAttribute("data-id");
  attr.value = id;
  element.setAttributeNode(attr);
  element.classList.add("grocery-item");
  element.innerHTML = `
  <p class="title">${value}</p>
  <div class="btn-container">
    <button type="button" class="btn edit-btn">
      <i class="fas fa-edit"></i>
    </button>
    <button type="button" class="btn delete-btn">
      <i class="fas fa-trash"></i>
    </button>
  </div>
  `;
  const deleteBtn = element.querySelector(".delete-btn");
  const editBtn = element.querySelector(".edit-btn");
  deleteBtn.addEventListener("click", deleteItem);
  editBtn.addEventListener("click", editItem);

  list.appendChild(element);
}
