console.clear();

console.log("Sur Halı Admin başlatılıyor...");

/* ==========================================================
SAYFA YÜKLENDİ
========================================================== */

document.addEventListener(
"DOMContentLoaded",
function () {

```
    console.log("DOM hazır.");


    /* ==================================================
       GİRİŞ SAYFASI
    ================================================== */

    const loginForm =
        document.getElementById("loginForm");


    if (loginForm) {

        console.log(
            "Giriş formu bulundu."
        );


        loginForm.addEventListener(
            "submit",
            girisYap
        );


        return;

    }


    /* ==================================================
       ADMİN PANELİ
    ================================================== */

    const adminContainer =
        document.querySelector(
            ".admin-container"
        );


    if (adminContainer) {

        console.log(
            "Admin paneli bulundu."
        );


        adminPanelBaslat();

    }

}
```

);

/* ==========================================================
GİRİŞ
========================================================== */

async function girisYap(e) {

```
e.preventDefault();


console.log(
    "Giriş butonuna basıldı."
);


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
    document.getElementById(
        "loginMessage"
    );


mesaj.textContent = "";


if (
    typeof supabaseClient ===
    "undefined"
) {

    console.error(
        "supabaseClient bulunamadı."
    );


    mesaj.textContent =
        "Supabase bağlantısı kurulamadı.";


    return;

}


try {

    console.log(
        "Supabase giriş deneniyor..."
    );


    const {
        data,
        error
    } =
        await supabaseClient.auth
            .signInWithPassword({

                email: email,

                password: password

            });


    console.log(
        "Supabase cevabı:",
        data,
        error
    );


    if (error) {

        console.error(
            "Giriş hatası:",
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
        "Beklenmeyen hata:",
        err
    );


    mesaj.textContent =
        err.message ||
        "Beklenmeyen bir hata oluştu.";

}
```

}

/* ==========================================================
ADMİN PANELİ
========================================================== */

async function adminPanelBaslat() {

```
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

const {
    data: {
        session
    }
} =
    await supabaseClient.auth
        .getSession();


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


/* ======================================================
   MENÜLER
====================================================== */

const menuItems =
    document.querySelectorAll(
        ".menu-item[data-page]"
    );


const pages =
    document.querySelectorAll(
        ".page"
    );


menuItems.forEach(
    function (item) {

        item.addEventListener(
            "click",
            function () {

                const pageId =
                    item.dataset.page;


                /* TÜM SAYFALARI GİZLE */

                pages.forEach(
                    function (page) {

                        page.classList.remove(
                            "active-page"
                        );

                    }
                );


                /* SEÇİLEN SAYFAYI GÖSTER */

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

                menuItems.forEach(
                    function (menu) {

                        menu.classList.remove(
                            "active"
                        );

                    }
                );


                item.classList.add(
                    "active"
                );

            }
        );

    }
);


/* ======================================================
   YENİ ÜRÜN BUTONU
====================================================== */

const newProductButton =
    document.getElementById(
        "newProductButton"
    );


const productFormBox =
    document.getElementById(
        "productFormBox"
    );


const cancelProductButton =
    document.getElementById(
        "cancelProductButton"
    );


console.log(
    "Yeni ürün butonu:",
    newProductButton
);


console.log(
    "Ürün formu:",
    productFormBox
);


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

            console.log(
                "Yeni ürün butonuna basıldı."
            );


            productFormBox.style.display =
                "block";


            newProductButton.style.display =
                "none";


            /* FORMA KAYDIR */

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

            console.log(
                "Ürün formu kapatılıyor."
            );


            productFormBox.style.display =
                "none";


            newProductButton.style.display =
                "inline-block";


            const productForm =
                document.getElementById(
                    "productForm"
                );


            if (productForm) {

                productForm.reset();

            }

        }
    );

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

            console.log(
                "Çıkış yapılıyor..."
            );


            await supabaseClient.auth
                .signOut();


            window.location.href =
                "admin-login.html";

        }
    );

}
```

}
