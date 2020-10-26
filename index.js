const NodeCache = require( "node-cache" );
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const config = require('./common/config/env-config');
const errorCatcher = require('./common/middlewares/error-catcher');

const AuthorizationRouter = require('./authorization/config/routes');
const ProductsRouter = require('./products/config/routes');
const OrdersRouter = require('./orders/config/routes');

app.set('localCache', new NodeCache());

app.use(require('./common/middlewares/cross-domain'));
app.use(bodyParser.json());


AuthorizationRouter.routesConfig(app);
ProductsRouter.routesConfig(app);
OrdersRouter.routesConfig(app);

app.use(errorCatcher);

app.listen(config.port, function () {
    console.log('app listening at port %s', config.port);
});



