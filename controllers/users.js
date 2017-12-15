const User = require('../models/user');
const passport = require('passport');
const bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports = {
    login(req, res, next) {
        let body = req.body;
        console.log(body);
        //res.redirect('./index.html');

    },
    signup(req, res, next) {
        const body = req.body;
        const { name, email, username, password } = body;

        User.findOne({ username: username })
            .then((users) => {
                if (users) {
                    res.send({ in_use: true });
                } else {
                    bcrypt.hash(password, saltRounds, function(err, hash) {
                        // Store hash in your password DB.
                        const user = new User({ name: name, email: email, username: username, password: hash });
                        user.save()
                            .then(() => {
                                User.findOne({ username: user.username })
                                    .then((user) => {
                                        const id = user._id.toString();
                                        console.log(id);
                                        req.login(id, (err) => {
                                            console.log('REDIRECT');
                                            res.redirect('/');
                                        });
                                    });
                                //res.header("Access-Control-Allow-Origin", "*");
                                //res.send(user)
                            });
                        console.log('New user:' + user);
                    });
                }
            });
        passport.serializeUser(function(id, done) {
            done(null, id);
        });

        passport.deserializeUser(function(id, done) {
            User.findById(id, function(err, user) {
                done(null, user);
            });
        });
    }
}

//     comment(req, res) {
//         const { post } = req.params;
//         const body = req.body;
//         const { name, content } = body;
//         JSON.stringify(name);
//         JSON.stringify(content);

//         const comment = new Blog({ name: name, post: post, content: content });
//         comment.save()
//             .then(() => {
//                 res.header("Access-Control-Allow-Origin", "*");
//                 res.send(comment)
//             });
//         console.log(comment);
//     },

//     show(req, res) {
//         const { post } = req.params;

//         Blog.find({ post: post })
//             .then((comments) => {
//                 res.header("Access-Control-Allow-Origin", "*");
//                 res.send(comments)
//             });

//     },
//     hello(req, res) {
//         res.send('Hello there!');
//     }
// }