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
  //Title input
  let todoTitle = document.querySelector("#todoTitle").value;

  //Image input
  let imageFiles = document.querySelector("#fileInput").files;
  let formData = new FormData();
  formData.append("files", imageFiles[0]);

  //Get user id from local storage
  let user = JSON.parse(sessionStorage.getItem("user"));
  let userId = user.id.toString();

  //Post image and then todo containing the image id
  axios.post("http://localhost:1337/api/upload", formData).then((response) => {
    axios.post(
      "http://localhost:1337/api/todos",
      {
        data: {
          title: todoTitle,
          user: userId,
          img: response.data[0].id,
          // completed:false <--- Behövs inte, pga default-värde i Strapi
        },
      },
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      }
    );
  });

  renderPage();
};

const renderPage = async () => {
  //Render user
  let user = JSON.parse(sessionStorage.getItem("user")).username;
  console.log(user);

  document.querySelector("#user").innerHTML = user;

  //Render todos

  let loggedInUser = await axios.get(
    "http://localhost:1337/api/users/me?populate=deep,3",
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
    document.querySelector("#todoList").innerHTML += `<li>
    <p>${todo.title}</p>
    <img src="http://localhost:1337${todo.img?.url}" height="100"/>
    </li>`;
  });
};

document.querySelector("#addTodoBtn").addEventListener("click", addTodo);
document.querySelector("#loginBtn").addEventListener("click", login);

renderPage();
