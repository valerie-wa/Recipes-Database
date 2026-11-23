import express from 'express';
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const domain = process.env.SUPABASE_URL
const supabase_public_key = process.env.SUPABASE_KEY

const supabase = createClient(domain, supabase_public_key)
const PORT = 3000;
const app = express();

app.use(express.json());
app.use(express.static('public'));

app.get('/api/recipes', async(req, res) => {
    const { category, search } = req.query;
    let query = supabase.from('recipes').select('*').order('created_at', { ascending: false });

    if(category) query = query.eq('category', category);
    if(search) query = query.ilike('title', `%${search}%`);

    const { data, error } = await query;
    if(error) return res.status(500).json({ error: error.message});

    res.json(data);
});

app.post('/api/recipes', async(req,res) => {
    const { title, category, prep_time, ingredients, instructions, image_url } = req.body;
    if(!title || !ingredients || !instructions){
        return res.status(400).json({ error: 'Title, ingredients, and instructions are required.'});
    }
    const {data, error} = await supabase
        .from('recipes')
        .insert([{title, category, prep_time, ingredients, instructions, image_url}])
        .select();
    if(error) return res.status(500).json({error: error.message});
    res.status(201).json(data[0]);
});

app.delete('/api/recipes/id', async(req, res) => {
    const {id} = req.params;
    const {error} = await supabase.from('recipes'.delete().eq('id', id));

    if(error) return res.status(500).json({error: error.message});
    res.status(204).send();
})

app.listen(3000, () => {
  console.log('Server listening on http://localhost:3000');
});