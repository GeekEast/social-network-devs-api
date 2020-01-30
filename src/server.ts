import express, { json } from 'express';
import config from 'config';
import { connectDB } from './services';
import { router } from './middlewares';
import cors from 'cors';
import _ from 'lodash';

const app = express();
const port = _.get(process, 'env.PORT', config.get('Server.PORT'));

connectDB();

app.use(json()); // parse req.body from string to json object
app.use(cors());

app.use('/api', router);

app.listen(port, () => {
  console.log(`API server starts at port ${port}`);
});
