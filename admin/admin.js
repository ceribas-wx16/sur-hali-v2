"use strict";


console.log("Sur Halı Admin başlatılıyor...");


/* =========================================================
   SUPABASE
========================================================= */

const SUPABASE_URL =
    "https://lhltolrtgnfkbwfkpaex.supabase.co";


const SUPABASE_KEY =
    "sb_publishable_xdWMVRunvPSeiMw2vfGWyw_l6dTnBsn";


if (
    typeof window.supabase === "undefined"
) {

    console.error(
        "Supabase JS yüklenemedi."
    );

} else {

    window.supabaseClient =
        window.supabase.createClient(
            SUPABASE_URL,
            SUPABASE_KEY
        );

    console.log(
        "Supabase bağlantısı hazır."
    );

}


/* =========================================================
   BAŞLANGIÇ
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        console.log(
            "DOM hazır."
        );


        if (
            typeof window.supabaseClient ===
            "undefined"
        ) {

            console.error(
                "supabaseClient bulunamadı."
            );

            return;
        }


        adminPanelBaslat();

    }
);


/* =========================================================
   ADMİN PANELİ
========================================================= */

async function adminPanelBaslat() {

    console.log(
        "Admin panel başlatılıyor..."
    );


    /* =====================================================
       OTURUM
    ===================================================== */

    try {

        const sessionResult =
            await window.supabaseClient.auth.getSession();


        if (
            sessionResult.error
        ) {

            console.error(
                "Oturum kontrol hatası:",
                sessionResult.error
            );

            return;
        }


        if (
            !sessionResult.data.session
        ) {

            console.warn(
                "Aktif oturum yok."
            );

            window.location.href =
                "admin-login.html";

            return;
        }


        console.log(
            "Admin oturumu aktif:",
            sessionResult.data.session.user.email
        );

    }

    catch (error) {

        console.error(
            "Oturum kontrol hatası:",
            error
        );

        return;

    }


    /* =====================================================
       MENÜ
    ===================================================== */

    menuSisteminiBaslat();


    /* =====================================================
       ÜRÜNLER
    ===================================================== */

    urunSisteminiBaslat();


    /* =====================================================
       RESİMLER
    ===================================================== */

    resimSisteminiBaslat();


    /* =====================================================
       ÇIKIŞ
    ===================================================== */

    cikisSisteminiBaslat();


    /* =====================================================
       İLK VERİLER
    ===================================================== */

    await urunleriYukle();

    await resimleriYukle();

    await dashboardIstatistikleriniYukle();


    console.log(
        "Sur Halı Admin panel hazır."
    );

}


/* =========================================================
   MENÜ SİSTEMİ
========================================================= */

