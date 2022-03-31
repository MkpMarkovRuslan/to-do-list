let allTasks = [];
let valueInput = "";

const getTasks = async () => {
  const resp = await fetch("http://localhost:8080/api/getAll", {
    method: "GET",
  });
  const result = await resp.json();
  allTasks = result;
};

const sort = () => {
  allTasks.sort((a, b) => {
    return a.ischeck > b.ischeck ? 1 : -1;
  });
};

window.onload = async () => {
  await getTasks();

  sort();

  render();
};

onClickButton = async () => {
  const resp = await fetch("http://localhost:8080/api/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({
      text: valueInput,
      ischeck: false,
    }),
  }).catch((err) => {
    console.log(err);
  });

  await getTasks();

  const input = document.getElementById("add-task");
  valueInput = "";
  input.value = "";

  render();
};

deleteTask = async (id) => {
  const resp = await fetch(`http://localhost:8080/api/delete?id=${id}`, {
    method: "DELETE",
  });

  await getTasks();

  render();
};

editTask = (id) => {
  const task = document.getElementById(id);

  if (task.ischeck === true) {
    alert("Не пытайтесь переписать историю");
  } else {
    const close = document.getElementById(`close-${id}`);
    close.className = "hidden";

    const editContainer = document.createElement("div");
    editContainer.id = "edit";

    const tempInput = document.createElement("input");
    tempInput.id = "temp-input";
    editContainer.appendChild(tempInput);

    const done = document.createElement("img");
    done.src = "./src/img/done.svg";
    done.id = "svg";
    done.addEventListener("click", async () => {
      if (tempInput.value.trim() === false) {
        alert("Задача это идея - выраженная в словах. Просто напиши их.");
      } else {
        const resp = await fetch("http://localhost:8080/api/update", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json;charset=utf-8",
            "Access-Control-Allow-Origin": "*",
          },
          body: JSON.stringify({
            id: id,
            text: tempInput.value,
          }),
        });

        await getTasks();

        render();
      }
    });
    editContainer.appendChild(done);

    if (!document.getElementById("edit")) {
      task.appendChild(editContainer);
    } else {
      const edit = document.getElementById("edit");
      const close = document.getElementById(`close-${id}`);
      close.className = "";
      task.removeChild(edit);
    }
  }
};

render = () => {
  const content = document.getElementById("content-page");
  while (content.firstChild) {
    content.removeChild(content.firstChild);
  }
  allTasks.map((item, index) => {
    const container = document.createElement("div");
    container.id = `${item.id}`;
    container.className = "task-container";

    const checkBox = document.createElement("input");
    checkBox.id = `check-${item.id}`;
    checkBox.type = "checkbox";
    checkBox.checked = item.ischeck;
    checkBox.onchange = () => {
      onChangeCheckbox(item.id);
    };
    container.appendChild(checkBox);

    const text = document.createElement("p");
    text.id = `p-${item.id}`;
    text.innerText = item.text;
    text.className = item.ischeck ? "done-text" : "text-task";
    container.appendChild(text);

    const imageEdit = document.createElement("img");
    imageEdit.src = "./src/img/edit.svg";
    container.appendChild(imageEdit);
    imageEdit.addEventListener("click", () => {
      editTask(`${item.id}`);
    });

    const imageClose = document.createElement("img");
    imageClose.src = "./src/img/close.svg";
    imageClose.id = `close-${item.id}`;
    container.appendChild(imageClose);
    imageClose.addEventListener("click", () => {
      deleteTask(`${item.id}`);
    });

    content.appendChild(container);
  });
};

onChangeCheckbox = async (id) => {
  const task = allTasks.find((task) => task.id === id);

  const resp = await fetch("http://localhost:8080/api/update", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({
      id: id,
      ischeck: !task.ischeck,
    }),
  });

  await getTasks();

  sort();

  render();
};

clearAllButton = () => {
  confirm("Всё уже сделал?") ? (allTasks = []) : alert("Тогда продолжай");
  render();
};
