const dropDelete = document.querySelector('.drop__delete');
const headerText = document.querySelector('.drop__header-text');
const dropForm = document.querySelector('.drop__form');
const progressLine = document.querySelector('.drop__progress-line-inner');
const fileInput = document.getElementById('drop-input');
const labelText = document.querySelector('.drop__label-text')
let isDraggingOver = false; // Переменная для отслеживания состояния перетаскивания

function handleFileUpload() {
  const files = fileInput.files;

  const allowedExtensions = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'zip', 'rar'];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
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
  }

  // Очистить текст в заголовке
  headerText.textContent = '';

  // Здесь может быть другой код, который не вызывает readAsDataURL у FileReader,
  // так как чтение каждого файла требует отдельного экземпляра FileReader.

  // Пример:
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const reader = new FileReader();

    // Обработчики событий для FileReader
    reader.onloadstart = function () {
      // Показать блок загрузки
      document.querySelector('.drop__progress').style.display = 'flex';
      // Показать прогресс загрузки
      progressLine.style.width = '0%';
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
      }, 100);

      // Отобразить название загруженного файла
      if (files.length === 1) {
        headerText.textContent = file.name;
      } else {
        headerText.textContent = files.length + ' файла';
      }

      // // Плавно показать текст
      // setTimeout(function () {
      //   headerText.style.opacity = '1';
      // }, 1000);

      // Добавить класс successfully
      dropForm.classList.add('successfully');
      // Показать блок удаления
      dropDelete.style.display = 'flex';

      labelText.textContent = 'Загрузить другой';

      // Задержка перед скрытием блока загрузки
      setTimeout(function () {
        document.querySelector('.drop__progress').style.display = 'none';
      }, 2000);
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



function getFilesWord(count) {
  const words = ['файл', 'файла', 'файлов'];
  const cases = [2, 0, 1, 1, 1, 2];
  const index = (count % 100 > 4 && count % 100 < 20) ? 2 : cases[(count % 10 < 5) ? count % 10 : 5];
  return words[index];
}

function deleteUploadedFile() {
  fileInput.value = ''; // Очистить значение input-элемента для удаления файлов
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
  if (e.relatedTarget !== dropForm && isDraggingOver) {
    dropForm.classList.remove('dragover');
    isDraggingOver = false;
  }
});

// Обработчик события отпускания файла на drop__form
dropForm.addEventListener('drop', function (e) {
  e.preventDefault();
  dropForm.classList.remove('dragover');
  isDraggingOver = false;
  fileInput.files = e.dataTransfer.files;
  handleFileUpload();
});

