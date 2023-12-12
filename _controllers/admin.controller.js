var config = require("./../DbConfig");
const sql = require("mssql");
var nodemailer = require("nodemailer");
const fs = require("fs");
const excelToJson = require("convert-excel-to-json");

const xlsx = require("xlsx");
const { CLIENT_RENEG_LIMIT } = require("tls");

module.exports.confirmTopicRegister = async function (req, res) {
  try {
    try {
      let query = `exec sp_DuyetDeTaiDangKy ${req.body.idGV},${req.body.idNV}, ${req.body.idSV},${req.body.idDeTai}`;
      await sql.connect(config).then(() => {
        sql
          .query(query)
          .then((result) => {
            res.status(200).send("Duyệt thành công.");
          })
          .catch((err) => {
            res.status(415).send("Duyệt thất bại!!!");
          });
      });
    } catch (error) {}
  } catch (error) {
    console.log(error);
  }
};
module.exports.createMission = async function (req, res) {
  try {
    try {
      let query = `exec sp_TaoCongViec ${req.body.idGV},${req.body.idNV}, N'${req.body.noiDungCV}'`;
      await sql.connect(config).then(() => {
        sql
          .query(query)
          .then((result) => {
            res.status(200).send("Thêm công việc thành công.");
          })
          .catch((err) => {
            res.status(415).send("Thêm công việc thất bại!!!");
          });
      });
    } catch (error) {}
  } catch (error) {
    console.log(error);
  }
};

module.exports.getAllStudentConfirm = async function (req, res) {
  try {
    let pool = await sql.connect(config);
    let giangVien = await pool.request().query(`select ct.*, tenSV,dt.tenDeTai
    from ChiTiet_DeTaiDK ct, SinhVien sv, DeTai dt
    where ct.idSV = sv.idSV and ct.idDeTai = dt.idDeTai and dt.idGV = ${req.params.idGV}  and ct.tinhTrang = 0`);
    res.json(giangVien.recordset);
  } catch (error) {}
};

module.exports.getAllStudentWaitingAddMission = async function (req, res) {
  try {
    let pool = await sql.connect(config);
    let giangVien = await pool.request()
      .query(`select sv.idSV,dt.idDeTai, tenSV,sv.email,sv.sdt,dt.tenDeTai, pc.ngayBatDau,pc.ngayketThuc, pc.tinhTrang
        from ChiTiet_DeTaiDK ct, SinhVien sv, DeTai dt, PhieuPC pc
        where ct.idSV = sv.idSV and ct.idDeTai = dt.idDeTai and dt.idGV = ${req.params.idGV}  and ct.tinhTrang = 1 
        and pc.idDeTai = ct.idDeTai and pc.idSV = ct.idSV order by tinhTrang`);
    res.json(giangVien.recordset);
  } catch (error) {}
};

module.exports.getDetailStudentWaitingAddMission = async function (req, res) {
  try {
    let pool = await sql.connect(config);
    let giangVien = await pool.request()
      .query(`select sv.idSV,dt.idDeTai, tenSV,sv.email,sv.sdt,dt.tenDeTai, pc.ngayBatDau,pc.ngayketThuc, pc.tinhTrang
        from ChiTiet_DeTaiDK ct, SinhVien sv, DeTai dt, PhieuPC pc
        where ct.idSV = sv.idSV and ct.idDeTai = dt.idDeTai and ct.idSV =${req.params.idSV}  and ct.tinhTrang = 1 
        and pc.idDeTai = ct.idDeTai and pc.idSV = ct.idSV`);
    res.json(giangVien.recordset[0]);
  } catch (error) {}
};
module.exports.comfirmRegisterTopic = async function (req, res) {
  try {
    try {
      let query = `exec pro_duyetDangKyDeTai ${req.body.idSV} , ${req.body.idDeTai}, ${req.body.idGV}`;
      // `update ChiTiet_DeTaiDK set tinhTrang = 1 where idSV = ${req.body.idSV} and idDeTai = ${req.body.idDeTai}
      //       insert into PhieuPC(idGV,idDeTai,idSV,ngayBatDau) values(${req.params.idGV},${req.body.idDeTai},${req.body.idSV},getdate())
      //       insert into ThongBao(nguoiTaoTB,nguoiNhanTB,noiDungTB,tinhTrangTB,ngayTaoTB,idLoaiTB)
      //   values (
      //       (select taiKhoan from giangVien where idGV = ${req.body.idGV})
      //   ,(select taiKhoan from sinhVien where idSV = ${req.body.idSV})
      //   ,(select dbo.thongBaoDangKyDeTai(${req.body.idGV}, 1))
      //   ,0,getDate(),2
      //   )`;

      await sql.connect(config).then(() => {
        sql
          .query(query)
          .then((result) => {
            res.status(200).send("Duyệt thành công.");
          })
          .catch((err) => {
            res.status(415).send("Duyệt thất bại!!!");
          });
      });
    } catch (error) {}
  } catch (error) {
    console.log(error);
  }
};
module.exports.denyRegisterTopic = async function (req, res) {
  try {
    try {
      let query = `delete ChiTiet_DeTaiDK where idSV =  ${req.body.idSV} and idDeTai = ${req.body.idDeTai}
        update DeTai set soLuongSvDT = (select  soLuongSvDT from DeTai where idDeTai = ${req.body.idDeTai}) + 1 where idDeTai = ${req.body.idDeTai}
        insert into ThongBao(nguoiTaoTB,nguoiNhanTB,noiDungTB,tinhTrangTB,ngayTaoTB,idLoaiTB)
        values (
            (select taiKhoan from giangVien where idGV = ${req.body.idGV})
        ,(select taiKhoan from sinhVien where idSV = ${req.body.idSV})
        ,(select dbo.thongBaoDangKyDeTai(${req.body.idGV}, 0))
        ,0,getDate(),2
        )`;

      await sql.connect(config).then(() => {
        sql
          .query(query)
          .then((result) => {
            res.status(200).send("Duyệt thành công.");
          })
          .catch((err) => {
            res.status(415).send("Duyệt thất bại!!!");
          });
      });
    } catch (error) {}
  } catch (error) {
    console.log(error);
  }
};

