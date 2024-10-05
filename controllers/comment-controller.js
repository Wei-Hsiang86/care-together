const { Comment, User, Patient } = require('../models')

const commentController = {
  postComment: (req, res, next) => {
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
        return Comment.create({
          text,
          patientId,
          userId
        })
      })
      .then(() => {
        res.redirect(`/patients/${patientId}`)
      })
      .catch(err => next(err))
  }
}
module.exports = commentController
