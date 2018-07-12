var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
var User = require('./User');

router.post('/', function (req, res) {
    User.create({
            userid : req.body.userid,
            name : req.body.name,
            password : req.body.password,
            location : req.body.location,
            dob : req.body.dob
        }, 
        function (err, user) {
            if (err) return res.status(500).send("There was a problem adding the information to the database.");
            res.status(200).send(user.userid);
        });
});

router.post('/authenticate', function (req, res) {
    User.authenticate(req.body.userid, req.body.password, function(err, result) {
        if(err) {
            console.err(err);
        }
        if(result) {
            res.status(200).send(req.body.userid);
        }
        else {
            res.status(404).send('User not authenticated!');
        }
    });
});

router.get('/', function (req, res) {
    User.details({}).then(users => {
        res.status(200).send(users);
    })
    .catch(err => {
        res.status(500).send("There was a problem finding the users.");
    });
});

module.exports = router;