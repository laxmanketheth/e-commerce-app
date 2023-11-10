const Cart = require("../models/Cart"); //requiring product model
const { 
    verifyToken, 
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin 
    } = require("./verifyToken");

const router = require("express").Router(); 

//======================CREATE CART======================//

router.post("/", verifyToken,  async(req, res) => {
   const  newCart = new Cart(req.body);
   
   try{
    const savedCart =  await newCart.save();
    res.status(200).json(savedCart);

   }catch(err){
        res.status(500).json(err)
   }

});


//======================UPDATE CART======================//

router.put("/:id",verifyTokenAndAuthorization , async (req, res) =>{
    
     try{
        const updatedCart = await newCart.findByIdAndUpdate(
            req.params.id, 
            //findByIdAndUpdate is method provided by mongodb to update//
            {
            $set: req.body, // $set is an update operator in Mongodb inside findByIdAndUpdate that 
                            //allows us to specify the fields and values to be updates in a document
        },
         {new:true}
      );
      res.status(200).json(updatedCart);
     } catch(err){
        res.status(500).json(err);
    }
});


//=========================DELETE CART======================//

router.delete("/:id", verifyTokenAndAuthorization, async (req,res) => {
    try{
        await Cart.findByIdAndDelete(req.params.id)
         //findByIdAndDelete is method provided by mongodb//
        res.status(200).json("Cart has been deleted...")
    }catch(err){
        res.status(500).json(err);
    }
});


//======================GET USER CART======================//

router.get("/find/:userId", verifyTokenAndAuthorization, async (req,res) => {
    try{
        const cart =  await Cart.findOne({userId: req.params.userId})
        
         //findByIdAndDelete is method provided by mongodb//  
        res.status(200).json(cart)
        // console.log(cart);

    }catch(err){
        res.status(500).json(err);
    }
});


// // //======================GET ALL======================//

router.get("/", verifyTokenAndAdmin, async (req, res) => {
    try{
        const carts = await Cart.find();
       
        res.status(200).json(carts);
        // console.log(carts);
    }catch(err){
        res.status(500).json(err);
    }
});

module.exports = router;