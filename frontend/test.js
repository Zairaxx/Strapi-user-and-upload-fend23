let fileInput = document.querySelector("#imgFile");

let addImgBtn = document.querySelector("#addImage");
let addTodoBtn = document.querySelector("#addTodo");

let uploadImg = async () => {
  let imgFile = fileInput.files;

  let formData = new FormData();
  formData.append("files", imgFile[0]);

  let response = await axios.post("http://localhost:1337/api/upload", formData);

  console.log(response);
};

let addTodo = async () => {
  //Hämta image-värden
  let imgFile = fileInput.files;
  let formData = new FormData();
  formData.append("files", imgFile[0]);

  axios.post("http://localhost:1337/api/upload", formData).then(
    (response) =>
        
    axios.post("http://localhost:1337/api/todos", {
      data: {
        title: "Todo #1",
        user: "1",
        img: response.data[0].id,
      },
    })
  );
};

addTodoBtn.addEventListener("click", addTodo);
addImgBtn.addEventListener("click", uploadImg);
