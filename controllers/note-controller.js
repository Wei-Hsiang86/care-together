const { Note, User, Patient } = require('../models')

const noteController = {
  // patient 看到醫護人員的 notes
  getNotes: (req, res, next) => {
    return Patient.findByPk(req.params.id, {
      include: [
        { model: User, attributes: ['name'] },
        { model: Note, include: User }
      ]
    })
      .then(rawPatientData => {
        if (!rawPatientData) throw new Error('查詢不到數據紀錄!')

        const patient = rawPatientData.toJSON()
        if ((req.user.id !== patient.userId) && !req.user.isAdmin) {
          req.flash('error_messages', '只能查看自己紀錄的醫事人員提醒!')
          return res.redirect('/patients')
        }
        res.render('notes', { patient })
      })
      .catch(err => next(err))
  },
  postNote: (req, res, next) => {
    const { patientId, text } = req.body
    const userId = req.user.id
    if (!text) throw new Error('不能發送空白評論!')
    return Promise.all([
      User.findByPk(userId),
      Patient.findByPk(patientId)
    ])
      .then(([user, patientData]) => {
        if (!user) throw new Error('使用者不存在')
        if (!patientData) throw new Error('此筆資料不存在')
        return Note.create({
          text,
          userId,
          patientId
        })
      })
      .then(() => {
        res.redirect(`/admin/patients/${patientId}`)
      })
      .catch(err => next(err))
  }
}

module.exports = noteController
