// ================== Recipes Data ==================
let recipes = [
  {id:1, name:"Pancakes", category:"Breakfast", image:"images/pancakes.jpg", ingredients:["Flour","Eggs","Milk","Sugar"]},
  {id:2, name:"Omelette", category:"Breakfast", image:"images/omelette.jpg", ingredients:["Eggs","Cheese","Salt","Pepper"]},
  {id:3, name:"Grilled Chicken", category:"Lunch", image:"images/grilled-chicken.jpg", ingredients:["Chicken","Salt","Pepper","Olive oil"]},
  {id:4, name:"Caesar Salad", category:"Lunch", image:"images/caesar-salad.jpg", ingredients:["Lettuce","Croutons","Parmesan","Caesar dressing"]},
  {id:5, name:"Spaghetti Bolognese", category:"Dinner", image:"images/spaghetti.jpg", ingredients:["Spaghetti","Beef","Tomato sauce","Onion"]},
  {id:6, name:"Steak", category:"Dinner", image:"images/steak.jpg", ingredients:["Beef","Salt","Pepper","Garlic"]},
  {id:7, name:"Chocolate Cake", category:"Dessert", image:"images/chocolate-cake.jpg", ingredients:["Flour","Cocoa","Eggs","Sugar"]},
  {id:8, name:"Ice Cream", category:"Dessert", image:"images/ice-cream.jpg", ingredients:["Milk","Sugar","Cream","Vanilla"]},
  {id:9, name:"Fruit Salad", category:"Dessert", image:"images/fruit-salad.jpg", ingredients:["Apple","Banana","Orange","Grapes"]},
  {id:10, name:"Avocado Toast", category:"Breakfast", image:"images/avocado-toast.jpg", ingredients:["Bread","Avocado","Salt","Pepper"]}
];

// ================== Favorites ==================
let favorites = JSON.parse(localStorage.getItem("fav")) || [];

// Add to favorites
function addFavorite(id){
  const recipe = recipes.find(r => r.id === id);
  if(!recipe) return;
  if(!favorites.find(f => f.id === id)){
    favorites.push(recipe); // save full object including image
    localStorage.setItem("fav", JSON.stringify(favorites));
    alert(`${recipe.name} added to favorites!`);
    renderFavorites(); // update favorites page if open
  } else alert(`${recipe.name} is already in favorites`);
}

// Remove from favorites
function removeFav(id){
  favorites = favorites.filter(f => f.id !== id);
  localStorage.setItem("fav", JSON.stringify(favorites));
  renderFavorites(); // update display
}

// ================== Render Favorites ==================
function renderFavorites(){
  const box = document.getElementById("favoritesList");
  if(!box) return; // only run on favorites page
  box.innerHTML = "";

  if(favorites.length === 0){
    box.innerHTML = "<p>No favorite recipes yet!</p>";
    return;
  }

  favorites.forEach(f => {
    const card = document.createElement("div");
    card.className = "recipe-card";
    card.innerHTML = `
      <img src="${f.image}" alt="${f.name}">
      <h3>${f.name}</h3>
      <button onclick="removeFav(${f.id})">❌ Remove</button>
    `;
    box.appendChild(card);
  });
}

// ================== Dark Mode ==================
const darkModeBtn = document.getElementById("darkModeToggle");
darkModeBtn?.addEventListener("click", ()=>{
  document.body.classList.toggle("dark");
});

// Keyboard shortcut: 'd' key for dark mode
document.addEventListener("keydown", e=>{
  if(e.key === "d") document.body.classList.toggle("dark");
});

// ================== Search Autocomplete ==================
const searchInput = document.getElementById("search");
const autocompleteList = document.getElementById("autocomplete");

searchInput?.addEventListener("input", e=>{
  const val = e.target.value.toLowerCase();
  autocompleteList.innerHTML = "";
  if(val !== ""){
    const matches = recipes.filter(r => r.name.toLowerCase().includes(val));
    matches.forEach(m=>{
      const li = document.createElement("li");
      li.innerText = m.name;
      li.onclick = () => { searchInput.value = m.name; autocompleteList.style.display="none"; }
      autocompleteList.appendChild(li);
    });
    autocompleteList.style.display = "block";
  } else autocompleteList.style.display = "none";
});

// ================== Random Cooking Tip from API ==================
fetch("https://www.themealdb.com/api/json/v1/1/random.php")
.then(res => res.json())
.then(data=>{
  const tip = document.getElementById("randomTip");
  if(tip) tip.innerText = "Tip: " + data.meals[0].strInstructions.slice(0,80) + "...";
})
.catch(err => console.log("API Error", err));

// ================== Modal ==================
let currentModalId = null;

function openModal(id){
  const recipe = recipes.find(r => r.id === id);
  if(!recipe) return;
  currentModalId = id;
  document.getElementById("modal-img").src = recipe.image;
  document.getElementById("recipe-title").innerText = recipe.name;
  const ing = document.getElementById("ingredients");
  ing.innerHTML = "";
  recipe.ingredients.forEach(item=>{
    const li = document.createElement("li");
    li.innerText = item;
    ing.appendChild(li);
  });
  document.getElementById("modal").style.display = "flex";
}

function closeModal(){
  document.getElementById("modal").style.display = "none";
}

function addFavoriteModal(){
  if(currentModalId !== null) addFavorite(currentModalId);
}

// Close modal with Escape key
document.addEventListener("keydown", e=>{
  if(e.key === "Escape") closeModal();
});

// ================== Initialize ==================
document.addEventListener("DOMContentLoaded", () => {
  renderFavorites();
});