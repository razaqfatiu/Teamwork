require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

const swaggerDocs = YAML.load('./swagger.yaml');


const app = express();
// eslint-disable-next-line prefer-destructuring
const PORT = process.env.PORT;

const { pool } = require('./api/db/config');
const userRoute = require('./api/routes/user');

pool.connect().then(() => console.log('Db connected successfully !!!'))
  .catch((err) => { console.log(`error ${err}`); });

app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));


app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.use('/api/v1', userRoute);
app.get('/', (req, res) => {
  res.redirect('api/v1/docs/');
  res.end();
});

app.listen(PORT || 3000, () => {
  console.log(`server running on port ${PORT}`);
});
