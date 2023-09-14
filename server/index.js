const express = require('express')
const http = require('http')
const cors = require('cors')
const { Server } = require('socket.io')

const port = 8000
const app = express()

app.use(cors())

const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',
        method: ['GET', 'POST']
    }
})


io.on('connection', (socket) => {
    console.log("User connected with id = " + socket.id);

    socket.on("join_room", (data) => {
        socket.join(data)
        console.log("User joined room " + data + " with id = " + socket.id);
    })

    socket.on("send_message", (data) => {
        socket.to(data.room).emit('receive_message', data)
        // console.log("User messaged " + data.message + " with username = " + data.author + " in room " + data.room);
    })

    socket.on('disconnect', () => {
        console.log("User disconnected", socket.id);
    })
})

// server.get('/', (req, res) => {
//     res.send('Hello World!')
// })

server.listen(port, () => {
    console.log('Express app listening on port ' + port)
})