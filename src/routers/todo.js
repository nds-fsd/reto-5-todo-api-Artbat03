const express = require("express");

// Importamos el fichero con los datos que necesita nuestro Router
const { todos } = require("../data/data");

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
todoRouter.get("/todo", (req, res) => {
  // Devolver todos los "todos" que hay en el array con formato JSON.
  res.json(todos);
});

//// POST a new todo
todoRouter.post("/todo", (req, res) => {
  /*
  Crear un nuevo objeto con estructura {id, text, fecha, done} con los datos que vienen en el BODY de la
  Request y meterlos dentro de el array.
  El nuevo objeto debe tener como id un numero mas que el numero actual de elementos guardados en el array.
  */

  //! REVISAR ESTO
  const setId = () => {
    let newId = 0;
    todos.forEach((todo, i) => {
      if (!todos.includes(newId)) {
        console.log(`task: ${(todo, todo.id)} index: ${i}`);
        newId++;
        return newId;
      }
    });
    return newId;
  };
  //! HASTA AQUÍ

  const newTodo = {
    id: setId(),
    text: req.body.text,
    fecha: req.body.fecha || new Date(),
    done: req.body.done || false
  };

  todos.push(newTodo);
  res.status(201).json(todos);
});

//^ GET a task with ID
//^ En este endpoint, el path contiene una variable llamada id. La syntaxis que utiliza express para estos casos
//^ es el simbolo :

//^ Una variable en un path, significa que express recoge el valor que va justo después de /todo/ y lo guarda en
//^ una variable dentro del objeto "req" con el mismo nombre que hemos utilizado en el path.

//^ Ejemplo:

//^ Si con Insomnia o Postman hicisemos una peticion GET a la ruta /todo/12, está será dirigida directamente hasta
//^ este endpoint.
todoRouter.get("/todo/:id", (req, res) => {
  /* 
  Recogemos el valor de la variable del path llamada "id" y lo transformamos a un numero (todos nuestros ids
  son numericos).
  Cualquier valor que recogemos de req.params será siempre un String. Por eso lo debemos convertir a numero.
  Buscar dentro del array "todos" aquel elemento que coincide con el id recibido por parametro de la ruta en
  la request. 
  */
  const specificTodo = todos.find((todo) => {
    return todo.id.toString() === req.params.id;
  });

  /* 
  Si existe, devolverlo como formato JSON y codigo de status 200.
  Si no hemos econtrado un TODO o no nos han pasado un id en la ruta, devolvemos un 404. 
  */
  if (!specificTodo) {
    res.status.send(404);
  } else {
    res.status(200).json(specificTodo);
  }
});

//> MISSING '/todo/:id' PATCH
todoRouter.patch("/todo/:id", (req, res) => {
  /*
  Recogemos el valor de la variable del path llamada "id" y lo transformarlo a un numero (todos nuestros
  ids son numericos).
  Cualquier valor que recogemos de req.params será siempre un String. Por eso lo debemos convertir a numero.
  Buscar dentro del array "todos" aquel elemento que coincide con el id recibido por parametro de la ruta en
  la request.
  */
  const id = parseInt(req.params.id);
  const todo = todos.find((t) => t.id === id);

  /* Si existe, lo ACTUALIZAMOS con los datos del BODY de la Request y lo devolvemos como formato JSON y codigo
  de status 200.
  Si no hemos econtrado un TODO o no nos han pasado un id en la ruta, devolvemos un 404.
  */
  if (!todo) {
    return res.status(404).json({ error: "Todo not found" });
  } else {
    todo.text = req.body.text || todo.text;
    todo.fecha = req.body.fecha || new Date();
    todo.done = req.body.done || todo.done;
    res.json(todo);
  }
});

//! MISSING '/todo/:id' DELETE
todoRouter.delete("/todo/:id", (req, res) => {
  /* 
  Recogemos el valor de la variable del path llamada "id" y lo transformarlo a un numero (todos nuestros ids
  son numericos).
  Cualquier valor que recogemos de req.params será siempre un String. Por eso lo debemos convertir a numero.
  Buscar dentro del array "todos" aquel elemento que coincide con el id recibido por parametro de la ruta en
  la request.
  */
  const specificTodo = todos.findIndex((todo) => {
    return todo.id.toString() === req.params.id;
  });

  /*
  Si existe, lo BORRAMOS y devolvemos un codigo de status 204.
  Si no hemos econtrado un TODO o no nos han pasado un id en la ruta, devolvemos un 404.
  */
  if (specificTodo === -1) {
    res.status(404).send();
  } else {
    todos.splice(specificTodo, 1);
    res.status(200).json(todos);
  }
});

// Exportamos el router para poder 'usarlo' en nuestra app.
module.exports = todoRouter;
