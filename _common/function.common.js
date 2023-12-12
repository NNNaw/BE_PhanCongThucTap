

const generateNotifycation = (nguoiTaoTB, nguoiNhanTB, noiDungTB) => {
    let query = `insert into ThongBao(nguoiTaoTB,nguoiNhanTB,noiDungTB,tinhTrangTB,ngayTaoTB,idLoaiTB)
    values ((${nguoiTaoTB}),(${nguoiNhanTB}),(${noiDungTB}),0,getDate(), (select idLoaiTB from LoaiThongBao where tenLoaiTB =`
    if (nguoiTaoTB) {
        query += `N'Người Dùng'))`
    } else {
        query += `N'Hệ Thống'))`
    }
    return query;

}
module.exports = {
    generateNotifycation
}