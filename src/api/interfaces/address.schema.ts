import { Schema, Document } from 'mongoose';
import { Address } from 'shopify-prime/models';

export type AddressDocument = Address & Document;

export const AddressSchema = new Schema({
  address1: String,
  address2: String,
  city: String,
  company: String,
  country: String,
  country_code: String,
  country_name: String,
  default: Boolean,
  first_name: String,
  last_name: String,
  latitude: Number,
  longitude: Number,
  name: String,
  phone: String,
  province: String,
  province_code: String,
  zip: String,
});