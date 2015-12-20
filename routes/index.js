var express = require('express');
var passport = require('passport');
var Account = require('../models/account');
var Audio = require('../models/audio');
var router = express.Router();


router.get('/', function (req, res) {
    res.render('index', { title: 'Home', user : req.user });
});

router.get('/profil', function(req, res) {

    res.render('profil', { title: 'Profil',
                            username: req.user.username,
                            pseudo: req.user.pseudo,
                            age: req.user.age,
                            profile: req.user.profile});
});

router.get('/settings', function(req,res) {
        if (req.user.gender === 'Male') { 
        var checked_male = 'checked';
        var checked_female = ''}
        else {
            var checked_male = '';
            var checked_female = 'checked';
        }
    res.render('settings', {title: 'Settings',info:'',user: req.user, male: checked_male, female: checked_female});
});

router.post('/settings', function(req,res) {
    req.user.pseudo = req.body.pseudo;
    req.user.gender = req.body.gender;
    req.user.country = req.body.country;
    req.user.profil = req.body.profil;
    req.user.day = req.body.day;
    req.user.month = req.body.month;
    req.user.year = req.body.year;

    req.user.save(function(err){
                    if (err) { throw err;}
                    console.log("settings saved");
                });

    if (req.user.gender === 'Male') { 
        var checked_male = 'checked';
        var checked_female = ''}
        else {
            var checked_male = '';
            var checked_female = 'checked';
        }

    res.render('settings', {title: 'Settings',info:'Profil saved',user: req.user, male: checked_male, female: checked_female});
})

router.get('/register', function(req, res) {
    if (req.user === undefined){
        res.render('register', {title: 'Sign up', info: "" });
    } else {
        res.render('profile', {title: 'Profil'});
    }
});

router.post('/register', function(req, res) {
    if (req.body.password === req.body.confirmpassword) {
            Account.register(new Account({ username : req.body.username}) ,
                                req.body.password, function(err, account) {
            if (err) {
                console.log(err);
              return res.render("register", {title: "Sign up", info: "Sorry. That email already exists. Try again."});
            }

            passport.authenticate('local')(req, res, function () {
                res.redirect('settings');
            });
        });
    } else {
        return res.render("register", {title: "Sign up", info: "Sorry. Your password is not the same as the confirm password. Try again"});
    }
});

router.get('/login', function(req, res) {
    res.render('login', { title: 'Login', user : req.user });
});

router.post('/login', passport.authenticate('local'), function(req, res) {
    res.redirect('/explorer');
});

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

router.get('/upload', function (req, res) {
    if (req.user === undefined) {
        res.redirect('/login');
    }
    else {
        res.render('upload', { title: 'Upload', user : req.user });
    }
});

router.post('/upload', function(req, res) {

        var multiparty = require("multiparty");
        var form = new multiparty.Form();

        form.parse(req, function(err,fields,files){

        var fs = require("fs");
        var user = req.user.username;

        files.fileToUpload.forEach(function(element,index,array){
            
            fs.readFile(element.path,function(err,data){
                var x = element.originalFilename;
                var title = x.substr(0, x.lastIndexOf('.'));
                console.log(req.user);
                var audio = {
                    username: req.user.username,
                    pseudo: req.user.pseudo,
                    title : title,
                    isPrivate : false,
                    caption : fields.musictag,
                    dope: 0,
                    listening: 0
                }

                var audiodb = new Audio(audio);
                audiodb.save(function(err){
                    if (err) {throw err;}
                    console.log("audio upload")
                })

                /*Account.update({username: user} , {$push : {audio: audio}},function(err){
                    if (err) {
                        console.log(err);
                    }
                        else {
                            console.log("audio upload");
                        }
                })*/

                fs.writeFile("./audio/" + element.originalFilename,data,function(err){
                    if (err) console.log(err);
                });
            })
        });

        res.send("Upload Success!");

        });    
});

router.get('/explorer',function(req,res){
    if (req.user === undefined) {
        res.redirect('/login');

    } else {

        //var query = Account.find(null);
        var query = Audio.find({$query: {}, $orderby: {_id: 1}});
        query.exec(function(err,data){
            res.render('explorer',{title: 'Explore', audiolist: data, user: req.user });
        });
    }
});

router.get('/myaudio',function(req,res){
    if (req.user === undefined) {
        res.redirect('/login');

    } else {

        var query = Account.find({username: req.user.username});
        query.exec(function(err,data){
            res.render('myaudio',{title: 'My audio', audiolist: data, user: req.user });
        });
    }
});

module.exports = router;