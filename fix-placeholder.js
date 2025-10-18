// ===== SCRIPT PARA LIMPIAR PLACEHOLDER.JPG DE FIREBASE =====
// Ejecutar este script UNA VEZ desde la consola del navegador en el admin panel

console.log('🔧 Iniciando limpieza de placeholder.jpg...');

// 1. Actualizar Service Worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(function(registrations) {
        for(let registration of registrations) {
            registration.unregister();
            console.log('✅ Service Worker desregistrado');
        }
    });
    
    // Registrar nuevo Service Worker
    setTimeout(() => {
        navigator.serviceWorker.register('/sw.js').then(() => {
            console.log('✅ Service Worker actualizado');
        });
    }, 1000);
}

// 2. Limpiar productos con placeholder.jpg
if (typeof db !== 'undefined') {
    db.collection('productos').get().then((snapshot) => {
        const updates = [];
        
        snapshot.forEach((doc) => {
            const data = doc.data();
            if (data.image && (data.image.includes('placeholder.jpg') || data.image.includes('IMG/placeholder'))) {
                console.log(`🔄 Limpiando producto: ${data.name}`);
                updates.push(
                    doc.ref.update({
                        image: ''
                    })
                );
            }
        });
        
        if (updates.length > 0) {
            Promise.all(updates).then(() => {
                console.log(`✅ ${updates.length} productos actualizados`);
                console.log('🎉 Limpieza completada. Recarga la página.');
            });
        } else {
            console.log('✅ No se encontraron productos con placeholder.jpg');
        }
    }).catch((error) => {
        console.error('❌ Error al limpiar productos:', error);
    });
}

// 3. Limpiar banners con placeholder.jpg
if (typeof db !== 'undefined') {
    db.collection('banners').get().then((snapshot) => {
        const updates = [];
        
        snapshot.forEach((doc) => {
            const data = doc.data();
            if (data.image && (data.image.includes('placeholder.jpg') || data.image.includes('IMG/placeholder'))) {
                console.log(`🔄 Limpiando banner: ${data.title}`);
                updates.push(
                    doc.ref.update({
                        image: ''
                    })
                );
            }
        });
        
        if (updates.length > 0) {
            Promise.all(updates).then(() => {
                console.log(`✅ ${updates.length} banners actualizados`);
            });
        } else {
            console.log('✅ No se encontraron banners con placeholder.jpg');
        }
    }).catch((error) => {
        console.error('❌ Error al limpiar banners:', error);
    });
}

console.log('📝 Instrucciones:');
console.log('1. Espera a que se complete la limpieza');
console.log('2. Recarga la página con Ctrl+Shift+R (para limpiar caché)');
console.log('3. El error de placeholder.jpg debería desaparecer');

