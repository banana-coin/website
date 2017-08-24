var express = require('express');
var app = express();

app.use(express.static('build'))

app.listen(3000, function() {
    console.log('app listening on port 3000! http://localhost:3000');
});

// test ss