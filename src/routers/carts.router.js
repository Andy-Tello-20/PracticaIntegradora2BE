import { Router } from 'express'
import CartManager from '../../src/dao/cart.mannager.js'

const router = Router()



router.post('/carts', async (req, res) => {

    try {
        const newCart = {
            products: []
        }

        await CartManager.createCart(newCart)

        res.status(201).json(newCart)

    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Error interno del servidor' })
    }


})


router.get('/carts/:cid', async (req, res) => {

    try {
        const idcart = req.params.cid

        if (idcart) {


            const showCart = await CartManager.getCartById(idcart)

            res.status(201).json(showCart)

        } else {
            res.send({ error: 'No se proporcionó un PID válido' })
        }

    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Error interno del servidor' })
    }

})


router.post('/carts/:cid/product/:pid', async (req, res) => {

    try {
        const carritoId = req.params.cid
        const productoId = req.params.pid

        const productoEncontrado = await CartManager.addProductToCart(carritoId, productoId)

        return res.json(productoEncontrado)

    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Error interno del servidor' })
    }
})



export default router