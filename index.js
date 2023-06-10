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
        const instructorCollection = client.db("CosMake").collection('instructors');
        const usersCollection = client.db("CosMake").collection('users');




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




        // //get specific user cart product
        // app.get('/users', async (req, res) => {
        //     const email = req.query.email;
        //     console.log(email);
        //     if (!email) {
        //         res.send([]);
        //     }
        //     //find multiple document
        //     const query = { email: email };
        //     const result = await usersCollection.find(query).toArray();
        //     res.send(result);
        // })


        // //get specific user cart product
        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            console.log(email);
        
                if (!email) {
                    res.send([]);
                }
                //find multiple document
                const query = { email: email };
                const result = await usersCollection.find(query).toArray();
                res.send(result);
            
        })


 







//----------------------------------class user related api----------------------
        //classes related api
        app.get('/classes', async (req, res) => {
            const result = await classesCollection.find().toArray();
            res.send(result);
        })

        //add a class
        app.post('/classes',async(req,res)=>{
            const newClass=req.body;
            console.log(newClass);
            const result = await classesCollection.insertOne(newClass);
            res.send(result);
        })


        app.get('/classes/email', async (req, res) => {
            const email = req.query.email;
            console.log(email);
            if (!email) {
                res.send([]);
            }
                //find multiple document
                const query = { email: email };
                const result = await classesCollection.find(query).toArray();
                res.send(result);       
        })


        //status update
        app.put('/classes/:id', async (req, res) => {
            const id = req.params.id;
            const newStatus=req.body;
            // console.log(newStatus,id);
            const filter={_id:new ObjectId(id)}//get specific data
            const options={upsert:true}//if data exist

            //set data
            const updatedData={
                $set:{
                    status:newStatus.statusNew
                }
                }
                const result=await classesCollection.updateOne(filter,updatedData,options)
                res.send(result);    

        })

        //feedback update classes field
        app.put('/classes/feedback/:id', async (req, res) => {
            const id = req.params.id;
            const newStatus=req.body;
            // console.log(newStatus,id);
            const filter={_id:new ObjectId(id)}//get specific data
            const options={upsert:true}//if data exist

            //set data
            const updatedData={
                $set:{
                    feedback:newStatus.feedback
                }
                }
                const result=await classesCollection.updateOne(filter,updatedData,options)
                res.send(result);    

        })


 



//----------------------------------class   related api----------------------





        //instructor related api

        app.get('/instructors', async (req, res) => {
            const result = await instructorCollection.find().toArray();
            res.send(result);
        })



        
//----------------------------------manage user related api----------------------
         //update user role using patch
        app.patch('/users/admin/:id', async (req, res) => {
           const id=req.params.id;
        //    console.log(id);
           const filter={_id: new ObjectId(id)};
           const updateUser={
            $set:{
                role:'admin'
            }
           }
        const result=await  usersCollection.updateOne(filter,updateUser);
        res.send(result);  
        })

         //update user role using patch
        app.patch('/users/instructor/:id', async (req, res) => {
           const id=req.params.id;
        //    console.log(id);
           const filter={_id: new ObjectId(id)};
           const updateUser={
            $set:{
                role:'instructor'
            }
           }
        const result=await  usersCollection.updateOne(filter,updateUser);
        res.send(result);  
        })


               
        


//----------------------------------manage user related api   end----------------------





        //...........end code ................





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


