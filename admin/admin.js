/* ==========================================================
SUR HALI
YÖNETİM PANELİ - ADMIN.JS
========================================================== */

console.clear();

console.log("Sur Halı Yönetim Paneli başlatılıyor...");

/* ==========================================================
SUPABASE CLIENT
========================================================== */

function getSupabaseClient() {

```
if (typeof supabaseClient !== "undefined") {
    return supabaseClient;
}

if (typeof supabase !== "undefined") {
    return supabase;
}

console.error("Supabase bağlantısı bulunamadı.");

return null;
```

}

/* ==========================================================
SAYFA YÜKLENDİ
========================================================== */

document.addEventListener("DOMContentLoaded", () => {

```
/* GİRİŞ SAYFASI */

const loginForm =
    document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        girisYap
    );

    return;
}


/* ADMİN PANELİ */

const adminContainer =
    document.querySelector(".admin-container");

if (adminContainer) {

    adminPanelBaslat();

}
```

});

/* ==========================================================
GİRİŞ
========================================================== */

async function girisYap(e) {

```
e.preventDefault();

const email =
    document
        .getElementById("email")
        .value
        .trim();

const password =
    document
        .getElementById("password")
        .value;

const mesaj =
    document.getElementById("loginMessage");

mesaj.textContent = "";


const client = getSupabaseClient();

if (!client) {

    mesaj.textContent =
        "Supabase bağlantısı kurulamadı.";

    return;
}


try {

    console.log("Supabase giriş deneniyor...");


    const { data, error } =
        await client.auth.signInWithPassword({

            email: email,

            password: password

        });


    console.log(
        "Supabase cevap:",
        data,
        error
    );


    if (error) {

        console.error(
            "SUPABASE GİRİŞ HATASI:",
            error
        );

        mesaj.textContent =
            error.message;

        return;
    }


    console.log(
        "Giriş başarılı:",
        data.user
    );


    window.location.href =
        "admin.html";

}

catch (err) {

    console.error(
        "BEKLENMEYEN HATA:",
        err
    );

    mesaj.textContent =
        err.message ||
        "Beklenmeyen bir hata oluştu.";

}
```

}

/* ==========================================================
ADMİN PANELİ BAŞLAT
========================================================== */

async function adminPanelBaslat() {

```
console.log(
    "Admin panel başlatılıyor..."
);


const client =
    getSupabaseClient();


if (!client) {

    console.error(
        "Supabase bağlantısı bulunamadı."
    );

    return;
}


/* OTURUM KONTROLÜ */

const {
    data: {
        session
    }
} =
    await client.auth.getSession();


if (!session) {

    console.warn(
        "Aktif oturum bulunamadı."
    );

    window.location.href =
        "admin-login.html";

    return;
}


console.log(
    "Aktif kullanıcı:",
    session.user.email
);


/* MENÜ */

menuSisteminiBaslat();


/* ÇIKIŞ */

cikisSisteminiBaslat();


/* ÜRÜNLER */

urunSisteminiBaslat();


/* DASHBOARD */

await dashboardVerileriniYukle();
```

}

/* ==========================================================
MENÜ SİSTEMİ
========================================================== */

function menuSisteminiBaslat() {

```
const menuItems =
    document.querySelectorAll(
        ".menu-item[data-page]"
    );


const pages =
    document.querySelectorAll(
        ".page"
    );


menuItems.forEach(item => {

    item.addEventListener(
        "click",
        () => {

            const pageId =
                item.dataset.page;


            if (!pageId) {
                return;
            }


            /* TÜM SAYFALARI GİZLE */

            pages.forEach(page => {

                page.classList.remove(
                    "active-page"
                );

            });


            /* SEÇİLEN SAYFAYI AÇ */

            const targetPage =
                document.getElementById(
                    pageId
                );


            if (targetPage) {

                targetPage.classList.add(
                    "active-page"
                );

            }


            /* AKTİF MENÜ */

            menuItems.forEach(menu => {

                menu.classList.remove(
                    "active"
                );

            });


            item.classList.add(
                "active"
            );


            /* ÜRÜNLER SAYFASI AÇILDIYSA */

            if (
                pageId === "productsPage"
            ) {

                urunleriYukle();

            }

        }
    );

});
```

}

