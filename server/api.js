const jwt = require("express-jwt"); // Validates a JSON Web Token
const jwksRsa = require("jwks-rsa"); // Retrieve RSA public keys from JWKS
  

// Retrieve all questions
const Question = require("./Models/Question");

module.exports = function(app, config) {
  /*
 |--------------------------------------
 | Authetication 
 |--------------------------------------
 */

  const checkJwt = jwt({
    secret: jwksRsa.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: `https://tour-mapper.auth0.com/.well-known/jwks.json`
    }),

    // Validate the audience and the issuer
    audience: "LrUWUhZTWmwi0ire5GDCN3F4RUaxJJ62",
    issuer: `https://tour-mapper.auth0.com/`,
    algorithms: ["RS256"]
  });

  /*
   |--------------------------------------
   | Requests
   |--------------------------------------
   */

  app.get("/api/questions", (req, res) => {
    Question.find(function(err, questions) {
      if (err) {
        res.send(err);
      }
      const qs = questions.map(q => ({
        id: q.id,
        title: q.title,
        description: q.description,
        answers: q.answers.length
      }));
      res.send(qs);
    });
  });

  app.get("/api/question/:id", (req, res) => {
    Question.findById(req.params.id, function(err, question) {
      if (err) res.send(err);
      res.json(question);
    });
  });

  app.post("/api/newquestion", checkJwt, (req, res) => {
    const { title, description } = req.body;
    const newQuestion = new Question({
      title,
      description,
      answers: []
    });
    newQuestion.save(function(err) {
      if (err) {
        return res.status(500).send({ message: err.message });
      }
      res.status(200).send();
    });
  });

  app.post("/api/questions/answer/:id", checkJwt, (req, res) => {
    console.log(req.params);

    Question.findById(req.params.id, function(err, question) {
      if (err) {
        console.log("-ERROR-" + err.message);
        res.send(err);
        return;
      }

      console.log(question);
      const { answer } = req.body;
      question.answers.push({
        answer,
        author: req.user.name
      });

      question.save(function(err) {
        if (err) {
          return res.status(500).send({ message: err.message });
        }
        res.status(200).send();
      });
    });
  });
};
