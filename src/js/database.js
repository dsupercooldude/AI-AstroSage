window.AppDB = {
    config: { mode: "local" },

    // Auto-connect token (Optional: user can set via settings modal)
    autoUser: "dsupercooldude",
    autoRepo: "AstroGrah",
    autoTokenPart1: "",
    autoTokenPart2: "",

    loadConfig: async function() {
        try {
            // 1. If explicit local storage override is set, use local
            if (localStorage.getItem('gl_use_local') === 'true') {
                this.config = { mode: "local" };
                return true;
            }

            // 2. Try to load saved config from browser storage
            const stored = localStorage.getItem('gl_db_config');
            if (stored) {
                let decoded;
                try {
                    decoded = window.CryptoUtils ? await window.CryptoUtils.decrypt(stored) : JSON.parse(stored);
                } catch(e) {
                    try { decoded = JSON.parse(stored); } catch(err) {}
                }
                if (decoded && decoded.owner && decoded.repo && decoded.token) {
                    this.config = decoded;
                    return true;
                }
            }
            
            // 3. Fallback to local mode
            this.config = { mode: "local" };
            return true;
        } catch (e) {
            this.config = { mode: "local" };
            return true;
        }
    },
    
    setConfig: async function(o, r, t) {
        this.config = { owner: o, repo: r, token: t };
        localStorage.setItem('gl_db_config', await window.CryptoUtils.encrypt(this.config));
        localStorage.removeItem('gl_use_local'); // Clear local override
    },

    clearConfig: function() {
        this.config = { mode: "local" };
        localStorage.removeItem('gl_db_config');
        localStorage.setItem('gl_use_local', 'true');
    },

    enableLocal: function() {
        this.config = { mode: "local" };
        localStorage.setItem('gl_use_local', 'true');
        localStorage.removeItem('gl_db_config');
    },

    callApi: async function(method, endpoint, body = null) {
        if (!this.config) {
            await this.loadConfig();
        }
        if (!this.config) {
            this.config = { mode: "local" };
        }
        
        // INTERCEPT LOCAL STORAGE MODE
        if (this.config.mode === "local") {
            const baseName = endpoint.split('/').pop();
            const localKey = `gl_local_${baseName}`;
            if (method === 'GET') {
                let data = localStorage.getItem(localKey);
                if (!data) {
                    const altKeys = [baseName, baseName.replace('.json', ''), `gl_${baseName.replace('.json', '')}`, `gl_local_${baseName.replace('gl_', '')}`];
                    for (const k of altKeys) {
                        const candidate = localStorage.getItem(k);
                        if (candidate) { data = candidate; break; }
                    }
                }
                if (!data) throw new Error("404");
                return { content: data, sha: 'local-sha' };
            }
            if (method === 'PUT') {
                localStorage.setItem(localKey, body.content);
                return { commit: { sha: 'local-commit' }, content: { sha: 'local-sha' } };
            }
        }

        const url = `https://api.github.com/repos/${this.config.owner}/${this.config.repo}/contents/${endpoint}`;
        const headers = {
            "Authorization": `token ${this.config.token}`,
            "Accept": "application/vnd.github.v3+json",
            "X-GitHub-Api-Version": "2022-11-28"
        };
        const req = { method, headers };
        if (body) req.body = JSON.stringify(body);
        
        try {
            const res = await fetch(url, req);
            if (!res.ok) {
                if (res.status === 404) throw new Error("404");
                if (res.status === 401 || res.status === 403) {
                    console.warn("GitHub Auth 401/403: Auto-falling back to Local Vault Mode.");
                    this.enableLocal();
                    return this.callApi(method, endpoint, body);
                }
                throw new Error(`GitHub API Error: ${res.status}`);
            }
            return await res.json();
        } catch (fetchErr) {
            if (fetchErr.message === "404") throw fetchErr;
            console.warn("GitHub API fetch failed, falling back to local mode", fetchErr);
            this.enableLocal();
            return this.callApi(method, endpoint, body);
        }
    },

    hashKey: async function(email) {
        const msgBuffer = new TextEncoder().encode(email.toLowerCase().trim());
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    },

    decodeData: function(raw) {
        if (!raw) return {};
        if (typeof raw === 'object') return raw;
        if (typeof raw !== 'string') return {};
        
        // 1. Try directly parsing as JSON (if stored as plain JSON)
        try {
            const direct = JSON.parse(raw);
            if (direct && typeof direct === 'object') return direct;
        } catch (e) {}
        
        // 2. Try base64 decoding (standard and UTF-8 safe)
        try {
            const cleanB64 = raw.replace(/\s+/g, '');
            const binStr = atob(cleanB64);
            const bytes = new Uint8Array(binStr.length);
            for (let i = 0; i < binStr.length; i++) {
                bytes[i] = binStr.charCodeAt(i);
            }
            const utf8 = new TextDecoder('utf-8').decode(bytes);
            const parsed = JSON.parse(utf8);
            if (parsed && typeof parsed === 'object') return parsed;
        } catch (decErr) {
            try {
                const alt = atob(raw.replace(/\s+/g, ''));
                const p = JSON.parse(alt);
                if (p && typeof p === 'object') return p;
            } catch (err2) {}
        }
        
        return {};
    },

    getFile: async function(filename) {
        try {
            if (!this.config) {
                await this.loadConfig();
            }
            if (!this.config) {
                this.config = { mode: "local" };
            }
            const data = await this.callApi('GET', filename);
            const content = this.decodeData(data.content);
            return {
                content: content && typeof content === 'object' ? content : {},
                sha: data.sha || 'local-sha'
            };
        } catch (e) {
            // Check if local storage has a copy under any standard or legacy key
            try {
                const baseName = filename.split('/').pop();
                const possibleKeys = [
                    `gl_local_${baseName}`,
                    baseName,
                    baseName.replace('.json', ''),
                    `gl_${baseName.replace('.json', '')}`,
                    `gl_local_${baseName.replace('gl_', '')}`
                ];
                for (const key of possibleKeys) {
                    const localData = localStorage.getItem(key);
                    if (localData) {
                        const content = this.decodeData(localData);
                        if (content && typeof content === 'object' && Object.keys(content).length > 0) {
                            return { content, sha: 'local-sha' };
                        }
                    }
                }
            } catch(e2) {}
            return { content: {}, sha: null };
        }
    },

    saveFile: async function(filename, contentObj, sha = null) {
        if (!this.config) {
            await this.loadConfig();
        }
        if (!this.config) {
            this.config = { mode: "local" };
        }
        const message = `Auto-update ${filename} [${new Date().toISOString()}]`;
        const strContent = typeof contentObj === 'string' ? contentObj : JSON.stringify(contentObj, null, 2);
        
        // Safe chunked base64 encoding to prevent stack overflow on large datasets and handle UTF-8 correctly
        const utf8Bytes = new TextEncoder().encode(strContent);
        let binary = '';
        const len = utf8Bytes.length;
        const chunkSize = 8192;
        for (let i = 0; i < len; i += chunkSize) {
            const sub = utf8Bytes.subarray(i, Math.min(i + chunkSize, len));
            for (let j = 0; j < sub.length; j++) {
                binary += String.fromCharCode(sub[j]);
            }
        }
        const b64Content = btoa(binary);
        
        try {
            const body = { message, content: b64Content };
            if (sha) body.sha = sha;
            const res = await this.callApi('PUT', filename, body);
            return res.content.sha;
        } catch (err) {
            // Local fallback
            try {
                const localKey = `gl_local_${filename.split('/').pop()}`;
                localStorage.setItem(localKey, b64Content);
            } catch(e) {}
            return 'local-sha';
        }
    },

    appendGlobalAI: async function(entry) {
        try {
            const fileName = 'gl_global_ai_logs.json';
            const file = await this.getFile(fileName);
            let logs = [];
            if (file && file.content && Array.isArray(file.content.logs)) {
                logs = file.content.logs;
            }
            logs.push(entry);
            if (logs.length > 50) logs = logs.slice(-50);
            const content = { logs };
            await this.saveFile(fileName, content, file?.sha);
        } catch (e) {
            // Non-critical background logging
        }
    }
};

// Immediate background initialization
try {
    window.AppDB.loadConfig();
} catch(e) {}
