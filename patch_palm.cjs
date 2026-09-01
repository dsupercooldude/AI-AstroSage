const fs = require('fs');
let palm = fs.readFileSync('src/jsx/tab-palmistry.jsx', 'utf8');

const stopCamera = `
  const stopCameraStream = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setStreaming(false);
    setCameraReady(false);
  };
`;
palm = palm.replace('const requestCamera', stopCamera + '\n  const requestCamera');

palm = palm.replace(
  'setCapturedImage(dataUrl);',
  'setCapturedImage(dataUrl);\n    stopCameraStream();' // Stop camera after capture
);

// Guidelines UI
const guidelines = `
          {/* CAMERA FEED OR PLACEHOLDER */}
          {!capturedImage ? (
            <div className="relative aspect-[3/4] md:aspect-video bg-black rounded-3xl border border-[#3f3f46] overflow-hidden flex flex-col items-center justify-center">
              {!streaming && (
                <div className="absolute inset-0 p-8 flex flex-col items-center justify-center text-center bg-black/60 z-10">
                  <h3 className="text-amber-400 font-serif text-lg mb-2">Palm Capture Guidelines</h3>
                  <ul className="text-xs font-mono text-slate-300 space-y-2 mb-6 text-left list-disc pl-4">
                    <li>Hold your hand flat and steady, fingers slightly apart.</li>
                    <li>Ensure good lighting without harsh shadows on the palm.</li>
                    <li>Make sure the major lines (heart, head, life) are visible.</li>
                    <li>Capture only the hand (not the face or background).</li>
                  </ul>
                  <button onClick={requestCamera} className="bg-amber-600 hover:bg-amber-500 text-white font-mono text-sm px-6 py-3 rounded-full transition shadow-lg">
                    Start Camera
                  </button>
                </div>
              )}
              <video ref={videoRef} autoPlay playsInline muted className={\`w-full h-full object-cover \${!streaming ? 'opacity-0' : 'opacity-100'}\`} />
`;

palm = palm.replace(/\{\/\* CAMERA FEED OR PLACEHOLDER \*\/\}(.|\n)*?<video ref=\{videoRef\}/, guidelines);

// Add suggestion bubbles below the chat input
const chatInput = `
                  <div className="mt-4">
                    <form className="flex gap-2" onSubmit={askQuestion}>
                      <input 
                        type="text" 
                        value={question} 
                        onChange={(e) => setQuestion(e.target.value)} 
                        className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-xs font-mono text-white outline-none focus:border-amber-500/50" 
                        placeholder="Ask about your lifeline, career line, etc..." 
                      />
                      <button type="submit" disabled={!question.trim()} className="bg-amber-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-amber-500 transition disabled:opacity-50">
                        Ask
                      </button>
                    </form>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <button onClick={() => setQuestion("What does my lifeline indicate?")} className="text-[9px] bg-white/5 border border-white/10 hover:bg-white/10 px-2 py-1 rounded text-slate-300">Lifeline meaning?</button>
                      <button onClick={() => setQuestion("Is there a strong career line?")} className="text-[9px] bg-white/5 border border-white/10 hover:bg-white/10 px-2 py-1 rounded text-slate-300">Career path?</button>
                      <button onClick={() => setQuestion("What about marriage/heart line?")} className="text-[9px] bg-white/5 border border-white/10 hover:bg-white/10 px-2 py-1 rounded text-slate-300">Heart line?</button>
                    </div>
                  </div>
`;

palm = palm.replace(/<form className="flex gap-2" onSubmit=\{askQuestion\}>(.|\n)*?<\/form>/, chatInput);

fs.writeFileSync('src/jsx/tab-palmistry.jsx', palm);
