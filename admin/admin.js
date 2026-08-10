/* ==========================================================
   SUR HALI ADMIN PANEL
   TEMİZ SÜRÜM
   ========================================================== */

console.log("Sur Halı Admin başlatılıyor...");


/* ==========================================================
   SUPABASE AYARLARI
   ========================================================== */

const SUPABASE_URL =
    "https://lhltolrtgnfkbwfkpaex.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_xdWMVRunvPSeiMw2vfGWyw_l6dTnBsn";

const STORAGE_BUCKET =
    "category-images";


/* ==========================================================
   SUPABASE BAŞLAT
   ========================================================== */

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
            "Supabase başlatılamadı:",
            error
        );

        return false;
    }
}


/* ==========================================================
   YARDIMCI FONKSİYONLAR
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


function formatPrice(value) {

    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {

        return "-";
    }


    const number =
        Number(value);


    if (
        Number.isNaN(number)
    ) {

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


function dosyaUzantisi(filename) {

    const index =
        filename.lastIndexOf(".");


    if (index === -1) {

        return "";
    }


    return filename
        .substring(index + 1)
        .toLowerCase();
}


function guvenliDosyaAdi(filename) {

    const extension =
        dosyaUzantisi(filename);


    const base =
        filename
            .substring(
                0,
                filename.lastIndexOf(".")
            )
            .toLowerCase()
            .replace(
                /[^a-z0-9ğüşöçıİĞÜŞÖÇ_-]+/gi,
                "-"
            )
            .replace(
                /-+/g,
                "-"
            )
            .replace(
                /^-|-$/g,
                ""
            );


    return (
        base ||
        "urun-resmi"
    ) +
        "-" +
        Date.now() +
        (
            extension
                ? "." + extension
                : ""
        );
}


/* ==========================================================
   MESAJLAR
   ========================================================== */

function mesajGoster(
    element,
    text,
    success = false
) {

    if (!element) {

        return;
    }


    element.textContent =
        text;


    element.style.display =
        "block";


    element.style.background =
        success
            ? "#e8f5e9"
            : "#fdeaea";


    element.style.color =
        success
            ? "#246b36"
            : "#a12626";


    element.style.border =
        success
            ? "1px solid #8bc48f"
            : "1px solid #d9534f";
}


function mesajTemizle(element) {

    if (!element) {

        return;
    }


    element.textContent =
        "";


    element.style.display =
        "none";
}


/* ==========================================================
   ANA BAŞLATMA
   ========================================================== */

