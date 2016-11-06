"use strict";

const _ = require('lodash');
const Promise = require('bluebird');
const loopback = require('loopback');
const lacl = require('..');

require('../lib/contract').debug = true;

const ds = loopback.createDataSource('mongodb://localhost');

exports.setup = function (ctx) {
	ctx.acl = lacl.acl(ds);
};

exports.teardown = function (ctx) {
	return exports.clearData(ctx);
};

exports.clearData = function (ctx) {
	return Promise.map(_.values(ctx.acl.models), model => model.destroyAll());
};
