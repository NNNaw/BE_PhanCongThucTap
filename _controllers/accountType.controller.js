var config = require('./../DbConfig');
const sql = require('mssql');

const AccountType = require('./../_models/accountType.model');



module.exports.GetAllAccountTypes = async function (req, res) {
    try {
        console.log("nam")

        let pool = await sql.connect(config);
        let accounttypes = await pool.request().query("SELECT * from loaiTaiKhoan");
        res.json(accounttypes.recordset);

    } catch (error) {

    }

}


module.exports.CreateAccountType = async function (req, res) {
    try {
        let query = `exec sp_ThemLoaiTaiKhoan N'${req.body.nameAccountType}'`;

        console.log(query)
        await sql.connect(config).then(() => {
            sql.query(query)
                .then(result => {
                    res.status(200).send("Added Successfully.");
                }).catch(err => {
                    res.status(415).send("Something Went Wrong !!!");
                });

        })


        // res.json(query)

        /* Add Student */
        // router.post('/addStudent', function (req, res) {
        //     sql.connect(dbConfig.dbConnection()).then(() => {
        //         return sql.query("INSERT INTO StudentInfo VALUES('" + req.body.Name + "', " + req.body.Age + ")");
        //     }).then(result => {
        //         res.status(200).send("Student Added Successfully.");
        //     }).catch(err => {
        //         res.status(415).send("Something Went Wrong !!!");
        //     })
        // });

    }
    catch (error) {
        console.log(error);
    }
}
