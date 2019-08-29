import express from 'express';
import config from 'config';
const app = express();
const port = config.get('Server.PORT');

app.get('/', (req,res) => {
  res.status(200).send("Hello Rookie");
})


app.listen(port, () => {
  console.log(`API server starts at port ${port}`);
})


// get the uri for mongodb with username and password
const username = config.get("Server.USER") as string;
const access_key = config.get("Server.PASSWORD") as string;
const url = (<string>config.get("Server.URL")).replace(/USER/,username).replace(/PASSWORD/,access_key);