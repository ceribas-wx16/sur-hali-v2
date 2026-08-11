/* ==========================================================
   SUR HALI İZNİK
   ANA SİTE JAVASCRIPT
   ========================================================== */

console.log("Sur Halı site.js başlatılıyor...");


/* ==========================================================
   SABİTLER
   ========================================================== */

const WHATSAPP_NUMBER = "905396369095";

const KATEGORILER = [
    "Halılar",
    "Klasik Yolluklar",
    "Sisal",
    "Kaymaz",
    "Özel Kesim"
];


/* ==========================================================
   HTML GÜVENLİĞİ
   ========================================================== */

function escapeHTML(value) {

    if (
        value === null ||
        value === undefined
    ) {
        return "";
    }

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* ==========================================================
   FİYAT
   ========================================================== */

function fiyatFormatla(value) {

    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return "Fiyat için bilgi alınız";
    }

    const number = Number(value);

    if (Number.isNaN(number)) {
        return escapeHTML(value);
    }

    return number.toLocaleString(
        "tr-TR",
        {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        }
    ) + " TL";
}


/* ==========================================================
   WHATSAPP
   ========================================================== */

function whatsappLinkOlustur(product) {

    const mesaj =
        `Merhaba, ${product.name || "ürün"} ürünü hakkında bilgi almak istiyorum.`;

    return (
        "https://wa.me/" +
        WHATSAPP_NUMBER +
        "?text=" +
        encodeURIComponent(mesaj)
    );
}


/* ==========================================================
   ÜRÜN RESMİ
   ========================================================== */

function urunResmi(product, imagesMap) {

    const images =
        imagesMap[product.id] || [];

    if (
        images.length > 0 &&
        images[0].image_url
    ) {
        return images[0].image_url;
    }

    if (product.image_url) {
        return product.image_url;
    }

    return "";
}


/* ==========================================================
   ÜRÜN KARTI
   ========================================================== */

function urunKartiOlustur(
    product,
    imagesMap
) {

    const image =
        urunResmi(
            product,
            imagesMap
        );

    const imageHTML = image

        ? `
            <img
                src="${escapeHTML(image)}"
                alt="${escapeHTML(product.name)}"
                loading="lazy"
            >
          `

        : `
            <div class="product-no-image">
                <span>Sur Halı</span>
                <small>Görsel hazırlanıyor</small>
            </div>
          `;


    return `

        <article
            class="product-card"
            data-product-id="${escapeHTML(product.id)}"
        >

            <a
                href="#"
                class="product-image"
                data-product-id="${escapeHTML(product.id)}"
            >

                ${imageHTML}

            </a>


            <div class="product-info">

                <span class="product-category">
                    ${escapeHTML(product.category || "")}
                </span>


                <h3>
                    ${escapeHTML(product.name || "Ürün")}
                </h3>


                ${
                    product.size
                    ? `
                        <p class="product-size">
                            ${escapeHTML(product.size)}
                        </p>
                      `
                    : ""
                }


                ${
                    product.price !== null &&
                    product.price !== undefined
                    ? `
                        <div class="product-price">
                            ${fiyatFormatla(product.price)}
                        </div>
                      `
                    : `
                        <div class="product-price">
                            Bilgi için iletişime geçin
                        </div>
                      `
                }


                <a
                    href="${escapeHTML(
                        whatsappLinkOlustur(product)
                    )}"
                    class="product-whatsapp"
                    target="_blank"
                    rel="noopener"
                >
                    WhatsApp'tan Bilgi Al
                </a>

            </div>

        </article>

    `;
}


/* ==========================================================
   ÜRÜN VERİLERİNİ GETİR
   ========================================================== */

async function urunleriGetir() {

    console.log(
        "Supabase'den ürünler getiriliyor..."
    );


    const {
        data: products,
        error: productError
    } =
        await supabaseClient
            .from("products")
            .select(`
                id,
                name,
                category,
                size,
                price,
                description,
                image_url,
                is_active,
                created_at
            `)
            .eq(
                "is_active",
                true
            )
            .order(
                "created_at",
                {
                    ascending: false
                }
            );


    if (productError) {

        console.error(
            "Ürünler alınamadı:",
            productError
        );

        throw productError;
    }


    const aktifUrunler =
        products || [];


    console.log(
        aktifUrunler.length +
        " aktif ürün bulundu."
    );


    /* ======================================================
       ÜRÜN RESİMLERİNİ GETİR
       ====================================================== */

    const {
        data: images,
        error: imageError
    } =
        await supabaseClient
            .from("category_images")
            .select(`
                id,
                product_id,
                category,
                image_url,
                image_path,
                created_at
            `)
            .order(
                "created_at",
                {
                    ascending: true
                }
            );


    if (imageError) {

        console.warn(
            "Ürün resimleri alınamadı:",
            imageError
        );
    }


    const imagesMap = {};


    (images || []).forEach(
        function (image) {

            if (!image.product_id) {
                return;
            }


            if (
                !imagesMap[image.product_id]
            ) {

                imagesMap[image.product_id] =
                    [];
            }


            imagesMap[
                image.product_id
            ].push(image);

        }
    );


    return {
        products: aktifUrunler,
        imagesMap: imagesMap
    };
}


