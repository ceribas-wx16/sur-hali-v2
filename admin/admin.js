/* ==========================================================
   SUR HALI - ADMIN PANEL
   Tam sürüm
========================================================== */


/* ==========================================================
   SUPABASE AYARLARI
========================================================== */

const SUPABASE_URL =
    "https://lhltolrtgnfkbwfkpaex.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_xdWMVRunvPSeiMw2vfGWyw_l6dTnBsn";


/* ==========================================================
   GLOBAL SUPABASE CLIENT
========================================================== */

let supabaseClient = null;

let duzenlenenUrunId = null;


/* ==========================================================
   BAŞLANGIÇ
========================================================== */

document.addEventListener("DOMContentLoaded", async function () {

    console.log("=================================");
    console.log("Sur Halı Admin başlatılıyor...");
    console.log("=================================");

    if (!window.supabase) {

        console.error(
            "Supabase JS yüklenemedi."
        );

        return;
    }

    try {

        supabaseClient =
            window.supabase.createClient(
                SUPABASE_URL,
                SUPABASE_KEY
            );

        /*
         * Eski kodların ve gerektiğinde diğer fonksiyonların
         * erişebilmesi için global olarak da tanımlıyoruz.
         */

        window.supabaseClient =
            supabaseClient;

        console.log(
            "Supabase bağlantısı hazır."
        );

        console.log(
            "supabaseClient:",
            typeof supabaseClient
        );

    } catch (error) {

        console.error(
            "Supabase başlatma hatası:",
            error
        );

        return;
    }


    console.log("DOM hazır.");


    /* ======================================================
       LOGIN SAYFASI KONTROLÜ
    ====================================================== */

    const loginForm =
        document.getElementById("loginForm");

    if (loginForm) {

        loginForm.addEventListener(
            "submit",
            girisYap
        );

        console.log(
            "Giriş formu hazır."
        );

        return;
    }


    /* ======================================================
       ADMIN PANELİ
    ====================================================== */

    const sidebar =
        document.querySelector(".sidebar");

    const mainContent =
        document.querySelector(".main-content");

    if (
        sidebar &&
        mainContent
    ) {

        console.log(
            "Admin paneli bulundu."
        );

        await adminPanelBaslat();

    } else {

        console.warn(
            "Admin panel elemanları bulunamadı."
        );
    }

});


/* ==========================================================
   LOGIN
========================================================== */

async function girisYap(e) {

    e.preventDefault();

    const emailElement =
        document.getElementById("email");

    const passwordElement =
        document.getElementById("password");

    const mesaj =
        document.getElementById("loginMessage");


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
        mesaj.style.display = "none";

    }


    if (!supabaseClient) {

        if (mesaj) {

            mesaj.textContent =
                "Supabase bağlantısı kurulamadı.";

            mesaj.style.display = "block";
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

                mesaj.style.display =
                    "block";
            }

            return;
        }


        if (!data || !data.session) {

            if (mesaj) {

                mesaj.textContent =
                    "Giriş yapılamadı.";

                mesaj.style.display =
                    "block";
            }

            return;
        }


        /*
         * Admin paneline geç.
         */

        window.location.href =
            "admin.html";

    } catch (error) {

        console.error(
            "Giriş sırasında hata:",
            error
        );

        if (mesaj) {

            mesaj.textContent =
                "Giriş sırasında bir hata oluştu.";

            mesaj.style.display =
                "block";
        }
    }

}


