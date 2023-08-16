var express = require('express');
var router = express.Router();
var conn = require('../connect');
// GET: Danh sách lop hoc
router.get('/:id_khoahoc', function(req, res){
	
	var sql = "SELECT t.*, l.id_khoahoc FROM dangkylophoc l, taikhoan t\
	where l.id_hocvien = t.id_taikhoan AND l.id_khoahoc=? ORDER BY hovaten;\
	select k.tenkhoahoc, k.soluongtoida, count(l.id_hocvien) as sl from khoahoc k, dangkylophoc l \
	WHERE l.id_khoahoc=k.id_khoahoc AND k.id_khoahoc=?\
	GROUP BY k.id_khoahoc";
	conn.query(sql, [req.params.id_khoahoc, req.params.id_khoahoc],function(error, results){
		if(error) {
			req.session.error = error;
			res.redirect('/error');
		} else {
			res.render('danhsachlophoc', {
				title: 'Class List',
				lophoc: results[0],
				khoahoc: results[1]
			});
		}
	});
});


// POST: Đăng ký lớp học
router.post('/them', function(req, res){
    var hocvien = {
        id_khoahoc: req.body.id_khoahoc,
		id_hocvien: req.body.id_taikhoan
	};
	var id = req.body.id_khoahoc;
	var sql = "INSERT INTO dangkylophoc SET ?";
	conn.query(sql, hocvien, function(error, results){
		if(error) {
			req.session.error = error;
			res.redirect('/error');
		} else {
			res.redirect('/khoahoc/chitiet/'+id);
		}
	});
});


// GET: Huỷ đăng ký khoá học
router.get('/xoa/:id_khoahoc/:id_hocvien', function(req, res){	
	var id_khoahoc = req.params.id_khoahoc;
	var id_hocvien = req.params.id_hocvien;
	var sql = 'DELETE FROM dangkylophoc WHERE id_khoahoc = ? and id_hocvien=?';
	conn.query(sql, [id_khoahoc, id_hocvien], function(error, results){
		if(error) {
			req.session.error = error;
			res.redirect('/error');
		} else {
			res.redirect('/khoahoc/chitiet/'+id_khoahoc);
		}
	});
});
// GET: xoá đăng ký khoá học trong danh sách lớp
router.get('/xoahocvien/:id_khoahoc/:id_hocvien', function(req, res){	
	var id_khoahoc = req.params.id_khoahoc;
	var id_hocvien = req.params.id_hocvien;
	var sql = 'DELETE FROM dangkylophoc WHERE id_khoahoc = ? and id_hocvien=?';
	conn.query(sql, [id_khoahoc, id_hocvien], function(error, results){
		if(error) {
			req.session.error = error;
			res.redirect('/error');
		} else {
			res.redirect('/lophoc/'+id_khoahoc);
		}
	});
});




module.exports = router;