/* ==========================================================
ÇIKIŞ
========================================================== */

function cikisSisteminiBaslat() {

```
const logoutButton =
    document.getElementById(
        "logoutButton"
    );


if (!logoutButton) {
    return;
}


logoutButton.addEventListener(
    "click",
    async () => {

        const client =
            getSupabaseClient();


        if (!client) {
            return;
        }


        await client.auth.signOut();


        window.location.href =
            "admin-login.html";

    }
);
```

}

/* ==========================================================
ÜRÜN SİSTEMİ
========================================================== */

function urunSisteminiBaslat() {

```
const newProductButton =
    document.getElementById(
        "newProductButton"
    );


const saveProductButton =
    document.getElementById(
        "saveProductButton"
    );


const cancelProductButton =
    document.getElementById(
        "cancelProductButton"
    );


const closeModal =
    document.getElementById(
        "closeModal"
    );


if (newProductButton) {

    newProductButton.addEventListener(
        "click",
        () => {

            urunFormunuTemizle();

            modalAc();

        }
    );

}


if (saveProductButton) {

    saveProductButton.addEventListener(
        "click",
        urunKaydet
    );

}


if (cancelProductButton) {

    cancelProductButton.addEventListener(
        "click",
        modalKapat
    );

}


if (closeModal) {

    closeModal.addEventListener(
        "click",
        modalKapat
    );

}


/* İLK ÜRÜN LİSTESİ */

urunleriYukle();
```

}

/* ==========================================================
ÜRÜNLERİ SUPABASE'DEN GETİR
========================================================== */

async function urunleriYukle() {

```
const tableBody =
    document.getElementById(
        "productTableBody"
    );


if (!tableBody) {
    return;
}


const client =
    getSupabaseClient();


if (!client) {
    return;
}


tableBody.innerHTML = `

    <tr>

        <td
            colspan="6"
            class="table-empty"
        >
            Ürünler yükleniyor...
        </td>

    </tr>

`;


try {

    const {
        data,
        error
    } =
        await client
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


        tableBody.innerHTML = `

            <tr>

                <td
                    colspan="6"
                    class="table-empty"
                >
                    Ürünler yüklenirken hata oluştu.
                </td>

            </tr>

        `;

        return;
    }


    if (!data || data.length === 0) {

        tableBody.innerHTML = `

            <tr>

                <td
                    colspan="6"
                    class="table-empty"
                >
                    Henüz ürün eklenmemiş.
                </td>

            </tr>

        `;

        dashboardVerileriniYukle();

        return;
    }


    tableBody.innerHTML = "";


    data.forEach(urun => {

        const row =
            document.createElement("tr");


        const durum =
            urun.is_active
                ? "Aktif"
                : "Pasif";


        row.innerHTML = `

            <td>
                ${guvenliMetin(urun.name)}
            </td>

            <td>
                ${guvenliMetin(urun.category)}
            </td>

            <td>
                ${guvenliMetin(urun.size)}
            </td>

            <td>
                ${fiyatFormatla(urun.price)}
            </td>

            <td>
                <span
                    class="product-status ${
                        urun.is_active
                            ? "status-active"
                            : "status-passive"
                    }"
                >
                    ${durum}
                </span>
            </td>

            <td>

                <button
                    type="button"
                    class="table-action edit-action"
                    onclick="urunDuzenle('${urun.id}')"
                >
                    Düzenle
                </button>

                <button
                    type="button"
                    class="table-action toggle-action"
                    onclick="urunDurumDegistir(
                        '${urun.id}',
                        ${urun.is_active}
                    )"
                >
                    ${
                        urun.is_active
                            ? "Pasifleştir"
                            : "Aktifleştir"
                    }
                </button>

                <button
                    type="button"
                    class="table-action delete-action"
                    onclick="urunSil('${urun.id}')"
                >
                    Sil
                </button>

            </td>

        `;


        tableBody.appendChild(row);

    });


    await dashboardVerileriniYukle();

}

catch (err) {

    console.error(
        "Ürün listesi hatası:",
        err
    );

}
```

}

