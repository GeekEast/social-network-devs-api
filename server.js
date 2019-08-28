const express = require('express');
const config = require('config');
const app = express();
const port = config.get('Server.PORT');

app.get('/', (req,res) => {
  res.status(200).send("Hello Rookie");
})



app.listen(port, () => {
  console.log(`API server starts at port ${port}`);
})