module.exports.addMission = async function (req, res) {
  try {
    try {
      let query = `insert into 
            ChiTiet_CongViecPhieuPC (idCV,idPhanCong, tuNgay, denNgay,NdThucTap) 
            values(${req.body.idCV},(select idphancong from PhieuPC where idSV = ${req.body.idSV}),
            '${req.body.tuNgay}','${req.body.denNgay}','') 
            select email from sinhvien where idSV = ${req.body.idSV}
            `;

      await sql.connect(config).then(() => {
        sql
          .query(query)
          .then((result) => {
            var transporter = nodemailer.createTransport({
              service: "gmail",
              auth: {
                user: "namhan9x99@gmail.com",
                pass: "Nhatnam369",
              },
            });
          //  console.log(result.recordset[0].email);
            var mailOptions = {
              from: "namhan9x99@gmail.com", // email giang vien
              to: result.recordset[0].email, // recordset[0].email, // email sinh vien
              subject: "Thông báo phân công.",
              text: `Bạn vừa được phân công thêm công việc mới từ ngày ${req.body.tuNgay} - ${req.body.denNgay} ! Truy cập vào : http://localhost:3000 để xem chi tiết!!`,
            };

            transporter.sendMail(mailOptions, function (error, info) {
              if (error) {
                console.log("error send :", error);
              } else {
                console.log("Email sent: " + info.response);
              }
            });
            res.status(200).send("Thêm công việc thành công.");
          })
          .catch((err) => {
            res.status(415).send("Thêm công việc thất bại!!!");
          });
      });
    } catch (error) {}
  } catch (error) {
    console.log(error);
  }
};

module.exports.addMark = async function (req, res) {
  try {
    let query = `
            update ChiTiet_CongViecPhieuPC set diemNX = ${req.body.diemNX}, NhanXetGV = N'${req.body.NhanXetGV}' where idCV = 
            ${req.body.idCV} and idPhanCong = (select idPhanCong from PhieuPC where idSV = ${req.body.idSV})`;

    await sql.connect(config).then(() => {
      sql
        .query(query)
        .then((result) => {
          res.status(200).send("Chấm điểm thành công.");
        })
        .catch((err) => {
          res.status(415).send("Chấm điểm thất bại!!!");
        });
    });
  } catch (error) {}
};

module.exports.rateStudentByMentor = async function (req, res) {
  try {
    let query = `
            update PhieuPC set diemDanhGia = ${req.body.diemNX}, ndDanhGia = N'${req.body.NhanXetGV}' ,tinhTrang = 1
            where idSV = ${req.body.idSV}
            
            update SinhVien set tinhTrang = 1  where idSV = ${req.body.idSV}`;

    await sql.connect(config).then(() => {
      sql
        .query(query)
        .then((result) => {
          res.status(200).send("Đánh giá thành công.");
        })
        .catch((err) => {
          res.status(415).send("Đánh giá thất bại!!!");
        });
    });
  } catch (error) {}
};
module.exports.getAllTeacher = async function (req, res) {
  
  try {
    let pool = await sql.connect(config);
    let giangVien = await pool.request().query(`select idGV , tenGV,hinhAnh,sdt,
         hhhv,email,tenBoMon,tenChucVu from GiangVien gv, BoMon bm, ChucVu cv
        where gv.idBoMon = bm.idBoMon and cv.idChucVu = gv.idChucVu`);
     //   console.log(giangVien.recordset);
     console.log("getAllTeacher");
    res.json(giangVien.recordset);
  } catch (error) {}
};

