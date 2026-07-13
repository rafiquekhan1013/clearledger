
import sha256 from "crypto-js/sha256";

async function getCanvasFingerprint() {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) return "no-2d-context";

  ctx.textBaseline = "top";
  ctx.font = "16px Arial";
  ctx.fillText("Betlab-Fingerprint", 2, 2);

  return canvas.toDataURL();
}

function getWebGLFingerprint() {
  const canvas = document.createElement("canvas");
  const gl = canvas.getContext("webgl");

  if (!gl) return "no-webgl";

  const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");

  if (!debugInfo) return "no-debug-info";

  return (
    gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) +
    "~" +
    gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
  );
}

async function getAudioFingerprint() {
  try {
    const AudioContextCtor =
      window.AudioContext ||
      (window as Window & { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioContextCtor) return "no-audio-context";

    const audioCtx = new AudioContextCtor();
    const oscillator = audioCtx.createOscillator();
    const analyser = audioCtx.createAnalyser();

    oscillator.connect(analyser);
    oscillator.start(0);

    const data = new Float32Array(analyser.frequencyBinCount);
    analyser.getFloatFrequencyData(data);

    return data.slice(0, 20).join(",");
  } catch {
    return "audio-error";
  }
}

function getBasicInfo() {
  return {
    userAgent: navigator.userAgent,
    language: navigator.language,
    screen: `${screen.width}x${screen.height}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    cores: navigator.hardwareConcurrency,
  };
}

export async function generateFingerprint() {
  const basic = getBasicInfo();
  const canvas = await getCanvasFingerprint();
  const webgl = getWebGLFingerprint();
  const audio = await getAudioFingerprint();

  const rawData = JSON.stringify({
    basic,
    canvas,
    webgl,
    audio,
  });

  const hash = sha256(rawData).toString();

  return {
    hash,
    webgl,
    audio,
    canvas,
    userAgent: basic.userAgent,
    screen: basic.screen,
    timezone: basic.timezone,
    cores: basic.cores,
    language: basic.language,
  };
}

