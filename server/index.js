const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser')

dotenv.config();



////////////////SET UP SERVER/////////////////

const app = express()
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`Server started on port: ${PORT}`);
})

app.get('/', (req, res) => {
    res.send('home')
})

app.use(express.json())
app.use(cookieParser())



//CONNECT TO MONGODB//////////////////////////

mongoose.connect(process.env.MDB_CONNECT, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}, (err => {
    if (err) return console.log(err);
    console.log('connected to mongodb');
}))



///////SET UP ROUTES

app.use('/auth', require('./routers/userRouter'));
app.use('/customer', require('./routers/customerRouter'))