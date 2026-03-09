// Ex7: dates.js migrat a mòdul ES6 (export)

export function getDates() {
    const dates = [];
    const start = new Date("2025-01-01T00:00:00Z");
    for (let i = 0; i < 365; i++) {
        const d = new Date(start);
        d.setUTCDate(start.getUTCDate() + i);
        dates.push(d.toISOString().slice(0, 10));
    }
    return dates;
}

export function getSelectValues(selectNode) {
    return Array.from(selectNode.selectedOptions).map(opt => opt.value);
}
