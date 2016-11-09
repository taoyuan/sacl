"use strict";

const test = require('ava');
const assert = require('chai').assert;
const Promise = require('bluebird');
const s = require('./support');

const ctx = {};
test.before(t => s.setup(ctx));
test.after(t => s.teardown(ctx));

test.beforeEach(t => s.clearData(ctx));

test('should add actions', t => {
	const acl = ctx.acl;
	const {Abilities} = acl;
	return Abilities.addActions('Article', ['read', 'CREATE', 'UPDATE'])
		.then(ability => {
			assert.ok(ability);
			return Abilities.findByResource('Article').then(ability => {
				assert.ok(ability);
				assert.sameMembers(ability.actions, ['READ', 'CREATE', 'UPDATE']);
			});
		})
		.then(() => Abilities.addActions('Article', ['read', 'APPROVAL']))
		.then(ability => {
			assert.ok(ability);
			return Abilities.findByResource('Article').then(ability => {
				assert.ok(ability);
				assert.sameMembers(ability.actions, ['READ', 'CREATE', 'UPDATE', 'APPROVAL']);
			});
		})
		.then(() => Abilities.addActions('Article:123', ['COMMENT']))
		.then(ability => {
			assert.ok(ability);
			return Abilities.findByResource('Article').then(ability => {
				assert.ok(ability);
				assert.sameMembers(ability.actions, ['READ', 'CREATE', 'UPDATE', 'APPROVAL', 'COMMENT']);
			});
		});
});

test('should fail for unmatched updated time', t => {
	const acl = ctx.acl;
	const {abilities} = acl;
	return abilities.addActions('Article', ['read', 'CREATE', 'UPDATE'])
		.then(ability => {
			assert.ok(ability);
			return abilities.findByResource('Article').then(ability => {
				assert.ok(ability);
				assert.sameMembers(ability.actions, ['READ', 'CREATE', 'UPDATE']);
			});
		})
		.then(() => Promise.all([
			abilities.addActions('Article', ['read', 'APPROVAL']),
			abilities.addActions('Article', ['read', 'APPROVAL', 'PUBLISH'])
		]).then(([s1, s2]) => {
			assert.ok(s1);
			assert.notOk(s2);
		}));
});

