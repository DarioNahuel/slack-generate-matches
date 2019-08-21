'use strict';

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route');

Route.on('/').render('documentation.index');

Route.group(() => {
  // User routes
  Route.get('users', 'UserController.index');
  Route.post('users', 'UserController.store').validator('StoreUser');
  Route.delete('users/:id', 'UserController.destroy');

  // Time routes
  Route.get('times', 'TimeController.index');

  // Match routes
  Route.get('matches', 'MatchController.index');
  Route.post('matches', 'MatchController.store').validator('StoreMatch');
  Route.delete('matches/:id', 'MatchController.destroy');

  // Slack User routes
  Route.post('slackUserStore', 'SlackUserController.userStore');
  Route.post('slackUserUpdate', 'SlackUserController.userUpdate');

  // Slack Match routes
  Route.post('slackMatchStore', 'SlackMatchController.matchStore');
  Route.post('slackMatchChallenge', 'SlackMatchController.matchChallenge');
  Route.post('slackMatchDelete', 'SlackMatchController.matchDelete');

  Route.post('slackActions', 'SlackController.actionsHandler');

  Route.get('docs', 'DocumentationController.index');
}).prefix('api/v1');
