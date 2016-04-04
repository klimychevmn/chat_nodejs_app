var crypto = require('crypto');
var async = require('async');

var mongoose = require('../libs/mongoose'),
    Schema = mongoose.Schema;

var schema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    hashedPassword: {
        type: String,
        required: true
    },
    salt: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    }
});

schema.methods.encryptPassword = function(password) {
    return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
};

schema.virtual('password')
    .set(function(password) {
        this._plainPassword = password;
        this.salt = Math.random() + '';
        this.hashedPassword = this.encryptPassword(password);
    })
    .get(function() { return this._plainPassword; });


schema.methods.checkPassword = function(password) {
    return this.encryptPassword(password) === this.hashedPassword;
};

schema.statics.authorize = function (username, password, callback) {

    var User = this;
    async.waterfall([
        function (callback) {
            //ищем в бд такого полльзователя по username
            User.findOne({username: username}, callback);
        },
        function (user, callback) {
            if(user) {
                // если пользщователь есть - проверяем пароль и выдаем ответ
                if(user.checkPassword(password)) {
                    callback(null, user);
                } else {
                    callback(new Error("Sorry, unknown password!"));
                }
            } else {
                // если пользователя нет - можно ответить 403, но в данной реализации, если юзера нет = регистрация
                // заводим нового пользователя
                var user = new User({
                    username: username,
                    password: password
                });
                //и сохраняем
                user.save(function (err) {
                    if(err) return callback(err);
                    callback(null, user);
                });
            }
        }

    ], callback);
};

exports.User = mongoose.model('User', schema);
