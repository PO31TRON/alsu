const menuContainer = document.getElementById('menu-categories');

async function loadMenu() {
    try {
        const response = await fetch('data/menu.json');
        const allItems = await response.json();
        renderGroupedMenu(allItems);
        observeMenuCards(); // из animation.js
    } catch (error) {
        console.error('Ошибка загрузки меню:', error);
        menuContainer.innerHTML = '<div class="alert alert-danger">Не удалось загрузить меню</div>';
    }
}

function renderGroupedMenu(items) {
    // Группировка по категориям
    const grouped = {};
    const categoryOrder = ["Закуски", "Салаты", "Супы", "Raw bar", "Паста/ризотто", "Стейки", "Гарниры", "Десерты"];

    items.forEach(item => {
        const cat = item.category || "Другое";
        if (!grouped[cat]) grouped[cat] = [];
        grouped[cat].push(item);
    });

    let html = '';
    for (const cat of categoryOrder) {
        if (!grouped[cat]) continue;
        html += `
            <div class="menu-category fade-up mb-5">
                <h2 class="category-title">${cat}</h2>
                <div class="row g-4">
                    ${renderItemsInTwoColumns(grouped[cat])}
                </div>
            </div>
        `;
    }
    // Если есть категории вне порядка ("Другое") — добавим в конец
    for (const cat in grouped) {
        if (!categoryOrder.includes(cat)) {
            html += `
                <div class="menu-category fade-up mb-5">
                    <h2 class="category-title">${cat}</h2>
                    <div class="row g-4">
                        ${renderItemsInTwoColumns(grouped[cat])}
                    </div>
                </div>
            `;
        }
    }
    menuContainer.innerHTML = html;
}

function renderItemsInTwoColumns(items) {
    // Разбиваем на две колонки (левую и правую)
    const mid = Math.ceil(items.length / 2);
    const leftCol = items.slice(0, mid);
    const rightCol = items.slice(mid);

    return `
        <div class="col-md-6">
            ${leftCol.map(item => renderMenuItem(item)).join('')}
        </div>
        <div class="col-md-6">
            ${rightCol.map(item => renderMenuItem(item)).join('')}
        </div>
    `;
}

function renderMenuItem(item) {
    return `
        <div class="menu-item d-flex justify-content-between align-items-start mb-3 pb-2 border-bottom border-secondary border-opacity-25">
            <div class="menu-item-info flex-grow-1">
                <div class="menu-item-name fw-semibold" style="color: var(--accent);">${escapeHtml(item.name)}</div>
                <div class="menu-item-description small text-secondary">${escapeHtml(item.description)}</div>
            </div>
            <div class="menu-item-price ms-3 fw-semibold" style="color: var(--accent); white-space: nowrap;">${item.price} ₽</div>
        </div>
    `;
}

function escapeHtml(str) {
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

document.addEventListener('DOMContentLoaded', loadMenu);