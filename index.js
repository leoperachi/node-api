const express = require('express');
const res = require('express/lib/response');
const app = express();
app.get('/', (req, res) => res.send('Hello World'));
app.listen(4000, () => {
    console.log(`Example app listening on port 4000`)
});