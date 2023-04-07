const express = require("express");
app = express();
const { open } = require("sqlite");

const sqlite3 = require("sqlite3");
let path = require("path");
const dbPath = path.join(__dirname, "todoApplication.db");
console.log(dbPath);
app.use(express.json());
let db = null;

const installAndRun = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(4000, () => {
      console.log("sever running at 4000.....");
    });
  } catch (e) {
    console.log(e.massage);
  }
};
installAndRun();

//API1 SEN1

const hasPriorityAndStatusProperties = (requestQuery) => {
  return (
    requestQuery.priority !== undefined && requestQuery.status !== undefined
  );
};

const hasPriorityProperty = (requestQuery) => {
  return requestQuery.priority !== undefined;
};

const hasStatusProperty = (requestQuery) => {
  return requestQuery.status !== undefined;
};

const API_todo_update = (queryItems) => {
  return queryItems.todo !== undefined;
};

const convert = (obj) => {
  return {
    id: obj.id,
    todo: obj.todo,
    status: obj.status,
    priority: obj.priority,
  };
};

app.get("/todos/", async (request, response) => {
  let data = null;
  let getTodosQuery = "";
  const { search_q = "", priority, status } = request.query;

  switch (true) {
    case hasPriorityAndStatusProperties(request.query):
      getTodosQuery = `
   SELECT
    *
   FROM
    todos
   WHERE
    todo LIKE '%${search_q}%'
    AND status = '${status}'
    AND priority = '${priority}';`;
      break;
    case hasPriorityProperty(request.query):
      getTodosQuery = `
   SELECT
    *
   FROM
    todos 
   WHERE
    todo LIKE '%${search_q}%'
    AND priority = '${priority}';`;
      break;
    case hasStatusProperty(request.query):
      getTodosQuery = `
   SELECT
    *
   FROM
    todos 
   WHERE
    todo LIKE '%${search_q}%'
    AND status = '${status}';`;
      break;
    default:
      getTodosQuery = `
   SELECT
    *
   FROM
    todos
   WHERE
    todo LIKE '%${search_q}%';`;
  }

  data = await db.all(getTodosQuery);
  response.send(data.map((each) => convert(each)));
});

//API
app.get("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const sql1 = `select * from todos where id = ${todoId}`;
  const result1 = await db.all(sql1);
  response.send(result1.map((each) => convert(each)));
});
app.post("/todos/", (request, response) => {
  const { id, todo, priority, status } = request.body;
  // console.log(request.body);
  const apiQuery3 = `insert into todos(id,todo,priority,status) values ('${id}','${todo}','${priority}','${status}');`;
  const apiResult3 = db.run(apiQuery3);
  response.send("Todo Successfully Added ");
});
//API4

let resultTodos = "";
app.put("/todos/:todoId", (request, response) => {
  const { status, priority, todo } = request.body;
  // console.log(request.body);
  switch (true) {
    case API1_search_status(request.body):
      resultTodos = `update todos set status="${status}"`;
      break;
    case API1_search_priority(request.body):
      resultTodos = `update todos set priority="${priority}"`;
      break;
    case API_todo_update(request.body):
      resultTodos = `update todos set todo="${todo}"`;
      break;
  }
  const apiResult4 = db.run(resultTodos);
  response.send("Status Updated");
});
app.delete("/todos/:todoId", (request, response) => {
  const { todoId } = request.params;
  console.log(todoId);
  const lastApi = `delete from todos where id=${todoId}`;
  const lastresult = db.all(lastApi);
  response.send("Todo Deleted");
});
module.exports = app;
