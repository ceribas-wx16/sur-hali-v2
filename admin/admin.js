/* ==========================================================
   SUR HALI
   ADMIN LOGIN
========================================================== */

console.clear();

console.log("Admin Login Başlatılıyor...");


/* ==========================================================
   SAYFA YÜKLENDİ
========================================================== */

document.addEventListener("DOMContentLoaded", () => {

    const form =
        document.getElementById("loginForm");

    if (form) {

        form.addEventListener(
            "submit",
            girisYap
        );

    }

});


/* ==========================================================
   GİRİŞ
========================================================== */

async function girisYap(e) {

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

    try {

        console.log("Supabase giriş deneniyor...");
        console.log("E-posta:", email);

        const { data, error } =
            await supabase.auth.signInWithPassword({

                email: email,

                password: password

            });

        console.log("Supabase cevap:", data, error);


        if (error) {

            console.error(
                "SUPABASE GİRİŞ HATASI:",
                error
            );

            mesaj.textContent =
                error.message ||
                "Giriş yapılamadı.";

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

}
