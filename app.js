let editStaff = {};
let viewStaffDetails = {};
let currentPage = 1;
const itemsPerPage = 10;

const token = localStorage.getItem('token');
if (!token) {
    window.location.href = 'index.html';
}


// Fetch and display staff members with pagination
function searchStaffs(page = 1) {
  currentPage = page;
  const query = document.getElementById("searchQuery").value;
  const url = query
    ? `https://eleap-backend.onrender.com/api/staff/search/single?query=${encodeURIComponent(
        query
      )}&page=${page}&limit=${itemsPerPage}`
    : `https://eleap-backend.onrender.com/api/staff/search/all?page=${page}&limit=${itemsPerPage}`;

      fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then((res) => {
      if (!res.ok) throw new Error(`Error: ${res.statusText}`);
      return res.json();
    })
    .then((data) => {
      const staffs = Array.isArray(data.staffs) ? data.staffs : data;
      displayStaffs(staffs);
      updatePagination(data.totalPages);
    })
    .catch((err) => {
      console.error("Fetch Error:", err);
      alert("No data found.");
    });
}

// Display Staff Table (Desktop View)
function displayStaffs(staffs) {
  const staffTableBody = document.getElementById("staffTableBody");
  const staffAccordion = document.getElementById("staffAccordion");

  staffTableBody.innerHTML = "";
  staffAccordion.innerHTML = "";

  if (!Array.isArray(staffs) || staffs.length === 0) {
    staffTableBody.innerHTML = '<tr><td colspan="36">No data found</td></tr>';
    return;
  }


    // Calculate the starting index for the current page  
    // .Calculate startIndex: This determines thestarting index for the current page by multiplying (currentPage - 1) by itemsPerPage.
    const startIndex = (currentPage - 1) * itemsPerPage;


  staffs.forEach((staff,index) => {


//rowNumber is then calculated as startIndex + index + 1, which ensures the numbering continues correctly across pages.
    const rowNumber = startIndex + index ;

    // Populate Table View
    const row = document.createElement("tr");
    row.innerHTML = `
            <td class="fixed-column">${rowNumber + 1}</td> 
            <td class="fixed-column">${staff.noStaf || ""}</td>
            <td>${staff.gelaran || ""}</td>
            <td>${staff.nama || ""}</td>
            <td>${staff.noKadPengenalan || ""}</td>
            <td>${staff.tahunLahir || ""}</td>
            <td>${staff.tahunSemasa || ""}</td>
            <td>${staff.umur || ""}</td>
            <td>${staff.jantina || ""}</td>
            <td>${staff.jawatan || ""}</td>
            <td>${staff.gred || ""}</td>
            <td>${staff.penyandang || ""}</td>
            <td>${staff.kumpJawatan || ""}</td>
            <td>${staff.statusJawatan || ""}</td>
            <td>${staff.unit || ""}</td>
            <td>${staff.jabatan || ""}</td>
            <td>${staff.ptj || ""}</td>
            <td>${staff.emel || ""}</td>
            <td>${staff.tarikhKhidmatUM || ""}</td>
            <td>${staff.tarikhKhidmatJPA || ""}</td>
            <td>${staff.tarikhSahJawatan || ""}</td>
            <td>${staff.tarikhNaikPangkat || ""}</td>
            <td>${staff.tarikhLantikSemasa || ""}</td>
            <td>${staff.tarikhAkhirKhidmat || ""}</td>
            <td>${staff.tarikhBersara || ""}</td>
            <td>${staff.umurBersara || ""}</td>
            <td>${staff.bakiTempohPerkhidmatan || ""}</td>
            <td>${staff.kelayakanAkademik || ""}</td>
            <td>${staff.lta || ""}</td>
            <td>${staff.capacityBand || ""}</td>
            <td>${staff.work || ""}</td>
            <td>${staff.ideation || ""}</td>
            <td>${staff.thinking || ""}</td>
            <td>${staff.motivation || ""}</td>
            <td>${staff.learning || ""}</td>
            <td>
                <button class="btn btn-outline-info btn-sm" onclick='viewStaff("${staff._id}")'>
                    <i class="fa fa-eye" aria-hidden="true"></i>
                </button>
                <button class="btn btn-outline-primary btn-sm" onclick='openEditModal(${JSON.stringify(staff)})'>
                    <i class="fa fa-pencil" aria-hidden="true"></i>
                </button>
                <button class="btn btn-outline-danger btn-sm" onclick='deleteStaff("${staff._id}")'>
                    <i class="fa fa-trash" aria-hidden="true"></i>
                </button>
            </td>
        `;

          // Add double-click event listener to the row
          row.addEventListener("dblclick", (event) => {
            // Check if the double-clicked element is within the "Actions" column
            if (event.target.closest("td:last-child")) return;
            viewStaff(staff._id);
          });


    staffTableBody.appendChild(row);

    // Populate Card View (Mobile View)
    const card = document.createElement("div");
    card.classList.add("accordion-item");
    card.innerHTML = `
      <h2 class="accordion-header" id="heading${staff._id}">
        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${staff._id}" aria-expanded="false" aria-controls="collapse${staff._id}">
          ${staff.nama || "No Name"}
        </button>
      </h2>
      <div id="collapse${staff._id}" class="accordion-collapse collapse" aria-labelledby="heading${staff._id}" data-bs-parent="#staffAccordion">
        <div class="accordion-body">
          <p><strong>No. Staf:</strong> ${staff.noStaf || ""}</p>
          <p><strong>Gelaran:</strong> ${staff.gelaran || ""}</p>
          <p><strong>Nama:</strong> ${staff.nama || ""}</p>
          <p><strong>No. Kad Pengenalan:</strong> ${staff.noKadPengenalan || ""}</p>
          <button class="btn btn-info btn-sm mt-2" onclick='viewStaff("${staff._id}")'>View</button>
          <button class="btn btn-primary btn-sm mt-2" onclick='openEditModal(${JSON.stringify(staff)})'>Edit</button>
          <button class="btn btn-danger btn-sm mt-2" onclick='deleteStaff("${staff._id}")'>Delete</button>
        </div>
      </div>
    `;
    staffAccordion.appendChild(card);
  });
}

