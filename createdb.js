var User = require('./models/user').User;
var async = require('async');
var mongoose = require('./libs/mongoose');
mongoose.set('debug', true);

async.series([
    open,
    dropDatabase,
    createUsers,
    close
], function (err, results) {
    console.log(arguments);
});

function open(callback) {
    mongoose.connection.on('open', callback);
}
function dropDatabase(callback) {
    var db = mongoose.connection.db;
    db.dropDatabase(callback);
}
function createUsers(callback) {
 var users = [
     {username: 'Вася', password: 'supervasya'},
     {username: 'Петя', password: '1234'},
     {username: 'admin', password: 'thetruehero'}
 ];
    async.each(users, function (userData, callback) {
        var user = new User(userData);
        user.save(callback);
    }, callback);
}
function close(callback) {
    mongoose.disconnect(callback);
}

