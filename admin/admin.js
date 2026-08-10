


/* ==========================================================
   SAYFA YÜKLENDİ
   SUPABASE
========================================================== */

document.addEventListener("DOMContentLoaded", function () {
const SUPABASE_URL =
    "https://lhltolrtgnfkbwfkpaex.supabase.co";

    console.log("DOM hazır.");
const SUPABASE_KEY =
    "sb_publishable_xdWMVRunvPSeiMw2vfGWyw_l6dTnBsn";

    const loginForm =
        document.getElementById("loginForm");

if (!window.supabase) {

    /* ======================================================
       GİRİŞ SAYFASI
    ====================================================== */
    console.error(
        "Supabase JS yüklenemedi."
    );

    if (loginForm) {
} else {

        console.log("Giriş sayfası bulundu.");
    console.log(
        "Supabase JS bulundu."
    );

        loginForm.addEventListener(
            "submit",
            girisYap
}


const supabaseClient =
    window.supabase
        ? window.supabase.createClient(
            SUPABASE_URL,
            SUPABASE_KEY
        )
        : null;


console.log(
    "supabaseClient:",
    typeof supabaseClient
);


/* ==========================================================
   SAYFA YÜKLENDİ
========================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        console.log(
            "DOM hazır."
        );

        return;
    }

        const loginForm =
            document.getElementById(
                "loginForm"
            );

    /* ======================================================
       ADMİN PANELİ
       
       ÖNEMLİ:
       HTML'de .admin-container yok.
       Sidebar + main-content var.
    ====================================================== */

    const sidebar =
        document.querySelector(".sidebar");
        /*
         * Admin panelinde loginForm yok.
         * Eğer aynı JS login sayfasında da kullanılıyorsa
         * login işlemi burada çalışır.
         */

    const mainContent =
        document.querySelector(".main-content");
        if (loginForm) {

            console.log(
                "Giriş sayfası bulundu."
            );

    if (sidebar && mainContent) {

        console.log("Admin paneli bulundu.");
            loginForm.addEventListener(
                "submit",
                girisYap
            );

        adminPanelBaslat();

    } else {
            return;
        }

        console.warn(
            "Admin paneli HTML elemanları bulunamadı."
        );

    }
        const sidebar =
            document.querySelector(
                ".sidebar"
            );


        const mainContent =
            document.querySelector(
                ".main-content"
            );


        if (
            sidebar &&
            mainContent
        ) {

            console.log(
                "Admin paneli bulundu."
            );


});
            adminPanelBaslat();

        } else {

            console.warn(
                "Admin paneli HTML elemanları bulunamadı."
            );

        }

    }
);


/* ==========================================================
@@ -71,48 +128,68 @@ async function girisYap(e) {

    e.preventDefault();


    const emailElement =
        document.getElementById("email");
        document.getElementById(
            "email"
        );


    const passwordElement =
        document.getElementById("password");
        document.getElementById(
            "password"
        );


    const mesaj =
        document.getElementById("loginMessage");
        document.getElementById(
            "loginMessage"
        );


    if (!emailElement || !passwordElement) {
    if (
        !emailElement ||
        !passwordElement
    ) {

        return;

    }


    const email =
        emailElement.value.trim();


    const password =
        passwordElement.value;


    if (mesaj) {
        mesaj.textContent = "";

        mesaj.textContent =
            "";

    }


    if (
        typeof supabaseClient ===
        "undefined"
    ) {
    if (!supabaseClient) {

        if (mesaj) {

            mesaj.textContent =
                "Supabase bağlantısı kurulamadı.";

        }


        console.error(
            "supabaseClient bulunamadı."
        );


        return;

    }


@@ -122,13 +199,12 @@ async function girisYap(e) {
            data,
            error
        } =
            await supabaseClient.auth.signInWithPassword({

                email: email,

                password: password

            });
            await supabaseClient.auth.signInWithPassword(
                {
                    email: email,
                    password: password
                }
            );


        if (error) {
@@ -138,12 +214,17 @@ async function girisYap(e) {
                error
            );


            if (mesaj) {

                mesaj.textContent =
                    error.message;

            }


            return;

        }


@@ -190,20 +271,14 @@ async function adminPanelBaslat() {
    );


    /* ======================================================
       SUPABASE KONTROLÜ
    ====================================================== */

    if (
        typeof supabaseClient ===
        "undefined"
    ) {
    if (!supabaseClient) {

        console.error(
            "supabaseClient bulunamadı."
            "Supabase bağlantısı bulunamadı."
        );

        return;

    }


@@ -228,19 +303,26 @@ async function adminPanelBaslat() {
            );

            return;

        }


        if (!data.session) {
        if (
            !data ||
            !data.session
        ) {

            console.warn(
                "Aktif oturum bulunamadı."
            );


            window.location.href =
                "admin-login.html";


            return;

        }


@@ -259,6 +341,7 @@ async function adminPanelBaslat() {
        );

        return;

    }