// Pagination function
function updatePagination(totalPages) {
  const pagination = document.getElementById("pagination");
  pagination.innerHTML = "";

  // Create Previous Button
  const prevButton = document.createElement("button");
  prevButton.textContent = "Previous";
  prevButton.classList.add("btn", "btn-outline-secondary", "btn-sm", "mx-1");
  prevButton.disabled = currentPage === 1;
  prevButton.addEventListener("click", () => {
    if (currentPage > 1) searchStaffs(currentPage - 1);
  });
  pagination.appendChild(prevButton);

  // Page Buttons
  for (let i = 1; i <= totalPages; i++) {
    const pageButton = document.createElement("button");
    pageButton.textContent = i;
    pageButton.classList.add("btn", "btn-outline-secondary", "btn-sm", "mx-1");
    if (i === currentPage) {
      pageButton.classList.add("active");
    }
    pageButton.addEventListener("click", () => searchStaffs(i));
    pagination.appendChild(pageButton);
  }

  // Create Next Button
  const nextButton = document.createElement("button");
  nextButton.textContent = "Next";
  nextButton.classList.add("btn", "btn-outline-secondary", "btn-sm", "mx-1");
  nextButton.disabled = currentPage === totalPages;
  nextButton.addEventListener("click", () => {
    if (currentPage < totalPages) searchStaffs(currentPage + 1);
  });
  pagination.appendChild(nextButton);
}

