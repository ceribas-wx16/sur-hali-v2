console.log("Sur Halı Admin başlatılıyor...");


/* ==========================================================
   SAYFA YÜKLENDİ
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

    console.log("Giriş deneniyor...");


    const emailElement =
        document.getElementById("email");

    const passwordElement =
        document.getElementById("password");

    const mesaj =
        document.getElementById("loginMessage");


    if (!emailElement || !passwordElement) {

        console.error(
            "E-posta veya şifre alanı bulunamadı."
        );

        return;

    }


    const email =
        emailElement.value.trim();

    const password =
        passwordElement.value;


    if (mesaj) {

        mesaj.textContent = "";

    }


    /* ======================================================
       SUPABASE KONTROLÜ
    ====================================================== */

    if (
        typeof supabaseClient ===
        "undefined"
    ) {

        console.error(
            "supabaseClient bulunamadı."
        );

        if (mesaj) {

            mesaj.textContent =
                "Supabase bağlantısı kurulamadı.";

        }

        return;

    }


    try {

        console.log(
            "Supabase giriş isteği gönderiliyor..."
        );


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
   ADMİN PANELİ BAŞLAT
========================================================== */

async function adminPanelBaslat() {

    console.log(
        "Admin panel başlatılıyor..."
    );


    /* ======================================================
       SUPABASE KONTROLÜ
    ====================================================== */

    if (
        typeof supabaseClient ===
        "undefined"
    ) {

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


        if (!data.session) {

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
       SOL MENÜ
    ====================================================== */

    const menuItems =
        document.querySelectorAll(
            ".sidebar .menu-item[data-page]"
        );


    console.log(
        "Menü sayısı:",
        menuItems.length
    );


    console.log(
        "Sayfa sayısı:",
        pages.length
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
            document.getElementById(
                pageId
            );


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


        menuItems.forEach(function (item) {

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

        });

    }


    /* ======================================================
       SOL MENÜ TIKLAMALARI
    ====================================================== */

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
       ÜRÜN FORM ELEMANLARI
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


    /* ======================================================
       DÜZENLENEN ÜRÜN
    ====================================================== */

    let duzenlenenUrunId = null;


    /* ======================================================
       FORM MESAJI
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
            document.createElement(
                "div"
            );


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

        }

        else {

            message.style.border =
                "1px solid #d9534f";

            message.style.background =
                "#fff5f5";

        }

    }


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
       YENİ ÜRÜN
    ====================================================== */

    if (
        newProductButton &&
        productFormBox &&
        productForm
    ) {

        newProductButton.addEventListener(
            "click",
            function () {

                duzenlenenUrunId = null;


                productForm.reset();


                const formTitle =
                    productFormBox.querySelector(
                        "h2"
                    );


                if (formTitle) {

                    formTitle.textContent =
                        "Yeni Ürün Ekle";

                }


                const saveButton =
                    productForm.querySelector(
                        'button[type="submit"]'
                    );


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

                duzenlenenUrunId = null;


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
       ÜRÜN KAYDET
    ====================================================== */

    if (productForm) {

        productForm.addEventListener(
            "submit",
            async function (e) {

                e.preventDefault();


                console.log(
                    "Ürün kaydetme başladı."
                );


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
                        Number(
                            priceText
                        );


                    if (
                        Number.isNaN(price)
                    ) {

                        formMesajiGoster(
                            "Fiyat bilgisi geçerli değil.",
                            false
                        );

                        return;

                    }

                }


                if (
                    typeof supabaseClient ===
                    "undefined"
                ) {

                    formMesajiGoster(
                        "Supabase bağlantısı bulunamadı.",
                        false
                    );

                    return;

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

                        name: name,

                        category: category,

                        size: size || null,

                        price: price,

                        description:
                            description || null,

                        is_active:
                            isActive

                    };


                    /* ==================================================
                       GÜNCELLE
                    ================================================== */

                    if (duzenlenenUrunId) {

                        const {
                            data,
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


                    /* ==================================================
                       YENİ ÜRÜN
                    ================================================== */

                    else {

                        const {
                            data,
                            error
                        } =
                            await supabaseClient
                                .from("products")
                                .insert([
                                    {
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

                                        image_url:
                                            null,

                                        is_active:
                                            isActive
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


                    productForm.reset();


                    const formTitle =
                        productFormBox.querySelector(
                            "h2"
                        );


                    if (formTitle) {

                        formTitle.textContent =
                            "Yeni Ürün Ekle";

                    }


                    await urunleriYukle();

                    await dashboardIstatistikleriniYukle();


                    setTimeout(
                        function () {

                            productFormBox.style.display =
                                "none";


                            newProductButton.style.display =
                                "inline-block";


                            formMesajiTemizle();

                        },
                        800
                    );

                }


                catch (error) {

                    console.error(
                        "Ürün işlem hatası:",
                        error
                    );


                    formMesajiGoster(
                        "İşlem sırasında hata oluştu: " +
                        error.message,
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
                        <p>${escapeHTML(error.message)}</p>
                    </div>
                `;


                if (productCount) {

                    productCount.textContent =
                        "Hata";

                }


                return;

            }


            if (
                !data ||
                data.length === 0
            ) {

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
                data.map(function (product) {

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
                                    min-width:150px;
                                "
                            >

                                <span class="${durumClass}">
                                    ${durum}
                                </span>


                                <div
                                    style="
                                        display:flex;
                                        gap:8px;
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
                                            border:1px solid #d9534f;
                                            background:#fff;
                                            color:#d9534f;
                                            border-radius:6px;
                                        "
                                    >
                                        Sil
                                    </button>

                                </div>

                            </div>

                        </div>
                    `;

                }).join("");


            /* ==================================================
               DÜZENLE
            ================================================== */

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
                                data.find(function (item) {

                                    return String(
                                        item.id
                                    ) === String(id);

                                });


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


            /* ==================================================
               SİL
            ================================================== */

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
                                data.find(function (item) {

                                    return String(
                                        item.id
                                    ) === String(id);

                                });


                            if (!product) {

                                return;

                            }


                            const onay =
                                confirm(
                                    '"' +
                                    product.name +
                                    '" adlı ürünü silmek istediğinize emin misiniz?\n\nBu işlem geri alınamaz.'
                                );


                            if (!onay) {

                                return;

                            }


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
                    <p>${escapeHTML(error.message)}</p>
                </div>
            `;

        }

    }


    /* ======================================================
       ÜRÜN DÜZENLEME
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


        document.getElementById(
            "productName"
        ).value =
            product.name || "";


        document.getElementById(
            "productCategory"
        ).value =
            product.category || "";


        document.getElementById(
            "productSize"
        ).value =
            product.size || "";


        document.getElementById(
            "productPrice"
        ).value =
            product.price !== null &&
            product.price !== undefined
                ? product.price
                : "";


        document.getElementById(
            "productDescription"
        ).value =
            product.description || "";


        document.getElementById(
            "productActive"
        ).value =
            product.is_active
                ? "true"
                : "false";


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
                    "Ürün silme hatası:",
                    error
                );


                alert(
                    "Ürün silinemedi:\n" +
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
                "Ürün silme hatası:",
                error
            );


            alert(
                "Ürün silinirken hata oluştu:\n" +
                error.message
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
       DASHBOARD
    ====================================================== */

    async function dashboardIstatistikleriniYukle() {

        try {

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


            if (!totalError) {

                const totalProducts =
                    document.getElementById(
                        "totalProducts"
                    );


                if (totalProducts) {

                    totalProducts.textContent =
                        totalCount || 0;

                }

            }


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


            if (!activeError) {

                const activeProducts =
                    document.getElementById(
                        "activeProducts"
                    );


                if (activeProducts) {

                    activeProducts.textContent =
                        activeCount || 0;

                }

            }


            const totalImages =
                document.getElementById(
                    "totalImages"
                );


            if (totalImages) {

                totalImages.textContent =
                    "0";

            }


            const storageUsage =
                document.getElementById(
                    "storageUsage"
                );


            if (storageUsage) {

                storageUsage.textContent =
                    "0 MB";

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
       İLK VERİLER
    ====================================================== */

    await urunleriYukle();

    await dashboardIstatistikleriniYukle();


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

                console.log(
                    "Çıkış yapılıyor..."
                );


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


    console.log(
        "Sur Halı Admin panel hazır."
    );

}
