console.log("Sur Halı Admin başlatılıyor...");


/* ==========================================================
   DOM HAZIR
========================================================== */

document.addEventListener("DOMContentLoaded", function () {

    console.log("DOM hazır.");

    const loginForm =
        document.getElementById("loginForm");


    /* ======================================================
       GİRİŞ SAYFASI
    ====================================================== */

    if (loginForm) {

        console.log("Giriş sayfası.");

        if (!loginForm.dataset.supabaseBound) {

            loginForm.addEventListener(
                "submit",
                girisYap
            );

            loginForm.dataset.supabaseBound = "true";
        }

        return;
    }


    /* ======================================================
       ADMİN PANELİ
    ====================================================== */

    const adminContainer =
        document.querySelector(".admin-container");

    if (adminContainer) {

        console.log("Admin paneli bulundu.");

        adminPanelBaslat();
    }

});


/* ==========================================================
   GİRİŞ
========================================================== */

async function girisYap(e) {

    e.preventDefault();


    const emailElement =
        document.getElementById("email");

    const passwordElement =
        document.getElementById("password");

    const mesaj =
        document.getElementById("loginMessage");


    if (!emailElement || !passwordElement) {
        return;
    }


    const email =
        emailElement.value.trim();

    const password =
        passwordElement.value;


    if (mesaj) {
        mesaj.textContent = "";
    }


    if (typeof supabaseClient === "undefined") {

        if (mesaj) {
            mesaj.textContent =
                "Supabase bağlantısı kurulamadı.";
        }

        return;
    }


    try {

        const {
            data,
            error
        } =
            await supabaseClient.auth.signInWithPassword({
                email: email,
                password: password
            });


        if (error) {

            console.error(
                "Giriş hatası:",
                error
            );

            if (mesaj) {
                mesaj.textContent =
                    error.message;
            }

            return;
        }


        console.log(
            "Giriş başarılı:",
            data.user
        );


        window.location.href =
            "admin.html";

    }

    catch (error) {

        console.error(
            "Beklenmeyen giriş hatası:",
            error
        );


        if (mesaj) {

            mesaj.textContent =
                error.message ||
                "Beklenmeyen bir hata oluştu.";
        }
    }

}


/* ==========================================================
   ADMİN PANELİ
========================================================== */

