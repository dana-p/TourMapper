// Dependencies 

const express = require('express');
const bodyParser = require('body-parser'); // Convert incoming req to JSON
const cors = require('cors'); 
const helmet = require('helmet'); // Secure Express app with various HTTP headers 
const morgan = require('morgan'); // Logging 
const jwt = require('express-jwt'); // Validates a JSON Web Token 
const jwksRsa = require('jwks-rsa'); // Retrieve RSA public keys from JWKS
const app = express(); 

const questions = [] // replace with DB

app.use(helmet())
app.use(bodyParser.json())
app.use(cors())
app.use(morgan('combined')) // Log HTTP requests

const checkJwt = jwt({
    secret: jwksRsa.expressJwtSecret({
        cache: true, 
        rateLimit: true,
        jwksRequestsPerMinute: 5, 
        jwksUri: `https://tour-mapper.auth0.com/.well-known/jwks.json`
    }),

    // Validate the audience and the issuer
    audience: 'LrUWUhZTWmwi0ire5GDCN3F4RUaxJJ62', 
    issuer: `https://tour-mapper.auth0.com/`,
    algorithms: ['RS256']
})

// Retrieve all questions
app.get('/', (req, res) => {
    const qs = questions.map(q => ({
        id: q.id, 
        title: q.title, 
        description: q.description, 
        answers: q.answers.length,
    }));
    res.send(qs); 
});

app.get('/:id', (req, res)=>{
    const question = questions.filter(q => (q.id === parseInt(req.params.id))); 
    if (question.length > 1) return res.status(500).send(); 
    if (question.length === 0) return res.status(404).send(); 
    res.send(questions[0]); 
});

app.post('/', checkJwt, (req, res)=>{
    const {title, description} = req.body; 
    const newQuestion = {
        id: questions.length + 1, 
        title, 
        description, 
        answers: []
    };
    questions.push(newQuestion); 
    res.status(200).send(); 
});

app.post('/answer/:id', checkJwt, (req, res)=>{
    const question = questions.filter(q=>(q.id === parseInt(req.params.id)))
    if (question.length > 1) return res.status(500).send(); 
    if (question.length === 0) return res.status(404).send(); 

    const { answer } = req.body; 
    question[0].answers.push({
        answer, 
        author: req.user.name
    }); // TODO test this, pushing answer in different ways 

    res.status(200).send(); 
});

app.listen(8081, ()=>{
    console.log("Listening on port 8081")
});