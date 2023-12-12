var config = require('./../DbConfig');
const sql = require('mssql');


module.exports.getAccounts = async function (req, res) {
    try {
        let pool = await sql.connect(config);
        let accounts = await pool.request().query(`select taiKhoan,ngayLap,ngayDuyet,tinhTrang, tenLoai from TaiKhoan tk ,LoaiTaiKhoan ltk
        where tk.idLoai = ltk.idLoai `);
        res.json(accounts.recordset);
    }
    catch (error) {
        console.log(error);
    }
}
module.exports.getAccountsConfirmed = async function (req, res) {
    try {
        let pool = await sql.connect(config);
        let accounts = await pool.request().query(`exec layChiTiet_DSHocSinhDaPhanCong`);
        res.json(accounts.recordset);
    }
    catch (error) {
        console.log(error);
    }
}


module.exports.getAccountsUnconfirm = async function (req, res) {
    try {
        let pool = await sql.connect(config);
        let accounts = await pool.request().query(`exec layChiTiet_DSHocSinhChoDuyet`);
        res.json(accounts.recordset);
    }
    catch (error) {
        console.log(error);
    }
}

module.exports.getDetailListStudentWaitingAssignment = async function (req, res) {

    try {
        let pool = await sql.connect(config);
        let lst = await pool.request().query(`exec layChiTiet_DSHocSinhChuaPhanCong`);
        res.json(lst.recordset);
    } catch (error) {

    }

}


module.exports.Register = async function (req, res) {
    try {
        let pool = await sql.connect(config);


        let accountType = await pool.request().query(`SELECT * from LoaiTaiKhoan where idLoai = ${req.body.idLoaiTaiKhoan}`);

        switch (accountType.recordset[0].tenLoai) {
            case "Admin":

                break;

            default: // type = sinh vien

                let query = `exec sp_DangKySinhVien '${req.body.taiKhoan}','${req.body.matKhau}','${req.body.ngayLap}',${req.body.idLoaiTaiKhoan},N'${req.body.tenSV}','${req.body.sdt}','${req.body.email}','${req.body.hinhAnh}','${req.body.queQuan}','${req.body.namSinh}',${req.body.gioiTinh},${req.body.idLop},${req.body.idKhoaHoc}`;



                console.log(query)
                await sql.connect(config).then(() => {
                    sql.query(query)
                        .then(result => {
                            res.status(200).send("Added Successfully.");
                        }).catch(err => {
                            res.status(415).send("Something Went Wrong !!!");
                        });

                })
                break;
        }



    }
    catch (error) {
        console.log(error);
    }
}

