exports.validate = async ({ user }, res) => {

    try {

        res.status(200).json({ user });

    } catch (error) {

        res.status(500).json({ error: 'Internal Server Error' });
    }

};