// Open Edit Modal
window.openEditModal = function (staff) {
  editStaff = { ...staff };
  document.getElementById("editNoStaff").value = staff.noStaf;
  document.getElementById("editGelaran").value = staff.gelaran;
  document.getElementById("editNama").value = staff.nama;
  document.getElementById("editKadPengenalan").value = staff.noKadPengenalan;
  document.getElementById("edittahunLahir").value = staff.tahunLahir;
  document.getElementById("edittahunSemasa").value = staff.tahunSemasa;
  document.getElementById("editUmur").value = staff.umur;
  document.getElementById("editJantina").value = staff.jantina;
  document.getElementById("editJawatan").value = staff.jawatan;
  document.getElementById("editGred").value = staff.gred;
  document.getElementById("editPenyandang").value = staff.penyandang;
  document.getElementById("editkumpJawatan").value = staff.kumpJawatan;
  document.getElementById("editstatusJawatan").value = staff.statusJawatan;
  document.getElementById("editUnit").value = staff.unit;
  document.getElementById("editJabatan").value = staff.jabatan;
  document.getElementById("editPtj").value = staff.ptj;
  document.getElementById("editEmel").value = staff.emel;
  document.getElementById("edittarikhKhidmatUM").value = staff.tarikhKhidmatUM;
  document.getElementById("edittarikhKhidmatJPA").value = staff.tarikhKhidmatJPA;
  document.getElementById("edittarikhSahJawatan").value = staff.tarikhSahJawatan;
  document.getElementById("edittarikhNaikPangkat").value = staff.tarikhNaikPangkat;
  document.getElementById("edittarikhLantikSemasa").value = staff.tarikhLantikSemasa;
  document.getElementById("edittarikhAkhirKhidmat").value = staff.tarikhAkhirKhidmat;
  document.getElementById("edittarikhBersara").value = staff.tarikhBersara;
  document.getElementById("editUmurBersara").value = staff.umurBersara;
  document.getElementById("editbakiTempohPerkhidmatan").value = staff.bakiTempohPerkhidmatan;
  document.getElementById("editkelayakanAkademik").value = staff.kelayakanAkademik;
  document.getElementById("editlta").value = staff.lta;
  document.getElementById("editcapacityBand").value = staff.capacityBand;
  document.getElementById("editwork").value = staff.work;
  document.getElementById("editideation").value = staff.ideation;
  document.getElementById("editthinking").value = staff.thinking;
  document.getElementById("editmotivation").value = staff.motivation;
  document.getElementById("editlearning").value = staff.learning;
new bootstrap.Modal(document.getElementById("editStaffModal")).show();
};

// Delete Staff
window.deleteStaff = function (staffId) {
  if (confirm("Are you sure you want to delete this staff?")) {
    fetch(`https://eleap-backend.onrender.com/api/staff/delete/${staffId}`, {
      method: "DELETE",
      headers: {
        'Authorization': `Bearer ${token}`
    }
    })
      .then(() => {
        alert("Staff deleted successfully");
        document.getElementById("searchQuery").value = '';
        searchStaffs();
      })
      .catch((err) => {
        console.error("Delete Error:", err);
        alert("Failed to delete staff. Please try again.");
      });
  }
};

// View Staff
window.viewStaff = function (staffId) {
  fetch(`https://eleap-backend.onrender.com/api/staff/${staffId}`)
    .then((res) => {
      if (!res.ok) throw new Error(`Error: ${res.statusText}`);
      return res.json();
    })
    .then((staff) => {
      viewStaffDetails = { ...staff };
      document.getElementById("viewNoStaf").textContent = staff.noStaf || "";
      document.getElementById("viewGelaran").textContent = staff.gelaran || "";
      document.getElementById("viewNama").textContent = staff.nama || "";
      document.getElementById("viewKadPengenalan").textContent = staff.noKadPengenalan || "";
      document.getElementById("viewtahunLahir").textContent = staff.tahunLahir || "";
      document.getElementById("viewtahunSemasa").textContent = staff.tahunSemasa || "";
      document.getElementById("viewUmur").textContent = staff.umur || "";
      document.getElementById("viewJantina").textContent = staff.jantina || "";
      document.getElementById("viewJawatan").textContent = staff.jawatan || "";
      document.getElementById("viewGred").textContent = staff.gred || "";
      document.getElementById("viewPenyandang").textContent = staff.penyandang || "";
      document.getElementById("viewkumpJawatan").textContent = staff.kumpJawatan || "";
      document.getElementById("viewstatusJawatan").textContent = staff.statusJawatan || "";
      document.getElementById("viewUnit").textContent = staff.unit || "";
      document.getElementById("viewJabatan").textContent = staff.jabatan || "";
      document.getElementById("viewPtj").textContent = staff.ptj || "";
      document.getElementById("viewEmel").textContent = staff.emel || "";
      document.getElementById("viewtarikhKhidmatUM").textContent = staff.tarikhKhidmatUM || "";
      document.getElementById("viewtarikhKhidmatJPA").textContent = staff.tarikhKhidmatJPA || "";
      document.getElementById("viewtarikhSahJawatan").textContent = staff.tarikhSahJawatan || "";
      document.getElementById("viewtarikhNaikPangkat").textContent = staff.tarikhNaikPangkat || "";
      document.getElementById("viewtarikhLantikSemasa").textContent = staff.tarikhLantikSemasa || "";
      document.getElementById("viewtarikhAkhirKhidmat").textContent = staff.tarikhAkhirKhidmat || "";
      document.getElementById("viewtarikhBersara").textContent = staff.tarikhBersara || "";
      document.getElementById("viewUmurBersara").textContent = staff.umurBersara || "";
      document.getElementById("viewbakiTempohPerkhidmatan").textContent = staff.bakiTempohPerkhidmatan || "";
      document.getElementById("viewkelayakanAkademik").textContent = staff.kelayakanAkademik || "";
      document.getElementById("viewlta").textContent = staff.lta || "";
      document.getElementById("viewcapacityBand").textContent = staff.capacityBand || "";
      document.getElementById("viewwork").textContent = staff.work || "";
      document.getElementById("viewideation").textContent = staff.ideation || "";
      document.getElementById("viewthinking").textContent = staff.thinking || "";
      document.getElementById("viewmotivation").textContent = staff.motivation || "";
      document.getElementById("viewlearning").textContent = staff.learning || "";

     new bootstrap.Modal(document.getElementById("viewStaffModal")).show();
    })
    .catch((err) => {
      console.error("Fetch Error:", err);
      alert("Failed to fetch staff details. Please try again.");
    });
};