function menuSisteminiBaslat() {

    const menuItems =
        document.querySelectorAll(
            ".sidebar .menu-item[data-page]"
        );


    const quickButtons =
        document.querySelectorAll(
            ".quick-actions [data-page]"
        );


    function sayfaAc(pageId) {

        const pages =
            document.querySelectorAll(
                ".main-content .page"
            );


        pages.forEach(
            function (page) {

                page.classList.remove(
                    "active-page"
                );

            }
        );


        const target =
            document.getElementById(
                pageId
            );


        if (!target) {

            console.error(
                "Sayfa bulunamadı:",
                pageId
            );

            return;
        }


        target.classList.add(
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

    }


    menuItems.forEach(
        function (item) {

            item.addEventListener(
                "click",
                function () {

                    const pageId =
                        item.getAttribute(
                            "data-page"
                        );

                    sayfaAc(pageId);

                }
            );

        }
    );


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


    console.log(
        "Menü sistemi hazır."
    );

}


/* =========================================================
   ÜRÜN SİSTEMİ
========================================================= */

let duzenlenenUrunId = null;


function urunSisteminiBaslat() {

    const newButton =
        document.getElementById(
            "newProductButton"
        );


    const cancelButton =
        document.getElementById(
            "cancelProductButton"
        );


    const form =
        document.getElementById(
            "productForm"
        );


    if (newButton) {

        newButton.addEventListener(
            "click",
            function () {

                urunFormunuYeniAc();

            }
        );

    }


    if (cancelButton) {

        cancelButton.addEventListener(
            "click",
            function () {

                urunFormunuKapat();

            }
        );

    }


    if (form) {

        form.addEventListener(
            "submit",
            urunKaydet
        );

    }


    console.log(
        "Ürün sistemi hazır."
    );

}


/* =========================================================
   YENİ ÜRÜN FORMU
========================================================= */

function urunFormunuYeniAc() {

    const form =
        document.getElementById(
            "productForm"
        );


    const box =
        document.getElementById(
            "productFormBox"
        );


    const newButton =
        document.getElementById(
            "newProductButton"
        );


    const title =
        document.getElementById(
            "productFormTitle"
        );


    const saveButton =
        document.getElementById(
            "saveProductButton"
        );


    duzenlenenUrunId =
        null;


    if (form) {
        form.reset();
    }


    if (title) {

        title.textContent =
            "Yeni Ürün Ekle";

    }


    if (saveButton) {

        saveButton.textContent =
            "Ürünü Kaydet";

    }


    if (box) {

        box.style.display =
            "block";

    }


    if (newButton) {

        newButton.style.display =
            "none";

    }


    formMesajiTemizle();

}


/* =========================================================
   FORM KAPAT
========================================================= */

function urunFormunuKapat() {

    const form =
        document.getElementById(
            "productForm"
        );


    const box =
        document.getElementById(
            "productFormBox"
        );


    const newButton =
        document.getElementById(
            "newProductButton"
        );


    duzenlenenUrunId =
        null;


    if (form) {

        form.reset();

    }


    if (box) {

        box.style.display =
            "none";

    }


    if (newButton) {

        newButton.style.display =
            "inline-block";

    }


    formMesajiTemizle();

}


/* =========================================================
   ÜRÜN KAYDET
========================================================= */

async function urunKaydet(e) {

    e.preventDefault();


    const name =
        document.getElementById(
            "productName"
        ).value.trim();


    const category =
        document.getElementById(
            "productCategory"
        ).value;


    const size =
        document.getElementById(
            "productSize"
        ).value.trim();


    const priceText =
        document.getElementById(
            "productPrice"
        ).value;


    const description =
        document.getElementById(
            "productDescription"
        ).value.trim();


    const active =
        document.getElementById(
            "productActive"
        ).value === "true";


    const saveButton =
        document.getElementById(
            "saveProductButton"
        );


    if (!name) {

        formMesajiGoster(
            "Ürün adını girin.",
            false
        );

        return;

    }


    if (!category) {

        formMesajiGoster(
            "Kategori seçin.",
            false
        );

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
                "Fiyat geçerli değil.",
                false
            );

            return;

        }

    }


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
                active

        };


        let result;


        if (duzenlenenUrunId) {

            result =
                await window.supabaseClient
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

        } else {

            result =
                await window.supabaseClient
                    .from("products")
                    .insert([
                        urunData
                    ])
                    .select()
                    .single();

        }


        if (result.error) {

            throw result.error;

        }


        formMesajiGoster(
            duzenlenenUrunId
                ? "Ürün başarıyla güncellendi."
                : "Ürün başarıyla kaydedildi.",
            true
        );


        duzenlenenUrunId =
            null;


        const form =
            document.getElementById(
                "productForm"
            );


        if (form) {

            form.reset();

        }


        await urunleriYukle();

        await dashboardIstatistikleriniYukle();


        setTimeout(
            function () {

                urunFormunuKapat();

            },
            700
        );

    }

    catch (error) {

        console.error(
            "Ürün kaydetme hatası:",
            error
        );


        formMesajiGoster(
            "Ürün kaydedilemedi: " +
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


/* =========================================================
   ÜRÜNLERİ YÜKLE
========================================================= */

async function urunleriYukle() {

    const list =
        document.getElementById(
            "productList"
        );


    const count =
        document.getElementById(
            "productCount"
        );


    if (!list) {
        return;
    }


    try {

        const result =
            await window.supabaseClient
                .from("products")
                .select("*")
                .order(
                    "created_at",
                    {
                        ascending:
                            false
                    }
                );


        if (result.error) {

            throw result.error;

        }


        const products =
            result.data || [];


        if (count) {

            count.textContent =
                products.length +
                " ürün";

        }


        if (
            products.length === 0
        ) {

            list.innerHTML = `

                <div class="empty-state">

                    <div class="empty-icon">
                        ▤
                    </div>

                    <h2>
                        Henüz ürün bulunmuyor
                    </h2>

                    <p>
                        Yeni Ürün butonunu kullanarak
                        ilk ürününüzü ekleyebilirsiniz.
                    </p>

                </div>

            `;

            return;

        }


        list.innerHTML =
            products
                .map(
                    function (product) {

                        const price =
                            product.price !== null
                                ? Number(
                                    product.price
                                ).toLocaleString(
                                    "tr-TR",
                                    {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2
                                    }
                                ) +
                                " TL"
                                : "-";


                        const status =
                            product.is_active
                                ? "Aktif"
                                : "Pasif";


                        return `

                            <div
                                class="product-item"
                                data-id="${escapeHTML(product.id)}"
                                style="
                                    display:flex;
                                    justify-content:space-between;
                                    gap:20px;
                                    align-items:flex-start;
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
                                        ${price}
                                    </p>

                                    <p>
                                        <strong>Durum:</strong>
                                        ${status}
                                    </p>

                                    ${
                                        product.description
                                            ? `
                                                <p>
                                                    <strong>Açıklama:</strong>
                                                    ${escapeHTML(product.description)}
                                                </p>
                                            `
                                            : ""
                                    }

                                </div>


                                <div
                                    style="
                                        display:flex;
                                        gap:8px;
                                        flex-shrink:0;
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
                                    >
                                        Sil
                                    </button>

                                </div>

                            </div>

                        `;

                    }
                )
                .join("");


        list
            .querySelectorAll(
                ".edit-product-button"
            )
            .forEach(
                function (button) {

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
                                        ) ===
                                        String(id);

                                    }
                                );


                            if (product) {

                                urunDuzenle(
                                    product
                                );

                            }

                        }
                    );

                }
            );


        list
            .querySelectorAll(
                ".delete-product-button"
            )
            .forEach(
                function (button) {

                    button.addEventListener(
                        "click",
                        function () {

                            const id =
                                button.getAttribute(
                                    "data-id"
                                );


                            urunSil(
                                id,
                                button
                            );

                        }
                    );

                }
            );

    }

    catch (error) {

        console.error(
            "Ürünler yüklenemedi:",
            error
        );


        list.innerHTML = `

            <div class="empty-state">

                <h2>
                    Ürünler yüklenemedi
                </h2>

                <p>
                    ${escapeHTML(error.message)}
                </p>

            </div>

        `;

    }

}


