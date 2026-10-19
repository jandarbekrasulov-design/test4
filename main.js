const url = "https://dummyjson.com/recipes";
const list = document.querySelector("#list");
const form = document.querySelector("#form");
const input = document.querySelector("#name");
const message = document.querySelector("#message");

function render(recipe) {
  const card = document.createElement("article");
  const image = document.createElement("img");
  if (recipe.image) image.src = recipe.image;
  image.alt = recipe.name || "Изображение рецепта";

  const title = document.createElement("h2");
  title.textContent = recipe.name;
  const cuisine = document.createElement("p");
  cuisine.textContent = recipe.cuisine || "Кухня не указана";
  const button = document.createElement("button");
  button.textContent = "Удалить";
  button.onclick = async () => {
    try {
      const response = await fetch(`${url}/${recipe.id}`, { method: "DELETE" });
      if (!response.ok) throw new Error();
      card.remove();
    } catch {
      message.textContent = "Не удалось удалить рецепт.";
    }
  };

  card.append(image, title, cuisine, button);
  list.append(card);
}

fetch(url)
  .then(response => {
    if (!response.ok) throw new Error();
    return response.json();
  })
  .then(data => data.recipes.forEach(render))
  .catch(() => { message.textContent = "Не удалось загрузить рецепты."; });

form.onsubmit = async event => {
  event.preventDefault();
  const name = input.value.trim();
  if (!name) {
    message.textContent = "Введите название рецепта.";
    return;
  }

  try {
    const response = await fetch(`${url}/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    if (!response.ok) throw new Error();
    const recipe = await response.json();
    render({ ...recipe, name: recipe.name || name });
    input.value = "";
    message.textContent = "";
  } catch {
    message.textContent = "Не удалось добавить рецепт.";
  }
};
