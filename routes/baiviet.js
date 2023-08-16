var express = require('express');
var router = express.Router();
var conn = require('../connect');
var { check, validationResult } = require('express-validator');

// GET: Đăng bài viết
router.get('/them', function(req, res){
	// Lấy chủ đề hiển thị vào form thêm
	var sql = 'SELECT * FROM chude ORDER BY TenChuDe';
	conn.query(sql, function(error, results){
		if(error) {
			req.session.error = error;
			res.redirect('/error');
		} else {
			res.render('baiviet_them', {
				title: 'Đăng bài viết',
				chude: results
			});
		}
	});
});

// POST: Đăng bài viết
var validateForm = [
	check('MaChuDe').notEmpty().withMessage('Chủ đề không được bỏ trống.'),
	check('TieuDe').notEmpty().withMessage('Tiêu đề bài viết không được bỏ trống.'),
	check('TomTat').notEmpty().withMessage('Tóm tắt bài viết không được bỏ trống.'),
	check('NoiDung').notEmpty().withMessage('Nội dung bài viết không được bỏ trống.')
];
router.post('/them', validateForm, function(req, res){
	var errors = validationResult(req);
	if(!errors.isEmpty()) {
		// Lấy chủ đề hiển thị vào form thêm
		var sql = 'SELECT * FROM chude ORDER BY TenChuDe';
		conn.query(sql, function(error, results){
			if(error) {
				req.session.error = error;
				res.redirect('/error');
			} else {
				res.render('baiviet_them', {
					title: 'Đăng bài viết',
					chude: results,
					errors: errors.array()
				});
			}
		});
	} else {
		if(req.session.MaNguoiDung) {
			var data = {
				MaChuDe: req.body.MaChuDe,
				TieuDe: req.body.TieuDe,
				TomTat: req.body.TomTat,
				NoiDung: req.body.NoiDung,
				MaNguoiDung: req.session.MaNguoiDung
			};
			var sql = 'INSERT INTO baiviet SET ?';
			conn.query(sql, data, function(error, results){
				if(error) {
					req.session.error = error;
					res.redirect('/error');
				} else {
					req.session.success = 'Đã đăng bài viết thành công và đang chờ kiểm duyệt.';
					res.redirect('/success');
				}
			});
		} else {
			res.redirect('/dangnhap');
		}
	}
});

// GET: Danh sách bài viết
router.get('/', function(req, res){
	var sql = 'SELECT b.*, c.TenChuDe, t.HoVaTen \
			   FROM baiviet b, chude c, taikhoan t \
			   WHERE b.MaChuDe = c.ID AND b.MaNguoiDung = t.ID \
			   ORDER BY NgayDang DESC';
	conn.query(sql, function(error, results){
		if(error) {
			req.session.error = error;
			res.redirect('/error');
		} else {
			res.render('baiviet', {
				title: 'Danh sách bài viết',
				baiviet: results
			});
		}
	});
});

// GET: Danh sách bài viết của tôi
router.get('/cuatoi', function(req, res){
	// Mã người dùng hiện tại
	var id = req.session.MaNguoiDung;
	
	var sql = 'SELECT b.*, c.TenChuDe \
			   FROM baiviet b, chude c \
			   WHERE b.MaChuDe = c.ID AND b.MaNguoiDung = ? \
			   ORDER BY b.NgayDang DESC';
	conn.query(sql, [id], function(error, results){
		if(error) {
			req.session.error = error;
			res.redirect('/error');
		} else {
			res.render('baiviet_cuatoi', {
				title: 'Bài viết của tôi',
				baiviet: results
			});
		}
	});
});

// GET: Sửa bài viết
router.get('/sua/:id', function(req, res){
	var id = req.params.id;
	var sql = 'SELECT * FROM baiviet WHERE ID = ?;\
			   SELECT * FROM chude ORDER BY TenChuDe';
	conn.query(sql, [id], function(error, results){
		if(error) {
			req.session.error = error;
			res.redirect('/error');
		} else {
			res.render('baiviet_sua', {
				title: 'Sửa bài viết',
				baiviet: results[0].shift(),
				chude: results[1]
			});
		}
	});
});

// POST: Sửa bài viết
router.post('/sua/:id', validateForm, function(req, res){
	var errors = validationResult(req);
	if(!errors.isEmpty()) {
		// Lấy chủ đề và bài viết đang sửa hiển thị vào form
		var sql = 'SELECT * FROM baiviet WHERE ID = ?;\
				   SELECT * FROM chude ORDER BY TenChuDe';
		conn.query(sql, function(error, results){
			if(error) {
				req.session.error = error;
				res.redirect('/error');
			} else {
				res.render('baiviet_sua', {
					title: 'Sửa bài viết',
					baiviet: results[0].shift(),
					chude: results[1],
					errors: errors.array()
				});
			}
		});
	} else {
		var baiviet = {
			MaChuDe: req.body.MaChuDe,
			TieuDe: req.body.TieuDe,
			TomTat: req.body.TomTat,
			NoiDung: req.body.NoiDung
		};
		var id = req.params.id;
		var sql = 'UPDATE baiviet SET ? WHERE ID = ?';
		conn.query(sql, [baiviet, id], function(error, results){
			if(error) {
				req.session.error = error;
				res.redirect('/error');
			} else {
				req.session.success = 'Đã đăng bài viết thành công và đang chờ kiểm duyệt.';
				res.redirect('/success');
			}
		});
	}
});

// GET: Duyệt bài viết
router.get('/duyet/:id', function(req, res){
	var id = req.params.id;
	var sql = 'UPDATE baiviet SET KiemDuyet = 1 - KiemDuyet WHERE ID = ?';
	conn.query(sql, [id], function(error, results){
		if(error) {
			req.session.error = error;
			res.redirect('/error');
		} else {
			res.redirect('back');
		}
	});
});

// GET: Xóa bài viết
router.get('/xoa/:id', function(req, res){
	var id = req.params.id;
	var sql = 'DELETE FROM baiviet WHERE ID = ?';
	conn.query(sql, [id], function(error, results){
		if(error) {
			req.session.error = error;
			res.redirect('/error');
		} else {
			res.redirect('back');
		}
	});
});

module.exports = router;