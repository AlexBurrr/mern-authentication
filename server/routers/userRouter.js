const router = require('express').Router();
const User = require('../models/userModel')




router.post('/', async (req, res) => {
    try {
        const { email, password, passwordConfirm } = req.body;

        //validation
        if (!email || !password || !passwordConfirm)
            return res
                .status(400)
                .json({ errorMessage: 'please enter all required fields.' });
        if (password.length < 6)
            return res
                .status(400)
                .json({ errorMessage: 'please enter password of at least 6 characters' });
        if (passwordConfirm !== password)
            return res
                .status(400)
                .json({ errorMessage: 'passwords do not match' });


        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res
                .status(400)
                .json({ errorMessage: 'an account with this email already exists' });
        }

    } catch (error) {
        console.error(error);
        res.status(500).send();
    }
})


module.exports = router;
