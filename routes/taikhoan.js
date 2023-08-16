var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require("fs");
var conn = require('../connect');
var { check, validationResult } = require('express-validator');
var bcrypt = require('bcrypt');
var saltRounds = 10;
var multer = require('multer');

var storageConfig = multer.diskStorage({
	destination: function(req, file, callback){
		callback(null, 'public/uploads/');
	},
	filename: function(req, file, callback){
		var timestamp = Date.now();
		callback(null, timestamp + path.extname(file.originalname));
	}
});
var upload = multer({ storage: storageConfig });

// GET: Thêm tài khoản
router.get('/them', function(req, res){
	res.render('taikhoan_them', { title: 'Add account' });
});

// POST: Thêm tài khoản
var validateForm = [
	check('hovaten')
		.notEmpty().withMessage('Họ và tên không được bỏ trống.'),
	check('tendangnhap')
		.notEmpty().withMessage('Tên đăng nhập không được bỏ trống.')
		.isLength({ min: 6 }).withMessage('Tên đăng nhập phải lớn hơn 6 ký tự.'),
	check('matkhau')
		.notEmpty().withMessage('Mật khẩu không được bỏ trống.')
		.custom((value, { req }) => value === req.body.xacnhanmatkhau).withMessage('Xác nhận mật khẩu không đúng.')
];
router.post('/them', upload.single('hinhanh'), validateForm, function(req, res){
	var errors = validationResult(req);
	if(!errors.isEmpty()) {
		if(req.file) fs.unlink(req.file.path, function(err){});
		res.render('taikhoan_them', {
			title: 'Thêm tài khoản',
			errors: errors.array()
		});
	} else {
		var fileName = '';
		if(req.file) fileName = req.file.filename;
		var data = {
			hovaten: req.body.hovaten,
			email: req.body.email,
			sdt: req.body.sdt,
			tendangnhap: req.body.tendangnhap,
			matkhau: bcrypt.hashSync(req.body.matkhau, saltRounds),
			hinhanh: fileName,
			quyenhan: req.body.quyenhan,
		};
		var sql = 'INSERT INTO taikhoan SET ?';
		conn.query(sql, data, function(error, results){
			if(error) {
				req.session.error = error;
				res.redirect('/error');
			} else {
				res.redirect('/taikhoan');
			}
		});
	}
});

// GET: Danh sách tài khoản
router.get('/', function(req, res){
	var sql = "SELECT * FROM taikhoan";
	conn.query(sql, function(error, results){
		if(error) {
			req.session.error = error;
			res.redirect('/error');
		} else {
			res.render('taikhoan', {
				title: 'Account List',
				taikhoan: results
			});
		}
	});
});
// GET: Danh sách giáo viên
router.get('/giangvien', function(req, res){
	var sql = "SELECT * FROM taikhoan where quyenhan = 'giangvien'";
	conn.query(sql, function(error, results){
		if(error) {
			req.session.error = error;
			res.redirect('/error');
		} else {
			res.render('taikhoan', {
				title: 'Intructors',
				taikhoan: results
			});
		}
	});
});
// GET: Danh sách học viên
router.get('/hocvien', function(req, res){
	var sql = "SELECT * FROM taikhoan where quyenhan = 'hocvien'";
	conn.query(sql, function(error, results){
		if(error) {
			req.session.error = error;
			res.redirect('/error');
		} else {
			res.render('taikhoan', {
				title: 'Student',
				taikhoan: results
			});
		}
	});
});


// GET: Sửa tài khoản
router.get('/sua/:id_taikhoan', function(req, res){
	var id_taikhoan = req.params.id_taikhoan;
	var sql = 'SELECT * FROM taikhoan WHERE id_taikhoan = ?';
	conn.query(sql, [id_taikhoan], function(error, results){
		if(error) {
			req.session.error = error;
			res.redirect('/error');
		} else {
			res.render('taikhoan_sua', {
				title: 'Edit account',
				id_taikhoan: results[0].id_taikhoan,
				hovaten: results[0].hovaten,
				email: results[0].email,
				sdt: results[0].sdt,
				hinhanh: results[0].hinhanh,
				tendangnhap: results[0].tendangnhap,
				matkhau: results[0].matkhau,
				quyenhan: results[0].quyenhan,
				kichhoat: results[0].kichhoat,
			});
		}
	});
});

// POST: Sửa tài khoản
var validateFormEdit = [
	check('hovaten')
		.notEmpty().withMessage('Họ và tên không được bỏ trống.'),
	check('tendangnhap')
		.notEmpty().withMessage('Tên đăng nhập không được bỏ trống.')
		.isLength({ min: 6 }).withMessage('Tên đăng nhập phải lớn hơn 6 ký tự.'),
	check('matkhau')
		.custom((value, { req }) => value === req.body.xacnhanmatkhau).withMessage('Xác nhận mật khẩu không đúng.')
];

