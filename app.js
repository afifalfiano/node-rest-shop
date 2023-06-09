const express = require('express')
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/users');

mongoose.connect('mongodb+srv://node-shop:'+ process.env.MONGOOSE_ATLAS_PASSWORD + '@node-rest-shop.murhvsl.mongodb.net/?retryWrites=true&w=majority');
mongoose.Promise = global.Promise;



app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'))

app.use((req, res, next) => {
    res.header('Accept-Control-Allow-Origin', '*');
    res.header('Accept-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Accept-Language');

    if (req.method === 'OPTIONS') {
        res.header('Aaccept-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET')
        return res.status(200).json({});
    }

    next()
})


app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/user', userRoutes);

app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = (404);
    next(error);
})

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message,
        }
    })
})


module.exports = app;