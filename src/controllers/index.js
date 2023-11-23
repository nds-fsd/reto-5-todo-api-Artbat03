const { todos } = require("../data/data");

const todosKeys = ["done", "fecha", "text", "color"];

const getAllTodos = (req, res) => {
  // Devolver todos los "todos" que hay en el array con formato JSON.
  try {
    if (todos.length === 0) {
      return res.status(200).json([]);
    } else {
      return res.status(200).json(todos);
    }
  } catch (error) {
    console.log(error);
  }
};

/* En este endpoint, el path contiene una variable llamada id. La syntaxis que utiliza express para estos casos
es el simbolo :

Una variable en un path, significa que express recoge el valor que va justo después de /todo/ y lo guarda en
una variable dentro del objeto "req" con el mismo nombre que hemos utilizado en el path.

Ejemplo:
Si con Insomnia o Postman hicisemos una peticion GET a la ruta /todo/12, está será dirigida directamente hasta
este endpoint.*/
const getTodoById = (req, res) => {
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
    res.status(404).json({ error: "Todo not found." });
  } else {
    res.status(200).json(specificTodo);
  }
};

const postTodo = (req, res) => {
  /*
    Crear un nuevo objeto con estructura {id, text, fecha, done} con los datos que vienen en el BODY de la
    Request y meterlos dentro de el array.
    El nuevo objeto debe tener como id un numero mas que el numero actual de elementos guardados en el array.
    */
  const setId = () => {
    let newId = 0;
    todos.forEach((todo) => {
      if (!todos.includes(todo.id)) {
        newId = todo.id + 1;
        return newId;
      }
    });
    return newId;
  };

  const newTodo = {
    id: setId(),
    text: req.body.text,
    fecha:
      req.body.fecha ||
      `${new Date().getFullYear()}-${new Date().getMonth()}-${new Date().getDate()}`,
    done: req.body.done || false,
    color: req.body.color || "yellow"
  };

  if (newTodo.text === undefined || newTodo.text === "") {
    res.status(404).json({ error: "Unable to create task without a text." });
  } else {
    todos.push(newTodo);
    res.status(201).json(todos);
  }
};

const updateATodo = (req, res) => {
  /*
    Recogemos el valor de la variable del path llamada "id" y lo transformarlo a un numero (todos nuestros
    ids son numericos).
    Cualquier valor que recogemos de req.params será siempre un String. Por eso lo debemos convertir a numero.
    Buscar dentro del array "todos" aquel elemento que coincide con el id recibido por parametro de la ruta en
    la request.
    */
  const id = parseInt(req.params.id);
  const todo = todos.find((t) => t.id === id);
  const { body } = req;

  /* Si existe, lo ACTUALIZAMOS con los datos del BODY de la Request y lo devolvemos como formato JSON y codigo
    de status 200.
    Si no hemos econtrado un TODO o no nos han pasado un id en la ruta, devolvemos un 404.
    */
  if (!todo) {
    return res.status(404).json({ error: "Todo not found." });
  } else {
    Object.entries(body).forEach(([key, value]) => {
      if (todosKeys.includes(key)) {
        todo[key] = value;
      }
    });

    res.json(todo);
  }
};

const removeATodo = (req, res) => {
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
    res.status(404).json({ error: "Todo not found." });
  } else {
    todos.splice(specificTodo, 1);
    res.status(200).json({ message: "Deleted todo." });
  }
};

module.exports = {
  getAllTodos,
  getTodoById,
  postTodo,
  updateATodo,
  removeATodo
};
