var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
var Association = require('./association');
var User = require('../user/User');

router.post('/', function (req, res) {
    let assocArray = [{
        userid : req.body.userid,
        associationId : req.body.associationId,
        type : req.body.type
    }];

    if(req.body.type === 'user') {
        assocArray.push({
            userid : req.body.associationId,
            associationId : req.body.userid,
            type : req.body.type
        });
    }

    Association.create(assocArray, 
        function (err, assocs) {
            if (err) return res.status(500).send("There was a problem adding the information to the database.");
            res.status(200).send(assocs);
        });
});

router.get('/', function (req, res) {
    Association.find({userid: req.query.userid}, function (err, assocs) {
        if (err) return res.status(500).send("There was a problem finding the users.");
        res.status(200).send(assocs);
    });
});

router.get('/friends', function (req, res) {
    Association.find({userid: req.query.userid}, function (err, assocs) {
        if (err)
            return res.status(500).send("There was a problem finding the users.");
        const friendIds = assocs.filter(obj => obj.type === 'user').map(obj => obj.associationId);
        const groupIds = assocs.filter((obj,idx,arr) => obj.type === 'group' && arr.indexOf(obj) === idx).map(obj => obj.associationId)
        const groupsPromise = Association.groups({associationId: { $in: groupIds }});
        const userPromise = User.details({userid: { $in: friendIds }});

        Promise.all([groupsPromise, userPromise]).then(response => {
            let users = response[1];
            users = users.map(obj => {
                return {
                    userid: obj.userid,
                    name: obj.name,
                    age : Math.floor((new Date() - new Date(obj.dob))/(1000 * 3600 * 24 * 365)),
                    location: obj.location,
                    type: 'user'
                };
            });
            res.status(200).send([...response[0],...users]);
        })
        .catch(err => {
            res.status(404).send(err);
        }); 
    });
});

module.exports = router;