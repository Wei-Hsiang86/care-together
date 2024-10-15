const { Patient, User, Note } = require('../models')
const { getOffset, getPagination } = require('../helpers/pagination-helper')

const adminController = {
  getPatients: (req, res, next) => {
    const defaultLimit = 10
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || defaultLimit
    const offset = getOffset(limit, page)

    return Patient.findAndCountAll({
      include: [
        { model: User, attributes: ['name'] }
      ],
      attributes: {
        exclude: ['description']
      },
      order: [
      // 先依照名字排，再依照時間排序
        [User, 'id', 'ASC'],
        ['createdAt', 'DESC']
      ],
      limit,
      offset,
      raw: true,
      nest: true
    })
      .then(rawPatientData => {
        if (!rawPatientData) throw new Error('There is not any data!')
        const patientData = rawPatientData.rows.map((item, index) => ({
          ...item,
          itemN: index + offset + 1
        }))
        res.render('admin/patients', {
          patients: patientData,
          pagination: getPagination(limit, page, rawPatientData.count)
        })
      })

      .catch(err => next(err))
  },
  getPatient: (req, res, next) => {
    return Patient.findByPk(req.params.id, {
      include: [
        { model: User, attributes: ['name'] },
        { model: Note, include: User }
      ]
    })
      .then(rawPatientData => {
        if (!rawPatientData) throw new Error('Cannot find patient data!')
        const patient = rawPatientData.toJSON()
        const tab = { dataId: patient.id, userId: patient.userId }
        res.render('admin/patient', { patient, tab })
      })
      .catch(err => next(err))
  },
  editPatient: (req, res, next) => {
    return Patient.findByPk(req.params.id, {
      raw: true
    })
      .then(patient => {
        if (!patient) throw new Error('Cannot find patient data!')
        res.render('admin/edit-patient', { patient })
      })
      .catch(err => next(err))
  },
  putPatient: (req, res, next) => {
    const { temperature, heartRate, bloodPressure, gluac, glupc, description } = req.body
    if (!temperature) throw new Error('Require temperature!')
    if (!heartRate) throw new Error('Require heart rate!')
    if (!bloodPressure) throw new Error('Require blood pressure!')

    return Patient.findByPk(req.params.id)
      .then(patient => {
        if (!patient) throw new Error('Cannot find patient data!')

        return patient.update({
          temperature,
          heartRate,
          bloodPressure,
          gluac,
          glupc,
          description
        })
      })
      .then(() => {
        req.flash('success_messages', 'Update success!')
        res.redirect('/admin/patients')
      })
      .catch(err => next(err))
  },
  deletePatient: (req, res, next) => {
    return Patient.findByPk(req.params.id)
      .then(patient => {
        if (!patient) throw new Error('Cannot find patient data!')
        return patient.destroy()
      })
      .then(() => res.redirect('/admin/patients'))
      .catch(err => next(err))
  },
  getPatientList: (req, res, next) => {
    const defaultLimit = 10
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || defaultLimit
    const offset = getOffset(limit, page)
    const { showDanger } = req.body

    return User.findAndCountAll({
      where: showDanger ? { danger: 1 } : { isAdmin: 0 },
      attributes: {
        exclude: ['password']
      },
      limit,
      offset,
      raw: true
    })
      .then(list => {
        const patientList = list.rows.map((item, index) => ({
          ...item,
          itemN: index + 1
        }))
        res.render('admin/patient-list', {
          patientList,
          pagination: getPagination(limit, page, list.count),
          needPaginate: true,
          noContent: !patientList.length
        })
      })
      .catch(err => next(err))
  },
  searchUser: (req, res, next) => {
    const keyword = req.query.adminSearchUser.trim()
    if (!keyword) throw new Error('Please enter name.')
    if (keyword === req.user.name) throw new Error('Cannot search yourself.')

    return User.findOne({
      where: {
        name: keyword
      },
      raw: true
    })
      .then(searchedUser => {
        if (!searchedUser) throw new Error('Cannot find the patient.')
        console.log(searchedUser)
        return res.render('admin/patient-list', {
          keyword,
          patientList: [searchedUser],
          needPaginate: false
        })
      })
  },
  patchUser: (req, res, next) => {
    const userId = req.params.userId
    const { isDanger } = req.body
    console.log(userId, isDanger)

    return User.findByPk(userId)
      .then(user => {
        if (!user) throw new Error('User is not exist!')
        if (user.isAdmin === 1) {
          req.flash('error_messages', 'Cannot set root to danger!')
          return res.redirect('back')
        }
        return user.update({
          danger: !user.danger
        })
      })
      .then(() => res.redirect('/admin/users'))
      .catch(err => next(err))
  },
  getAllData: (req, res, next) => {
    const searchId = req.params.userId
    const defaultLimit = 5
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || defaultLimit
    const offset = getOffset(limit, page)

    return Promise.all([
      User.findByPk(searchId),
      Patient.findAndCountAll({
        where: {
          userId: searchId
        },
        order: [['createdAt', 'DESC']],
        limit,
        offset,
        raw: true
      })
    ])
      .then(([user, rawPatientData]) => {
        if (!user) throw new Error('User does not exist!')
        if (!rawPatientData) throw new Error('There is not any data!')
        const userProfile = user.toJSON()
        const tab = { userId: searchId }
        const patientData = rawPatientData.rows.map((item, index) => ({
          ...item,
          itemN: index + offset + 1
        }))
        res.render('admin/all-data', {
          userProfile,
          patient: patientData,
          pagination: getPagination(limit, page, rawPatientData.count),
          tab
        })
      })
      .catch(err => next(err))
  },
  abgCalculator: (req, res, next) => {
    res.render('admin/abg-calculator')
  },
  abgCalculate: (req, res, next) => {
    try {
      const { pH, PaO2, PaCO2, HCO3, Na, Cl } = req.body
      const data = { pH, PaO2, PaCO2, HCO3, Na, Cl }

      if (!pH) throw new Error('Please enter pH.')
      if (!PaO2) throw new Error('Please enter PaO2.')
      if (!PaCO2) throw new Error('Please enter PaCO2.')
      if (!HCO3) throw new Error('Please enter HCO3-.')

      // 計算氧合
      let bloodO2
      if (PaO2 > 80) {
        bloodO2 = '血氧正常'
      } else if (PaO2 > 60) {
        bloodO2 = '併輕度低血氧'
      } else if (PaO2 > 40) {
        bloodO2 = '併中度低血氧'
      } else {
        bloodO2 = '併重度低血氧'
      }

      if (pH > 7.7 || pH < 6.6) {
        data.type = 'text-danger border-danger border-5'
        data.abgResult = 'Result: 別算了，快去看看患者生命徵象是否穩定!!!'
        return res.render('admin/abg-calculator', { data })
      }

      if ((pH > 7.35 && pH < 7.45) && (PaCO2 > 35 && PaCO2 < 45) && (HCO3 > 22 && HCO3 < 26)) {
        PaO2 > 80 ? data.type = 'text-success' : data.type = 'text-danger'
        data.abgResult = `Result: 患者目前血液酸鹼值在正常值內，${bloodO2}`
        return res.render('admin/abg-calculator', { data })
      } else if (pH <= 7.4) {
        data.type = 'text-danger'

        if (PaCO2 < 40 && HCO3 > 24) {
          req.flash('error_messages', '請檢察輸入是否有誤，若有誤請重新輸入PaCO3, HCO3')
          return res.redirect('back')
        } else if (PaCO2 > 40) {
          const deltaHydrogen = Math.abs(40 - Math.pow(10, 9 - pH))
          const progression = deltaHydrogen / Math.abs(PaCO2 - 40 + 0.0000001)

          if (progression >= 0.3) {
            const HCO3Comp = 24 + (0.1 * (PaCO2 - 40))

            if (HCO3 > (HCO3Comp + 3)) {
              data.abgResult = `Result: 患者目前為，急性呼吸酸併代謝鹼，${bloodO2}`
              return res.render('admin/abg-calculator', { data })
            } else if (HCO3 < (HCO3Comp - 3)) {
              data.abgResult = `Result: 患者目前為，急性呼吸酸併代謝酸，${bloodO2}`
              return res.render('admin/abg-calculator', { data })
            } else if (HCO3 <= (HCO3Comp + 3) && HCO3 >= (HCO3Comp - 3)) {
              if (pH < 7.35) {
                data.abgResult = `Result: 患者目前為，急性呼吸酸併代謝不完全代償，${bloodO2}`
                return res.render('admin/abg-calculator', { data })
              } else {
                data.abgResult = `Result: 患者目前為，急性呼吸酸併代謝完全代償，${bloodO2}`
                return res.render('admin/abg-calculator', { data })
              }
            } else {
              req.flash('error_messages', '請檢察輸入是否有誤')
              return res.redirect('back')
            }
          } else {
            // progression < 0.3
            const HCO3Comp = 24 + (0.35 * (PaCO2 - 40))

            if (HCO3 > (HCO3Comp + 3)) {
              data.abgResult = `Result: 患者目前為，慢性呼吸酸併代謝鹼，${bloodO2}`
              return res.render('admin/abg-calculator', { data })
            } else if (HCO3 < (HCO3Comp - 3)) {
              data.abgResult = `Result: 患者目前為，慢性呼吸酸併代謝酸，${bloodO2}`
              return res.render('admin/abg-calculator', { data })
            } else if (HCO3 <= (HCO3Comp + 3) && HCO3 >= (HCO3Comp - 3)) {
              if (pH < 7.35) {
                data.abgResult = `Result: 患者目前為，慢性呼吸酸併代謝不完全代償，${bloodO2}`
                return res.render('admin/abg-calculator', { data })
              } else {
                data.abgResult = `Result: 患者目前為，慢性呼吸酸併代謝完全代償，${bloodO2}`
                return res.render('admin/abg-calculator', { data })
              }
            } else {
              req.flash('error_messages', '請檢察輸入是否有誤')
              return res.redirect('back')
            }
          }
        } else {
          // PaCO2 <= 40
          if (HCO3 <= 24) {
            const PaCO2Comp = 40 - (1.2 * (24 - HCO3))
            const ag = Na - Cl - HCO3

            // 計算 AG
            let agResult
            if (ag > 14) {
              agResult = `陰離子間隙為${ag}，高AG代謝性酸中毒`
            } else if (ag >= 10 && ag <= 14) {
              agResult = `陰離子間隙為${ag}，高氯性代謝性酸中毒`
            } else {
              req.flash('error_messages', '請檢察輸入是否有誤，若有誤請重新輸入Na+,Cl-')
              return res.redirect('back')
            }

            if (PaCO2 > PaCO2Comp + 5) {
              data.abgResult = `Result: 患者目前${agResult}，代謝酸併呼吸酸，${bloodO2}`
              return res.render('admin/abg-calculator', { data })
            } else if (PaCO2 < PaCO2Comp - 5) {
              data.abgResult = `Result: 患者目前${agResult}，代謝酸併呼吸鹼，${bloodO2}`
              return res.render('admin/abg-calculator', { data })
            } else if (PaCO2 <= (PaCO2Comp + 5) && PaCO2 >= (PaCO2Comp - 5)) {
              if (pH < 7.35) {
                data.abgResult = `Result: 患者目前${agResult}，代謝酸併呼吸不完全代償，${bloodO2}`
                return res.render('admin/abg-calculator', { data })
              } else {
                data.abgResult = `Result: 患者目前${agResult}，代謝酸併呼吸完全代償，${bloodO2}`
                return res.render('admin/abg-calculator', { data })
              }
            } else {
              req.flash('error_messages', '請檢察輸入是否有誤')
              return res.redirect('back')
            }
          }
        }
      } else {
        // pH > 7.4
        data.type = 'text-danger'

        if (PaCO2 <= 40) {
          const deltaHydrogen = Math.abs(40 - Math.pow(10, 9 - pH))
          const progression = deltaHydrogen / Math.abs(PaCO2 - 40 + 0.0000001)

          if (progression >= 0.3) {
            const HCO3Comp = 24 - (0.2 * (40 - PaCO2))

            if (HCO3 > (HCO3Comp + 3)) {
              data.abgResult = `Result: 患者目前為，急性呼吸鹼併代謝鹼，${bloodO2}`
              return res.render('admin/abg-calculator', { data })
            } else if (HCO3 < (HCO3Comp - 3)) {
              data.abgResult = `Result: 患者目前為，急性呼吸鹼併代謝酸，${bloodO2}`
              return res.render('admin/abg-calculator', { data })
            } else if (HCO3 <= (HCO3Comp + 3) && HCO3 >= (HCO3Comp - 3)) {
              if (pH > 7.45) {
                data.abgResult = `Result: 患者目前為，急性呼吸鹼併代謝不完全代償，${bloodO2}`
                return res.render('admin/abg-calculator', { data })
              } else {
                data.abgResult = `Result: 患者目前為，急性呼吸鹼併代謝完全代償，${bloodO2}`
                return res.render('admin/abg-calculator', { data })
              }
            } else {
              req.flash('error_messages', '請檢察輸入是否有誤')
              return res.redirect('back')
            }
          } else if (progression < 0.3) {
            const HCO3Comp = 24 - (0.4 * (40 - PaCO2))

            if (HCO3 > (HCO3Comp + 3)) {
              data.abgResult = `Result: 患者目前為，慢性呼吸鹼併代謝鹼，${bloodO2}`
              return res.render('admin/abg-calculator', { data })
            } else if (HCO3 < (HCO3Comp - 3)) {
              data.abgResult = `Result: 患者目前為，慢性呼吸鹼併代謝酸，${bloodO2}`
              return res.render('admin/abg-calculator', { data })
            } else if (HCO3 <= (HCO3Comp + 3) && HCO3 >= (HCO3Comp - 3)) {
              if (pH > 7.45) {
                data.abgResult = `Result: 患者目前為，慢性呼吸鹼併代謝不完全代償，${bloodO2}`
                return res.render('admin/abg-calculator', { data })
              } else {
                data.abgResult = `Result: 患者目前為，慢性呼吸鹼併代謝完全代償，${bloodO2}`
                return res.render('admin/abg-calculator', { data })
              }
            } else {
              req.flash('error_messages', '請檢察輸入是否有誤')
              return res.redirect('back')
            }
          } else {
            req.flash('error_messages', '請檢察輸入是否有誤')
            return res.redirect('back')
          }
        } else if (PaCO2 > 40) {
          if (HCO3 >= 24) {
            const PaCO2Comp = 40 + (0.7 * (HCO3 - 24))

            if (PaCO2 > PaCO2Comp + 5) {
              data.abgResult = `患者目前為，代謝鹼併呼吸酸，${bloodO2}`
              return res.render('admin/abg-calculator', { data })
            } else if (PaCO2 < PaCO2Comp - 5) {
              data.abgResult = `患者目前為，代謝鹼併呼吸鹼，${bloodO2}`
              return res.render('admin/abg-calculator', { data })
            } else if (PaCO2 <= (PaCO2Comp + 5) && PaCO2 >= (PaCO2Comp - 5)) {
              if (pH > 7.45) {
                data.abgResult = `患者目前為，代謝鹼併呼吸不完全代償，${bloodO2}`
                return res.render('admin/abg-calculator', { data })
              } else {
                data.abgResult = `患者目前為，代謝鹼併呼吸完全代償，${bloodO2}`
                return res.render('admin/abg-calculator', { data })
              }
            } else {
              req.flash('error_messages', '請檢察輸入是否有誤')
              return res.redirect('back')
            }
          } else {
            req.flash('error_messages', '請檢察輸入是否有誤')
            return res.redirect('back')
          }
        } else {
          req.flash('error_messages', '請檢察輸入是否有誤')
          return res.redirect('back')
        }
      }
    } catch (err) {
      next(err)
    }
  }
}
module.exports = adminController