async function adminPanelBaslat() {

    console.log(
        "Admin panel başlatılıyor..."
    );


    /* ======================================================
       SUPABASE KONTROL
    ====================================================== */

    if (typeof supabaseClient === "undefined") {

        console.error(
            "supabaseClient bulunamadı."
        );

        return;
    }


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


        if (!data || !data.session) {

            console.warn(
                "Aktif oturum bulunamadı."
            );

            window.location.href =
                "admin-login.html";

            return;
        }


        console.log(
            "Admin oturumu aktif:",
            data.session.user.email
        );

    }

    catch (error) {

        console.error(
            "Oturum kontrolünde hata:",
            error
        );

        return;
    }


    /* ======================================================
       SAYFALAR
    ====================================================== */

    const pages =
        document.querySelectorAll(
            ".main-content .page"
        );


    /* ======================================================
       SAYFA AÇ
    ====================================================== */

    function sayfaAc(pageId) {

        pages.forEach(function (page) {

            page.classList.remove(
                "active-page"
            );

        });


        const targetPage =
            document.getElementById(pageId);


        if (!targetPage) {

            console.error(
                "Sayfa bulunamadı:",
                pageId
            );

            return;
        }


        targetPage.classList.add(
            "active-page"
        );


        const menuItems =
            document.querySelectorAll(
                ".sidebar .menu-item[data-page]"
            );


        menuItems.forEach(function (item) {

            item.classList.remove(
                "active"
            );


            if (
                item.getAttribute("data-page") ===
                pageId
            ) {

                item.classList.add(
                    "active"
                );
            }

        });

    }


    /* ======================================================
       SOL MENÜ
    ====================================================== */

    const menuItems =
        document.querySelectorAll(
            ".sidebar .menu-item[data-page]"
        );


    menuItems.forEach(function (menuItem) {

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

    });


    /* ======================================================
       DASHBOARD HIZLI BUTONLAR
    ====================================================== */

    const quickButtons =
        document.querySelectorAll(
            ".quick-actions [data-page]"
        );


    quickButtons.forEach(function (button) {

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

    });


    /* ======================================================
       ÜRÜN DEĞİŞKENLERİ
    ====================================================== */

    const newProductButton =
        document.getElementById(
            "newProductButton"
        );


    const productFormBox =
        document.getElementById(
            "productFormBox"
        );


    const productForm =
        document.getElementById(
            "productForm"
        );


    const cancelProductButton =
        document.getElementById(
            "cancelProductButton"
        );


    let duzenlenenUrunId = null;


    /* ======================================================
       FORM MESAJI OLUŞTUR
    ====================================================== */

    function formMesajiOlustur() {

        let message =
            document.getElementById(
                "productFormMessage"
            );


        if (message) {
            return message;
        }


        if (!productForm) {
            return null;
        }


        message =
            document.createElement("div");


        message.id =
            "productFormMessage";


        message.style.marginTop =
            "15px";


        message.style.padding =
            "12px";


        message.style.borderRadius =
            "8px";


        message.style.display =
            "none";


        productForm.appendChild(
            message
        );


        return message;
    }


    /* ======================================================
       FORM MESAJI GÖSTER
    ====================================================== */

    function formMesajiGoster(
        text,
        success
    ) {

        const message =
            formMesajiOlustur();


        if (!message) {
            return;
        }


        message.textContent =
            text;


        message.style.display =
            "block";


        if (success) {

            message.style.border =
                "1px solid #4caf50";

            message.style.background =
                "#f0fff4";

            message.style.color =
                "#246b36";

        }

        else {

            message.style.border =
                "1px solid #d9534f";

            message.style.background =
                "#fff5f5";

            message.style.color =
                "#9c2f2f";
        }

    }


    /* ======================================================
       FORM MESAJI TEMİZLE
    ====================================================== */

    function formMesajiTemizle() {

        const message =
            document.getElementById(
                "productFormMessage"
            );


        if (message) {

            message.textContent =
                "";

            message.style.display =
                "none";
        }

    }


    /* ======================================================
       YENİ ÜRÜN BUTONU
    ====================================================== */

    if (
        newProductButton &&
        productFormBox
    ) {

        newProductButton.addEventListener(
            "click",
            function () {

                duzenlenenUrunId =
                    null;


                if (productForm) {
                    productForm.reset();
                }


                const formTitle =
                    productFormBox.querySelector(
                        "h2"
                    );


                if (formTitle) {

                    formTitle.textContent =
                        "Yeni Ürün Ekle";
                }


                const saveButton =
                    productForm
                        ? productForm.querySelector(
                            'button[type="submit"]'
                        )
                        : null;


                if (saveButton) {

                    saveButton.textContent =
                        "Ürünü Kaydet";
                }


                productFormBox.style.display =
                    "block";


                newProductButton.style.display =
                    "none";


                formMesajiTemizle();


                productFormBox.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }
        );

    }


    /* ======================================================
       VAZGEÇ
    ====================================================== */

    if (
        cancelProductButton &&
        productFormBox &&
        newProductButton
    ) {

        cancelProductButton.addEventListener(
            "click",
            function () {

                duzenlenenUrunId =
                    null;


                productFormBox.style.display =
                    "none";


                newProductButton.style.display =
                    "inline-block";


                if (productForm) {
                    productForm.reset();
                }


                formMesajiTemizle();

            }
        );

    }


    /* ======================================================
       ÜRÜN FORMU
    ====================================================== */

    if (productForm) {

        productForm.addEventListener(
            "submit",
            async function (e) {

                e.preventDefault();


                formMesajiTemizle();


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


                if (
                    !nameElement ||
                    !categoryElement
                ) {

                    formMesajiGoster(
                        "Ürün formunda eksik alan var.",
                        false
                    );

                    return;
                }


                const name =
                    nameElement.value.trim();

                const category =
                    categoryElement.value;

                const size =
                    sizeElement
                        ? sizeElement.value.trim()
                        : "";

                const priceText =
                    priceElement
                        ? priceElement.value
                        : "";

                const description =
                    descriptionElement
                        ? descriptionElement.value.trim()
                        : "";

                const isActive =
                    activeElement
                        ? activeElement.value === "true"
                        : true;


                if (!name) {

                    formMesajiGoster(
                        "Lütfen ürün adını girin.",
                        false
                    );

                    nameElement.focus();

                    return;
                }


                if (!category) {

                    formMesajiGoster(
                        "Lütfen bir kategori seçin.",
                        false
                    );

                    categoryElement.focus();

                    return;
                }


                let price = null;


                if (priceText !== "") {

                    price =
                        Number(priceText);


                    if (Number.isNaN(price)) {

                        formMesajiGoster(
                            "Fiyat bilgisi geçerli değil.",
                            false
                        );

                        return;
                    }

                }


                const saveButton =
                    productForm.querySelector(
                        'button[type="submit"]'
                    );


                if (saveButton) {

                    saveButton.disabled =
                        true;


                    saveButton.textContent =
                        duzenlenenUrunId
                            ? "Güncelleniyor..."
                            : "Kaydediliyor...";
                }


                try {

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
                            isActive
                    };


                    /* ==========================================
                       ÜRÜN GÜNCELLE
                    ========================================== */

                    if (duzenlenenUrunId) {

                        const {
                            data,
                            error
                        } =
                            await supabaseClient
                                .from("products")
                                .update(urunData)
                                .eq(
                                    "id",
                                    duzenlenenUrunId
                                )
                                .select()
                                .single();


                        if (error) {

                            console.error(
                                "Ürün güncelleme hatası:",
                                error
                            );


                            formMesajiGoster(
                                "Ürün güncellenemedi: " +
                                error.message,
                                false
                            );

                            return;
                        }


                        console.log(
                            "Ürün güncellendi:",
                            data
                        );


                        formMesajiGoster(
                            "Ürün başarıyla güncellendi.",
                            true
                        );

                    }


                    /* ==========================================
                       YENİ ÜRÜN
                    ========================================== */

                    else {

                        const {
                            data,
                            error
                        } =
                            await supabaseClient
                                .from("products")
                                .insert([
                                    {
                                        ...urunData,
                                        image_url: null
                                    }
                                ])
                                .select()
                                .single();


                        if (error) {

                            console.error(
                                "Ürün kayıt hatası:",
                                error
                            );


                            formMesajiGoster(
                                "Ürün kaydedilemedi: " +
                                error.message,
                                false
                            );

                            return;
                        }


                        console.log(
                            "Ürün başarıyla kaydedildi:",
                            data
                        );


                        formMesajiGoster(
                            "Ürün başarıyla kaydedildi.",
                            true
                        );

                    }


                    duzenlenenUrunId =
                        null;


                    if (productForm) {
                        productForm.reset();
                    }


                    await urunleriYukle();

                    await dashboardIstatistikleriniYukle();


                    setTimeout(function () {

                        if (productFormBox) {

                            productFormBox.style.display =
                                "none";
                        }


                        if (newProductButton) {

                            newProductButton.style.display =
                                "inline-block";
                        }


                        formMesajiTemizle();

                    }, 800);

                }

                catch (error) {

                    console.error(
                        "Ürün işlemi sırasında hata:",
                        error
                    );


                    formMesajiGoster(
                        "İşlem sırasında hata oluştu: " +
                        (error.message || error),
                        false
                    );

                }

                finally {

                    if (saveButton) {

                        saveButton.disabled =
                            false;

                        saveButton.textContent =
                            "Ürünü Kaydet";
                    }

                }

            }
        );

    }


    /* ======================================================
       ÜRÜNLERİ YÜKLE
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


                productList.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-icon">!</div>
                        <h2>Ürünler yüklenemedi</h2>
                        <p>
                            ${escapeHTML(error.message)}
                        </p>
                    </div>
                `;


                if (productCount) {

                    productCount.textContent =
                        "0 ürün";
                }


                return;
            }


            const products =
                data || [];


            if (productCount) {

                productCount.textContent =
                    products.length +
                    " ürün";
            }


            if (products.length === 0) {

                productList.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-icon">▤</div>
                        <h2>Henüz ürün bulunmuyor</h2>
                        <p>
                            Yeni Ürün butonunu kullanarak
                            ilk ürününüzü ekleyebilirsiniz.
                        </p>
                    </div>
                `;

                return;
            }


            productList.innerHTML =
                products.map(function (product) {

                    const fiyat =
                        product.price !== null &&
                        product.price !== undefined
                            ? Number(
                                product.price
                            ).toLocaleString(
                                "tr-TR",
                                {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2
                                }
                            ) + " TL"
                            : "-";


                    const durum =
                        product.is_active
                            ? "Aktif"
                            : "Pasif";


                    const durumClass =
                        product.is_active
                            ? "active"
                            : "passive";


                    return `

                        <div
                            class="product-item"
                            data-product-id="${escapeHTML(product.id)}"
                            style="
                                display:flex;
                                justify-content:space-between;
                                align-items:flex-start;
                                gap:20px;
                            "
                        >

                            <div
                                class="product-item-info"
                                style="flex:1;"
                            >

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
                                    ${fiyat}
                                </p>

                                ${
                                    product.description
                                        ? `
                                            <p>
                                                <strong>Açıklama:</strong>
                                                ${escapeHTML(
                                                    product.description
                                                )}
                                            </p>
                                        `
                                        : ""
                                }

                            </div>


                            <div
                                class="product-item-status"
                                style="
                                    display:flex;
                                    flex-direction:column;
                                    align-items:flex-end;
                                    gap:12px;
                                    min-width:170px;
                                "
                            >

                                <span class="${durumClass}">
                                    ${durum}
                                </span>


                                <div
                                    style="
                                        display:flex;
                                        gap:8px;
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
                                            -webkit-text-fill-color:#D4AF37 !important;
                                            border:1px solid #D4AF37 !important;
                                            background:transparent !important;
                                            border-radius:6px;
                                            font-weight:600;
                                        "
                                    >
                                        <span
                                            style="
                                                color:#D4AF37 !important;
                                                -webkit-text-fill-color:#D4AF37 !important;
                                            "
                                        >
                                            Düzenle
                                        </span>
                                    </button>


                                    <button
                                        type="button"
                                        class="delete-product-button"
                                        data-id="${escapeHTML(product.id)}"
                                        style="
                                            padding:8px 14px;
                                            cursor:pointer;
                                            border:1px solid #d9534f;
                                            background:#ffffff;
                                            color:#d9534f;
                                            border-radius:6px;
                                            font-weight:600;
                                        "
                                    >
                                        Sil
                                    </button>

                                </div>

                            </div>

                        </div>

                    `;

                }).join("");


            /* ================================================
               DÜZENLE
            ================================================ */

            productList
                .querySelectorAll(
                    ".edit-product-button"
                )
                .forEach(function (button) {

                    button.addEventListener(
                        "click",
                        function () {

                            const id =
                                button.getAttribute(
                                    "data-id"
                                );


                            const product =
                                products.find(
                                    function (item) {

                                        return String(
                                            item.id
                                        ) === String(id);

                                    }
                                );


                            if (!product) {

                                alert(
                                    "Ürün bulunamadı."
                                );

                                return;
                            }


                            urunDuzenlemeFormunuAc(
                                product
                            );

                        }
                    );

                });


            /* ================================================
               SİL
            ================================================ */

            productList
                .querySelectorAll(
                    ".delete-product-button"
                )
                .forEach(function (button) {

                    button.addEventListener(
                        "click",
                        async function () {

                            const id =
                                button.getAttribute(
                                    "data-id"
                                );


                            const product =
                                products.find(
                                    function (item) {

                                        return String(
                                            item.id
                                        ) === String(id);

                                    }
                                );


                            if (!product) {

                                alert(
                                    "Ürün bulunamadı."
                                );

                                return;
                            }


                            const onay =
                                confirm(
                                    '"' +
                                    product.name +
                                    '" adlı ürünü silmek istediğinize emin misiniz?\n\nBu ürün Supabase veritabanından silinecektir.'
                                );


                            if (!onay) {
                                return;
                            }


                            button.disabled =
                                true;


                            button.textContent =
                                "Siliniyor...";


                            await urunSil(
                                product.id
                            );

                        }
                    );

                });

        }

        catch (error) {

            console.error(
                "Ürünleri yüklerken hata:",
                error
            );


            productList.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">!</div>
                    <h2>Hata oluştu</h2>
                    <p>
                        ${escapeHTML(
                            error.message || error
                        )}
                    </p>
                </div>
            `;

        }

    }


    /* ======================================================
       ÜRÜN DÜZENLEME FORMU
    ====================================================== */

    function urunDuzenlemeFormunuAc(product) {

        if (
            !productForm ||
            !productFormBox ||
            !newProductButton
        ) {
            return;
        }


        duzenlenenUrunId =
            product.id;


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
                product.price !== null &&
                product.price !== undefined
                    ? product.price
                    : "";
        }


        if (descriptionElement) {
            descriptionElement.value =
                product.description || "";
        }


        if (activeElement) {

            activeElement.value =
                product.is_active
                    ? "true"
                    : "false";
        }


        const formTitle =
            productFormBox.querySelector(
                "h2"
            );


        if (formTitle) {

            formTitle.textContent =
                "Ürünü Düzenle";
        }


        const saveButton =
            productForm.querySelector(
                'button[type="submit"]'
            );


        if (saveButton) {

            saveButton.textContent =
                "Güncelle";
        }


        formMesajiTemizle();


        productFormBox.style.display =
            "block";


        newProductButton.style.display =
            "none";


        productFormBox.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }


    /* ======================================================
       ÜRÜN SİL
    ====================================================== */

    async function urunSil(productId) {

        console.log(
            "Ürün silme işlemi başladı:",
            productId
        );


        try {

            const {
                error
            } =
                await supabaseClient
                    .from("products")
                    .delete()
                    .eq(
                        "id",
                        productId
                    );


            if (error) {

                console.error(
                    "Supabase silme hatası:",
                    error
                );


                alert(
                    "Ürün silinemedi:\n\n" +
                    error.message
                );

                return;
            }


            await urunleriYukle();

            await dashboardIstatistikleriniYukle();


            alert(
                "Ürün başarıyla silindi."
            );

        }

        catch (error) {

            console.error(
                "Ürün silme sırasında hata:",
                error
            );


            alert(
                "Ürün silinirken hata oluştu:\n\n" +
                (error.message || error)
            );
        }

    }


    /* ======================================================
       RESİM MESAJLARI
    ====================================================== */

    function imageMesajiGoster(
        text,
        success
    ) {

        const message =
            document.getElementById(
                "imageUploadMessage"
            );


        if (!message) {
            return;
        }


        message.textContent =
            text;


        message.style.display =
            "block";


        if (success) {

            message.style.border =
                "1px solid #4caf50";

            message.style.background =
                "#f0fff4";

            message.style.color =
                "#246b36";

        }

        else {

            message.style.border =
                "1px solid #d9534f";

            message.style.background =
                "#fff5f5";

            message.style.color =
                "#9c2f2f";
        }

    }


    function imageMesajiTemizle() {

        const message =
            document.getElementById(
                "imageUploadMessage"
            );


        if (message) {

            message.textContent =
                "";

            message.style.display =
                "none";
        }

    }


    /* ======================================================
       DOSYA UZANTISI
    ====================================================== */

    function dosyaUzantisiAl(
        fileName,
        mimeType
    ) {

        const name =
            String(fileName || "");


        const dotIndex =
            name.lastIndexOf(".");


        if (dotIndex !== -1) {

            const extension =
                name
                    .substring(dotIndex)
                    .toLowerCase();


            const allowed = [
                ".jpg",
                ".jpeg",
                ".png",
                ".webp"
            ];


            if (
                allowed.includes(
                    extension
                )
            ) {

                return extension;
            }

        }


        if (mimeType === "image/png") {
            return ".png";
        }


        if (mimeType === "image/webp") {
            return ".webp";
        }


        return ".jpg";

    }


    /* ======================================================
       KATEGORİ SLUG
    ====================================================== */

    function kategoriSlugOlustur(
        category
    ) {

        return String(category)
            .toLocaleLowerCase("tr-TR")
            .replace(/ğ/g, "g")
            .replace(/ü/g, "u")
            .replace(/ş/g, "s")
            .replace(/ı/g, "i")
            .replace(/ö/g, "o")
            .replace(/ç/g, "c")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");

    }


    /* ======================================================
       RESİM YÖNETİMİ
    ====================================================== */

    function resimYonetiminiBaslat() {

        const imageFile =
            document.getElementById(
                "imageFile"
            );


        const imageCategory =
            document.getElementById(
                "imageCategory"
            );


        const imagePreview =
            document.getElementById(
                "imagePreview"
            );


        const imagePreviewBox =
            document.getElementById(
                "imagePreviewBox"
            );


        const uploadImageButton =
            document.getElementById(
                "uploadImageButton"
            );


        if (!imageFile) {

            console.warn(
                "imageFile bulunamadı."
            );

            return;
        }


        if (!uploadImageButton) {

            console.warn(
                "uploadImageButton bulunamadı."
            );

            return;
        }


        /* ================================================
           ÖNİZLEME
        ================================================ */

        imageFile.addEventListener(
            "change",
            function () {

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


                if (!file.type.startsWith("image/")) {

                    imageFile.value =
                        "";


                    imageMesajiGoster(
                        "Lütfen geçerli bir resim dosyası seçin.",
                        false
                    );

                    return;
                }


                const objectUrl =
                    URL.createObjectURL(file);


                if (imagePreview) {

                    imagePreview.src =
                        objectUrl;
                }


                if (imagePreviewBox) {

                    imagePreviewBox.style.display =
                        "block";
                }


                imageMesajiTemizle();

            }
        );


        /* ================================================
           RESİM YÜKLE
        ================================================ */

        uploadImageButton.addEventListener(
            "click",
            async function () {

                const file =
                    imageFile.files &&
                    imageFile.files[0];


                const category =
                    imageCategory
                        ? imageCategory.value.trim()
                        : "";


                if (!file) {

                    imageMesajiGoster(
                        "Önce bir resim seçmelisiniz.",
                        false
                    );

                    return;
                }


                if (!category) {

                    imageMesajiGoster(
                        "Lütfen resim kategorisini seçin.",
                        false
                    );

                    if (imageCategory) {
                        imageCategory.focus();
                    }

                    return;
                }


                if (!file.type.startsWith("image/")) {

                    imageMesajiGoster(
                        "Seçilen dosya geçerli bir resim değil.",
                        false
                    );

                    return;
                }


                const maxSize =
                    10 * 1024 * 1024;


                if (file.size > maxSize) {

                    imageMesajiGoster(
                        "Resim boyutu 10 MB'dan büyük olamaz.",
                        false
                    );

                    return;
                }


                uploadImageButton.disabled =
                    true;


                uploadImageButton.textContent =
                    "Yükleniyor...";


                imageMesajiTemizle();


                try {

                    const extension =
                        dosyaUzantisiAl(
                            file.name,
                            file.type
                        );


                    const temizKategori =
                        kategoriSlugOlustur(
                            category
                        );


                    const benzersizIsim =
                        Date.now() +
                        "-" +
                        Math.random()
                            .toString(36)
                            .substring(2, 10);


                    const filePath =
                        temizKategori +
                        "/" +
                        benzersizIsim +
                        extension;


                    /* ==========================================
                       STORAGE
                    ========================================== */

                    const {
                        error: uploadError
                    } =
                        await supabaseClient
                            .storage
                            .from("category-images")
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

                        throw new Error(
                            "Resim Storage'a yüklenemedi: " +
                            uploadError.message
                        );
                    }


                    /* ==========================================
                       PUBLIC URL
                    ========================================== */

                    const {
                        data: publicUrlData
                    } =
                        supabaseClient
                            .storage
                            .from("category-images")
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
                        data: imageRecord,
                        error: databaseError
                    } =
                        await supabaseClient
                            .from("category_images")
                            .insert([
                                {
                                    category:
                                        category,

                                    image_path:
                                        filePath,

                                    image_url:
                                        imageUrl
                                }
                            ])
                            .select()
                            .single();


                    if (databaseError) {

                        await supabaseClient
                            .storage
                            .from("category-images")
                            .remove([
                                filePath
                            ]);


                        throw new Error(
                            "Resim veritabanına kaydedilemedi: " +
                            databaseError.message
                        );
                    }


                    console.log(
                        "Resim kaydedildi:",
                        imageRecord
                    );


                    imageMesajiGoster(
                        "Resim başarıyla yüklendi ve kaydedildi.",
                        true
                    );


                    imageFile.value =
                        "";


                    if (imageCategory) {

                        imageCategory.value =
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


                    await resimleriYukle();

                    await dashboardIstatistikleriniYukle();

                }

                catch (error) {

                    console.error(
                        "Resim yükleme hatası:",
                        error
                    );


                    imageMesajiGoster(
                        error.message ||
                        "Resim yüklenirken hata oluştu.",
                        false
                    );

                }

                finally {

                    uploadImageButton.disabled =
                        false;


                    uploadImageButton.textContent =
                        "Resmi Yükle";
                }

            }
        );


        /* ================================================
           İLK RESİMLER
        ================================================ */

        resimleriYukle();

    }


    /* ======================================================
       RESİMLERİ YÜKLE
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


        try {

            const {
                data,
                error
            } =
                await supabaseClient
                    .from("category_images")
                    .select("*")
                    .order(
                        "created_at",
                        {
                            ascending: false
                        }
                    );


            if (error) {

                console.error(
                    "Resimler alınamadı:",
                    error
                );


                imageList.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-icon">!</div>
                        <h2>Resimler yüklenemedi</h2>
                        <p>
                            ${escapeHTML(error.message)}
                        </p>
                    </div>
                `;


                if (imageCount) {

                    imageCount.textContent =
                        "0 resim";
                }


                return;
            }


            const images =
                data || [];


            if (imageCount) {

                imageCount.textContent =
                    images.length +
                    " resim";
            }


            if (images.length === 0) {

                imageList.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-icon">▧</div>
                        <h2>Henüz resim bulunmuyor</h2>
                        <p>
                            Yukarıdaki alandan ilk resminizi
                            yükleyebilirsiniz.
                        </p>
                    </div>
                `;

                return;
            }


            imageList.innerHTML =
                images.map(function (image) {

                    const url =
                        image.image_url ||
                        "";


                    return `

                        <div
                            class="image-card"
                            data-image-id="${escapeHTML(image.id)}"
                            style="
                                border:1px solid #e0e0e0;
                                border-radius:10px;
                                padding:12px;
                                background:#ffffff;
                                overflow:hidden;
                            "
                        >

                            <div
                                style="
                                    width:100%;
                                    height:180px;
                                    display:flex;
                                    align-items:center;
                                    justify-content:center;
                                    background:#111;
                                    border-radius:8px;
                                    overflow:hidden;
                                "
                            >

                                ${
                                    url
                                        ? `
                                            <img
                                                src="${escapeHTML(url)}"
                                                alt="${escapeHTML(image.category || "Sur Halı")}"
                                                style="
                                                    width:100%;
                                                    height:100%;
                                                    object-fit:cover;
                                                "
                                            >
                                        `
                                        : `
                                            <span
                                                style="
                                                    color:#D4AF37;
                                                "
                                            >
                                                Önizleme yok
                                            </span>
                                        `
                                }

                            </div>


                            <div
                                style="
                                    padding-top:12px;
                                "
                            >

                                <div
                                    style="
                                        font-weight:600;
                                        margin-bottom:6px;
                                    "
                                >
                                    ${escapeHTML(
                                        image.category || "-"
                                    )}
                                </div>


                                <div
                                    style="
                                        font-size:12px;
                                        color:#777;
                                        word-break:break-all;
                                        margin-bottom:12px;
                                    "
                                >
                                    ${escapeHTML(
                                        image.image_path || ""
                                    )}
                                </div>


                                <button
                                    type="button"
                                    class="delete-image-button"
                                    data-id="${escapeHTML(image.id)}"
                                    data-path="${escapeHTML(image.image_path || "")}"
                                    style="
                                        width:100%;
                                        padding:9px 12px;
                                        border:1px solid #d9534f;
                                        background:#ffffff;
                                        color:#d9534f;
                                        border-radius:6px;
                                        cursor:pointer;
                                        font-weight:600;
                                    "
                                >
                                    Resmi Sil
                                </button>

                            </div>

                        </div>

                    `;

                }).join("");


            /* ================================================
               RESİM SİL BUTONLARI
            ================================================ */

            imageList
                .querySelectorAll(
                    ".delete-image-button"
                )
                .forEach(function (button) {

                    button.addEventListener(
                        "click",
                        async function () {

                            const id =
                                button.getAttribute(
                                    "data-id"
                                );


                            const path =
                                button.getAttribute(
                                    "data-path"
                                );


                            const onay =
                                confirm(
                                    "Bu resmi silmek istediğinize emin misiniz?\n\nResim hem Storage'dan hem de veritabanından silinecektir."
                                );


                            if (!onay) {
                                return;
                            }


                            button.disabled =
                                true;


                            button.textContent =
                                "Siliniyor...";


                            await resimSil(
                                id,
                                path
                            );

                        }
                    );

                });

        }

        catch (error) {

            console.error(
                "Resimleri yüklerken hata:",
                error
            );


            imageList.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">!</div>
                    <h2>Hata oluştu</h2>
                    <p>
                        ${escapeHTML(
                            error.message || error
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
        imageId,
        imagePath
    ) {

        try {

            /* ================================================
               STORAGE
            ================================================ */

            if (imagePath) {

                const {
                    error: storageError
                } =
                    await supabaseClient
                        .storage
                        .from("category-images")
                        .remove([
                            imagePath
                        ]);


                if (storageError) {

                    alert(
                        "Resim Storage'dan silinemedi:\n\n" +
                        storageError.message
                    );

                    return;
                }

            }


            /* ================================================
               DATABASE
            ================================================ */

            const {
                error: databaseError
            } =
                await supabaseClient
                    .from("category_images")
                    .delete()
                    .eq(
                        "id",
                        imageId
                    );


            if (databaseError) {

                alert(
                    "Resim veritabanından silinemedi:\n\n" +
                    databaseError.message
                );

                return;
            }


            await resimleriYukle();

            await dashboardIstatistikleriniYukle();


            alert(
                "Resim başarıyla silindi."
            );

        }

        catch (error) {

            console.error(
                "Resim silme hatası:",
                error
            );


            alert(
                "Resim silinirken hata oluştu:\n\n" +
                (error.message || error)
            );

        }

    }


    /* ======================================================
       HTML GÜVENLİK
    ====================================================== */

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


    /* ======================================================
       DASHBOARD İSTATİSTİKLERİ
    ====================================================== */

    async function dashboardIstatistikleriniYukle() {

        try {

            /* ================================================
               TOPLAM ÜRÜN
            ================================================ */

            const {
                count: totalCount,
                error: totalError
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


            const totalProducts =
                document.getElementById(
                    "totalProducts"
                );


            if (totalProducts) {

                if (totalError) {

                    console.error(
                        "Toplam ürün sayısı alınamadı:",
                        totalError
                    );

                    totalProducts.textContent =
                        "0";

                }

                else {

                    totalProducts.textContent =
                        totalCount || 0;
                }

            }


            /* ================================================
               AKTİF ÜRÜN
            ================================================ */

            const {
                count: activeCount,
                error: activeError
            } =
                await supabaseClient
                    .from("products")
                    .select(
                        "*",
                        {
                            count: "exact",
                            head: true
                        }
                    )
                    .eq(
                        "is_active",
                        true
                    );


            const activeProducts =
                document.getElementById(
                    "activeProducts"
                );


            if (activeProducts) {

                if (activeError) {

                    console.error(
                        "Aktif ürün sayısı alınamadı:",
                        activeError
                    );

                    activeProducts.textContent =
                        "0";

                }

                else {

                    activeProducts.textContent =
                        activeCount || 0;
                }

            }


            /* ================================================
               TOPLAM RESİM
            ================================================ */

            const {
                count: imageCount,
                error: imageCountError
            } =
                await supabaseClient
                    .from("category_images")
                    .select(
                        "*",
                        {
                            count: "exact",
                            head: true
                        }
                    );


            const totalImages =
                document.getElementById(
                    "totalImages"
                );


            if (totalImages) {

                if (imageCountError) {

                    console.error(
                        "Toplam resim sayısı alınamadı:",
                        imageCountError
                    );

                    totalImages.textContent =
                        "0";

                }

                else {

                    totalImages.textContent =
                        imageCount || 0;
                }

            }


            /* ================================================
               STORAGE
            ================================================ */

            const storageUsage =
                document.getElementById(
                    "storageUsage"
                );


            if (storageUsage) {

                storageUsage.textContent =
                    "—";
            }

        }

        catch (error) {

            console.error(
                "Dashboard istatistik hatası:",
                error
            );

        }

    }


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

                    await supabaseClient.auth.signOut();

                }

                catch (error) {

                    console.error(
                        "Çıkış hatası:",
                        error
                    );

                }


                window.location.href =
                    "admin-login.html";

            }
        );

    }


    /* ======================================================
       BAŞLANGIÇ VERİLERİ
       BURASI ÖNEMLİ:
       BÜTÜN FONKSİYONLAR TANIMLANDIKTAN SONRA
       ÇALIŞTIRILIYOR.
    ====================================================== */

    try {

        await urunleriYukle();

    }

    catch (error) {

        console.error(
            "Başlangıç ürün yükleme hatası:",
            error
        );

    }


    try {

        await dashboardIstatistikleriniYukle();

    }

    catch (error) {

        console.error(
            "Başlangıç dashboard yükleme hatası:",
            error
        );

    }


    try {

        resimYonetiminiBaslat();

    }

    catch (error) {

        console.error(
            "Resim yönetimi başlatma hatası:",
            error
        );

    }


    console.log(
        "Sur Halı Admin panel hazır."
    );

}
