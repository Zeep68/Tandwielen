const gears = [
    { id: 1,  src: 'gear25.png',          teeth: 25, x: 490, y: 420, direction: 1, alignWith: 2 },
    { id: 2,  src: 'gear57org.png',     teeth: 57, x: 600, y: 303, direction: -1, syncWith: 1,  alignWith: 1 },
    { id: 3,  src: 'gear10t.png',        teeth: 10, x: 850, y: 300, direction:  1, syncWith: 2,  coaxial: true },
    { id: 4,  src: 'gear12.png',        teeth: 12, x: 650, y: 450, direction: -1, syncWith: 3,  belt: true },
    { id: 5,  src: 'gear24-12org.png',  teeth: 24, x: 727, y: 151, direction:  1, syncWith: 4,  coaxial: true, alignWith: 6 },
    { id: 6,  src: 'gear16org.png',     teeth: 16, x: 656, y: 150, direction: -1, syncWith: 5,  alignWith: 5 },
    { id: 7,  src: 'gear25bovenorg.png',teeth: 25, x: 562, y: 182, direction:  1, syncWith: 6,  alignWith: 8 },
    { id: 8,  src: 'gear189org.png',    teeth: 18, x: 512, y: 126, direction: -1, syncWith: 7,  alignWith: 7 },
    { id: 9,  src: 'gear199org.png',    teeth: 19, x: 381, y: 191, direction: -1, syncWith: 8,  coaxial: true, alignWith: 10 },
    { id: 10, src: 'gear369org.png',    teeth: 36, x: 222, y: 119, direction: -1, syncWith: 9,  alignWith: 9 },
    { id: 11, src: 'gear9a.png',        teeth:  9, x: 850, y: 300, direction:  1, syncWith: 10, coaxial: true },
    { id: 12, src: 'gear13.png',        teeth: 13, x: 150, y: 300, direction:  1, syncWith: 11, belt: true },
    { id: 13, src: 'gear2113.png',      teeth: 21, x: 215, y: 392, direction:  1, syncWith: 12, coaxial: true, alignWith: 14 },
    { id: 14, src: 'gear34org.png',     teeth: 34, x: 282, y: 442, direction: -1, syncWith: 13, alignWith: 13 },
    { id: 15, src: 'gear25linksorg.png',teeth: 25, x: 200, y: 551, direction:  1, syncWith: 14, alignWith: 14 },
];

const startAngles = {
    1:  -18.7,
    2: -124.8,
    5: -106.9,
    6:  141.0,
    7:  -68.6,
    8:  130.8,
    9:  133.4,
    10: -74.5,
    13: -55.1,
    14:  39.5,
    15: -44.8,
};

const gearSizes = {
    1: 125, 2: 272, 3: 45,  4: 60,  5: 123,
    6: 86,  7: 128, 8: 94,  9: 102, 10: 181,
    11: 45, 12: 65, 13: 107, 14: 170, 15: 128,
};

function getGearSize(gear) {
    return gearSizes[gear.id] || gear.teeth * 5;
}

const defaultPositions = {};
gears.forEach(g => { defaultPositions[g.id] = { x: g.x, y: g.y }; });

let isRotating = false;
const rotations = {};
const lockedGears = new Set();
const drivingGearId = 1;
let speedFactor = 1;
let globalDirection = 1;
let lastTime = 0;
let animationFrame;
let overlayCanvas, ctx;

function initCanvas() {
    const container = document.getElementById('gear-container');
    overlayCanvas = document.createElement('canvas');
    overlayCanvas.id = 'gear-canvas';
    overlayCanvas.style.position = 'absolute';
    overlayCanvas.style.top = '0';
    overlayCanvas.style.left = '0';
    overlayCanvas.style.pointerEvents = 'none';
    overlayCanvas.style.zIndex = '100';
    container.appendChild(overlayCanvas);
    resizeCanvas();
}

function resizeCanvas() {
    if (!overlayCanvas) return;
    overlayCanvas.width  = 1400;
    overlayCanvas.height = 1000;
}

