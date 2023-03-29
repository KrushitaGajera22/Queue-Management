/**
 * TicketController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const Constants = sails.config.constants;

module.exports = {
  //create ticket by user
  createTicket: async (req, res) => {
    try {
      await Ticket.create({
        id: Constants.uuid.v4(),   // generating unique id using uuid
        ticketNumber: req.body.ticketNumber,
        place: req.body.place,
        isProcessed: req.body.isProcessed,
        user: req.body.user
      })
      return res.status(201).send({ message: 'Ticket Created' })
    } catch (error) {
      return res.status(500).send({ error: error })
    }
  },

// list of pending tickets
  listUnprocessedTicket: async (req, res) => {
    try {
      //find all tickets
      await Ticket.find({})
        .select(['ticketNumber', 'isProcessed']) // select specific fields which we want to show
        .sort([{ createdAt: 'ASC' }])  // sort in ascending order using createdAt field
        .where({ isProcessed: 'false' })  // condition for only pending tickets
        .then((ticket) => {
          return res.status(200).send({ ticket })
        })
    } catch (error) {
      console.log(error);
      return res.status(500).send({ error: error })
    }
  },

  // history of processed tickets
  history: async (req, res) => {
    try {
      // finding all tickets
      await Ticket.find({})
        .select(['ticketNumber', 'isProcessed']) // select specific fields which we want to show
        .sort([{ createdAt: 'ASC' }]) // sort in ascending order using createdAt field
        .where({ isProcessed: 'true' }) // condition for only processed tickets
        .then((ticket) => {
          return res.status(200).send({ ticket })
        })
    } catch (error) {
      console.log(error);
      return res.status(500).send({ error: error })
    }
  },

  // updating ticket status from unprocessed to processed
  updateStatus: async (req, res) => {
    try {
      let user;
      // get all the data present in params or query
      let id = req.allParams();
      //get place id
      let placeId = req.query.placeId;
      // get user id 
      let ids = id.id;
      // create an array of all the users 
      let result = [];
      // if we use one user id then it  gets stored inside object 
      if (Array.isArray(id) == false) {
        // get id from params
        let id = req.query.id;
        //get place id 
        let placeId = req.query.placeId
        //update the status of unprocessed to processed
        user = await Ticket.update({
          where:
          {
            place: placeId,
            user: id
          }
        })
          .set({ // setting isProcessed to true
            isProcessed: req.query.isProcessed
          }).fetch()
        return res.status(200).send(user)

      }
      //if we use multiple user then it gets stored in array
      else {
        // using loop because of multiple users
        for (i = 0; i < ids.length; i++) {
          let userId = ids[i];  //get ids one by one in loop

          //update the status of unprocessed to processed
          user = await Ticket.update({ where: ({ user: userId, place: placeId }) }).set({
            isProcessed: req.query.isProcessed
          }).fetch()  // fetching the data
          // use of spread operator to get all user details
          result = [...result, ...user];
        }
        return res.status(200).send(result)
      }

    } catch (error) {
      console.log(error);
      return res.status(500).send({ error: error })
    }
  }

};