/* =========================================================
   ÜRÜN DÜZENLE
========================================================= */

function urunDuzenle(product) {

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


    document.getElementById(
        "productFormTitle"
    ).textContent =
        "Ürünü Düzenle";


    document.getElementById(
        "saveProductButton"
    ).textContent =
        "Güncelle";


    document.getElementById(
        "productFormBox"
    ).style.display =
        "block";


    document.getElementById(
        "newProductButton"
    ).style.display =
        "none";


    formMesajiTemizle();


    document.getElementById(
        "productFormBox"
    ).scrollIntoView({
        behavior:
            "smooth",
        block:
            "start"
    });

}


/* =========================================================
   ÜRÜN SİL
========================================================= */

async function urunSil(
    id,
    button
) {

    const onay =
        confirm(
            "Bu ürünü silmek istediğinize emin misiniz?"
        );


    if (!onay) {
        return;
    }


    if (button) {

        button.disabled =
            true;

        button.textContent =
            "Siliniyor...";

    }


    try {

        const result =
            await window.supabaseClient
                .from("products")
                .delete()
                .eq(
                    "id",
                    id
                );


        if (result.error) {

            throw result.error;

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


        if (button) {

            button.disabled =
                false;

            button.textContent =
                "Sil";

        }

    }

}


/* =========================================================
   RESİM SİSTEMİ
========================================================= */

function resimSisteminiBaslat() {

    const fileInput =
        document.getElementById(
            "imageFile"
        );


    const preview =
        document.getElementById(
            "imagePreview"
        );


    const previewBox =
        document.getElementById(
            "imagePreviewBox"
        );


    const uploadButton =
        document.getElementById(
            "uploadImageButton"
        );


    if (fileInput) {

        fileInput.addEventListener(
            "change",
            function () {

                const file =
                    fileInput.files &&
                    fileInput.files[0];


                if (!file) {

                    if (previewBox) {

                        previewBox.style.display =
                            "none";

                    }

                    return;

                }


                if (
                    !file.type.startsWith(
                        "image/"
                    )
                ) {

                    imageMesajiGoster(
                        "Geçerli bir resim seçin.",
                        false
                    );

                    fileInput.value =
                        "";

                    return;

                }


                const url =
                    URL.createObjectURL(
                        file
                    );


                if (preview) {

                    preview.src =
                        url;

                }


                if (previewBox) {

                    previewBox.style.display =
                        "block";

                }

            }
        );

    }


    if (uploadButton) {

        uploadButton.addEventListener(
            "click",
            resimYukle
        );

    }


    console.log(
        "Resim sistemi hazır."
    );

}


/* =========================================================
   RESİM YÜKLE
========================================================= */

async function resimYukle() {

    const fileInput =
        document.getElementById(
            "imageFile"
        );


    const categoryInput =
        document.getElementById(
            "imageCategory"
        );


    const button =
        document.getElementById(
            "uploadImageButton"
        );


    const file =
        fileInput &&
        fileInput.files &&
        fileInput.files[0];


    const category =
        categoryInput
            ? categoryInput.value
            : "";


    if (!file) {

        imageMesajiGoster(
            "Önce bir resim seçin.",
            false
        );

        return;

    }


    if (!category) {

        imageMesajiGoster(
            "Resim kategorisini seçin.",
            false
        );

        return;

    }


    if (
        !file.type.startsWith(
            "image/"
        )
    ) {

        imageMesajiGoster(
            "Geçerli bir resim seçin.",
            false
        );

        return;

    }


    if (
        file.size >
        10 * 1024 * 1024
    ) {

        imageMesajiGoster(
            "Resim 10 MB'dan büyük olamaz.",
            false
        );

        return;

    }


    if (button) {

        button.disabled =
            true;

        button.textContent =
            "Yükleniyor...";

    }


    try {

        const extension =
            dosyaUzantisiAl(
                file.name,
                file.type
            );


        const folder =
            kategoriSlugOlustur(
                category
            );


        const fileName =
            Date.now() +
            "-" +
            Math.random()
                .toString(36)
                .substring(
                    2,
                    10
                ) +
            extension;


        const filePath =
            folder +
            "/" +
            fileName;


        const uploadResult =
            await window.supabaseClient
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
                            false,
                        contentType:
                            file.type
                    }
                );


        if (
            uploadResult.error
        ) {

            throw uploadResult.error;

        }


        const publicResult =
            window.supabaseClient
                .storage
                .from(
                    "category-images"
                )
                .getPublicUrl(
                    filePath
                );


        const imageUrl =
            publicResult.data.publicUrl;


        const databaseResult =
            await window.supabaseClient
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
                ])
                .select()
                .single();


        if (
            databaseResult.error
        ) {

            await window.supabaseClient
                .storage
                .from(
                    "category-images"
                )
                .remove([
                    filePath
                ]);


            throw databaseResult.error;

        }


        imageMesajiGoster(
            "Resim başarıyla yüklendi.",
            true
        );


        fileInput.value =
            "";


        if (categoryInput) {

            categoryInput.value =
                "";

        }


        const previewBox =
            document.getElementById(
                "imagePreviewBox"
            );


        if (previewBox) {

            previewBox.style.display =
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
            "Resim yüklenemedi: " +
            error.message,
            false
        );

    }

    finally {

        if (button) {

            button.disabled =
                false;

            button.textContent =
                "Resmi Yükle";

        }

    }

}


