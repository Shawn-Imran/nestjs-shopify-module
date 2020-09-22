import { Error } from "mongoose";

export type Topic =
'carts/create'
| 'carts/update'
| 'checkouts/create'
| 'checkouts/update'
| 'checkouts/delete'
| 'collections/create'
| 'collections/update'
| 'collections/delete'
| 'collection_listings/add'
| 'collection_listings/remove'
| 'collection_listings/update'
| 'customers/create'
| 'customers/disable'
| 'customers/enable'
| 'customers/update'
| 'customers/delete'
| 'customer_groups/create'
| 'customer_groups/update'
| 'customer_groups/delete'
| 'draft_orders/create'
| 'draft_orders/update'
| 'fulfillments/create'
| 'fulfillments/update'
| 'fulfillment_events/create'
| 'fulfillment_events/delete'
| 'inventory_items/create'
| 'inventory_items/update'
| 'inventory_items/delete'
| 'inventory_levels/connect'
| 'inventory_levels/update'
| 'inventory_levels/disconnect'
| 'locations/create'
| 'locations/update'
| 'locations/delete'
| 'orders/cancelled'
| 'orders/create'
| 'orders/fulfilled'
| 'orders/paid'
| 'orders/partially_fulfilled'
| 'orders/updated'
| 'orders/delete'
| 'order_transactions/create'
| 'products/create'
| 'products/update'
| 'products/delete'
| 'product_listings/add'
| 'product_listings/remove'
| 'product_listings/update'
| 'refunds/create'
| 'app/uninstalled'
| 'shop/update'
| 'themes/create'
| 'themes/publish'
| 'themes/update'
| 'themes/delete';

export interface WebhookError extends Error {
    body: any;
    apiRateLimitReached: boolean;
    errors: {
        address?: string[];
        topic?: string[];
    }
    statusCode: number;
    statusText: string;
    message: string;
}