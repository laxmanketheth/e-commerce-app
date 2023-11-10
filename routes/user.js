const User = require("../models/User");
const { 
    verifyToken, 
    verifyTokenAndAuthorization, 
    verifyTokenAndAdmin
 } = require("./verifyToken");

const router = require("express").Router(); 

//======================UPDATE======================//

router.put("/:id",verifyTokenAndAuthorization , async (req, res) =>{
     if (req.body.password){
        req.body.password = await bcrypt.hash(req.body.password, 10)
     }

     try{
        const updatedUser = await User.findByIdAndUpdate(req.params.id, 
            //findByIdAndUpdate is method provided by mongodb to update//
            {
            $set: req.body, 
        },
        {new:true}
      );
      res.status(200).json(updatedUser);
     } catch(err){
        res.status(500).json(err);
    }
});

//=========================DELETE======================//

router.delete("/:id", verifyTokenAndAuthorization, async (req,res) => {
    try{
        await User.findByIdAndDelete(req.params.id)
         //findByIdAndDelete is method provided by mongodb//
        res.status(200).json("User has been deleted...")
    }catch(err){
        res.status(500).json(err);
    }
});


//======================GET USER======================//

router.get("/find/:id", verifyTokenAndAdmin, async (req,res) => {
    try{
        const user =  await User.findById(req.params.id)
         //findByIdAndDelete is method provided by mongodb//
          
         const {password, ...others} = user._doc;
        //destructuring the user object and returning everything except password
         //in line above we are using "user._doc" because mongodb stores our document inside "_doc"

        res.status(200).json(others)
    }catch(err){
        res.status(500).json(err);
    }
});


//======================GET ALL USER======================//

router.get("/", verifyTokenAndAdmin, async (req,res) => {
    const query = req.query.new
    try{
        const users = query 
        ? await User.find().sort({ _id: -1 }).limit(5) //The negative value -1 indicates 
                                                    //that the sorting order should be from highest to lowest
        : await User.find()
         //find & limit is method provided by mongodb//
        //if there is a query then it will return us first 5 users bcoz we have put a limit of 5//
  
        res.status(200).json(users)
    }catch(err){
        res.status(500).json(err);
    }
});


//======================GET USER STATS======================//

//we are gettting users that registered with our app in one last year//
router.get("/stats", verifyTokenAndAdmin, async (req, res) => {
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() -1))
    //above live is going to return us last year's todays day//

    try{
        const data = await User.aggregate([
            {$match: {createdAt: { $gte: lastYear } } },
            {
                $project: {
                    month: { $month: "$createdAt"},
                }
            },
            {
                $group: {
                    _id: "$month",
                    total: {$sum: 1}
                }
            }
        ]);
        res.status(200).json(data);

    } catch(err){
        res.status(500).json(err);
    }
})

module.exports = router;




