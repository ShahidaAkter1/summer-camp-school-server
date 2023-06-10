const express = require('express')
const app = express()


//dotenv
require('dotenv').config()







const cors = require('cors');
const port = process.env.PORT || 5000;


//middleware
app.use(cors())
app.use(express.json())




//-------------------------------------------------------------





app.get('/', (req, res) => {
    res.send('CosMake is running')
})

app.listen(port, () => {
    console.log(`Running at port is ${port}`);
})


