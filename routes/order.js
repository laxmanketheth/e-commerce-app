const Order = require("../models/Order"); //requiring product model
const {
    verifyToken,
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin
} = require("./verifyToken");

const router = require("express").Router();

//======================CREATE ORDER======================//

router.post("/", verifyToken, async (req, res) => {
    const newOrder = new Order(req.body);

    try {
        const savedOrder = await newOrder.save();
        res.status(200).json(savedOrder);

    } catch (err) {
        res.status(500).json(err)
    }

});


//======================UPDATE ORDER======================//

router.put("/:id", verifyTokenAndAdmin, async (req, res) => {

    try {
        const updatedOrder = await newOrder.findByIdAndUpdate(
            req.params.id,
            //findByIdAndUpdate is method provided by mongodb to update//
            {
                $set: req.body, // $set is an update operator in Mongodb inside findByIdAndUpdate that 
                //allows us to specify the fields and values to be updates in a document
            },
            { new: true }
        );
        res.status(200).json(updatedOrder);
    } catch (err) {
        res.status(500).json(err);
    }
});


//=========================DELETE ORDER======================//

router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        await Order.findByIdAndDelete(req.params.id)
        //findByIdAndDelete is method provided by mongodb//
        res.status(200).json("Order has been deleted...")
    } catch (err) {
        res.status(500).json(err);
    }
});


//======================GET USER ORDERS======================//

router.get("/find/:userId", verifyTokenAndAuthorization, async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.params.userId })
        //findByIdAndDelete is method provided by mongodb//  
        res.status(200).json(orders)

    } catch (err) {
        res.status(500).json(err);
    }
});


//======================GET ALL ORDERS======================//

router.get("/", verifyTokenAndAdmin, async (req, res) => {
    try {
        const orders = await Order.find();
        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json(err);
    }
});


//======================GET MONTHLY INCOME======================//

router.get("/income", verifyTokenAndAdmin, async (req, res) => {
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
    const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

    try {
        const income = await Order.aggregate([
            { $match: { createdAt: { $gte: previousMonth } } },
            {
                $project: {
                    month: { $month: "$createdAt" },
                    sales: "$amount",
                }
            },
            {
                $group: {
                    _id: "$month",
                    total: { $sum: "$sales" }
                }
            }
        ]);
        res.status(200).json(income);
        
    } catch (err) {
        res.status(500).json(err)
    };
})

module.exports = router;




