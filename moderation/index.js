const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

app.post('/events', async (req, res) => {

const { type, data } = req.body;

    if (type === 'Comment Created') {
        const status = data.content.includes('orange') ? 'rejected' : 'approved';

        await axios.post('http://localhost:4005/events', {
            type: 'Comment Moderated',
            data: {
            id: data.id,
            beerId: data.beerId,
            status,
            content: data.content
            }
        });
    }

    res.send({});
});


const port = 4003;
app.listen(port, () =>{
    console.log(`server Moderation on, in port ${port}`);
});