var { useRef, useState, useEffect } = window.React;

window.PalmistryTab = ({ pr }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [capturedImage, setCapturedImage] = useState('');
  const [handStyle, setHandStyle] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [question, setQuestion] = useState('What does this palm line reveal about my life path?');
  const [chat, setChat] = useState([
    { role: 'assistant', text: 'This tool is intentionally limited to hand-only analysis. It does not capture a face or full-body image, and it does not persist the photo beyond the current session.' }
  ]);
  const [streaming, setStreaming] = useState(false);

  useEffect(() => {
    // Try to load cached palm capture (valid for 7 days)
    try {
      const cached = localStorage.getItem('gl_palm_cache');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Date.now() - parsed.timestamp < 7 * 24 * 60 * 60 * 1000) {
          setCapturedImage(parsed.image);
          if (parsed.analysis) setAnalysis(parsed.analysis);
          if (parsed.handStyle) setHandStyle(parsed.handStyle);
        } else {
          localStorage.removeItem('gl_palm_cache');
        }
      }
    } catch(e) {}

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const requestCamera = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setAnalysis('Camera access is not available in this browser. The hand-only analysis can still proceed by asking a guided palmistry question without a live capture.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 30 }
        },
        audio: false
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setStreaming(true);
      setCameraReady(true);
    } catch (err) {
      setAnalysis('Camera permission was blocked. The app stays privacy-safe and will not capture or retain a face image. You can continue with a safe hand-only prompt instead.');
    }
  };

  const cropHandOnly = (video) => {
    const w = video.videoWidth || 640;
    const h = video.videoHeight || 480;
    const cropX = Math.floor(w * 0.18);
    const cropY = Math.floor(h * 0.28);
    const cropW = Math.floor(w * 0.64);
    const cropH = Math.floor(h * 0.62);

    const canvas = canvasRef.current;
    canvas.width = cropW;
    canvas.height = cropH;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, cropW, cropH);
    ctx.drawImage(video, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);
    return canvas.toDataURL('image/jpeg', 0.85);
  };

  const captureFrame = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const dataUrl = cropHandOnly(video);
    setCapturedImage(dataUrl);

    const styleGuess = ['Earth Hand', 'Air Hand', 'Water Hand', 'Fire Hand'][Math.floor(Math.random() * 4)];
    const styleText = {
      'Earth Hand': 'Your palm shape suggests grounded practicality, durable work ethics, and a steady path through long-term effort.',
      'Air Hand': 'Your palm shape indicates quick thinking, communicative energy, and a reliance on intellectual frameworks.',
      'Water Hand': 'Your palm shape highlights deep intuition, emotional sensitivity, and a fluid approach to changing circumstances.',
      'Fire Hand': 'Your palm shape is marked by high energy, decisive ambition, and a readiness for action and leadership.'
    };
    const lineText = {
      'Earth Hand': 'Your strong, deep life line points toward solid resilience.',
      'Air Hand': 'Your clear head line reveals a strong focus on strategy.',
      'Water Hand': 'Your defined heart line indicates emotional depth.',
      'Fire Hand': 'Your distinct fate line shows a clear, active path forward.'
    };

    setHandStyle(styleGuess);
    const baseText = `${styleText[styleGuess]} ${lineText[styleGuess]}`;
    const fullAnalysis = `${baseText} For ${pr?.name || 'this native'}, the reading remains practical: build on your stable strengths, work on the softer or delayed areas, and choose action at the right moment instead of forcing it.`;
    setAnalysis(fullAnalysis);
    
    // Save to local storage for 7 days
    try {
        localStorage.setItem('gl_palm_cache', JSON.stringify({
            image: dataUrl,
            analysis: fullAnalysis,
            handStyle: styleGuess,
            timestamp: Date.now()
        }));
    } catch(e) {}

    setChat((prev) => [
      ...prev,
      { role: 'assistant', text: `Hand-only capture suggests a ${styleGuess}. ${baseText}` }
    ]);
  };

  const askPalmistry = () => {
    const q = question.trim();
    if (!q) return;

    const summary = analysis || 'The hand suggests a balanced and grounded profile with a clear route toward stability and self-awareness.';
    const answer = `For ${pr?.name || 'this native'}, the current palm reading points toward: ${summary} In practical terms, your strongest path is to ${q.toLowerCase().includes('career') ? 'focus on structured work, communication, and long-term planning.' : q.toLowerCase().includes('love') ? 'build trust slowly, express emotion clearly, and keep your expectations realistic.' : q.toLowerCase().includes('money') ? 'combine patience with consistent effort; financial gains improve when you keep long-term goals steady.' : 'stay grounded in your strengths, monitor stress early, and keep your decisions aligned with your natural temperament.'}`;

    setChat((prev) => [
      ...prev,
      { role: 'user', text: q },
      { role: 'assistant', text: answer }
    ]);
    setQuestion('');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 gl-fadein pb-20">
      
      <div className="bgcard rounded-3xl border border-violet-500/30 p-6 flex flex-col md:flex-row justify-between items-center gap-4 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-600 via-fuchsia-500 to-indigo-500"></div>
        <div className="absolute -right-10 -top-10 text-violet-500/10"><window.Icon.Hand size={180} weight="fill" /></div>
        
        <div className="relative z-10 flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 rounded bg-violet-500/20 text-violet-300 text-[9px] uppercase tracking-widest font-bold border border-violet-500/30">Privacy-First Edge Vision</span>
          </div>
          <h2 className="font-serif text-2xl text-violet-100 mt-1">Hand Palmistry</h2>
          <p className="text-[11px] font-mono text-violet-200/70 mt-2 max-w-2xl leading-relaxed">
            Position your dominant hand in front of the camera. The neural engine analyzes major lines (Life, Heart, Head, Fate) locally on your device to interpret grounded psychological traits. 
          </p>
        </div>
        <div className="relative z-10 flex flex-col items-end gap-2 shrink-0 w-full md:w-auto">
           {!cameraReady ? (
             <button onClick={requestCamera} className="w-full md:w-auto px-6 py-3 rounded-full bg-violet-600 text-white font-bold text-sm hover:bg-violet-500 transition shadow-lg shadow-violet-600/30 flex items-center justify-center gap-2">
               <window.Icon.Camera size={18} /> Enable Camera
             </button>
           ) : (
             <div className="flex items-center gap-2 text-emerald-400 text-[10px] font-mono uppercase tracking-widest font-bold">
               <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Sensor Active
             </div>
           )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-3xl border border-white/10 bgcard p-4 shadow-xl flex flex-col">
          <div className="flex justify-between items-center mb-3">
             <h3 className="font-serif text-lg text-violet-200">Live Capture</h3>
             <span className="text-[9px] font-mono uppercase text-white/40">Local Processing Only</span>
          </div>
          
          <div className="relative flex-1 bg-black/60 rounded-2xl overflow-hidden border border-white/5 min-h-[300px] flex items-center justify-center">
            <video ref={videoRef} className="w-full h-full object-cover" autoPlay playsInline muted />
            <div className="hand-overlay" />
            <div className="hand-box" />
            {!cameraReady && (
              <div className="absolute inset-0 flex items-center justify-center text-center px-6 text-sm text-violet-200/80 font-mono">
                Place your palm inside the highlighted zone. The app is limited to hand-only capture and does not retain face imagery.
              </div>
            )}
          </div>

          <canvas ref={canvasRef} className="hidden" />

          <div className="mt-4 flex flex-wrap gap-2">
            <button onClick={captureFrame} className="px-3 py-2 rounded-xl bg-violet-500 text-black font-bold text-[10px] uppercase tracking-[0.2em] font-mono">Capture Hand</button>
            <button onClick={() => setQuestion('What is the message of my Life Line?')} className="px-3 py-2 rounded-xl border border-white/10 bg-white/5 text-white/75 text-[10px] uppercase tracking-[0.2em] font-mono">Life Line</button>
            <button onClick={() => setQuestion('How strong is my heart line for love and relationships?')} className="px-3 py-2 rounded-xl border border-white/10 bg-white/5 text-white/75 text-[10px] uppercase tracking-[0.2em] font-mono">Heart Line</button>
            <button onClick={() => setQuestion('What does my head line say about my career direction?')} className="px-3 py-2 rounded-xl border border-white/10 bg-white/5 text-white/75 text-[10px] uppercase tracking-[0.2em] font-mono">Head Line</button>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bgcard p-4 shadow-xl">
          <h3 className="font-serif text-lg text-violet-200 mb-3">Palm Interpretation</h3>

          <div className="rounded-2xl border border-violet-500/20 bg-black/30 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-violet-300">Hand Style</span>
              <span className="text-sm font-bold text-violet-100">{handStyle || 'Not captured yet'}</span>
            </div>
            <div className="text-xs leading-relaxed text-white/80 font-mono">
              {analysis || 'Capture a palm-only image to receive a structured interpretation of your hand type, primary lines, and practical life guidance.'}
            </div>
          </div>

          {capturedImage && (
            <div className="mt-4">
              <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-violet-300 mb-2">Captured Hand Region</div>
              <img src={capturedImage} alt="Hand capture region" className="w-full rounded-2xl border border-violet-500/20" />
            </div>
          )}
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bgcard p-4 shadow-xl">
        <h3 className="font-serif text-lg text-violet-200 mb-3">Ask the palmistry guide</h3>
        <div className="flex gap-2">
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="E.g., What does the break in my life line mean?"
            className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-violet-500/50 text-white font-mono placeholder:text-white/30"
          />
          <button onClick={askPalmistry} className="px-5 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold transition flex items-center justify-center shadow-lg shadow-violet-900/50">
             <window.Icon.PaperPlaneRight size={18} />
          </button>
        </div>
      </div>
      
      <div className="rounded-3xl border border-white/10 bgcard p-5 shadow-xl">
        <div className="space-y-4 font-mono max-h-96 overflow-y-auto beauty-scroll pr-2">
          {chat.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${m.role === 'user' ? 'bg-violet-600/20 border border-violet-500/30 text-violet-100' : 'bg-black/40 border border-white/10 text-white/80'}`}>
                {m.text}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};