/**
 * Created by liaobonn on 18/05/17.
 *
 * Route used to handle login
 */
// var express = require('express');
// var router = express.Router();

module.exports = function(app, passport){

    app.get('/login', function (req, res) {
        if(req.user){
            req.session.error = "You must log out first before registering";
            res.redirect('/');
        }
        var error = req.session.error;
        req.session.error = null;
        res.render('login', {
            title: 'Login',
            description: 'Log in to Vinylholics with an existing account.',
            message: req.flash('loginMessage'),
            error: error
        });
    });

    app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/', //where to go on success?
            failureRedirect : '/login',
            failureFlash : true
        }),
        function(req, res) {
            if (req.body.remember) {
                req.session.cookie.maxAge = 300000;
            } else {
                req.session.cookie.expires = false;
            }
            res.redirect('/');
        });

    // Redirect the user to Facebook for authentication.  When complete,
    // Facebook will redirect the user back to the application at
    //     /auth/facebook/callback
    app.get('/auth/facebook',
        passport.authenticate('facebook', {
        scope : ['email'],
        successRedirect: '/',
        failureRedirect: '/register' }));

    // Facebook will redirect the user to this URL after approval.  Finish the
    // authentication process by attempting to obtain an access token.  If
    // access was granted, the user will be logged in.  Otherwise,
    // authentication has failed.
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            scope : ['email'],
            successRedirect: '/',
            failureRedirect: '/register' }));

};