'use strict';

module.exports = {
	db: 'mongodb://localhost/trend-twitter2-dev',
	app: {
		title: 'trend-twitter2 - Development Environment'
	},
	facebook: {
		clientID: process.env.FACEBOOK_ID || 'APP_ID',
		clientSecret: process.env.FACEBOOK_SECRET || 'APP_SECRET',
		callbackURL: '/auth/facebook/callback'
	},
	twitter: {
		clientID: process.env.TWITTER_KEY || 'GHUf65msg3VlzpOrNN7GChIMY',
		clientSecret: process.env.TWITTER_SECRET || 'PniIQEEqNfwWnjdN3KkiYi7laN6xFF2DSKvJtrc5vYxIAoeVFv',
		callbackURL: '/auth/twitter/callback'
	},
	google: {
		clientID: process.env.GOOGLE_ID || '115235471805-7em1fubedlfuqnhc6ql324pte8ep6i1l.apps.googleusercontent.com',
		clientSecret: process.env.GOOGLE_SECRET || 'Vc3dSj3nya0YUoAyjqMW-5-H',
		callbackURL: '/auth/google/callback'
	},
	linkedin: {
		clientID: process.env.LINKEDIN_ID || 'APP_ID',
		clientSecret: process.env.LINKEDIN_SECRET || 'APP_SECRET',
		callbackURL: '/auth/linkedin/callback'
	},
	github: {
		clientID: process.env.GITHUB_ID || 'APP_ID',
		clientSecret: process.env.GITHUB_SECRET || 'APP_SECRET',
		callbackURL: '/auth/github/callback'
	},
	mailer: {
		from: process.env.MAILER_FROM || 'MAILER_FROM',
		options: {
			service: process.env.MAILER_SERVICE_PROVIDER || 'MAILER_SERVICE_PROVIDER',
			auth: {
				user: process.env.MAILER_EMAIL_ID || 'MAILER_EMAIL_ID',
				pass: process.env.MAILER_PASSWORD || 'MAILER_PASSWORD'
			}
		}
	}
};
