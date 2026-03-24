const sourceText = document.getElementById("sourceText");
const fontGrid = document.getElementById("fontGrid");
const copyToast = document.getElementById("copyToast");
const loadingMore = document.getElementById("loadingMore");
const charCount = document.getElementById("charCount");
const nonLatinHint = document.getElementById("nonLatinHint");

const PLACEHOLDER = "Your Text Here";
const INITIAL_BATCH = 20;
const BATCH_SIZE = 20;

const LETTERS_UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LETTERS_LOWER = "abcdefghijklmnopqrstuvwxyz";
const DIGITS = "0123456789";

const styleConfig = [
    { name: "Plain", type: "identity" },
    { name: "Bold", upper: 0x1d400, lower: 0x1d41a, digit: 0x1d7ce },
    { name: "Italic", upper: 0x1d434, lower: 0x1d44e },
    { name: "Bold Italic", upper: 0x1d468, lower: 0x1d482 },
    { name: "Script", upper: 0x1d49c, lower: 0x1d4b6 },
    { name: "Bold Script", upper: 0x1d4d0, lower: 0x1d4ea },
    { name: "Fraktur", upper: 0x1d504, lower: 0x1d51e },
    { name: "Bold Fraktur", upper: 0x1d56c, lower: 0x1d586 },
    { name: "Double Struck", upper: 0x1d538, lower: 0x1d552, digit: 0x1d7d8 },
    { name: "Sans", upper: 0x1d5a0, lower: 0x1d5ba, digit: 0x1d7e2 },
    { name: "Sans Bold", upper: 0x1d5d4, lower: 0x1d5ee, digit: 0x1d7ec },
    { name: "Sans Italic", upper: 0x1d608, lower: 0x1d622 },
    { name: "Sans Bold Italic", upper: 0x1d63c, lower: 0x1d656, digit: 0x1d7f6 },
    { name: "Monospace", upper: 0x1d670, lower: 0x1d68a, digit: 0x1d7f6 },
    { name: "Circled", upper: 0x24b6, lower: 0x24d0 },
    { name: "Negative Circled", upper: 0x1f150 },
    { name: "Squared", upper: 0x1f130 },
    { name: "Negative Squared", upper: 0x1f170 },
    { name: "Parenthesized", lower: 0x249c },
    { name: "Regional Indicator", upper: 0x1f1e6 },
    { name: "Superscript", type: "superscript" },
    { name: "Subscript", type: "subscript" },
    { name: "Small Caps", type: "smallcaps" },
    { name: "Wide", type: "wide" },
    { name: "Mirror", type: "mirror" },
    { name: "Strike Through", type: "combine", mark: "\u0336" },
    { name: "Underline", type: "combine", mark: "\u0332" },
    { name: "Double Underline", type: "combine", mark: "\u0333" },
    { name: "Overline", type: "combine", mark: "\u0305" },
    { name: "Dot Above", type: "combine", mark: "\u0307" },
    { name: "Double Dot", type: "combine", mark: "\u0308" },
    { name: "Wave", type: "combine", mark: "\u0330" },
    { name: "Fire", type: "wrap", left: "🔥", right: "🔥" },
    { name: "Hearts", type: "wrap", left: "💖 ", right: " 💖" },
    { name: "Stars", type: "wrap", left: "✦ ", right: " ✦" },
    { name: "Sparkles", type: "wrap", left: "✨ ", right: " ✨" },
    { name: "Arrow Brackets", type: "wrap", left: "» ", right: " «" },
    { name: "Curly Decor", type: "wrap", left: "༺ ", right: " ༻" },
    { name: "Blocks", type: "wrap", left: "▓ ", right: " ▓" },
    { name: "Bubble Wrap", type: "wrap", left: "(◉‿◉) ", right: " (◉‿◉)" },
    { name: "Bracketed", type: "wrap", left: "[ ", right: " ]" },
    { name: "Angle", type: "wrap", left: "⟪ ", right: " ⟫" },
    { name: "Wave Brackets", type: "wrap", left: "〘 ", right: " 〙" },
    { name: "Diamond", type: "wrap", left: "◆ ", right: " ◆" },
    { name: "Pill", type: "wrap", left: "◖", right: "◗" },
];

const superscriptMap = {
    a: "ᵃ", b: "ᵇ", c: "ᶜ", d: "ᵈ", e: "ᵉ", f: "ᶠ", g: "ᵍ", h: "ʰ", i: "ᶦ", j: "ʲ",
    k: "ᵏ", l: "ˡ", m: "ᵐ", n: "ⁿ", o: "ᵒ", p: "ᵖ", q: "q", r: "ʳ", s: "ˢ", t: "ᵗ",
    u: "ᵘ", v: "ᵛ", w: "ʷ", x: "ˣ", y: "ʸ", z: "ᶻ",
    A: "ᴬ", B: "ᴮ", C: "ᶜ", D: "ᴰ", E: "ᴱ", F: "ᶠ", G: "ᴳ", H: "ᴴ", I: "ᴵ", J: "ᴶ",
    K: "ᴷ", L: "ᴸ", M: "ᴹ", N: "ᴺ", O: "ᴼ", P: "ᴾ", Q: "Q", R: "ᴿ", S: "ˢ", T: "ᵀ",
    U: "ᵁ", V: "ⱽ", W: "ᵂ", X: "ˣ", Y: "ʸ", Z: "ᶻ",
    0: "⁰", 1: "¹", 2: "²", 3: "³", 4: "⁴", 5: "⁵", 6: "⁶", 7: "⁷", 8: "⁸", 9: "⁹",
};

