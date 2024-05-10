console.log("Test");

const login = async () => {
  let identifier = document.querySelector("#identifier").value;
  let password = document.querySelector("#password").value;

  let response = await axios.post("http://localhost:1337/api/auth/local", {
    identifier: identifier,
    password: password,
  });

  sessionStorage.setItem("token", response.data.jwt);
  sessionStorage.setItem("user", JSON.stringify(response.data.user));
};

const addTodo = async () => {
  let todoTitle = document.querySelector("#todoTitle").value;

  let user = JSON.parse(sessionStorage.getItem("user"));
  let userId = user.id.toString();
  await axios.post(
    "http://localhost:1337/api/todos",
    {
      data: {
        title: todoTitle,
        user: userId,
        // completed:false <--- Behövs inte, pga default-värde i Strapi
      },
    },
    {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    }
  );

  renderPage();
};

const renderPage = async () => {
  //Render user
  let user = JSON.parse(sessionStorage.getItem("user")).username;
  console.log(user);

  document.querySelector("#user").innerHTML = user;

  //Render todos

  let loggedInUser = await axios.get(
    "http://localhost:1337/api/users/me?populate=*",
    {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    }
  );

  console.log(loggedInUser.data);
  let todos = loggedInUser.data.todos;
  //   let response = await axios.get("http://localhost:1337/api/todos");
  //   let todos = response.data.data;

  document.querySelector("#todoList").innerHTML = "";

  todos.forEach((todo) => {
    document.querySelector("#todoList").innerHTML += `<li>${todo.title}</li>`;
  });
};

document.querySelector("#addTodoBtn").addEventListener("click", addTodo);
document.querySelector("#loginBtn").addEventListener("click", login);

renderPage();