@@ -296,23 +379,34 @@ async function adminPanelBaslat() {

    function sayfaAc(pageId) {

        if (!pageId) {

            return;

        }


        console.log(
            "Sayfa açılıyor:",
            pageId
        );


        pages.forEach(function (page) {
        pages.forEach(
            function (page) {

            page.classList.remove(
                "active-page"
            );
                page.classList.remove(
                    "active-page"
                );

        });
            }
        );


        const targetPage =
            document.getElementById(pageId);
            document.getElementById(
                pageId
            );


        if (!targetPage) {
@@ -323,6 +417,7 @@ async function adminPanelBaslat() {
            );

            return;

        }


@@ -331,26 +426,28 @@ async function adminPanelBaslat() {
        );


        menuItems.forEach(function (item) {
        menuItems.forEach(
            function (item) {

            item.classList.remove(
                "active"
            );
                item.classList.remove(
                    "active"
                );


            if (
                item.getAttribute(
                    "data-page"
                ) === pageId
            ) {
                if (
                    item.getAttribute(
                        "data-page"
                    ) === pageId
                ) {

                item.classList.add(
                    "active"
                );
                    item.classList.add(
                        "active"
                    );

            }
                }

        });
            }
        );

    }

@@ -359,29 +456,35 @@ async function adminPanelBaslat() {
       SOL MENÜ
    ====================================================== */

    menuItems.forEach(function (menuItem) {
    menuItems.forEach(
        function (menuItem) {

        menuItem.addEventListener(
            "click",
            function (e) {
            menuItem.addEventListener(
                "click",
                function (e) {

                e.preventDefault();
                    e.preventDefault();

                const pageId =
                    menuItem.getAttribute(
                        "data-page"
                    );

                sayfaAc(pageId);
                    const pageId =
                        menuItem.getAttribute(
                            "data-page"
                        );

            }
        );

    });
                    sayfaAc(
                        pageId
                    );

                }
            );

        }
    );


    /* ======================================================
       DASHBOARD HIZLI BUTONLAR
       HIZLI BUTONLAR
    ====================================================== */

    const quickButtons =
@@ -390,23 +493,28 @@ async function adminPanelBaslat() {
        );


    quickButtons.forEach(function (button) {
    quickButtons.forEach(
        function (button) {

        button.addEventListener(
            "click",
            function () {
            button.addEventListener(
                "click",
                function () {

                const pageId =
                    button.getAttribute(
                        "data-page"
                    );
                    const pageId =
                        button.getAttribute(
                            "data-page"
                        );

                sayfaAc(pageId);

            }
        );
                    sayfaAc(
                        pageId
                    );

    });
                }
            );

        }
    );


    /* ======================================================
@@ -437,7 +545,8 @@ async function adminPanelBaslat() {
        );


    let duzenlenenUrunId = null;
    let duzenlenenUrunId =
        null;


    /* ======================================================
@@ -453,12 +562,16 @@ async function adminPanelBaslat() {


        if (message) {

            return message;

        }


        if (!productForm) {

            return null;

        }


@@ -508,7 +621,9 @@ async function adminPanelBaslat() {


        if (!message) {

            return;

        }


@@ -531,9 +646,7 @@ async function adminPanelBaslat() {
            message.style.color =
                "#246b36";

        }

        else {
        } else {

            message.style.border =
                "1px solid #d9534f";
@@ -562,6 +675,7 @@ async function adminPanelBaslat() {
            message.textContent =
                "";


            message.style.display =
                "none";

@@ -588,7 +702,9 @@ async function adminPanelBaslat() {


                if (productForm) {

                    productForm.reset();

                }


@@ -633,10 +749,12 @@ async function adminPanelBaslat() {
                formMesajiTemizle();


                productFormBox.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
                productFormBox.scrollIntoView(
                    {
                        behavior: "smooth",
                        block: "start"
                    }
                );

            }
        );
@@ -671,7 +789,9 @@ async function adminPanelBaslat() {


                if (productForm) {

                    productForm.reset();

                }


@@ -745,7 +865,9 @@ async function adminPanelBaslat() {
                        false
                    );


                    return;

                }


@@ -788,9 +910,12 @@ async function adminPanelBaslat() {
                        false
                    );


                    nameElement.focus();


                    return;

                }


@@ -801,31 +926,43 @@ async function adminPanelBaslat() {
                        false
                    );


                    categoryElement.focus();


                    return;

                }


                let price = null;
                let price =
                    null;


                if (priceText !== "") {
                if (
                    priceText !== ""
                ) {

                    price =
                        Number(priceText);
                        Number(
                            priceText
                        );


                    if (
                        Number.isNaN(price)
                        Number.isNaN(
                            price
                        )
                    ) {

                        formMesajiGoster(
                            "Fiyat bilgisi geçerli değil.",
                            false
                        );


                        return;

                    }

                }
@@ -855,9 +992,11 @@ async function adminPanelBaslat() {

                    const urunData = {

                        name: name,
                        name:
                            name,

                        category: category,
                        category:
                            category,

                        size:
                            size || null,
@@ -875,7 +1014,7 @@ async function adminPanelBaslat() {


                    /* ==========================================
                       ÜRÜN GÜNCELLE
                       GÜNCELLE
                    ========================================== */

                    if (duzenlenenUrunId) {
@@ -932,12 +1071,14 @@ async function adminPanelBaslat() {
                        } =
                            await supabaseClient
                                .from("products")
                                .insert([
                                    {
                                        ...urunData,
                                        image_url: null
                                    }
                                ])
                                .insert(
                                    [
                                        {
                                            ...urunData,
                                            image_url: null
                                        }
                                    ]
                                )
                                .select()
                                .single();

@@ -970,7 +1111,9 @@ async function adminPanelBaslat() {


                    if (productForm) {

                        productForm.reset();

                    }


@@ -1031,7 +1174,9 @@ async function adminPanelBaslat() {


                        saveButton.textContent =
                            "Ürünü Kaydet";
                            duzenlenenUrunId
                                ? "Güncelle"
                                : "Ürünü Kaydet";

                    }

@@ -1062,7 +1207,9 @@ async function adminPanelBaslat() {


        if (!productList) {

            return;

        }


@@ -1085,44 +1232,10 @@ async function adminPanelBaslat() {

            if (error) {

                console.error(
                    "Ürünler alınamadı:",
                    error
                throw new Error(
                    error.message
                );


                productList.innerHTML = `

                    <div class="empty-state">

                        <div class="empty-icon">
                            !
                        </div>

                        <h2>
                            Ürünler yüklenemedi
                        </h2>

                        <p>
                            ${escapeHTML(
                                error.message
                            )}
                        </p>

                    </div>

                `;


                if (productCount) {

                    productCount.textContent =
                        "0 ürün";

                }


                return;
            }


@@ -1162,6 +1275,7 @@ async function adminPanelBaslat() {


                return;

            }


@@ -1209,9 +1323,7 @@ async function adminPanelBaslat() {

                            <div
                                class="product-item"
                                data-product-id="${escapeHTML(
                                    product.id
                                )}"
                                data-product-id="${escapeHTML(product.id)}"
                                style="
                                    display:flex;
                                    justify-content:space-between;
@@ -1226,23 +1338,17 @@ async function adminPanelBaslat() {
                                >

                                    <h3>
                                        ${escapeHTML(
                                            product.name
                                        )}
                                        ${escapeHTML(product.name)}
                                    </h3>

                                    <p>
                                        <strong>Kategori:</strong>
                                        ${escapeHTML(
                                            product.category || "-"
                                        )}
                                        ${escapeHTML(product.category || "-")}
                                    </p>

                                    <p>
                                        <strong>Ölçü:</strong>
                                        ${escapeHTML(
                                            product.size || "-"
                                        )}
                                        ${escapeHTML(product.size || "-")}
                                    </p>

                                    <p>
@@ -1294,14 +1400,11 @@ async function adminPanelBaslat() {
                                        <button
                                            type="button"
                                            class="outline-button edit-product-button"
                                            data-id="${escapeHTML(
                                                product.id
                                            )}"
                                            data-id="${escapeHTML(product.id)}"
                                            style="
                                                padding:8px 12px;
                                                cursor:pointer;
                                                color:#D4AF37 !important;
                                                -webkit-text-fill-color:#D4AF37 !important;
                                                border:1px solid #D4AF37 !important;
                                                background:transparent !important;
                                                border-radius:6px;
@@ -1315,9 +1418,7 @@ async function adminPanelBaslat() {
                                        <button
                                            type="button"
                                            class="delete-product-button"
                                            data-id="${escapeHTML(
                                                product.id
                                            )}"
                                            data-id="${escapeHTML(product.id)}"
                                            style="
                                                padding:8px 14px;
                                                cursor:pointer;
@@ -1343,9 +1444,9 @@ async function adminPanelBaslat() {
                ).join("");


            /* ==============================================
            /* ==================================================
               DÜZENLE
            ============================================== */
            ================================================== */

            productList
                .querySelectorAll(
@@ -1383,7 +1484,9 @@ async function adminPanelBaslat() {
                                        "Ürün bulunamadı."
                                    );


                                    return;

                                }


@@ -1398,9 +1501,9 @@ async function adminPanelBaslat() {
                );


            /* ==============================================
            /* ==================================================
               SİL
            ============================================== */
            ================================================== */

            productList
                .querySelectorAll(
@@ -1438,7 +1541,9 @@ async function adminPanelBaslat() {
                                        "Ürün bulunamadı."
                                    );


                                    return;

                                }


@@ -1451,7 +1556,9 @@ async function adminPanelBaslat() {


                                if (!onay) {

                                    return;

                                }


@@ -1545,19 +1652,25 @@ async function adminPanelBaslat() {
                    </div>

                    <h2>
                        Hata oluştu
                        Ürünler yüklenemedi
                    </h2>

                    <p>
                        ${escapeHTML(
                            error.message
                        )}
                        ${escapeHTML(error.message)}
                    </p>

                </div>

            `;


            if (productCount) {

                productCount.textContent =
                    "0 ürün";

            }

        }

    }
@@ -1576,7 +1689,9 @@ async function adminPanelBaslat() {
            !productFormBox ||
            !newProductButton
        ) {

            return;

        }


@@ -1621,20 +1736,26 @@ async function adminPanelBaslat() {


        if (nameElement) {

            nameElement.value =
                product.name || "";

        }


        if (categoryElement) {

            categoryElement.value =
                product.category || "";

        }


        if (sizeElement) {

            sizeElement.value =
                product.size || "";

        }


@@ -1706,10 +1827,12 @@ async function adminPanelBaslat() {
            "none";


        productFormBox.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
        productFormBox.scrollIntoView(
            {
                behavior: "smooth",
                block: "start"
            }
        );

    }

@@ -1763,9 +1886,7 @@ async function adminPanelBaslat() {

        try {

            /* ==============================================
               TOPLAM ÜRÜN
            ============================================== */
            /* TOPLAM ÜRÜN */

            const {
                count: totalCount,
@@ -1798,9 +1919,7 @@ async function adminPanelBaslat() {
            }


            /* ==============================================
               AKTİF ÜRÜN
            ============================================== */
            /* AKTİF ÜRÜN */

            const {
                count: activeCount,
@@ -1837,9 +1956,7 @@ async function adminPanelBaslat() {
            }


            /* ==============================================
               RESİM SAYISI
            ============================================== */
            /* RESİM SAYISI */

            const {
                count: imageCount,
@@ -1872,9 +1989,7 @@ async function adminPanelBaslat() {
            }


            /* ==============================================
               STORAGE
            ============================================== */
            /* STORAGE */

            const storageUsage =
                document.getElementById(
@@ -1948,13 +2063,15 @@ async function adminPanelBaslat() {
                "Resim yönetimi elemanları bulunamadı."
            );


            return;

        }


        /* ==============================================
        /* ==================================================
           ÖNİZLEME
        ============================================== */
        ================================================== */

        imageFile.addEventListener(
            "change",
@@ -1974,7 +2091,9 @@ async function adminPanelBaslat() {

                    }


                    return;

                }


@@ -1987,12 +2106,15 @@ async function adminPanelBaslat() {
                    imageFile.value =
                        "";


                    imageMesajiGoster(
                        "Lütfen geçerli bir resim dosyası seçin.",
                        false
                    );


                    return;

                }


@@ -2024,9 +2146,9 @@ async function adminPanelBaslat() {
        );


        /* ==============================================
        /* ==================================================
           RESİM YÜKLE
        ============================================== */
        ================================================== */

        uploadImageButton.addEventListener(
            "click",
@@ -2050,7 +2172,9 @@ async function adminPanelBaslat() {
                        false
                    );


                    return;

                }


@@ -2061,11 +2185,16 @@ async function adminPanelBaslat() {
                        false
                    );


                    if (imageCategory) {

                        imageCategory.focus();

                    }


                    return;

                }


@@ -2080,7 +2209,9 @@ async function adminPanelBaslat() {
                        false
                    );


                    return;

                }


@@ -2097,7 +2228,9 @@ async function adminPanelBaslat() {
                        false
                    );


                    return;

                }


@@ -2145,9 +2278,7 @@ async function adminPanelBaslat() {
                        extension;


                    /* ==========================================
                       STORAGE
                    ========================================== */
                    /* STORAGE */

                    const {
                        error: uploadError
@@ -2181,13 +2312,10 @@ async function adminPanelBaslat() {
                    }


                    /* ==========================================
                       PUBLIC URL
                    ========================================== */
                    /* PUBLIC URL */

                    const {
                        data:
                            publicUrlData
                        data: publicUrlData
                    } =
                        supabaseClient
                            .storage
@@ -2206,32 +2334,30 @@ async function adminPanelBaslat() {
                            : null;


                    /* ==========================================
                       DATABASE
                    ========================================== */
                    /* DATABASE */

                    const {
                        data:
                            imageRecord,
                        error:
                            databaseError
                        data: imageRecord,
                        error: databaseError
                    } =
                        await supabaseClient
                            .from(
                                "category_images"
                            )
                            .insert([
                                {
                                    category:
                                        category,
                            .insert(
                                [
                                    {
                                        category:
                                            category,

                                    image_path:
                                        filePath,
                                        image_path:
                                            filePath,

                                    image_url:
                                        imageUrl
                                }
                            ])
                                        image_url:
                                            imageUrl
                                    }
                                ]
                            )
                            .select()
                            .single();

@@ -2243,9 +2369,11 @@ async function adminPanelBaslat() {
                            .from(
                                "category-images"
                            )
                            .remove([
                                filePath
                            ]);
                            .remove(
                                [
                                    filePath
                                ]
                            );


                        throw new Error(
@@ -2357,7 +2485,9 @@ async function adminPanelBaslat() {


        if (!imageList) {

            return;

        }


@@ -2382,44 +2512,10 @@ async function adminPanelBaslat() {

            if (error) {

                console.error(
                    "Resimler alınamadı:",
                    error
                throw new Error(
                    error.message
                );


                imageList.innerHTML = `

                    <div class="empty-state">

                        <div class="empty-icon">
                            !
                        </div>

                        <h2>
                            Resimler yüklenemedi
                        </h2>

                        <p>
                            ${escapeHTML(
                                error.message
                            )}
                        </p>

                    </div>

                `;


                if (imageCount) {

                    imageCount.textContent =
                        "0 resim";

                }


                return;
            }


@@ -2459,6 +2555,7 @@ async function adminPanelBaslat() {


                return;

            }


@@ -2484,9 +2581,7 @@ async function adminPanelBaslat() {

                            <div
                                class="image-card"
                                data-image-id="${escapeHTML(
                                    image.id
                                )}"
                                data-image-id="${escapeHTML(image.id)}"
                                style="
                                    border:1px solid #e0e0e0;
                                    border-radius:10px;
@@ -2513,9 +2608,7 @@ async function adminPanelBaslat() {
                                        url
                                            ? `
                                                <img
                                                    src="${escapeHTML(
                                                        url
                                                    )}"
                                                    src="${escapeHTML(url)}"
                                                    alt="${escapeHTML(
                                                        image.category ||
                                                        "Sur Halı"
@@ -2578,9 +2671,7 @@ async function adminPanelBaslat() {
                                    <button
                                        type="button"
                                        class="delete-image-button"
                                        data-id="${escapeHTML(
                                            image.id
                                        )}"
                                        data-id="${escapeHTML(image.id)}"
                                        data-path="${escapeHTML(
                                            image.image_path ||
                                            ""
@@ -2639,7 +2730,9 @@ async function adminPanelBaslat() {


                                if (!onay) {

                                    return;

                                }


@@ -2681,19 +2774,25 @@ async function adminPanelBaslat() {
                    </div>

                    <h2>
                        Hata oluştu
                        Resimler yüklenemedi
                    </h2>

                    <p>
                        ${escapeHTML(
                            error.message
                        )}
                        ${escapeHTML(error.message)}
                    </p>

                </div>

            `;


            if (imageCount) {

                imageCount.textContent =
                    "0 resim";

            }

        }

    }
@@ -2713,17 +2812,18 @@ async function adminPanelBaslat() {
            if (imagePath) {

                const {
                    error:
                        storageError
                    error: storageError
                } =
                    await supabaseClient
                        .storage
                        .from(
                            "category-images"
                        )
                        .remove([
                            imagePath
                        ]);
                        .remove(
                            [
                                imagePath
                            ]
                        );


                if (storageError) {
@@ -2739,8 +2839,7 @@ async function adminPanelBaslat() {


            const {
                error:
                    databaseError
                error: databaseError
            } =
                await supabaseClient
                    .from(
@@ -2811,7 +2910,9 @@ async function adminPanelBaslat() {


        if (!message) {

            return;

        }


@@ -2834,9 +2935,7 @@ async function adminPanelBaslat() {
            message.style.color =
                "#246b36";

        }

        else {
        } else {

            message.style.border =
                "1px solid #d9534f";
@@ -2865,6 +2964,7 @@ async function adminPanelBaslat() {
            message.textContent =
                "";


            message.style.display =
                "none";

@@ -2889,10 +2989,14 @@ async function adminPanelBaslat() {


        const dotIndex =
            name.lastIndexOf(".");
            name.lastIndexOf(
                "."
            );


        if (dotIndex !== -1) {
        if (
            dotIndex !== -1
        ) {

            const extension =
                name
@@ -2998,12 +3102,6 @@ async function adminPanelBaslat() {

    /* ======================================================
       İLK VERİLER
       
       ÖNEMLİ:
       Bu await'ler artık adminPanelBaslat()
       fonksiyonunun İÇİNDE.
       
       Böylece JavaScript SyntaxError vermeyecek.
    ====================================================== */

    await urunleriYukle();
@@ -3012,7 +3110,7 @@ async function adminPanelBaslat() {


    /* ======================================================
       RESİM YÖNETİMİNİ BAŞLAT
       RESİM YÖNETİMİ
    ====================================================== */

    resimYonetiminiBaslat();
@@ -3066,4 +3164,3 @@ async function adminPanelBaslat() {
    );

}
```
