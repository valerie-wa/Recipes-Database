const recipesContainer = document.getElementById('recipes-container');
const recipeForm = document.getElementById('recipe-form');
const searchInput = document.getElementById('search-input');
const filterCategory = document.getElementById('filter-category');
const searchBtn = document.getElementById('search-btn');

// Fetch and render recipes (supports search + category query params)
async function loadRecipes() {
  const params = new URLSearchParams();
  if (searchInput.value.trim()) params.append('search', searchInput.value.trim());
  if (filterCategory.value) params.append('category', filterCategory.value);

  const res = await fetch(`/api/recipes?${params.toString()}`);
  const recipes = await res.json();

  if (!res.ok) {
    recipesContainer.innerHTML = `<p>Error: ${recipes.error}</p>`;
    return;
  }

  if (recipes.length === 0) {
    recipesContainer.innerHTML = '<p>No recipes found.</p>';
    return;
  }

  recipesContainer.innerHTML = recipes.map(recipe => `
    <div class="recipe-card">
        ${recipe.image_url ? `
            <img
                src = "${escapeHtml(recipe.image_url)}"
                alt="${escapeHtml(recipe.title)}"
                class="recipe-banner"
            />
        ` : ''}
        <div class="recipe-header">
            <h3>${escapeHtml(recipe.title)}</h3>
            <button class="delete-btn" onclick="deleteRecipe(${recipe.id})">Delete</button>
        </div>
      <p><strong>Category:</strong> ${escapeHtml(recipe.category || 'Uncategorized')} | <strong>Prep:</strong> ${recipe.prep_time ?? '-'} mins</p>
      <strong>Ingredients:</strong>
      <ul>
        ${(Array.isArray(recipe.ingredients) ? recipe.ingredients : [recipe.ingredients])
          .map(item => `<li>${escapeHtml(item)}</li>`).join('')}
      </ul>
      <strong>Instructions:</strong>
      <p style="white-space: pre-line;">${escapeHtml(recipe.instructions)}</p>
    </div>
  `).join('');
}

// POST a new recipe
recipeForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const rawImageUrl = document.getElementById('image_url').value.trim();

  const payload = {
    title: document.getElementById('title').value.trim(),
    category: document.getElementById('category').value,
    prep_time: Number(document.getElementById('prep_time').value),
    ingredients: document.getElementById('ingredients').value
      .split('\n')
      .map(line => line.trim())
      .filter(Boolean),
    instructions: document.getElementById('instructions').value.trim(),
    image_url: rawImageUrl || null
  };

  const res = await fetch('/api/recipes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (res.ok) {
    recipeForm.reset();
    loadRecipes();
  } else {
    const err = await res.json();
    alert(`Failed to add recipe: ${err.error}`);
  }
});

// DELETE a recipe by ID
async function deleteRecipe(id) {
  const res = await fetch(`/api/recipes/${id}`, { method: 'DELETE' });
  if (res.ok) {
    loadRecipes();
  } else {
    alert('Failed to delete recipe.');
  }
}

// Search & filter triggers
searchBtn.addEventListener('click', loadRecipes);
filterCategory.addEventListener('change', loadRecipes);
searchInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') loadRecipes();
});

// Basic HTML escaping so user text renders safely
function escapeHtml(str) {
  return String(str ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

// Initial load
loadRecipes();