const express = require("express");
const uuid = require("uuid");
const cors = require("cors");
const app = express()
app.use(express.json())
app.use(cors())


app.listen(8080)

const orders = []

const checkOrderId = (request, response, next) => {
    const { id } = request.params
    const index = orders.findIndex(order => order.id === id)
    if (index < 0) {
        return response.status(404).json({ error: "User not found" })
    }

    request.userIndex =index;
    request.userId = id;

    next()
}  

const method = (request, response, next) => {
 console.log(`method: ${request.method}, url: ${request.url}`)

 next()
}


app.get("/order", method, (request, response) => {

    return response.json(orders)
})



app.post("/order",method, (request, response) => {

    const { lista, clienteName, price, status } = request.body
    const order = { id: uuid.v4(), lista, clienteName, price, status }

    orders.push(order)


    return response.json(order)
})


app.put("/order/:id", checkOrderId,method, (request, response) => {
    const { lista, clienteName, price, status } = request.body
    const index = request.userIndex
    const id = request.userId

    const updateOrder = { id, lista, clienteName, price, status }

    orders[index] = updateOrder
    return response.json(updateOrder)
})


app.delete("/order/:id", checkOrderId,method, (request, response) => {
    const index = request.userIndex

    orders.splice(index, 1)
    return response.status(200).json(orders)
})

app.get("/order/:id", checkOrderId,method, (request, response) => {
    const index = request.userIndex

    const newOrder = orders[index]
    return response.json(newOrder)

})

app.patch("/order/:id", checkOrderId,method, (request, response) => {
    const index = request.userIndex
    orders[index].status = "Pronto"

    return response.json(orders)

})