module.exports.getListTeacherAndQuantityStudent = async function (req, res) {
  try {
    let pool = await sql.connect(config);
    let giangVien = await pool
      .request()
      .query(`exec sp_layDSGiangVienCungSlSinhVienDangHD`);
    res.json(giangVien.recordset);
  } catch (error) {}
};
module.exports.getListTodoListByTeach = async function (req, res) {
  try {
    let pool = await sql.connect(config);
    let giangVien = await pool
      .request()
      .query(`select * from congviec where idGV = ${req.params.idGV}`);
    res.json(giangVien.recordset);
  } catch (error) {}
};

module.exports.getInfoTeacher = async function (req, res) {
  console.log("getInfoTeacher");
  try {
    let pool = await sql.connect(config);
    let giangVien = await pool.request()
      .query(`select gv.* ,tenBoMon,tenChucVu from GiangVien gv, BoMon bm, ChucVu cv
        where gv.idBoMon = bm.idBoMon and cv.idChucVu = gv.idChucVu and idGV = ${req.params.idGV}`);
    res.json(giangVien.recordset[0]);
  } catch (error) {}
};

module.exports.getAllMentor = async function (req, res) {
  try {
    let pool = await sql.connect(config);
    let nhanVien = await pool.request().query(`select idNV, tenNV,sdt,email, 
        nv.hinhAnh , tenCty, diaChi from Cty ct, NhanVien nv
        where nv.idCty = ct.idCty`);
     //   console.log(nhanVien.recordset);
    console.log("getAllMentor");

    res.json(nhanVien.recordset);
  } catch (error) {}
};
module.exports.getQuantityStudentByIdTeacher = async function (req, res) {
  try {
    let pool = await sql.connect(config);

    let nhanVien = await pool
      .request()
      .query(`exec laySoLuongSinhVienTrenDeTai ${req.params.idGV}`);
    res.json(nhanVien.recordset);
  } catch (error) {}
};

module.exports.getTotalTopicByIdTeacher = async function (req, res) {
  try {
    let pool = await sql.connect(config);

    let nhanVien = await pool.request()
      .query(`select count(dt.idDeTai) as [soDtTrenGV] 
        from  DeTai dt
    where dt.idGV =  ${req.params.idGV}`);
    res.json(nhanVien.recordset);
  } catch (error) {}
};

module.exports.getInfoMentor = async function (req, res) {
  try {
    console.log(req.params.idNV);
    let pool = await sql.connect(config);
    let nhanVien = await pool.request()
      .query(`select idNV, tenNV,sdt,email, nv.hinhAnh , tenCty, diaChi from Cty ct, NhanVien nv
        where nv.idCty = ct.idCty and nv.idNV = ${req.params.idNV}`);
    res.json(nhanVien.recordset[0]);
  } catch (error) {}
};

