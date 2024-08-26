var express = require("express");
var { createHandler } = require("graphql-http/lib/use/express");
var { buildSchema } = require("graphql");
var { ruruHTML } = require("ruru/server");

// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  type Query {
    quoteOfTheDay: String
    random: Float!
    rollDice(numDice: Int!, numSides: Int): [Int]
  }
`);

// The root provides a resolver function for each API endpoint
var root = {
  quoteOfTheDay() {
    return Math.random() < 0.5 ? "Take it easy" : "Salvation lies within";
  },
  random() {
    return Math.random();
  },
  rollDice({ numDice, numSides }) {
    var output = [];
    for (var i = 0; i < numDice; i++) {
      output.push(1 + Math.floor(Math.random() * (numSides || 6)));
    }
    return output;
  },
};

var app = express();

// Create and use the GraphQL handler.
app.all(
  "/graphql",
  createHandler({
    schema: schema,
    rootValue: root,
  })
);

// Start the server at port
app.listen(4000);
console.log("Running a GraphQL API server at http://localhost:4000/graphql");

// Serve the GraphiQL IDE.
app.get("/", (_req, res) => {
  res.type("html");
  res.end(ruruHTML({ endpoint: "/graphql" }));
});

// var dice = 3
// var sides = 6
// var query = /* GraphQL */`query RollDice($dice: Int!, $sides: Int) {
//   rollDice(numDice: $dice, numSides: $sides)
// }`

// fetch("/graphql", {
//   method: "POST",
//   headers: {
//     "Content-Type": "application/json",
//     Accept: "application/json",
//   },
//   body: JSON.stringify({
//     query,
//     variables: { dice, sides },
//   }),
// })
//   .then(r => r.json())
//   .then(data => console.log("data returned:", data))
