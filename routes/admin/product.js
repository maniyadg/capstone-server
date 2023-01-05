var express = require("express");
var router = express.Router();
const { connectDb, closeconnection } = require("../../config");
const mongodb = require("mongodb");
const { authorize } = require("../../library/authenticate");


// create method
router.post(
    "/product",authorize,
    async (req, res) => {
        // db connection
        try {
            const db = await connectDb();
            const product = await db.collection("products").insertOne(req.body);
            await closeconnection();
            res.json({ message: "product created", id: product.insertedId });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "something went wrong" });
        }
    }
);

router.get("/products", async (req, res) => {
    try {
        const db = await connectDb();
        const product = await db.collection("products").find({}).toArray();
        await closeconnection();
        res.json(product);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "something went wrong" });
    }
});

router.put("/product/:productId", authorize, async (req, res) => {
    try {
        const db = await connectDb();
        const productdata = await db
            .collection("products")
            .findOne({ _id: mongodb.ObjectId(req.params.productId) });
        if (productdata) {
            delete req.body._id;
            const product = await db
                .collection("products")
                .updateOne(
                    { _id: mongodb.ObjectId(req.params.productId) },
                    { $set: req.body }
                );
            res.json({ message: "updated successfully", product });
        } else {
            res.status(404).json({ message: "product not found" });
        }
        await closeconnection();
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "something went wrong" });
    }
});

router.get("/product/:productId", authorize, async (req, res) => {
    try {
        const db = await connectDb();
        const product = await db
            .collection("products")
            .findOne(
                { _id: mongodb.ObjectId(req.params.productId) },
                { $set: req.body }
            );
            await closeconnection();
            res.json(product);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "something went wrong" });
    }
});

router.delete("/product/:productId", authorize, async (req, res) => {
    try {
        const db = await connectDb();
        const product = await db
            .collection("products")
            .deleteOne({ _id: mongodb.ObjectId(req.params.productId) });
            await closeconnection();
            res.json({ message: "Deleted" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "something went wrong" });
    }
});

module.exports = router;
