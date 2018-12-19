import { Schema, Document } from 'mongoose';
import { TaxLine } from 'shopify-prime/models';
import { PriceSetSchema } from './price-set.schema';

export type TaxLineDocument = TaxLine & Document;

export const TaxLineSchema = new Schema({
  price: Number,
  rate: Number,
  title: String,
  price_set: PriceSetSchema,
}, {
  _id: false,
});
TaxLineSchema.set('toJSON', {
  transform: function(doc, ret, options) {
    delete ret._id;
    delete ret.__parentArray;
    delete ret.__index;
  }
});