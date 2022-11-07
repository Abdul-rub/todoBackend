const { Router } = require("express");
const authenticate = require("../Middlewares/authentication")
const TodosModel = require("../Models/Todo.modle");

const todos = Router();

//GET TODOS
todos.get("/", authenticate, async (req, res) => {
	const { userId } = req.body;
	try {
		let allTodos = await TodosModel.find({ userId });
		res.json({ data: allTodos })
	}
	catch (err) { res.status(404).send({ msg: "please login again" }) }
})

//POST TODOS
todos.post("/create", authenticate, async (req, res) => {
	const new_note = new TodosModel(req.body);
	console.log(new_note)
	await new_note.save()

	res.send({msg:"new todo added successfully"})
})


//PATCH TODOS
todos.patch("/:todoId", authenticate, async (req, res) => {
	const todoId = req.params.todoId;
	const { userId } = req.body;
	await TodosModel.updateOne({ _id: todoId, userId }, { $set: req.body })
	res.send({ msg: `todo with id ${todoId} has been updated` })
})



//DELETE TODOS
todos.delete("/:todoId", authenticate, async (req, res) => {
	const todoId = req.params.todoId;
	const { userId } = req.body;

	await TodosModel.deleteOne({ _id: todoId, userId })
	res.send({msg:`the note of UserId ${userId} and note with ID ${todoId} has been deleted`})
})

module.exports = todos