const nodeoutlook = require('nodejs-nodemailer-outlook');
const LocalStrategy = require('passport-local');
const bodyParser = require('body-parser');
const admin = require("firebase-admin");
const passport = require('passport');
const mongoose = require('mongoose');
const express = require('express');
const moment = require('moment');

const Order = require('./models/SalesOrder');
const Pharmacy = require('./models/pharmacy');

const vpimedicine = require('./models/vpimedicine');

const app = express();

const MONGODB_URI = "mongodb://GiteshMedi:shastri1@ds263590.mlab.com:63590/medicento";

const serviceAccount = require("./medicentomessaging-firebase-adminsdk-rkrq1-547a4adcde.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://medicentomessaging.firebaseio.com"
});

mongoose.connect(MONGODB_URI);
mongoose.Promise = global.Promise;

app.use(require('express-session')({
    secret: "Gitesh Secret Page",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'))
app.locals.moment = moment;

var active = 'index';

app.use('/history', (req, res, next) => {
    active = 'history';
    Order.find().populate('pharmacy_id').exec().then((orders) => {
        res.render('history', {
            orders: orders,
            active: active
        });
    }).catch(err => {
        console.log(err);
    });
});

app.use('/inventory', (req, res, next) => {
    active = 'inventory';
    vpimedicine.find().exec().then(medicines => {
        res.render('inventory', {
            medicines: medicines,
            active: active
        });
    }).catch( err => {
        console.log(err);
        res.render('inventory');
    });
});

app.use('/marketing', (req, res, next) => {
    active = 'marketing';
    res.render('marketing', {
        active: active
    });
});

app.use('/', (req, res, next) => {
    active = 'index';
    Order.find().populate('pharmacy_id').exec().then((orders) => {
        console.log(orders);
        res.render('index', {
            orders: orders,
            active: active
        });
    }).catch(err => {
        console.log(err);
    });
});

module.exports = app;