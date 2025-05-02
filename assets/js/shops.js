document.addEventListener('DOMContentLoaded', function() {
    // JSON ma'lumotlarini yuklash
    fetch('assets/JSON/decent-parts.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Do'konlarni chiqarish
            displayShops(data);
            
            // Filtrlarni sozlash
            setupFilters(data);
        })
        .catch(error => {
            console.error('Xatolik yuz berdi:', error);
            document.getElementById('shops-container').innerHTML = 
                '<p class="error">Do\'konlar yuklanmadi. Iltimos, keyinroq urunib ko\'ring.</p>';
        });

    function displayShops(shopsData) {
        const container = document.getElementById('shops-container');
        container.innerHTML = '';

        // Agar ma'lumot bo'sh bo'lsa
        if (!shopsData || shopsData.length === 0) {
            container.innerHTML = '<p class="no-shops">Hozircha do\'konlar mavjud emas.</p>';
            return;
        }

        // Har bir do'kon uchun kartochka yaratish
        shopsData.forEach(shop => {
            const shopCard = document.createElement('div');
            shopCard.className = 'shop-card';
            
            // Mahsulotlar ro'yxati
            let productsList = '';
            if (shop.autoSubPart && shop.autoSubPart.length > 0) {
                productsList = '<div class="products-list"><h4>Mavjud mahsulotlar:</h4><ul>';
                shop.autoSubPart.forEach(subPart => {
                    productsList += `<li>${subPart.name} - ${subPart.products[0].price} so'm</li>`;
                });
                productsList += '</ul></div>';
            }

            shopCard.innerHTML = `
                <div class="shop-image">
                    <img src="${shop.image_url || 'assets/images/shops/default-shop.jpg'}" alt="${shop.autoPart}">
                </div>
                <div class="shop-info">
                    <h3>${shop.autoPart}</h3>
                    <p class="description">${shop.description}</p>
                    ${productsList}
                    <a href="#" class="view-btn">Batafsil <i class="fas fa-arrow-right"></i></a>
                </div>
            `;
            
            container.appendChild(shopCard);
        });
    }

    function setupFilters(shopsData) {
        const searchInput = document.getElementById('shop-search');
        const categoryFilter = document.getElementById('category-filter');
        const searchBtn = document.getElementById('search-btn');

        // Filtrlash funksiyasi
        function filterShops() {
            const searchTerm = searchInput.value.toLowerCase();
            const category = categoryFilter.value;
            
            const filteredShops = shopsData.filter(shop => {
                const matchesSearch = shop.autoPart.toLowerCase().includes(searchTerm) || 
                                     shop.description.toLowerCase().includes(searchTerm);
                const matchesCategory = category === 'all' || shop.autoPart === category;
                return matchesSearch && matchesCategory;
            });

            displayShops(filteredShops);
        }

        // Hodisalarni biriktirish
        searchBtn.addEventListener('click', filterShops);
        searchInput.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') filterShops();
        });
        categoryFilter.addEventListener('change', filterShops);
    }
});