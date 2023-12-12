var config = require("./../DbConfig");
const sql = require("mssql");
var path = require("path");
const fs = require("fs");
const http = require("http");
const { generateNotifycation } = require("./../_common/function.common");

module.exports.getStudents = async function (req, res) {
  try {
    let pool = await sql.connect(config);
    let topics = await pool.request().query("SELECT * from Detai");
    res.json(topics.recordset);
  } catch (error) {
    console.log(error);
  }
};

module.exports.getListStudentByTopic = async function (req, res) {
  try {
    let pool = await sql.connect(config);
    let students = await pool.request()
      .query(`select sv.idSV, tenSV , ct.tinhTrang from ChiTiet_DeTaiDK ct, SinhVien sv
        where ct.idSV = sv.idSV and ct.idDeTai = ${req.params.idDeTai}`);

    res.json(students.recordset);
  } catch (error) {
    console.log(error);
  }
};
module.exports.getStudentByID = async function (req, res) {
  try {
    let pool = await sql.connect(config);
    let topics = await pool.request()
      .query(`select sv.*, tenLop,tenKhoa, tenKhoaHoc, tuNamHoc, denNamHoc
        from SinhVien sv , Lop l , Khoa k, KhoaHoc kh
        where sv.idLop = l.idLop and sv.idKhoa = k.idKhoa and l.idKhoaHoc = kh.idKhoaHoc and idSV = ${req.params.idSV}`);
    res.json(topics.recordset[0]);
  } catch (error) {
    console.log(error);
  }
};

module.exports.getAssignmenStudentNotDone = async function (req, res) {
  try {
    let pool = await sql.connect(config);
    let topics = await pool.request().query(`SELECT *
        FROM   CongViec cv
        WHERE cv.idGV = ${req.params.idGV} and NOT EXISTS(SELECT *
        FROM   ChiTiet_CongViecPhieuPC ct
                       WHERE  cv.idCV = ct.idCV and ct.idPhanCong = (select idPhanCong from PhieuPC where idSV = ${req.params.idSV})) `);
    res.json(topics.recordset);
  } catch (error) {
    console.log(error);
  }
};

module.exports.registerTopic = async function (req, res) {
  try {
    let query = `exec sp_DangKyDeTai ${req.body.idSV},${req.body.idDeTai}
        update DeTai set soLuongSvDT = (select  soLuongSvDT from DeTai where idDeTai = ${req.body.idDeTai}) - 1 where idDeTai = ${req.body.idDeTai}
        `;
    await sql.connect(config).then(() => {
      sql
        .query(query)
        .then((result) => {
          res.status(200).send("Đăng ký thành công.");
        })
        .catch((err) => {
          res.status(415).send("Đăng ký thất bại!!!");
        });
    });
  } catch (error) {}
};

module.exports.cancleTopic = async function (req, res) {
  try {
    let query = `delete ChiTiet_DeTaiDK where idSV =  ${req.body.idSV} and idDeTai = ${req.body.idDeTai}
        update DeTai set soLuongSvDT = (select  soLuongSvDT from DeTai where idDeTai = ${req.body.idDeTai}) + 1 where idDeTai = ${req.body.idDeTai}
       
        
        `;
    await sql.connect(config).then(() => {
      sql
        .query(query)
        .then((result) => {
          res.status(200).send("Hủy đăng ký thành công.");
        })
        .catch((err) => {
          res.status(415).send("Hủy đăng ký thất bại!!!");
        });
    });
  } catch (error) {}
};

module.exports.getAssignmenById = async function (req, res) {
  try {
    let pool = await sql.connect(config);
    let topics = await pool.request()
      .query(`select idPhanCong,ct.idCV, tenCV,noiDungCV,tuNgay,denNgay,ngayNop,NdThucTap,NhanXetGV,NhanXetNV, diemNX
        from ChiTiet_CongViecPhieuPC ct, CongViec cv
        where ct.idCV = cv.idCV and idPhanCong = (select idPhanCong from PhieuPC where idSV = ${req.params.idSV})`);
    res.json(topics.recordset);
  } catch (error) {
    console.log(error);
  }
};

module.exports.submitFile = async function (req, res) {
  try {
    let fileName = req.file.path;

    let index = fileName.lastIndexOf("_") - 13;
    fileName = fileName.substr(index);

    let stringNotify = generateNotifycation(
      `select taikhoan from SinhVien where idSV = ${req.body.idSV}`,
      `select taikhoan from GiangVien where idGV = (select idGv from CongViec where idCV = ${req.body.idCV})`,
      `select dbo.thongBaoChoGV_BoiSV(${req.body.idSV},${req.body.idCV})`
    );

    let query = `
        update ChiTiet_CongViecPhieuPC set NdThucTap = '${fileName}',ngayNop =  GETDATE()   
        where idCV = ${parseInt(
          req.body.idCV
        )} and idPhanCong = (select idPhanCong from PhieuPC where idSV = ${parseInt(
      req.body.idSV
    )})
        ${stringNotify}`;

    console.log(query);
    await sql.connect(config).then(() => {
      sql
        .query(query)
        .then((result) => {
          res.status(200).send("Nộp thành công.");
        })
        .catch((err) => {
          res.status(415).send("Nộp thất bại!!!");
        });
    });
  } catch (error) {}
};

module.exports.downloadFile = function (req, res) {
  try {
    // var filename = path.basename(req.params.filename);
    // filename = path.resolve(__dirname, filename);
    // var dst = fs.createWriteStream(filename);
    // req.pipe(dst);
    // dst.on('drain', function () {
    //     console.log('drain', new Date());
    //     req.resume();
    // });
    // req.on('end', function () {
    //     res.send(200);
    // });
    console.log("object");
    const filePath = __dirname + `/avatarDefault.png`;
    // res.set('Content-Type', 'application/octet-stream');
    // res.set('Content-Disposition', `attachment; filename=avatarDefault.png`);
    // res.set('Content-Length', data.length);
    res.sendFile(filePath);
  } catch (error) {}
};