// // Add Staff
// document.getElementById("addStaffBtn").addEventListener("click", () => {
//   const newStaff = {
//     noStaf: parseInt(document.getElementById("newNoStaff").value, 10),
//     gelaran: document.getElementById("newGelaran").value,
//     nama: document.getElementById("newNama").value,
//     noKadPengenalan: parseInt(document.getElementById("newKadPengenalan").value, 10),
//     tahunLahir: document.getElementById("newtahunLahir").value,
//     tahunSemasa: document.getElementById("newtahunSemasa").value,
//     umur: parseInt(document.getElementById("newUmur").value, 10),
//     jantina: document.getElementById("newJantina").value,
//     jawatan: document.getElementById("newJawatan").value,
//     gred: document.getElementById("newGred").value,
//     penyandang: document.getElementById("newPenyandang").value,
//     kumpJawatan: document.getElementById("newkumpJawatan").value,
//     statusJawatan: document.getElementById("newstatusJawatan").value,
//     unit: document.getElementById("newUnit").value,
//     jabatan: document.getElementById("newJabatan").value,
//     ptj: document.getElementById("newPtj").value,
//     emel: document.getElementById("newEmel").value,
//     tarikhKhidmatUM: document.getElementById("newtarikhKhidmatUM").value,
//     tarikhKhidmatJPA: document.getElementById("newtarikhKhidmatJPA").value,
//     tarikhSahJawatan: document.getElementById("newtarikhSahJawatan").value,
//     tarikhNaikPangkat: document.getElementById("newtarikhNaikPangkat").value,
//     tarikhLantikSemasa: document.getElementById("newtarikhLantikSemasa").value,
//     tarikhAkhirKhidmat: document.getElementById("newtarikhAkhirKhidmat").value,
//     tarikhBersara: document.getElementById("newtarikhBersara").value,
//     umurBersara: document.getElementById("newUmurBersara").value,
//     bakiTempohPerkhidmatan: document.getElementById("newbakiTempohPerkhidmatan").value,
//     kelayakanAkademik: document.getElementById("newkelayakanAkademik").value,
//     lta: document.getElementById("newlta").value,
//     capacityBand: document.getElementById("newcapacityBand").value,
//     work: document.getElementById("newwork").value,
//     ideation: document.getElementById("newideation").value,
//     thinking: document.getElementById("newthinking").value,
//     motivation: document.getElementById("newmotivation").value,
//     learning: document.getElementById("newlearning").value,
//   };

//   fetch("http://localhost:3000/api/staff/add", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(newStaff),
//   })
//     .then((res) => {
//       if (!res.ok) throw new Error("Failed to add staff");
//       return res.json();
//     })
//     .then(() => {
//       alert("Staff added successfully");
//       new bootstrap.Modal(document.getElementById("addStaffModal")).hide();
//       document.getElementById("searchQuery").value = newStaff.noStaf;
//       searchStaffs();
//       resetAddStaffForm();
//     })
//     .catch((err) => {
//       console.error("Add Error:", err);
//       alert("Failed to add staff. Please try again.");
//     });

