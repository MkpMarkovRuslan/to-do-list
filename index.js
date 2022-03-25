let allTasks = JSON.parse(localStorage.getItem('tasks')) || [];
let valueInput = '';
let input = null;

window.onload = async () => {
  input = document.getElementById('add-task');
  input.addEventListener('change', updateValue);
  const resp = await fetch('http://localhost:8000/allTasks', {
    method: 'GET'
  });
  const result = await resp.json();
  allTasks = result.data;
  localStorage.setItem('tasks', JSON.stringify(allTasks));

  render();
};

sort = () => {
  const trueArr = [];
  const falseArr = [];

  allTasks.forEach(element => {
      element.isCheck === true ? trueArr.push(element) : falseArr.push(element)
    }
  );

  allTasks = falseArr.concat(trueArr);
  localStorage.setItem('tasks', JSON.stringify(allTasks));
};

sort();

onClickButton = async () => {
  allTasks.push({
    text: valueInput,
    isCheck: false
  });
  const resp = await fetch('http://localhost:8000/createTask', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify(
      {
        text: valueInput,
        isCheck: false
      }
    )
  });
  const result = await resp.json();
  allTasks = result.data;
  localStorage.setItem('tasks', JSON.stringify(allTasks));
  valueInput = '';
  input.value = '';
  render();
}

updateValue = (event) => {
  valueInput = event.target.value;
  localStorage.setItem('tasks', JSON.stringify(allTasks));
};

deleteTask = async (index) => {
  const resp = await fetch(`http://localhost:8000/deleteTask?id=${allTasks[index].id}`, {
    method: 'DELETE'
  });

  const result = await resp.json();
  allTasks = result.data;

  localStorage.setItem('tasks', JSON.stringify(allTasks));

  render();
};

editTask = (index) => {
  const task = document.getElementById(`task-${index}`);

  if (allTasks[index].isCheck === true) {
    alert('Не пытайтесь переписать историю')
  } else {
    const close = document.getElementById(`close-${index}`);
    close.className = 'hidden';

    const editContainer = document.createElement('div');
    editContainer.id = 'edit';

    const tempInput = document.createElement('input');
    tempInput.id = 'temp-input';
    editContainer.appendChild(tempInput);

    const done = document.createElement('img');
    done.src = './src/done.svg';
    done.id = 'svg';
    done.addEventListener('click', async () => {
      if (tempInput.value.trim() === '') {
        alert('Задача это идея - выраженная в словах. Просто напиши их.')
      } else {
        const resp = await fetch('http://localhost:8000/updateTask', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json;charset=utf-8',
            'Access-Control-Allow-Origin': '*'
          },
          body: JSON.stringify(
            {
              id: `${allTasks[index].id}`,
              text: tempInput.value,
              isCheck: false
            }
          )
        });

        const result = await resp.json();
        allTasks = result.data;

        localStorage.setItem('tasks', JSON.stringify(allTasks));

        render();
      }
    });
    editContainer.appendChild(done);

    if (!document.getElementById('edit')) {
      task.appendChild(editContainer);
    } else {
      const edit = document.getElementById('edit');
      const close = document.getElementById(`close-${index}`);
      close.className = '';
      task.removeChild(edit);
    }
  }
};

render = () => {
  const content = document.getElementById('content-page');
  while(content.firstChild) {
    content.removeChild(content.firstChild);
  }
  allTasks.map((item, index) => {
    const container = document.createElement('div');
    container.id = `task-${index}`;
    container.className = 'task-container';

    const checkBox = document.createElement('input');
    checkBox.type = 'checkbox';
    checkBox.checked = item.isCheck;
    checkBox.onchange = () => {
      onChangeCheckbox(index);
    };
    container.appendChild(checkBox);

    const text = document.createElement('p');
    text.innerText = item.text;
    text.className = item.isCheck ? 'done-text' : 'text-task';
    container.appendChild(text);

    const imageEdit = document.createElement('img');
    imageEdit.src = './src/edit.svg';
    container.appendChild(imageEdit);
    imageEdit.addEventListener('click', () => {
      editTask(index);
    });

    const imageClose = document.createElement('img');
    imageClose.src = './src/close.svg';
    imageClose.id = `close-${index}`;
    container.appendChild(imageClose);
    imageClose.addEventListener('click', () => {
      deleteTask(index);
    });

    content.appendChild(container);
  });
};

onChangeCheckbox = (index) => {
  allTasks[index].isCheck = !allTasks[index].isCheck;
  localStorage.setItem('tasks', JSON.stringify(allTasks));
  sort();
  render();
}

clearAllButton = () => {
  confirm("Всё уже сделал?") ? allTasks = [] : alert("Тогда продолжай");
  localStorage.setItem('tasks', JSON.stringify(allTasks));
  render();
};