module.exports.Login = async function (req, res) {

    try {
        console.log(req.body);
        let pool = await sql.connect(config);



        let accountExist = await pool.request().query(`SELECT * from dbo.TaiKhoan where taiKhoan 
        = '${req.body.username}' and matKhau = '${req.body.password}'`);


        if (accountExist.recordset[0]) {
            // lấy thông tin loại tài khoản
            let accountType = await pool.request().query(`SELECT * from LoaiTaiKhoan where idLoai = ${accountExist.recordset[0].idLoai}`);
            let userDetail, userExist;



            switch (accountType.recordset[0].tenLoai) {
                case "Sinh Viên":
                    userExist = await pool.request().query(`SELECT * from SinhVien where taiKhoan = '${accountExist.recordset[0].taiKhoan}'`);
                    userDetail = {
                        idSV: userExist.recordset[0].idSV,
                        taiKhoan: userExist.recordset[0].taiKhoan,
                        idLoaiTaiKhoan: accountType.recordset[0].idLoai,
                        tenLoaiTaiKhoan: accountType.recordset[0].tenLoai,

                        idLop: userExist.recordset[0].idLop,
                        idKhoaHoc: userExist.recordset[0].idKhoaHoc,

                        sdt: userExist.recordset[0].sdt,
                        email: userExist.recordset[0].email,
                        tenSV: userExist.recordset[0].tenSV,

                        queQuan: userExist.recordset[0].queQuan,
                        namSinh: userExist.recordset[0].namSinh,
                        gioiTinh: userExist.recordset[0].gioiTinh,

                        ngayLap: accountExist.recordset[0].ngayLap,
                        hinhAnh: userExist.recordset[0].hinhAnh

                    }
                    break;

                case "Giảng Viên":

                    userExist = await pool.request().query(`SELECT * from GiangVien where taiKhoan = '${accountExist.recordset[0].taiKhoan}'`);
                    userDetail = {

                        idLoaiTaiKhoan: accountType.recordset[0].idLoai,
                        tenLoaiTaiKhoan: accountType.recordset[0].tenLoai,
                        ngayLap: accountExist.recordset[0].ngayLap,
                        idBoMon: userExist.recordset[0].idBoMon,
                        idChucVu: userExist.recordset[0].idChucVu,
                        idGV: userExist.recordset[0].idGV,
                        taiKhoan: userExist.recordset[0].taiKhoan,
                        sdt: userExist.recordset[0].sdt,
                        email: userExist.recordset[0].email,
                        tenGV: userExist.recordset[0].tenGV,
                        hhhv: userExist.recordset[0].hhhv,
                        queQuan: userExist.recordset[0].queQuan,
                        namSinh: userExist.recordset[0].namSinh,
                        gioiTinh: userExist.recordset[0].gioiTinh,
                        hinhAnh: userExist.recordset[0].hinhAnh

                    }

                    break;
                case "Admin":
                    userDetail = {
                        idLoaiTaiKhoan: accountType.recordset[0].idLoai,
                        tenLoaiTaiKhoan: accountType.recordset[0].tenLoai,
                        taiKhoan: accountExist.recordset[0].taiKhoan,
                    }
                    break
                default: // sinh viên
                    res.status(415).send("không tìm thấy role của bạn...!!!");
                    break;
            }
            
            res.json(userDetail)

        } else {
            res.status(400).send("(*)Tài khoản hoặc mật khẩu không đúng!!!");
        }


    }
    catch (error) {
        console.log(error);
    }

}

module.exports.getNotifyByAccount = async function (req, res) {

    try {
        let pool = await sql.connect(config);

        let Notifycations = await pool.request().query(`SELECT * from dbo.ThongBao where NguoiNhanTB = '${req.params.taiKhoan}' and tinhTrangTB = 0 ORDER BY ngayTaoTB desc`);
        res.json(Notifycations.recordset)
    }
    catch (error) {
        console.log(error);
    }

}

module.exports.markReadNotifyByAccount = async function (req, res) {

    try {


        let query = (`update dbo.ThongBao set tinhTrangTB = 1 where NguoiNhanTB = '${req.params.taiKhoan}' 
        and tinhTrangTB = 0`);
        await sql.connect(config).then(() => {
            sql.query(query)
                .then(result => {
                    res.status(200).send("Xong.");
                }).catch(err => {
                    res.status(415).send("Bad!!!");
                });
        })
    }
    catch (error) {
        console.log(error);
    }

}
module.exports.conFirmAccountByAdmin = async function (req, res) {

    try {
        let pool = await sql.connect(config);

        let data = req.body;



        let query = `update taiKhoan set tinhTrang = 1 , ngayDuyet = getDate() 
        where `;

        let index = data.length - 1;

        while (index >= 0) {

            if (index == 0) {
                query += `taiKhoan = '${data[index]}'`
            } else {
                query += `taiKhoan = '${data[index]}' or `

            }
            index--;

        }

        console.log(query)
        await sql.connect(config).then(() => {
            sql.query(query)
                .then(result => {
                    res.status(200).send("Duyệt thành công.");
                }).catch(err => {
                    res.status(415).send("Duyệt thất bại!!!");
                });
        })
    }
    catch (error) {
        console.log(error);
    }

}