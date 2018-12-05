import { Inject, Controller, Get, Req, Res, Next, Session, Query, Param, HttpStatus } from '@nestjs/common';
import { PassportStatic } from 'passport';
import { ShopifyAuthStrategy } from './auth.strategy';
import { ShopifyConnectService} from './connect.service';
import { DebugService } from '../debug.service';
import { ShopifyModuleOptions} from '../interfaces/shopify-module-options';
import { SHOPIFY_MODULE_OPTIONS } from '../shopify.constants';
import { IShopifyConnect } from './interfaces/connect'

import { Roles } from '../guards/roles.decorator';
@Controller('shopify/auth')
export class ShopifyAuthController {

  protected logger = new DebugService('shopify:AuthController');

  constructor(
    private readonly shopifyConnectService: ShopifyConnectService,
    @Inject(SHOPIFY_MODULE_OPTIONS) private readonly shopifyModuleOptions: ShopifyModuleOptions,
    @Inject('Passport') private readonly passport: PassportStatic,
  ) {

  }

  /**
   * Starts the OAuth flow to connect this app with shopify
   * @param res
   * @param req
   */
  @Get()
  oAuthConnect(@Query('shop') shop, @Req() req, @Res() res, @Next() next, @Session() session) {
    if (typeof shop !== 'string') {
      return res.send('shop was not a string, e.g. /auth/shopify?shop=your-shop-name');
    }

    session.shop = shop;

    this.logger.debug('auth called', `AuthController:${shop}`);

    const shopifyAuthStrategy = new ShopifyAuthStrategy(shop, this.shopifyConnectService, this.shopifyModuleOptions, this.passport)

    this.passport.use(`shopify-${shop}`, shopifyAuthStrategy);
    // passport.serializeUser((user: IShopifyConnect, done) => {
    //   this.logger.debug('serializeUser myshopify_domain', user.myshopify_domain);
    //   shopifyAuthStrategy.serializeUser(user, done);
    // });
    // passport.deserializeUser((id: number, done) => {
    //   this.logger.debug('deserializeUser id', id);
    //   shopifyAuthStrategy.deserializeUser(id, done);
    // });

    return this.passport.authenticate(`shopify-${shop}`, {
      scope: this.shopifyModuleOptions.scope,
      shop: shop,
    } as any)(req, res, next);
  }

  /**
   * OAuth shopify callback
   * @param res
   * @param req
   */
  @Get('/callback')
  callback(@Query('shop') shop, @Req() req, @Res() res, @Next() next) {
    if (typeof shop !== 'string') {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'shop query param not found',
      });
    }

    this.logger.debug('callback called', `AuthController:${shop}`);

    return this.passport.authenticate(`shopify-${shop}`, {
      failureRedirect: `failure/${shop}`,
      successRedirect: `/view/settings`, // `success/${shop}`,
      session: true,
      userProperty: 'user', // defaults to 'user' if omitted
    })(req, res, next);
  }

  /**
   * Called if OAuth was success
   * @param res
   * @param req
   */
  @Get('/success/:shop')
  success(@Param('shop') shop, @Res() res, @Req() req) {
    this.passport.unuse(`shopify-${shop}`);
    return res.json({
      message: 'successfully logged in',
      shop: req.user.shop,
    });
  }

  /**
   * Called if OAuth fails
   * @param res
   * @param req
   */
  @Get('/failure/:shop')
  failure(@Param('shop') shop, @Res() res, @Req() req) {
    this.passport.unuse(`shopify-${shop}`);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR)
    .json({ message: `Failure on oauth autentification`, shop });
  }

  /**
   * Get a list of all connected shopify accounts
   * @param res
   * @param req
   */
  @Get('/connected')
  @Roles('admin')
  async connects(@Res() res, @Req() req) {
    return this.shopifyConnectService.findAll()
    .then((connects) => {
      return res.json(connects);
    })
    .catch((error: Error) => {
      this.logger.error(error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: `Failure on get connected shopify accounts`});
    });
  }

  /**
   * Get connected shopify account by current user
   * @param res
   * @param req
   */
  @Get('/connected/current')
  @Roles('shopify-staff-member')
  async connectCurrent(@Res() res, @Req() req) {
    return this.shopifyConnectService.findByDomain(req.user.shop.domain)
    .then((connect) => {
      return res.json(connect);
    })
    .catch((error: Error) => {
      this.logger.error(error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({
        message: `Failure on get connected shopify account.`,
        info: error.message,
        name: error.name,
      });
    });
  }

  /**
   * Get a connected shopify account by id
   * @param res
   * @param req
   */
  @Get('/connected/:id')
  @Roles('admin')
  async connect(@Param('id') id, @Res() res, @Req() req) {
    return this.shopifyConnectService.findByShopifyId(Number(id))
    .then((connect) => {
      return res.json(connect);
    })
    .catch((error: Error) => {
      this.logger.error(error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({
        message: `Failure on get connected shopify account with id ${id}.`,
        info: error.message,
        name: error.name,
        id,
      });
    });
  }

  @Get('/logout')
  @Roles('shopify-staff-member')
  logout(@Res() res, @Req() req) {
    req.logout();
    return res.redirect('/view/settings'); // TODO change url and store them in config
  }

  /**
   * Check if the current user (the request comes from) is logged in
   * @param res
   * @param req
   */
  @Get('/loggedIn')
  loggedIn(@Res() res, @Req() req) {
    if (req.user) {
      return res.json(true);
    }
    return res.json(false);
  }
}