/* ==========================================================
   KATEGORİLERİ OLUŞTUR
   ========================================================== */

function kategorileriOlustur(
    products,
    imagesMap
) {

    const container =
        document.getElementById(
            "categoryProducts"
        );


    if (!container) {
        return;
    }


    container.innerHTML = "";


    KATEGORILER.forEach(
        function (category) {

            const categoryProducts =
                products.filter(
                    function (product) {

                        return (
                            product.category ===
                            category
                        );

                    }
                );


            /*
             * Kategoride ürün yoksa
             * o bölümü göstermiyoruz.
             */

            if (
                categoryProducts.length === 0
            ) {
                return;
            }


            const section =
                document.createElement(
                    "section"
                );


            section.className =
                "category-section";


            section.id =
                "kategori-" +
                category
                    .toLowerCase()
                    .replace(
                        /[^a-z0-9ğüşöçıİĞÜŞÖÇ]+/gi,
                        "-"
                    );


            section.innerHTML = `

                <div class="container">

                    <div class="section-heading">

                        <span>
                            SUR HALI
                        </span>

                        <h2>
                            ${escapeHTML(category)}
                        </h2>

                        <p>
                            ${categoryProducts.length}
                            ürün
                        </p>

                    </div>


                    <div class="products-grid">

                        ${categoryProducts
                            .map(
                                function (product) {

                                    return urunKartiOlustur(
                                        product,
                                        imagesMap
                                    );

                                }
                            )
                            .join("")
                        }

                    </div>

                </div>

            `;


            container.appendChild(
                section
            );

        }
    );


    /*
     * Hiç ürün yoksa
     */

    if (
        container.children.length === 0
    ) {

        container.innerHTML = `

            <section class="empty-products">

                <div class="container">

                    <h2>
                        Koleksiyonlarımız hazırlanıyor
                    </h2>

                    <p>
                        Çok yakında ürünlerimizi
                        burada görebileceksiniz.
                    </p>

                </div>

            </section>

        `;
    }
}


/* ==========================================================
   NAVİGASYON KATEGORİLERİ
   ========================================================== */

function kategoriMenusuOlustur() {

    const menu =
        document.getElementById(
            "categoryMenu"
        );


    if (!menu) {
        return;
    }


    menu.innerHTML = "";


    KATEGORILER.forEach(
        function (category) {

            const slug =
                category
                    .toLowerCase()
                    .replace(
                        /[^a-z0-9ğüşöçıİĞÜŞÖÇ]+/gi,
                        "-"
                    );


            const link =
                document.createElement(
                    "a"
                );


            link.href =
                "#kategori-" +
                slug;


            link.textContent =
                category;


            menu.appendChild(
                link
            );

        }
    );
}


/* ==========================================================
   MOBİL MENÜ
   ========================================================== */

function mobilMenuHazirla() {

    const menuButton =
        document.getElementById(
            "mobileMenuButton"
        );


    const navigation =
        document.getElementById(
            "mainNavigation"
        );


    if (
        !menuButton ||
        !navigation
    ) {
        return;
    }


    menuButton.addEventListener(
        "click",
        function () {

            navigation.classList.toggle(
                "mobile-open"
            );

        }
    );


    navigation
        .querySelectorAll("a")
        .forEach(
            function (link) {

                link.addEventListener(
                    "click",
                    function () {

                        navigation.classList.remove(
                            "mobile-open"
                        );

                    }
                );

            }
        );
}


/* ==========================================================
   ANA SİTEYİ BAŞLAT
   ========================================================== */

async function siteyiBaslat() {

    console.log(
        "Sur Halı ana sitesi başlatılıyor..."
    );


    const productContainer =
        document.getElementById(
            "categoryProducts"
        );


    try {

        kategoriMenusuOlustur();

        mobilMenuHazirla();


        if (productContainer) {

            productContainer.innerHTML = `

                <div class="loading-products">

                    <div class="loading-spinner"></div>

                    <p>
                        Ürünler yükleniyor...
                    </p>

                </div>

            `;
        }


        const {
            products,
            imagesMap
        } =
            await urunleriGetir();


        kategorileriOlustur(
            products,
            imagesMap
        );


        console.log(
            "Sur Halı ana sitesi başarıyla hazır."
        );


    } catch (error) {

        console.error(
            "Site başlatma hatası:",
            error
        );


        if (productContainer) {

            productContainer.innerHTML = `

                <div class="site-error">

                    <h2>
                        Ürünler şu anda yüklenemiyor.
                    </h2>

                    <p>
                        Lütfen daha sonra tekrar deneyin.
                    </p>

                </div>

            `;
        }
    }
}


/* ==========================================================
   DOM HAZIR
   ========================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        siteyiBaslat();

    }
);
