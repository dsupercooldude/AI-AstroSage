window.CryptoUtils = {
    b64E: s => btoa(encodeURIComponent(s).replace(/%([0-9A-F]{2})/g, (m, p) => String.fromCharCode('0x' + p))),
    b64D: s => decodeURIComponent(atob(s).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')),
    encrypt: d => { 
        if (!d) return d; 
        let s = typeof d === 'object' ? JSON.stringify(d) : String(d); 
        let r = ''; 
        for(let i=0; i<s.length; i++) r += String.fromCharCode(s.charCodeAt(i) ^ "SAGE2026".charCodeAt(i % 8)); 
        return window.CryptoUtils.b64E(r); 
    },
    decrypt: b => { 
        if (!b) return b; 
        try { 
            if(!b.match(/^[A-Za-z0-9+/=]+$/)) return b; 
            let d = window.CryptoUtils.b64D(b); 
            let r = ''; 
            for(let i=0; i<d.length; i++) r += String.fromCharCode(d.charCodeAt(i) ^ "SAGE2026".charCodeAt(i % 8)); 
            try { return JSON.parse(r); } catch(e) { return r; } 
        } catch(e) { return b; } 
    },
    hashPassword: async (s) => { 
        const fb = (str) => { let h = 0; for(let i=0; i<str.length; i++) h = Math.imul(31, h) + str.charCodeAt(i) | 0; return "h_" + Math.abs(h).toString(16); }; 
        try { 
            if (!window.crypto || !window.crypto.subtle) return fb(s); 
            const buf = await window.crypto.subtle.digest("SHA-256", new TextEncoder().encode(s)); 
            return Array.from(new Uint8Array(buf)).map(x=>x.toString(16).padStart(2,'0')).join(''); 
        } catch (err) { return fb(s); } 
    }
};
