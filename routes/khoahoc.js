var express = require('express');
var router = express.Router();
var conn = require('../connect');
var firstImage = require('../firstimage');
var { check, validationResult } = require('express-validator');
let dollarUS = Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
});
// GET: Đăng khóa học
router.get('/them', function(req, res){
	// Lấy  hiển thị vào form thêm
	var sql = 'SELECT * FROM chuyennganh ORDER BY tenchuyennganh';
	conn.query(sql, function(error, results){
		if(error) {
			req.session.error = error;
			res.redirect('/error');
		} else {
			res.render('khoahoc_them', {
				title: 'Create course',
				chuyennganh: results
			});
		}
	});
});

// POST: Đăng khóa học
var validateForm = [
	check('id_chuyennganh').notEmpty().withMessage('Chuyên ngành không được bỏ trống.'),
	check('tenkhoahoc').notEmpty().withMessage('Tiêu đề khóa học không được bỏ trống.'),
	check('mota').notEmpty().withMessage('Mô tả khóa học không được bỏ trống.'),
	check('hocphi').notEmpty().withMessage('Học phí không được bỏ trống.')
];
router.post('/them', validateForm, function(req, res){
	var errors = validationResult(req);
	if(!errors.isEmpty()) {
		// Lấy chuyên ngành hiển thị vào form thêm
		var sql = 'SELECT * FROM chuyennganh ORDER BY tenchuyennganh';
		conn.query(sql, function(error, results){
			if(error) {
				req.session.error = error;
				res.redirect('/error');
			} else {
				res.render('khoahoc_them', {
					title: 'Create',
					chuyennganh: results,
					errors: errors.array()
				});
			}
		});
	} else {
		if(req.session.id_taikhoan) {
			var data = {
				id_chuyennganh: req.body.id_chuyennganh,
				tenkhoahoc: req.body.tenkhoahoc,
				hocphi: req.body.hocphi,
				soluongtoida: req.body.soluongtoida,
				mota: req.body.mota,
				id_giangvien: req.session.id_taikhoan
			};
			var sql = 'INSERT INTO khoahoc SET ?';
			conn.query(sql, data, function(error, results){
				if(error) {
					req.session.error = error;
					res.redirect('/error');
				} else {
					req.session.success = 'Đã tạo khóa học thành công và đang chờ kiểm duyệt.';
					res.redirect('/success');
				}
			});
		} else {
			res.redirect('/dangnhap');
		}
	}
});

// GET: Danh sách khóa học
router.get('/', function(req, res){
    var sql = 'SELECT k.*, c.tenchuyennganh, g.hovaten \
			   FROM khoahoc k, chuyennganh c, taikhoan g \
			   WHERE k.id_chuyennganh = c.id_chuyennganh AND k.id_giangvien = g.id_taikhoan \
			   ORDER BY ngaytao DESC';
	conn.query(sql, function(error, results){
		if(error) {
			req.session.error = error;
			res.redirect('/error');
		} else {
			res.render('khoahoc', {
				title: 'Course List',
				khoahoc: results
			});
		}
	});
});


// GET: Sửa khóa học
router.get('/sua/:id_khoahoc', function(req, res){
	var id_khoahoc = req.params.id_khoahoc;
	var sql = 'SELECT * FROM khoahoc WHERE id_khoahoc = ?;\
			   SELECT * FROM chuyennganh ORDER BY tenchuyennganh';
	conn.query(sql, [id_khoahoc], function(error, results){
		if(error) {
			req.session.error = error;
			res.redirect('/error');
		} else {
			res.render('khoahoc_sua', {
				title: 'Edit course',
				khoahoc: results[0].shift(),
				chuyennganh: results[1]
			});
		}
	});
});

// POST: Sửa khóa học
router.post('/sua/:id_khoahoc', validateForm, function(req, res){
	var errors = validationResult(req);
	if(!errors.isEmpty()) {
		// Lấy chủ đề và khóa học đang sửa hiển thị vào form
		var sql = 'SELECT * FROM khoahoc WHERE id_khoahoc = ?;\
				   SELECT * FROM chuyennganh ORDER BY tenchuyennganh';
		conn.query(sql, function(error, results){
			if(error) {
				req.session.error = error;
				res.redirect('/error');
			} else {
				res.render('baiviet_sua', {
					title: 'Edit course',
					khoahoc: results[0].shift(),
					chuyennganh: results[1],
					errors: errors.array()
				});
			}
		});
	} else {
		var khoahoc = {
			id_chuyennganh: req.body.id_chuyennganh,
			tenkhoahoc: req.body.tenkhoahoc,
			hocphi: req.body.hocphi,
			soluongtoida: req.body.soluongtoida,
			mota: req.body.mota,
			kiemduyet: 0
		};
		var id = req.params.id_khoahoc;
		var sql = 'UPDATE khoahoc SET ? WHERE id_khoahoc = ?';
		conn.query(sql, [khoahoc, id], function(error, results){
			if(error) {
				req.session.error = error;
				res.redirect('/error');
			} else {
				req.session.success = 'Successfully registered for the course and waiting for approval.';
				res.redirect('/success');
			}
		});
	}
});

