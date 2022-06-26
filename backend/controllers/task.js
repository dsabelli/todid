const router = require("express").Router();
const User = require("../models/user");
const Task = require("../models/task");

router.get("/", async (request, response) => {
  const tasks = await Task.find({});
  response.json(tasks);
});

router.post("/", async (request, response) => {
  if (!request.user) {
    return response.status(401).json({ error: "token missing or invalid" });
  }

  const user = request.user;
  const task = new Task({
    ...request.body,
    user: user.id,
  });

  const savedTask = await task.save();

  user.tasks = user.tasks.concat(savedTask._id);
  await user.save();

  response.status(201).json(savedTask);
});

router.delete("/:id", async (request, response) => {
  const taskToDelete = await Task.findById(request.params.id);
  if (!taskToDelete) {
    return response.status(204).end();
  }

  if (taskToDelete.user && taskToDelete.user.toString() !== request.user.id) {
    return response.status(401).json({
      error: "only the creator can delete a task",
    });
  }

  await Task.findByIdAndRemove(request.params.id);

  response.status(204).end();
});

router.put("/:id", async (request, response) => {
  const task = request.body;

  const updatedTask = await Task.findByIdAndUpdate(request.params.id, task, {
    new: true,
    runValidators: true,
    context: "query",
  });

  response.json(updatedTask);
});

module.exports = router;