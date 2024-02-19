/*
*This is my first implementation of using express to talk with database 
*here databases are created using a previously implemeneted program
*aim is to learn more about API's and GET,PUT,POST etc using express
*/

/* 
^ here we will import the datbase code functions and other necessary modules
*/
const { deleteRecord, updateRecord, readTable, createRecord, createTable, databaseCreation } = require("../../2024_02_11/my_database/async_database")
const fs = require('fs')
// for genrating unqiue order id
const uuid = require('uuid');
//for express
const express = require('express');
const { log } = require("util");
const app = express()
const port = 3000
app.use(express.json())

/*
^declaring some constants
*/

const databasePath = '/Users/atharva_zanwar/Desktop/Mean_stack_traning/2024_02_15'
const databaseName = 'Databases';
const Prod_tableName = 'products.json';
const Ord_tableName = 'orders.json';
const orderTablepath = '/Users/atharva_zanwar/Desktop/Mean_stack_traning/2024_02_15/Databases/orders.json'
const productTablepath = '/Users/atharva_zanwar/Desktop/Mean_stack_traning/2024_02_15/Databases/products.json'
/*
^used to create database and tables
*/
//databaseCode.databaseCreation(databasePath,databaseName) 
//databaseCode.createTable(databasePath, databaseName, Ord_tableName) 


function getStatusById(jsonPath, id) {
    // Read the JSON file
    const jsonData = fs.readFileSync(jsonPath, 'utf8');

    // Parse the JSON data into a JavaScript object
    const data = JSON.parse(jsonData);

    // Find the object with the matching id
    const object = data.find(item => item.id === id);

    return object;
}

function getObjectById(jsonPath, id) {
    // Read the JSON file
    const jsonData = fs.readFileSync(jsonPath, 'utf8');

    // Parse the JSON data into a JavaScript object
    const data = JSON.parse(jsonData);

    // Find the object with the matching id
    const object = data.find(item => item.id === id);

    return object;
}

/*
*---------------------------------------- PRODUCT DATABASE APIS ------------------------------------*

/*
^ This is used for first API wherein you can search product details using its name
*/
app.get('/serach', (req, res) => {

    let string_to_search = req.query.search_string
    const data = readTable(databasePath, databaseName, Prod_tableName)

    const filteredData = data.filter(entry => entry.p_name === string_to_search);

    // If you want to copy the filtered data to another JSON variable
    res.json(filteredData)

})

/*
^ This is used for eigth API wherein you can search product details using its id
*/
app.get('/product_id', (req, res) => {

    let id_to_search = req.query.id
    const data = readTable(databasePath, databaseName, Prod_tableName)

    const filteredData = data.filter(entry => entry.id === id_to_search);

    // If you want to copy the filtered data to another JSON variable
    res.json(filteredData)

})


/*
^ This is used for second API wherein you need to update product database
*/
app.put('/checkout', (req, res) => {

    let id_to_update = req.query.id;
    let quant_to_update = parseInt(req.query.quantity); // Convert quantity to a number
    const get_product = getObjectById(productTablepath,id_to_update)
    const updated_quant = (get_product.p_stock - quant_to_update)
    const newData = {
        "p_stock": updated_quant // Subtract quant_to_update from the current p_stock value
    };

    const data = updateRecord(databasePath, databaseName, Prod_tableName, id_to_update, newData)
    
    res.json(data)

    const uniqueId = uuid.v4()

    const record = {
        o_p_id: id_to_update,
        o_id: uniqueId,
        o_name: get_product.p_name,
        o_desc: get_product.p_desc,
        o_quant: quant_to_update,
        o_price: (get_product.p_price*quant_to_update),
        o_status: "Pending",
        o_img: get_product.p_img
    }
    createRecord(databasePath, databaseName, Ord_tableName, record)



})

/*
*------------------------------------ ADD , UPDATE AND DELETE PRODUCTS FROM DATABASE-------------------------------------*
*/


/*
^ This is used for fourth API wherein you need to add product to database
*/
app.post('/product', (req, res) => {
    let id_to_update = req.body.id
    let name_to_update = req.body.p_name
    let price_to_add = req.body.p_price
    let desc_to_add = req.body.p_desc
    let stock_to_add = req.body.p_stock
    // console.log(req.body);
    const record = {
        id: id_to_update,
        p_name: name_to_update,
        p_desc: desc_to_add,
        p_price: price_to_add,
        p_stock: stock_to_add,
        p_img: "NA"
    }
    const data = createRecord(databasePath, databaseName, Prod_tableName, record)

    // If you want to copy the filtered data to another JSON variable
    res.json("Product added succesfully to data base")

})

/* 

^ This is used for fifth API wherein you need to update product to database
*/
app.put('/product', (req, res) => {

    const id_to_update = req.query.id; // Get the id from the request parameters
    const attributesToUpdate = req.query; // Get all query parameters as attributes to update

    // Retrieve existing product data from the database based on its id
    const existingProduct = getObjectById(productTablepath, id_to_update); // You need to implement getProductById function
    console.log(existingProduct);
    if (existingProduct) {
        // Update only the attributes provided in the query parameters
        for (const key in attributesToUpdate) {
            if (key !== 'id') { // Exclude id from being updated
                if (existingProduct.hasOwnProperty(key)) { // Check if the existing product has the attribute
                    existingProduct[key] = attributesToUpdate[key];
                }
            }
        }

        // Update the record in the database with the modified product data
        updateRecord(databasePath, databaseName, Prod_tableName, id_to_update, existingProduct);

        res.json({ success: 'Product updated successfully', updatedProduct: existingProduct });
    } else {
        res.status(404).json({ error: 'Product not found' });
    }

});

/*
^ This is used for sixth API wherein you need to delete product to database
*/
app.delete('/product', (req, res) => {
    let id_to_delete = req.query.id
    const data = deleteRecord(databasePath, databaseName, Prod_tableName, id_to_delete)

    // If you want to copy the filtered data to another JSON variable
    res.json("Product deleted succesfully from database")

})

/*
*----------------------------------- ORDER DATABASE APIS --------------------------------------------*
*/

/*
^ This is used for seventh API wherein you get status of order using Id
*/
app.post('/status', (req, res) => {

    const id_to_update = req.query.id; // Get the id from the request parameters

    // Retrieve existing product data from the database based on its id
    const existingOrder = getStatusById(orderTablepath, id_to_update); // You need to implement getProductById function
    res.json(existingOrder)

});

/*
! NOT COMEPLETE YET
^ This is used for ninth API wherein you get status of order using Id
*/
app.delete('/cancel', (req, res) => {
    const databasePath = '/Users/atharva_zanwar/Desktop/Mean_stack_traning/2024_02_15'
    let id = req.query.id
    const get_order = getStatusById(orderTablepath,id)
    const prod_id = get_order.o_p_id
    const get_product = getObjectById(productTablepath,prod_id)
    get_product.p_stock = get_product.p_stock+get_order.o_quant
    const newData = {
        "p_stock": get_product.p_stock // Subtract quant_to_update from the current p_stock value
    };

    updateRecord(databasePath, databaseName, Prod_tableName, get_product.id, newData)

    const data = deleteRecord(databasePath, databaseName, Ord_tableName,id)
    res.json("Order cancelled succesfully")
});

/*
*------------------------------------------------------------------------------------------------------*
*/




app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})