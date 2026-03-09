const express = require('express')
const router = express.Router()
const User = require('../models/user')

// INDEX - GET - /users/:userId/applications
router.get('/', async (req, res) => {
    try {
        //can use req.params.userId
        //can also use req.session.user._id
        const user = await User.findById(req.session.user._id)
        res.render('applications/index.ejs', { applications: user.applications })
    } catch (error) {
        res.status(500).json({ errMessage: error.message })
    }
})

// NEW - GET - /users/:userId/applications/new
router.get('/new', (req, res) => {
    res.render('applications/new.ejs')
})

// DELETE - DELETE - /users/:userId/applications/:applicationId
// UPDATE - PUT - /users/:userId/applications/:applicationId
// CREATE - POST - /users/:userId/applications/
router.post('/', async (req, res) => {
    try {
        //get back user to add app to
        const user = await User.findById(req.session.user._id)
        //take req.body and create application
        user.applications.push(req.body)
        //save updated user to db
        await user.save()
        //redirect user to my apps page
        res.redirect(`/users/${req.session.user._id}/applications`)
    } catch (error) {
        res.status(500).json({ errMessage: error.message })
    }
})
// EDIT - GET - /users/:userId/applications/:applicationId
// SHOW - GET - /users/:userId/applications/:applicationId
router.get('/:applicationId', async (req, res) => {
    try {
        //get back user
        const currentUser = await User.findById(req.session.user._id)
        //find app by id
        const application = currentUser.applications.id(req.params.applicationId)
        //send back app to app show page
        res.render('applications/show.ejs', { application })
    } catch (error) {
        res.status(500).json({ errMessage: error.message })
    }
})

module.exports = router