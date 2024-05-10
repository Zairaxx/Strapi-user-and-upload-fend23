let fileInput = document.querySelector("#imgFile");

let addImgBtn = document.querySelector("#addImage");
let addTodoBtn = document.querySelector("#addTodo");

//Upload only an image to strapi
// let uploadImg = async () => {
//   let imgFile = fileInput.files;

//   let formData = new FormData();
//   formData.append("files", imgFile[0]);

//   let response = await axios.post("http://localhost:1337/api/upload", formData);
// };

let addTodo = async () => {
  //Hämta image-värden
  let imgFile = fileInput.files;
  let formData = new FormData();
  formData.append("files", imgFile[0]);

  //Ladda upp image först - Vi måste använda .then-kedja för att sedan ladda upp todo med 

  axios.post("http://localhost:1337/api/upload", formData).then((response) =>
    axios.post("http://localhost:1337/api/todos", {
      data: {
        title: "Todo #1",
        user: "1",
        img: response.data[0].id,
      },
    })
  );
};

//Only Image
// addImgBtn.addEventListener("click", uploadImg);

//Add todo with image
addTodoBtn.addEventListener("click", addTodo);
