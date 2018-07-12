var multer = require('multer');
var express = require('express');
var router = express.Router();

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        var extensions = {
            "image/jpeg" : 'jpg',
            "image/png" : 'png'
        };
        var extn = extensions[file.mimetype] ? `.${extensions[file.mimetype]}` : '';
        cb(null, file.fieldname + '-' + Date.now() + extn);
    }
});

var upload = multer({
    storage
});

router.post('/imageUpload', upload.single('fileUpload'), function (req, res) {
    if(req.file) {
        res.status(200).send('Uploaded Successfully!');
    }
    else {
        res.status(500).send('File not found!');
    }
});

module.exports = router;