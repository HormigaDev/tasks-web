import API from "src/API";

export async function getCategories() {
  const data = await API.get("/get-categories");
  // console.log(data?.data);
  return data;
}

export async function newCategory(name, color, icon) {
  const { data, status } = await API.post("/new-category", {
    name,
    color,
    icon,
  });
  // console.log(data?.message);
  return { data, status };
}

export async function editCategory(id, name, color, icon) {
  const { data, status } = await API.put("/edit-category", {
    category_id: id,
    name,
    color,
    icon,
  });
  // console.log(data?.message);
  return { data, status };
}

export async function deleteCategory(id) {
  const { data, status } = await API.delete(
    "/delete-category?category_id=" + id
  );
  // console.log(data?.message);
  return { data, status };
}
