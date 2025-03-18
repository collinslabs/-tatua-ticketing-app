
async function generateKey() {
    let key = localStorage.getItem('cryptoKey');
    if (!key) {
        const cryptoKey = await window.crypto.subtle.generateKey(
            {
                name: "AES-GCM",
                length: 256,
            },
            true,
            ["encrypt", "decrypt"]
        );
        // Export the key and store
        const exportedKey = await window.crypto.subtle.exportKey("jwk", cryptoKey);
        localStorage.setItem('cryptoKey', JSON.stringify(exportedKey));
        return cryptoKey;
    } else {
        // Import the key
        const importedKey = await window.crypto.subtle.importKey(
            "jwk",
            JSON.parse(key),
            {
                name: "AES-GCM",
                length: 256,
            },
            true,
            ["encrypt", "decrypt"]
        );
        return importedKey;
    }
}

// Encrypt data
async function encryptData(key, data) {
    const encodedData = new TextEncoder().encode(JSON.stringify(data));
    const iv = window.crypto.getRandomValues(new Uint8Array(12)); 
    const encryptedData = await window.crypto.subtle.encrypt(
        {
            name: "AES-GCM",
            iv: iv,
        },
        key,
        encodedData
    );

    // Combine the encrypted data
    const combined = new Uint8Array(iv.length + encryptedData.byteLength);
    combined.set(iv);
    combined.set(new Uint8Array(encryptedData), iv.length);

    return combined;
}

// Decrypt data
async function decryptData(key, combined) {
    const iv = combined.slice(0, 12);
    const encryptedData = combined.slice(12);

    try {
        const decryptedData = await window.crypto.subtle.decrypt(
            {
                name: "AES-GCM",
                iv: iv,
            },
            key,
            encryptedData
        );

        return new TextDecoder().decode(decryptedData);
    } catch (error) {
        throw error;
    }
}