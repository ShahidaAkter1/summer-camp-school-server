const express = require('express')
const app = express()

//mongodb
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

//dotenv
require('dotenv').config()



const stripe = require("stripe")(process.env.PAYMENT_SECRET_KEY);




const cors = require('cors');
const port = process.env.PORT || 5000;


//middleware
app.use(cors())
app.use(express.json())



// //verify jwt token
// const verifyJWT=(req,res,next)=>{
//     const authorization=req.headers.authorization;//user comes or not properly

//     //if not come authorization header
//     if(!authorization){
//         //return with status and error message
//         return res.status(401).send({error:true,message:'unauthorized access'});
//     }

//     //if come then get the token using split
//     //bearer token
//     const token=authorization.split(' ')[1];

//     //then verify the token
//     jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,decoded)=>{
//         if(err){
//             return res.status(401).send({error:true,message:'unauthorized access'});
//         }
//         req.decoded=decoded;
//         next();
//     })
// }






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
        const cartsCollection = client.db("CosMake").collection('carts');
        const paymentCollection = client.db("CosMake").collection('payments');




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
        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            // console.log(email);
        
                if (!email) {
                    res.send([]);
                }
                //find multiple document
                const query = { email: email };
                const result = await usersCollection.find(query).toArray();
                res.send(result);
            
        })


 
//----------------------------------cart related api----------------------

        // add to cart collection
        app.post('/carts', async (req, res) => {
            const addClass = req.body;
            //  console.log(addClass);

             const query = { classId: addClass.classId,studentEmail:addClass.studentEmail };
             const existingClass = await cartsCollection.findOne(query);
             if (existingClass) {
                 return res.send({ message: 'Class already Exist' });
             }
            const result = await cartsCollection.insertOne(addClass);
            res.send(result);
        })

            //get specific user selected classes 
            app.get('/carts', async (req, res) => {
                const email = req.query.email;
                // console.log( 'from cart ',email);

                if (!email) {
                    res.send([]);
                }
                    //find multiple document
                    const query = { 
                        studentEmail: email
                     };
                    const result = await cartsCollection.find(query).toArray();
                    res.send(result);
              
            })


         //delete specific user cart product
        app.delete('/carts/:id', async (req, res) => {
            const deletedId = req.params.id;
            const query = { _id: new ObjectId(deletedId) };
            const result = await cartsCollection.deleteOne(query);
            res.send(result);
        })



//---------------------------------- cart related api----------------------






//----------------------------------class user related api----------------------
        //classes related api
        app.get('/classes', async (req, res) => {
            const result = await classesCollection.find().toArray();
            res.send(result);
        })

        //add a class
        app.post('/classes',async(req,res)=>{
            const newClass=req.body;
            // console.log(newClass);
            const result = await classesCollection.insertOne(newClass);
            res.send(result);
        })


        app.get('/classes/email', async (req, res) => {
            const email = req.query.email;
            // console.log(email);
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


                //delete specific user from dashboard
                app.delete('/users/admin/:id', async (req, res) => {
                    const deletedId = req.params.id;
                    const query = { _id: new ObjectId(deletedId) };
                    const result = await usersCollection.deleteOne(query);
                    res.send(result);
                })
        


//----------------------------------manage user related api   end----------------------




//-------------------payment-----------
//payment api
        //create payment intent
        app.post('/create-payment-intent',async(req,res)=>{
            const data=req.body;
            console.log('data',data);
            const total=data.total;
            // const {total}=req.body;
            // console.log('price is ',price);
            const amount=total*100;
            console.log(amount);
            const paymentIntent = await stripe.paymentIntents.create({
                amount: amount,
                currency: "usd",
                payment_method_types:['card']
            });
            res.send({
                clientSecret:paymentIntent.client_secret,
            })
        })


        //post payment info
        app.post('/payments',async(req,res)=>{
            const payment=req.body;
            const insertResult=await paymentCollection.insertOne(payment);

            //delete cart class
            const query={_id:{$in : payment.cartClasses.map(id=>new ObjectId (id))}}
            const deleteResult=await cartsCollection.deleteMany(query);
            res.send({insertResult,deleteResult});
        })

        //get payment information
        app.get('/payments/email', async (req, res) => {
            const email = req.query.email;
            // console.log(email);
            if (!email) {
                res.send([]);
            }
                //find multiple document
                const options={
                    sort:{'date':1}
                }
                const query = { email: email };
                const result = await paymentCollection.find(query,options).toArray();
                res.send(result);       
        })




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


