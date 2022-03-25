let allTasks = JSON.parse(localStorage.getItem('tasks')) || [];
let valueInput = '';
let input = null;

sort = () => {
  const trueArr = [];
  const falseArr = [];

  allTasks.forEach(element => {
      element.isCheck === true ? trueArr.push(element) : falseArr.push(element)
    }
  );

  allTasks = falseArr.concat(trueArr);
  localStorage.setItem('tasks', JSON.stringify(allTasks));
}

sort()

window.onload = function init () {
  input = document.getElementById('add-task');
  input.addEventListener('change', updateValue);
  render();
}

onClickButton = () => {
  allTasks.push({
    text: valueInput,
    isCheck: false
  });
  localStorage.setItem('tasks', JSON.stringify(allTasks));
  valueInput = '';
  input.value = '';
  render();
}

updateValue = (event) => {
  valueInput = event.target.value;
  localStorage.setItem('tasks', JSON.stringify(allTasks));
}

deleteTask = (index) => {
  allTasks.splice(index, 1);
  localStorage.setItem('tasks', JSON.stringify(allTasks));
  render()
}

git remote set-url origin  https://MkpMarkovRuslan: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@github.com/to-do_list.git

editTask = (index) => {
  const task = document.getElementById(`task-${index}`);

  if (allTasks[index].isCheck === true) {
    alert('Не пытайтесь переписать историю')
  } else {
    const close = document.getElementById(`close-${index}`);
    close.className = 'hidden'

    const editContainer = document.createElement('div');
    editContainer.id = 'edit';

    const tempInput = document.createElement('input');
    tempInput.id = 'temp-input';
    editContainer.appendChild(tempInput);

    const done = document.createElement('img');
    done.src = './src/done.svg';
    done.id = 'svg';
    done.addEventListener('click', function () {
      if (tempInput.value.trim() === '') {
        alert('Задача это идея - выраженная в словах. Просто напиши их.')
      } else {
        allTasks[index].text = tempInput.value;
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
      close.className = ''
      task.removeChild(edit);
    }
  }
}

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
    checkBox.onchange = function () {
      onChangeCheckbox(index)
    }
    container.appendChild(checkBox);

    const text = document.createElement('p')
    text.innerText = item.text;
    text.className = item.isCheck ? 'done-text' : 'text-task';
    container.appendChild(text);

    const imageEdit = document.createElement('img');
    imageEdit.src = './src/edit.svg';
    container.appendChild(imageEdit);
    imageEdit.addEventListener('click', function () {
      editTask(index)
    })

    const imageClose = document.createElement('img');
    imageClose.src = './src/close.svg';
    imageClose.id = `close-${index}`;
    container.appendChild(imageClose);
    imageClose.addEventListener('click', function () {
      deleteTask(index);
    });

    content.appendChild(container);
  })
}

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
}

