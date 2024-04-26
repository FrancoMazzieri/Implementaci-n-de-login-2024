const { Router } = require('express')

const SessionRouter = Router()

SessionRouter.post('/login', (req, res) => {
    console.log(req.body)
    // TODO: implementar!

    // 1. verificar que el usuario exista en la BD
    // 2. crear nueva sesión si el usuario existe
    res.redirect('/')
})

SessionRouter.post('/register', (req, res) => {
    console.log(req.body)
    // TODO: implementar!

    // 1. crear usuario nuevo
    res.redirect('/')
})

module.exports = SessionRouter