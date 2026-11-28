
/*
 * LAUNDRAFLOW ADMINISTRATOR DASHBOARD
 * 
 * This prototype uses sample data stored in JavaScript.
 * PHP and MySQL integration will be needed for actual records.
 */

const state = {
    orders: [
        {
            id: "LF-1001",
            customer: "Maria Santos",
            service: "Cloth Laundry",
            date: "2026-11-27",
            status: "Washing",
            bin: "BIN-01",
            updated: "Laundry cycle started"
        },
        {
            id: "LF-1002",
            customer: "John Reyes",
            service: "Wash and Fold",
            date: "2026-11-27",
            status: "Drying",
            bin: "BIN-02",
            updated: "Moved to drying"
        },
        {
            id: "LF-1003",
            customer: "Ana Cruz",
            service: "Cloth Laundry",
            date: "2026-11-27",
            status: "Ready for pick-up",
            bin: "BIN-03",
            updated: "Ready for customer pick-up"
        },
        {
            id: "LF-1004",
            customer: "Mark Dela Cruz",
            service: "Cloth Ironing",
            date: "2026-11-28",
            status: "Received",
            bin: null,
            updated: "Order received"
        },
        {
            id: "LF-1005",
            customer: "Bea Lim",
            service: "Wash and Fold",
            date: "2026-11-26",
            status: "Completed",
            bin: null,
            updated: "Order completed"
        },
        {
            id: "LF-1006",
            customer: "Paolo Garcia",
            service: "Cloth Laundry",
            date: "2026-11-28",
            status: "Washing",
            bin: "BIN-04",
            updated: "Washing in progress"
        }
    ],

    bins: Array.from({ length: 8 }, (_, i) => ({
        id: `BIN-${String(i + 1).padStart(2, "0")}`,
        status: "Empty",
        orderId: null
    })),

    services: [
        {
            name: "Cloth Laundry",
            description: "Standard washing service for everyday garments.",
            price: "Set by administrator",
            active: true
        },
        {
            name: "Cloth Ironing",
            description: "Ironing service to make garments neat and presentable.",
            price: "Set by administrator",
            active: true
        },
        {
            name: "Wash and Fold",
            description: "Laundry washing and folding for convenient collection.",
            price: "Set by administrator",
            active: true
        }
    ],

    activity: []
};


// INITIALIZE STORAGE BINS

state.orders.forEach(order => {
    if (order.bin) {
        const bin = state.bins.find(
            item => item.id === order.bin
        );

        if (bin) {
            bin.orderId = order.id;

            bin.status =
                order.status === "Ready for pick-up"
                    ? "Ready for pick-up"
                    : "Occupied";
        }
    }
});


// CONFIGURATION

const statusOptions = [
    "Received",
    "Washing",
    "Drying",
    "Ready for pick-up",
    "Completed"
];

const viewInfo = {
    overview: [
        "OVERVIEW",
        "Dashboard Overview",
        "Monitor laundry activity and storage availability in one place."
    ],

    orders: [
        "OPERATIONS",
        "Laundry Orders",
        "Manage laundry cycles and update their progress."
    ],

    storage: [
        "STORAGE MANAGEMENT",
        "Storage Bin Management",
        "Review availability and assign bins to laundry orders."
    ],

    customers: [
        "CUSTOMER RECORDS",
        "Customers",
        "Review customer records associated with laundry orders."
    ],

    services: [
        "SERVICE MANAGEMENT",
        "Laundry Services",
        "Review the services currently listed in this dashboard prototype."
    ],

    reports: [
        "REPORTING",
        "Reports & History",
        "Review order-status summaries and export the sample records."
    ],

    settings: [
        "SYSTEM",
        "Administrator Settings",
        "Review dashboard configuration and integration notes."
    ]
};


// HELPER FUNCTIONS

const $ = (selector, root = document) =>
    root.querySelector(selector);

const $$ = (selector, root = document) =>
    [...root.querySelectorAll(selector)];

const escapeHtml = value =>
    String(value).replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    }[char]));

const fmtDate = value =>
    new Date(`${value}T00:00:00`).toLocaleDateString(
        "en-PH",
        {
            month: "short",
            day: "numeric",
            year: "numeric"
        }
    );

let activeView = "overview";
let toastTimeout;


// ORDER STATUS COLORS

