/* =========================================================
   SUR HALI - ADMIN PANEL
   TEMİZ VE TEK PARÇA SÜRÜM
   ========================================================= */

(function () {

    "use strict";


    /* =========================================================
       TEKRAR ÇALIŞMASINI ENGELLE
       ========================================================= */

    if (window.__SUR_HALI_ADMIN_STARTED__) {

        console.warn(
            "Sur Halı Admin zaten başlatılmış."
        );

        return;
    }

    window.__SUR_HALI_ADMIN_STARTED__ = true;


    console.log(
        "Sur Halı Admin başlatılıyor..."
    );


    /* =========================================================
       SUPABASE
       ========================================================= */

    const SUPABASE_URL =
        "https://lhltolrtgnfkbwfkpaex.supabase.co";

    const SUPABASE_KEY =
        "sb_publishable_xdWMVRunvPSeiMw2vfGWyw_l6dTnBsn";


    let supabaseClient = null;


    function supabaseBaslat() {

        if (!window.supabase) {

            console.error(
                "Supabase JS yüklenemedi."
            );

            return false;
        }


        if (
            !SUPABASE_URL ||
            !SUPABASE_KEY
        ) {

            console.error(
                "Supabase bilgileri eksik."
            );

            return false;
        }


        try {

            supabaseClient =
                window.supabase.createClient(
                    SUPABASE_URL,
                    SUPABASE_KEY
                );


            console.log(
                "Supabase bağlantısı başarıyla oluşturuldu."
            );


            return true;

        } catch (error) {

            console.error(
                "Supabase başlatma hatası:",
                error
            );

            return false;
        }
    }


    /* =========================================================
       DOM HAZIR
       ========================================================= */

    document.addEventListener(
        "DOMContentLoaded",
        async function () {

            console.log(
                "DOM hazır."
            );


            if (
                !supabaseBaslat()
            ) {

                console.error(
                    "Supabase başlatılamadı."
                );

                return;
            }


            console.log(
                "Supabase hazır."
            );


            await adminPanelBaslat();

        }
    );


    /* =========================================================
       ADMIN PANELİ
       ========================================================= */

    async function adminPanelBaslat() {

        console.log(
            "Admin paneli başlatılıyor..."
        );


        const sidebar =
            document.querySelector(
                ".sidebar"
            );

        const mainContent =
            document.querySelector(
                ".main-content"
            );


        if (
            !sidebar ||
            !mainContent
        ) {

            console.warn(
                "Admin paneli HTML elemanları bulunamadı."
            );

            return;
        }


        console.log(
            "Admin paneli bulundu."
        );


        /* =====================================================
           OTURUM KONTROLÜ
           ===================================================== */

        try {

            const {
                data,
                error
            } =
                await supabaseClient
                    .auth
                    .getSession();


            if (error) {

                console.error(
                    "Oturum kontrolü hatası:",
                    error
                );

                return;
            }


            if (
                !data ||
                !data.session
            ) {

                console.warn(
                    "Aktif admin oturumu bulunamadı."
                );


                window.location.href =
                    "admin-login.html";

                return;
            }


            console.log(
                "Aktif admin oturumu bulundu."
            );


        } catch (error) {

            console.error(
                "Oturum kontrolünde hata:",
                error
            );

            return;
        }


        /* =====================================================
           ÇIKIŞ
           ===================================================== */

        const logoutButton =
            document.getElementById(
                "logoutButton"
            );


        if (logoutButton) {

            logoutButton.addEventListener(
                "click",
                async function (e) {

                    e.preventDefault();


                    try {

                        const {
                            error
                        } =
                            await supabaseClient
                                .auth
                                .signOut();


                        if (error) {

                            console.error(
                                "Çıkış hatası:",
                                error
                            );

                            alert(
                                "Çıkış yapılamadı:\n\n" +
                                error.message
                            );

                            return;
                        }


                        window.location.href =
                            "admin-login.html";


                    } catch (error) {

                        console.error(
                            "Çıkış hatası:",
                            error
                        );

                    }

                }
            );

        }


        /* =====================================================
           SAYFALAR
           ===================================================== */

        const pages =
            document.querySelectorAll(
                ".page, .admin-page"
            );


        const sidebarMenuItems =
            sidebar.querySelectorAll(
                "[data-page]"
            );


        function sayfaAc(pageId) {

            if (!pageId) {
                return;
            }


            console.log(
                "Sayfa açılıyor:",
                pageId
            );


            pages.forEach(
                function (page) {

                    page.classList.remove(
                        "active-page"
                    );

                    page.classList.remove(
                        "active"
                    );

                    page.style.display =
                        "none";
                }
            );


            const targetPage =
                document.getElementById(
                    pageId
                );


            if (!targetPage) {

                console.warn(
                    "Sayfa bulunamadı:",
                    pageId
                );

                return;
            }


            targetPage.classList.add(
                "active-page"
            );

            targetPage.classList.add(
                "active"
            );


            targetPage.style.display =
                "";


            sidebarMenuItems.forEach(
                function (item) {

                    item.classList.remove(
                        "active"
                    );


                    if (
                        item.getAttribute(
                            "data-page"
                        ) === pageId
                    ) {

                        item.classList.add(
                            "active"
                        );
                    }

                }
            );

        }


        /* =====================================================
           SOL MENÜ
           ===================================================== */

        sidebarMenuItems.forEach(
            function (menuItem) {

                menuItem.addEventListener(
                    "click",
                    function (e) {

                        e.preventDefault();


                        const pageId =
                            menuItem.getAttribute(
                                "data-page"
                            );


                        sayfaAc(
                            pageId
                        );

                    }
                );

            }
        );


        /* =====================================================
           HIZLI BUTONLAR
           ===================================================== */

        document.querySelectorAll(
            ".quick-actions [data-page]"
        ).forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function (e) {

                        e.preventDefault();


                        const pageId =
                            button.getAttribute(
                                "data-page"
                            );


                        sayfaAc(
                            pageId
                        );

                    }
                );

            }
        );


        /* =====================================================
           İLK SAYFA
           ===================================================== */

        const activeMenu =
            sidebar.querySelector(
                "[data-page].active"
            );


        if (activeMenu) {

            sayfaAc(
                activeMenu.getAttribute(
                    "data-page"
                )
            );

        } else {

            const dashboardPage =
                document.getElementById(
                    "dashboardPage"
                );


            if (dashboardPage) {

                sayfaAc(
                    "dashboardPage"
                );
            }
        }


        /* =====================================================
           ÜRÜN YÖNETİMİ
           ===================================================== */

        urunYonetiminiBaslat();


        /* =====================================================
           RESİM YÖNETİMİ
           ===================================================== */

        resimYonetiminiBaslat();


        /* =====================================================
           DASHBOARD
           ===================================================== */

        dashboardBaslat();


        console.log(
            "Admin paneli başarıyla başlatıldı."
        );

    }


    /* =========================================================
       ÜRÜN YÖNETİMİ
       ========================================================= */

    function urunYonetiminiBaslat() {

        const productForm =
            document.getElementById(
                "productForm"
            );


        const productFormBox =
            document.getElementById(
                "productFormBox"
            );


        const productList =
            document.getElementById(
                "productList"
            );


        const productCount =
            document.getElementById(
                "productCount"
            );


        const newProductButton =
            document.getElementById(
                "newProductButton"
            );


        const saveButton =
            document.getElementById(
                "saveProductButton"
            );


        const cancelButton =
            document.getElementById(
                "cancelProductButton"
            );


        let duzenlenenUrunId =
            null;


        if (
            !productForm &&
            !productList
        ) {

            return;
        }


        /* =====================================================
           ÜRÜNLERİ GETİR
           ===================================================== */

        async function urunleriYukle() {

            if (!productList) {
                return;
            }


            productList.innerHTML =
                "<p>Ürünler yükleniyor...</p>";


            try {

                const {
                    data,
                    error
                } =
                    await supabaseClient
                        .from("products")
                        .select("*")
                        .order(
                            "created_at",
                            {
                                ascending: false
                            }
                        );


                if (error) {
                    throw error;
                }


                if (
                    !data ||
                    data.length === 0
                ) {

                    productList.innerHTML =
                        `
                        <div class="empty-state">
                            <h2>Henüz ürün yok</h2>
                            <p>Yeni ürün ekleyebilirsiniz.</p>
                        </div>
                        `;


                    if (productCount) {
                        productCount.textContent =
                            "0 ürün";
                    }


                    return;
                }


                if (productCount) {

                    productCount.textContent =
                        data.length +
                        " ürün";
                }


                productList.innerHTML =
                    data.map(
                        function (product) {

                            const aktif =
                                product.is_active !== false;


                            return `
                            <div
                                class="product-item"
                                data-product-id="${escapeHTML(product.id)}"
                                style="
                                    display:flex;
                                    justify-content:space-between;
                                    align-items:center;
                                    gap:15px;
                                    padding:15px;
                                    margin-bottom:10px;
                                    border:1px solid #333;
                                    border-radius:8px;
                                "
                            >

                                <div>

                                    <h3>
                                        ${escapeHTML(
                                            product.name || "-"
                                        )}
                                    </h3>

                                    <p>
                                        <strong>Kategori:</strong>
                                        ${escapeHTML(
                                            product.category || "-"
                                        )}
                                    </p>

                                    <p>
                                        <strong>Ölçü:</strong>
                                        ${escapeHTML(
                                            product.size || "-"
                                        )}
                                    </p>

                                    <p>
                                        <strong>Fiyat:</strong>
                                        ${
                                            product.price != null
                                                ? escapeHTML(
                                                    String(product.price)
                                                ) + " TL"
                                                : "-"
                                        }
                                    </p>

                                    <p>
                                        <strong>Durum:</strong>
                                        ${
                                            aktif
                                                ? "Aktif"
                                                : "Pasif"
                                        }
                                    </p>

                                </div>


                                <div
                                    style="
                                        display:flex;
                                        gap:8px;
                                    "
                                >

                                    <button
                                        type="button"
                                        class="edit-product-button"
                                        data-id="${escapeHTML(product.id)}"
                                        style="
                                            padding:8px 12px;
                                            cursor:pointer;
                                        "
                                    >
                                        Düzenle
                                    </button>


                                    <button
                                        type="button"
                                        class="delete-product-button"
                                        data-id="${escapeHTML(product.id)}"
                                        style="
                                            padding:8px 12px;
                                            cursor:pointer;
                                        "
                                    >
                                        Sil
                                    </button>

                                </div>

                            </div>
                            `;

                        }
                    ).join("");


                /* =================================================
                   DÜZENLE BUTONLARI
                   ================================================= */

                productList
                    .querySelectorAll(
                        ".edit-product-button"
                    )
                    .forEach(
                        function (button) {

                            button.addEventListener(
                                "click",
                                async function () {

                                    await urunDuzenle(
                                        button.dataset.id
                                    );

                                }
                            );

                        }
                    );


                /* =================================================
                   SİL BUTONLARI
                   ================================================= */

                productList
                    .querySelectorAll(
                        ".delete-product-button"
                    )
                    .forEach(
                        function (button) {

                            button.addEventListener(
                                "click",
                                async function () {

                                    await urunSil(
                                        button.dataset.id
                                    );

                                }
                            );

                        }
                    );


            } catch (error) {

                console.error(
                    "Ürün listesi hatası:",
                    error
                );


                productList.innerHTML =
                    `
                    <div class="empty-state">

                        <h2>Ürünler yüklenemedi</h2>

                        <p>
                            ${escapeHTML(
                                error.message
                            )}
                        </p>

                    </div>
                    `;

            }

        }


        /* =====================================================
           YENİ ÜRÜN
           ===================================================== */

        if (newProductButton) {

            newProductButton.addEventListener(
                "click",
                function (e) {

                    e.preventDefault();


                    duzenlenenUrunId =
                        null;


                    if (productForm) {

                        productForm.reset();
                    }


                    if (saveButton) {

                        saveButton.textContent =
                            "Ürünü Kaydet";
                    }


                    if (productFormBox) {

                        productFormBox.style.display =
                            "";

                        productFormBox.scrollIntoView(
                            {
                                behavior: "smooth",
                                block: "start"
                            }
                        );
                    }

                }
            );

        }


        /* =====================================================
           ÜRÜN FORMU
           ===================================================== */

        if (productForm) {

            productForm.addEventListener(
                "submit",
                async function (e) {

                    e.preventDefault();


                    const nameElement =
                        document.getElementById(
                            "productName"
                        );


                    const categoryElement =
                        document.getElementById(
                            "productCategory"
                        );


                    const sizeElement =
                        document.getElementById(
                            "productSize"
                        );


                    const priceElement =
                        document.getElementById(
                            "productPrice"
                        );


                    const descriptionElement =
                        document.getElementById(
                            "productDescription"
                        );


                    const activeElement =
                        document.getElementById(
                            "productActive"
                        );


                    const imageUrlElement =
                        document.getElementById(
                            "productImageUrl"
                        );


                    const name =
                        nameElement
                            ? nameElement.value.trim()
                            : "";


                    const category =
                        categoryElement
                            ? categoryElement.value.trim()
                            : "";


                    const size =
                        sizeElement
                            ? sizeElement.value.trim()
                            : "";


                    const priceText =
                        priceElement
                            ? priceElement.value.trim()
                            : "";


                    const description =
                        descriptionElement
                            ? descriptionElement.value.trim()
                            : "";


                    const imageUrl =
                        imageUrlElement
                            ? imageUrlElement.value.trim()
                            : "";


                    const isActive =
                        activeElement
                            ? activeElement.value !== "false"
                            : true;


                    if (!name) {

                        alert(
                            "Ürün adı giriniz."
                        );

                        return;
                    }


                    if (!category) {

                        alert(
                            "Kategori seçiniz."
                        );

                        return;
                    }


                    let price =
                        null;


                    if (priceText) {

                        price =
                            Number(
                                priceText.replace(
                                    ",",
                                    "."
                                )
                            );


                        if (
                            Number.isNaN(
                                price
                            )
                        ) {

                            alert(
                                "Fiyat bilgisi geçerli değil."
                            );

                            return;
                        }

                    }


                    const urunData = {

                        name:
                            name,

                        category:
                            category,

                        size:
                            size || null,

                        price:
                            price,

                        description:
                            description || null,

                        is_active:
                            isActive,

                        image_url:
                            imageUrl || null
                    };


                    try {

                        if (
                            duzenlenenUrunId
                        ) {

                            const {
                                error
                            } =
                                await supabaseClient
                                    .from("products")
                                    .update(
                                        urunData
                                    )
                                    .eq(
                                        "id",
                                        duzenlenenUrunId
                                    );


                            if (error) {
                                throw error;
                            }


                            alert(
                                "Ürün başarıyla güncellendi."
                            );

                        } else {

                            const {
                                error
                            } =
                                await supabaseClient
                                    .from("products")
                                    .insert(
                                        [
                                            urunData
                                        ]
                                    );


                            if (error) {
                                throw error;
                            }


                            alert(
                                "Ürün başarıyla eklendi."
                            );
                        }


                        duzenlenenUrunId =
                            null;


                        productForm.reset();


                        if (saveButton) {

                            saveButton.textContent =
                                "Ürünü Kaydet";
                        }


                        await urunleriYukle();


                        dashboardBaslat();


                    } catch (error) {

                        console.error(
                            "Ürün kaydetme hatası:",
                            error
                        );


                        alert(
                            "Ürün kaydedilemedi:\n\n" +
                            error.message
                        );

                    }

                }
            );

        }


        /* =====================================================
           İPTAL
           ===================================================== */

        if (cancelButton) {

            cancelButton.addEventListener(
                "click",
                function (e) {

                    e.preventDefault();


                    duzenlenenUrunId =
                        null;


                    if (productForm) {

                        productForm.reset();
                    }


                    if (saveButton) {

                        saveButton.textContent =
                            "Ürünü Kaydet";
                    }


                    if (productFormBox) {

                        productFormBox.style.display =
                            "none";
                    }

                }
            );

        }


        /* =====================================================
           ÜRÜN DÜZENLE
           ===================================================== */

        async function urunDuzenle(id) {

            try {

                const {
                    data,
                    error
                } =
                    await supabaseClient
                        .from("products")
                        .select("*")
                        .eq(
                            "id",
                            id
                        )
                        .single();


                if (error) {
                    throw error;
                }


                if (!data) {

                    alert(
                        "Ürün bulunamadı."
                    );

                    return;
                }


                duzenlenenUrunId =
                    data.id;


                setInputValue(
                    "productName",
                    data.name
                );


                setInputValue(
                    "productCategory",
                    data.category
                );


                setInputValue(
                    "productSize",
                    data.size
                );


                setInputValue(
                    "productPrice",
                    data.price
                );


                setInputValue(
                    "productDescription",
                    data.description
                );


                setInputValue(
                    "productImageUrl",
                    data.image_url
                );


                setInputValue(
                    "productActive",
                    data.is_active === false
                        ? "false"
                        : "true"
                );


                if (saveButton) {

                    saveButton.textContent =
                        "Güncelle";
                }


                if (productFormBox) {

                    productFormBox.style.display =
                        "";

                    productFormBox.scrollIntoView(
                        {
                            behavior: "smooth",
                            block: "start"
                        }
                    );
                }


            } catch (error) {

                console.error(
                    "Ürün düzenleme hatası:",
                    error
                );


                alert(
                    "Ürün bilgileri alınamadı:\n\n" +
                    error.message
                );

            }

        }


        /* =====================================================
           ÜRÜN SİL
           ===================================================== */

        async function urunSil(id) {

            const onay =
                confirm(
                    "Bu ürünü silmek istediğinize emin misiniz?\n\nÜrüne bağlı resimler de silinebilir."
                );


            if (!onay) {
                return;
            }


            try {

                const {
                    error
                } =
                    await supabaseClient
                        .from("products")
                        .delete()
                        .eq(
                            "id",
                            id
                        );


                if (error) {
                    throw error;
                }


                alert(
                    "Ürün silindi."
                );


                await urunleriYukle();


                dashboardBaslat();


                /* Resim listesini de yenile */

                const imageList =
                    document.getElementById(
                        "imageList"
                    );


                if (imageList) {

                    await resimleriYukleDisaridan();

                }


            } catch (error) {

                console.error(
                    "Ürün silme hatası:",
                    error
                );


                alert(
                    "Ürün silinemedi:\n\n" +
                    error.message
                );

            }

        }


        /* =====================================================
           İLK ÜRÜN YÜKLEME
           ===================================================== */

        urunleriYukle();

    }


    /* =========================================================
       RESİM YÖNETİMİ
       ========================================================= */

    let globalUrunler =
        [];


    async function resimYonetiminiBaslat() {

        const imageFile =
            document.getElementById(
                "imageFile"
            );


        const imageCategory =
            document.getElementById(
                "imageCategory"
            );


        const uploadImageButton =
            document.getElementById(
                "uploadImageButton"
            );


        const imageList =
            document.getElementById(
                "imageList"
            );


        if (
            !imageFile &&
            !imageList
        ) {

            return;
        }


        /* =====================================================
           ÜRÜN SEÇİM KUTUSU OLUŞTUR
           ===================================================== */

        let imageProduct =
            document.getElementById(
                "imageProduct"
            );


        if (
            imageCategory &&
            !imageProduct
        ) {

            const productWrapper =
                document.createElement(
                    "div"
                );


            productWrapper.className =
                "form-group";


            productWrapper.style.marginTop =
                "20px";


            const label =
                document.createElement(
                    "label"
                );


            label.setAttribute(
                "for",
                "imageProduct"
            );


            label.textContent =
                "Ürün";


            imageProduct =
                document.createElement(
                    "select"
                );


            imageProduct.id =
                "imageProduct";


            imageProduct.innerHTML =
                `
                <option value="">
                    Önce kategori seçiniz
                </option>
                `;


            imageProduct.style.width =
                "100%";


            imageProduct.style.padding =
                "10px";


            imageProduct.style.marginTop =
                "6px";


            imageProduct.style.borderRadius =
                "6px";


            productWrapper.appendChild(
                label
            );


            productWrapper.appendChild(
                imageProduct
            );


            imageCategory.parentNode.insertBefore(
                productWrapper,
                imageCategory.nextSibling
            );

        }


        /* =====================================================
           ÜRÜNLERİ RESİM SEÇİMİ İÇİN GETİR
           ===================================================== */

        await resimUrunleriniGetir();


        /* =====================================================
           KATEGORİ DEĞİŞİNCE ÜRÜNLERİ FİLTRELE
           ===================================================== */

        if (imageCategory) {

            imageCategory.addEventListener(
                "change",
                function () {

                    resimUrunSecenekleriniDoldur();

                }
            );

        }


        /* =====================================================
           RESİM ÖNİZLEME
           ===================================================== */

        if (imageFile) {

            imageFile.addEventListener(
                "change",
                function () {

                    const file =
                        imageFile.files[0];


                    if (!file) {
                        return;
                    }


                    if (
                        !file.type.startsWith(
                            "image/"
                        )
                    ) {

                        alert(
                            "Lütfen geçerli bir resim dosyası seçin."
                        );


                        imageFile.value =
                            "";


                        return;
                    }


                    const preview =
                        document.getElementById(
                            "imagePreview"
                        );


                    const previewBox =
                        document.getElementById(
                            "imagePreviewBox"
                        );


                    if (preview) {

                        preview.src =
                            URL.createObjectURL(
                                file
                            );


                        preview.style.display =
                            "";

                    }


                    if (previewBox) {

                        previewBox.style.display =
                            "";

                    }

                }
            );

        }


        /* =====================================================
           RESİM YÜKLE
           ===================================================== */

        if (uploadImageButton) {

            uploadImageButton.addEventListener(
                "click",
                async function (e) {

                    e.preventDefault();


                    const file =
                        imageFile &&
                        imageFile.files
                            ? imageFile.files[0]
                            : null;


                    const category =
                        imageCategory
                            ? imageCategory.value.trim()
                            : "";


                    const selectedProductId =
                        imageProduct
                            ? imageProduct.value
                            : "";


                    if (!file) {

                        alert(
                            "Lütfen bir resim seçin."
                        );

                        return;
                    }


                    if (!category) {

                        alert(
                            "Lütfen kategori seçin."
                        );

                        return;
                    }


                    if (!selectedProductId) {

                        alert(
                            "Lütfen bu resmin ait olduğu ürünü seçin."
                        );

                        return;
                    }


                    const selectedProduct =
                        globalUrunler.find(
                            function (product) {

                                return String(
                                    product.id
                                ) === String(
                                    selectedProductId
                                );

                            }
                        );


                    if (!selectedProduct) {

                        alert(
                            "Seçilen ürün bulunamadı."
                        );

                        return;
                    }


                    try {

                        uploadImageButton.disabled =
                            true;


                        uploadImageButton.textContent =
                            "Yükleniyor...";


                        /* =========================================
                           DOSYA UZANTISI
                           ========================================= */

                        const extension =
                            dosyaUzantisi(
                                file.name
                            );


                        /* =========================================
                           GÜVENLİ KLASÖR
                           ========================================= */

                        const safeCategory =
                            slugify(
                                category
                            );


                        /* =========================================
                           ÜRÜNE ÖZEL KLASÖR
                           ========================================= */

                        const safeProduct =
                            slugify(
                                selectedProduct.name
                            );


                        const fileName =
                            Date.now() +
                            "-" +
                            Math.random()
                                .toString(36)
                                .substring(2, 9) +
                            extension;


                        const filePath =
                            safeCategory +
                            "/" +
                            safeProduct +
                            "/" +
                            fileName;


                        console.log(
                            "Resim yolu:",
                            filePath
                        );


                        console.log(
                            "Ürün ID:",
                            selectedProductId
                        );


                        /* =========================================
                           STORAGE'A YÜKLE
                           ========================================= */

                        const {
                            error:
                                uploadError
                        } =
                            await supabaseClient
                                .storage
                                .from(
                                    "category-images"
                                )
                                .upload(
                                    filePath,
                                    file,
                                    {
                                        cacheControl:
                                            "3600",

                                        upsert:
                                            false
                                    }
                                );


                        if (uploadError) {
                            throw uploadError;
                        }


                        /* =========================================
                           PUBLIC URL
                           ========================================= */

                        const {
                            data:
                                publicUrlData
                        } =
                            supabaseClient
                                .storage
                                .from(
                                    "category-images"
                                )
                                .getPublicUrl(
                                    filePath
                                );


                        const imageUrl =
                            publicUrlData &&
                            publicUrlData.publicUrl
                                ? publicUrlData.publicUrl
                                : null;


                        if (!imageUrl) {

                            await supabaseClient
                                .storage
                                .from(
                                    "category-images"
                                )
                                .remove(
                                    [
                                        filePath
                                    ]
                                );


                            throw new Error(
                                "Resmin public URL'si oluşturulamadı."
                            );
                        }


                        /* =========================================
                           DATABASE
                           ========================================= */

                        const {
                            error:
                                databaseError
                        } =
                            await supabaseClient
                                .from(
                                    "category_images"
                                )
                                .insert(
                                    [
                                        {

                                            category:
                                                category,

                                            image_path:
                                                filePath,

                                            image_url:
                                                imageUrl,

                                            product_id:
                                                selectedProductId

                                        }
                                    ]
                                );


                        if (databaseError) {

                            console.error(
                                "category_images kayıt hatası:",
                                databaseError
                            );


                            /* Storage'dan geri sil */

                            await supabaseClient
                                .storage
                                .from(
                                    "category-images"
                                )
                                .remove(
                                    [
                                        filePath
                                    ]
                                );


                            throw databaseError;
                        }


                        /* =========================================
                           BAŞARILI
                           ========================================= */

                        alert(
                            "Resim başarıyla yüklendi.\n\n" +
                            "Ürün: " +
                            selectedProduct.name
                        );


                        /* Formu temizle */

                        imageFile.value =
                            "";


                        if (imageCategory) {

                            imageCategory.value =
                                "";
                        }


                        if (imageProduct) {

                            imageProduct.innerHTML =
                                `
                                <option value="">
                                    Önce kategori seçiniz
                                </option>
                                `;
                        }


                        const preview =
                            document.getElementById(
                                "imagePreview"
                            );


                        const previewBox =
                            document.getElementById(
                                "imagePreviewBox"
                            );


                        if (preview) {

                            preview.src =
                                "";

                            preview.style.display =
                                "none";
                        }


                        if (previewBox) {

                            previewBox.style.display =
                                "none";
                        }


                        await resimleriYukle();


                        dashboardBaslat();


                    } catch (error) {

                        console.error(
                            "Resim yükleme hatası:",
                            error
                        );


                        alert(
                            "Resim yüklenemedi:\n\n" +
                            error.message
                        );


                    } finally {

                        uploadImageButton.disabled =
                            false;


                        uploadImageButton.textContent =
                            "Resim Yükle";

                    }

                }
            );

        }


        /* =====================================================
           İLK RESİM LİSTESİ
           ===================================================== */

        await resimleriYukle();

    }


    /* =========================================================
       RESİM İÇİN ÜRÜNLERİ GETİR
       ========================================================= */

    async function resimUrunleriniGetir() {

        try {

            const {
                data,
                error
            } =
                await supabaseClient
                    .from("products")
                    .select(
                        "id,name,category,is_active"
                    )
                    .order(
                        "name",
                        {
                            ascending: true
                        }
                    );


            if (error) {
                throw error;
            }


            globalUrunler =
                data || [];


            resimUrunSecenekleriniDoldur();


        } catch (error) {

            console.error(
                "Resim ürünleri alınamadı:",
                error
            );

        }

    }


    /* =========================================================
       ÜRÜN SELECT DOLDUR
       ========================================================= */

    function resimUrunSecenekleriniDoldur() {

        const imageCategory =
            document.getElementById(
                "imageCategory"
            );


        const imageProduct =
            document.getElementById(
                "imageProduct"
            );


        if (!imageProduct) {
            return;
        }


        const selectedCategory =
            imageCategory
                ? imageCategory.value.trim()
                : "";


        imageProduct.innerHTML =
            `
            <option value="">
                ${
                    selectedCategory
                        ? "Ürün seçiniz"
                        : "Önce kategori seçiniz"
                }
            </option>
            `;


        if (!selectedCategory) {
            return;
        }


        const filteredProducts =
            globalUrunler.filter(
                function (product) {

                    return (
                        String(
                            product.category || ""
                        ).trim() ===
                        selectedCategory
                    );

                }
            );


        if (
            filteredProducts.length === 0
        ) {

            imageProduct.innerHTML =
                `
                <option value="">
                    Bu kategoride ürün bulunamadı
                </option>
                `;

            return;
        }


        filteredProducts.forEach(
            function (product) {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    product.id;


                option.textContent =
                    product.name +
                    (
                        product.size
                            ? " - " +
                              product.size
                            : ""
                    );


                imageProduct.appendChild(
                    option
                );

            }
        );

    }


    /* =========================================================
       RESİMLERİ GETİR
       ========================================================= */

    async function resimleriYukle() {

        const imageList =
            document.getElementById(
                "imageList"
            );


        const imageCount =
            document.getElementById(
                "imageCount"
            );


        if (!imageList) {
            return;
        }


        imageList.innerHTML =
            "<p>Resimler yükleniyor...</p>";


        try {

            const {
                data,
                error
            } =
                await supabaseClient
                    .from(
                        "category_images"
                    )
                    .select(
                        `
                        id,
                        category,
                        image_path,
                        image_url,
                        created_at,
                        product_id
                        `
                    )
                    .order(
                        "created_at",
                        {
                            ascending: false
                        }
                    );


            if (error) {
                throw error;
            }


            if (imageCount) {

                imageCount.textContent =
                    (
                        data
                            ? data.length
                            : 0
                    ) +
                    " resim";
            }


            if (
                !data ||
                data.length === 0
            ) {

                imageList.innerHTML =
                    `
                    <div class="empty-state">

                        <h2>Henüz resim yok</h2>

                        <p>
                            Yeni resim yükleyebilirsiniz.
                        </p>

                    </div>
                    `;

                return;
            }


            imageList.innerHTML =
                data.map(
                    function (image) {

                        const url =
                            image.image_url ||
                            "";


                        const product =
                            globalUrunler.find(
                                function (item) {

                                    return String(
                                        item.id
                                    ) === String(
                                        image.product_id
                                    );

                                }
                            );


                        const productName =
                            product
                                ? product.name
                                : (
                                    image.product_id
                                        ? "Ürün bilgisi bulunamadı"
                                        : "Ürün bağlantısı yok"
                                );


                        return `
                        <div
                            class="image-card"
                            data-image-id="${escapeHTML(image.id)}"
                            style="
                                border:1px solid #333;
                                border-radius:10px;
                                padding:15px;
                                margin-bottom:10px;
                            "
                        >

                            ${
                                url
                                    ? `
                                    <img
                                        src="${escapeHTML(url)}"
                                        alt="${escapeHTML(productName)}"
                                        style="
                                            width:100%;
                                            max-width:260px;
                                            height:180px;
                                            object-fit:cover;
                                            border-radius:8px;
                                            display:block;
                                            margin-bottom:12px;
                                        "
                                    >
                                    `
                                    : ""
                            }


                            <p>
                                <strong>Ürün:</strong>
                                ${escapeHTML(productName)}
                            </p>


                            <p>
                                <strong>Kategori:</strong>
                                ${escapeHTML(
                                    image.category || "-"
                                )}
                            </p>


                            <p
                                style="
                                    font-size:12px;
                                    opacity:.7;
                                    word-break:break-all;
                                "
                            >
                                ${escapeHTML(
                                    image.image_path || ""
                                )}
                            </p>


                            <button
                                type="button"
                                class="delete-image-button"
                                data-id="${escapeHTML(image.id)}"
                                data-path="${escapeHTML(image.image_path || "")}"
                                style="
                                    padding:8px 12px;
                                    cursor:pointer;
                                "
                            >
                                Resmi Sil
                            </button>

                        </div>
                        `;

                    }
                ).join("");


            imageList
                .querySelectorAll(
                    ".delete-image-button"
                )
                .forEach(
                    function (button) {

                        button.addEventListener(
                            "click",
                            async function () {

                                await resimSil(
                                    button.dataset.id,
                                    button.dataset.path
                                );

                            }
                        );

                    }
                );


        } catch (error) {

            console.error(
                "Resimler alınamadı:",
                error
            );


            imageList.innerHTML =
                `
                <div class="empty-state">

                    <h2>Resimler yüklenemedi</h2>

                    <p>
                        ${escapeHTML(
                            error.message
                        )}
                    </p>

                </div>
                `;

        }

    }


    /* =========================================================
       DIŞARIDAN RESİM YÜKLEME
       ========================================================= */

    async function resimleriYukleDisaridan() {

        await resimleriYukle();

    }


    /* =========================================================
       RESİM SİL
       ========================================================= */

    async function resimSil(
        id,
        imagePath
    ) {

        const onay =
            confirm(
                "Bu resmi silmek istediğinize emin misiniz?"
            );


        if (!onay) {
            return;
        }


        try {

            /* ================================================
               STORAGE
               ================================================ */

            if (imagePath) {

                const {
                    error:
                        storageError
                } =
                    await supabaseClient
                        .storage
                        .from(
                            "category-images"
                        )
                        .remove(
                            [
                                imagePath
                            ]
                        );


                if (storageError) {
                    throw storageError;
                }

            }


            /* ================================================
               DATABASE
               ================================================ */

            const {
                error:
                    databaseError
            } =
                await supabaseClient
                    .from(
                        "category_images"
                    )
                    .delete()
                    .eq(
                        "id",
                        id
                    );


            if (databaseError) {
                throw databaseError;
            }


            alert(
                "Resim silindi."
            );


            await resimleriYukle();


            dashboardBaslat();


        } catch (error) {

            console.error(
                "Resim silme hatası:",
                error
            );


            alert(
                "Resim silinemedi:\n\n" +
                error.message
            );

        }

    }


    /* =========================================================
       DASHBOARD
       ========================================================= */

    function dashboardBaslat() {

        toplamUrunSayisiniGetir();

        aktifUrunSayisiniGetir();

        toplamResimSayisiniGetir();

    }


    /* =========================================================
       ELEMENT BUL
       ========================================================= */

    function ilkBul(
        ids
    ) {

        for (
            let i = 0;
            i < ids.length;
            i++
        ) {

            const element =
                document.getElementById(
                    ids[i]
                );


            if (element) {
                return element;
            }

        }


        return null;
    }


    /* =========================================================
       TOPLAM ÜRÜN
       ========================================================= */

    async function toplamUrunSayisiniGetir() {

        const element =
            ilkBul(
                [
                    "totalProducts",
                    "totalProductCount"
                ]
            );


        if (!element) {
            return;
        }


        try {

            const {
                count,
                error
            } =
                await supabaseClient
                    .from("products")
                    .select(
                        "*",
                        {
                            count:
                                "exact",
                            head:
                                true
                        }
                    );


            if (error) {
                throw error;
            }


            element.textContent =
                count != null
                    ? count
                    : "0";


        } catch (error) {

            console.error(
                "Toplam ürün sayısı alınamadı:",
                error
            );


            element.textContent =
                "0";

        }

    }


    /* =========================================================
       AKTİF ÜRÜN
       ========================================================= */

    async function aktifUrunSayisiniGetir() {

        const element =
            ilkBul(
                [
                    "activeProducts",
                    "activeProductCount"
                ]
            );


        if (!element) {
            return;
        }


        try {

            const {
                count,
                error
            } =
                await supabaseClient
                    .from("products")
                    .select(
                        "*",
                        {
                            count:
                                "exact",
                            head:
                                true
                        }
                    )
                    .eq(
                        "is_active",
                        true
                    );


            if (error) {
                throw error;
            }


            element.textContent =
                count != null
                    ? count
                    : "0";


        } catch (error) {

            console.error(
                "Aktif ürün sayısı alınamadı:",
                error
            );


            element.textContent =
                "0";

        }

    }


    /* =========================================================
       TOPLAM RESİM
       ========================================================= */

    async function toplamResimSayisiniGetir() {

        const element =
            ilkBul(
                [
                    "totalImages",
                    "imageCount"
                ]
            );


        if (!element) {
            return;
        }


        try {

            const {
                count,
                error
            } =
                await supabaseClient
                    .from(
                        "category_images"
                    )
                    .select(
                        "*",
                        {
                            count:
                                "exact",
                            head:
                                true
                        }
                    );


            if (error) {
                throw error;
            }


            element.textContent =
                count != null
                    ? count
                    : "0";


        } catch (error) {

            console.error(
                "Resim sayısı alınamadı:",
                error
            );


            element.textContent =
                "0";

        }

    }


    /* =========================================================
       INPUT DEĞERİ
       ========================================================= */

    function setInputValue(
        id,
        value
    ) {

        const element =
            document.getElementById(
                id
            );


        if (element) {

            element.value =
                value != null
                    ? value
                    : "";

        }

    }


    /* =========================================================
       DOSYA UZANTISI
       ========================================================= */

    function dosyaUzantisi(
        fileName
    ) {

        const dotIndex =
            fileName.lastIndexOf(
                "."
            );


        if (
            dotIndex === -1
        ) {

            return "";
        }


        return fileName
            .substring(
                dotIndex
            )
            .toLowerCase();

    }


    /* =========================================================
       SLUG
       ========================================================= */

    function slugify(
        value
    ) {

        return String(
            value || ""
        )
            .toLowerCase()
            .replace(
                /ğ/g,
                "g"
            )
            .replace(
                /ü/g,
                "u"
            )
            .replace(
                /ş/g,
                "s"
            )
            .replace(
                /ı/g,
                "i"
            )
            .replace(
                /ö/g,
                "o"
            )
            .replace(
                /ç/g,
                "c"
            )
            .replace(
                /[^a-z0-9_-]+/g,
                "-"
            )
            .replace(
                /^-+|-+$/g,
                ""
            );

    }


    /* =========================================================
       HTML GÜVENLİĞİ
       ========================================================= */

    function escapeHTML(
        value
    ) {

        if (
            value === null ||
            value === undefined
        ) {

            return "";
        }


        return String(value)
            .replace(
                /&/g,
                "&amp;"
            )
            .replace(
                /</g,
                "&lt;"
            )
            .replace(
                />/g,
                "&gt;"
            )
            .replace(
                /"/g,
                "&quot;"
            )
            .replace(
                /'/g,
                "&#039;"
            );

    }


})();
