var config = require('./../DbConfig');
const sql = require('mssql');
var nodemailer = require('nodemailer');

const excelToJson = require('convert-excel-to-json');

const xlsx = require('xlsx');




module.exports.confirmTopicRegister = async function (req, res) {
    try {

        try {
            let query = `exec sp_DuyetDeTaiDangKy ${req.body.idGV},${req.body.idNV}, ${req.body.idSV},${req.body.idDeTai}`;
            await sql.connect(config).then(() => {
                sql.query(query)
                    .then(result => {
                        res.status(200).send("Duyệt thành công.");
                    }).catch(err => {
                        res.status(415).send("Duyệt thất bại!!!");
                    });
            })
        } catch (error) {

        }
    }
    catch (error) {
        console.log(error);
    }
}
module.exports.createMission = async function (req, res) {
    try {
        try {
            let query = `exec sp_TaoCongViec ${req.body.idGV},${req.body.idNV}, N'${req.body.noiDungCV}'`;
            await sql.connect(config).then(() => {
                sql.query(query)
                    .then(result => {
                        res.status(200).send("Thêm công việc thành công.");
                    }).catch(err => {
                        res.status(415).send("Thêm công việc thất bại!!!");
                    });
            })
        } catch (error) {

        }
    }
    catch (error) {
        console.log(error);
    }
}

module.exports.getAllStudentConfirm = async function (req, res) {
    try {
        let pool = await sql.connect(config);
        let giangVien = await pool.request().query(`select ct.*, tenSV,dt.tenDeTai
    from ChiTiet_DeTaiDK ct, SinhVien sv, DeTai dt
    where ct.idSV = sv.idSV and ct.idDeTai = dt.idDeTai and dt.idGV = ${req.params.idGV}  and ct.tinhTrang = 0`);
        res.json(giangVien.recordset);
    } catch (error) {

    }
}

module.exports.getAllStudentWaitingAddMission = async function (req, res) {
    try {
        let pool = await sql.connect(config);
        let giangVien = await pool.request().query(`select sv.idSV,dt.idDeTai, tenSV,sv.email,sv.sdt,dt.tenDeTai, pc.ngayBatDau,pc.ngayketThuc, pc.tinhTrang
        from ChiTiet_DeTaiDK ct, SinhVien sv, DeTai dt, PhieuPC pc
        where ct.idSV = sv.idSV and ct.idDeTai = dt.idDeTai and dt.idGV = ${req.params.idGV}  and ct.tinhTrang = 1 
        and pc.idDeTai = ct.idDeTai and pc.idSV = ct.idSV`);
        res.json(giangVien.recordset);
    } catch (error) {

    }
}

module.exports.getDetailStudentWaitingAddMission = async function (req, res) {

    try {
        let pool = await sql.connect(config);
        let giangVien = await pool.request().query(`select sv.idSV,dt.idDeTai, tenSV,sv.email,sv.sdt,dt.tenDeTai, pc.ngayBatDau,pc.ngayketThuc, pc.tinhTrang
        from ChiTiet_DeTaiDK ct, SinhVien sv, DeTai dt, PhieuPC pc
        where ct.idSV = sv.idSV and ct.idDeTai = dt.idDeTai and ct.idSV =${req.params.idSV}  and ct.tinhTrang = 1 
        and pc.idDeTai = ct.idDeTai and pc.idSV = ct.idSV`);
        res.json(giangVien.recordset[0]);
    } catch (error) {

    }
}
module.exports.comfirmRegisterTopic = async function (req, res) {
    try {
        console.log("nam")
        try {
            console.log(req.body.idSV, req.body.idDeTai)
            let query = `update ChiTiet_DeTaiDK set tinhTrang = 1 where idSV = ${req.body.idSV} and idDeTai = ${req.body.idDeTai}
            insert into PhieuPC(idGV,idDeTai,idSV,ngayBatDau) values(${req.params.idGV},${req.body.idDeTai},${req.body.idSV},getdate())
            `;
            await sql.connect(config).then(() => {
                sql.query(query)
                    .then(result => {
                        res.status(200).send("Duyệt thành công.");
                    }).catch(err => {
                        res.status(415).send("Duyệt thất bại!!!");
                    });
            })
        } catch (error) {

        }
    }
    catch (error) {
        console.log(error);
    }
}


