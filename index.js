var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');

var indexRouter = require('./routes/index');
var taikhoanRouter = require('./routes/taikhoan');
var chuyennganhRouter = require('./routes/chuyennganh');
var authRouter = require('./routes/auth');
var khoahocRouter = require('./routes/khoahoc');
var lophocRouter = require('./routes/lophoc');

app.set('views', './views');
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(session({
	name: 'thanksNhang',						// Tên session
	secret: 'Noob coder',// Khóa bảo vệ
	resave: true,
	saveUninitialized: true,
	cookie: {
		maxAge: 30 * 86400000			// 30 * (24 * 60 * 60 * 1000) - Hết hạn sau 30 ngày
	}
}));
app.use(function(req, res, next){
	res.locals.session = req.session;
	
	// Lấy thông báo của trang trước đó (nếu có)
	var error = req.session.error;
	var success = req.session.success;
	
	delete req.session.error;
	delete req.session.success;
	
	res.locals.errorMsg = '';
	res.locals.successMsg = '';
	
	if (error) res.locals.errorMsg = error;
	if (success) res.locals.successMsg = success;
	
	next();
});

app.use('/', indexRouter);
app.use('/', authRouter);
app.use('/taikhoan', taikhoanRouter);
app.use('/chuyennganh', chuyennganhRouter);
app.use('/khoahoc', khoahocRouter);
app.use('/lophoc', lophocRouter);

app.listen(3000, function(){
	console.log('Server is running!');
});