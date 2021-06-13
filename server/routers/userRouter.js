const router = require('express').Router();
const User = require('../models/userModel')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')



router.post('/', async (req, res) => {
    try {
        const { email, password, passwordConfirm } = req.body;

        //VALIDATION
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

        //HASH THE PASSWORD
        const salt = await bcrypt.genSalt()
        const passwordHash = await bcrypt.hash(password, salt)


        //////////        //SAVE A NEW USER ACCOUNT TO THE DB////////////////////////////////////////////

        const newUser = new User({
            email, passwordHash
        });

        const savedUser = await newUser.save()

        //SIGN THE TOKEN////////////////////////////////////////

        const token = jwt.sign({
            user: savedUser._id
        }, process.env.JWT_SECRET)


        console.log(`token ${token}`);


        //SEND THE TOKEN IN A HTTP-ONLY COOKIE

        res.cookie('token', token, {
            httpOnly: true,

        }).send()


    } catch (error) {
        console.error(error);
        res.status(500).send();
    }
})


module.exports = router;