// GET: Duyệt khóa học
router.get('/duyet/:id_khoahoc', function(req, res){
	var id = req.params.id_khoahoc;
	var sql = 'UPDATE khoahoc SET kiemduyet = 1 - kiemduyet WHERE id_khoahoc = ?';
	conn.query(sql, [id], function(error, results){
		if(error) {
			req.session.error = error;
			res.redirect('/error');
		} else {
			res.redirect('back');
		}
	});
});

// GET: Xóa khóa học
router.get('/xoa/:id_khoahoc', function(req, res){
	var id = req.params.id_khoahoc;
	var sql = 'DELETE FROM khoahoc WHERE id_khoahoc = ?';
	conn.query(sql, [id], function(error, results){
		if(error) {
			req.session.error = error;
			res.redirect('/error');
		} else {
			res.redirect('back');
		}
	});
});

//Các khoá học của tôi: giảng viên
router.get('/cuagiangvien', function(req, res){
	
	var id_giangvien = req.session.id_taikhoan;
	var sql = "select k.*, c.tenchuyennganh from khoahoc k, chuyennganh c, taikhoan t \
	 WHERE k.id_chuyennganh = c.id_chuyennganh and k.kiemduyet=1\
	 AND k.id_giangvien = t.id_taikhoan AND t.quyenhan='giangvien' and t.id_taikhoan=? order by id_khoahoc desc";

	conn.query(sql, [id_giangvien], function(error, results){
		if(error){
			req.session.error = error;
			res.redirect('/error');
		}
		else{
			res.render('khoahoc_giangvien',{
				title: "Courses's Intructor",
				khoahoc: results,
				firstImage: firstImage
			});
		}
	});
});

//Các khoá học của tôi: giảng viên
router.get('/cuagiangvien/danhsach', function(req, res){
	
	var id_giangvien = req.session.id_taikhoan;
	var sql = "select k.*, c.tenchuyennganh from khoahoc k, chuyennganh c, taikhoan t \
	 WHERE k.id_chuyennganh = c.id_chuyennganh\
	 AND k.id_giangvien = t.id_taikhoan AND t.quyenhan='giangvien' and t.id_taikhoan=? order by id_khoahoc desc";

	conn.query(sql, [id_giangvien], function(error, results){
		if(error){
			req.session.error = error;
			res.redirect('/error');
		}
		else{
			res.render('danhsachkhoahoc',{
				title: "Courses's",
				khoahoc: results
			});
		}
	});
});

//Các khoá học của tôi: giảng viên
router.get('/cuagiangvien', function(req, res){
	
	var id_giangvien = req.session.id_taikhoan;
	var sql = "select k.*, c.tenchuyennganh from khoahoc k, chuyennganh c, taikhoan t \
	 WHERE k.id_chuyennganh = c.id_chuyennganh and k.kiemduyet=1\
	 AND k.id_giangvien = t.id_taikhoan AND t.quyenhan='giangvien' and t.id_taikhoan=? order by id_khoahoc desc";

	conn.query(sql, [id_giangvien], function(error, results){
		if(error){
			req.session.error = error;
			res.redirect('/error');
		}
		else{
			res.render('khoahoc_giangvien',{
				title: "Courses's Intructor",
				khoahoc: results,
				firstImage: firstImage
			});
		}
	});
});
// GET: Khoá học của tôi
router.get('/hocvien', function(req, res){
	var sql = 'select k.*, c.tenchuyennganh from khoahoc k, chuyennganh c, dangkylophoc l\
	WHERE k.id_chuyennganh = c.id_chuyennganh and k.kiemduyet=1 AND l.id_hocvien = ?\
	and l.id_khoahoc = k. id_khoahoc;\
	 Select * from chuyennganh';
	conn.query(sql,[req.session.id_taikhoan], function(error, results){
		if(error){
			req.session.error = error;
			res.redirect('/error');
		}
		else{
			res.render('khoahoc_hocvien',{
				title: 'My Courses',
				khoahoc: results[0],
				chuyennganh: results[1],
				firstImage: firstImage
			});
		}
	});
});
module.exports = router;