/* ==========================================================
YENİ ÜRÜN / ÜRÜN DÜZENLEME
========================================================== */

let duzenlenenUrunId = null;

/* ==========================================================
ÜRÜN KAYDET
========================================================== */

async function urunKaydet() {

```
const client =
    getSupabaseClient();


if (!client) {
    return;
}


const name =
    document
        .getElementById("productName")
        .value
        .trim();


const category =
    document
        .getElementById("productCategory")
        .value
        .trim();


const size =
    document
        .getElementById("productSize")
        .value
        .trim();


const price =
    document
        .getElementById("productPrice")
        .value;


const description =
    document
        .getElementById("productDescription")
        .value
        .trim();


if (!name) {

    alert(
        "Lütfen ürün adını girin."
    );

    return;
}


if (!category) {

    alert(
        "Lütfen kategori seçin."
    );

    return;
}


if (!price) {

    alert(
        "Lütfen ürün fiyatını girin."
    );

    return;
}


const productData = {

    name: name,

    category: category,

    size: size || null,

    price: Number(price),

    description:
        description || null

};


try {

    let result;


    /* DÜZENLEME */

    if (duzenlenenUrunId) {

        result =
            await client
                .from("products")
                .update(productData)
                .eq(
                    "id",
                    duzenlenenUrunId
                );

    }


    /* YENİ ÜRÜN */

    else {

        result =
            await client
                .from("products")
                .insert([
                    {

                        ...productData,

                        is_active: true

                    }
                ]);

    }


    if (result.error) {

        console.error(
            "Ürün kaydetme hatası:",
            result.error
        );


        alert(
            "Ürün kaydedilemedi: " +
            result.error.message
        );

        return;
    }


    alert(
        duzenlenenUrunId
            ? "Ürün güncellendi."
            : "Ürün başarıyla eklendi."
    );


    modalKapat();


    urunFormunuTemizle();


    await urunleriYukle();

}

catch (err) {

    console.error(
        "Ürün kayıt hatası:",
        err
    );


    alert(
        "Beklenmeyen bir hata oluştu."
    );

}
```

}

/* ==========================================================
ÜRÜN DÜZENLE
========================================================== */

async function urunDuzenle(id) {

```
const client =
    getSupabaseClient();


if (!client) {
    return;
}


try {

    const {
        data,
        error
    } =
        await client
            .from("products")
            .select("*")
            .eq("id", id)
            .single();


    if (error) {

        console.error(
            "Ürün alınamadı:",
            error
        );

        alert(
            "Ürün bilgileri alınamadı."
        );

        return;
    }


    duzenlenenUrunId =
        id;


    document.getElementById(
        "productModalTitle"
    ).textContent =
        "Ürünü Düzenle";


    document.getElementById(
        "productName"
    ).value =
        data.name || "";


    document.getElementById(
        "productCategory"
    ).value =
        data.category || "";


    document.getElementById(
        "productSize"
    ).value =
        data.size || "";


    document.getElementById(
        "productPrice"
    ).value =
        data.price || "";


    document.getElementById(
        "productDescription"
    ).value =
        data.description || "";


    modalAc();

}

catch (err) {

    console.error(
        "Düzenleme hatası:",
        err
    );

}
```

}

/* ==========================================================
ÜRÜN SİL
========================================================== */

async function urunSil(id) {

```
const onay =
    confirm(
        "Bu ürünü silmek istediğinize emin misiniz?"
    );


if (!onay) {
    return;
}


const client =
    getSupabaseClient();


if (!client) {
    return;
}


try {

    const {
        error
    } =
        await client
            .from("products")
            .delete()
            .eq("id", id);


    if (error) {

        console.error(
            "Ürün silme hatası:",
            error
        );


        alert(
            "Ürün silinemedi: " +
            error.message
        );

        return;
    }


    alert(
        "Ürün silindi."
    );


    await urunleriYukle();

}

catch (err) {

    console.error(
        "Silme hatası:",
        err
    );

}
```

}

