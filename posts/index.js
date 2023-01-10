const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const axios = require('axios');
const cors = require('cors');

const app = express();

app.use(bodyParser.json());
app.use(cors());

const beers = {};

app.get('/beers', (req, res) =>{
    res.send(beers)
});

app.post('/beers', async (req, res) =>{
    const id = randomBytes(4).toString('hex');
    const { title } = req.body;
    beers[id] = {
        id,
        title
    };

    await axios.post('http://localhost:4005/events', {
        type: 'Beer Created',
        data: {
            id, title
        }
    });

    res.status(201).send(beers[id]);
});

app.post('/events', (req, res) =>{
    console.log('Evento recebido', req.body.type);

    res.send({});
});

const port = 4000;
app.listen(port, () =>{
    console.log(`server Beers on, in port ${port}`);
});