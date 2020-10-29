import { CacheStorage } from './cache-storage.interface';
import { CacheKeyGenerator } from './cache-key-generator.interface';

export interface AngularUniversalOptions {
  /**
   * The directory where the module should look for client bundle (Angular app).
   */
  viewsPath: string;
  /**
   * Path to index file.
   * Default: {viewsPaths}/index.html
   */
  templatePath?: string;
  /**
   * Static files root directory.
   * Default: *.*
   */
  rootStaticPath?: string | RegExp;
  /**
   * Path to render Angular app.
   * Default: * (wildcard - all paths)
   */
  renderPath?: string;
  /**
   * The platform level providers for the current render request.
   */
  extraProviders?: any[];
  /**
   * Cache options (flag or configuration object)
   */
  cache?:
  | boolean
  | {
    expiresIn?: number;
    storage?: CacheStorage;
    keyGenerator?: CacheKeyGenerator;
  };

  /**
   * 使用ejs，放弃服务端渲染，只做为与nestjs结合的http服务器
   */
  useEjsEngine?: boolean;


  /**
   * Module to bootstrap
   */
  bootstrap: any;

  /**
   * 中间方法，用于处理cookie等
   */
  middleware: (req, res) => void;

}
