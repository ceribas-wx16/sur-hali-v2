```javascript
/* =========================================================
   SUR HALI - ADMIN PANEL
   TEMİZ SÜRÜM
========================================================= */

console.log("Sur Halı Admin başlatılıyor...");


/* =========================================================
   DOM HAZIR
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    console.log("DOM hazır.");

    const loginForm =
        document.getElementById("loginForm");


    /* =====================================================
       GİRİŞ SAYFASI
    ===================================================== */

    if (loginForm) {

        console.log("Giriş sayfası bulundu.");

        loginForm.addEventListener(
            "submit",
            girisYap
        );

        return;
    }


    /* =====================================================
       ADMIN PANELİ
    ===================================================== */

    const adminContainer =
        document.querySelector(".admin-container");

    if (!adminContainer) {

        console.warn(
            "Admin container bulunamadı."
        );

        return;
    }


    console.log("Admin paneli bulundu.");

    adminPanelBaslat();

});


/* =========================================================
   GİRİŞ
========================================================= */

async function girisYap(e) {

    e.preventDefault();

    const emailElement =
        document.getElementById("email");

    const passwordElement =
        document.getElementById("password");

    const mesaj =
        document.getElementById("loginMessage") ||
        document.getElementById("message");


    if (!emailElement || !passwordElement) {
        return;
    }


    const email =
        emailElement.value.trim();

    const password =
        passwordElement.value;


    if (
        typeof supabaseClient ===
        "undefined"
    ) {

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
            "Giriş hatası:",
            error
        );

        if (mesaj) {

            mesaj.textContent =
                error.message ||
                "Giriş sırasında hata oluştu.";
        }
    }

}


/* =========================================================
   ADMIN PANELİ BAŞLAT
========================================================= */

async function adminPanelBaslat() {

    console.log(
        "Admin panel başlatılıyor..."
    );


    /* =====================================================
       SUPABASE
    ===================================================== */

    if (
        typeof supabaseClient ===
        "undefined"
    ) {

        console.error(
            "supabaseClient bulunamadı."
        );

        return;
    }


    /* =====================================================
       OTURUM KONTROLÜ
    ===================================================== */

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
                "Aktif oturum yok."
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
            "Oturum kontrolü başarısız:",
            error
        );

        return;
    }


    /* =====================================================
       MENÜ VE SAYFALAR
    ===================================================== */

    const pages =
        document.querySelectorAll(
            ".main-content .page"
        );


    const menuItems =
        document.querySelectorAll(
            ".sidebar .menu-item[data-page]"
        );


    console.log(
        "Bulunan menü:",
        menuItems.length
    );


    console.log(
        "Bulunan sayfa:",
        pages.length
    );


    function sayfaAc(pageId) {

        console.log(
            "Sayfa açılıyor:",
            pageId
        );


        pages.forEach(function (page) {

            page.classList.remove(
                "active-page"
            );

        });


        const hedef =
            document.getElementById(pageId);


        if (!hedef) {

            console.error(
                "Sayfa bulunamadı:",
                pageId
            );

            return;
        }


        hedef.classList.add(
            "active-page"
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


    /* =====================================================
       SOL MENÜ
    ===================================================== */

    menuItems.forEach(function (item) {

        item.addEventListener(
            "click",
            function (e) {

                e.preventDefault();

                const pageId =
                    item.getAttribute(
                        "data-page"
                    );


                sayfaAc(pageId);

            }
        );

    });


    /* =====================================================
       DASHBOARD HIZLI BUTONLAR
    ===================================================== */

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


    /* =====================================================
       ÜRÜN FORMU
    ===================================================== */

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


    /* =====================================================
       YENİ ÜRÜN
    ===================================================== */

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


                const title =
                    productFormBox.querySelector(
                        "h2"
                    );


                if (title) {

                    title.textContent =
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


                productFormBox.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }
        );

    }


    /* =====================================================
       VAZGEÇ
    ===================================================== */

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

            }
        );

    }


    /* =====================================================
       ÜRÜN FORM MESAJI
    ===================================================== */

    function formMesaji(text, success) {

        if (!productForm) {
            return;
        }


        let message =
            document.getElementById(
                "productFormMessage"
            );


        if (!message) {

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

            productForm.appendChild(
                message
            );
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


    /* =====================================================
       ÜRÜN KAYDET / GÜNCELLE
    ===================================================== */

    if (productForm) {

        productForm.addEventListener(
            "submit",
            async function (e) {

                e.preventDefault();


                formMesajiTemizle();


                const name =
                    document.getElementById(
                        "productName"
                    )?.value.trim();


                const category =
                    document.getElementById(
                        "productCategory"
                    )?.value;


                const size =
                    document.getElementById(
                        "productSize"
                    )?.value.trim();


                const priceValue =
                    document.getElementById(
                        "productPrice"
                    )?.value;


                const description =
                    document.getElementById(
                        "productDescription"
                    )?.value.trim();


                const activeValue =
                    document.getElementById(
                        "productActive"
                    )?.value;


                if (!name) {

                    formMesaji(
                        "Lütfen ürün adını girin.",
                        false
                    );

                    return;
                }


                if (!category) {

                    formMesaji(
                        "Lütfen kategori seçin.",
                        false
                    );

                    return;
                }


                let price = null;


                if (priceValue !== "") {

                    price =
                        Number(priceValue);


                    if (
                        Number.isNaN(price)
                    ) {

                        formMesaji(
                            "Fiyat geçerli değil.",
                            false
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
                        activeValue !== "false"

                };


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

                    let error = null;


                    if (duzenlenenUrunId) {

                        const result =
                            await supabaseClient
                                .from("products")
                                .update(
                                    urunData
                                )
                                .eq(
                                    "id",
                                    duzenlenenUrunId
                                );


                        error =
                            result.error;

                    }

                    else {

                        const result =
                            await supabaseClient
                                .from("products")
                                .insert([
                                    {
                                        ...urunData,
                                        image_url: null
                                    }
                                ]);


                        error =
                            result.error;
                    }


                    if (error) {

                        console.error(
                            "Ürün kayıt hatası:",
                            error
                        );


                        formMesaji(
                            "Ürün kaydedilemedi: " +
                            error.message,
                            false
                        );

                        return;
                    }


                    formMesaji(
                        duzenlenenUrunId
                            ? "Ürün başarıyla güncellendi."
                            : "Ürün başarıyla kaydedildi.",
                        true
                    );


                    duzenlenenUrunId =
                        null;


                    productForm.reset();


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


                    formMesaji(
                        error.message ||
                        "Ürün işlemi başarısız.",
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


    /* =====================================================
       ÜRÜNLERİ YÜKLE
    ===================================================== */

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
                        "0 ürün";
                }


                return;
            }


            const urunler =
                data || [];


            if (productCount) {

                productCount.textContent =
                    urunler.length +
                    " ürün";
            }


            if (
                urunler.length ===
                0
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

                return;
            }


            productList.innerHTML =
                urunler
                    .map(function (product) {

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
                            >

                                <div
                                    class="product-item-info"
                                >

                                    <h3>
                                        ${escapeHTML(
                                            product.name
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
                                >

                                    <span
                                        class="${durumClass}"
                                    >
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

                    })
                    .join("");


            /* =================================================
               DÜZENLE
            ================================================= */

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
                                urunler.find(
                                    function (item) {

                                        return String(
                                            item.id
                                        ) === String(id);

                                    }
                                );


                            if (!product) {
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
                                product.price ?? "";


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


                            const title =
                                productFormBox.querySelector(
                                    "h2"
                                );


                            if (title) {
                                title.textContent =
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


                            productFormBox.style.display =
                                "block";


                            newProductButton.style.display =
                                "none";


                            productFormBox.scrollIntoView({
                                behavior: "smooth",
                                block: "start"
                            });

                        }
                    );

                });


            /* =================================================
               SİL
            ================================================= */

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
                                urunler.find(
                                    function (item) {

                                        return String(
                                            item.id
                                        ) === String(id);

                                    }
                                );


                            if (!product) {
                                return;
                            }


                            const onay =
                                confirm(
                                    '"' +
                                    product.name +
                                    '" adlı ürünü silmek istediğinize emin misiniz?'
                                );


                            if (!onay) {
                                return;
                            }


                            button.disabled =
                                true;


                            button.textContent =
                                "Siliniyor...";


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

                                    alert(
                                        "Ürün silinemedi:\n" +
                                        error.message
                                    );

                                    button.disabled =
                                        false;

                                    button.textContent =
                                        "Sil";

                                    return;
                                }


                                await urunleriYukle();

                                await dashboardIstatistikleriniYukle();


                            }

                            catch (error) {

                                console.error(
                                    "Silme hatası:",
                                    error
                                );

                                alert(
                                    error.message
                                );

                                button.disabled =
                                    false;

                                button.textContent =
                                    "Sil";
                            }

                        }
                    );

                });

        }

        catch (error) {

            console.error(
                "Ürün listesi hatası:",
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


    /* =====================================================
       RESİM YÖNETİMİ
    ===================================================== */

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


        const uploadButton =
            document.getElementById(
                "uploadImageButton"
            );


        if (!imageFile || !uploadButton) {
            return;
        }


        /* =================================================
           ÖNİZLEME
        ================================================= */

        imageFile.addEventListener(
            "change",
            function () {

                const file =
                    imageFile.files?.[0];


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

                    imageMesaji(
                        "Geçerli bir resim seçin.",
                        false
                    );

                    return;
                }


                const url =
                    URL.createObjectURL(file);


                if (imagePreview) {
                    imagePreview.src =
                        url;
                }


                if (imagePreviewBox) {
                    imagePreviewBox.style.display =
                        "block";
                }

            }
        );


        /* =================================================
           YÜKLE
        ================================================= */

        uploadButton.addEventListener(
            "click",
            async function () {

                const file =
                    imageFile.files?.[0];


                const category =
                    imageCategory
                        ? imageCategory.value.trim()
                        : "";


                if (!file) {

                    imageMesaji(
                        "Önce resim seçin.",
                        false
                    );

                    return;
                }


                if (!category) {

                    imageMesaji(
                        "Lütfen kategori seçin.",
                        false
                    );

                    return;
                }


                if (
                    file.size >
                    10 * 1024 * 1024
                ) {

                    imageMesaji(
                        "Resim 10 MB'dan büyük olamaz.",
                        false
                    );

                    return;
                }


                uploadButton.disabled =
                    true;

                uploadButton.textContent =
                    "Yükleniyor...";


                try {

                    const extension =
                        dosyaUzantisiAl(
                            file.name,
                            file.type
                        );


                    const slug =
                        kategoriSlugOlustur(
                            category
                        );


                    const fileName =
                        Date.now() +
                        "-" +
                        Math.random()
                            .toString(36)
                            .substring(2, 10) +
                        extension;


                    const filePath =
                        slug +
                        "/" +
                        fileName;


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
                                    cacheControl: "3600",
                                    upsert: false,
                                    contentType: file.type
                                }
                            );


                    if (uploadError) {
                        throw uploadError;
                    }


                    const {
                        data: publicData
                    } =
                        supabaseClient
                            .storage
                            .from("category-images")
                            .getPublicUrl(
                                filePath
                            );


                    const imageUrl =
                        publicData?.publicUrl ||
                        "";


                    const {
                        error: dbError
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
                            ]);


                    if (dbError) {

                        await supabaseClient
                            .storage
                            .from("category-images")
                            .remove([
                                filePath
                            ]);

                        throw dbError;
                    }


                    imageMesaji(
                        "Resim başarıyla yüklendi.",
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


                    imageMesaji(
                        error.message ||
                        "Resim yüklenemedi.",
                        false
                    );

                }

                finally {

                    uploadButton.disabled =
                        false;

                    uploadButton.textContent =
                        "Resmi Yükle";
                }

            }
        );

    }


    /* =====================================================
       RESİMLERİ YÜKLE
    ===================================================== */

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
                        <p>${escapeHTML(error.message)}</p>
                    </div>
                `;


                if (imageCount) {
                    imageCount.textContent =
                        "0 resim";
                }


                return;
            }


            const resimler =
                data || [];


            if (imageCount) {

                imageCount.textContent =
                    resimler.length +
                    " resim";
            }


            if (
                resimler.length ===
                0
            ) {

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
                resimler
                    .map(function (image) {

                        const url =
                            image.image_url ||
                            "";


                        return `

                            <div
                                class="image-card"
                                style="
                                    border:1px solid #292929;
                                    border-radius:10px;
                                    padding:12px;
                                    background:#151515;
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
                                                    style="color:#D4AF37;"
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
                                            color:#ffffff;
                                            font-weight:600;
                                            margin-bottom:8px;
                                        "
                                    >
                                        ${escapeHTML(
                                            image.category || "-"
                                        )}
                                    </div>


                                    <div
                                        style="
                                            color:#777;
                                            font-size:12px;
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
                                            padding:9px;
                                            border:1px solid #d9534f;
                                            background:#151515;
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

                    })
                    .join("");


            /* =================================================
               RESİM SİL
            ================================================= */

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


                            if (
                                !confirm(
                                    "Bu resmi silmek istediğinize emin misiniz?"
                                )
                            ) {
                                return;
                            }


                            button.disabled =
                                true;

                            button.textContent =
                                "Siliniyor...";


                            try {

                                if (path) {

                                    const {
                                        error:
                                            storageError
                                    } =
                                        await supabaseClient
                                            .storage
                                            .from(
                                                "category-images"
                                            )
                                            .remove([
                                                path
                                            ]);


                                    if (storageError) {
                                        throw storageError;
                                    }
                                }


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
                                            id
                                        );


                                if (error) {
                                    throw error;
                                }


                                await resimleriYukle();

                                await dashboardIstatistikleriniYukle();

                            }

                            catch (error) {

                                console.error(
                                    "Resim silme hatası:",
                                    error
                                );


                                alert(
                                    "Resim silinemedi:\n" +
                                    error.message
                                );


                                button.disabled =
                                    false;

                                button.textContent =
                                    "Resmi Sil";
                            }

                        }
                    );

                });

        }

        catch (error) {

            console.error(
                "Resim listesi hatası:",
                error
            );

        }

    }


    /* =====================================================
       RESİM MESAJI
    ===================================================== */

    function imageMesaji(
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


    /* =====================================================
       DOSYA UZANTISI
    ===================================================== */

    function dosyaUzantisiAl(
        fileName,
        mimeType
    ) {

        const name =
            String(fileName || "");


        const dot =
            name.lastIndexOf(".");


        if (dot !== -1) {

            const extension =
                name
                    .substring(dot)
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


        if (
            mimeType ===
            "image/png"
        ) {
            return ".png";
        }


        if (
            mimeType ===
            "image/webp"
        ) {
            return ".webp";
        }


        return ".jpg";
    }


    /* =====================================================
       KATEGORİ SLUG
    ===================================================== */

    function kategoriSlugOlustur(
        category
    ) {

        return String(category)

            .toLocaleLowerCase(
                "tr-TR"
            )

            .replace(/ğ/g, "g")
            .replace(/ü/g, "u")
            .replace(/ş/g, "s")
            .replace(/ı/g, "i")
            .replace(/ö/g, "o")
            .replace(/ç/g, "c")

            .replace(
                /[^a-z0-9]+/g,
                "-"
            )

            .replace(
                /^-+|-+$/g,
                "");

    }


    /* =====================================================
       DASHBOARD İSTATİSTİKLERİ
    ===================================================== */

    async function dashboardIstatistikleriniYukle() {

        try {

            /* =============================================
               ÜRÜNLER
            ============================================= */

            const {
                data: products,
                error: productsError
            } =
                await supabaseClient
                    .from("products")
                    .select(
                        "id,is_active"
                    );


            const totalProducts =
                document.getElementById(
                    "totalProducts"
                );


            const activeProducts =
                document.getElementById(
                    "activeProducts"
                );


            if (productsError) {

                console.error(
                    "Ürün istatistiği hatası:",
                    productsError
                );

            }

            else {

                const urunler =
                    products || [];


                if (totalProducts) {

                    totalProducts.textContent =
                        urunler.length;
                }


                if (activeProducts) {

                    activeProducts.textContent =
                        urunler.filter(
                            function (product) {
                                return product.is_active === true;
                            }
                        ).length;
                }

            }


            /* =============================================
               RESİMLER
            ============================================= */

            const {
                data: images,
                error: imagesError
            } =
                await supabaseClient
                    .from("category_images")
                    .select("id");


            const totalImages =
                document.getElementById(
                    "totalImages"
                );


            if (totalImages) {

                totalImages.textContent =
                    imagesError
                        ? "0"
                        : (images || []).length;
            }


            /* =============================================
               STORAGE
            ============================================= */

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


    /* =====================================================
       HTML GÜVENLİK
    ===================================================== */

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
            async function () {

                try {

                    await supabaseClient
                        .auth
                        .signOut();

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


    /* =====================================================
       İLK VERİLER
    ===================================================== */

    await urunleriYukle();

    await resimleriYukle();

    await dashboardIstatistikleriniYukle();


    /* =====================================================
       RESİM SİSTEMİNİ BAŞLAT
    ===================================================== */

    resimYonetiminiBaslat();


    console.log(
        "Sur Halı Admin panel hazır."
    );

}
```
