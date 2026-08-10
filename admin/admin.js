/* ==========================================================
   SUR HALI ADMIN PANEL
   TEMİZ SÜRÜM
   ========================================================== */

console.log("Sur Halı Admin başlatılıyor...");

/* ==========================================================
   SUPABASE
   ========================================================== */

const SUPABASE_URL =
    "https://lhltolrtgnfkbwfkpaex.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_xdWMVRunvPSeiMw2vfGWyw_l6dTnBsn";

let supabaseClient = null;


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

        const supabaseHazir =
            supabaseBaslat();

        if (!supabaseHazir) {

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


    /* ======================================================
       HTML ELEMANLARI
       ====================================================== */

    const sidebar =
        document.querySelector(".sidebar");

    const mainContent =
        document.querySelector(".main-content");


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
            await supabaseClient.auth.getSession();


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

            /*
             * Eğer giriş sayfanın adı farklıysa
             * buradaki adresi değiştirebilirsin.
             */

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
            "#logoutButton, .logout-button, [data-action='logout']"
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

                            console.error(
                                "Çıkış hatası:",
                                error
                            );

                            return;
                        }


                        window.location.href =
                            "admin-login.html";

                    } catch (error) {

                        console.error(
                            "Çıkış sırasında hata:",
                            error
                        );
                    }
                }
            );
        }
    );


    /* ======================================================
       SAYFALAR
       ====================================================== */

    const pages =
        document.querySelectorAll(
            ".admin-page, .page"
        );


    const menuItems =
        document.querySelectorAll(
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


        /*
         * Önce bütün sayfaları gizle
         */

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


        /*
         * Hedef sayfayı bul
         */

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


        /*
         * Menü aktifliği
         */

        menuItems.forEach(
            function (item) {

                if (
                    item.closest(
                        ".sidebar"
                    )
                ) {

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
            }
        );
    }


    /* ======================================================
       SOL MENÜ BUTONLARI
       ====================================================== */

    menuItems.forEach(
        function (menuItem) {

            if (
                !menuItem.closest(
                    ".sidebar"
                )
            ) {
                return;
            }


            menuItem.addEventListener(
                "click",
                function (e) {

                    e.preventDefault();

                    const pageId =
                        menuItem.getAttribute(
                            "data-page"
                        );

                    sayfaAc(pageId);
                }
            );
        }
    );


    /* ======================================================
       DASHBOARD HIZLI BUTONLAR
       ====================================================== */

    const quickButtons =
        document.querySelectorAll(
            "[data-page]"
        );


    quickButtons.forEach(
        function (button) {

            if (
                button.closest(
                    ".sidebar"
                )
            ) {
                return;
            }


            button.addEventListener(
                "click",
                function (e) {

                    e.preventDefault();

                    const pageId =
                        button.getAttribute(
                            "data-page"
                        );


                    if (pageId) {

                        sayfaAc(
                            pageId
                        );
                    }
                }
            );
        }
    );


    /* ======================================================
       İLK SAYFA
       ====================================================== */

    const activeMenu =
        document.querySelector(
            ".sidebar [data-page].active"
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
                ".admin-page, .page"
            );


        if (firstPage) {

            sayfaAc(
                firstPage.id
            );
        }
    }


    /* ======================================================
       ÜRÜN YÖNETİMİ
       ====================================================== */

    urunYonetiminiBaslat();


    /* ======================================================
       RESİM YÖNETİMİ
       ====================================================== */

    resimYonetiminiBaslat();


    /* ======================================================
       DASHBOARD
       ====================================================== */

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


    let duzenlenenUrunId =
        null;


    /* ======================================================
       FORM YOKSA
       ====================================================== */

    if (
        !productForm &&
        !productList
    ) {

        console.log(
            "Ürün yönetimi elemanları bu sayfada bulunamadı."
        );

        return;
    }


    /* ======================================================
       ÜRÜN LİSTESİ
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

                console.error(
                    "Ürünler alınamadı:",
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

                return;
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
                data
                    .map(
                        function (product) {

                            return `
                            <div
                                class="product-item"
                                data-product-id="${escapeHTML(
                                    product.id
                                )}"
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
                                        ${product.price != null
                                            ? escapeHTML(
                                                String(product.price)
                                            ) + " TL"
                                            : "-"
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
                                        data-id="${escapeHTML(
                                            product.id
                                        )}"
                                    >
                                        Düzenle
                                    </button>

                                    <button
                                        type="button"
                                        class="delete-product-button"
                                        data-id="${escapeHTML(
                                            product.id
                                        )}"
                                    >
                                        Sil
                                    </button>

                                </div>

                            </div>
                            `;
                        }
                    )
                    .join("");


            /* ==================================================
               DÜZENLE
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
               SİL
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
                    <h2>Hata oluştu</h2>
                    <p>
                        ${escapeHTML(
                            error.message
                        )}
                    </p>
                </div>
                `;
        }
    }


    /* ======================================================
       YENİ ÜRÜN BUTONU
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


                if (saveButton) {

                    saveButton.textContent =
                        "Ürünü Kaydet";
                }
            }
        );
    }


    /* ======================================================
       FORM
       ====================================================== */

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


                const imageUrl =
                    imageUrlElement
                        ? imageUrlElement.value.trim()
                        : "";


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
                            priceText
                                .replace(",", ".")
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
                    .eq("id", id)
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
                "productImageUrl",
                data.image_url
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
       İLK YÜKLEME
       ====================================================== */

    urunleriYukle();
}


