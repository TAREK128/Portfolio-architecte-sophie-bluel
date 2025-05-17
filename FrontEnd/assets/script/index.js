const gallery = document.querySelector(".gallery");
let allWorks = [];

// 1. جلب الأعمال
async function getworks() {
    try {
        const response = await fetch("http://localhost:5678/api/works");
        return await response.json();
    } catch (error) {
        console.error("Erreur lors de la récupération :", error);
        return [];
    }
}

// 2. عرض الأعمال في المعرض
function showWorks(works) {
    gallery.innerHTML = "";

    works.forEach(work => {
        const figure = document.createElement("figure");
        const img = document.createElement("img");
        const caption = document.createElement("figcaption");

        img.src = work.imageUrl;
        img.alt = work.title;
        caption.innerText = work.title;

        figure.appendChild(img);
        figure.appendChild(caption);
        gallery.appendChild(figure);
    });
}

// 3. عرض الكل
function showAllWorks() {
    showWorks(allWorks);
}

// 4. الفلترة حسب الفئة
function filterWorksByCategory(categoryId) {
    const filtered = allWorks.filter(work => work.categoryId === categoryId);
    showWorks(filtered);
}

// 5. إنشاء الفلاتر
async function getCat() {
    const categories = await getCategories();

    const filtersDiv = document.createElement("div");
    filtersDiv.classList.add("filters");

    const allBtn = document.createElement("button");
    allBtn.textContent = "Tous";
    allBtn.classList.add("filter-btn");
    allBtn.dataset.categoryId = 0;
    allBtn.addEventListener("click", showAllWorks);
    filtersDiv.appendChild(allBtn);

    categories.forEach(category => {
        const categoryBtn = document.createElement("button");
        categoryBtn.textContent = category.name;
        categoryBtn.classList.add("filter-btn");
        categoryBtn.dataset.categoryId = category.id;

        categoryBtn.addEventListener("click", () => {
            filterWorksByCategory(category.id);
        });

        filtersDiv.appendChild(categoryBtn);
    });

    document.querySelector("#filters").appendChild(filtersDiv);
}
getCat();

// 6. التهيئة عند تحميل الصفحة
async function initGallery() {
    allWorks = await getworks();
    showWorks(allWorks);
}
initGallery();

/*************************************************************************/
//لتسجيل الخروج بعد الدخول للموقع كمسؤول
  document.addEventListener("DOMContentLoaded", function () {
    const loginLink = document.getElementById("login-link");
    const token = localStorage.getItem("token");
  
    if (token && loginLink) {
      loginLink.textContent = "logout";
  
      loginLink.addEventListener("click", () => {
        // تسجيل الخروج
        localStorage.removeItem("token");
        window.location.reload(); // إعادة تحميل الصفحة لتحديث الواجهة
      });
    }
  });
//****************************************************************/

// اخفاء الفلاتر عند تسجيل الدخول كمسؤول الى الموقع 
  document.addEventListener("DOMContentLoaded", function() {
  const token = localStorage.getItem("token");

  if (token) {
    // إظهار زر "Modifier"
    const modifierLink = document.getElementById("modifier-link");
    if (modifierLink) {
      modifierLink.classList.remove("hidden");
    }

    // إخفاء الفلاتر
    const filters = document.getElementById("filters");
    if (filters) {
      filters.style.display = "none";
    }
  }
});
///**************** modifierاخفاء واضهار زر  ******************************/

document.addEventListener("DOMContentLoaded", function () {
  const modifierBtn = document.getElementById("modifier-link");
  const token = localStorage.getItem("token");

  if (modifierBtn) {
    if (token) {
      // إذا كان هناك توكن، يتم عرض الزر
      modifierBtn.style.display = "flex";  // عرض الزر
    } else {
      // إذا لم يكن هناك توكن، يتم إخفاء الزر
      modifierBtn.style.display = "none";  // إخفاء الزر
    }
  }
});

//************************************* */
//المودال

// دالة جلب الصور الموجودة
async function fetchExistingImages() {
  try {
    const response = await fetch("http://localhost:5678/api/works", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    });

    if (response.ok) {
      const data = await response.json();
      displayImagesInModal(data); // عرض الصور في المودال
    } else {
      alert("فشل جلب الصور.");
    }
  } catch (error) {
    console.error("خطأ أثناء جلب الصور:", error);
  }
}