// });

// Update Staff
// document.getElementById("updateStaffBtn").addEventListener("click", () => {
//   const editStaffModal = document.getElementById("editStaffModal");
//   const hidemodal = bootstrap.Modal.getInstance(editStaffModal);

//   const updatedStaff = {
//     noStaf: document.getElementById("editNoStaff").value,
//     gelaran: document.getElementById("editGelaran").value,
//     nama: document.getElementById("editNama").value,
//     noKadPengenalan: document.getElementById("editKadPengenalan").value,
//     tahunLahir: document.getElementById("edittahunLahir").value,
//     tahunSemasa: document.getElementById("edittahunSemasa").value,
//     umur: document.getElementById("editUmur").value,
//     jantina: document.getElementById("editJantina").value,
//     jawatan: document.getElementById("editJawatan").value,
//     gred: document.getElementById("editGred").value,
//     penyandang: document.getElementById("editPenyandang").value,
//     kumpJawatan: document.getElementById("editkumpJawatan").value,
//     statusJawatan: document.getElementById("editstatusJawatan").value,
//     unit: document.getElementById("editUnit").value,
//     jabatan: document.getElementById("editJabatan").value,
//     ptj: document.getElementById("editPtj").value,
//     emel: document.getElementById("editEmel").value,
//     tarikhKhidmatUM: document.getElementById("edittarikhKhidmatUM").value,
//     tarikhKhidmatJPA: document.getElementById("edittarikhKhidmatJPA").value,
//     tarikhSahJawatan: document.getElementById("edittarikhSahJawatan").value,
//     tarikhNaikPangkat: document.getElementById("edittarikhNaikPangkat").value,
//     tarikhLantikSemasa: document.getElementById("edittarikhLantikSemasa").value,
//     tarikhAkhirKhidmat: document.getElementById("edittarikhAkhirKhidmat").value,
//     tarikhBersara: document.getElementById("edittarikhBersara").value,
//     umurBersara: document.getElementById("editUmurBersara").value,
//     bakiTempohPerkhidmatan: document.getElementById("editbakiTempohPerkhidmatan").value,
//     kelayakanAkademik: document.getElementById("editkelayakanAkademik").value,
//     lta: document.getElementById("editlta").value,
//     capacityBand: document.getElementById("editcapacityBand").value,
//     work: document.getElementById("editwork").value,
//     ideation: document.getElementById("editideation").value,
//     thinking: document.getElementById("editthinking").value,
//     motivation: document.getElementById("editmotivation").value,
//     learning: document.getElementById("editlearning").value,
//   };

//   fetch(`http://localhost:3000/api/staff/update/${editStaff._id}`, {
//     method: "PUT",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(updatedStaff),
//   })
//     .then((res) => {
//       if (!res.ok) throw new Error("Failed to update staff");
//       return res.json();
//     })
//     .then(() => {
//       alert("Staff updated successfully");
//       hidemodal.hide();
//       document.getElementById("searchQuery").value = updatedStaff.noStaf;
//       searchStaffs();     
//     })
//     .catch((err) => {
//       console.error("Update Error:", err);
//       alert("Failed to update staff. Please try again.");
//     });
    
// });




// Function to reset Form for Add Staff Modal
function resetAddStaffForm() {
  document.getElementById("newNoStaff").value = "";
    document.getElementById("newGelaran").value = "";
    document.getElementById("newNama").value= "";
    document.getElementById("newKadPengenalan").value = "";
    document.getElementById("newtahunLahir").value = "";
    document.getElementById("newtahunSemasa").value = "";
    document.getElementById("newUmur").value = "";
    document.getElementById("newJantina").value = "";
    document.getElementById("newJawatan").value = "";
    document.getElementById("newGred").value = "";
    document.getElementById("newPenyandang").value = "";
    document.getElementById("newkumpJawatan").value = "";
    document.getElementById("newstatusJawatan").value = "";
    document.getElementById("newUnit").value = "";
    document.getElementById("newJabatan").value = "";
    document.getElementById("newPtj").value = "";
    document.getElementById("newEmel").value = "";
    document.getElementById("newtarikhKhidmatUM").value ="";
    document.getElementById("newtarikhKhidmatJPA").value = "";
    document.getElementById("newtarikhSahJawatan").value = "";
    document.getElementById("newtarikhNaikPangkat").value = "";
    document.getElementById("newtarikhLantikSemasa").value = "";
    document.getElementById("newtarikhAkhirKhidmat").value = "";
    document.getElementById("newtarikhBersara").value = "";
    document.getElementById("newUmurBersara").value = "";
    document.getElementById("newbakiTempohPerkhidmatan").value = "";
    document.getElementById("newkelayakanAkademik").value = "";
    document.getElementById("newlta").value = "";
    document.getElementById("newcapacityBand").value ="";
    document.getElementById("newwork").value = "";
    document.getElementById("newideation").value = "";
    document.getElementById("newthinking").value = "";
    document.getElementById("newmotivation").value = "";
    document.getElementById("newlearning").value = "";
}