/* ==========================================================
   RESİM YÖNETİMİ
   ========================================================== */

function resimYonetiminiBaslat() {

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


                if (preview) {

                    preview.src =
                        URL.createObjectURL(
                            file
                        );

                    preview.style.display =
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


                const category =
                    imageCategory
                        ? imageCategory.value.trim()
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


                try {

                    uploadImageButton.disabled =
                        true;

                    uploadImageButton.textContent =
                        "Yükleniyor...";


                    const extension =
                        dosyaUzantisi(
                            file.name
                        );


                    const safeCategory =
                        category
                            .toLowerCase()
                            .replace(
                                /[^a-z0-9ğüşöçıİĞÜŞÖÇ_-]/gi,
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
                        safeCategory +
                        "/" +
                        fileName;


                    /* ==========================================
                       STORAGE
                       ========================================== */

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


                    /* ==========================================
                       PUBLIC URL
                       ========================================== */

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


                    /* ==========================================
                       DATABASE
                       ========================================== */

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
                                            imageUrl
                                    }
                                ]
                            );


                    if (databaseError) {

                        /*
                         * Database kaydı başarısız olursa
                         * Storage dosyasını da kaldır.
                         */

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


                    alert(
                        "Resim başarıyla yüklendi."
                    );


                    imageFile.value =
                        "";


                    if (imageCategory) {

                        imageCategory.value =
                            "";
                    }


                    const preview =
                        document.getElementById(
                            "imagePreview"
                        );


                    if (preview) {

                        preview.src =
                            "";

                        preview.style.display =
                            "none";
                    }


                    await resimleriYukle();


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

                imageList.innerHTML =
                    `
                    <div class="empty-state">
                        <h2>Henüz resim yok</h2>
                    </div>
                    `;

                return;
            }


            imageList.innerHTML =
                data
                    .map(
                        function (image) {

                            const url =
                                image.image_url ||
                                "";


                            return `
                            <div
                                class="image-card"
                                data-image-id="${escapeHTML(
                                    image.id
                                )}"
                                style="
                                    border:1px solid #ddd;
                                    border-radius:10px;
                                    padding:10px;
                                    margin-bottom:10px;
                                "
                            >

                                ${
                                    url
                                        ? `
                                        <img
                                            src="${escapeHTML(
                                                url
                                            )}"
                                            alt="${escapeHTML(
                                                image.category ||
                                                "Sur Halı"
                                            )}"
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
                                    <strong>
                                        Kategori:
                                    </strong>

                                    ${escapeHTML(
                                        image.category ||
                                        "-"
                                    )}
                                </p>

                                <button
                                    type="button"
                                    class="delete-image-button"
                                    data-id="${escapeHTML(
                                        image.id
                                    )}"
                                    data-path="${escapeHTML(
                                        image.image_path ||
                                        ""
                                    )}"
                                >
                                    Resmi Sil
                                </button>

                            </div>
                            `;
                        }
                    )
                    .join("");


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


    /* ======================================================
       RESİM SİL
       ====================================================== */

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

            /* ==============================================
               STORAGE
               ============================================== */

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


            /* ==============================================
               DATABASE
               ============================================== */

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
       İLK RESİM YÜKLEME
       ====================================================== */

    resimleriYukle();
}


/* ==========================================================
   DASHBOARD
   ========================================================== */

function dashboardBaslat() {

    toplamUrunSayisiniGetir();

    aktifUrunSayisiniGetir();

    toplamResimSayisiniGetir();
}


/* ==========================================================
   TOPLAM ÜRÜN
   ========================================================== */

async function toplamUrunSayisiniGetir() {

    const element =
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
                        count: "exact",
                        head: true
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
                        count: "exact",
                        head: true
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
                        count: "exact",
                        head: true
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
   INPUT DEĞERİ
   ========================================================== */

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


/* ==========================================================
   DOSYA UZANTISI
   ========================================================== */

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


/* ==========================================================
   SON
   ========================================================== */

console.log(
    "admin.js yüklendi."
);
