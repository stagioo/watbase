const express = require('express');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const app = express();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, '../frontend')));
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend', 'index.html'));
});


// Endpoint to handle email submissions
app.post('/api/waitlist', async (req, res) => {
    const { email } = req.body;

    // Validate that an email was provided
    if (!email) {
        return res.status(400).json({ error: 'The email is required.' });
    }

    // Insert the email into the waitlist table
    const { data, error } = await supabase
        .from('waitlist')
        .insert([{ email }]);

    if (error) {
        console.error('Error inserting the email:', error);
        return res.status(500).json({ error: 'Error adding email to the waitlist.' });
    }

    return res.status(201).json({ message: 'Email successfully added to the waitlist.', data });
});

app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});