console.log("JS LOADED");

document.addEventListener("DOMContentLoaded", function () {

    function getUsers() {
        return JSON.parse(localStorage.getItem("users")) || [];
    }

    function saveUsers(users) {
        localStorage.setItem("users", JSON.stringify(users));
    }

    // 🔐 CREATE ADMIN (runs once automatically)
    let users = getUsers();
    if (!users.some(u => u.email === "admin@safemarket.com")) {
        users.push({
            email: "admin@safemarket.com",
            password: "Nexus01",
            roles: ["admin"],
            trustScore: 100,
            status: "approved"
        });
        saveUsers(users);
    }

    const loginBtn = document.getElementById("loginBtn");
    const registerBtn = document.getElementById("registerBtn");

    // 🔑 LOGIN
    if (loginBtn) {
        loginBtn.addEventListener("click", function () {

            const email = document.getElementById("loginEmail").value.trim().toLowerCase();
            const password = document.getElementById("loginPassword").value.trim();

            const users = getUsers();

            const user = users.find(u => u.email === email && u.password === password);

            if (user) {
                localStorage.setItem("activeUser", JSON.stringify(user));
                alert("Login successful!");

                // 🔥 ROLE-BASED REDIRECT
                if (user.roles.includes("admin")) {
                    window.location.href = "admin.html";
                }
                else if (user.roles.includes("buyer")) {
                    window.location.href = "marketplace.html";
                }
                else {
                    window.location.href = "dashboard.html";
                }

            } else {
                alert("Wrong email or password!");
            }
        });
    }

    // 📝 REGISTER
    if (registerBtn) {
        registerBtn.addEventListener("click", function () {

            const email = document.getElementById("regEmail").value.trim().toLowerCase();
            const password = document.getElementById("regPassword").value.trim();
            const confirm = document.getElementById("confirmPassword").value.trim();
            const terms = document.getElementById("termsCheck").checked;

            let role = "buyer";
            document.querySelectorAll('input[name="role"]').forEach(r => {
                if (r.checked) role = r.value;
            });

            if (!email || !password || !confirm) {
                alert("Fill all fields!");
                return;
            }

            if (!terms) {
                alert("Accept terms!");
                return;
            }

            if (password !== confirm) {
                alert("Passwords do not match!");
                return;
            }

            let users = getUsers();

            if (users.some(u => u.email === email)) {
                alert("Email already exists!");
                return;
            }

            users.push({
                email: email,
                password: password,
                roles: [role],
                trustScore: 50,
                status: "none",
                businessName: "",
                category: "",
                phone: "",
                idUploaded: false
            });

            function updateTrustScore(sellerName) {
    let seller = users.find(u => u.businessName === sellerName);
    if(!seller) return;

    let sales = products.filter(p => p.seller === seller.businessName && p.sold).length;
    let positiveReviews = 0;
    let negativeReviews = 0;

    products.forEach(p => {
        if(p.seller === seller.businessName && reviewsDB[p.id]){
            reviewsDB[p.id].forEach(r => {
                if(r.verified && r.rating >= 4) positiveReviews++;
                if(r.verified && r.rating <= 2) negativeReviews++;
            });
        }
    });

    let sellerReports = reports.filter(r => {
        let prod = products.find(p => p.id === r.productId);
        return prod && prod.seller === seller.businessName && r.status === "resolved";
    }).length;

    // Base 70, then adjustments
    seller.trustScore = 70 + sales*2 + positiveReviews*3 - negativeReviews*3 - sellerReports*10;
    if(seller.trustScore > 100) seller.trustScore = 100;
    if(seller.trustScore < 0) seller.trustScore = 0;

    localStorage.setItem("users", JSON.stringify(users));
}

            saveUsers(users);

            alert("Account created! Please login.");
            window.location.href = "login.html";
        });
    }

});