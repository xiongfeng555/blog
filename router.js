var md5 = require('blueimp-md5');
var express = require('express');
var User = require('./models/user');
var info = require('./models/info')
var router = express.Router();

router.get('/', function(req, res) {
    info.find(function(err, data) {
        console.log(data)
        if (err) {
            return res.status(500).json({
                err_code: 500,
                message: err.message
            });
        }
        res.render('index', {
            user: req.session.userInfo,
            info: data
        });

    });

});
router.get('/login', function(req, res) {
    res.render('login');
});
router.post('/login', function(req, res) {
    var body = req.body;
    User.findOne({
        email: body.email,
        password: md5(body.password)
    }, function(err, user) {
        if (err) {
            return res.status(500).json({
                err_code: 500,
                message: err.message
            });
        }
        if (!user) {
            return res.status(200).json({
                err_code: 1,
                message: 'email or nickname has existed'
            });
        }
        req.session.userInfo = user;
        res.status(200).json({
            err_code: 0,
            message: "ok"
        });
    });
});
router.get('/register', function(req, res) {
    res.render('register');
});
router.post('/register', function(req, res) {
    var body = req.body;
    User.findOne({
        $or: [{
                email: body.email
            },
            {
                nickname: body.nickname
            }
        ]
    }, function(err, data) {
        if (err) {
            return res.status(500).json({
                err_code: 500,
                message: 'server error'
            });
        }
        if (data) {
            return res.status(200).json({
                err_code: 1,
                message: '邮箱或昵称已存在'
            });

        }
        //md5加密
        body.password = md5(body.password);



        //添加到数据库中
        new User(body).save(function(err) {
            if (err) {
                return res.status(500).json({
                    err_code: 500,
                    message: 'server error'
                });
            }

        });

        //添加session
        req.session.userInfo = body;

        res.status(200).json({
            err_code: 0,
            message: 'ok'
        });

    });
});

router.get('/topics/new', function(req, res) {
    res.render('topic/new.html', {
        user: req.session.userInfo,

    });
});

//提交发布页
router.post('/commit', function(req, res) {
    var body = req.body;
    new info(body).save(function(err, content) {
        if (err)
            return res.status(500).json({
                err_code: 500,
                message: err.message
            });
        var arr = [];
        arr.push(content);
        res.redirect('/');
    });
});

//退出登录
router.get('/logout', function(req, res) {
    req.session.userInfo = null;
    res.redirect('/login');
});
module.exports = router;