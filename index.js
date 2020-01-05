const restify = require('restify');

const logger = require('./services/logging');

const corsMiddleware = require('restify-cors-middleware');

let cors = corsMiddleware({
	preflightMaxAge: 5,
	origins: ['*'],
	allowHeaders: ['X-App-Version'],
	exposeHeaders: []
});

const options = {
	name: 'lpp-account',
	version: process.env.npm_package_version
};

const server = restify.createServer(options);

server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());

server.pre(cors.preflight);
server.use(cors.actual);

server.get('/', (req, res, next) => {
	res.json({
		name: 'lpp-account',
		version: process.env.npm_package_version,
		description: 'Handles the account'
	});

	return next();
});

require('./routes/metricsRoutes')(server);
require('./routes/healthRoutes')(server);

require('./api/accounts')(server);

server.listen(8080, () => {
	console.log(`${server.name} listening at ${server.url}`);

	//logger.info(`${options.name} ${options.version} listening at ${server.url}`);

	const onDatabaseConnected = function () {
		//logger.info(`[${process.env.npm_package_name}] Database connected`);
	};

	const onDatabaseError = function () {
		//logger.info(`[${process.env.npm_package_name}] An error occurred while connecting to database.`);
	};

	require('./services/database')(onDatabaseConnected, onDatabaseError);
});