const subscriptMap = {
    a: "ₐ", e: "ₑ", h: "ₕ", i: "ᵢ", j: "ⱼ", k: "ₖ", l: "ₗ", m: "ₘ", n: "ₙ", o: "ₒ",
    p: "ₚ", r: "ᵣ", s: "ₛ", t: "ₜ", u: "ᵤ", v: "ᵥ", x: "ₓ",
    0: "₀", 1: "₁", 2: "₂", 3: "₃", 4: "₄", 5: "₅", 6: "₆", 7: "₇", 8: "₈", 9: "₉",
};

const smallCapsMap = {
    a: "ᴀ", b: "ʙ", c: "ᴄ", d: "ᴅ", e: "ᴇ", f: "ꜰ", g: "ɢ", h: "ʜ", i: "ɪ", j: "ᴊ",
    k: "ᴋ", l: "ʟ", m: "ᴍ", n: "ɴ", o: "ᴏ", p: "ᴘ", q: "ǫ", r: "ʀ", s: "ꜱ", t: "ᴛ",
    u: "ᴜ", v: "ᴠ", w: "ᴡ", x: "x", y: "ʏ", z: "ᴢ",
};

const mirrorMap = {
    a: "ɒ", b: "d", c: "ɔ", d: "b", e: "ɘ", f: "Ꮈ", g: "ǫ", h: "ʜ", i: "i", j: "ꞁ",
    k: "ʞ", l: "l", m: "ɯ", n: "u", o: "o", p: "q", q: "p", r: "ɿ", s: "ƨ", t: "t",
    u: "n", v: "v", w: "w", x: "x", y: "ʏ", z: "z",
};

const circledNumberMap = {
    0: "⓪", 1: "①", 2: "②", 3: "③", 4: "④", 5: "⑤", 6: "⑥", 7: "⑦", 8: "⑧", 9: "⑨",
};

let renderCount = 0;
let lastInput = "";

function mapAlphaNumeric(char, config) {
    if (config.type === "identity") return char;

    if (config.type === "superscript") return superscriptMap[char] || char;
    if (config.type === "subscript") return subscriptMap[char] || char;
    if (config.type === "smallcaps") return smallCapsMap[char.toLowerCase()] || char;
    if (config.type === "wide") return char === " " ? " " : String.fromCodePoint(char.codePointAt(0) + 0xfee0);
    if (config.type === "mirror") return mirrorMap[char.toLowerCase()] || char;
    if (config.type === "combine") return char === " " ? " " : `${char}${config.mark}`;

    if (config.type === "wrap") return char;

    if (LETTERS_UPPER.includes(char) && config.upper) {
        return String.fromCodePoint(config.upper + (char.charCodeAt(0) - 65));
    }
    if (LETTERS_LOWER.includes(char) && config.lower) {
        return String.fromCodePoint(config.lower + (char.charCodeAt(0) - 97));
    }
    if (DIGITS.includes(char)) {
        if (config.name === "Circled") return circledNumberMap[char] || char;
        if (config.digit) return String.fromCodePoint(config.digit + Number(char));
    }
    return char;
}

function applyStyle(text, config) {
    if (!text) return PLACEHOLDER;
    if (config.type === "wrap") return `${config.left}${text}${config.right}`;
    return [...text].map((char) => mapAlphaNumeric(char, config)).join("");
}

function hasNonLatin(text) {
    return /[^\u0000-\u007f]/.test(text);
}

function buildCard(config, source) {
    const converted = applyStyle(source, config);
    const card = document.createElement("article");
    card.className = "font-card";
    card.innerHTML = `
        <div class="font-card-header">
            <span class="font-name">${config.name}</span>
            <button class="copy-btn" type="button">Copy</button>
        </div>
        <p class="font-output">${converted}</p>
    `;

    const btn = card.querySelector(".copy-btn");
    btn.addEventListener("click", async () => {
        try {
            await navigator.clipboard.writeText(converted);
            showToast("Copied!");
        } catch (err) {
            showToast("Copy failed");
        }
    });
    return card;
}

function renderChunk(reset = false) {
    if (reset) {
        renderCount = 0;
        fontGrid.innerHTML = "";
    }
    const source = sourceText.value.trim();
    if (hasNonLatin(source)) {
        nonLatinHint.textContent = "Some non-Latin characters may remain unchanged.";
    } else {
        nonLatinHint.textContent = "";
    }

    const next = styleConfig.slice(renderCount, renderCount + BATCH_SIZE);
    next.forEach((style) => fontGrid.appendChild(buildCard(style, source)));
    renderCount += next.length;
    loadingMore.hidden = renderCount >= styleConfig.length;
}

function showToast(text) {
    copyToast.textContent = text;
    copyToast.classList.remove("show");
    // Restart animation so each copy action feels immediate.
    void copyToast.offsetWidth;
    copyToast.classList.add("show");
}

function onInputChange() {
    const value = sourceText.value;
    charCount.textContent = `${value.length} / 280`;
    if (value === lastInput) return;
    lastInput = value;
    renderChunk(true);
}

function setupLazyLoading() {
    window.addEventListener("scroll", () => {
        const nearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 180;
        if (!nearBottom) return;
        if (renderCount >= styleConfig.length) return;
        loadingMore.hidden = false;
        renderChunk(false);
    });
}

function init() {
    sourceText.addEventListener("input", onInputChange);
    renderChunk(true);
    setupLazyLoading();
}

init();
