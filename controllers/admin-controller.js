const adminController = {
  getPatients: (req, res) => {
    return res.render('admin/patients')
  }
}
module.exports = adminController
