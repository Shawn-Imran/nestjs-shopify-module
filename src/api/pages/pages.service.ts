import { Inject, Injectable } from '@nestjs/common';
import { Pages, Options } from 'shopify-prime';
import { Page } from 'shopify-prime/models';
import { IShopifyConnect } from '../../auth/interfaces/connect';
import { Model } from 'mongoose';
import { deleteUndefinedProperties } from '../helpers';
import { EventService } from '../../event.service';
import { ShopifyApiRootCountService } from '../api.service';
import { PageDocument } from '../interfaces/mongoose/page.schema';
// import { IPageSyncProgress, PageSyncProgressDocument } from '../../sync/sync-progress.schema';

export interface PageListOptions extends Options.PageListOptions {
  sync?: boolean;
}

export interface PageGetOptions extends Options.FieldOptions {
  sync?: boolean;
}

export interface PageCountOptions extends Options.PageCountOptions {}

export interface PageSyncOptions {
  resync: boolean,
}


@Injectable()
export class PagesService extends ShopifyApiRootCountService<
Page, // ShopifyObjectType
Pages, // ShopifyModelClass
PageCountOptions, // CountOptions
PageGetOptions, // GetOptions
PageListOptions, // ListOptions
PageDocument // DatabaseDocumentType
> {
  constructor(
    @Inject('PageModelToken')
    private readonly pageModel: (shopName: string) => Model<PageDocument>,
    // @Inject('PageSyncProgressModelToken') private readonly productSyncProgressModel: (shopName: string) => Model<PageSyncProgressDocument>,
    private readonly eventService: EventService,
  ) {
    super(pageModel, Pages);
  }

  /**
   * Creates a new page.
   * @param user 
   * @param page The page being created.
   */
  public async create(user: IShopifyConnect, page: Partial<Page>): Promise<Page> {
    const pages = new Pages(user.myshopify_domain, user.accessToken);
    return pages.create(page)
    .then((page) => {
      return page;
    });
  }

  /**
   * Retrieves a single page by its ID.
   * @param user 
   * @param id Id of the page to retrieve.
   * @param options Options for filtering the result.
   */
  public async get(user: IShopifyConnect, id: number, options?: Options.FieldOptions): Promise<Page> {
    const pages = new Pages(user.myshopify_domain, user.accessToken);
    options = deleteUndefinedProperties(options);
    return pages.get(id, options)
    .then((page) => {
      return page;
    });
  }

  /**
   * Updates a page with the given id.
   * @param user 
   * @param id Id of the page being updated.
   * @param page The updated page.
   */
  public async update(user: IShopifyConnect, id: number, page: Partial<Page>): Promise<Page> {
    const pages = new Pages(user.myshopify_domain, user.accessToken);
    return pages.update(id, page)
    .then((page) => {
      return page;
    });
  }

  /**
   * Retrieve a list of all pages.
   * @param user 
   * @param options Options for filtering the results.
   */
  public async list(user: IShopifyConnect, options?: Options.FieldOptions): Promise<Page[]> {
    const pages = new Pages(user.myshopify_domain, user.accessToken);
    options = deleteUndefinedProperties(options);
    return pages.list(options)
    .then((pages) => {
      return pages;
    });
  }

  /**
   * Retrieves a page count.
   * @param user 
   * @param options 
   */
  public async count(user: IShopifyConnect, options?: Options.PageCountOptions): Promise<number> {
    const pages = new Pages(user.myshopify_domain, user.accessToken);
    options = deleteUndefinedProperties(options);
    this.logger.debug('count options', options);
    return pages.count(options)
    .then((count) => {
      return count;
    });
  }

  /**
   * Deletes a page with the given id.
   * @param user 
   * @param id Id of the page being deleted.
   */
  public async delete(user: IShopifyConnect, id: number): Promise<{id: number}> {
    const pages = new Pages(user.myshopify_domain, user.accessToken);
    return pages.delete(id)
    .then((result) => {
      return result;
    });
  }

}