/* ==========================================================
AKTİF / PASİF
========================================================== */

async function urunDurumDegistir(
id,
mevcutDurum
) {

```
const client =
    getSupabaseClient();


if (!client) {
    return;
}


try {

    const {
        error
    } =
        await client
            .from("products")
            .update({

                is_active:
                    !mevcutDurum

            })
            .eq(
                "id",
                id
            );


    if (error) {

        console.error(
            "Durum değiştirme hatası:",
            error
        );

        alert(
            "Ürün durumu değiştirilemedi."
        );

        return;
    }


    await urunleriYukle();

}

catch (err) {

    console.error(
        "Durum hatası:",
        err
    );

}
```

}

/* ==========================================================
MODAL AÇ
========================================================== */

function modalAc() {

```
const modal =
    document.getElementById(
        "productModal"
    );


if (!modal) {
    return;
}


modal.classList.add(
    "active"
);
```

}

/* ==========================================================
MODAL KAPAT
========================================================== */

function modalKapat() {

```
const modal =
    document.getElementById(
        "productModal"
    );


if (!modal) {
    return;
}


modal.classList.remove(
    "active"
);


duzenlenenUrunId = null;


const title =
    document.getElementById(
        "productModalTitle"
    );


if (title) {

    title.textContent =
        "Yeni Ürün";

}
```

}

/* ==========================================================
ÜRÜN FORMUNU TEMİZLE
========================================================== */

function urunFormunuTemizle() {

```
const name =
    document.getElementById(
        "productName"
    );

const category =
    document.getElementById(
        "productCategory"
    );

const size =
    document.getElementById(
        "productSize"
    );

const price =
    document.getElementById(
        "productPrice"
    );

const description =
    document.getElementById(
        "productDescription"
    );

const image =
    document.getElementById(
        "productImage"
    );


if (name) {
    name.value = "";
}

if (category) {
    category.value = "";
}

if (size) {
    size.value = "";
}

if (price) {
    price.value = "";
}

if (description) {
    description.value = "";
}

if (image) {
    image.value = "";
}


duzenlenenUrunId = null;


const title =
    document.getElementById(
        "productModalTitle"
    );


if (title) {

    title.textContent =
        "Yeni Ürün";

}
```

}

/* ==========================================================
DASHBOARD VERİLERİ
========================================================== */

async function dashboardVerileriniYukle() {

```
const client =
    getSupabaseClient();


if (!client) {
    return;
}


try {

    const {
        data,
        error
    } =
        await client
            .from("products")
            .select(
                "id, is_active"
            );


    if (error) {

        console.error(
            "Dashboard verileri alınamadı:",
            error
        );

        return;
    }


    const total =
        data
            ? data.length
            : 0;


    const active =
        data
            ? data.filter(
                item =>
                    item.is_active === true
            ).length
            : 0;


    const totalProducts =
        document.getElementById(
            "totalProducts"
        );


    const activeProducts =
        document.getElementById(
            "activeProducts"
        );


    if (totalProducts) {

        totalProducts.textContent =
            total;

    }


    if (activeProducts) {

        activeProducts.textContent =
            active;

    }


    /* ŞİMDİLİK */

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

catch (err) {

    console.error(
        "Dashboard hatası:",
        err
    );

}
```

}

/* ==========================================================
GÜVENLİ METİN
========================================================== */

function guvenliMetin(value) {

```
if (
    value === null ||
    value === undefined
) {

    return "-";

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
```

}

/* ==========================================================
FİYAT FORMATLA
========================================================== */

function fiyatFormatla(value) {

```
if (
    value === null ||
    value === undefined ||
    value === ""
) {

    return "-";

}


return Number(value)
    .toLocaleString(
        "tr-TR",
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }
    ) + " TL";
```

}

/* ==========================================================
GLOBAL FONKSİYONLAR
HTML onclick tarafından kullanılabilmeleri için
========================================================== */

window.urunDuzenle =
urunDuzenle;

window.urunSil =
urunSil;

window.urunDurumDegistir =
urunDurumDegistir;

```
```
