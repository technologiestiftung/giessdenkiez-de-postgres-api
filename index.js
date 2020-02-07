const express = require('express');

const checkJwt = require('./auth/');

const getWateredTrees = require('./requests/get-watered-trees');
const getAdoptedTrees = require('./requests/get-adopted-trees')
const getTree = require('./requests/get-tree')
const adoptTree = require('./requests/adopt-tree')
const unadoptTree = require('./requests/unadopt-tree')
const waterTree = require('./requests/water-tree')
// const waterTreeArr = require('./requests/water-tree-arr')
const getTreeByAge = require('./requests/get-tree-by-age')
const countTreeByAge = require('./requests/count-tree-by-age')

const app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

app.use(express.json());

app.listen(process.env.PORT, err => {
    if (err) throw err
    console.log(`> Ready On Server http://localhost:`)
});

app.get("/get", (req, res, next) => {
    res.json({
        "version": process.env.VERSION
    });
});

app.get("/get-tree", getTree);

app.get("/count-tree-by-age", countTreeByAge);

app.get("/get-tree-by-age", getTreeByAge);

app.get("/private/water-tree", checkJwt, waterTree);

// app.get("/private/water-tree-arr", checkJwt, waterTreeArr);

app.get("/get-watered-trees", getWateredTrees);

app.get("/private/adopt-tree", checkJwt, adoptTree);

app.get("/private/unadopt-tree", checkJwt, unadoptTree);

app.get("/private/get-adopted-trees", checkJwt, getAdoptedTrees);

app.post('/post', function(request, response) {
    response.send(request.body);
});
