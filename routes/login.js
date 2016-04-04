var path = require('path');
var User = require('../models/user').User;
var async = require('async');

module.exports.login = function (req, res, next) {
    res.sendFile(path.join(__dirname, '../views/login.html'));
};

module.exports.do_login = function (req, res, next) {

    // Получаем ввод от пользователя
    var username = req.body.username;
    var password = req.body.password;

    User.authorize(username, password, function (err, user) {
        if(err) {
            return next(err);
        }

        req.session.user = user._id;
        res.send({});
    })

};