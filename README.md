# Recipes-Database

#### Backend
a supabase database containing all our your recipes! 
Has column values of id, title(required), category, prep_time(required), ingredients(an array, required), instructions, image_url.

#### Frontend
Very simple frontend build with html, css, js.
Allows you to add in/paste recipes, search, and delete. Has accompanying photos for your yummy food 😋🍴

#### To run
- make sure npm, node, supabase are all installed
```bash
npm init -y
npm install @supabase/supabase-js dotenv
```
- run
```bash
node server.js
```