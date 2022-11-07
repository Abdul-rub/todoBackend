const mongoose = require("mongoose")

const todoSchema = new mongoose.Schema({
    taskname:String,
    status:Boolean,
    tag:String,
    userId: String,
})

const TodoModel = mongoose.model("todo",todoSchema)

module.exports= TodoModel;