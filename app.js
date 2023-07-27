const express = require('express');
const boyyparser = require("body-parser")
const { authMiddleware } = require('./auth');
const userRoute = require('./userRoute');
const dealershipRoute = require('./dealerRoute');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({extended : false}))
app.use(bodyParser.json())


app.use('/user', userRoute);
app.use('/dealership', dealershipRoute);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