// دالة ملء الفئات
async function populateCategorySelect() {
  const categorySelect = document.getElementById("category");
  categorySelect.innerHTML = ""; // تفريغ القائمة قبل تعبئتها

  try {
    const response = await fetch("http://localhost:5678/api/categories");

    if (response.ok) {
      const categories = await response.json();

      categories.forEach(category => {
        const option = document.createElement("option");
        option.value = category.id;
        option.textContent = category.name;
        categorySelect.appendChild(option);
      });
    } else {
      alert("فشل في جلب الفئات.");
    }
  } catch (error) {
    console.error("خطأ أثناء جلب الفئات:", error);
  }
}

//  1دالة عرض الصور في المودال


// دالة إضافة عمل جديد إلى المعرض
function addWorkToGallery(newWork) {
  const uploadGallery = document.getElementById("upload-gallery");
  renderWorkItem(newWork, uploadGallery);
}

// باقي الأكواد الخاصة بالمودال وإضافة الصور
function renderWorkItem(work, container, showDelete = false) {
  const figure = document.createElement("figure");
  figure.classList.add("modale-image-container");

  const img = document.createElement("img");
  img.src = work.imageUrl;
  img.alt = work.title;
  figure.appendChild(img);

  if (showDelete) {
    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete-button");
      deleteBtn.innerHTML = '<i class="fa-solid fa-trash-can" style="color: white;"></i>';
    deleteBtn.addEventListener("click", async () => {
      await deleteWork(work.id, figure, img.src);
    });
    figure.appendChild(deleteBtn);
  } else {
    const caption = document.createElement("figcaption");
    caption.textContent = work.title;
    figure.appendChild(caption);
  }

  container.appendChild(figure);
}

