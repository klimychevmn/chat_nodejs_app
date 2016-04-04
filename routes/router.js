var path = require('path');
var User = require('../models/user').User;
var ObjectID = require('mongodb').ObjectID;
var login = require('./login');
var chat = require('./chat');

module.exports = function (app) {

    app.use('/users', function (req, res, next) {
        User.find({}, function (err, users) {
            if (err) throw next(err);
            res.json(users);
        });
    });

    app.use('/user/:id', function (req, res, next) {
        try{
            var id = new ObjectID(req.params.id);
        } catch (e) {
            next(e);
            return;
        }

        User.findById(id, function (err, user) {
            if (err) throw next(err);
            if (!user) {
                next(err);
            }
            res.json(user);
        });
    });

    app.get('/login', login.login);
    app.get('/chat', chat.get);
    
    app.post('/login', login.do_login);

    app.use('*', function (req, res) {
        res.sendFile(path.join(__dirname, '../views/index.html'));
    });
};