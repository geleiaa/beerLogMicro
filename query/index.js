const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const app = express();

app.use(bodyParser.json());
app.use(cors());

const beers = {};

const handleEvents = (type, data) =>{

    if(type === 'Beer Created'){
        const { id, title } = data;

        beers[id] = { id, title, comments: [] };
    }

    if(type === 'Comment Created'){
        const { id, content, beerId, status } = data;

        const beer = beers[beerId];

        beer.comments.push({ id, content, status });
    }

    if(type === 'Comment Updated'){
        const { id, content, beerId, status } = data;

        const beer = beers[beerId];
        const comment = beer.comments.find(comment =>{
            return comment.id === id;
        });

        comment.status = status;
        comment.content = content;
    }
}

app.get('/beers', (req, res) =>{
    res.send(beers);
});

app.post('/events', (req, res) =>{
    const { type, data } = req.body;

    handleEvents(type, data);

    //console.log(beers);

    res.send({});
});

const port = 4002;
app.listen(port, async () =>{
    console.log(`server Query on, in port ${port}`);

    const res = await axios.get('http://localhost:4005/events');

    for(let event of res.data){
        console.log('Processando evento', res.type);

        handleEvents(event.type, event.data);
    }
});