// دالة لحذف العمل
async function deleteWork(workId, figureElement, imageSrc) {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("يرجى تسجيل الدخول أولاً.");
      return;
    }

    const response = await fetch(`http://localhost:5678/api/works/${workId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (response.ok) {
      figureElement.remove();

      const galleryFigures = document.querySelectorAll(".gallery figure");
      galleryFigures.forEach(galleryFigure => {
        const galleryImg = galleryFigure.querySelector("img");
        if (galleryImg && galleryImg.src === imageSrc) {
          galleryFigure.remove();
        }
      });
    } else {
      alert("فشل الحذف من السيرفر.");
    }
  } catch (error) {
    console.error("خطأ أثناء الحذف:", error);
  }
}

// عند الضغط على زر "Modifier"
const modifierLink = document.getElementById("modifier-link");
const modale = document.getElementById("modale");
const closeModale = document.getElementById("close-modale");

if (modifierLink) {
  modifierLink.addEventListener("click", function () {
    modale.classList.add("show-modale");
    populateModaleGallery(); // تأكد أنها معرفة قبل هذا السطر
  });
}

if (closeModale) {
  closeModale.addEventListener("click", function () {
    modale.classList.remove("show-modale");
  });
}

window.addEventListener("click", function (event) {
  if (event.target === modale) {
    modale.classList.remove("show-modale");
  }
});

// عند الضغط على زر "Ajouter une photo"
const openUploadFormBtn = document.getElementById("open-upload-form");

if (openUploadFormBtn) {
  openUploadFormBtn.addEventListener("click", function () {
    const galleryView = document.getElementById("gallery-view");
    console.log("تفعيل الزر")
    const uploadView = document.getElementById("upload-view");

    galleryView.classList.add("hidden");
    uploadView.classList.remove("hidden");

    fetchExistingImages(); // جلب الصور
    populateCategorySelect(); // ملء الفئات
  });
}
// دالة لعرض الصور الموجودة في مودال المعرض (عند الضغط على "Modifier")
async function populateModaleGallery() {
  const modaleGallery = document.getElementById("modale-gallery");
  modaleGallery.innerHTML = "";

  try {
    const works = await fetch("http://localhost:5678/api/works");
    if (!works.ok) {
      throw new Error("فشل تحميل الصور من الخادم");
    }

    const data = await works.json();
    data.forEach(work => {
      renderWorkItem(work, modaleGallery, true);
    });
  } catch (error) {
    console.error("خطأ أثناء تحميل الصور:", error);
  }
}
//////////////////////////////////////////
/////////////////////////////////////////
////////////////////////////////////////
const imageInput = document.getElementById("image");
const validateBtn = document.querySelector("#submit-photo button");
//استقبال البيانات من النموذج عند الضغط على "Valider
//هذا الحدث يبدأ عملية إرسال الصورة الجديدة إلى الخادم.
validateBtn.addEventListener("click", async function (e) {
  e.preventDefault();

  const file = imageInput.files[0];
  const title = document.getElementById("title").value.trim();
  const category = document.getElementById("category").value;

  if (!file || !title || !category) {
    alert("Veuillez remplir tous les champs.");
    return;
  }
// إنشاء البيانات باستخدام FormData
//يتم تجهيز الصورة والعنوان والفئة للإرسال إلى الـ API
  const formData = new FormData();
  formData.append("image", file);
  formData.append("title", title);
  formData.append("category", category);
// إرسال الطلب إلى السيرفر
//يتم إرسال البيانات باستخدام POST مع توكن المصادقة
  try {
    const response = await fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: formData
    });
//عرض العمل الجديد في المعرض والمودال
//يتم إضافة العنصر الجديد مباشرة إلى المعرض
    if (response.ok) {
      const newWork = await response.json();

      // أضف العمل الجديد للمودال
      const modaleGallery = document.getElementById("modale-gallery");
      renderWorkItem(newWork, modaleGallery, true);

      // أضف العمل الجديد للموقع الرئيسي
      const mainGallery = document.querySelector(".gallery");
      renderWorkItem(newWork, mainGallery);

      // إعادة تعيين النموذج
      imageInput.value = "";
      document.getElementById("title").value = "";
      document.getElementById("category").value = "";

      const oldPreview = imagePlaceholder.querySelector("img");
  if (oldPreview) oldPreview.remove();

  // إعادة الأيقونة الأصلية
  if (!imagePlaceholder.querySelector("i")) {
    const newIcon = document.createElement("i");
    newIcon.className = "fa-regular fa-image";
    imagePlaceholder.insertBefore(newIcon, addPhotoBtn);
  }

  alert("Image ajoutée avec succès !");
}
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'image :", error);
  }
});
///////////////////////////////////////////////////
const emageInput = document.getElementById("image"); // الإدخال الغير مرئي لاختيار صورة
const addPhotoBtn = document.getElementById("add-photo-btn"); // الزر
const imagePlaceholder = document.querySelector(".image-upload-placeholder"); // الحاوية الكاملة
const iconElement = imagePlaceholder.querySelector("i"); // الأيقونة التي سنحذفها

//إذا ضغط المستخدم الزر، افتح له نافذة اختيار صورة
addPhotoBtn.addEventListener("click", (e) => {
  e.preventDefault(); // نمنع السلوك الافتراضي (مثلاً لو الزر داخل نموذج)
  emageInput.click(); // نفتح نافذة اختيار صورة
});


//ذا تم اختيار صورة، اقرأها واعرضها، واحذف الأيقونةا*

imageInput.addEventListener("change", () => {
  const file = emageInput.files[0];

  if (file) {
    const reader = new FileReader();

    reader.onload = function (e) {
      if (iconElement) iconElement.remove();

      //  نحذف أي صورة سابقة إن وُجدت
      const oldPreview = imagePlaceholder.querySelector("img");
      if (oldPreview) oldPreview.remove();

      const imgPreview = document.createElement("img");
      imgPreview.src = e.target.result;
      imgPreview.classList.add("preview-image");

      imagePlaceholder.insertBefore(imgPreview, addPhotoBtn);
    };

    reader.readAsDataURL(file);
  }
});

//زر الرجوع الى المودال
document.getElementById("show-gallery").addEventListener("click", function(event) {
  event.preventDefault();

 console.log("الرجوع للخلف")
 const uploadView = document.getElementById("upload-view");
 uploadView.classList.add("hidden")
// إظهار صفحة المعرض
  const galleryView = document.getElementById("gallery-view");
  galleryView.classList.remove("hidden")
});