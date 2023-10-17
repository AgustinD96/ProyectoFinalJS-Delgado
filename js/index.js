document.addEventListener('DOMContentLoaded', function () {
    let carrito = [];
    const cantidadCarrito = document.getElementById('cantidad-carrito');
    const carritoProductos = document.getElementById('carrito-contenedor');
    const totalCompra = document.getElementById('total-compra');
    const botonCarrito = document.getElementById('boton-carrito');
    const botonesAgregar = document.querySelectorAll('.btn-agregar-carrito');
    const tipoPago = document.getElementById('tipo-pago');
    const tipoTarjeta = document.getElementById('tipo-tarjeta');
    const cuotas = document.getElementById('cuotas');

    //Local Storage
    const carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) {
        carrito = JSON.parse(carritoGuardado);
        actualizarCarritoVisual();
    }

    botonesAgregar.forEach((boton) => {
        boton.addEventListener('click', () => {
            const nombreProducto = boton.getAttribute('data-nombre');
            const precioProducto = parseFloat(boton.getAttribute('data-precio'));

            const producto = {
                nombre: nombreProducto,
                precio: precioProducto,
            };

            carrito.push(producto);
            actualizarCarritoVisual();

            //Carrito actualizado en el Local Storage
            localStorage.setItem('carrito', JSON.stringify(carrito));

            //Alerta con SweetAlert2
            Swal.fire({
                icon: 'success',
                title: 'Producto Agregado',
                text: `Se ha agregado "${nombreProducto}" al carrito.`,
            });
        });
    });

    function actualizarCarritoVisual() {
        if (cantidadCarrito && totalCompra) {
            cantidadCarrito.textContent = carrito.length; // Muestra la cantidad de productos en el carrito

            const detalleCarritoBody = document.getElementById('detalle-carrito-body');
            detalleCarritoBody.innerHTML = '';

            // Recorre los productos en el carrito y muestra los detalles en la tabla
            for (let i = 0; i < carrito.length; i++) {
                const producto = carrito[i];
                const fila = document.createElement('tr');
                fila.innerHTML = `
                    <td>${producto.nombre}</td>
                    <td>$${producto.precio.toFixed(2)}</td>
                    <td>1</td>
                    <td><button class="btn btn-danger btn-eliminar" data-indice="${i}">Eliminar</button></td>
                `;
                detalleCarritoBody.appendChild(fila);
            }

            // Agrega un evento de clic a los botones de eliminar
            const botonesEliminar = document.querySelectorAll('.btn-eliminar');
            botonesEliminar.forEach((boton) => {
                boton.addEventListener('click', () => {
                    const indice = boton.getAttribute('data-indice');
                    eliminarProductoDelCarrito(indice);
                    // Mostrar una alerta al eliminar
                    Swal.fire({
                        icon: 'info',
                        title: 'Producto Eliminado',
                        text: `Se ha eliminado un producto del carrito.`,
                    });
                });
            });

            // Calcular y mostrar el total de la compra
            let total = 0;
            for (const producto of carrito) {
                total += producto.precio;
            }
            document.getElementById('total-compra-footer').textContent = `Total: $${total.toFixed(2)}`;
        }
    }

    function eliminarProductoDelCarrito(indice) {
        carrito.splice(indice, 1);
        actualizarCarritoVisual();

        // Guardar el carrito actualizado en el Local Storage
        localStorage.setItem('carrito', JSON.stringify(carrito));
    }

    // Botón de Pagar y el evento de clic
    const botonPagar = document.getElementById('boton-pagar');
    botonPagar.addEventListener('click', () => {
        const total = calcularTotalCompra();
        const selectedTipoPago = tipoPago.value;

        if (selectedTipoPago === 'debito') {
            mostrarAlertaDebito(total);
        } else if (selectedTipoPago === 'tarjeta') {
            
            const selectedTipoTarjeta = tipoTarjeta.value;
            if (selectedTipoTarjeta === 'debito') {
                mostrarAlertaDebito(total);
            } else if (selectedTipoTarjeta === 'credito') {
                const selectedCuotas = cuotas.value;
                mostrarOpcionesDePago(total, selectedTipoPago, selectedTipoTarjeta, selectedCuotas);
            } else {
                mostrarAlertaInvalida();
            }
        } else if (selectedTipoPago === 'transferencia') {
            mostrarAlertaTransferencia(total);
        }
    });

    // Función para calcular el monto total del carrito
    function calcularTotalCompra() {
        let total = 0;
        for (const producto of carrito) {
            total += producto.precio;
        }
        return total;
    }

    // Función para mostrar las opciones de pago por débito
    function mostrarAlertaDebito(total) {
        Swal.fire({
            title: 'Finalizar Compra',
            text: `Monto a pagar por débito: $${total.toFixed(2)}`,
            icon: 'info',
        });
    }

    // Función para mostrar las opciones de pago por transferencia bancaria
    function mostrarAlertaTransferencia(total) {
        Swal.fire({
            title: 'Finalizar Compra',
            text: `Monto a pagar por transferencia bancaria: $${total.toFixed(2)}`,
            icon: 'info',
        });
    }

    // Función para mostrar las opciones de pago
    function mostrarOpcionesDePago(total, tipoPago, tipoTarjeta, cuotas) {
        let mensaje = '';

        if (tipoPago === 'credito') {
            mensaje = `Monto a pagar con tarjeta de crédito (${tipoTarjeta}) en ${cuotas} cuotas.`;
        } else {
            mensaje = 'Método de pago no válido.';
        }

        Swal.fire({
            title: 'Finalizar Compra',
            text: mensaje,
            icon: 'info',
        });
    }

    // Función para mostrar una alerta cuando el método de pago no es válido
    function mostrarAlertaInvalida() {
        Swal.fire({
            title: 'Finalizar Compra',
            text: 'Método de pago no válido.',
            icon: 'error',
        });
    }

    // Agregar un evento para detectar cambios en el tipo de pago seleccionado
    tipoPago.addEventListener('change', function () {
        const selectedOption = tipoPago.value;
        const detallePagoTarjeta = document.getElementById('detalle-pago-tarjeta');
        const valorCuota = document.getElementById('valor-cuota');

        
        if (selectedOption === 'tarjeta') {
            detallePagoTarjeta.style.display = 'block';
        } else {
            detallePagoTarjeta.style.display = 'none';
        }

        
        valorCuota.textContent = '';
    });
});

  


  




  
  



