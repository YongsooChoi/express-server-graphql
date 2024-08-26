var express = require("express");
var { createHandler } = require("graphql-http/lib/use/express");
var { buildSchema } = require("graphql");

var schema = buildSchema(`
  type Query {
    ip: String
  }
`);

function loggingMiddleware(req, res, next) {
  console.log("ip:", req.ip);
  next();
}

var root = {
  ip(args, context) {
    return context.ip;
  },
};

var app = express();
app.use(loggingMiddleware);
// 인증 관련 미들웨어: Passport, express-jwt, express-session
app.all(
  "/graphql",
  createHandler({
    schema: schema,
    rootValue: root,
    context: (req) => ({
      ip: req.raw.ip,
    }),
  })
);
app.listen(4000);
console.log("Running a GraphQL API server at localhost:4000/graphql");
