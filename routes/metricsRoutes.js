const initRoutes = function (server) {
    server.get('/metrics', function (req, res, next) {
        res.json({
            name: 'lpp-account',
            version: process.env.npm_package_version,
            status: 'OK'
        });

        return next();
    });
};

module.exports = initRoutes;