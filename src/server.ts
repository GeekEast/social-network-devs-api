import express, { json } from 'express';
import config from 'config';
import { connectDB } from './services';
import router from './middlewares/router';
import cors from 'cors';
import _ from 'lodash';

const app = express();
const port = _.get(process, 'env.PORT', config.get('Server.PORT'));

//  connect to mongodb
connectDB();

// mount necessary middlewares
app.use(json()); // parse req.body from string to json object
app.use(cors());
// mount the top level router
app.use('/api', router);

// start the service
app.listen(port, () => {
  console.log(`API server starts at port ${port}`);
});