/* =========================================================
   RESİMLERİ YÜKLE
========================================================= */

async function resimleriYukle() {

    const list =
        document.getElementById(
            "imageList"
        );


    const count =
        document.getElementById(
            "imageCount"
        );


    if (!list) {
        return;
    }


    try {

        const result =
            await window.supabaseClient
                .from(
                    "category_images"
                )
                .select("*")
                .order(
                    "created_at",
                    {
                        ascending:
                            false
                    }
                );


        if (result.error) {

            throw result.error;

        }


        const images =
            result.data || [];


        if (count) {

            count.textContent =
                images.length +
                " resim";

        }


        if (
            images.length === 0
        ) {

            list.innerHTML = `

                <div class="empty-state">

                    <div class="empty-icon">
                        ▧
                    </div>

                    <h2>
                        Henüz resim bulunmuyor
                    </h2>

                    <p>
                        Yukarıdaki alandan ilk resminizi yükleyebilirsiniz.
                    </p>

                </div>

            `;

            return;

        }


        list.innerHTML =
            images
                .map(
                    function (image) {

                        return `

                            <div
                                class="image-card"
                                style="
                                    border:1px solid #e0e0e0;
                                    border-radius:10px;
                                    padding:12px;
                                    background:#fff;
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
                                        image.image_url
                                            ? `
                                                <img
                                                    src="${escapeHTML(image.image_url)}"
                                                    alt="${escapeHTML(image.category || "Sur Halı")}"
                                                    style="
                                                        width:100%;
                                                        height:100%;
                                                        object-fit:cover;
                                                    "
                                                >
                                            `
                                            : `
                                                <span style="color:#D4AF37;">
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

                                    <strong>
                                        ${escapeHTML(image.category || "-")}
                                    </strong>


                                    <div
                                        style="
                                            font-size:12px;
                                            color:#777;
                                            word-break:break-all;
                                            margin:8px 0 12px;
                                        "
                                    >
                                        ${escapeHTML(image.image_path || "")}
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
                                            background:#fff;
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

                    }
                )
                .join("");


        list
            .querySelectorAll(
                ".delete-image-button"
            )
            .forEach(
                function (button) {

                    button.addEventListener(
                        "click",
                        function () {

                            resimSil(
                                button.getAttribute("data-id"),
                                button.getAttribute("data-path"),
                                button
                            );

                        }
                    );

                }
            );

    }

    catch (error) {

        console.error(
            "Resimler yüklenemedi:",
            error
        );


        list.innerHTML = `

            <div class="empty-state">

                <h2>
                    Resimler yüklenemedi
                </h2>

                <p>
                    ${escapeHTML(error.message)}
                </p>

            </div>

        `;

    }

}


