const Location = require('../models/Location');
const Meeting = require('../models/Meeting'); 

exports.getLocationByMeeting = async (req, res) => {
  const { meetingId } = req.query;

  try {
    // Find the meeting by ID and include the associated location
    const meeting = await Meeting.findOne({
      where: { id: meetingId },
      include: [{
        model: Location,
        as: 'location', // Alias used in the association
      }],
    });

    if (!meeting) {
      return res.status(404).json({ error: 'Meeting not found' });
    }

    res.status(200).json({ location: meeting.location }); // Send the location data
  } catch (error) {
    console.error('Error fetching location:', error);
    res.status(400).json({ error: error.message });
  }
};
