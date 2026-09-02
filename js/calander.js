// Custom calendar web component.
// Notes:
// - Uses JSON data loaded from /js/date.json for day notes and recurring events.
// - Supports yearly and monthly recurring notes.
// - Day hover shows note details in the footer.
const calStyle = document.createElement("style");
calStyle.type = "text/css";
calStyle.innerText = `
    .osr-calendar {
        display: inline-block;
        background: var(--warning_col, #000000);
        color: #00000;
        border: var(--border_thckn, 2px) solid var(--border_col, #0000007e);
        font-family: monospace;
        padding: 5px;
        width: 100%;
        box-sizing: border-box;
        box-shadow: 4px 4px 0px #00000038;
        border-radius: 4px;
        background: url("/images/cloud_bg.jpg");
    }
    .osr-cal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
        font-weight: bold;
       
        padding-bottom: 5px;
    }
    .osr-cal-btn {
        background:  #8bb9cd;
        color: var(--buttontxt_col, #ffffff);
        border: 1px solid #002c4f;
        cursor: pointer;
        padding: 2px 8px;
        font-family: monospace;
        font-weight: bold;
        border-radius: 2px;
         background: url("/images/cloud_bg.jpg");
         filter: sepia(.2) hue-rotate(3deg);
    }
    .osr-cal-btn:hover {
        background: var(--warningtxt_col, #ffffff);
        color: var(--warning_col, #000000);
    }
    .osr-cal-grid {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: 4px;
        text-align: center;
    }
    .osr-cal-day-name {
        font-size: 0.8rem;
        color: #000000;
        padding-bottom: 4px;
        font-weight:450;
        
    }
    .osr-cal-day {
        padding: 6px 0;
        font-size: 0.9rem;
        background: var(#ffffff, #bef0e6);
        color: var(--warning_col, #000000);
        border: 1px solid var(--border_col, #00000038);
        border-radius: 2.3px;
    }
    .osr-cal-day.empty {
        background: transparent;
        border: none;
    }
    .osr-cal-day.today {
        background: #ffffff5f;
    
        font-weight: bold;
        border: 1px solid var(--warning_col, #000000);
    }
    .osr-cal-day.has-note {
        border-color: #ffffff;
        color:white;
        
        cursor: pointer;
        font-weight: 900;
    }
    .osr-cal-day.has-note::after {
        content: '.';
        display: block;
        color: #ffffff;
        line-height: 0;
        font-size: 20px;
    }
    .osr-cal-footer {
        margin-top: 10px;
        font-size: 0.8rem;
        color: #ffffff;
        min-height: 1.2rem;
        border-top: 1px dashed var(--border_col, #ffffff);
        padding-top: 5px;
        word-break: break-word;
        font-weight:900;
        
    }
    .osr-cal-event-list {
        margin: 0;
        padding-left: 15px;
        list-style-type: square;
    }
    .osr-cal-event-item {
        margin-bottom: 2px;
    }
`;
document.head.appendChild(calStyle);

class CustomCalendar extends HTMLElement {
    constructor() {
        super();
        this.notes = {};
        this.recurring = {};

        const now = new Date();
        this.currentYear = parseInt(this.getAttribute('year')) || now.getFullYear();
        this.currentMonth = this.getAttribute('month') ? parseInt(this.getAttribute('month')) - 1 : now.getMonth();

        // Placeholder content until event data is loaded.
        this.innerHTML = `<div class="osr-calendar"><div class="osr-cal-header"><span>Loading dates...</span></div></div>`;

        // Load calendar notes from a local JSON file.
        fetch('/js/date.json')
            .then(res => res.json())
            .then(data => {
                this.notes = data.notes || {};
                this.recurring = data.recurring || {};
                this.render();
            })
            .catch(err => {
                console.error("Failed to load /js/date.json:", err);
                this.render();
            });
    }

