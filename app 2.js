// Catalogue de démonstration : remplacez ces fiches par des références vérifiées et conformes.
const products = [
 {id:1,name:"Sélection Fleurs",cat:"Fleurs",price:0,desc:"Fiche de présentation à compléter après vérification réglementaire.",icon:"✦"},
 {id:2,name:"Sélection Résines",cat:"Résines",price:0,desc:"Fiche de présentation à compléter après vérification réglementaire.",icon:"◆"},
 {id:3,name:"Huiles",cat:"Huiles",price:0,desc:"Fiche de présentation à compléter après vérification réglementaire.",icon:"◈"},
 {id:4,name:"Infusions",cat:"Infusions",price:0,desc:"Fiche de présentation à compléter après vérification réglementaire.",icon:"❖"}
];
const cart = {};
const euro = n => new Intl.NumberFormat("fr-FR",{style:"currency",currency:"EUR"}).format(n);
const root = document.getElementById("products");
function renderProducts(filter="Tous"){
 const list=products.filter(p=>filter==="Tous"||p.cat===filter);
 root.innerHTML=list.map(p=>`<article class="product"><div class="product-art">${p.icon}</div><div class="product-info"><span class="tag">${p.cat}</span><h3>${p.name}</h3><p>${p.desc}</p><div class="product-bottom"><span class="price">À définir</span><button class="add" data-id="${p.id}">＋ AJOUTER</button></div></div></article>`).join("");
 document.getElementById("product-count").textContent=String(list.length).padStart(2,"0")+" ARTICLES";
}
function renderCart(){
 const rows=Object.entries(cart).filter(([,q])=>q>0);
 const count=rows.reduce((s,[,q])=>s+q,0);
 document.getElementById("cart-count").textContent=count+" ARTICLE"+(count>1?"S":"");
 document.getElementById("nav-badge").textContent=count;
 document.getElementById("cart-items").innerHTML=rows.length?rows.map(([id,q])=>{const p=products.find(x=>x.id==id);return `<div class="cart-row"><span>${p.name} × ${q}</span><button data-remove="${id}" aria-label="Retirer">−</button></div>`}).join(""):'<p class="empty">Votre panier est vide pour le moment.</p>';
 document.getElementById("cart-total").textContent="À définir";
}
document.addEventListener("click",e=>{
 const f=e.target.closest("[data-filter]"); if(f){document.querySelectorAll(".filter").forEach(x=>x.classList.remove("active"));f.classList.add("active");renderProducts(f.dataset.filter)}
 const a=e.target.closest("[data-id]");if(a){const id=a.dataset.id;cart[id]=(cart[id]||0)+1;renderCart()}
 const r=e.target.closest("[data-remove]");if(r){const id=r.dataset.remove;cart[id]--;if(cart[id]<=0)delete cart[id];renderCart()}
});
renderProducts();renderCart();
if(window.Telegram?.WebApp){Telegram.WebApp.ready();Telegram.WebApp.expand();document.body.classList.add("telegram")}
