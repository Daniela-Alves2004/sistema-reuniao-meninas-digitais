const Location = require('../models/Location');
const Meeting = require('../models/Meeting'); 

exports.getLocationByMeeting = async (req, res) => {
  
  const { meetingId } = req.query;

  try {

    const meeting = await Meeting.findOne({

      where: { id: meetingId },

      include: [{

        model: Location,

        as: 'location', 

      }],

    });

    if (!meeting) {

      return res.status(404).json({ error: 'Meeting not found' });

    }

    res.status(200).json({ location: meeting.location });

  } catch (error) {

    console.error('Error fetching location:', error);

    res.status(400).json({ error: error.message });

  }

};