module.exports.insertFileData = async function (req, res) {
  try {
    const filePath = req.file.path;

    const list = xlsx.readFile(filePath);
    const worksheet = list.Sheets[list.SheetNames[0]]; // sheet đang làm việc = 0

    let Users = [];
    let user = {};

    for (let cell in worksheet) {
      const cellAsString = cell.toString(); // k biết

      if (
        cellAsString[1] !== "r" &&
        cellAsString[1] !== "m" &&
        cellAsString[1] > 1
      ) {
        // k biết

        if (cellAsString[0] === "A") {
          user.taiKhoan = worksheet[cell].v;
        }
        if (cellAsString[0] === "B") {
          user.matKhau = worksheet[cell].v;
        }
        if (cellAsString[0] === "C") {
          user.ngayLap = worksheet[cell].v;
        }
        if (cellAsString[0] === "D") {
          user.idLoai = worksheet[cell].v;
        }
        if (cellAsString[0] === "E") {
          user.tinhTrangTk = worksheet[cell].v;
        }
        if (cellAsString[0] === "F") {
          user.ngayDuyet = worksheet[cell].v;
        }
        if (cellAsString[0] === "G") {
          user.tenSV = worksheet[cell].v;
        }
        if (cellAsString[0] === "H") {
          user.hinhAnh = worksheet[cell].v;
        }
        if (cellAsString[0] === "I") {
          user.namSinh = worksheet[cell].v;
          user.namSinh = user.namSinh.substring(1, 11);
        }
        if (cellAsString[0] === "J") {
          user.queQuan = worksheet[cell].v;
        }
        if (cellAsString[0] === "K") {
          user.gioiTinh = worksheet[cell].v;
        }
        if (cellAsString[0] === "L") {
          user.tinhTrangSV = worksheet[cell].v;
        }
        if (cellAsString[0] === "M") {
          user.sdt = worksheet[cell].v;
        }
        if (cellAsString[0] === "N") {
          user.email = worksheet[cell].v;
        }
        if (cellAsString[0] === "O") {
          user.idLop = worksheet[cell].v;
        }
        if (cellAsString[0] === "P") {
          user.idKhoa = worksheet[cell].v;
          Users.push(user);
          user = {};
        }
      }
    }

    let insertTblAccount =
      "insert into dbo.taiKhoan(taiKhoan,matKhau,idLoai,ngayLap, tinhTrang,ngayDuyet) VALUES";

    let insertTblStudent =
      "insert into dbo.sinhvien(tenSV,hinhAnh,namSinh,queQuan,gioiTinh,sdt,email,taiKhoan,idLop,idKhoa) VALUES";

    // let length = Users.length - 1;
    // while (length >= 0) {

    //     length--;
    // }
    Users.forEach((ele, index, array) => {
      //  query insert to acccount
      let valueTblAccount =
        ` ('${ele.taiKhoan}','${ele.matKhau}',${ele.idLoai},Getdate(),1,Getdate())` +
        `${array.length - 1 > index ? "," : ""}`;
      insertTblAccount += valueTblAccount;

      // query insert to student
      let valueTblStudent =
        ` (N'${ele.tenSV}','${ele.hinhAnh}','${ele.namSinh}','${ele.queQuan}',${ele.gioiTinh},
             '${ele.sdt}','${ele.email}','${ele.taiKhoan}',${ele.idLop},${ele.idKhoa})` +
        `${array.length - 1 > index ? "," : ""}`;
      insertTblStudent += valueTblStudent;
    });

    let query = insertTblAccount + " " + insertTblStudent;

    console.log(query);

    await sql.connect(config).then(() => {
      sql
        .query(query)
        .then((result) => {
          res.status(200).send("Thêm danh sách người dùng thành công.");
        })
        .catch((err) => {
          res.status(415).send("Thêm danh sách người dùng thất bại!!!");
        });
    });

    fs.unlinkSync(filePath); // xóa file
  } catch (error) {}
};

module.exports.addAssignmentToTeach = async function (req, res) {
  let nguoiTaoTB = req.params.taiKhoan;

  try {
    let queryPhieuPC =
      "insert into PhieuPC(ngayBatDau,ngayketThuc,tinhTrang,idGV,idNV,idDeTai,idSV,diemDanhGia,ndDanhGia) values ";
    let queryThongBao =
      "insert into ThongBao(nguoiTaoTB,nguoiNhanTB,noiDungTB,tinhTrangTB,ngayTaoTB,idLoaiTB) values ";

    let lst_idSV = req.body.lst_idSV;

    lst_idSV.forEach((ele, index, array) => {
      let str =
        `(getDate(),Null,0,${req.body.idGV},Null,Null,${ele},Null,Null)` +
        `${array.length - 1 > index ? "," : ""}`;
      queryPhieuPC += str;

      let str2 =
        `('${nguoiTaoTB}',(select taiKhoan from sinhvien where idSV = ${ele})
            ,(select dbo.layTaiKhoanSSV(${ele},${req.body.idGV},'${nguoiTaoTB}'))
            ,0,getDate(),2)` + `${array.length - 1 > index ? "," : ""}`;

      queryThongBao += str2;
    });

    let queryThongBaoChoGV = `insert into ThongBao(nguoiTaoTB,nguoiNhanTB,noiDungTB,tinhTrangTB,ngayTaoTB,idLoaiTB) values 
        ('${nguoiTaoTB}',(select taiKhoan from giangVien where idGV = ${req.body.idGV})
            ,N'${nguoiTaoTB} đã phân công thêm ${lst_idSV.length} sinh viên cho bạn.'
            ,0,getDate(),2)`;

    let query = queryPhieuPC + " " + queryThongBao + " " + queryThongBaoChoGV;

    console.log(query);
    await sql.connect(config).then(() => {
      sql
        .query(query)
        .then((result) => {
          res.status(200).send("Thêm phân công cho giáo viên thành công.");
        })
        .catch((err) => {
          res.status(415).send("Thêm phân công cho giáo viên thất bại!!!");
        });
    });
  } catch (error) {}
};

module.exports.addTopic = async function (req, res) {
  try {
    try {
      let query = `insert into DeTai(idGV,tenDeTai,noiDungDT,tinhTrangDT,soLuongSvDT) 
            values (${req.body.idGV},N'${req.body.tenDeTai}',N'${req.body.noiDungDT}',0,11)`;

      console.log(query);
      await sql.connect(config).then(() => {
        sql
          .query(query)
          .then((result) => {
            res.status(200).send("Thêm công việc thành công.");
          })
          .catch((err) => {
            res.status(415).send("Thêm công việc thất bại!!!");
          });
      });
    } catch (error) {}
  } catch (error) {
    console.log(error);
  }
};
