let containerBotines = document.getElementById("botines")
let cambiarOrden = document.getElementById("selectOrden")
let buscador = document.getElementById("buscador")
let mostrarCoincidenciasDiv = document.getElementById("coincidencias")
let modalBodyCarrito = document.getElementById("modal-bodyCarrito")
let botonCarrito = document.getElementById("botonCarrito")
let precioTotal = document.getElementById("precioTotal")
let finCompraBtn = document.getElementById("botonFinalizarCompra")
let modoOscuroBtn = document.getElementById("btnToggle")

class Botines{
    constructor(marca, precio, color, id, imagen){
        this.marca = marca,
        this.precio = precio,
        this.color = color,
        this.id = id,
        this.imagen = imagen
    }
}

const botin1 = new Botines("adidas", 50399, "rosa", 1, "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/77c4486dbdd848149c4aaf720104f460_9366/Botines_X_Speedportal.3_Terreno_Firme_Rosa_GZ5071_22_model.jpg")
const botin2 = new Botines("umbro", 27150, "negro", 2, "https://umbroar.vtexassets.com/arquivos/ids/2329218-800-auto?v=638186466901800000&width=800&height=auto&aspect=true")
const botin3 = new Botines("topper", 39999, "blanco", 3, "https://s3.sa-east-1.amazonaws.com/www.vaypol.com.ar/variants/w2zf7pimkx523mhgor4zf29yhwjs/c77c2a06864ac9aca38dc5bd9371de015471edcdbf322dfb14411689bf968ae5")

let botinero = []

let comprarProductosCarrito = []

botinero.push(botin1, botin2, botin3)

function mostrarProductos(array){
    containerBotines.innerHTML = ""

    for(let botin of array){
        
        let verBotinesDiv= document.createElement("div")
        verBotinesDiv.className = "col-12 col-md-6 col-lg-4 my-2"
        verBotinesDiv.innerHTML = `
            <div id="${botin.id}" class="card" style="width: 18rem;">
                    <img class="card-img-top img-fluid" style="height: 200px;"src="${botin.imagen}" ">
                    <div class="card-body">
                        <h4 class="card-title"></h4>
                        <p>Marca: ${botin.marca}</p>
                        <p>Color: ${botin.color}</p>
                        <p>Precio: ${botin.precio}</p>
                    <button id="agregarBtn${botin.id}" class="btn btn-outline-success">Comprar</button>
                    </div>
        </div> `

        containerBotines.append(verBotinesDiv)

        let comprarBtn = document.getElementById(`agregarBtn${botin.id}`)

        comprarBtn.addEventListener("click", () => {
            agregarAlCarrito(botin)
        })
    }
}

function ordenarPrecioMayor(array){

    let arrayPrecioMayor = array.concat()
    
     arrayPrecioMayor.sort(
        (par1,par2) => par2.precio - par1.precio
    )
    mostrarProductos(arrayPrecioMayor)
}

function ordenarPrecioMenor(array){
    let arrayPrecioMenor = array.concat()
    arrayPrecioMenor.sort(

        (a, b) => a.precio - b.precio
    )
    mostrarProductos(arrayPrecioMenor)
}

cambiarOrden.addEventListener("change", () => {

    switch(cambiarOrden.value){
        case "1":
            ordenarPrecioMayor(botinero)
        break
        case "2":
            ordenarPrecioMenor(botinero)
        break
        default:
            mostrarProductos(botinero)
        break
    }
})

function buscarProducto(buscado,array){

    let coincidencias = array.filter(
        (botin) => {

            return botin.marca.toLowerCase().includes(buscado.toLowerCase()) || botin.color.toLowerCase().includes(buscado.toLowerCase())
        }
    )

    coincidencias.length > 0 ? (mostrarProductos(coincidencias), mostrarCoincidenciasDiv.innerHTML ="") : (mostrarProductos(array), mostrarCoincidenciasDiv.innerHTML = `<h3>No hay coincidencias con su búsqueda, este es nuestro catálogo completo</h3>`) 
}

buscador.addEventListener("input", () => {
    console.log(buscador.value)
    buscarProducto(buscador.value,botinero)
})


function agregarAlCarrito(elemento){

    let productoAgregado = comprarProductosCarrito.find((botin) => botin.id == elemento.id)

    productoAgregado == undefined ?  
            (comprarProductosCarrito.push(elemento),
            localStorage.setItem("carrito", JSON.stringify(comprarProductosCarrito))
            ) :
            Swal.fire({
                text: `El producto ya existe en el carrito`
            })
}

function cargarProductosCarrito(array){
    modalBodyCarrito.innerHTML = ""
    array.forEach(
        (productoCarrito) => {
            modalBodyCarrito.innerHTML += `
            <div class="card border-primary mb-3" id ="productoCarrito${productoCarrito.id}" style="max-width: 540px;">
                 <img class="card-img-top" height="300px" src="${productoCarrito.imagen}" alt="">
                 <div class="card-body">
                        <h4 class="card-title">${productoCarrito.marca}</h4>
                        <p class="card-text">${productoCarrito.color}</p>
                         <p class="card-text">$${productoCarrito.precio}</p> 
                         <button class= "btn btn-danger" id="botonEliminar${productoCarrito.id}"><i class="fas fa-trash-alt"></i></button>
                 </div>    
            </div>
            `
        }
    )

    array.forEach(
        (productoCarrito) => {

            document.getElementById(`botonEliminar${productoCarrito.id}`).addEventListener("click", () =>{
                let cardProducto = document.getElementById(`productoCarrito${productoCarrito.id}`)
                cardProducto.remove()
                let posicion = array.indexOf(productoCarrito)
                array.splice(posicion, 1)
                localStorage.setItem("carrito", JSON.stringify(array))
                calcularTotal(array) 
            })
        }
    )
    calcularTotal(array)    
}


function calcularTotal(array){

    const totalReduce = array.reduce(

        (acumulador, botin)=>
        {return acumulador + botin.precio},
        0
    )
    totalReduce > 0 ? precioTotal.innerHTML = `<strong>El total de su compra es: ${totalReduce}</strong>` : precioTotal.innerHTML = `No hay productos en el carrito` 

}

botonCarrito.addEventListener("click", () => {
    cargarProductosCarrito(comprarProductosCarrito)
})


function finalizarCompra(array){
    Swal.fire({
        text: `Gracias por su compra`
    })

    comprarProductosCarrito  = []

    localStorage.removeItem("carrito")
}

finCompraBtn.addEventListener("click", () =>{
    finalizarCompra(comprarProductosCarrito)
})


if(localStorage.getItem("modoOscuro")){

}else{

    console.log("SETEAMOS POR PRIMERA VEZ")
    localStorage.setItem("modoOscuro", false)
}

if(JSON.parse(localStorage.getItem("modoOscuro")) == true){
    document.body.classList.toggle("darkMode")
    modoOscuroBtn.innerText = "Light"
}


modoOscuroBtn.addEventListener("click", () => {
    document.body.classList.toggle("darkMode")
    if(JSON.parse(localStorage.getItem("modoOscuro")) == false){

        modoOscuroBtn.innerText = "Light"
        localStorage.setItem("modoOscuro", true)
    }
    else if(JSON.parse(localStorage.getItem("modoOscuro")) == true){

        modoOscuroBtn.innerText = "Dark"
        localStorage.setItem("modoOscuro", false)
    }
})



mostrarProductos(botinero)