/* ==========================================================
   ADMIN PANELİ BAŞLAT
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
             * Giriş sayfası gerçekten mevcutsa oraya git.
             */

            if (
                window.location.pathname.includes(
                    "/admin/"
                )
            ) {

                window.location.href =
                    "admin-login.html";
            }

            return;
        }


        console.log(
            "Aktif admin oturumu bulundu."
        );

    } catch (error) {

        console.error(
            "Oturum kontrolü başarısız:",
            error
        );

        return;
    }


    /* ======================================================
       MENÜ
    ====================================================== */

    menuSisteminiBaslat();


    /* ======================================================
       ÜRÜNLER
    ====================================================== */

    urunSisteminiBaslat();


    /* ======================================================
       RESİMLER
    ====================================================== */

    resimSisteminiBaslat();


    /* ======================================================
       ÇIKIŞ
    ====================================================== */

    cikisSisteminiBaslat();


    /* ======================================================
       DASHBOARD
    ====================================================== */

    await dashboardGuncelle();


    /* ======================================================
       İLK ÜRÜNLER
    ====================================================== */

    await urunleriYukle();


    /* ======================================================
       İLK RESİMLER
    ====================================================== */

    await resimleriYukle();


    console.log(
        "================================="
    );

    console.log(
        "Sur Halı Admin panel hazır."
    );

    console.log(
        "================================="
    );

}


/* ==========================================================
   MENÜ SİSTEMİ
========================================================== */

function menuSisteminiBaslat() {

    const menuItems =
        document.querySelectorAll(
            ".menu-item[data-page]"
        );


    const pages =
        document.querySelectorAll(
            ".page"
        );


    function sayfaAc(pageId) {

        if (!pageId) {
            return;
        }


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


        pages.forEach(function (page) {

            page.classList.remove(
                "active-page"
            );

        });


        menuItems.forEach(function (item) {

            item.classList.remove(
                "active"
            );

        });


        targetPage.classList.add(
            "active-page"
        );


        menuItems.forEach(function (item) {

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


        /*
         * Sayfa değiştirildiğinde ilgili veriyi yenile.
         */

        if (pageId === "productsPage") {

            urunleriYukle();

        }


        if (pageId === "imagesPage") {

            resimleriYukle();

        }


        if (pageId === "dashboardPage") {

            dashboardGuncelle();

        }

    }


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


    /*
     * Dashboard hızlı işlem butonları.
     */

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

}


/* ==========================================================
   ÜRÜN SİSTEMİ
========================================================== */

function urunSisteminiBaslat() {

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


    const productFormTitle =
        document.getElementById(
            "productFormTitle"
        );


    const saveProductButton =
        document.getElementById(
            "saveProductButton"
        );


    /*
     * YENİ ÜRÜN
     */

    if (newProductButton) {

        newProductButton.addEventListener(
            "click",
            function () {

                duzenlenenUrunId =
                    null;


                if (productForm) {
                    productForm.reset();
                }


                if (productFormTitle) {

                    productFormTitle.textContent =
                        "Yeni Ürün Ekle";

                }


                if (saveProductButton) {

                    saveProductButton.textContent =
                        "Ürünü Kaydet";

                }


                formMesajiTemizle();


                if (productFormBox) {

                    productFormBox.style.display =
                        "block";

                    productFormBox.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });
                }

            }
        );

    }


    /*
     * VAZGEÇ
     */

    if (cancelProductButton) {

        cancelProductButton.addEventListener(
            "click",
            function () {

                duzenlenenUrunId =
                    null;


                if (productForm) {
                    productForm.reset();
                }


                if (productFormTitle) {

                    productFormTitle.textContent =
                        "Yeni Ürün Ekle";

                }


                if (saveProductButton) {

                    saveProductButton.textContent =
                        "Ürünü Kaydet";

                }


                formMesajiTemizle();


                if (productFormBox) {

                    productFormBox.style.display =
                        "none";

                }

            }
        );

    }


    /*
     * ÜRÜN FORMU
     */

    if (productForm) {

        productForm.addEventListener(
            "submit",
            async function (e) {

                e.preventDefault();

                await urunKaydet();

            }
        );

    }

}


/* ==========================================================
   ÜRÜN KAYDET
========================================================== */

