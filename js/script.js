const filtersContainer = document.getElementById('filters-container');
const placesContainer = document.getElementById('places-container');


// ===============================
// ГЛОБАЛЬНЫЕ ДАННЫЕ
// ===============================

let allPlaces = [];
let allFilters = [];

let activeFilters = [];


// ===============================
// ЗАГРУЗКА ФИЛЬТРОВ
// ===============================

async function loadFilters() {

    try {

        const response = await fetch('data/filters.json');

        if (!response.ok) {
            throw new Error(
                `Ошибка загрузки filters.json: ${response.status}`
            );
        }

        const filters = await response.json();

        allFilters = filters;


        filters.forEach(filter => {

            const button = document.createElement('button');

            button.classList.add('filter-btn');

            button.dataset.filter = filter.id;

            button.style.setProperty(
                '--filter-color',
                filter.color
            );


            button.innerHTML = `
                <img
                    class="filter-btn-icon"
                    src="${filter.icon}"
                    alt=""
                >

                <span class="filter-btn-name">
                    ${filter.name}
                </span>
            `;


            // ===============================
            // КЛИК ПО ФИЛЬТРУ
            // ===============================

            button.addEventListener('click', () => {

                const filterId = filter.id;


                // ===============================
                // ЕСЛИ ФИЛЬТР УЖЕ ВЫБРАН
                // УДАЛЯЕМ ЕГО
                // ===============================

                if (activeFilters.includes(filterId)) {

                    activeFilters = activeFilters.filter(
                        id => id !== filterId
                    );

                    button.classList.remove('active');

                }


                // ===============================
                // ЕСЛИ ФИЛЬТР НЕ ВЫБРАН
                // ДОБАВЛЯЕМ ЕГО
                // ===============================

                else {

                    activeFilters.push(filterId);

                    button.classList.add('active');

                }


                // Запускаем фильтрацию
                filterPlaces();

            });


            filtersContainer.appendChild(button);

        });

    }

    catch (error) {

        console.error(
            'Ошибка загрузки фильтров:',
            error
        );

    }

}


// ===============================
// ЗАГРУЗКА МЕСТ
// ===============================

async function loadPlaces() {

    try {

        const placesResponse = await fetch(
            'data/places.json'
        );


        if (!placesResponse.ok) {

            throw new Error(
                `Ошибка загрузки places.json: ${placesResponse.status}`
            );

        }


        const places = await placesResponse.json();


        const filtersResponse = await fetch(
            'data/filters.json'
        );


        if (!filtersResponse.ok) {

            throw new Error(
                `Ошибка загрузки filters.json: ${filtersResponse.status}`
            );

        }


        const filters = await filtersResponse.json();


        allPlaces = places;
        allFilters = filters;


        // Показываем все карточки
        renderPlaces(
            allPlaces,
            allFilters
        );

    }

    catch (error) {

        console.error(
            'Ошибка загрузки карточек:',
            error
        );

    }

}


// ===============================
// ФИЛЬТРАЦИЯ КАРТОЧЕК
// ===============================

function filterPlaces() {

    // Если фильтров не выбрано,
    // показываем все карточки

    if (activeFilters.length === 0) {

        renderPlaces(
            allPlaces,
            allFilters
        );

        return;

    }


    // ===============================
    // ФИЛЬТРАЦИЯ
    // ===============================

    const filteredPlaces = allPlaces.filter(place => {

        // Карточка должна содержать
        // ВСЕ выбранные фильтры

        return activeFilters.every(filterId => {

            return place.tags.includes(filterId);

        });

    });


    // Отрисовываем результат

    renderPlaces(
        filteredPlaces,
        allFilters
    );

}


// ===============================
// ОТРИСОВКА КАРТОЧЕК
// ===============================

function renderPlaces(places, filters) {

    placesContainer.innerHTML = '';


    places.forEach(place => {

        const card = document.createElement('article');

        card.classList.add('card');


        // ===============================
        // ФОНОВОЕ ИЗОБРАЖЕНИЕ
        // ===============================

        card.style.setProperty(
            '--card-image',
            `url("${place.image}")`
        );


        // ===============================
        // ОСНОВНАЯ РАЗМЕТКА КАРТОЧКИ
        // ===============================

        card.innerHTML = `
            <div class="card-content">

                <h3 class="card-title">
                    ${place.title}
                </h3>

                <p class="card-description">
                    ${place.description}
                </p>

                <div class="card-tags"></div>

            </div>
        `;


        // ===============================
        // КОНТЕЙНЕР ТЕГОВ
        // ===============================

        const tagsContainer = card.querySelector(
            '.card-tags'
        );


        // ===============================
        // СОЗДАНИЕ ТЕГОВ
        // ===============================

        place.tags.forEach(tagId => {

            const filter = filters.find(
                filter => filter.id === tagId
            );


            if (!filter) {

                console.warn(
                    `Фильтр "${tagId}" не найден в filters.json`
                );

                return;

            }


            const tag = document.createElement('span');

            tag.classList.add('card-tag');


            tag.style.setProperty(
                '--tag-color',
                filter.color
            );


            tag.innerHTML = `
                <img
                    class="card-tag-icon"
                    src="${filter.icon}"
                    alt=""
                >

                <span>
                    ${filter.name}
                </span>
            `;


            tagsContainer.appendChild(tag);

        });


        // Добавляем карточку

        placesContainer.appendChild(card);

    });

}


// ===============================
// ЗАПУСК
// ===============================

loadFilters();
loadPlaces();