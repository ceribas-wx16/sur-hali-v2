/* ==========================================================
   SUR HALI ADMIN PANEL
   TEMİZ + ÜRÜN / RESİM BAĞLANTILI SÜRÜM
   ========================================================== */

(function () {

    "use strict";

    console.log("Sur Halı Admin başlatılıyor...");


    /* ==========================================================
       SUPABASE AYARLARI
       ========================================================== */

    const SUPABASE_URL =
        "https://lhltolrtgnfkbwfkpaex.supabase.co";

    const SUPABASE_KEY =
        "sb_publishable_xdWMVRunvPSeiMw2vfGWyw_l6dTnBsn";

    let supabaseClient = null;

    let duzenlenenUrunId = null;


    /* ==========================================================
       SUPABASE BAŞLAT
       ========================================================== */

    function supabaseBaslat() {

        if (!window.supabase) {

            console.error(
                "Supabase JS yüklenemedi."
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


    /* ==========================================================
       DOM HAZIR
       ========================================================== */

    document.addEventListener(
        "DOMContentLoaded",
        async function () {

            console.log("DOM hazır.");

            if (!supabaseBaslat()) {

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


    /* ==========================================================
       ANA ADMİN PANELİ
       ========================================================== */

    async function adminPanelBaslat() {

        console.log(
            "Admin paneli başlatılıyor..."
        );


        if (!supabaseClient) {

            console.error(
                "Supabase bağlantısı bulunamadı."
            );

            return;
        }


        const sidebar =
            document.querySelector(
                ".sidebar"
            );

        const mainContent =
            document.querySelector(
                ".main-content"
            );


        if (!sidebar || !mainContent) {

            console.warn(
                "Admin paneli HTML elemanları bulunamadı."
            );

            return;
        }


        console.log(
            "Admin paneli bulundu."
        );


        /* ======================================================
           OTURUM KONTROLÜ
           ====================================================== */

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
                    "Oturum kontrol hatası:",
                    error
                );

                return;
            }


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


        /* ======================================================
           ÇIKIŞ
           ====================================================== */

        const logoutButtons =
            document.querySelectorAll(
                "#logoutButton, .logout-button"
            );


        logoutButtons.forEach(
            function (button) {

                button.addEventListener(
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

                                throw error;
                            }


                            window.location.href =
                                "admin-login.html";


                        } catch (error) {

                            console.error(
                                "Çıkış hatası:",
                                error
                            );

                            alert(
                                "Çıkış yapılamadı:\n\n" +
                                error.message
                            );
                        }
                    }
                );
            }
        );


        /* ======================================================
           SAYFA SİSTEMİ
           ====================================================== */

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


        sidebarMenuItems.forEach(
            function (menuItem) {

                menuItem.addEventListener(
                    "click",
                    function (e) {

                        e.preventDefault();

                        sayfaAc(
                            menuItem.getAttribute(
                                "data-page"
                            )
                        );
                    }
                );
            }
        );


        /* ======================================================
           DASHBOARD HIZLI BUTONLAR
           ====================================================== */

        document.querySelectorAll(
            ".quick-actions [data-page]"
        ).forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function (e) {

                        e.preventDefault();

                        sayfaAc(
                            button.getAttribute(
                                "data-page"
                            )
                        );
                    }
                );
            }
        );


        /* ======================================================
           İLK SAYFA
           ====================================================== */

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

            const firstPage =
                document.querySelector(
                    ".page, .admin-page"
                );

            if (firstPage) {

                sayfaAc(
                    firstPage.id
                );
            }
        }


        /* ======================================================
           MODÜLLER
           ====================================================== */

        urunYonetiminiBaslat();

        await resimYonetiminiBaslat();

        dashboardBaslat();


        console.log(
            "Admin paneli başarıyla başlatıldı."
        );
    }


    /* ==========================================================
       ÜRÜN YÖNETİMİ
       ========================================================== */

    function urunYonetiminiBaslat() {

        const productForm =
            document.getElementById(
                "productForm"
            );


        const productList =
            document.getElementById(
                "productList"
            );


        const newProductButton =
            document.getElementById(
                "newProductButton"
            );


        const productFormBox =
            document.getElementById(
                "productFormBox"
            );


        const saveButton =
            document.getElementById(
                "saveProductButton"
            );


        const cancelButton =
            document.getElementById(
                "cancelProductButton"
            );


        if (
            !productForm &&
            !productList
        ) {

            return;
        }


        /* ======================================================
           ÜRÜNLERİ YÜKLE
           ====================================================== */

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

                    return;
                }


                productList.innerHTML =
                    data.map(
                        function (product) {

                            const image =
                                product.image_url
                                    ? `
                                    <img
                                        src="${escapeHTML(product.image_url)}"
                                        alt="${escapeHTML(product.name || "Ürün")}"
                                        style="
                                            width:90px;
                                            height:90px;
                                            object-fit:cover;
                                            border-radius:8px;
                                            margin-right:15px;
                                        "
                                    >
                                    `
                                    : "";


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
                                    border:1px solid #ddd;
                                    border-radius:8px;
                                "
                            >

                                <div
                                    style="
                                        display:flex;
                                        align-items:center;
                                        flex:1;
                                    "
                                >

                                    ${image}

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

                                    </div>

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
                                    >
                                        Düzenle
                                    </button>

                                    <button
                                        type="button"
                                        class="delete-product-button"
                                        data-id="${escapeHTML(product.id)}"
                                    >
                                        Sil
                                    </button>

                                </div>

                            </div>
                            `;
                        }
                    ).join("");


                /* ==================================================
                   DÜZENLE BUTONLARI
                   ================================================== */

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


                /* ==================================================
                   SİL BUTONLARI
                   ================================================== */

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
                            ${escapeHTML(error.message)}
                        </p>
                    </div>
                    `;
            }
        }


        /* ======================================================
           YENİ ÜRÜN
           ====================================================== */

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


        /* ======================================================
           ÜRÜN KAYDET
           ====================================================== */

        if (productForm) {

            productForm.addEventListener(
                "submit",
                async function (e) {

                    e.preventDefault();


                    const name =
                        getValue(
                            "productName"
                        );


                    const category =
                        getValue(
                            "productCategory"
                        );


                    const size =
                        getValue(
                            "productSize"
                        );


                    const priceText =
                        getValue(
                            "productPrice"
                        );


                    const description =
                        getValue(
                            "productDescription"
                        );


                    const activeValue =
                        getValue(
                            "productActive"
                        );


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

                        active:
                            activeValue !== "false"

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

                        await dashboardBaslat();

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


        /* ======================================================
           İPTAL
           ====================================================== */

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


        /* ======================================================
           ÜRÜN DÜZENLE
           ====================================================== */

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
                    "productActive",
                    data.active === false
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


        /* ======================================================
           ÜRÜN SİL
           ====================================================== */

        async function urunSil(id) {

            const onay =
                confirm(
                    "Bu ürünü silmek istediğinize emin misiniz?"
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

                await dashboardBaslat();


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


        /* ======================================================
           İLK ÜRÜN YÜKLEME
           ====================================================== */

        urunleriYukle();
    }


    /* ==========================================================
       RESİM YÖNETİMİ
       ========================================================== */

    async function resimYonetiminiBaslat() {

        const imageFile =
            document.getElementById(
                "imageFile"
            );


        /*
         * HTML'de mevcut olan imageCategory
         * artık ürün seçme alanı olarak kullanılacak.
         */

        const imageProduct =
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


        /* ======================================================
           ALAN ADINI ÜRÜN SEÇİMİNE ÇEVİR
           ====================================================== */

        if (imageProduct) {

            const label =
                document.querySelector(
                    'label[for="imageCategory"]'
                );


            if (label) {

                label.textContent =
                    "Ürün";
            }


            imageProduct.innerHTML =
                `
                <option value="">
                    Ürün seçiniz
                </option>
                `;


            await resimUrunleriniDoldur();
        }


        /* ======================================================
           RESİM ÖNİZLEME
           ====================================================== */

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


        /* ======================================================
           RESİM YÜKLE
           ====================================================== */

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


                    const productId =
                        imageProduct
                            ? imageProduct.value
                            : "";


                    if (!file) {

                        alert(
                            "Lütfen bir resim seçin."
                        );

                        return;
                    }


                    if (!productId) {

                        alert(
                            "Lütfen bir ürün seçin."
                        );

                        return;
                    }


                    try {

                        uploadImageButton.disabled =
                            true;


                        uploadImageButton.textContent =
                            "Yükleniyor...";


                        /* ==================================================
                           ÜRÜN BİLGİSİNİ AL
                           ================================================== */

                        const {
                            data: product,
                            error: productError
                        } =
                            await supabaseClient
                                .from("products")
                                .select(
                                    "id,name,category"
                                )
                                .eq(
                                    "id",
                                    productId
                                )
                                .single();


                        if (productError) {
                            throw productError;
                        }


                        if (!product) {

                            throw new Error(
                                "Seçilen ürün bulunamadı."
                            );
                        }


                        /* ==================================================
                           DOSYA ADI
                           ================================================== */

                        const extension =
                            dosyaUzantisi(
                                file.name
                            );


                        const safeProductName =
                            product.name
                                .toLowerCase()
                                .replace(
                                    /[^a-z0-9ğüşöçıİĞÜŞÖÇ_-]/gi,
                                    "-"
                                )
                                .replace(
                                    /-+/g,
                                    "-"
                                );


                        const fileName =
                            Date.now() +
                            "-" +
                            Math.random()
                                .toString(36)
                                .substring(2) +
                            extension;


                        const filePath =
                            safeProductName +
                            "/" +
                            fileName;


                        /* ==================================================
                           STORAGE
                           ================================================== */

                        const {
                            error: uploadError
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


                        /* ==================================================
                           PUBLIC URL
                           ================================================== */

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

                            throw new Error(
                                "Resim URL'si oluşturulamadı."
                            );
                        }


                        /* ==================================================
                           CATEGORY_IMAGES KAYDI
                           ================================================== */

                        const {
                            data:
                                imageRecord,
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

                                            product_id:
                                                product.id,

                                            category:
                                                product.category,

                                            image_path:
                                                filePath,

                                            image_url:
                                                imageUrl
                                        }
                                    ]
                                )
                                .select()
                                .single();


                        if (databaseError) {

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


                        /* ==================================================
                           ÜRÜNÜN ANA RESMİNİ GÜNCELLE
                           ================================================== */

                        const {
                            error:
                                productUpdateError
                        } =
                            await supabaseClient
                                .from(
                                    "products"
                                )
                                .update(
                                    {
                                        image_url:
                                            imageUrl
                                    }
                                )
                                .eq(
                                    "id",
                                    product.id
                                );


                        if (productUpdateError) {

                            console.warn(
                                "Ürün ana resmi güncellenemedi:",
                                productUpdateError
                            );
                        }


                        alert(
                            "Resim başarıyla yüklendi ve ürüne bağlandı."
                        );


                        /* ==================================================
                           FORM TEMİZLE
                           ================================================== */

                        imageFile.value =
                            "";


                        if (imageProduct) {

                            imageProduct.value =
                                "";
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

                        await dashboardBaslat();


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
                            "Resmi Yükle";
                    }
                }
            );
        }


        /* ======================================================
           RESİMLERİ YÜKLE
           ====================================================== */

        async function resimleriYukle() {

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
                            *,
                            products (
                                id,
                                name,
                                category
                            )
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


                if (
                    !data ||
                    data.length === 0
                ) {

                    imageList.innerHTML =
                        `
                        <div class="empty-state">
                            <h2>Henüz resim yok</h2>
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


                            const productName =
                                image.products &&
                                image.products.name
                                    ? image.products.name
                                    : "Ürün bulunamadı";


                            return `
                            <div
                                class="image-card"
                                data-image-id="${escapeHTML(image.id)}"
                                style="
                                    border:1px solid #ddd;
                                    border-radius:10px;
                                    padding:12px;
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
                                                width:180px;
                                                height:120px;
                                                object-fit:cover;
                                                border-radius:6px;
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


                                <button
                                    type="button"
                                    class="delete-image-button"
                                    data-id="${escapeHTML(image.id)}"
                                    data-path="${escapeHTML(
                                        image.image_path || ""
                                    )}"
                                    data-url="${escapeHTML(
                                        image.image_url || ""
                                    )}"
                                    data-product-id="${escapeHTML(
                                        image.product_id || ""
                                    )}"
                                >
                                    Resmi Sil
                                </button>

                            </div>
                            `;
                        }
                    ).join("");


                /* ==================================================
                   RESİM SİL
                   ================================================== */

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
                                        button.dataset.path,
                                        button.dataset.url,
                                        button.dataset.productId
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


                /*
                 * Eski tabloda product_id henüz yoksa
                 * kullanıcıya anlaşılır hata göster.
                 */

                imageList.innerHTML =
                    `
                    <div class="empty-state">
                        <h2>Resimler yüklenemedi</h2>
                        <p>
                            ${escapeHTML(error.message)}
                        </p>
                    </div>
                    `;
            }
        }


        /* ======================================================
           ÜRÜNLERİ RESİM SEÇİMİNE DOLDUR
           ====================================================== */

        async function resimUrunleriniDoldur() {

            if (!imageProduct) {
                return;
            }


            try {

                const {
                    data,
                    error
                } =
                    await supabaseClient
                        .from("products")
                        .select(
                            "id,name,category"
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


                imageProduct.innerHTML =
                    `
                    <option value="">
                        Ürün seçiniz
                    </option>
                    `;


                if (
                    !data ||
                    data.length === 0
                ) {

                    imageProduct.innerHTML +=
                        `
                        <option value="">
                            Önce ürün ekleyiniz
                        </option>
                        `;

                    return;
                }


                data.forEach(
                    function (product) {

                        const option =
                            document.createElement(
                                "option"
                            );


                        option.value =
                            product.id;


                        option.textContent =
                            product.name +
                            " — " +
                            (
                                product.category ||
                                ""
                            );


                        imageProduct.appendChild(
                            option
                        );
                    }
                );


            } catch (error) {

                console.error(
                    "Ürün seçim listesi alınamadı:",
                    error
                );


                imageProduct.innerHTML =
                    `
                    <option value="">
                        Ürünler alınamadı
                    </option>
                    `;
            }
        }


        /* ======================================================
           RESİM SİL
           ====================================================== */

        async function resimSil(
            id,
            imagePath,
            imageUrl,
            productId
        ) {

            const onay =
                confirm(
                    "Bu resmi silmek istediğinize emin misiniz?"
                );


            if (!onay) {
                return;
            }


            try {

                /* ==================================================
                   STORAGE
                   ================================================== */

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


                /* ==================================================
                   DATABASE
                   ================================================== */

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


                /* ==================================================
                   ÜRÜNÜN ANA RESMİNİ TEMİZLE
                   ================================================== */

                if (
                    productId &&
                    imageUrl
                ) {

                    const {
                        data: productData,
                        error:
                            productReadError
                    } =
                        await supabaseClient
                            .from(
                                "products"
                            )
                            .select(
                                "image_url"
                            )
                            .eq(
                                "id",
                                productId
                            )
                            .single();


                    if (
                        !productReadError &&
                        productData &&
                        productData.image_url === imageUrl
                    ) {

                        await supabaseClient
                            .from(
                                "products"
                            )
                            .update(
                                {
                                    image_url:
                                        null
                                }
                            )
                            .eq(
                                "id",
                                productId
                            );
                    }
                }


                alert(
                    "Resim silindi."
                );


                await resimleriYukle();

                await dashboardBaslat();


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


        /* ======================================================
           İLK RESİMLER
           ====================================================== */

        await resimleriYukle();
    }


    /* ==========================================================
       DASHBOARD
       ========================================================== */

    async function dashboardBaslat() {

        await toplamUrunSayisiniGetir();

        await aktifUrunSayisiniGetir();

        await toplamResimSayisiniGetir();
    }


    /* ==========================================================
       TOPLAM ÜRÜN
       ========================================================== */

    async function toplamUrunSayisiniGetir() {

        const element =
            document.getElementById(
                "totalProducts"
            ) ||
            document.getElementById(
                "totalProductCount"
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


    /* ==========================================================
       AKTİF ÜRÜN
       ========================================================== */

    async function aktifUrunSayisiniGetir() {

        const element =
            document.getElementById(
                "activeProducts"
            ) ||
            document.getElementById(
                "activeProductCount"
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
                        "active",
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


    /* ==========================================================
       TOPLAM RESİM
       ========================================================== */

    async function toplamResimSayisiniGetir() {

        const element =
            document.getElementById(
                "totalImages"
            ) ||
            document.getElementById(
                "imageCount"
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


    /* ==========================================================
       YARDIMCI FONKSİYONLAR
       ========================================================== */

    function getValue(id) {

        const element =
            document.getElementById(
                id
            );


        if (!element) {
            return "";
        }


        return String(
            element.value || ""
        ).trim();
    }


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


    function escapeHTML(value) {

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


    function dosyaUzantisi(
        fileName
    ) {

        const dotIndex =
            fileName.lastIndexOf(".");


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


    console.log(
        "admin.js yüklendi."
    );


})();