async function urunKaydet() {

    if (!supabaseClient) {

        formMesajiGoster(
            "Supabase bağlantısı kurulamadı.",
            false
        );

        return;
    }


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


    const saveButton =
        document.getElementById(
            "saveProductButton"
        );


    if (!nameElement) {
        return;
    }


    const name =
        nameElement.value.trim();


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


    const active =
        activeElement
            ? activeElement.value === "true"
            : true;


    /* ======================================================
       KONTROLLER
    ====================================================== */

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
            "Lütfen kategori seçin.",
            false
        );

        if (categoryElement) {
            categoryElement.focus();
        }

        return;
    }


    let price = null;


    if (priceText !== "") {

        price =
            Number(
                priceText.replace(
                    ",",
                    "."
                )
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


    /*
     * Butonu kilitle.
     */

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

            active:
                active

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

                throw error;
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
                            ...urunData,
                            image_url: null
                        }
                    ])
                    .select()
                    .single();


            if (error) {

                throw error;
            }


            console.log(
                "Ürün eklendi:",
                data
            );


            formMesajiGoster(
                "Ürün başarıyla eklendi.",
                true
            );

        }


        /*
         * Formu temizle.
         */

        const productForm =
            document.getElementById(
                "productForm"
            );


        if (productForm) {

            productForm.reset();

        }


        duzenlenenUrunId =
            null;


        const productFormTitle =
            document.getElementById(
                "productFormTitle"
            );


        if (productFormTitle) {

            productFormTitle.textContent =
                "Yeni Ürün Ekle";

        }


        if (saveButton) {

            saveButton.textContent =
                "Ürünü Kaydet";

        }


        /*
         * Listeyi ve dashboard'u yenile.
         */

        await urunleriYukle();

        await dashboardGuncelle();


    } catch (error) {

        console.error(
            "Ürün kayıt hatası:",
            error
        );


        formMesajiGoster(
            "Ürün kaydedilemedi: " +
            (error.message || error),
            false
        );

    } finally {

        if (saveButton) {

            saveButton.disabled =
                false;

            saveButton.textContent =
                duzenlenenUrunId
                    ? "Güncelle"
                    : "Ürünü Kaydet";

        }

    }

}


