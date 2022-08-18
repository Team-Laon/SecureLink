const express = require('express');
const { version } = require('discord.js');
const moment = require('moment');
require('moment-duration-format');
const passport = require('passport');
const client = require('../../../../index')
// const checkAuth = require('../backend/checkAuth');
const { REST } = require('@discordjs/rest');
const rest = new REST({ version: '10' }).setToken(require('../../../data/config.json').bot.token.test);
const config = require('../../../data/config.json')

let Callback_RedirectUri;
const checkAuth = (req, res, next) => {
	if (req.isAuthenticated()) {
        return next()
    }
	console.log(req.session)
	Callback_RedirectUri = req.url
	res.redirect('/callback')
}

const secinv = require('../../../models/봇시스템/보안링크');
const package = require('../../../../package.json')
const router = express.Router();

router.get('/goback', async (req, res) => {
	res.render('index', {
		tag: (req.user ? req.user.tag : 'Login'),
		bot: req.client,
		user: req.user || null,
	});
});

router.get('/invite', async function(req, res) {
	res.redirect(`https://discord.com/api/oauth2/authorize?client_id=${req.client.user.id}&permissions=66321471&redirect_uri=https%3A%2F%2Fmora-bot.kr&response_type=code&scope=bot%20applications.commands%20identify`);
});

router.get('/callback', passport.authenticate('discord', { failureRedirect: '/' }), async function(req, res) {
	if (!req.user.id || !req.user.guilds) {
		console.log(`callback - if - ${req.session.backURL}`)
		console.log(`callback - if - ${req.url}`)
		res.redirect('/i/${req.session.backURL}');

	}
	else {
		res.redirect(`${Callback_RedirectUri}`)
	}
});

router.get('/logout', async function(req, res) {
	req.session.destroy(() => {
		req.logout();
		res.redirect('/');
	});
});
router.get('/i/:name', checkAuth, async (req, res) => {
	const SecInvCheck = await secinv.findOne({ link: req.params.name })
	if (!SecInvCheck) {
		res.render('dashboard/secinv_guild404', {
			bot: req.client,
			user: req.user,
		})
	}
	const guildid = SecInvCheck.guildID;
	const server = req.client.guilds.cache.get(guildid);
	const onlinemember = server.members.cache.filter(member => member?.presence?.status == 'online').size;
	const idlemember = server.members.cache.filter(member => member?.presence?.status == 'idle').size;
    const dndmember = server.members.cache.filter(member => member?.presence?.status == 'dnd').size;
	const omember = onlinemember + idlemember + dndmember
	if (!server && req.user.guilds.filter(u => ((u.permissions & 2146958591) === 2146958591)).map(u => u.id).includes(guildid)) {
		return res.redirect(`https://discord.com/oauth2/authorize?client_id=${req.client.user.id}&scope=bot%20applications.commands&permissions=1094679657975&guild_id=${guildid}`);
	}
	else if (!server) {
		res.redirect('/dashboard/servers')
	}
	res.render('dashboard/secureinv', {
		bot: req.client,
		user: req.user,
		rest: rest,
		guild: server,
		onlineMember: omember,
		linkname: req.params.name,
		recaptcha_key: 'google recaptcha key (v3)',
	})
})
router.post('/i/:name', checkAuth, async (req, res) => {
	const SecInvCheck = await secinv.findOne({ link: req.params.name })
	if (!SecInvCheck) {
		res.render('dashboard/secinv_guild404', {
			bot: req.client,
			user: req.user,
		})
	}
	const guildID = SecInvCheck.guildID;
	const server = client.guilds.cache.get(guildID)
	try {
		await rest.put(`/guilds/${guildID}/members/${req.user.id}`, {
			body: {
				'access_token': req.user.accessToken
			}
		})
		res.render('dashboard/secinv_success', {
			bot: req.client,
			user: req.user,
			guild: server,
		})
	} catch (e) {
		res.render('dashboard/secinv_fail', {
			bot: req.client,
			user: req.user,
			guild: server,
		})
	}
});
module.exports = router;