function gearCenter(gear) {
    const img = document.getElementById(`gear-${gear.id}`);
    const actualSize = getGearSize(gear);
    const radius = actualSize / 2;
    const x = parseInt(img ? img.style.left : gear.x) + radius;
    const y = parseInt(img ? img.style.top  : gear.y) + radius;
    return { x, y, radius };
}

function getTotalAngle(gearId) {
    return (rotations[gearId]?.angle || 0) + (startAngles[gearId] || 0);
}

function normalizeAngle(deg) {
    return ((deg % 360) + 360) % 360;
}

function drawLines() {
    if (!ctx) return;
    ctx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);

    gears.forEach(gear => {
        if (gear.visible === false) return;
        if (!gear.alignWith) return;
        const partner = gears.find(g => g.id === gear.alignWith);
        if (!partner) return;

        const cA     = gearCenter(gear);
        const cB     = gearCenter(partner);
        const locked = lockedGears.has(gear.id);

        const totalAngle = getTotalAngle(gear.id);
        const dist = Math.sqrt((cB.x - cA.x) ** 2 + (cB.y - cA.y) ** 2);
        const rad  = totalAngle * Math.PI / 180;
        const endX = cA.x + Math.cos(rad) * dist;
        const endY = cA.y + Math.sin(rad) * dist;

        const color = locked ? '#00cc44' : '#1a73e8';
        ctx.strokeStyle = color;
        ctx.lineWidth   = locked ? 4 : 2;
        ctx.globalAlpha = 0.9;

        ctx.beginPath();
        ctx.moveTo(cA.x, cA.y);
        ctx.lineTo(endX, endY);
        ctx.stroke();

        const arrowSize  = locked ? 14 : 10;
        const arrowAngle = Math.PI / 6;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(endX, endY);
        ctx.lineTo(endX - arrowSize * Math.cos(rad - arrowAngle), endY - arrowSize * Math.sin(rad - arrowAngle));
        ctx.lineTo(endX - arrowSize * Math.cos(rad + arrowAngle), endY - arrowSize * Math.sin(rad + arrowAngle));
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.arc(cB.x, cB.y, 6, 0, Math.PI * 2);
        ctx.strokeStyle = '#ffaa00';
        ctx.lineWidth = 2;
        ctx.stroke();

        if (locked) {
            const angle = (normalizeAngle(totalAngle) + 90) % 360;  // canvas→kompas: +90°
            const labelDist = 22;
            const labelX = endX + Math.cos(rad) * labelDist;
            const labelY = endY + Math.sin(rad) * labelDist;
            ctx.font = 'bold 16px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            const text = `${angle.toFixed(1)}°`;
            const textWidth = ctx.measureText(text).width;
            ctx.fillStyle = 'rgba(255,255,255,0.85)';
            ctx.fillRect(labelX - textWidth/2 - 4, labelY - 10, textWidth + 8, 20);
            ctx.fillStyle = '#00aa33';
            ctx.fillText(text, labelX, labelY);
            ctx.textAlign = 'start';
            ctx.textBaseline = 'alphabetic';
        }
    });

    ctx.globalAlpha = 1;
}

function saveAsDefault() {
    gears.forEach(gear => {
        const img = document.getElementById(`gear-${gear.id}`);
        if (img) {
            gear.x = parseInt(img.style.left, 10);
            gear.y = parseInt(img.style.top,  10);
            defaultPositions[gear.id] = { x: gear.x, y: gear.y };
        }
    });
    savePositions();
    showAnglesPanel('Huidige posities opgeslagen als standaard!');
    setTimeout(() => { const p = document.getElementById('angles-panel'); if (p) p.remove(); }, 2000);
}

function showAnglesPanel(text) {
    let panel = document.getElementById('angles-panel');
    if (!panel) {
        panel = document.createElement('div');
        panel.id = 'angles-panel';
        Object.assign(panel.style, {
            position: 'fixed', bottom: '20px', right: '20px',
            background: 'rgba(255,255,255,0.95)', border: '2px solid #00aa33',
            borderRadius: '8px', padding: '12px 16px', fontFamily: 'monospace',
            fontSize: '14px', color: '#00aa33', zIndex: '9999',
            maxWidth: '300px', whiteSpace: 'pre-line',
            boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
        });
        document.body.appendChild(panel);
    }
    panel.innerHTML = text.replace(/\n/g, '<br>') +
        '<br><span style="cursor:pointer;color:#999;float:right" onclick="document.getElementById(\'angles-panel\').remove()">✕ sluit</span>';
}

