const express = require('express')
const app = express()

//mongodb
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

//dotenv
require('dotenv').config()







const cors = require('cors');
const port = process.env.PORT || 5000;


//middleware
app.use(cors())
app.use(express.json())





//---------------------DB Start--------------------------------------




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.843endu.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        //....................code start...................

        //all collection
        const classesCollection = client.db("CosMake").collection('classes');
       




        //create a user
        app.post('/users', async (req, res) => {
            const user = req.body;
            const query = { email: user.email };
            const existingUser = await usersCollection.findOne(query);
            if (existingUser) {
                return res.send({ message: 'User already Exist' });
            }
            const result = await usersCollection.insertOne(user);
            res.send(result);
        })

                //get all user
                app.get('/users', async (req, res) => {
                    const result = await usersCollection.find().toArray();
                    res.send(result);
                })




     


        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);









































//-------------------------------------------------------------





app.get('/', (req, res) => {
    res.send('CosMake is running')
})

app.listen(port, () => {
    console.log(`Running at port is ${port}`);
})


