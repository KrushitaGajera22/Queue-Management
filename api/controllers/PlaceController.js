/**
 * PlaceController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const Constants = sails.config.constants;

module.exports = {
    // for creating new places
    createPlace: async (req, res) => {
        try {
            await Place.create({
                id: Constants.uuid.v4(),  // generating unique id using uuid
                Name: req.body.Name,
                ticketSeries: req.body.ticketSeries
            });
            res.status(201).send({ message: 'New Place Added!' });
        } catch (error) {
            console.log(error);
            return res.status(500).send({ error: error });
        }
    },

    // list of places
    listPlace: async (req, res) => {
        try {
            // list places using find method
            await Place.find({})
            .select(['Name', 'ticketSeries'])
                .populate('tickets', {
                    where: { isProcessed: 'false'},
                    select: ['id']
                }
                )
                .then((places) => {
                    places.forEach((place) => {
                        place.ticketsLength = place.tickets.length;
                    })
                    return res.status(200).send({ places })
                })
        } catch (error) {
            console.log(error);
            return res.status(500).send({ error: error })
        }
    },

    // show specific place using id
    showPlace: async (req, res) => {
        try {
            // show specific id using findOne method
            await Place.findOne({ id: req.params.id })
                .populate('tickets',{ select: ['ticketNumber', 'isProcessed', 'user']})
                .then((place) => {
                    if (!place) {
                        return res.status(404).send({ message: 'Place not found' });
                    }
                    place.ticketsLength = place.tickets.length;
                    return res.status(200).send({ place })
                })
        } catch (error) {
            console.log(error);
            return res.status(500).send({ error: error })
        }
    },

    // for updating the place 
    updatePlace: async (req, res) => {
        try {
            // find if id is present
            let id = await Place.findOne({ id: req.params.id })
            if (!id) {
                return res.status(404).send({ message: 'Place not found' });
            }
            else {
                // update name using id of specific place
                let place = await Place.updateOne({ id: req.params.id }, { Name: req.body.Name })
                res.status(200).send({ message: 'Place Updated' , place })
            }
        } catch (error) {
            console.log(error);
            return res.status(500).send({ error: error });
        }
    },

    // for deleting any place 
    deletePlace: async (req, res) => {
        try {
            // find if id is present
            let id = await Place.findOne({ id: req.params.id })
            if (!id) {
                return res.status(404).send({ message: 'Place not found' });
            }
            else {
                // delete place using its id
                await Place.destroyOne({ id: req.params.id })
                res.status(200).send({ message: 'Place Deleted' })
            }
        } catch (error) {
            console.log(error);
            return res.status(500).send({ error: error });
        }
    }

};

