const express = require('express');
const app = express();
const bodyparser = require('body-parser');
const session = require('express-session');
const path = require('path');
const ejs = require('ejs');
const passport = require('passport');
const { Strategy } = require('passport-discord');
const config = require('../../data/config.json')
const logger = require('log4js').getLogger('Aram SecureLink');
module.exports.load = async (client) => {
	app.use(bodyparser.json());
	app.use(bodyparser.urlencoded({ extended: true }));
	app.engine('html', ejs.renderFile);
	app.set('view engine', 'ejs');
	app.set('views', path.join(__dirname, '/views'));
	app.use(express.static(path.join(__dirname, '/public')));
	// app.use('/assets', express.static('assets'))
	app.use(express.static(path.join(__dirname, '/assets')))
	app.use(session({
		secret: 'SecureInviteLink',
		resave: false,
		saveUninitialized: true
	}));

	app.use(async function(req, res, next) {
		req.client = client;
		next();
	});

	app.use(passport.initialize());
	app.use(passport.session());

	passport.serializeUser((user, done) => {
		done(null, user);
	});
	passport.deserializeUser((obj, done) => {
		done(null, obj);
	});
	passport.use(new Strategy({
		clientID: config.bot.tclientId,
		clientSecret: config.dashboard.TEST_CLIENT_SECRET,
		callbackURL: config.dashboard.TEST_CALLBACK_URL,
		scope: [ 'identify', 'guilds', 'guilds.join' ],
	}, function(accessToken, refreshToken, profile, done) {
		process.nextTick(function() {
			return done(null, profile);	
			// req.user.accessToken		
		});
	}));

	app.use('/', require('./routes/index'));

	app.get('*', (req, res) => {
		res.render('../views/404', {
			bot: req.client,
			user: req.user,
		});
	});

	app.listen(config.dashboard.PORT, () => {
		logger.info(`${client.user.tag} 보안 초대 링크 작동완료 | http://localhost:${9999}`);
	});
};