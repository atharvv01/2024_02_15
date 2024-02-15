const productIndex = productsData.findIndex((p) => p.productId === parseInt(checkoutid, 10));

  if (productIndex !== -1) {
    // Update the stock of the product with the given id
    productsData[productIndex].stock -= parseInt(checkoutquantity, 10);

    // Write the updated data back to the external JSON file
    fs.writeFileSync('products.json', JSON.stringify(productsData, null, 2), 'utf8');

    res.json({ success: 'Stock updated successfully', updatedProduct: productsData[productIndex] });