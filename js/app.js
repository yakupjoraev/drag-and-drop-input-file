const dropDelete = document.querySelector('.drop__delete');
const headerText = document.querySelector('.drop__header-text');
const dropForm = document.querySelector('.drop__form');
const progressLine = document.querySelector('.drop__progress-line-inner');
const fileInput = document.getElementById('drop-input');
const labelText = document.querySelector('.drop__label-text')
let isDraggingOver = false; // Переменная для отслеживания состояния перетаскивания

function handleFileUpload() {
  const fileInput = document.getElementById('drop-input');
  const file = fileInput.files[0];

  const allowedExtensions = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'zip', 'rar'];
  const fileExtension = file.name.split('.').pop().toLowerCase();
  if (!allowedExtensions.includes(fileExtension)) {
    // Файл имеет недопустимое расширение
    alert('Пожалуйста, выберите файлы с расширениями: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, ZIP, RAR.');
    return;
  }

  const maxSizeInBytes = 100 * 1024 * 1024; // 100 МБ
  if (file.size > maxSizeInBytes) {
    // Файл превышает максимальный размер
    alert('Максимальный размер файла составляет 100 МБ.');
    return;
  }


  // Проверка наличия файла
  if (file) {
    const reader = new FileReader();

    reader.onloadstart = function () {
      // Показать блок загрузки
      document.querySelector('.drop__progress').style.display = 'flex';
      // Показать прогресс загрузки
      progressLine.style.width = '0%';
      // Очистить текст в заголовке
      headerText.textContent = '';
      // Удалить классы successfully и error
      dropForm.classList.remove('successfully', 'error');
    };

    reader.onprogress = function (e) {
      if (e.lengthComputable) {
        const percentLoaded = Math.round((e.loaded / e.total) * 100);
        // Обновить ширину прогресс-линии
        progressLine.style.width = percentLoaded + '%';
      }
    };

    reader.onload = function () {
      // Загрузка файла завершена
      progressLine.style.width = '0%'; // Сначала установите ширину на 0%
      setTimeout(function () {
        progressLine.style.width = '100%'; // Затем установите ширину на 100% через 1 секунду
      }, 1000);
      // Остальной код...

      // Загрузка файла завершена
      progressLine.style.width = '100%';
      // Отобразить название загруженного файла
      headerText.textContent = file.name;
      // Добавить класс successfully
      dropForm.classList.add('successfully');
      // Показать блок удаления
      dropDelete.style.display = 'flex';

      labelText.textContent = 'Загрузить другой';

      // Задержка перед скрытием блока загрузки
      setTimeout(function () {
        document.querySelector('.drop__progress').style.display = 'none';
      }, 1000);
    };

    reader.onerror = function () {
      // Ошибка при загрузке файла
      // Очистить текст в заголовке
      headerText.textContent = '';
      // Добавить класс error
      dropForm.classList.add('error');
      // Скрыть блок удаления
      dropDelete.style.display = 'none';

      labelText.textContent = 'Загрузить повторно';

      // Задержка перед скрытием блока загрузки
      setTimeout(function () {
        document.querySelector('.drop__progress').style.display = 'none';
      }, 1000);
    };

    reader.readAsDataURL(file);
  }
}


function deleteUploadedFile() {
  fileInput.value = ''; // Очистить значение input-элемента для удаления файла
  // Вернуть текст в headerText
  headerText.textContent = 'Перетащите сюда файлы или нажмите';
  // Скрыть блок удаления
  dropDelete.style.display = 'none';
  // Удалить классы successfully и error
  dropForm.classList.remove('successfully', 'error');
  // Сбросить прогресс загрузки
  progressLine.style.width = '0%';

  labelText.textContent = 'Загрузить';
}



// Обработчик события изменения файла
document.getElementById('drop-input').addEventListener('change', handleFileUpload);

// Обработчик события клика на блок удаления
dropDelete.addEventListener('click', deleteUploadedFile);

// Обработчик события перетаскивания элемента над drop__form
dropForm.addEventListener('dragover', function (e) {
  e.preventDefault();
  if (!isDraggingOver) {
    dropForm.classList.add('dragover');
    isDraggingOver = true;
  }
});

// Обработчик события покидания элемента drop__form перетаскиваемым элементом
dropForm.addEventListener('dragleave', function (e) {
  e.preventDefault();
  if (e.relatedTarget === null || e.relatedTarget.closest('.drop__form') !== dropForm) {
    dropForm.classList.remove('dragover');
    isDraggingOver = false;
  }
});


// Обработчик события отпускания элемента в drop__form
dropForm.addEventListener('drop', function (e) {
  e.preventDefault();
  dropForm.classList.remove('dragover');
  isDraggingOver = false;

  // Получите перетаскиваемый файл
  const file = e.dataTransfer.files[0];

  // Поместите файл в элемент input
  if (file) {
    fileInput.files = e.dataTransfer.files;
    handleFileUpload(); // Вызовите функцию обработки загрузки файла
  }
});

// Обработчик события изменения файла
fileInput.addEventListener('change', handleFileUpload);
