import { TRoles } from './role';
import { Document } from 'mongoose';

import { IShopifyShop } from '../../shop/interfaces/shop';

export interface IShopifyConnect {
  shopifyID: number;
  myshopify_domain: string;
  accessToken: string;
  createdAt: Date;
  updatedAt: Date;
  roles: TRoles;
  shop: IShopifyShop;
}

export interface IShopifyConnectDocument extends IShopifyConnect, Document {
  shopifyID: number;
  myshopify_domain: string;
  accessToken: string;
  createdAt: Date;
  updatedAt: Date;
  roles: TRoles;
  shop: IShopifyShop;
}