document.addEventListener(
    "DOMContentLoaded",
    async function () {

        console.log(
            "DOM hazır."
        );


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
   ADMİN PANELİ
   ========================================================== */

async function adminPanelBaslat() {

    console.log(
        "Admin paneli başlatılıyor..."
    );


    const sidebar =
        document.querySelector(".sidebar");


    const mainContent =
        document.querySelector(".main-content");


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
                "Oturum kontrolü başarısız:",
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
            "Oturum kontrol hatası:",
            error
        );

        return;
    }


    /* ======================================================
       ELEMENTLER
    ====================================================== */

    const pages =
        document.querySelectorAll(".page");


    const menuItems =
        document.querySelectorAll(
            ".menu-item[data-page]"
        );


    const quickButtons =
        document.querySelectorAll(
            ".quick-actions [data-page]"
        );


    /* ======================================================
       SAYFA DEĞİŞTİRME
    ====================================================== */

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


        menuItems.forEach(
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


        if (
            pageId ===
            "productsPage"
        ) {

            urunleriYukle();
        }


        if (
            pageId ===
            "imagesPage"
        ) {

            resimleriYukle();
        }


        if (
            pageId ===
            "dashboardPage"
        ) {

            dashboardYukle();
        }
    }


    /* ======================================================
       MENÜLER
    ====================================================== */

    menuItems.forEach(
        function (menuItem) {

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
       HIZLI BUTONLAR
    ====================================================== */

    quickButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    const pageId =
                        button.getAttribute(
                            "data-page"
                        );


                    sayfaAc(pageId);

                }
            );

        }
    );


    /* ======================================================
       ÇIKIŞ
    ====================================================== */

    const logoutButton =
        document.getElementById(
            "logoutButton"
        );


    if (logoutButton) {

        logoutButton.addEventListener(
            "click",
            async function () {

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
                        "Çıkış hatası:",
                        error
                    );
                }

            }
        );
    }


    /* ======================================================
       ÜRÜN YÖNETİMİ
    ====================================================== */

    let duzenlenenUrunId =
        null;


    const newProductButton =
        document.getElementById(
            "newProductButton"
        );


    const cancelProductButton =
        document.getElementById(
            "cancelProductButton"
        );


    const productForm =
        document.getElementById(
            "productForm"
        );


    const productFormBox =
        document.getElementById(
            "productFormBox"
        );


    const productFormTitle =
        document.getElementById(
            "productFormTitle"
        );


    const saveProductButton =
        document.getElementById(
            "saveProductButton"
        );


    const productFormMessage =
        document.getElementById(
            "productFormMessage"
        );


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


    function urunFormunuAc(
        product = null
    ) {

        if (!productFormBox) {

            return;
        }


        productFormBox.style.display =
            "block";


        if (product) {

            duzenlenenUrunId =
                product.id;


            if (productFormTitle) {

                productFormTitle.textContent =
                    "Ürünü Düzenle";
            }


            if (saveProductButton) {

                saveProductButton.textContent =
                    "Güncelle";
            }


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


            if (priceElement) {

                priceElement.value =
                    product.price ?? "";
            }


            if (descriptionElement) {

                descriptionElement.value =
                    product.description || "";
            }


            if (activeElement) {

                activeElement.value =
                    String(
                        product.is_active !== false
                    );
            }

        } else {

            duzenlenenUrunId =
                null;


            if (productFormTitle) {

                productFormTitle.textContent =
                    "Yeni Ürün Ekle";
            }


            if (saveProductButton) {

                saveProductButton.textContent =
                    "Ürünü Kaydet";
            }


            if (productForm) {

                productForm.reset();
            }

        }


        productFormBox.scrollIntoView(
            {
                behavior: "smooth",
                block: "start"
            }
        );
    }


    function urunFormunuKapat() {

        duzenlenenUrunId =
            null;


        if (productForm) {

            productForm.reset();
        }


        if (productFormBox) {

            productFormBox.style.display =
                "none";
        }


        if (productFormTitle) {

            productFormTitle.textContent =
                "Yeni Ürün Ekle";
        }


        if (saveProductButton) {

            saveProductButton.textContent =
                "Ürünü Kaydet";
        }


        mesajTemizle(
            productFormMessage
        );
    }


    if (newProductButton) {

        newProductButton.addEventListener(
            "click",
            function () {

                urunFormunuAc();

            }
        );
    }


    if (cancelProductButton) {

        cancelProductButton.addEventListener(
            "click",
            function () {

                urunFormunuKapat();

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
                    nameElement
                        ? nameElement.value.trim()
                        : "";


                const category =
                    categoryElement
                        ? categoryElement.value
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


                const isActive =
                    activeElement
                        ? activeElement.value === "true"
                        : true;


                mesajTemizle(
                    productFormMessage
                );


                if (!name) {

                    mesajGoster(
                        productFormMessage,
                        "Ürün adı boş bırakılamaz."
                    );

                    return;
                }


                if (!category) {

                    mesajGoster(
                        productFormMessage,
                        "Lütfen kategori seçin."
                    );

                    return;
                }


                let price =
                    null;


                if (priceText !== "") {

                    price =
                        Number(priceText);


                    if (
                        Number.isNaN(price)
                    ) {

                        mesajGoster(
                            productFormMessage,
                            "Fiyat bilgisi geçerli değil."
                        );

                        return;
                    }
                }


                const urunData = {

                    name: name,

                    category: category,

                    size:
                        size || null,

                    price: price,

                    description:
                        description || null,

                    is_active:
                        isActive
                };


                try {

                    if (duzenlenenUrunId) {

                        const {
                            error
                        } =
                            await supabaseClient
                                .from("products")
                                .update(urunData)
                                .eq(
                                    "id",
                                    duzenlenenUrunId
                                );


                        if (error) {

                            throw error;
                        }


                        mesajGoster(
                            productFormMessage,
                            "Ürün başarıyla güncellendi.",
                            true
                        );

                    } else {

                        const {
                            error
                        } =
                            await supabaseClient
                                .from("products")
                                .insert(
                                    [urunData]
                                );


                        if (error) {

                            throw error;
                        }


                        mesajGoster(
                            productFormMessage,
                            "Ürün başarıyla kaydedildi.",
                            true
                        );
                    }


                    duzenlenenUrunId =
                        null;


                    productForm.reset();


                    if (productFormTitle) {

                        productFormTitle.textContent =
                            "Yeni Ürün Ekle";
                    }


                    if (saveProductButton) {

                        saveProductButton.textContent =
                            "Ürünü Kaydet";
                    }


                    await urunleriYukle();

                    await dashboardYukle();


                    /*
                     * Ürün değiştiği için
                     * resim ürün listesini de
                     * yeniden hazırlıyoruz.
                     */

                    await resimUrunleriniHazirla();

                } catch (error) {

                    console.error(
                        "Ürün kaydetme hatası:",
                        error
                    );


                    mesajGoster(
                        productFormMessage,
                        error.message ||
                        "Ürün kaydedilemedi."
                    );
                }

            }
        );
    }


    /* ======================================================
       ÜRÜNLERİ GETİR
    ====================================================== */

    async function urunleriYukle() {

        const productList =
            document.getElementById(
                "productList"
            );


        const productCount =
            document.getElementById(
                "productCount"
            );


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


            const products =
                data || [];


            if (productCount) {

                productCount.textContent =
                    products.length +
                    " ürün";
            }


            if (
                products.length === 0
            ) {

                productList.innerHTML = `
                    <div class="empty-state">

                        <div class="empty-icon">
                            ▤
                        </div>

                        <h2>
                            Henüz ürün yok
                        </h2>

                        <p>
                            Yeni Ürün butonunu kullanarak ürün ekleyebilirsiniz.
                        </p>

                    </div>
                `;

                return;
            }


            productList.innerHTML =
                products
                    .map(
                        function (product) {

                            return `

                                <div
                                    class="product-item"
                                    data-product-id="${escapeHTML(product.id)}"
                                    style="
                                        display:flex;
                                        justify-content:space-between;
                                        align-items:center;
                                        gap:20px;
                                        padding:18px;
                                        margin-bottom:12px;
                                        border:1px solid rgba(212,175,55,.25);
                                        border-radius:10px;
                                    "
                                >

                                    <div>

                                        <h3>
                                            ${escapeHTML(product.name)}
                                        </h3>

                                        <p>
                                            <strong>Kategori:</strong>
                                            ${escapeHTML(product.category || "-")}
                                        </p>

                                        <p>
                                            <strong>Ölçü:</strong>
                                            ${escapeHTML(product.size || "-")}
                                        </p>

                                        <p>
                                            <strong>Fiyat:</strong>
                                            ${formatPrice(product.price)}
                                        </p>

                                        <p>
                                            <strong>Durum:</strong>
                                            ${
                                                product.is_active
                                                    ? "Aktif"
                                                    : "Pasif"
                                            }
                                        </p>

                                    </div>


                                    <div
                                        style="
                                            display:flex;
                                            gap:10px;
                                            flex-wrap:wrap;
                                        "
                                    >

                                        <button
                                            type="button"
                                            class="outline-button edit-product-button"
                                            data-id="${escapeHTML(product.id)}"
                                            style="
                                                padding:8px 12px;
                                                cursor:pointer;
                                                color:#D4AF37 !important;
                                                border:1px solid #D4AF37 !important;
                                                background:transparent !important;
                                                border-radius:6px;
                                            "
                                        >
                                            Düzenle
                                        </button>


                                        <button
                                            type="button"
                                            class="delete-product-button"
                                            data-id="${escapeHTML(product.id)}"
                                            style="
                                                padding:8px 14px;
                                                cursor:pointer;
                                                color:#fff;
                                                background:#b52b2b;
                                                border:0;
                                                border-radius:6px;
                                            "
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

                                const id =
                                    button.getAttribute(
                                        "data-id"
                                    );


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

                                    console.error(
                                        "Ürün alınamadı:",
                                        error
                                    );

                                    return;
                                }


                                urunFormunuAc(
                                    data
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

                                const id =
                                    button.getAttribute(
                                        "data-id"
                                    );


                                const onay =
                                    confirm(
                                        "Bu ürünü silmek istediğinize emin misiniz?"
                                    );


                                if (!onay) {

                                    return;
                                }


                                try {

                                    /*
                                     * Önce ürünün resim kayıtlarını
                                     * buluyoruz.
                                     */

                                    const {
                                        data: images,
                                        error: imageError
                                    } =
                                        await supabaseClient
                                            .from(
                                                "category_images"
                                            )
                                            .select(
                                                "id,image_path"
                                            )
                                            .eq(
                                                "product_id",
                                                id
                                            );


                                    if (imageError) {

                                        throw imageError;
                                    }


                                    /*
                                     * Storage dosyalarını sil.
                                     */

                                    if (
                                        images &&
                                        images.length
                                    ) {

                                        const paths =
                                            images
                                                .map(
                                                    image =>
                                                        image.image_path
                                                )
                                                .filter(
                                                    Boolean
                                                );


                                        if (
                                            paths.length
                                        ) {

                                            const {
                                                error:
                                                    storageError
                                            } =
                                                await supabaseClient
                                                    .storage
                                                    .from(
                                                        STORAGE_BUCKET
                                                    )
                                                    .remove(
                                                        paths
                                                    );


                                            if (
                                                storageError
                                            ) {

                                                console.warn(
                                                    "Storage resimleri silinemedi:",
                                                    storageError
                                                );
                                            }
                                        }


                                        /*
                                         * Veritabanındaki
                                         * resim kayıtlarını sil.
                                         */

                                        const {
                                            error:
                                                imageDeleteError
                                        } =
                                            await supabaseClient
                                                .from(
                                                    "category_images"
                                                )
                                                .delete()
                                                .eq(
                                                    "product_id",
                                                    id
                                                );


                                        if (
                                            imageDeleteError
                                        ) {

                                            throw imageDeleteError;
                                        }
                                    }


                                    /*
                                     * Ürünü sil.
                                     */

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


                                    await urunleriYukle();

                                    await dashboardYukle();

                                    await resimUrunleriniHazirla();

                                } catch (error) {

                                    console.error(
                                        "Ürün silme hatası:",
                                        error
                                    );

                                    alert(
                                        error.message ||
                                        "Ürün silinemedi."
                                    );
                                }

                            }
                        );
                    }
                );

        } catch (error) {

            console.error(
                "Ürünler alınamadı:",
                error
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
        }
    }


    /* ======================================================
       DASHBOARD
    ====================================================== */

    async function dashboardYukle() {

        const totalProducts =
            document.getElementById(
                "totalProducts"
            );


        const activeProducts =
            document.getElementById(
                "activeProducts"
            );


        const totalImages =
            document.getElementById(
                "totalImages"
            );


        try {

            const {
                count: productCount,
                error: productError
            } =
                await supabaseClient
                    .from("products")
                    .select(
                        "id",
                        {
                            count: "exact",
                            head: true
                        }
                    );


            if (productError) {

                throw productError;
            }


            const {
                count: activeCount,
                error: activeError
            } =
                await supabaseClient
                    .from("products")
                    .select(
                        "id",
                        {
                            count: "exact",
                            head: true
                        }
                    )
                    .eq(
                        "is_active",
                        true
                    );


            if (activeError) {

                throw activeError;
            }


            const {
                count: imageCount,
                error: imageError
            } =
                await supabaseClient
                    .from("category_images")
                    .select(
                        "id",
                        {
                            count: "exact",
                            head: true
                        }
                    );


            if (imageError) {

                throw imageError;
            }


            if (totalProducts) {

                totalProducts.textContent =
                    productCount || 0;
            }


            if (activeProducts) {

                activeProducts.textContent =
                    activeCount || 0;
            }


            if (totalImages) {

                totalImages.textContent =
                    imageCount || 0;
            }


        } catch (error) {

            console.error(
                "Dashboard verileri alınamadı:",
                error
            );
        }
    }


    /* ======================================================
       RESİM ELEMANLARI
    ====================================================== */

    const imageFile =
        document.getElementById(
            "imageFile"
        );


    const imageCategory =
        document.getElementById(
            "imageCategory"
        );


    const imageProduct =
        document.getElementById(
            "imageProduct"
        );


    const imagePreviewBox =
        document.getElementById(
            "imagePreviewBox"
        );


    const imagePreview =
        document.getElementById(
            "imagePreview"
        );


    const uploadImageButton =
        document.getElementById(
            "uploadImageButton"
        );


    const imageUploadMessage =
        document.getElementById(
            "imageUploadMessage"
        );


    /* ======================================================
       KATEGORİ DEĞİŞİNCE ÜRÜNLERİ GETİR
    ====================================================== */

    if (imageCategory) {

        imageCategory.addEventListener(
            "change",
            async function () {

                await resimUrunleriniHazirla();

            }
        );
    }


    /* ======================================================
       KATEGORİYE GÖRE ÜRÜNLER
    ====================================================== */

    async function resimUrunleriniHazirla() {

        if (!imageProduct) {

            return;
        }


        const category =
            imageCategory
                ? imageCategory.value
                : "";


        imageProduct.innerHTML =
            "";


        imageProduct.disabled =
            true;


        if (!category) {

            imageProduct.innerHTML = `

                <option value="">
                    Önce kategori seçiniz
                </option>

            `;

            return;
        }


        imageProduct.innerHTML = `

            <option value="">
                Ürünler yükleniyor...
            </option>

        `;


        try {

            const {
                data,
                error
            } =
                await supabaseClient
                    .from("products")
                    .select(
                        "id,name,size,price,is_active"
                    )
                    .eq(
                        "category",
                        category
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


            const products =
                data || [];


            /*
             * Sadece aktif ürünleri gösteriyoruz.
             */

            const activeProductsList =
                products.filter(
                    product =>
                        product.is_active !== false
                );


            if (
                activeProductsList.length === 0
            ) {

                imageProduct.innerHTML = `

                    <option value="">
                        Bu kategoride ürün bulunamadı
                    </option>

                `;

                imageProduct.disabled =
                    true;

                return;
            }


            imageProduct.innerHTML = `

                <option value="">
                    Ürün seçiniz
                </option>

            `;


            activeProductsList.forEach(
                function (product) {

                    const option =
                        document.createElement(
                            "option"
                        );


                    option.value =
                        product.id;


                    option.textContent =
                        product.size
                            ? product.name +
                              " — " +
                              product.size
                            : product.name;


                    imageProduct.appendChild(
                        option
                    );
                }
            );


            imageProduct.disabled =
                false;


        } catch (error) {

            console.error(
                "Kategori ürünleri alınamadı:",
                error
            );


            imageProduct.innerHTML = `

                <option value="">
                    Ürünler yüklenemedi
                </option>

            `;


            imageProduct.disabled =
                true;
        }
    }


    /* ======================================================
       RESİM ÖNİZLEME
    ====================================================== */

    if (imageFile) {

        imageFile.addEventListener(
            "change",
            function () {

                mesajTemizle(
                    imageUploadMessage
                );


                const file =
                    imageFile.files &&
                    imageFile.files[0];


                if (!file) {

                    if (imagePreviewBox) {

                        imagePreviewBox.style.display =
                            "none";
                    }

                    return;
                }


                if (
                    !file.type.startsWith(
                        "image/"
                    )
                ) {

                    mesajGoster(
                        imageUploadMessage,
                        "Lütfen geçerli bir resim dosyası seçin."
                    );


                    imageFile.value =
                        "";


                    return;
                }


                const reader =
                    new FileReader();


                reader.onload =
                    function (event) {

                        if (imagePreview) {

                            imagePreview.src =
                                event.target.result;
                        }


                        if (imagePreviewBox) {

                            imagePreviewBox.style.display =
                                "block";
                        }
                    };


                reader.readAsDataURL(
                    file
                );
            }
        );
    }


    /* ======================================================
       RESİM YÜKLE
    ====================================================== */

    if (uploadImageButton) {

        uploadImageButton.addEventListener(
            "click",
            async function () {

                mesajTemizle(
                    imageUploadMessage
                );


                const file =
                    imageFile &&
                    imageFile.files &&
                    imageFile.files[0];


                const category =
                    imageCategory
                        ? imageCategory.value
                        : "";


                const productId =
                    imageProduct
                        ? imageProduct.value
                        : "";


                if (!file) {

                    mesajGoster(
                        imageUploadMessage,
                        "Lütfen bir resim seçin."
                    );

                    return;
                }


                if (!category) {

                    mesajGoster(
                        imageUploadMessage,
                        "Lütfen resim kategorisini seçin."
                    );

                    return;
                }


                if (!productId) {

                    mesajGoster(
                        imageUploadMessage,
                        "Lütfen resmi bağlayacağınız ürünü seçin."
                    );

                    return;
                }


                const allowedTypes = [
                    "image/jpeg",
                    "image/png",
                    "image/webp"
                ];


                if (
                    !allowedTypes.includes(
                        file.type
                    )
                ) {

                    mesajGoster(
                        imageUploadMessage,
                        "Sadece JPG, PNG veya WEBP resimleri yükleyebilirsiniz."
                    );

                    return;
                }


                uploadImageButton.disabled =
                    true;


                uploadImageButton.textContent =
                    "Yükleniyor...";


                try {

                    /*
                     * Ürünü getir.
                     */

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


                    /*
                     * Dosya adını güvenli hale getir.
                     */

                    const fileName =
                        guvenliDosyaAdi(
                            file.name
                        );


                    /*
                     * Ürüne özel klasör.
                     *
                     * Örnek:
                     *
                     * Sisal/
                     * ürün-id/
                     * sisal-2x290-123456.jpg
                     */

                    const filePath =
                        category +
                        "/" +
                        productId +
                        "/" +
                        fileName;


                    /*
                     * STORAGE'A YÜKLE
                     */

                    const {
                        error: uploadError
                    } =
                        await supabaseClient
                            .storage
                            .from(
                                STORAGE_BUCKET
                            )
                            .upload(
                                filePath,
                                file,
                                {
                                    cacheControl:
                                        "3600",
                                    upsert:
                                        false,
                                    contentType:
                                        file.type
                                }
                            );


                    if (uploadError) {

                        throw uploadError;
                    }


                    /*
                     * PUBLIC URL
                     */

                    const {
                        data:
                            publicUrlData
                    } =
                        supabaseClient
                            .storage
                            .from(
                                STORAGE_BUCKET
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
                            "Resmin public URL'si oluşturulamadı."
                        );
                    }


                    /*
                     * CATEGORY_IMAGES KAYDI
                     *
                     * EN ÖNEMLİ KISIM:
                     *
                     * product_id = seçilen ürünün ID'si
                     */

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
                                        category:
                                            category,

                                        image_path:
                                            filePath,

                                        image_url:
                                            imageUrl,

                                        product_id:
                                            productId
                                    }
                                ]
                            )
                            .select()
                            .single();


                    if (databaseError) {

                        /*
                         * Database kaydı olmazsa
                         * Storage'daki resmi de
                         * geri siliyoruz.
                         */

                        await supabaseClient
                            .storage
                            .from(
                                STORAGE_BUCKET
                            )
                            .remove(
                                [
                                    filePath
                                ]
                            );


                        throw databaseError;
                    }


                    /*
                     * Ürünün image_url alanı boşsa
                     * ilk resmi ana resim olarak kaydet.
                     *
                     * Böylece mevcut site yapısı
                     * image_url kullanıyorsa da çalışır.
                     */

                    const {
                        data:
                            existingProduct,
                        error:
                            existingProductError
                    } =
                        await supabaseClient
                            .from("products")
                            .select(
                                "image_url"
                            )
                            .eq(
                                "id",
                                productId
                            )
                            .single();


                    if (
                        !existingProductError &&
                        existingProduct &&
                        !existingProduct.image_url
                    ) {

                        await supabaseClient
                            .from("products")
                            .update(
                                {
                                    image_url:
                                        imageUrl
                                }
                            )
                            .eq(
                                "id",
                                productId
                            );
                    }


                    console.log(
                        "Resim başarıyla kaydedildi:",
                        imageRecord
                    );


                    mesajGoster(
                        imageUploadMessage,
                        product.name +
                        " ürününe ait resim başarıyla yüklendi.",
                        true
                    );


                    /*
                     * Formu temizle.
                     */

                    if (imageFile) {

                        imageFile.value =
                            "";
                    }


                    if (imagePreview) {

                        imagePreview.src =
                            "";
                    }


                    if (imagePreviewBox) {

                        imagePreviewBox.style.display =
                            "none";
                    }


                    if (imageCategory) {

                        imageCategory.value =
                            "";
                    }


                    if (imageProduct) {

                        imageProduct.innerHTML = `

                            <option value="">
                                Önce kategori seçiniz
                            </option>

                        `;

                        imageProduct.disabled =
                            true;
                    }


                    /*
                     * Liste ve dashboard yenile.
                     */

                    await resimleriYukle();

                    await dashboardYukle();

                } catch (error) {

                    console.error(
                        "Resim yükleme hatası:",
                        error
                    );


                    mesajGoster(
                        imageUploadMessage,
                        error.message ||
                        "Resim yüklenemedi."
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
       RESİMLERİ GETİR
    ====================================================== */

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
                        product_id,
                        products (
                            name,
                            size
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


            const images =
                data || [];


            if (imageCount) {

                imageCount.textContent =
                    images.length +
                    " resim";
            }


            if (
                images.length === 0
            ) {

                imageList.innerHTML = `

                    <div class="empty-state">

                        <div class="empty-icon">
                            ▧
                        </div>

                        <h2>
                            Henüz resim yok
                        </h2>

                        <p>
                            Yukarıdaki formu kullanarak ürün resmi yükleyebilirsiniz.
                        </p>

                    </div>

                `;

                return;
            }


            imageList.innerHTML =
                images
                    .map(
                        function (image) {

                            const product =
                                image.products;


                            const productName =
                                product &&
                                product.name
                                    ? product.name
                                    : "Ürün bilgisi yok";


                            const productSize =
                                product &&
                                product.size
                                    ? " — " +
                                      product.size
                                    : "";


                            return `

                                <div
                                    class="image-card"
                                    data-image-id="${escapeHTML(image.id)}"
                                    style="
                                        border:1px solid #e0e0e0;
                                        border-radius:10px;
                                        overflow:hidden;
                                        background:#fff;
                                    "
                                >

                                    <div
                                        style="
                                            width:100%;
                                            height:220px;
                                            background:#f5f5f5;
                                            display:flex;
                                            align-items:center;
                                            justify-content:center;
                                        "
                                    >

                                        <img
                                            src="${escapeHTML(image.image_url || "")}"
                                            alt="${escapeHTML(productName)}"
                                            style="
                                                width:100%;
                                                height:220px;
                                                object-fit:cover;
                                            "
                                        >

                                    </div>


                                    <div
                                        style="
                                            padding:15px;
                                        "
                                    >

                                        <strong>
                                            ${escapeHTML(productName)}
                                            ${escapeHTML(productSize)}
                                        </strong>


                                        <p
                                            style="
                                                margin:8px 0;
                                            "
                                        >
                                            Kategori:
                                            ${escapeHTML(image.category)}
                                        </p>


                                        <button
                                            type="button"
                                            class="delete-image-button"
                                            data-id="${escapeHTML(image.id)}"
                                            data-path="${escapeHTML(image.image_path || "")}"
                                            style="
                                                width:100%;
                                                padding:9px;
                                                cursor:pointer;
                                                background:#b52b2b;
                                                color:#fff;
                                                border:0;
                                                border-radius:6px;
                                            "
                                        >
                                            Resmi Sil
                                        </button>

                                    </div>

                                </div>
                            `;
                        }
                    )
                    .join("");


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

                                const imageId =
                                    button.getAttribute(
                                        "data-id"
                                    );


                                const imagePath =
                                    button.getAttribute(
                                        "data-path"
                                    );


                                const onay =
                                    confirm(
                                        "Bu resmi silmek istediğinize emin misiniz?"
                                    );


                                if (!onay) {

                                    return;
                                }


                                try {

                                    /*
                                     * Storage'dan sil.
                                     */

                                    if (imagePath) {

                                        const {
                                            error:
                                                storageError
                                        } =
                                            await supabaseClient
                                                .storage
                                                .from(
                                                    STORAGE_BUCKET
                                                )
                                                .remove(
                                                    [
                                                        imagePath
                                                    ]
                                                );


                                        if (
                                            storageError
                                        ) {

                                            console.warn(
                                                "Storage resmi silinemedi:",
                                                storageError
                                            );
                                        }
                                    }


                                    /*
                                     * Database kaydını sil.
                                     */

                                    const {
                                        error
                                    } =
                                        await supabaseClient
                                            .from(
                                                "category_images"
                                            )
                                            .delete()
                                            .eq(
                                                "id",
                                                imageId
                                            );


                                    if (error) {

                                        throw error;
                                    }


                                    await resimleriYukle();

                                    await dashboardYukle();

                                } catch (error) {

                                    console.error(
                                        "Resim silme hatası:",
                                        error
                                    );


                                    alert(
                                        error.message ||
                                        "Resim silinemedi."
                                    );
                                }

                            }
                        );
                    }
                );

        } catch (error) {

            console.error(
                "Resimler alınamadı:",
                error
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
        }
    }


    /* ======================================================
       İLK VERİLER
    ====================================================== */

    await dashboardYukle();

    await urunleriYukle();

    await resimleriYukle();

    await resimUrunleriniHazirla();


    /* ======================================================
       İLK SAYFA
    ====================================================== */

    sayfaAc(
        "dashboardPage"
    );


    console.log(
        "Admin paneli başarıyla başlatıldı."
    );
}