router.post('/sua/:id_taikhoan', upload.single('hinhanh'), validateFormEdit, function(req, res){
	var errors = validationResult(req);
	if(!errors.isEmpty()) {
		if(req.file) fs.unlinkSync(req.file.path, function(err){});
		res.render('taikhoan_sua', {
			title: 'Edit account',
			id_taikhoan: req.params.id_taikhoan,
			hovaten: req.body.hovaten,
			email: req.body.email,
			sdt: req.body.sdt,
			hinhanh: req.body.hinhanh,
			tendangnhap: req.body.tendangnhap,
			matkhau: req.body.matkhau,
			quyenhan: req.body.quyenhan,
			kichhoat: req.body.kichhoat,
			errors: errors.array()
		});
	} else {
		var taikhoan = {
			hovaten: req.body.hovaten,
			email: req.body.email,
			sdt: req.body.sdt,
			tendangnhap: req.body.tendangnhap,
			quyenhan: req.body.quyenhan,
			kichhoat: req.body.kichhoat,
		};
		if(req.body.matkhau)
			taikhoan['matkhau'] = bcrypt.hashSync(req.body.matkhau, saltRounds);
		if(req.file){
			taikhoan['hinhanh'] = req.file.filename;
		}
		var id_taikhoan = req.params.id_taikhoan;
		var sql = 'UPDATE taikhoan SET ? WHERE id_taikhoan = ?';
		conn.query(sql, [taikhoan, id_taikhoan], function(error, results){
			if(error) {
				req.session.error = error;
				res.redirect('/error');
			} else {
				res.redirect('/taikhoan');
			}
		});
	}
});
// GET: Duyệt tài khoản
router.get('/duyet/:id_taikhoan', function(req, res){
	var id = req.params.id_taikhoan;
	var sql = 'UPDATE taikhoan SET kichhoat = 1 - kichhoat WHERE id_taikhoan = ?';
	conn.query(sql, [id], function(error, results){
		if(error) {
			req.session.error = error;
			res.redirect('/error');
		} else {
			res.redirect('back');
		}
	});
});
// GET: Xóa tài khoản
router.get('/xoa/:id_taikhoan', function(req, res){
	var id = req.params.id_taikhoan;
	var sql = 'DELETE FROM taikhoan WHERE id_taikhoan = ?';
	conn.query(sql, [id], function(error, results){
		if(error) {
			req.session.error = error;
			res.redirect('/error');
		} else {
			res.redirect('/taikhoan');
		}
	});
});

// GET: tài khoản của tôi
router.get('/cuatoi/:id_taikhoan', function(req, res){
	var id_taikhoan = req.params.id_taikhoan;
	var sql = 'SELECT * FROM taikhoan WHERE id_taikhoan = ?';
	conn.query(sql, [id_taikhoan], function(error, results){
		if(error) {
			req.session.error = error;
			res.redirect('/error');
		} else {
			res.render('taikhoancuatoi', {
				title: 'Edit account',
				id_taikhoan: results[0].id_taikhoan,
				hovaten: results[0].hovaten,
				email: results[0].email,
				sdt: results[0].sdt,
				hinhanh: results[0].hinhanh,
				tendangnhap: results[0].tendangnhap,
				matkhau: results[0].matkhau,
				quyenhan: results[0].quyenhan,
				kichhoat: results[0].kichhoat,
			});
		}
	});
});

// POST: My account tài khoản
var validateFormEdit = [
	check('hovaten')
		.notEmpty().withMessage('Họ và tên không được bỏ trống.'),
	check('tendangnhap')
		.notEmpty().withMessage('Tên đăng nhập không được bỏ trống.')
		.isLength({ min: 6 }).withMessage('Tên đăng nhập phải lớn hơn 6 ký tự.'),
	check('matkhau')
		.custom((value, { req }) => value === req.body.xacnhanmatkhau).withMessage('Xác nhận mật khẩu không đúng.')
];

router.post('/sua/:id_taikhoan', upload.single('hinhanh'), validateFormEdit, function(req, res){
	var errors = validationResult(req);
	if(!errors.isEmpty()) {
		if(req.file) fs.unlinkSync(req.file.path, function(err){});
		res.render('taikhoan_sua', {
			title: 'Edit account',
			id_taikhoan: req.params.id_taikhoan,
			hovaten: req.body.hovaten,
			email: req.body.email,
			sdt: req.body.sdt,
			hinhanh: req.body.hinhanh,
			tendangnhap: req.body.tendangnhap,
			matkhau: req.body.matkhau,
			quyenhan: req.body.quyenhan,
			kichhoat: req.body.kichhoat,
			errors: errors.array()
		});
	} else {
		var taikhoan = {
			hovaten: req.body.hovaten,
			email: req.body.email,
			sdt: req.body.sdt,
			tendangnhap: req.body.tendangnhap,
			quyenhan: req.body.quyenhan,
			kichhoat: req.body.kichhoat,
		};
		if(req.body.matkhau)
			taikhoan['matkhau'] = bcrypt.hashSync(req.body.matkhau, saltRounds);
		if(req.file){
			taikhoan['hinhanh'] = req.file.filename;
		}
		var id_taikhoan = req.params.id_taikhoan;
		var sql = 'UPDATE taikhoan SET ? WHERE id_taikhoan = ?';
		conn.query(sql, [taikhoan, id_taikhoan], function(error, results){
			if(error) {
				req.session.error = error;
				res.redirect('/error');
			} else {
				res.redirect('/taikhoan');
			}
		});
	}
});

module.exports = router;