const express = require("express");
const {
  getAllTodos,
  postTodo,
  getTodoById,
  updateATodo,
  removeATodo
} = require("../controllers");

// Importamos el fichero con los datos que necesita nuestro Router

/*
Un Router de express es como un switch case de Javascript. Simplemente redirige las peticiones hacia la ruta 
correcta, si esta existe.

En una aplicacion de express podemos tener tantos Routers como queramos/sean necesarios. Lo habitual cuando 
se implementa una API REST es tener un Router por cada "recurso" de la api. Si imaginamos una aplicacion que 
tiene 3 recursos (User, Todo, Category), deberiamos tener 3 routers diferentes: userRouter, todoRouter y 
categoryRouter.
*/

const todoRouter = express.Router();

//^ GET all todo
todoRouter.get("/todo", getAllTodos);

//// POST a new todo
todoRouter.post("/todo", postTodo);

//^ GET a task with ID
todoRouter.get("/todo/:id", getTodoById);

//> UPDATE a todo
todoRouter.patch("/todo/:id", updateATodo);

//! DELETE a todo
todoRouter.delete("/todo/:id", removeATodo);

// Exportamos el router para poder 'usarlo' en nuestra app.
module.exports = todoRouter;