/* ==========================================================
   ÜRÜNLERİ YÜKLE
========================================================== */

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
        `
        <div class="empty-state">
            <p>Ürünler yükleniyor...</p>
        </div>
        `;


    try {

        const {
            data,
            error
        } =
            await supabaseClient
                .from("products")
                .select("*");


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


        if (products.length === 0) {

            productList.innerHTML =
                `
                <div class="empty-state">

                    <div class="empty-icon">
                        ▤
                    </div>

                    <h2>
                        Henüz ürün yok
                    </h2>

                    <p>
                        "+ Yeni Ürün" butonunu kullanarak ilk ürünü ekleyebilirsiniz.
                    </p>

                </div>
                `;

            return;
        }


        productList.innerHTML =
            products
                .map(function (product) {

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
                            background:#111;
                        "
                    >

                        <div style="flex:1;">

                            <h3
                                style="
                                    margin:0 0 8px 0;
                                    color:#D4AF37;
                                "
                            >
                                ${escapeHTML(
                                    product.name || "-"
                                )}
                            </h3>

                            <p style="margin:5px 0;">
                                <strong>Kategori:</strong>
                                ${escapeHTML(
                                    product.category || "-"
                                )}
                            </p>

                            <p style="margin:5px 0;">
                                <strong>Ölçü:</strong>
                                ${escapeHTML(
                                    product.size || "-"
                                )}
                            </p>

                            <p style="margin:5px 0;">
                                <strong>Fiyat:</strong>
                                ${
                                    product.price !== null &&
                                    product.price !== undefined
                                        ? Number(
                                            product.price
                                          ).toLocaleString(
                                            "tr-TR",
                                            {
                                                minimumFractionDigits: 0,
                                                maximumFractionDigits: 2
                                            }
                                          ) + " TL"
                                        : "-"
                                }
                            </p>

                            <p style="margin:5px 0;">
                                <strong>Durum:</strong>

                                <span
                                    style="
                                        color:${
                                            product.active
                                                ? "#55b86a"
                                                : "#d9534f"
                                        };
                                    "
                                >
                                    ${
                                        product.active
                                            ? "Aktif"
                                            : "Pasif"
                                    }
                                </span>

                            </p>

                        </div>


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
                                    color:#D4AF37 !important;
                                    -webkit-text-fill-color:#D4AF37 !important;
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
                                    color:#fff !important;
                                    border:1px solid #d9534f !important;
                                    background:#8b1e1e !important;
                                    border-radius:6px;
                                "
                            >
                                Sil
                            </button>

                        </div>

                    </div>
                    `;

                })
                .join("");


        /*
         * DÜZENLE
         */

        productList
            .querySelectorAll(
                ".edit-product-button"
            )
            .forEach(function (button) {

                button.addEventListener(
                    "click",
                    async function () {

                        const id =
                            button.getAttribute(
                                "data-id"
                            );

                        await urunDuzenle(
                            id
                        );

                    }
                );

            });


        /*
         * SİL
         */

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


                        const onay =
                            confirm(
                                "Bu ürünü silmek istediğinize emin misiniz?"
                            );


                        if (!onay) {
                            return;
                        }


                        await urunSil(
                            id
                        );

                    }
                );

            });


    } catch (error) {

        console.error(
            "Ürünler alınamadı:",
            error
        );


        productList.innerHTML =
            `
            <div class="empty-state">

                <div class="empty-icon">
                    !
                </div>

                <h2>
                    Ürünler yüklenemedi
                </h2>

                <p>
                    ${escapeHTML(
                        error.message ||
                        "Bilinmeyen hata"
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


/* ==========================================================
   ÜRÜN DÜZENLE
========================================================== */

async function urunDuzenle(id) {

    if (!id) {
        return;
    }


    try {

        const {
            data: product,
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


        if (!product) {

            alert(
                "Ürün bulunamadı."
            );

            return;
        }


        duzenlenenUrunId =
            id;


        const productFormBox =
            document.getElementById(
                "productFormBox"
            );


        const productFormTitle =
            document.getElementById(
                "productFormTitle"
            );


        const saveButton =
            document.getElementById(
                "saveProductButton"
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
                product.active
                    ? "true"
                    : "false";

        }


        if (productFormTitle) {

            productFormTitle.textContent =
                "Ürünü Düzenle";

        }


        if (saveButton) {

            saveButton.textContent =
                "Güncelle";

        }


        formMesajiTemizle();


        if (productFormBox) {

            productFormBox.style.display =
                "block";

            productFormBox.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }

    } catch (error) {

        console.error(
            "Ürün alınamadı:",
            error
        );


        alert(
            "Ürün bilgileri alınamadı:\n\n" +
            error.message
        );

    }

}


/* ==========================================================
   ÜRÜN SİL
========================================================== */

async function urunSil(id) {

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
            "Ürün başarıyla silindi."
        );


        await urunleriYukle();

        await dashboardGuncelle();


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


/* ==========================================================
   FORM MESAJI
========================================================== */

function formMesajiGoster(
    message,
    success
) {

    const element =
        document.getElementById(
            "productFormMessage"
        );


    if (!element) {
        return;
    }


    element.textContent =
        message;


    element.style.display =
        "block";


    element.style.border =
        success
            ? "1px solid #246b36"
            : "1px solid #d9534f";


    element.style.color =
        success
            ? "#8ee6a1"
            : "#ff8a8a";


    element.style.background =
        success
            ? "rgba(36,107,54,.15)"
            : "rgba(217,83,79,.15)";

}


function formMesajiTemizle() {

    const element =
        document.getElementById(
            "productFormMessage"
        );


    if (!element) {
        return;
    }


    element.textContent =
        "";

    element.style.display =
        "none";

}


/* ==========================================================
   DASHBOARD
========================================================== */

async function dashboardGuncelle() {

    if (!supabaseClient) {
        return;
    }


    try {

        /*
         * TOPLAM ÜRÜN
         */

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


        if (
            !totalError
        ) {

            const totalElement =
                document.getElementById(
                    "totalProducts"
                );


            if (totalElement) {

                totalElement.textContent =
                    totalCount ?? 0;

            }

        }


        /*
         * AKTİF ÜRÜN
         */

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
                    "active",
                    true
                );


        if (
            !activeError
        ) {

            const activeElement =
                document.getElementById(
                    "activeProducts"
                );


            if (activeElement) {

                activeElement.textContent =
                    activeCount ?? 0;

            }

        }


        /*
         * TOPLAM RESİM
         */

        const {
            count: imageCount,
            error: imageError
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


        if (
            !imageError
        ) {

            const imageElement =
                document.getElementById(
                    "totalImages"
                );


            if (imageElement) {

                imageElement.textContent =
                    imageCount ?? 0;

            }

        }


        /*
         * STORAGE
         *
         * Supabase JS ile storage kullanım boyutu
         * doğrudan alınamadığı için şimdilik güvenli
         * şekilde göstergeyi koruyoruz.
         */

        const storageElement =
            document.getElementById(
                "storageUsage"
            );


        if (storageElement) {

            storageElement.textContent =
                "Aktif";

        }

    } catch (error) {

        console.error(
            "Dashboard hatası:",
            error
        );

    }

}


/* ==========================================================
   RESİM SİSTEMİ
========================================================== */

function resimSisteminiBaslat() {

    const imageFile =
        document.getElementById(
            "imageFile"
        );


    const imageCategory =
        document.getElementById(
            "imageCategory"
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


    /*
     * RESİM SEÇİLİNCE ÖNİZLEME
     */

    if (
        imageFile &&
        imagePreview
    ) {

        imageFile.addEventListener(
            "change",
            function () {

                const file =
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

                    imageMesajiGoster(
                        "Lütfen geçerli bir resim dosyası seçin.",
                        false
                    );

                    imageFile.value =
                        "";

                    return;
                }


                const reader =
                    new FileReader();


                reader.onload =
                    function (e) {

                        imagePreview.src =
                            e.target.result;


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


    /*
     * RESİM YÜKLE
     */

    if (uploadImageButton) {

        uploadImageButton.addEventListener(
            "click",
            async function () {

                await resimYukle();

            }
        );

    }

}


/* ==========================================================
   RESİM YÜKLE
========================================================== */

async function resimYukle() {

    const imageFile =
        document.getElementById(
            "imageFile"
        );


    const imageCategory =
        document.getElementById(
            "imageCategory"
        );


    const uploadButton =
        document.getElementById(
            "uploadImageButton"
        );


    if (!imageFile) {
        return;
    }


    const file =
        imageFile.files[0];


    if (!file) {

        imageMesajiGoster(
            "Lütfen bir resim seçin.",
            false
        );

        return;
    }


    const category =
        imageCategory
            ? imageCategory.value.trim()
            : "";


    if (!category) {

        imageMesajiGoster(
            "Lütfen resim kategorisi seçin.",
            false
        );

        if (imageCategory) {
            imageCategory.focus();
        }

        return;
    }


    /*
     * Dosya tipi
     */

    const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/jpg"
    ];


    if (
        !allowedTypes.includes(
            file.type
        )
    ) {

        imageMesajiGoster(
            "Sadece JPG, PNG veya WEBP resim yükleyebilirsiniz.",
            false
        );

        return;
    }


    /*
     * Maksimum 10 MB
     */

    if (
        file.size >
        10 * 1024 * 1024
    ) {

        imageMesajiGoster(
            "Resim boyutu en fazla 10 MB olabilir.",
            false
        );

        return;
    }


    if (uploadButton) {

        uploadButton.disabled =
            true;

        uploadButton.textContent =
            "Yükleniyor...";

    }


    try {

        /*
         * Güvenli dosya adı
         */

        const extension =
            dosyaUzantisi(
                file.name
            );


        const temizKategori =
            category
                .toLowerCase()
                .replace(
                    /[^a-z0-9çğıöşü]+/gi,
                    "-"
                )
                .replace(
                    /-+/g,
                    "-"
                )
                .replace(
                    /^-|$/g,
                    ""
                );


        const randomPart =
            Math.random()
                .toString(36)
                .substring(
                    2,
                    10
                );


        const filePath =
            temizKategori +
            "/" +
            Date.now() +
            "-" +
            randomPart +
            "." +
            extension;


        console.log(
            "Resim yükleniyor:",
            filePath
        );


        /*
         * STORAGE
         */

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


        /*
         * DATABASE
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

            /*
             * Database kayıt olmazsa
             * storage dosyasını da sil.
             */

            await supabaseClient
                .storage
                .from(
                    "category-images"
                )
                .remove([
                    filePath
                ]);


            throw databaseError;
        }


        console.log(
            "Resim başarıyla yüklendi:",
            imageRecord
        );


        imageMesajiGoster(
            "Resim başarıyla yüklendi.",
            true
        );


        /*
         * Form temizle
         */

        imageFile.value =
            "";


        if (imageCategory) {

            imageCategory.value =
                "";

        }


        const imagePreviewBox =
            document.getElementById(
                "imagePreviewBox"
            );


        const imagePreview =
            document.getElementById(
                "imagePreview"
            );


        if (imagePreviewBox) {

            imagePreviewBox.style.display =
                "none";

        }


        if (imagePreview) {

            imagePreview.src =
                "";

        }


        /*
         * Liste + dashboard
         */

        await resimleriYukle();

        await dashboardGuncelle();


    } catch (error) {

        console.error(
            "Resim yükleme hatası:",
            error
        );


        imageMesajiGoster(
            "Resim yüklenemedi: " +
            (error.message || error),
            false
        );

    } finally {

        if (uploadButton) {

            uploadButton.disabled =
                false;

            uploadButton.textContent =
                "Resmi Yükle";

        }

    }

}


/* ==========================================================
   RESİMLERİ YÜKLE
========================================================== */

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
        `
        <div class="empty-state">
            <p>Resimler yükleniyor...</p>
        </div>
        `;


    try {

        const {
            data,
            error
        } =
            await supabaseClient
                .from(
                    "category_images"
                )
                .select("*");


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


        if (images.length === 0) {

            imageList.innerHTML =
                `
                <div class="empty-state">

                    <div class="empty-icon">
                        ▧
                    </div>

                    <h2>
                        Henüz resim yok
                    </h2>

                    <p>
                        Yeni bir resim yükleyebilirsiniz.
                    </p>

                </div>
                `;

            return;
        }


        imageList.innerHTML =
            images
                .map(function (image) {

                    let url =
                        image.image_url ||
                        "";


                    /*
                     * image_url yoksa storage'dan
                     * public URL oluştur.
                     */

                    if (
                        !url &&
                        image.image_path
                    ) {

                        const {
                            data:
                                publicData
                        } =
                            supabaseClient
                                .storage
                                .from(
                                    "category-images"
                                )
                                .getPublicUrl(
                                    image.image_path
                                );


                        if (
                            publicData &&
                            publicData.publicUrl
                        ) {

                            url =
                                publicData.publicUrl;

                        }

                    }


                    return `
                    <div
                        class="image-card"
                        data-image-id="${escapeHTML(image.id)}"
                        style="
                            border:1px solid rgba(212,175,55,.25);
                            border-radius:10px;
                            padding:15px;
                            background:#111;
                        "
                    >

                        <div
                            style="
                                width:100%;
                                height:220px;
                                display:flex;
                                align-items:center;
                                justify-content:center;
                                background:#050505;
                                border-radius:8px;
                                overflow:hidden;
                                margin-bottom:12px;
                            "
                        >

                            ${
                                url
                                    ? `
                                    <img
                                        src="${escapeHTML(url)}"
                                        alt="${escapeHTML(
                                            image.category ||
                                            "Sur Halı"
                                        )}"
                                        style="
                                            width:100%;
                                            height:100%;
                                            object-fit:contain;
                                        "
                                    >
                                    `
                                    : `
                                    <span>
                                        Resim bulunamadı
                                    </span>
                                    `
                            }

                        </div>


                        <div>

                            <strong
                                style="
                                    color:#D4AF37;
                                    display:block;
                                    margin-bottom:6px;
                                "
                            >
                                ${escapeHTML(
                                    image.category ||
                                    "-"
                                )}
                            </strong>


                            <small
                                style="
                                    display:block;
                                    word-break:break-all;
                                    opacity:.7;
                                    margin-bottom:12px;
                                "
                            >
                                ${escapeHTML(
                                    image.image_path ||
                                    ""
                                )}
                            </small>


                            <button
                                type="button"
                                class="delete-image-button"
                                data-id="${escapeHTML(image.id)}"
                                data-path="${escapeHTML(
                                    image.image_path ||
                                    ""
                                )}"
                                style="
                                    width:100%;
                                    padding:9px;
                                    cursor:pointer;
                                    color:#fff !important;
                                    border:1px solid #d9534f !important;
                                    background:#8b1e1e !important;
                                    border-radius:6px;
                                "
                            >
                                Resmi Sil
                            </button>

                        </div>

                    </div>
                    `;

                })
                .join("");


        /*
         * SİL BUTONLARI
         */

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


                        await resimSil(
                            id,
                            path
                        );

                    }
                );

            });


    } catch (error) {

        console.error(
            "Resimler alınamadı:",
            error
        );


        imageList.innerHTML =
            `
            <div class="empty-state">

                <div class="empty-icon">
                    !
                </div>

                <h2>
                    Resimler yüklenemedi
                </h2>

                <p>
                    ${escapeHTML(
                        error.message ||
                        "Bilinmeyen hata"
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


/* ==========================================================
   RESİM SİL
========================================================== */

async function resimSil(
    id,
    imagePath
) {

    try {

        /*
         * Önce Storage.
         */

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
                    .remove([
                        imagePath
                    ]);


            if (storageError) {

                console.warn(
                    "Storage silme uyarısı:",
                    storageError
                );

            }

        }


        /*
         * Sonra database.
         */

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
            "Resim başarıyla silindi."
        );


        await resimleriYukle();

        await dashboardGuncelle();


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


/* ==========================================================
   RESİM MESAJI
========================================================== */

function imageMesajiGoster(
    message,
    success
) {

    const element =
        document.getElementById(
            "imageUploadMessage"
        );


    if (!element) {
        return;
    }


    element.textContent =
        message;


    element.style.display =
        "block";


    element.style.border =
        success
            ? "1px solid #246b36"
            : "1px solid #d9534f";


    element.style.color =
        success
            ? "#8ee6a1"
            : "#ff8a8a";


    element.style.background =
        success
            ? "rgba(36,107,54,.15)"
            : "rgba(217,83,79,.15)";

}


/* ==========================================================
   ÇIKIŞ
========================================================== */

function cikisSisteminiBaslat() {

    const logoutButton =
        document.getElementById(
            "logoutButton"
        );


    if (!logoutButton) {
        return;
    }


    logoutButton.addEventListener(
        "click",
        async function () {

            const onay =
                confirm(
                    "Yönetim panelinden çıkış yapmak istiyor musunuz?"
                );


            if (!onay) {
                return;
            }


            try {

                await supabaseClient.auth.signOut();

            } catch (error) {

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


/* ==========================================================
   DOSYA UZANTISI
========================================================== */

function dosyaUzantisi(name) {

    if (!name) {
        return "jpg";
    }


    const dotIndex =
        name.lastIndexOf(".");


    if (
        dotIndex === -1
    ) {

        return "jpg";
    }


    return name
        .substring(
            dotIndex + 1
        )
        .toLowerCase();

}


/* ==========================================================
   HTML GÜVENLİK
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
   GLOBAL ERİŞİM
========================================================== */

window.supabaseClient =
    supabaseClient;

window.adminPanelBaslat =
    adminPanelBaslat;

window.urunleriYukle =
    urunleriYukle;

window.resimleriYukle =
    resimleriYukle;

window.dashboardGuncelle =
    dashboardGuncelle;


console.log(
    "Sur Halı admin.js dosyası yüklendi."
);
