/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` your home page.            *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  '/': { view: 'pages/homepage' },

  // routes for userController 
  'post /signup': 'UserController.signUp',
  'post /login': 'UserController.login',
  'get /logout/:id': 'UserController.logout',
  'post /update/:id': 'UserController.update',

  // routes for placeController
  'post /createPlace': 'PlaceController.createPlace',
  'get /listPlace': 'PlaceController.listPlace',
  'get /showPlace/:id': 'PlaceController.showPlace',
  'patch /updatePlace/:id': 'PlaceController.updatePlace',
  'delete /deletePlace/:id': 'PlaceController.deletePlace',

  // route for ticketController
  'post /createTicket': 'TicketController.createTicket',
  'get /listUnprocessedTicket': 'TicketController.listUnprocessedTicket',
  'get /history': 'TicketController.history',
  'patch /updateStatus': 'TicketController.updateStatus',


  /***************************************************************************
  *                                                                          *
  * More custom routes here...                                               *
  * (See https://sailsjs.com/config/routes for examples.)                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the routes in this file, it   *
  * is matched against "shadow routes" (e.g. blueprint routes).  If it does  *
  * not match any of those, it is matched against static assets.             *
  *                                                                          *
  ***************************************************************************/


};