// Initialize staff list on page load
searchStaffs();

// Event listeners
document.getElementById("searchBtn").addEventListener("click", searchStaffs);
document.getElementById("TitleLeft").addEventListener("click", function () {
  document.getElementById("searchQuery").value = '';
  searchStaffs();
});
document.getElementById("searchQuery").addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    searchStaffs();
  }
});




// Add event listeners for validation
document.getElementById("addStaffBtn").addEventListener("click", validateAddStaffForm);
document.getElementById("updateStaffBtn").addEventListener("click", validateEditStaffForm);

function validateAddStaffForm() {
  let isValid = true;
  const requiredFields = [
    { id: "newNoStaff", name: "No. Staf" },
    { id: "newNama", name: "Nama" },
    { id: "newKadPengenalan", name: "Kad Pengenalan" }
  ];

  requiredFields.forEach(field => {
    const element = document.getElementById(field.id);
    if (!element.value.trim()) {
      alert(`Please fill out the ${field.name} field.`);
      isValid = false;
    }
  });

  if (isValid) {
    addNewStaff();
  }
}

function validateEditStaffForm() {
  let isValid = true;
  const requiredFields = [
    { id: "editNoStaff", name: "No. Staf" },
    { id: "editNama", name: "Nama" },
    { id: "editKadPengenalan", name: "Kad Pengenalan" }
  ];

  requiredFields.forEach(field => {
    const element = document.getElementById(field.id);
    if (!element.value.trim()) {
      alert(`Please fill out the ${field.name} field.`);
      isValid = false;
    }
  });

  if (isValid) {
    updateStaffDetails();
  }
}

// Function to add new staff
function addNewStaff() {
  const addStaffModal = document.getElementById("addStaffModal");
  const addModal = bootstrap.Modal.getInstance(addStaffModal);

  const newStaff = {
    noStaf: parseInt(document.getElementById("newNoStaff").value, 10),
    gelaran: document.getElementById("newGelaran").value,
    nama: document.getElementById("newNama").value,
    noKadPengenalan: parseInt(document.getElementById("newKadPengenalan").value, 10),
    tahunLahir: document.getElementById("newtahunLahir").value,
    tahunSemasa: document.getElementById("newtahunSemasa").value,
    umur: parseInt(document.getElementById("newUmur").value, 10),
    jantina: document.getElementById("newJantina").value,
    jawatan: document.getElementById("newJawatan").value,
    gred: document.getElementById("newGred").value,
    penyandang: document.getElementById("newPenyandang").value,
    kumpJawatan: document.getElementById("newkumpJawatan").value,
    statusJawatan: document.getElementById("newstatusJawatan").value,
    unit: document.getElementById("newUnit").value,
    jabatan: document.getElementById("newJabatan").value,
    ptj: document.getElementById("newPtj").value,
    emel: document.getElementById("newEmel").value,
    tarikhKhidmatUM: document.getElementById("newtarikhKhidmatUM").value,
    tarikhKhidmatJPA: document.getElementById("newtarikhKhidmatJPA").value,
    tarikhSahJawatan: document.getElementById("newtarikhSahJawatan").value,
    tarikhNaikPangkat: document.getElementById("newtarikhNaikPangkat").value,
    tarikhLantikSemasa: document.getElementById("newtarikhLantikSemasa").value,
    tarikhAkhirKhidmat: document.getElementById("newtarikhAkhirKhidmat").value,
    tarikhBersara: document.getElementById("newtarikhBersara").value,
    umurBersara: document.getElementById("newUmurBersara").value,
    bakiTempohPerkhidmatan: document.getElementById("newbakiTempohPerkhidmatan").value,
    kelayakanAkademik: document.getElementById("newkelayakanAkademik").value,
    lta: document.getElementById("newlta").value,
    capacityBand: document.getElementById("newcapacityBand").value,
    work: document.getElementById("newwork").value,
    ideation: document.getElementById("newideation").value,
    thinking: document.getElementById("newthinking").value,
    motivation: document.getElementById("newmotivation").value,
    learning: document.getElementById("newlearning").value,
  };

  fetch("https://eleap-backend.onrender.com/api/staff/add", {
    method: "POST",
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
  },
    body: JSON.stringify(newStaff),
  })
    .then((res) => {
      if (!res.ok) throw new Error("Failed to add staff");
      return res.json();
    })
    .then(() => {
      addModal.hide();
      document.getElementById("searchQuery").value = newStaff.noStaf;
      searchStaffs();
      resetAddStaffForm();
    })
    .catch((error) => {
      alert(error.message);
    });
}

