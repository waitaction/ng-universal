import { APP_BASE_HREF } from '@angular/common';
import { DynamicModule, Inject, Module, OnModuleInit } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { existsSync } from 'fs';
import { join } from 'path';
import 'reflect-metadata';
import { ANGULAR_UNIVERSAL_OPTIONS } from './angular-universal.constants';
import { angularUniversalProviders } from './angular-universal.providers';
import { AngularUniversalOptions } from './interfaces/angular-universal-options.interface';
import { NgxRequest, NgxResponse } from '@gorniv/ngx-universal';
import { REQUEST, RESPONSE } from '@nguniversal/express-engine/tokens';
@Module({
  providers: [...angularUniversalProviders]
})
export class AngularUniversalModule implements OnModuleInit {
  constructor(
    @Inject(ANGULAR_UNIVERSAL_OPTIONS)
    private readonly ngOptions: AngularUniversalOptions,
    private readonly httpAdapterHost: HttpAdapterHost
  ) { }

  static forRoot(options: AngularUniversalOptions): DynamicModule {
    const indexHtml = existsSync(join(options.viewsPath, 'index.original.html'))
      ? 'index.original.html'
      : 'index';

    options = {
      templatePath: indexHtml,
      rootStaticPath: '*.*',
      renderPath: '*',
      ...options
    };

    return {
      module: AngularUniversalModule,
      providers: [
        {
          provide: ANGULAR_UNIVERSAL_OPTIONS,
          useValue: options
        }
      ]
    };
  }

  async onModuleInit() {
    if (!this.httpAdapterHost) {
      return;
    }
    const httpAdapter = this.httpAdapterHost.httpAdapter;
    if (!httpAdapter) {
      return;
    }
    const app = httpAdapter.getInstance();
    app.get(this.ngOptions.renderPath, (req, res) => {
      req.cookies = req.headers.cookie;
      if (this.ngOptions.middleware) {
        this.ngOptions.middleware(req, res);
      }
      res.render(this.ngOptions.templatePath, {
        req,
        res,
        providers: [
          { provide: APP_BASE_HREF, useValue: req.baseUrl },
          // for http and cookies
          { provide: REQUEST, useValue: req },
          { provide: RESPONSE, useValue: res },
          /// for cookie
          { provide: NgxRequest, useValue: req },
          { provide: NgxResponse, useValue: res }
        ]
      });
    });

  }
}