function freezeAll() {
    stopRotation();
    let output = 'Gradenstanden van groene lijnen:\n\n';
    gears.forEach(gear => {
        if (gear.visible === false || !gear.alignWith) return;
        rotations[gear.id].locked = true;
        lockedGears.add(gear.id);
        output += `Tandwiel ${gear.id}: ${((normalizeAngle(getTotalAngle(gear.id)) + 90) % 360).toFixed(1)}°\n`;
    });
    drawLines();
    showAnglesPanel(output);
}

function renderGears() {
    const container = document.getElementById('gear-container');
    Array.from(container.children).forEach(c => {
        if (c.id !== 'gear-canvas') container.removeChild(c);
    });

    const base = window.GEAR_IMAGE_BASE || 'images/';

    gears.forEach(gear => {
        const actualSize = getGearSize(gear);

        const img = document.createElement('img');
        img.id  = `gear-${gear.id}`;
        img.src = base + gear.src;
        img.classList.add('gear');
        Object.assign(img.style, {
            width: `${actualSize}px`, height: `${actualSize}px`,
            left: `${gear.x}px`,     top: `${gear.y}px`,
            position: 'absolute',
        });

        const label = document.createElement('span');
        label.classList.add('gear-label');
        label.dataset.id  = gear.id;
        label.textContent = `ID: ${gear.id}`;
        Object.assign(label.style, {
            position: 'absolute', display: 'none',
            left: `${gear.x}px`, top: `${gear.y - 20}px`,
            zIndex: '50',
        });

        if (gear.visible === false) {
            img.style.display   = 'none';
            label.style.display = 'none';
        }

        if ([4, 12].includes(gear.id)) {
            img.style.zIndex   = '200';
            label.style.zIndex = '201';
        }

        container.appendChild(img);
        container.appendChild(label);
        rotations[gear.id] = { angle: 0, locked: false };
    });

    if (overlayCanvas) container.appendChild(overlayCanvas);

    // Gears 4 en 12 naar voren halen door ze achteraan de DOM te zetten (na overlay canvas)
    [4, 12].forEach(id => {
        const img   = document.getElementById(`gear-${id}`);
        const label = document.querySelector(`.gear-label[data-id="${id}"]`);
        if (img)   { img.style.zIndex = '200';   container.appendChild(img);   }
        if (label) { label.style.zIndex = '201'; container.appendChild(label); }
    });

    drawLines();
}

function savePositions() {
    const positions = {};
    gears.forEach(gear => {
        const img = document.getElementById(`gear-${gear.id}`);
        if (img) positions[gear.id] = { x: parseInt(img.style.left, 10), y: parseInt(img.style.top, 10) };
    });
    localStorage.setItem('gearPositions', JSON.stringify(positions));
}

function loadPositions() {
    const saved = JSON.parse(localStorage.getItem('gearPositions') || 'null');
    if (saved) gears.forEach(gear => {
        if (saved[gear.id]) { gear.x = saved[gear.id].x; gear.y = saved[gear.id].y; }
    });
}

function resetPositions() {
    stopRotation();
    localStorage.removeItem('gearPositions');
    lockedGears.clear();
    gears.forEach(gear => {
        gear.x = defaultPositions[gear.id].x;
        gear.y = defaultPositions[gear.id].y;
        rotations[gear.id] = { angle: 0, locked: false };
        const img = document.getElementById(`gear-${gear.id}`);
        if (img) { img.style.left = `${gear.x}px`; img.style.top = `${gear.y}px`; img.style.transform = 'rotate(0deg)'; }
        const lbl = document.querySelector(`.gear-label[data-id="${gear.id}"]`);
        if (lbl) { lbl.style.left = `${gear.x}px`; lbl.style.top = `${gear.y - 20}px`; }
    });
    drawLines();
}