function statusClass(status) {
    return {
        "Received": "status-received",
        "Washing": "status-washing",
        "Drying": "status-drying",
        "Ready for pick-up": "status-ready",
        "Completed": "status-completed"
    }[status] || "status-completed";
}


// STORAGE STATUS COLORS

function binClass(status) {
    return status === "Empty"
        ? "empty"
        : status === "Occupied"
            ? "occupied"
            : "ready";
}


// NOTIFICATION MESSAGE

function showToast(message) {
    const toast = $("#toast");

    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(toastTimeout);

    toastTimeout = setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}


// MODAL FUNCTIONS

function openModal(id) {
    const modal = document.getElementById(id);

    if (!modal) return;

    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");

    const focusable = $("input, select, button", modal);

    if (focusable) {
        setTimeout(() => focusable.focus(), 50);
    }
}

function closeModal(id) {
    const modal = document.getElementById(id);

    if (!modal) return;

    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
}


// DASHBOARD NAVIGATION

function goToView(view) {
    if (!viewInfo[view]) return;

    activeView = view;

    $$(".view-section").forEach(section => {
        section.classList.toggle(
            "active",
            section.id === `view-${view}`
        );
    });

    $$(".nav-item[data-view]").forEach(button => {
        button.classList.toggle(
            "active",
            button.dataset.view === view
        );
    });

    $("#pageEyebrow").textContent = viewInfo[view][0];
    $("#pageTitle").textContent = viewInfo[view][1];
    $("#pageSubtitle").textContent = viewInfo[view][2];

    $("#globalSearch").placeholder =
        view === "customers"
            ? "Search customers..."
            : view === "storage"
                ? "Search storage bins..."
                : "Search orders...";

    $("#globalSearch").value = "";

    applySearch("");

    closeSidebar();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


// MOBILE SIDEBAR

function openSidebar() {
    $("#sidebar").classList.add("open");
    $("#sidebarBackdrop").classList.add("open");
}

function closeSidebar() {
    $("#sidebar").classList.remove("open");
    $("#sidebarBackdrop").classList.remove("open");
}


// ORDER STATUS DROPDOWN

function orderStatusSelect(order) {
    return `
        <select
            class="status-select"
            aria-label="Update status for ${escapeHtml(order.id)}"
            data-order-status="${escapeHtml(order.id)}">

            ${statusOptions.map(status => `
                <option ${status === order.status ? "selected" : ""}>
                    ${status}
                </option>
            `).join("")}

        </select>
    `;
}


// DASHBOARD ORDER ROW

function overviewOrderRow(order) {
    return `
        <tr class="searchable-row"
            data-search-text="${escapeHtml(
                `${order.id} ${order.customer} ${order.service} ${order.status} ${order.bin || "No bin"}`.toLowerCase()
            )}">

            <td>
                <span class="order-id">
                    ${escapeHtml(order.id)}
                </span>
            </td>

            <td>
                <span class="customer-name">
                    ${escapeHtml(order.customer)}
                </span>
            </td>

            <td class="cell-muted">
                ${escapeHtml(order.service)}
            </td>

            <td>
                <span class="status-pill ${statusClass(order.status)}">
                    ${escapeHtml(order.status)}
                </span>
            </td>

            <td>
                ${order.bin
                    ? `<span class="bin-code">${escapeHtml(order.bin)}</span>`
                    : `<span class="bin-empty-text">Not assigned</span>`
                }
            </td>

        </tr>
    `;
}


// ALL ORDERS TABLE

function allOrderRow(order) {

    const storageAction = order.bin
        ? `<span class="bin-code">${escapeHtml(order.bin)}</span>`
        : `<button class="small-action" data-assign-order="${escapeHtml(order.id)}">Assign bin</button>`;

    return `
        <tr class="searchable-row"
            data-search-text="${escapeHtml(
                `${order.id} ${order.customer} ${order.service} ${order.status} ${order.bin || "No bin"}`.toLowerCase()
            )}">

            <td>
                <span class="order-id">
                    ${escapeHtml(order.id)}
                </span>
            </td>

            <td>
                <span class="customer-name">
                    ${escapeHtml(order.customer)}
                </span>
            </td>

            <td class="cell-muted">
                ${escapeHtml(order.service)}
            </td>

            <td class="cell-muted">
                ${fmtDate(order.date)}
            </td>

            <td>
                ${orderStatusSelect(order)}
            </td>

            <td>
                ${storageAction}
            </td>

            <td>
                <button class="small-action"
                    data-view-order="${escapeHtml(order.id)}">
                    Details
                </button>
            </td>

        </tr>
    `;
}


// STORAGE BIN COUNTS

function storageCounts() {
    return {
        empty: state.bins.filter(
            bin => bin.status === "Empty"
        ).length,

        occupied: state.bins.filter(
            bin => bin.status === "Occupied"
        ).length,

        ready: state.bins.filter(
            bin => bin.status === "Ready for pick-up"
        ).length
    };
}


// STORAGE SUMMARY

function renderStorageSummary(targetId) {
    const counts = storageCounts();
    const target = document.getElementById(targetId);

    target.innerHTML = `
        <div class="storage-stat empty">
            <strong>${counts.empty}</strong>
            <span>Empty</span>
        </div>

        <div class="storage-stat occupied">
            <strong>${counts.occupied}</strong>
            <span>Occupied</span>
        </div>

        <div class="storage-stat ready">
            <strong>${counts.ready}</strong>
            <span>Ready for pick-up</span>
        </div>
    `;
}


// DASHBOARD STORAGE GRID

function renderBinMiniGrid() {

    $("#overviewBinGrid").innerHTML =
        state.bins.map(bin => `
            <div class="bin-tile ${binClass(bin.status)}"
                title="${escapeHtml(bin.id)}: ${escapeHtml(bin.status)}">

                <strong>${escapeHtml(bin.id)}</strong>

                <span>
                    ${bin.status === "Ready for pick-up"
                        ? "Ready"
                        : escapeHtml(bin.status)}
                </span>

            </div>
        `).join("");
}


// STORAGE MANAGEMENT

function renderManagementBins() {

    $("#managementBinGrid").innerHTML =
        state.bins.map(bin => {

            const order = state.orders.find(
                item => item.id === bin.orderId
            );

            const detail = bin.status === "Empty"
                ? "Available for assignment"
                : order
                    ? `${order.id} · ${order.customer}`
                    : "Assigned storage bin";

            const action = bin.status === "Empty"
                ? `<button class="small-action" data-assign-bin="${bin.id}">Assign this bin</button>`
                : `<button class="small-action" data-bin-details="${bin.id}">View details</button>`;

            return `
                <article
                    class="bin-card ${binClass(bin.status)} searchable-row"
                    data-search-text="${escapeHtml(
                        `${bin.id} ${bin.status} ${detail}`.toLowerCase()
                    )}">

                    <div class="bin-card-top">
                        <strong>${escapeHtml(bin.id)}</strong>

                        <span class="status-pill ${
                            bin.status === "Empty"
                                ? "status-completed"
                                : bin.status === "Occupied"
                                    ? "status-washing"
                                    : "status-ready"
                        }">
                            ${escapeHtml(bin.status)}
                        </span>
                    </div>

                    <p>${escapeHtml(detail)}</p>

                    ${action}

                </article>
            `;
        }).join("");
}


// CUSTOMER RECORDS

function renderCustomers() {

    const map = new Map();

    state.orders.forEach(order => {

        if (!map.has(order.customer)) {
            map.set(order.customer, []);
        }

        map.get(order.customer).push(order);
    });

    const customers = [...map.entries()].sort(
        (a, b) => a[0].localeCompare(b[0])
    );

    $("#customerRows").innerHTML = customers.length
        ? customers.map(([name, orders]) => {

            const active = orders.filter(
                order => order.status !== "Completed"
            ).length;

            const latest = [...orders].sort(
                (a, b) => b.date.localeCompare(a.date)
            )[0];

            return `
                <tr class="searchable-row"
                    data-search-text="${escapeHtml(
                        `${name} ${orders.length} ${latest.id}`.toLowerCase()
                    )}">

                    <td>
                        <span class="customer-name">
                            ${escapeHtml(name)}
                        </span>
                    </td>

                    <td>${orders.length}</td>

                    <td>${active}</td>

                    <td>
                        <span class="order-id">
                            ${escapeHtml(latest.id)}
                        </span>

                        <span class="cell-muted">
                            · ${fmtDate(latest.date)}
                        </span>
                    </td>

                </tr>
            `;

        }).join("")

        : `
            <tr>
                <td colspan="4" class="empty-state">
                    No customer records yet.
                </td>
            </tr>
        `;
}


// LAUNDRY SERVICES

function renderServices() {

    const icons = [
        "i-shirt",
        "i-activity",
        "i-washer"
    ];

    $("#serviceCards").innerHTML =
        state.services.map((service, index) => `
            <article class="service-card">

                <div class="service-icon">
                    <svg>
                        <use href="#${icons[index % icons.length]}"/>
                    </svg>
                </div>

                <h3>${escapeHtml(service.name)}</h3>

                <p>${escapeHtml(service.description)}</p>

                <div class="service-card-footer">

                    <span class="service-price">
                        ${escapeHtml(service.price)}
                    </span>

                    <button
                        class="toggle-button ${service.active ? "" : "is-off"}"
                        data-toggle-service="${index}">

                        ${service.active ? "Active" : "Inactive"}

                    </button>

                </div>

            </article>
        `).join("");
}


// REPORTS AND HISTORY

function renderReports() {

    const counts = Object.fromEntries(
        statusOptions.map(status => [
            status,
            state.orders.filter(
                order => order.status === status
            ).length
        ])
    );

    const completed = counts.Completed;

    const active = counts.Washing + counts.Drying;

    const total = state.orders.length;

    $("#reportMetrics").innerHTML = `

        <div class="report-metric">
            <span>Total recorded orders</span>
            <strong>${total}</strong>
        </div>

        <div class="report-metric">
            <span>Active laundry cycles</span>
            <strong>${active}</strong>
        </div>

        <div class="report-metric">
            <span>Ready for pick-up</span>
            <strong>${counts["Ready for pick-up"]}</strong>
        </div>

        <div class="report-metric">
            <span>Completed orders</span>
            <strong>${completed}</strong>
        </div>
    `;


    $("#reportBars").innerHTML =
        statusOptions.map(status => {

            const count = counts[status];

            const width = total
                ? count / total * 100
                : 0;

            return `
                <div class="report-bar-row">

                    <span>${escapeHtml(status)}</span>

                    <div class="report-bar-track">
                        <div class="report-bar-fill"
                            style="width:${width}%">
                        </div>
                    </div>

                    <span class="report-bar-value">
                        ${count}
                    </span>

                </div>
            `;
        }).join("");


    $("#reportOrderRows").innerHTML =
        [...state.orders].reverse().map(order => `

            <tr class="searchable-row"
                data-search-text="${escapeHtml(
                    `${order.id} ${order.customer} ${order.service} ${order.status} ${order.bin || "No bin"}`.toLowerCase()
                )}">

                <td>
                    <span class="order-id">
                        ${escapeHtml(order.id)}
                    </span>
                </td>

                <td>${escapeHtml(order.customer)}</td>

                <td class="cell-muted">
                    ${escapeHtml(order.service)}
                </td>

                <td>
                    <span class="status-pill ${statusClass(order.status)}">
                        ${escapeHtml(order.status)}
                    </span>
                </td>

                <td>
                    ${order.bin ? escapeHtml(order.bin) : "-"}
                </td>

            </tr>

        `).join("");
}


// RECENT ACTIVITY

function renderActivity() {

    const entries = state.activity.slice(0, 3);

    if (!entries.length) {

        $("#recentActivity").innerHTML = `

            <div class="activity-item">
                <span class="activity-marker">
                    <svg><use href="#i-activity"/></svg>
                </span>

                <div>
                    <strong>Dashboard initialized</strong>
                    <small>Sample laundry and storage records loaded.</small>
                </div>
            </div>

            <div class="activity-item">
                <span class="activity-marker">
                    <svg><use href="#i-box"/></svg>
                </span>

                <div>
                    <strong>Storage status fetched</strong>
                    <small>8 sample storage bins are being displayed.</small>
                </div>
            </div>

            <div class="activity-item">
                <span class="activity-marker">
                    <svg><use href="#i-clipboard"/></svg>
                </span>

                <div>
                    <strong>Order list loaded</strong>
                    <small>Use order controls to test status updates.</small>
                </div>
            </div>

        `;

        return;
    }

    $("#recentActivity").innerHTML =
        entries.map(entry => `

            <div class="activity-item">

                <span class="activity-marker">
                    <svg><use href="#i-activity"/></svg>
                </span>

                <div>
                    <strong>${escapeHtml(entry.title)}</strong>

                    <small>
                        ${escapeHtml(entry.detail)}
                        · ${escapeHtml(entry.time)}
                    </small>
                </div>

            </div>

        `).join("");
}


// MAIN DASHBOARD OVERVIEW

function renderOverview() {

    const counts = storageCounts();

    const active = state.orders.filter(
        order => ["Washing", "Drying"].includes(order.status)
    ).length;

    const pending = state.orders.filter(
        order => order.status === "Received"
    ).length;

    const ready = state.orders.filter(
        order => order.status === "Ready for pick-up"
    ).length;

    $("#metricActive").textContent = active;

    $("#metricPending").textContent = pending;

    $("#metricOccupied").textContent =
        counts.occupied + counts.ready;

    $("#metricStorageCaption").textContent =
        `${counts.occupied} occupied · ${counts.ready} ready for pick-up`;

    $("#metricReady").textContent = ready;

    $("#navOrderCount").textContent =
        state.orders.filter(
            order => order.status !== "Completed"
        ).length;

    $("#overviewOrderRows").innerHTML =
        state.orders
            .filter(order => order.status !== "Completed")
            .slice(0, 5)
            .map(overviewOrderRow)
            .join("")
        ||
        `
            <tr>
                <td colspan="5" class="empty-state">
                    No active laundry cycles.
                </td>
            </tr>
        `;

    renderStorageSummary("storageSummary");

    renderBinMiniGrid();

    renderActivity();
}


// ORDERS PAGE

function renderOrders() {

    const filter = $("#orderStatusFilter").value;

    const list = state.orders.filter(
        order => filter === "all" || order.status === filter
    );

    $("#allOrderRows").innerHTML = list.length
        ? list.map(allOrderRow).join("")
        : `
            <tr>
                <td colspan="7" class="empty-state">
                    No orders match this status.
                </td>
            </tr>
        `;

    $("#orderResultCount").textContent =
        `${list.length} order${list.length === 1 ? "" : "s"}`;
}


// REFRESH ALL DASHBOARD SECTIONS

function renderAll() {

    renderOverview();

    renderOrders();

    renderManagementBins();

    renderStorageSummary("storagePageSummary");

    renderCustomers();

    renderServices();

    renderReports();

    applySearch($("#globalSearch").value);
}


// SEARCH FUNCTION

function applySearch(query) {

    const normalized = query.trim().toLowerCase();

    const activeSection = $(`#view-${activeView}`);

    if (!activeSection) return;

    $$(".searchable-row", activeSection).forEach(row => {

        row.hidden =
            normalized &&
            !(row.dataset.searchText || "").includes(normalized);

    });
}


// ACTIVITY LOG

function addActivity(title, detail) {

    state.activity.unshift({

        title,
        detail,

        time: new Date().toLocaleTimeString(
            "en-PH",
            {
                hour: "numeric",
                minute: "2-digit"
            }
        )

    });
}


// UPDATE LAUNDRY ORDER STATUS

function updateOrderStatus(orderId, newStatus) {

    const order = state.orders.find(
        item => item.id === orderId
    );

    if (!order || !statusOptions.includes(newStatus)) return;

    const oldStatus = order.status;

    order.status = newStatus;

    if (order.bin) {

        const bin = state.bins.find(
            item => item.id === order.bin
        );

        if (bin) {

            if (newStatus === "Completed") {

                bin.status = "Empty";
                bin.orderId = null;
                order.bin = null;

            } else if (newStatus === "Ready for pick-up") {

                bin.status = "Ready for pick-up";

            } else {

                bin.status = "Occupied";

            }
        }
    }

    order.updated =
        `Status changed from ${oldStatus} to ${newStatus}`;

    addActivity(
        `${order.id} status updated`,
        `${oldStatus} → ${newStatus}`
    );

    renderAll();

    showToast(`${order.id} updated to ${newStatus}.`);
}


// STORAGE ASSIGNMENT OPTIONS

function populateAssignOptions(
    preselectedOrder = "",
    preselectedBin = ""
) {

    const eligibleOrders = state.orders.filter(
        order => !order.bin && order.status !== "Completed"
    );

    const emptyBins = state.bins.filter(
        bin => bin.status === "Empty"
    );

    $("#assignOrderSelect").innerHTML = eligibleOrders.length

        ? eligibleOrders.map(order => `
            <option value="${escapeHtml(order.id)}"
                ${order.id === preselectedOrder ? "selected" : ""}>

                ${escapeHtml(order.id)}
                — ${escapeHtml(order.customer)}

            </option>
        `).join("")

        : `<option value="">No unassigned laundry orders</option>`;


    $("#assignBinSelect").innerHTML = emptyBins.length

        ? emptyBins.map(bin => `
            <option value="${escapeHtml(bin.id)}"
                ${bin.id === preselectedBin ? "selected" : ""}>

                ${escapeHtml(bin.id)} — Empty

            </option>
        `).join("")

        : `<option value="">No empty storage bins</option>`;


    const submit = $("button[type='submit']", $("#assignForm"));

    submit.disabled =
        !eligibleOrders.length || !emptyBins.length;

    submit.style.opacity =
        submit.disabled ? ".5" : "1";
}


// OPEN STORAGE ASSIGNMENT MODAL

function openAssignModal(orderId = "", binId = "") {

    populateAssignOptions(orderId, binId);

    openModal("assignModal");
}


// CREATE NEW LAUNDRY CYCLE

function createOrder(formData) {

    const customer = String(
        formData.get("customer") || ""
    ).trim();

    const service = String(
        formData.get("service") || ""
    );

    const status = String(
        formData.get("status") || "Received"
    );

    if (!customer || !service || !statusOptions.includes(status)) {
        return;
    }

    const nextNumber =
        Math.max(
            1000,
            ...state.orders.map(
                order => Number(order.id.replace("LF-", "")) || 1000
            )
        ) + 1;

    const order = {

        id: `LF-${nextNumber}`,

        customer,

        service,

        date: new Date().toISOString().slice(0, 10),

        status,

        bin: null,

        updated: "New laundry cycle initialized"

    };

    state.orders.unshift(order);

    addActivity(
        "New laundry cycle initialized",
        `${order.id} · ${customer}`
    );

    renderAll();

    closeModal("cycleModal");

    $("#cycleForm").reset();

    goToView("orders");

    showToast(
        `${order.id} created. Sample data only; database not connected.`
    );
}


// ASSIGN STORAGE BIN

function assignStorage(formData) {

    const orderId = String(
        formData.get("orderId") || ""
    );

    const binId = String(
        formData.get("binId") || ""
    );

    const order = state.orders.find(
        item => item.id === orderId
    );

    const bin = state.bins.find(
        item => item.id === binId
    );

    if (
        !order ||
        !bin ||
        order.bin ||
        order.status === "Completed" ||
        bin.status !== "Empty"
    ) {

        showToast(
            "This order or storage bin is no longer available."
        );

        populateAssignOptions();

        return;
    }

    order.bin = bin.id;

    bin.orderId = order.id;

    bin.status = "Occupied";

    addActivity(
        "Storage bin assigned",
        `${bin.id} assigned to ${order.id}`
    );

    renderAll();

    closeModal("assignModal");

    showToast(
        `${bin.id} assigned to ${order.id}. Bin status: Occupied.`
    );
}


// VIEW STORAGE BIN DETAILS

function viewBinDetails(binId) {

    const bin = state.bins.find(
        item => item.id === binId
    );

    if (!bin) return;

    const order = state.orders.find(
        item => item.id === bin.orderId
    );

    if (!order) {

        showToast(`${bin.id} is ${bin.status.toLowerCase()}.`);

        return;
    }

    const action = window.confirm(
        `${bin.id}\n` +
        `Status: ${bin.status}\n` +
        `Order: ${order.id}\n` +
        `Customer: ${order.customer}\n\n` +
        `Release this bin? This should only be done after the laundry has been collected.`
    );

    if (action) {

        bin.status = "Empty";

        bin.orderId = null;

        order.bin = null;

        addActivity(
            "Storage bin released",
            `${bin.id} released from ${order.id}`
        );

        renderAll();

        showToast(`${bin.id} is now Empty.`);
    }
}


// EXPORT REPORT TO CSV

function exportCSV() {

    const headers = [
        "Order ID",
        "Customer",
        "Service",
        "Date Received",
        "Status",
        "Storage Bin"
    ];

    const rows = state.orders.map(order => [

        order.id,

        order.customer,

        order.service,

        order.date,

        order.status,

        order.bin || "Not assigned"

    ]);

    const csv = [headers, ...rows]

        .map(row => row.map(value =>
            `"${String(value).replace(/"/g, '""')}"`
        ).join(","))

        .join("\r\n");


    const blob = new Blob(
        ["\uFEFF", csv],
        { type: "text/csv;charset=utf-8;" }
    );

    const url = URL.createObjectURL(blob);

    const anchor = document.createElement("a");

    anchor.href = url;

    anchor.download =
        "laundraflow-sample-order-report.csv";

    document.body.appendChild(anchor);

    anchor.click();

    anchor.remove();

    URL.revokeObjectURL(url);

    showToast("Sample order report exported as CSV.");
}


// NAVIGATION EVENTS

$$(".nav-item[data-view]").forEach(button => {

    button.addEventListener("click", () => {

        goToView(button.dataset.view);

    });

});


$$("[data-go]").forEach(button => {

    button.addEventListener("click", () => {

        goToView(button.dataset.go);

    });

});


// MOBILE SIDEBAR EVENTS

$("#mobileMenuButton").addEventListener(
    "click",
    openSidebar
);

$("#sidebarBackdrop").addEventListener(
    "click",
    closeSidebar
);


// MAIN BUTTON EVENTS

$("#newCycleButton").addEventListener(
    "click",
    () => openModal("cycleModal")
);

$("#ordersNewCycleButton").addEventListener(
    "click",
    () => openModal("cycleModal")
);

$("#assignBinButton").addEventListener(
    "click",
    () => openAssignModal()
);


// CLOSE MODAL BUTTONS

$$("[data-close]").forEach(button => {

    button.addEventListener("click", () => {

        closeModal(button.dataset.close);

    });

});


// CLOSE MODAL WHEN CLICKING OUTSIDE

$$(".modal-backdrop").forEach(modal => {

    modal.addEventListener("click", event => {

        if (event.target === modal) {

            closeModal(modal.id);

        }

    });

});


// ESCAPE KEY CLOSES MODALS

document.addEventListener("keydown", event => {

    if (event.key === "Escape") {

        $$(".modal-backdrop.open").forEach(modal => {

            closeModal(modal.id);

        });

    }

});


// CREATE LAUNDRY CYCLE FORM

$("#cycleForm").addEventListener("submit", event => {

    event.preventDefault();

    createOrder(new FormData(event.currentTarget));

});


// ASSIGN STORAGE FORM

$("#assignForm").addEventListener("submit", event => {

    event.preventDefault();

    assignStorage(new FormData(event.currentTarget));

});


// ORDER STATUS UPDATES

document.addEventListener("change", event => {

    const select = event.target.closest(
        "[data-order-status]"
    );

    if (select) {

        updateOrderStatus(
            select.dataset.orderStatus,
            select.value
        );

    }

});


// TABLE AND SERVICE ACTIONS

document.addEventListener("click", event => {

    const assignOrder = event.target.closest(
        "[data-assign-order]"
    );

    const assignBin = event.target.closest(
        "[data-assign-bin]"
    );

    const binDetails = event.target.closest(
        "[data-bin-details]"
    );

    const viewOrder = event.target.closest(
        "[data-view-order]"
    );

    const toggleService = event.target.closest(
        "[data-toggle-service]"
    );


    if (assignOrder) {

        openAssignModal(
            assignOrder.dataset.assignOrder
        );

    }


    if (assignBin) {

        openAssignModal(
            "",
            assignBin.dataset.assignBin
        );

    }


    if (binDetails) {

        viewBinDetails(
            binDetails.dataset.binDetails
        );

    }


    if (viewOrder) {

        const order = state.orders.find(
            item => item.id === viewOrder.dataset.viewOrder
        );

        if (order) {

            window.alert(
                `${order.id}\n` +
                `Customer: ${order.customer}\n` +
                `Service: ${order.service}\n` +
                `Date received: ${fmtDate(order.date)}\n` +
                `Status: ${order.status}\n` +
                `Storage: ${order.bin || "Not assigned"}`
            );

        }

    }


    if (toggleService) {

        const service = state.services[
            Number(toggleService.dataset.toggleService)
        ];

        if (service) {

            service.active = !service.active;

            renderServices();

            showToast(
                `${service.name} is now ${
                    service.active ? "active" : "inactive"
                } in this demo.`
            );

        }

    }

});


// ORDER STATUS FILTER

$("#orderStatusFilter").addEventListener(
    "change",
    renderOrders
);


// GLOBAL SEARCH

$("#globalSearch").addEventListener(
    "input",
    event => applySearch(event.target.value)
);


// EXPORT REPORT BUTTON

$("#exportReportButton").addEventListener(
    "click",
    exportCSV
);


// INITIALIZE DASHBOARD

renderAll();

