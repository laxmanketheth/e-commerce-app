
const Product = require("../models/Product"); //requiring product model
const { 
    verifyToken, 
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin 
    } = require("./verifyToken");

const router = require("express").Router(); 

//======================CREATE PRODUCT======================//

router.post("/", verifyTokenAndAdmin,  async(req, res) => {
   const  newProduct = new Product(req.body);
   
   try{
    const savedProduct =  await newProduct.save();
    res.status(200).json(savedProduct);

   }catch(err){
        res.status(500).json(err)
   }

});


// //======================UPDATE PRODUCT======================//

router.put("/:id",verifyTokenAndAdmin , async (req, res) =>{
    
     try{
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id, 
            //findByIdAndUpdate is method provided by mongodb to update//
            {
            $set: req.body, // $set is an update operator in Mongodb inside findByIdAndUpdate that 
                            //allows us to specify the fields and values to be updates in a document
        },
         {new:true}
      );
      res.status(200).json(updatedProduct);
     } catch(err){
        res.status(500).json(err);
    }
});

// //=========================DELETE PRODUCT======================//

router.delete("/:id", verifyTokenAndAdmin, async (req,res) => {
    // console.log("yes");
    // console.log(req.params.id);  
    try{
        await Product.findByIdAndDelete(req.params.id)
         //findByIdAndDelete is method provided by mongodb//
        res.status(200).json("Product has been deleted...")
    }catch(err){
        res.status(500).json(err);
    }
});


// //======================GET PRODUCT======================//

router.get("/find/:id", async (req,res) => {
    try{
        const product =  await Product.findById(req.params.id)
         //findByIdAndDelete is method provided by mongodb//  
        res.status(200).json(product)

    }catch(err){
        res.status(500).json(err);
    }
});


// //======================GET ALL PRODUCTS======================//

router.get("/", async (req,res) => {
    const qNew = req.query.new;
    const qCategory = req.query.category;
    try{
        let products ;
    
        if (qNew) {
           products =  await Product.find().sort({ createdAt: -1 }).limit(1);
      
        } else if (qCategory) {
           products =  await Product.find({
            categories:{
                $in: [qCategory],
            },
        });
        }else {
            products = await Product.find();
        }
        
        res.status(200).json(products)
    }catch(err){
        res.status(500).json(err);
    }
});


module.exports = router