    render() {
        const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
        const dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
        const now = new Date();

        this.className = 'osr-calendar';

        // Render month navigation and day headings.
        let html = `
            <div class="osr-cal-header">
                <button class="osr-cal-btn" id="prev-month">&lt;</button>
                <span>[ ${monthNames[this.currentMonth]} ${this.currentYear} ]</span>
                <button class="osr-cal-btn" id="next-month">&gt;</button>
            </div>
            <div class="osr-cal-grid">
        `;

        dayNames.forEach(d => {
            html += `<div class="osr-cal-day-name">${d}</div>`;
        });

        const firstDayIndex = new Date(this.currentYear, this.currentMonth, 1).getDay();
        const totalDays = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();

        for (let i = 0; i < firstDayIndex; i++) {
            html += `<div class="osr-cal-day empty"></div>`;
        }

        for (let day = 1; day <= totalDays; day++) {
            const formattedMonth = String(this.currentMonth + 1).padStart(2, '0');
            const formattedDay = String(day).padStart(2, '0');
            const dateKey = `${this.currentYear}-${formattedMonth}-${formattedDay}`;
            const yearlyKey = `${formattedMonth}-${formattedDay}`;
            const monthlyKey = `${formattedDay}`;

            

            // Collecting matching notes --> exact date, yearly recurring, and monthly recurring notes.
            let eventList = [];

            if (this.notes[dateKey]) {
                const val = this.notes[dateKey];
                eventList = eventList.concat(Array.isArray(val) ? val : [val]);
            }
            if (this.recurring.yearly?.[yearlyKey]) {
                const val = this.recurring.yearly[yearlyKey];
                eventList = eventList.concat(Array.isArray(val) ? val : [val]);
            }
            if (this.recurring.monthly?.[monthlyKey]) {
                const val = this.recurring.monthly[monthlyKey];
                eventList = eventList.concat(Array.isArray(val) ? val : [val]);
            }

            const isToday = day === now.getDate() && this.currentMonth === now.getMonth() && this.currentYear === now.getFullYear();
            const hasNote = eventList.length > 0 ? 'has-note' : '';
            const todayClass = isToday ? 'today' : '';

            // Store JSON-encoded events safely inside a data attribute
            const encodedEvents = encodeURIComponent(JSON.stringify(eventList));
            html += `<div class="osr-cal-day ${todayClass} ${hasNote}" data-events="${encodedEvents}">${day}</div>`;
        }

        html += `</div><div class="osr-cal-footer"></div>`;
        this.innerHTML = html;

        this.querySelector('#prev-month').addEventListener('click', () => {
            this.currentMonth--;
            if (this.currentMonth < 0) {
                this.currentMonth = 11;
                this.currentYear = Math.max(2026, this.currentYear - 1);
            }
            this.render();
        });

        this.querySelector('#next-month').addEventListener('click', () => {
            this.currentMonth++;
            if (this.currentMonth > 11) {
                this.currentMonth = 0;
                this.currentYear++;
            }
            this.render();
        });

        const footer = this.querySelector('.osr-cal-footer');

        // Attach hover behavior for days that have notes.
        this.querySelectorAll('.osr-cal-day.has-note').forEach(dayEl => {
            dayEl.addEventListener('mouseenter', () => {
                try {
                    const events = JSON.parse(decodeURIComponent(dayEl.getAttribute('data-events')));
                    if (events.length === 1) {
                        footer.textContent = `> ${events[0]}`;
                    } else if (events.length > 1) {
                        let listHtml = `<ul class="osr-cal-event-list">`;
                        events.forEach(ev => {
                            listHtml += `<li class="osr-cal-event-item">${ev}</li>`;
                        });
                        listHtml += `</ul>`;
                        footer.innerHTML = `> Multiple:`;

                        const ulContainer = document.createElement('div');
                        ulContainer.innerHTML = listHtml;
                        footer.appendChild(ulContainer);
                    }
                } catch (e) {
                    footer.textContent = '> [Error loading events]';
                }
            });
            dayEl.addEventListener('mouseleave', () => {
                footer.textContent = '';
            });
        });
    }
}

if (!customElements.get('custom-calendar')) {
    customElements.define('custom-calendar', CustomCalendar);
}