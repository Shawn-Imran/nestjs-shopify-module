import { Inject, Injectable } from '@nestjs/common';
import { SmartCollections, Options } from 'shopify-admin-api'; // https://github.com/nozzlegear/Shopify-Prime
import { SmartCollection } from 'shopify-admin-api/dist/models';
import { IShopifyConnect } from '../../auth/interfaces/connect';
import {
  SmartCollectionDocument,
  IListAllCallbackData,
  IShopifySyncSmartCollectionListOptions,
  IShopifySyncSmartCollectionCountOptions,
  IShopifySyncSmartCollectionGetOptions,
} from '../interfaces';
import { SyncProgressDocument, SubSyncProgressDocument, IStartSyncOptions, ShopifyModuleOptions } from '../../interfaces';
import { Model } from 'mongoose';
import { EventService } from '../../event.service';
import { ShopifyApiRootCountableService } from '../shopify-api-root-countable.service';

@Injectable()
export class SmartCollectionsService extends ShopifyApiRootCountableService<
SmartCollection, // ShopifyObjectType
SmartCollections, // ShopifyModelClass
IShopifySyncSmartCollectionCountOptions, // CountOptions
IShopifySyncSmartCollectionGetOptions, // GetOptions
IShopifySyncSmartCollectionListOptions, // ListOptions
SmartCollectionDocument // DatabaseDocumentType
> {

  resourceName = 'smartCollections';
  subResourceNames = [];

  constructor(
    @Inject('SmartCollectionModelToken')
    private readonly smartCollectionModel: (shopName: string) => Model<SmartCollectionDocument>,
    @Inject('SyncProgressModelToken')
    private readonly syncProgressModel: Model<SyncProgressDocument>,
    private readonly eventService: EventService,
  ) {
    super(smartCollectionModel, SmartCollections, eventService, syncProgressModel);
  }

  /**
   *
   * @param shopifyConnect
   * @param subProgress
   * @param options
   * @param data
   */
  async syncedDataCallback(
    shopifyConnect: IShopifyConnect,
    progress: SyncProgressDocument,
    subProgress: SubSyncProgressDocument,
    options: IStartSyncOptions,
    data: IListAllCallbackData<SmartCollection>,
  ) {
    const products = data.data;
    subProgress.syncedCount += products.length;
    const lastProduct = products[products.length - 1];
    subProgress.lastId = lastProduct.id;
    subProgress.info = lastProduct.title;
  }
}
