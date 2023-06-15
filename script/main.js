const base_url = "http://127.0.0.1:8081";
const courses_endpoint = "/api/courses";

async function onDraft() {
  const id = document.getElementById("id").value;

  const payload = {
    dept: document.getElementById("dept").value,
    courseNum: document.getElementById("courseNum").value,
    courseName: document.getElementById("courseName").value,
    instructor: document.getElementById("instructor").value,
    numDays: document.getElementById("numDays").value,
    startDate: document.getElementById("startDate").value,
  };
  localStorage.currentId = id;
  localStorage.currentData = JSON.stringify(payload);
}

async function onSave(which) {
  const id = document.getElementById("id").value;

  const payload = {
    dept: document.getElementById("dept").value,
    courseNum: document.getElementById("courseNum").value,
    courseName: document.getElementById("courseName").value,
    instructor: document.getElementById("instructor").value,
    numDays: document.getElementById("numDays").value,
    startDate: document.getElementById("startDate").value,
  };
  // const fields = ["dept", "courseNum", "courseName", "instructor", "numDays", "startDate"];
  // const payload = {};
  // fields.forEach(f => payload[f] = document.getElementById(f).value);

  //CREATE OR UPDATE? DO WE HAVE AN ID?
  const endpoint = id ? "/api/courses/" + id : "/api/courses";
  const method = id ? "PUT" : "POST";

  const response = await fetch(base_url + endpoint, {
    method: method,
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (id) {
    onNew(); //Clear only if new item saved.
  }
  refreshList(document.getElementById("item-list"));
}
function onNew() {
  document.getElementById("id").value = "";
  document.getElementById("dept").value = "";
  document.getElementById("courseNum").value = "";
  document.getElementById("courseName").value = "";
  document.getElementById("instructor").value = "";
  document.getElementById("numDays").value = "";
  document.getElementById("startDate").value = "";
  onDraft();
  document.querySelector("#edit-item details").open = true;
  document.getElementById("dept").focus();
  // document.querySelector("#edit-item details").setAttribute("open", "open");
}
async function onEdit(which) {
  const row = which.closest("tr");
  const id = row.id;
  const response = await fetch(base_url + "/api/courses/" + id, {
    method: "GET",
  });
  const data = await response.json(); // parse

  document.getElementById("id").value = id;

  document.getElementById("dept").value = data.dept;
  document.getElementById("courseNum").value = data.courseNum;
  document.getElementById("courseName").value = data.courseName;
  document.getElementById("instructor").value = data.instructor;
  document.getElementById("numDays").value = data.numDays;
  document.getElementById("startDate").value = data.startDate;

  onDraft();
  document.querySelector("#edit-item details").open = true;
  // document.querySelector("#edit-item details").setAttribute("open", "open");
}
async function onRemove(which) {
  const row = which.closest("tr");
  const id = row.id;
  const response = await fetch(base_url + "/api/courses/" + id, {
    method: "DELETE",
  });
  row.remove(); //Remove html element
}
async function refreshList(list) {
  // list.innerHTML = "Can has list???"
  const response = await fetch(base_url + courses_endpoint);
  const data = await response.json(); // parse json
  let output = `<table>`;
  data.forEach((item) => {
    output += `<tr id="${item.id}">
        <td>
            <details>
                <summary>${item.courseName}</summary>
                <table>
                    <tr><th>id</th><td>${item.id}</td></tr>
                    <tr><th>dept</th><td>${item.dept}</td></tr>
                    <tr><th>courseNum</th><td>${item.courseNum}</td></tr>
                    <tr><th>instructor</th><td>${item.instructor}</td></tr>
                    <tr><th>numDays</th><td>${item.numDays}</td></tr>
                    <tr><th>startDate</th><td>${item.startDate}</td></tr>
                </table>
                <button onclick="onEdit(this)">Edit Item in Form Above</button>
                <button onclick="onRemove(this)">Remove</button>
            </details>
        </td>
        </tr>`;
  });
  output += `</table>`;
  list.innerHTML = output;
}
function onRestore() {
  const id = localStorage.currentId ? localStorage.currentId : "";
  const data = localStorage.currentData
    ? JSON.parse(localStorage.currentData)
    : {
        dept: "",
        courseNum: "",
        courseName: "",
        instructor: "",
        numDays: "",
      };

  document.getElementById("id").value = id;
  document.getElementById("dept").value = data.dept;
  document.getElementById("courseNum").value = data.courseNum;
  document.getElementById("courseName").value = data.courseName;
  document.getElementById("instructor").value = data.instructor;
  document.getElementById("numDays").value = data.numDays;
}
document.addEventListener("DOMContentLoaded", () => {
  const list = document.getElementById("item-list");
  onRestore();
  refreshList(list);
}); //end loaded
