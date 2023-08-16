var express = require('express');
var router = express.Router();
var conn = require('../connect');

// GET: Danh sách chuyên ngành
router.get('/', function(req, res){
	var sql = 'SELECT * FROM chuyennganh ORDER BY id_chuyennganh';
	conn.query(sql, function(error, results){
		if(error) {
			req.session.error = error;
			res.redirect('/error');
		} else {
			res.render('chuyennganh', {
				title: 'Specialized List',
				chuyennganh: results
			});
		}
	});
});

// GET: Thêm chuyên ngành
router.get('/them', function(req, res){	
	res.render('chuyennganh_them', { title: 'Add specialized' });
});

// POST: Thêm chuyên ngành
router.post('/them', function(req, res){
	var chuyennganh = {
		tenchuyennganh: req.body.tenchuyennganh
	};
	var sql = "INSERT INTO chuyennganh SET ?";
	conn.query(sql, chuyennganh, function(error, results){
		if(error) {
			req.session.error = error;
			res.redirect('/error');
		} else {
			res.redirect('/chuyennganh');
		}
	});
});

// GET: Sửa chuyên ngành
router.get('/sua/:id', function(req, res){	
	var id = req.params.id;
	var sql = 'SELECT * FROM chuyennganh WHERE id_chuyennganh = ?';
	conn.query(sql, [id], function(error, results){
		if(error) {
			req.session.error = error;
			res.redirect('/error');
		} else {
			res.render('chuyennganh_sua', {
				title: 'Edit specialized',
				id: results[0].id_chuyennganh,
				tenchuyennganh: results[0].tenchuyennganh
			});
		}
	});
});

// POST: Sửa chuyên ngành
router.post('/sua/:id', function(req, res){	
	var chuyennganh = {
		tenchuyennganh: req.body.tenchuyennganh
	};
	var id = req.params.id;
	var sql = 'UPDATE chuyennganh SET ? WHERE id_chuyennganh = ?';
	conn.query(sql, [chuyennganh, id], function(error, results){
		if(error) {
			req.session.error = error;
			res.redirect('/error');
		} else {
			res.redirect('/chuyennganh');
		}
	});
});

// GET: Xóa chuyên ngành
router.get('/xoa/:id', function(req, res){	
	var id = req.params.id;
	var sql = 'DELETE FROM chuyennganh WHERE id_chuyennganh = ?';
	conn.query(sql, [id], function(error, results){
		if(error) {
			req.session.error = error;
			res.redirect('/error');
		} else {
			res.redirect('/chuyennganh');
		}
	});
});

module.exports = router;