/* =========================================================
   RESİM SİL
========================================================= */

async function resimSil(
    id,
    path,
    button
) {

    const onay =
        confirm(
            "Bu resmi silmek istediğinize emin misiniz?"
        );


    if (!onay) {
        return;
    }


    if (button) {

        button.disabled =
            true;

        button.textContent =
            "Siliniyor...";

    }


    try {

        if (path) {

            const storageResult =
                await window.supabaseClient
                    .storage
                    .from(
                        "category-images"
                    )
                    .remove([
                        path
                    ]);


            if (
                storageResult.error
            ) {

                throw storageResult.error;

            }

        }


        const databaseResult =
            await window.supabaseClient
                .from(
                    "category_images"
                )
                .delete()
                .eq(
                    "id",
                    id
                );


        if (
            databaseResult.error
        ) {

            throw databaseResult.error;

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


        if (button) {

            button.disabled =
                false;

            button.textContent =
                "Resmi Sil";

        }

    }

}


/* =========================================================
   DASHBOARD
========================================================= */

async function dashboardIstatistikleriniYukle() {

    try {

        const total =
            await window.supabaseClient
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


        const active =
            await window.supabaseClient
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


        const images =
            await window.supabaseClient
                .from("category_images")
                .select(
                    "*",
                    {
                        count:
                            "exact",
                        head:
                            true
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


        if (totalProducts) {

            totalProducts.textContent =
                total.error
                    ? "0"
                    : (
                        total.count || 0
                    );

        }


        if (activeProducts) {

            activeProducts.textContent =
                active.error
                    ? "0"
                    : (
                        active.count || 0
                    );

        }


        if (totalImages) {

            totalImages.textContent =
                images.error
                    ? "0"
                    : (
                        images.count || 0
                    );

        }


        const storage =
            document.getElementById(
                "storageUsage"
            );


        if (storage) {

            storage.textContent =
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


/* =========================================================
   ÇIKIŞ
========================================================= */

function cikisSisteminiBaslat() {

    const button =
        document.getElementById(
            "logoutButton"
        );


    if (!button) {
        return;
    }


    button.addEventListener(
        "click",
        async function () {

            try {

                await window.supabaseClient
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


/* =========================================================
   FORM MESAJLARI
========================================================= */

function formMesajiGoster(
    text,
    success
) {

    const message =
        document.getElementById(
            "productFormMessage"
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


/* =========================================================
   RESİM MESAJLARI
========================================================= */

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


/* =========================================================
   UZANTI
========================================================= */

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


/* =========================================================
   KATEGORİ SLUG
========================================================= */

function kategoriSlugOlustur(
    category
) {

    return String(
        category
    )
        .toLocaleLowerCase(
            "tr-TR"
        )
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
            /[^a-z0-9]+/g,
            "-"
        )
        .replace(
            /^-+|-+$/g,
            ""
        );

}


/* =========================================================
   HTML ESCAPE
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
