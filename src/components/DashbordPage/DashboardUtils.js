
export const formatMoney = (value) =>
    new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(value || 0);

export const formatDateOnly = (date) => {
    if (!date) return "-";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return "-";

    return new Intl.DateTimeFormat("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(parsedDate);
};

export const getOrderTotal = (order) => {
    return Number(order?.totalAmount) || 0;
};

export const getVisibleOrders = ({
    orders = [],
    search = "",
    status = "All",
    limit,
} = {}) => {
    const query = String(search).toLowerCase().trim();

    const filtered = orders
        .filter((order) => {
            const orderId = String(order?.orderId || "").toLowerCase();

            const customerName = String(
                order?.customer?.name || order?.customerName || ""
            ).toLowerCase();

            const phone = String(
                order?.customer?.phone || order?.phone || ""
            );

            const matchesSearch =
                orderId.includes(query) ||
                customerName.includes(query) ||
                phone.includes(query);

            const matchesStatus =
                status === "All" || order?.orderStatus === status;

            return matchesSearch && matchesStatus;
        })
        .sort(
            (a, b) =>
                new Date(b.createdAt || b.orderDate || 0).getTime() -
                new Date(a.createdAt || a.orderDate || 0).getTime()
        );

    return Number.isInteger(limit) && limit >= 0
        ? filtered.slice(0, limit)
        : filtered;
};
