const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const axios = require('axios');
const cors = require('cors');

const app = express();

app.use(bodyParser.json());
app.use(cors());

const commentsByBeerId = {};

app.get('/beers/:id/comments', (req, res) =>{
    res.send(commentsByBeerId[req.params.id] || []);
});

app.post('/beers/:id/comments', async (req, res) =>{
    const commentId = randomBytes(4).toString('hex');
    const { content } = req.body;

    const comments = commentsByBeerId[req.params.id] || [];
    comments.push({ id: commentId, content, status: 'pending' });

    commentsByBeerId[req.params.id] = comments;

    await axios.post('http://localhost:4005/events', {
        type: 'Comment Created',
        data: {
            id: commentId,
            content,
            beerId: req.params.id,
            status: 'pending'
        }
    });

    res.status(201).send(comments);
});

app.post('/events', async (req, res) =>{
    console.log('Evento recebido', req.body.type);

    const { type, data } = req.body;

    if(type === 'Comment Moderated') {
        const { beerId, id, status, content } = data;
        const comments = commentsByBeerId[beerId];

        const comment = comments.find(comment => {
            return comment.id === id;
        });

        comment.status = status;

        await axios.post('http://localhost:4005/events', {
            type: 'Comment Updated',
            data:{
                id,
                status,
                beerId,
                content
            }
        })
    }

    res.send({});
});

const port = 4001;
app.listen(port, () =>{
    console.log(`server Comments on, in port ${port}`);
});