module.exports.addMission = async function (req, res) {
    try {
        try {
            // let query = `exec sp_ThemCongViecChoPPC ${req.body.idPhanCong},${req.body.idCV},'${req.body.tuNgay}'
            // ,'${req.body.denNgay}',N'${req.body.NdThucTap}',N'${req.body.NhanXetGV}',N'${req.body.NhanXetNV}',${req.body.diemNX}`;
            // await sql.connect(config).then(() => {
            //     sql.query(query)
            //         .then(result => {
            //             res.status(200).send("Thêm công việc thành công.");
            //         }).catch(err => {
            //             res.status(415).send("Thêm công việc thất bại!!!");
            //         });
            // })
            let query = `insert into ChiTiet_CongViecPhieuPC (idCV,idPhanCong, tuNgay, denNgay,NdThucTap) 
            values(${req.body.idCV},(select idphancong from PhieuPC where idSV = ${req.body.idSV}),'${req.body.tuNgay}','${req.body.denNgay}','')`
            await sql.connect(config).then(() => {
                sql.query(query)
                    .then(result => {

                        var transporter = nodemailer.createTransport({
                            service: 'gmail',
                            auth: {
                                user: 'namhan9x99@gmail.com',
                                pass: 'Nhatnam369'
                            }
                        });

                        var mailOptions = {
                            from: 'namhan9x99@gmail.com', // email giang vien
                            to: 'nhatnam.nx3@gmail.com', // email sinh vien
                            subject: 'Sending Email using Node.js',
                            text: 'That was easy!'
                        };

                        transporter.sendMail(mailOptions, function (error, info) {
                            if (error) {
                                console.log(error);
                            } else {
                                console.log('Email sent: ' + info.response);
                            }

                        });
                        res.status(200).send("Thêm công việc thành công.");

                    }).catch(err => {
                        res.status(415).send("Thêm công việc thất bại!!!");
                    });
            })

        } catch (error) {

        }
    }
    catch (error) {
        console.log(error);
    }
}


module.exports.getAllTeacher = async function (req, res) {

    try {
        let pool = await sql.connect(config);
        let giangVien = await pool.request().query(`select idGV , tenGV,hinhAnh,sdt, hhhv,email,tenBoMon,tenChucVu from GiangVien gv, BoMon bm, ChucVu cv
        where gv.idBoMon = bm.idBoMon and cv.idChucVu = gv.idChucVu`);
        res.json(giangVien.recordset);
    } catch (error) {

    }
}


module.exports.getListTodoListByTeach = async function (req, res) {

    try {
        let pool = await sql.connect(config);
        let giangVien = await pool.request().query(`select * from congviec where idGV = ${req.params.idGV}`);
        res.json(giangVien.recordset);
    } catch (error) {

    }
}


module.exports.getInfoTeacher = async function (req, res) {

    try {
        let pool = await sql.connect(config);
        let giangVien = await pool.request().query(`select idGV , tenGV,hinhAnh,sdt, hhhv,email,tenBoMon,tenChucVu from GiangVien gv, BoMon bm, ChucVu cv
        where gv.idBoMon = bm.idBoMon and cv.idChucVu = gv.idChucVu and idGV = ${req.params.idGV}`);
        res.json(giangVien.recordset[0]);
    } catch (error) {

    }
}

module.exports.getAllMentor = async function (req, res) {

    try {
        let pool = await sql.connect(config);
        let nhanVien = await pool.request().query(`select idNV, tenNV,sdt,email, nv.hinhAnh , tenCty, diaChi from Cty ct, NhanVien nv
        where nv.idCty = ct.idCty`);
        res.json(nhanVien.recordset);
    } catch (error) {

    }
}

module.exports.getInfoMentor = async function (req, res) {

    try {
        console.log(req.params.idNV)
        let pool = await sql.connect(config);
        let nhanVien = await pool.request().query(`select idNV, tenNV,sdt,email, nv.hinhAnh , tenCty, diaChi from Cty ct, NhanVien nv
        where nv.idCty = ct.idCty and nv.idNV = ${req.params.idNV}`);
        res.json(nhanVien.recordset[0]);
    } catch (error) {

    }
}

module.exports.insertFileData = async function (req, res) {

    try {

        // const result = excelToJson({
        //     sourceFile:__dirname + '/Book.xlsx'
        // });

        const filePath = __dirname + '/Book.xlsx';
        const workbook = xlsx.readFile(filePath)
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        let posts = [];
        let post = {};

        for (let cell in worksheet) {
            const cellAsString = cell.toString();

            if (cellAsString[1] !== 'r' && cellAsString[1] !== 'm' && cellAsString[1] > 1) {
                if (cellAsString[0] === 'A') {
                    post.taiKhoan = worksheet[cell].v;
                }
                if (cellAsString[0] === 'B') {
                    post.matKhau = worksheet[cell].v;
                    posts.push(post);
                    post = {};
                }

            }
        }

        let query = 'insert into dbo.taiKhoan(taiKhoan,matKhau,idLoai,ngayLap) VALUES'

        let length = posts.length - 1;
        while (length >= 0) {
            let value = ` ('${posts[length].taiKhoan}','${posts[length].matKhau}',4,Getdate())` + `${length > 0 ? ',' : ''}`;
            query += value;
            length--;
        }


        await sql.connect(config).then(() => {
            sql.query(query)
                .then(result => {
                    res.status(200).send("Thêm công việc thành công.");
                }).catch(err => {
                    res.status(415).send("Thêm công việc thất bại!!!");
                });
        })


    } catch (error) {

    }
}


module.exports.addTopic = async function (req, res) {
    try {
        try {
            let query = `insert into DeTai(idGV,tenDeTai,noiDungDT,tinhTrangDT) values (${req.body.idGV},N'${req.body.tenDeTai}',N'${req.body.noiDungDT}',0)`;
           
           console.log(query)
            await sql.connect(config).then(() => {
                sql.query(query)
                    .then(result => {
                        res.status(200).send("Thêm công việc thành công.");
                    }).catch(err => {
                        res.status(415).send("Thêm công việc thất bại!!!");
                    });
                    
            })

        } catch (error) {

        }
    }
    catch (error) {
        console.log(error);
    }
}