function getParentGear(gear) {
    if (gear.syncWith) return gears.find(g => g.id === gear.syncWith);
    return gears.find(g => g.id === drivingGearId);
}

function calculateRotations() {
    const driving = gears.find(g => g.id === drivingGearId);
    const omega0  = 2 * Math.PI * 0.04;
    rotations[driving.id] = { ...rotations[driving.id], omega: omega0, direction: driving.direction * globalDirection };
    gears.forEach(gear => {
        if (gear.id === drivingGearId) return;
        const parent = getParentGear(gear);
        const pr = rotations[parent.id];
        rotations[gear.id] = {
            ...rotations[gear.id],
            omega:     pr ? (gear.coaxial ? pr.omega : pr.omega * (parent.teeth / gear.teeth))
                          : omega0 * (driving.teeth / gear.teeth),
            direction: pr ? pr.direction * (gear.belt || gear.coaxial ? 1 : -1) * (gear.flip ? -1 : 1)
                          : gear.direction * globalDirection,
        };
    });
}

function startRotation() {
    lockedGears.clear();
    gears.forEach(g => { if (rotations[g.id]) rotations[g.id].locked = false; });
    isRotating = true;
    calculateRotations();
    lastTime = performance.now();
    animationFrame = requestAnimationFrame(animate);
}

function stopRotation() {
    isRotating = false;
    cancelAnimationFrame(animationFrame);
}

function animate(time) {
    const delta = (time - lastTime) / 1000;
    lastTime = time;
    gears.forEach(gear => {
        const rot = rotations[gear.id];
        if (rot && !rot.locked) {
            rot.angle = (rot.angle || 0) + (rot.omega * delta * rot.direction * speedFactor) * (180 / Math.PI);
            const img = document.getElementById(`gear-${gear.id}`);
            if (img) img.style.transform = `rotate(${rot.angle % 360}deg)`;
        }
    });
    drawLines();
    if (isRotating) animationFrame = requestAnimationFrame(animate);
}

function makeDraggable() {
    document.querySelectorAll('.gear').forEach(gearEl => {
        gearEl.addEventListener('mousedown', e => {
            const rect = gearEl.getBoundingClientRect();
            const offsetX = e.clientX - rect.left;
            const offsetY = e.clientY - rect.top;
            const move = ev => {
                const container = document.getElementById('gear-container');
                const cRect = container.getBoundingClientRect();
                const x = ev.clientX - cRect.left - offsetX;
                const y = ev.clientY - cRect.top  - offsetY;
                gearEl.style.left = `${x}px`;
                gearEl.style.top  = `${y}px`;
                const id = parseInt(gearEl.id.split('-')[1], 10);
                const lbl = document.querySelector(`.gear-label[data-id="${id}"]`);
                if (lbl) { lbl.style.left = `${x}px`; lbl.style.top = `${y - 20}px`; }
                drawLines();
            };
            const stop = () => {
                savePositions();
                document.removeEventListener('mousemove', move);
                document.removeEventListener('mouseup',   stop);
            };
            document.addEventListener('mousemove', move);
            document.addEventListener('mouseup',   stop);
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    loadPositions();
    initCanvas();
    ctx = overlayCanvas.getContext('2d');
    renderGears();
    makeDraggable();

    document.getElementById('startButton').addEventListener('click', startRotation);
    document.getElementById('stopButton').addEventListener('click', freezeAll);
    document.getElementById('increaseSpeedButton').addEventListener('click', () => { speedFactor *= 1.2; });
    document.getElementById('decreaseSpeedButton').addEventListener('click', () => { speedFactor /= 1.2; });
    document.getElementById('reverseButton').addEventListener('click', () => {
        globalDirection *= -1;
        if (isRotating) { stopRotation(); startRotation(); } else calculateRotations();
    });
    document.getElementById('resetButton').addEventListener('click', resetPositions);
    const saveBtn = document.getElementById('saveDefaultButton');
    if (saveBtn) saveBtn.addEventListener('click', saveAsDefault);
});
