// for adding in database
export async function addTodoInDataBase(data, token) {
  const addTask = await fetch(
    "https://mern-todo-app-roan.vercel.app/api/v1/tasks",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }
  );
  const getData = await addTask.json();

  return getData;
}

///    for deleting from database
export async function DeleteFromDataBase(id, token) {
  const addTask = await fetch(
    `https://mern-todo-app-roan.vercel.app/api/v1/tasks/${id}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const getData = await addTask.json();
}

///    for update from database
export async function updateDataBase(item, token) {
  const updateItems = item;
  const updateTask = await fetch(
    `https://mern-todo-app-roan.vercel.app/api/v1/tasks/${item.id}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(item),
    }
  );

  const updatedData = await updateTask.json();
  return updatedData;
}
