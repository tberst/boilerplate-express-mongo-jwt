import errorHandler from "errorhandler";

import App from "./app";

/**
 * Error Handler. Provides full stack - remove for production
 */

 const application = new App();
 application.useErrorHandler(errorHandler());

 const server = application.start();

export default server;
