const express = require('express')
const cors = require('cors')
const app = express()
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());


app.get('/', (req, res) => {
    res.json({ message: 'Ocean Shop API' });
})

// Mock data với id cố định
let products = [
    {
        id: 1,
        name: "iPhone 15",
        price: 999,
        category: "Electronics",
        stock: 50
    },
    {
        id: 2,
        name: "Samsung Galaxy S24",
        price: 899,
        category: "Electronics",
        stock: 30
    },
    {
        id: 3,
        name: "MacBook Pro",
        price: 1999,
        category: "Computers",
        stock: 20
    }
];

// GET all products
app.get("/api/products", (req, res) => {
    res.json({
        success: true,
        data: products,
        total: products.length
    });
})

// GET product by ID
app.get("/api/products/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const product = products.find(p => p.id === id);

    if (!product) {
        return res.status(404).json({
            success: false,
            message: "Product not found"
        });
    }

    res.json({
        success: true,
        data: product
    });
})

// POST create new product
app.post("/api/products", (req, res) => {
    const { name, price, category, stock } = req.body;

    if (!name || !price || !category) {
        return res.status(400).json({
            success: false,
            message: "Missing required fields"
        });
    }

    const newProduct = {
        id: Math.max(...products.map(p => p.id)) + 1,
        name,
        price: parseFloat(price),
        category,
        stock: stock || 0
    };

    products.push(newProduct);

    res.status(201).json({
        success: true,
        message: "Product created successfully",
        data: newProduct
    });
})

// PUT update product
app.put("/api/products/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const productIndex = products.findIndex(p => p.id === id);

    if (productIndex === -1) {
        return res.status(404).json({
            success: false,
            message: "Product not found"
        });
    }

    const { name, price, category, stock } = req.body;

    products[productIndex] = {
        ...products[productIndex],
        ...(name && { name }),
        ...(price && { price: parseFloat(price) }),
        ...(category && { category }),
        ...(stock !== undefined && { stock })
    };

    res.json({
        success: true,
        message: "Product updated successfully",
        data: products[productIndex]
    });
})

// DELETE product
app.delete("/api/products/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const productIndex = products.findIndex(p => p.id === id);

    if (productIndex === -1) {
        return res.status(404).json({
            success: false,
            message: "Product not found"
        });
    }

    const deletedProduct = products.splice(productIndex, 1)[0];

    res.json({
        success: true,
        message: "Product deleted successfully",
        data: deletedProduct
    });
})

app.listen(PORT, () => {
    console.log(`Example app listening on PORT http://localhost:${PORT}`)
})

