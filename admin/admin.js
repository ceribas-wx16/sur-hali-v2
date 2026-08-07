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

    if(form){

        form.addEventListener(
            "submit",
            girisYap
        );

    }

});


/* ==========================================================
   GİRİŞ
========================================================== */

async function girisYap(e){

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

    try{

        const { error } =
            await supabase.auth.signInWithPassword({

                email: email,

                password: password

            });

        if(error){

            mesaj.textContent =
                "E-posta veya şifre hatalı.";

            return;

        }

        window.location.href =
            "admin.html";

    }

    catch(err){

        console.error(err);

        mesaj.textContent =
            "Beklenmeyen bir hata oluştu.";

    }

}
