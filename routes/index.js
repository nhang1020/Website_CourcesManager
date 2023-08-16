var express = require('express');
const session = require('express-session');
var router = express.Router();
var conn = require('../connect');
var firstImage = require('../firstimage');
// GET: Trang chủ
router.get('/', function(req, res){
	var sql = 'select k.*, c.tenchuyennganh from khoahoc k, chuyennganh c \
	  WHERE k.id_chuyennganh = c.id_chuyennganh and k.kiemduyet=1 order by id_khoahoc desc LIMIT 6;\
	  Select * from chuyennganh';
	
	 conn.query(sql, function(error, results){
		 if(error){
			 req.session.error = error;
			 res.redirect('/error');
		 }
		 else{
			 res.render('index',{
				 title: 'Home',
				 khoahoc: results[0],
				 chuyennganh: results[1],
				 firstImage: firstImage
			 });
		 }
	 });
});
router.get('/courses', function(req, res){
	var sql = 'select k.*, c.tenchuyennganh from khoahoc k, chuyennganh c \
	  WHERE k.id_chuyennganh = c.id_chuyennganh and k.kiemduyet=1 order by id_khoahoc desc;\
	  Select * from chuyennganh';
	
	 conn.query(sql, function(error, results){
		 if(error){
			 req.session.error = error;
			 res.redirect('/error');
		 }
		 else{
			 res.render('timkiem',{
				 title: 'Our courses',
				 topic:'',
				 khoahoc: results[0],
				 chuyennganh: results[1],
				 firstImage: firstImage
			 });
		 }
	 });
});

// GET: khoá học chuyên ngành
router.get('/cn/:id_chuyennganh', function(req, res){
	var id = req.params.id_chuyennganh;
	var sql = 'select k.*, c.tenchuyennganh from khoahoc k, chuyennganh c \
	 WHERE k.id_chuyennganh = c.id_chuyennganh and k.kiemduyet=1 and c.id_chuyennganh=? order by id_khoahoc desc ;\
	 Select * from chuyennganh where id_chuyennganh='+id;
	conn.query(sql, [id],function(error, results){
		if(error){
			res.send('hel');
			req.session.error = error;
			res.redirect('/error');
		}
		else{
			res.render('khoahocchuyennganh',{
				khoahoc: results[0],
				chuyennganh: results[1].shift(),
				firstImage: firstImage
			});
		}
	});
});


// GET: khóa học chi tiết
router.get('/khoahoc/chitiet/:id_khoahoc', function(req, res){
	var id_khoahoc = req.params.id_khoahoc;
	var hocvien = req.session.id_taikhoan;
	var sql = "SELECT k.*, c.tenchuyennganh, t.hovaten from khoahoc k, \
	chuyennganh c, taikhoan t where k.id_chuyennganh = c.id_chuyennganh \
	and k.id_giangvien = t.id_taikhoan and k.kiemduyet = 1 and k.id_khoahoc =?;\
	SELECT id_khoahoc, id_hocvien from dangkylophoc \
	where id_khoahoc = ? and id_hocvien = ?; \
	SELECT count(id_hocvien) as sl from dangkylophoc where id_khoahoc = "+id_khoahoc+" group by id_khoahoc";
	conn.query(sql, [id_khoahoc, id_khoahoc, hocvien], function(error, results){
		if(error){
			req.session.error = error;
			res.redirect('/error');
		}
		else{
			res.render('khoahoc_chitiet',{
				khoahoc: results[0].shift(),
				lophoc: results[1],
				soluong: results[2]
			});
		}
	})
});

// POST: Kết quả tìm kiếm
router.post('/timkiem', function(req, res){
	var tukhoa = req.body.tukhoa;
	var sql = "SELECT k.*, c.tenchuyennganh, t.hovaten from khoahoc k, chuyennganh c, taikhoan t \
	where k.id_chuyennganh = c.id_chuyennganh and k.id_giangvien = t.id_taikhoan and k.kiemduyet = 1 and \
	(k.tenkhoahoc like N'%"+tukhoa+"%' or k.mota like N'%"+tukhoa+"%' or c.tenchuyennganh like N'%"+tukhoa+"%')";
	
	conn.query(sql, function(error, results){
		if(error){
			req.session.error = error;
			res.redirect('/error');
		}
		else{
			res.render('timkiem',{
				title: tukhoa,
				khoahoc: results,
				topic: "Results",
				firstImage: firstImage
			});
		}
	});
});

// GET: Lỗi
router.get('/error', function(req, res){
	res.render('error', { title: 'Error' });
});

// GET: Thành công
router.get('/success', function(req, res){
	res.render('success', { title: 'Success' });
});

// GET: Instructors
router.get('/giangvien', function(req, res){
	var sql = "SELECT * FROM taikhoan where quyenhan = 'giangvien'";
	conn.query(sql, function(error, results){
		if(error) {
			req.session.error = error;
			res.redirect('/error');
		} else {
			res.render('giangvien', {
				title: 'Intructors',
				giangvien: results
			});
		}
	});
});


// POST: Kết quả tìm kiếm giang vien
router.get('/timkiem/:id_taikhoan', function(req, res){
	var tukhoa = req.params.id_taikhoan;
	var sql = "SELECT k.*, c.tenchuyennganh, t.hovaten, t.id_taikhoan from khoahoc k, chuyennganh c, taikhoan t \
	where k.id_chuyennganh = c.id_chuyennganh and k.id_giangvien = t.id_taikhoan and k.kiemduyet = 1 and \
	t.id_taikhoan = "+tukhoa+";\
	SELECT hovaten from taikhoan where id_taikhoan="+tukhoa;
	
	conn.query(sql, function(error, results){
		if(error){
			req.session.error = error;
			res.redirect('/error');
		}
		else{
			res.render('timkiem',{
				title: results[1].shift().hovaten,
				khoahoc: results[0],
				topic: "Courses's",
				firstImage: firstImage
			});
		}
	});
});

module.exports = router;