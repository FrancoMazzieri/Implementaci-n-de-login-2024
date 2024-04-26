const { Router } = require('express')
const ProductManager = require('../dao/fileSystem/productmanager')
const MongoProductManager = require('../dao/mongo/mongoProductManager')
const MongoCartManager = require('../dao/mongo/mongoCartManager')
const chatModel = require('../models/chat')

const User = require('../models/user.models')
const { userIsLoggedIn, userIsNotLoggedIn } = require('../middleware/auth.middleware')


const mongoProductManager = new MongoProductManager()
const mongoCartManager = new MongoCartManager()

const productManager = new ProductManager()
const route = new Router()

route.get('/products', async (req, res)=>{

    const {limit = 10 , page = 1, query} = req.query
    let filtro = {}
    query? filtro = {category: query} : filtro = {}
    try {
        const {docs, hasPrevPage, hasNextPage, prevPage, nextPage} = await mongoProductManager.getProducts(limit, page, filtro)
        
        let datos = {
            productos: docs,
            hasPrevPage,
            hasNextPage,
            prevPage,
            nextPage,
            page,
            limit,
            query
        }
        res.render('home', datos)
    } catch (error) {
        console.log(error)
    }
})
route.get('/carts/:cid', async (req, res)=>{
    const {cid} = req.params
    const {limit = 1 , page = 1} = req.query
    console.log(limit)
    try {
        const {docs, hasPrevPage, hasNextPage, prevPage, nextPage} = await mongoCartManager.getCartProducts(cid, limit, page)
        let data = docs[0].products
        let datos = {
            productos: data,
            hasPrevPage,
            hasNextPage,
            prevPage,
            nextPage,
            page,
            limit
        }
        res.render('carts', datos)
    } catch (error) {
        console.log(error)
    }
})

route.get('/realTimeProducts', async (__, res) => {
    try {

        res.render('realTimeProducts', {
            title: 'Websockets',
            useWS: true,
            scripts: [
                'index.js'
            ]
        })
    } catch (error) {
        console.log(error)
    }

})
route.get('/chat', (req, res) => {
    res.render('chat')
})

route.get('/', (req, res) => {

    const isLoggedIn = ![null, undefined].includes(req.session.user)

    res.render('firtspg', {
        title: 'Home',
        isLoggedIn,
        isNotLoggedIn: !isLoggedIn,
    })
})

route.get('/login', (_, res) => {
    // TODO: agregar middleware, sólo se puede acceder si no está logueado
    res.render('login', {
        title: 'Login'
    })
})

route.get('/register', (_, res) => {
    // TODO: agregar middleware, sólo se puede acceder si no está logueado
    res.render('register', {
        title: 'Register'
    })
})

route.get('/profile', (_, res) => {
    // TODO: agregar middleware, sólo se puede acceder si está logueado
    // TODO: mostrar los datos del usuario actualmente loggeado, en vez de los fake
    res.render('profile', {
        title: 'My profile',
        user: {
            firstName: 'Luke',
            lastName: 'SkyWalker',
            age: 33,
            email: 'luke@gmail.com'
        }
    })
})



module.exports = route;