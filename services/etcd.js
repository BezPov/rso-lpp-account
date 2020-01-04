const Etcd = require('node-etcd');

let etcdConfig;

try {
    etcdConfig = require('../config/etcd.json');
} catch (ex) {
    console.log(ex);
}


const etcd = new Etcd(etcdConfig ? etcdConfig.url : process.env.ETCD_SERVER);

module.exports = etcd;