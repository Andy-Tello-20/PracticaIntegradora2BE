import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
  products: [
    {
      product: { type: String, required: false },
      quantity: { type: Number, required: false, default: 1 }
    }
  ]
}, { timestamps: true });

export default mongoose.model('Cart', cartSchema);


