/**
 * PlaceController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const Constants = sails.config.constants;
const ResponseCodes = Constants.ResponseCodes;

module.exports = {
  // for creating new places
  createPlace: async (req, res) => {
    try {
      await Place.create({
        id: Constants.uuid.v4(), // generating unique id using uuid
        Name: req.body.Name,
        ticketSeries: req.body.ticketSeries,
      })
        .then(() => {
          return res.status(ResponseCodes.CREATED).send({
            status: ResponseCodes.CREATED,
            message: req.i18n.__("NEW_PLACE"),
          });
        })
        .catch({ code: "E_UNIQUE" }, (err) => {
          return res.status(ResponseCodes.CONFLICT).send({
            status: ResponseCodes.CONFLICT,
            message: req.i18n.__("ALREADY_IN_USE"),
          });
        });
    } catch (error) {
      console.log(error);
      return res.serverError({
        status: ResponseCodes.SERVER_ERROR,
        error: req.i18n.__("WENT_WRONG"),
      });
    }
  },

  // list of places
  listPlace: async (req, res) => {
    try {
      // list places using find method
      await Place.find({})
        .select(["Name", "ticketSeries"])
        .populate("tickets", {
          where: { isProcessed: "false" },
          select: ["id"],
        })
        .then((places) => {
          places.forEach((place) => {
            place.ticketsLength = place.tickets.length;
          });
          return res.status(ResponseCodes.OK).send({
            status: ResponseCodes.OK,
            data: places,
          });
        });
    } catch (error) {
      console.log(error);
      return res.serverError({
        status: ResponseCodes.SERVER_ERROR,
        error: req.i18n.__("WENT_WRONG"),
      });
    }
  },

  // show specific place using id
  showPlace: async (req, res) => {
    try {
      // show specific id using findOne method
      await Place.findOne({ id: req.params.id })
        .populate("tickets", {
          select: ["ticketNumber", "isProcessed", "user"],
        })
        .then((place) => {
          if (!place) {
            return res.status(ResponseCodes.NOT_FOUND).send({
              status: ResponseCodes.NOT_FOUND,
              message: req.i18n.__("PLACE_NOT"),
            });
          }
          place.ticketsLength = place.tickets.length;
          return res.ok({
            status: ResponseCodes.OK,
            data: place,
          });
        });
    } catch (error) {
      console.log(error);
      return res.serverError({
        status: ResponseCodes.SERVER_ERROR,
        error: req.i18n.__("WENT_WRONG"),
      });
    }
  },

  // for updating the place
  updatePlace: async (req, res) => {
    try {
      // find if id is present
      let id = await Place.findOne({ id: req.params.id });
      if (!id) {
        return res.status(ResponseCodes.NOT_FOUND).send({
          status: ResponseCodes.NOT_FOUND,
          message: req.i18n.__("PLACE_NOT"),
        });
      } else {
        // update name using id of specific place
        let place = await Place.updateOne(
          { id: req.params.id },
          { Name: req.body.Name }
        );
        return res.ok({
          status: ResponseCodes.OK,
          message: req.i18n.__("PLACE_UPDATE"),
          data: place,
        });
      }
    } catch (error) {
      console.log(error);
      return res.serverError({
        status: ResponseCodes.SERVER_ERROR,
        error: req.i18n.__("WENT_WRONG"),
      });
    }
  },

  // for deleting any place
  deletePlace: async (req, res) => {
    try {
      // find if id is present
      let id = await Place.findOne({ id: req.params.id });
      if (!id) {
        return res.status(ResponseCodes.NOT_FOUND).send({
          status: ResponseCodes.NOT_FOUND,
          message: req.i18n.__("PLACE_NOT"),
        });
      } else {
        // delete place using its id
        await Place.destroyOne({ id: req.params.id });
        return res.ok({
          status: ResponseCodes.OK,
          message: req.i18n.__("PLACE_DELETE"),
        });
      }
    } catch (error) {
      console.log(error);
      return res.serverError({
        status: ResponseCodes.SERVER_ERROR,
        error: req.i18n.__("WENT_WRONG"),
      });
    }
  },
};
