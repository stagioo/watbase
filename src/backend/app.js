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


// Endpoint para manejar el envío de correos electrónicos
app.post('/api/waitlist', async (req, res) => {
    const { email } = req.body;

    // Validar que se haya proporcionado un correo electrónico
    if (!email) {
        return res.status(400).json({ error: 'El correo electrónico es requerido.' });
    }

    // Insertar el correo electrónico en la tabla waitlist
    const { data, error } = await supabase
        .from('waitlist')
        .insert([{ email }]);

    if (error) {
        console.error('Error al insertar el correo:', error);
        return res.status(500).json({ error: 'Error al insertar el correo en la lista de espera.' });
    }

    return res.status(201).json({ message: 'Correo electrónico agregado a la lista de espera.', data });
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});