// Function to update staff details
function updateStaffDetails() {
  const editStaffModal = document.getElementById("editStaffModal");
  const hidemodal = bootstrap.Modal.getInstance(editStaffModal);

  const updatedStaff = {
    noStaf: document.getElementById("editNoStaff").value,
    gelaran: document.getElementById("editGelaran").value,
    nama: document.getElementById("editNama").value,
    noKadPengenalan: document.getElementById("editKadPengenalan").value,
    tahunLahir: document.getElementById("edittahunLahir").value,
    tahunSemasa: document.getElementById("edittahunSemasa").value,
    umur: document.getElementById("editUmur").value,
    jantina: document.getElementById("editJantina").value,
    jawatan: document.getElementById("editJawatan").value,
    gred: document.getElementById("editGred").value,
    penyandang: document.getElementById("editPenyandang").value,
    kumpJawatan: document.getElementById("editkumpJawatan").value,
    statusJawatan: document.getElementById("editstatusJawatan").value,
    unit: document.getElementById("editUnit").value,
    jabatan: document.getElementById("editJabatan").value,
    ptj: document.getElementById("editPtj").value,
    emel: document.getElementById("editEmel").value,
    tarikhKhidmatUM: document.getElementById("edittarikhKhidmatUM").value,
    tarikhKhidmatJPA: document.getElementById("edittarikhKhidmatJPA").value,
    tarikhSahJawatan: document.getElementById("edittarikhSahJawatan").value,
    tarikhNaikPangkat: document.getElementById("edittarikhNaikPangkat").value,
    tarikhLantikSemasa: document.getElementById("edittarikhLantikSemasa").value,
    tarikhAkhirKhidmat: document.getElementById("edittarikhAkhirKhidmat").value,
    tarikhBersara: document.getElementById("edittarikhBersara").value,
    umurBersara: document.getElementById("editUmurBersara").value,
    bakiTempohPerkhidmatan: document.getElementById("editbakiTempohPerkhidmatan").value,
    kelayakanAkademik: document.getElementById("editkelayakanAkademik").value,
    lta: document.getElementById("editlta").value,
    capacityBand: document.getElementById("editcapacityBand").value,
    work: document.getElementById("editwork").value,
    ideation: document.getElementById("editideation").value,
    thinking: document.getElementById("editthinking").value,
    motivation: document.getElementById("editmotivation").value,
    learning: document.getElementById("editlearning").value,
  };

  fetch(`https://eleap-backend.onrender.com/api/staff/update/${editStaff._id}`, {
    method: "PUT",
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
  },
    body: JSON.stringify(updatedStaff),
  })
    .then((response) => {
      if (!response.ok) throw new Error("Failed to update staff");
      return response.json();
    })
    .then(() => {
      hidemodal.hide();
      document.getElementById("searchQuery").value = updatedStaff.noStaf;
      searchStaffs();
    })
    .catch((error) => {
      alert("Error updating staff: " + error.message);
    });
}

document.getElementById('logoutBtn').addEventListener('click', function() {
  localStorage.removeItem('token');
  window.location.href = 'index.html';
});
