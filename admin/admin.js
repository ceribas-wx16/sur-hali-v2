console.log("Sur Halı Admin başlatılıyor...");


document.addEventListener("DOMContentLoaded", function () {

    console.log("DOM hazır.");

    const loginForm =
        document.getElementById("loginForm");

    if (loginForm) {

        console.log("Giriş formu bulundu.");

        loginForm.addEventListener(
            "submit",
            girisYap
        );

        return;
    }


    const sidebar =
        document.querySelector(".sidebar");

    const mainContent =
        document.querySelector(".main-content");


    if (sidebar && mainContent) {

        console.log("Admin paneli bulundu.");

        adminPanelBaslat();

    } else {

        console.warn(
            "Admin paneli elemanları bulunamadı."
        );

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


    if (
        typeof supabaseClient ===
        "undefined"
    ) {

        if (mesaj) {
            mesaj.textContent =
                "Supabase bağlantısı kurulamadı.";
        }

        console.error(
            "supabaseClient bulunamadı."
        );

        return;
    }


    try {

        const result =
            await supabaseClient.auth.signInWithPassword({
                email: email,
                password: password
            });


        if (result.error) {

            console.error(
                "Giriş hatası:",
                result.error
            );

            if (mesaj) {
                mesaj.textContent =
                    result.error.message;
            }

            return;
        }


        console.log(
            "Giriş başarılı:",
            result.data.user
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
       OTURUM
    ====================================================== */

    try {

        const result =
            await supabaseClient.auth.getSession();


        if (result.error) {

            console.error(
                "Oturum kontrol hatası:",
                result.error
            );

            return;
        }


        if (!result.data.session) {

            console.warn(
                "Aktif oturum yok."
            );

            window.location.href =
                "admin-login.html";

            return;
        }


        console.log(
            "Admin oturumu aktif:",
            result.data.session.user.email
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


    const menuItems =
        document.querySelectorAll(
            ".sidebar .menu-item[data-page]"
        );


    const quickButtons =
        document.querySelectorAll(
            ".quick-actions [data-page]"
        );


    console.log(
        "Menü:",
        menuItems.length
    );

    console.log(
        "Sayfalar:",
        pages.length
    );


    /* ======================================================
       SAYFA AÇ
    ====================================================== */

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
       SOL MENÜ
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
       HIZLI BUTONLAR
    ====================================================== */

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
       ÜRÜN ELEMANLARI
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
       FORM MESAJ
    ====================================================== */

    function formMesajiGoster(
        text,
        success
    ) {

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

        } else {

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


    /* ======================================================
       YENİ ÜRÜN
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
       ÜRÜN KAYDET
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

                const description =
                    descriptionElement
                        ? descriptionElement.value.trim()
                        : "";

                const active =
                    activeElement
                        ? activeElement.value === "true"
                        : true;


                let price = null;


                if (
                    priceElement &&
                    priceElement.value !== ""
                ) {

                    price =
                        Number(
                            priceElement.value
                        );


                    if (
                        Number.isNaN(price)
                    ) {

                        formMesajiGoster(
                            "Fiyat geçerli değil.",
                            false
                        );

                        return;
                    }

                }


                if (!name) {

                    formMesajiGoster(
                        "Lütfen ürün adını girin.",
                        false
                    );

                    return;
                }


                if (!category) {

                    formMesajiGoster(
                        "Lütfen kategori seçin.",
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

                        size:
                            size || null,

                        price:
                            price,

                        description:
                            description || null,

                        is_active:
                            active

                    };


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


                        if (result.error) {
                            throw new Error(
                                result.error.message
                            );
                        }


                        formMesajiGoster(
                            "Ürün başarıyla güncellendi.",
                            true
                        );

                    } else {

                        const result =
                            await supabaseClient
                                .from("products")
                                .insert([
                                    {
                                        ...urunData,
                                        image_url: null
                                    }
                                ]);


                        if (result.error) {
                            throw new Error(
                                result.error.message
                            );
                        }


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
                        "Ürün işlemi hatası:",
                        error
                    );


                    formMesajiGoster(
                        "Ürün işlemi başarısız: " +
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

            const result =
                await supabaseClient
                    .from("products")
                    .select("*")
                    .order(
                        "created_at",
                        {
                            ascending: false
                        }
                    );


            if (result.error) {

                throw new Error(
                    result.error.message
                );

            }


            const data =
                result.data || [];


            if (productCount) {

                productCount.textContent =
                    data.length +
                    " ürün";

            }


            if (data.length === 0) {

                productList.innerHTML =
                    '<div class="empty-state">' +
                    '<div class="empty-icon">▤</div>' +
                    '<h2>Henüz ürün bulunmuyor</h2>' +
                    '<p>Yeni Ürün butonunu kullanarak ilk ürününüzü ekleyebilirsiniz.</p>' +
                    '</div>';

                return;
            }


            productList.innerHTML =
                data.map(function (product) {

                    const fiyat =
                        product.price !== null
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


                    return (
                        '<div class="product-item">' +

                            '<div class="product-item-info">' +

                                '<h3>' +
                                    escapeHTML(
                                        product.name
                                    ) +
                                '</h3>' +

                                '<p><strong>Kategori:</strong> ' +
                                    escapeHTML(
                                        product.category || "-"
                                    ) +
                                '</p>' +

                                '<p><strong>Ölçü:</strong> ' +
                                    escapeHTML(
                                        product.size || "-"
                                    ) +
                                '</p>' +

                                '<p><strong>Fiyat:</strong> ' +
                                    fiyat +
                                '</p>' +

                                (
                                    product.description
                                        ? '<p><strong>Açıklama:</strong> ' +
                                            escapeHTML(
                                                product.description
                                            ) +
                                          '</p>'
                                        : ""
                                ) +

                            '</div>' +

                            '<div class="product-item-status">' +

                                '<span class="' +
                                    (
                                        product.is_active
                                            ? "active"
                                            : "passive"
                                    ) +
                                '">' +
                                    durum +
                                '</span>' +

                                '<div>' +

                                    '<button ' +
                                        'type="button" ' +
                                        'class="edit-product-button" ' +
                                        'data-id="' +
                                            escapeHTML(
                                                product.id
                                            ) +
                                        '">' +
                                        'Düzenle' +
                                    '</button>' +

                                    '<button ' +
                                        'type="button" ' +
                                        'class="delete-product-button" ' +
                                        'data-id="' +
                                            escapeHTML(
                                                product.id
                                            ) +
                                        '">' +
                                        'Sil' +
                                    '</button>' +

                                '</div>' +

                            '</div>' +

                        '</div>'
                    );

                }).join("");


            /* ==================================================
               DÜZENLE BUTONLARI
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
                                data.find(
                                    function (item) {

                                        return String(
                                            item.id
                                        ) ===
                                        String(id);

                                    }
                                );


                            if (product) {

                                urunDuzenlemeFormunuAc(
                                    product
                                );

                            }

                        }
                    );

                });


            /* ==================================================
               SİL BUTONLARI
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
                                data.find(
                                    function (item) {

                                        return String(
                                            item.id
                                        ) ===
                                        String(id);

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

                                const result =
                                    await supabaseClient
                                        .from("products")
                                        .delete()
                                        .eq(
                                            "id",
                                            product.id
                                        );


                                if (result.error) {

                                    throw new Error(
                                        result.error.message
                                    );

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
                                    "Ürün silinemedi:\n\n" +
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
                "Ürünleri yükleme hatası:",
                error
            );


            productList.innerHTML =
                '<div class="empty-state">' +
                '<div class="empty-icon">!</div>' +
                '<h2>Ürünler yüklenemedi</h2>' +
                '<p>' +
                    escapeHTML(
                        error.message
                    ) +
                '</p>' +
                '</div>';

        }

    }


    /* ======================================================
       ÜRÜN DÜZENLE
    ====================================================== */

    function urunDuzenlemeFormunuAc(
        product
    ) {

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
                product.price !== null
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
       HTML ESCAPE
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

            const totalResult =
                await supabaseClient
                    .from("products")
                    .select(
                        "*",
                        {
                            count: "exact",
                            head: true
                        }
                    );


            const activeResult =
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


            const imageResult =
                await supabaseClient
                    .from("category_images")
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


            const activeProducts =
                document.getElementById(
                    "activeProducts"
                );


            const totalImages =
                document.getElementById(
                    "totalImages"
                );


            const storageUsage =
                document.getElementById(
                    "storageUsage"
                );


            if (totalProducts) {

                totalProducts.textContent =
                    totalResult.count || 0;

            }


            if (activeProducts) {

                activeProducts.textContent =
                    activeResult.count || 0;

            }


            if (totalImages) {

                totalImages.textContent =
                    imageResult.count || 0;

            }


            if (storageUsage) {

                storageUsage.textContent =
                    "—";

            }

        }

        catch (error) {

            console.error(
                "Dashboard hatası:",
                error
            );

        }

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

        const uploadButton =
            document.getElementById(
                "uploadImageButton"
            );


        if (
            !imageFile ||
            !uploadButton
        ) {
            return;
        }


        imageFile.addEventListener(
            "change",
            function () {

                const file =
                    imageFile.files &&
                    imageFile.files[0];


                if (!file) {
                    return;
                }


                if (
                    !file.type.startsWith(
                        "image/"
                    )
                ) {

                    imageFile.value =
                        "";

                    imageMesajiGoster(
                        "Geçerli bir resim seçin.",
                        false
                    );

                    return;
                }


                const objectUrl =
                    URL.createObjectURL(
                        file
                    );


                if (imagePreview) {
                    imagePreview.src =
                        objectUrl;
                }


                if (imagePreviewBox) {
                    imagePreviewBox.style.display =
                        "block";
                }

            }
        );


        uploadButton.addEventListener(
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
                        "Önce resim seçin.",
                        false
                    );

                    return;
                }


                if (!category) {

                    imageMesajiGoster(
                        "Kategori seçin.",
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


                    const filePath =
                        slug +
                        "/" +
                        Date.now() +
                        "-" +
                        Math.random()
                            .toString(36)
                            .substring(2, 10) +
                        extension;


                    const uploadResult =
                        await supabaseClient
                            .storage
                            .from(
                                "category-images"
                            )
                            .upload(
                                filePath,
                                file,
                                {
                                    cacheControl: "3600",
                                    upsert: false,
                                    contentType: file.type
                                }
                            );


                    if (uploadResult.error) {

                        throw new Error(
                            uploadResult.error.message
                        );

                    }


                    const publicResult =
                        supabaseClient
                            .storage
                            .from(
                                "category-images"
                            )
                            .getPublicUrl(
                                filePath
                            );


                    const imageUrl =
                        publicResult
                            .data
                            .publicUrl;


                    const databaseResult =
                        await supabaseClient
                            .from(
                                "category_images"
                            )
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


                    if (databaseResult.error) {

                        await supabaseClient
                            .storage
                            .from(
                                "category-images"
                            )
                            .remove([
                                filePath
                            ]);


                        throw new Error(
                            databaseResult.error.message
                        );

                    }


                    imageMesajiGoster(
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


                    imageMesajiGoster(
                        error.message,
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

            const result =
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


            if (result.error) {

                throw new Error(
                    result.error.message
                );

            }


            const data =
                result.data || [];


            if (imageCount) {

                imageCount.textContent =
                    data.length +
                    " resim";

            }


            if (data.length === 0) {

                imageList.innerHTML =
                    '<div class="empty-state">' +
                    '<div class="empty-icon">▧</div>' +
                    '<h2>Henüz resim bulunmuyor</h2>' +
                    '<p>Yukarıdaki alandan ilk resminizi yükleyebilirsiniz.</p>' +
                    '</div>';

                return;
            }


            imageList.innerHTML =
                data.map(function (image) {

                    const url =
                        image.image_url || "";


                    return (
                        '<div class="image-card" ' +
                        'data-image-id="' +
                            escapeHTML(image.id) +
                        '">' +

                            '<div style="width:100%;height:180px;display:flex;align-items:center;justify-content:center;background:#111;border-radius:8px;overflow:hidden;">' +

                                (
                                    url
                                        ? '<img src="' +
                                            escapeHTML(url) +
                                          '" alt="' +
                                            escapeHTML(
                                                image.category ||
                                                "Sur Halı"
                                            ) +
                                          '" style="width:100%;height:100%;object-fit:cover;">'
                                        : '<span style="color:#D4AF37;">Önizleme yok</span>'
                                ) +

                            '</div>' +

                            '<div style="padding-top:12px;">' +

                                '<div style="font-weight:600;margin-bottom:6px;">' +
                                    escapeHTML(
                                        image.category || "-"
                                    ) +
                                '</div>' +

                                '<div style="font-size:12px;color:#777;word-break:break-all;margin-bottom:12px;">' +
                                    escapeHTML(
                                        image.image_path || ""
                                    ) +
                                '</div>' +

                                '<button type="button" class="delete-image-button" data-id="' +
                                    escapeHTML(image.id) +
                                    '" data-path="' +
                                    escapeHTML(
                                        image.image_path || ""
                                    ) +
                                '">' +
                                    'Resmi Sil' +
                                '</button>' +

                            '</div>' +

                        '</div>'
                    );

                }).join("");


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
                                    "Bu resmi silmek istediğinize emin misiniz?"
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
                "Resimleri yükleme hatası:",
                error
            );


            imageList.innerHTML =
                '<div class="empty-state">' +
                '<div class="empty-icon">!</div>' +
                '<h2>Resimler yüklenemedi</h2>' +
                '<p>' +
                    escapeHTML(
                        error.message
                    ) +
                '</p>' +
                '</div>';

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

            if (imagePath) {

                const storageResult =
                    await supabaseClient
                        .storage
                        .from(
                            "category-images"
                        )
                        .remove([
                            imagePath
                        ]);


                if (storageResult.error) {

                    throw new Error(
                        storageResult.error.message
                    );

                }

            }


            const databaseResult =
                await supabaseClient
                    .from(
                        "category_images"
                    )
                    .delete()
                    .eq(
                        "id",
                        imageId
                    );


            if (databaseResult.error) {

                throw new Error(
                    databaseResult.error.message
                );

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
                "Resim silinemedi:\n\n" +
                error.message
            );


            await resimleriYukle();

        }

    }


    /* ======================================================
       RESİM MESAJ
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

        } else {

            message.style.border =
                "1px solid #d9534f";

            message.style.background =
                "#fff5f5";

            message.style.color =
                "#9c2f2f";

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
            String(
                fileName || ""
            );


        const dot =
            name.lastIndexOf(".");


        if (dot !== -1) {

            const ext =
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
                allowed.includes(ext)
            ) {

                return ext;

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
       İLK VERİLER
    ====================================================== */

    await urunleriYukle();

    await dashboardIstatistikleriniYukle();

    resimYonetiminiBaslat();


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


    console.log(
        "Sur Halı Admin panel hazır."
    );

}
