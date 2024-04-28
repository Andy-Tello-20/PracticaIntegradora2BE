import CartModel from '../dao/models/cart.model.js'


export default class CartManager {

    static async createCart(data) {
        const product = await CartModel.create(data);
        console.log(`Producto creado correctamente (${product._id}) `);
        return product;
    }


    static async getCart() {
        try {
            const cart = await CartModel.find({});
            return cart;
        } catch (error) {
            console.error('Error al obtener el carrito:', error);
            throw error;
        }
    }


    static async getCartById(sid) {
        const product = await CartModel.findById(sid);
        if (!product) {
            throw new Error('Producto no encontrado.');
        }
        return product;
    }

    static async addProductToCart(idCart, idProducto) {

        const NewId = (idCart)

        const cart = await CartModel.findById(NewId)

        if (cart) {

            const existingProduct= cart.products.find((i) => { return i.product === idProducto })


            if (existingProduct) {
                // Si el producto ya está en el carrito, aumentar la cantidad en una unidad
                existingProduct.quantity++;
              } else {
                // Si el producto no está en el carrito, agregarlo como nuevo
                cart.products.push({ product: idProducto, quantity: 1 });
              }

              await cart.save();
              return cart;

        } else {

           const mensaje = "no se encontro ningun producto 😪"

            return mensaje
        }


    }

    static async updateCartById(sid, data) {
        await CartModel.updateOne({ _id: sid }, { $set: data });
        console.log(`Producto actualizado correctamente (${sid}) `);
    }

    static async deleteCartById(sid) {
        await CartModel.deleteOne({ _id: sid });
        console.log(`Producto eliminado correctamente (${sid}) `);
    }







}