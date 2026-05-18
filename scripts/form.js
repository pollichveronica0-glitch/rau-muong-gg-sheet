/* ===========================
   SHOP HẠT GIỐNG RAU XANH
   scripts/form.js – Form validation & submission
=========================== */

(function () {
    'use strict';

    var API_URL = 'https://script.google.com/macros/s/AKfycbxi01jlUBokjLByzHkmt1jr_aV-dZZ9rBQJmo0YgBHl1_pzBVoKIK0fzp4VhZ39F6P-/exec';

    var orderForm = document.getElementById('orderForm');
    var successModal = document.getElementById('successModal');
    var btnModalClose = document.getElementById('btnModalClose');
    var modalOverlay = document.getElementById('modalOverlay');
    var submitBtn = orderForm ? orderForm.querySelector('.btn-order') : null;

    /* --- Modal --- */
    function showModal(data) {
        if (!successModal) return;
        var nameEl = document.getElementById('modalName');
        var phoneEl = document.getElementById('modalPhone');
        var qtyEl = document.getElementById('modalQty');
        var priceEl = document.getElementById('modalPrice');
        if (nameEl) nameEl.textContent = data.name;
        if (phoneEl) phoneEl.textContent = data.phone;
        if (qtyEl) qtyEl.textContent = data.qty + ' gói';
        if (priceEl) priceEl.textContent = data.price + ' (COD)';
        successModal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    function hideModal() {
        if (!successModal) return;
        successModal.classList.remove('show');
        document.body.style.overflow = '';
    }

    /* --- Button state --- */
    function setButtonLoading(isLoading) {
        if (!submitBtn) return;
        submitBtn.classList.toggle('loading', isLoading);
        submitBtn.disabled = isLoading;
    }

    /* --- Field validation --- */
    function showFieldError(field, msg) {
        field.style.borderColor = '#e53935';
        field.style.boxShadow = '0 0 0 4px rgba(229,57,53,0.12)';
        field.focus();

        var existing = field.parentNode.querySelector('.field-error');
        if (existing) existing.remove();

        var err = document.createElement('p');
        err.className = 'field-error';
        err.textContent = msg;
        err.style.cssText = 'color:#e53935;font-size:0.8rem;margin-top:4px;font-weight:600;';
        field.parentNode.appendChild(err);

        field.addEventListener('input', function clearErr() {
            field.style.borderColor = '';
            field.style.boxShadow = '';
            if (err.parentNode) err.remove();
            field.removeEventListener('input', clearErr);
        });
    }

    function validateForm(form) {
        var name = form.querySelector('#fullname').value.trim();
        var phone = form.querySelector('#phone').value.trim();
        var address = form.querySelector('#address').value.trim();
        var phoneRe = /^(0[0-9]{9,10})$/;

        if (!name) {
            showFieldError(form.querySelector('#fullname'), 'Vui lòng nhập họ tên.');
            return false;
        }
        if (!phone || !phoneRe.test(phone)) {
            showFieldError(form.querySelector('#phone'), 'Số điện thoại không hợp lệ (VD: 0912345678).');
            return false;
        }
        if (!address) {
            showFieldError(form.querySelector('#address'), 'Vui lòng nhập địa chỉ nhận hàng.');
            return false;
        }
        return true;
    }

    /* --- Get client IP --- */
    function getClientIP() {
        return fetch('https://api.ipify.org?format=json')
            .then(function (res) {
                return res.json();
            })
            .then(function (d) {
                return d.ip;
            })
            .catch(function () {
                return '';
            });
    }

    /* --- Build date/time strings --- */
    function getNow() {
        var now = new Date();
        var pad = function (n) {
            return String(n).padStart(2, '0');
        };
        return {
            date: pad(now.getDate()) + '/' + pad(now.getMonth() + 1) + '/' + now.getFullYear(),
            time: pad(now.getHours()) + ':' + pad(now.getMinutes()) + ':' + pad(now.getSeconds())
        };
    }

    /* --- Submit --- */
    if (orderForm) {
        orderForm.addEventListener('submit', function (e) {
            e.preventDefault();

            orderForm.querySelectorAll('.field-error').forEach(function (el) {
                el.remove();
            });
            if (!validateForm(orderForm)) return;

            var activeCombo = document.querySelector('.combo-item.active');
            var orderData = {
                name: orderForm.querySelector('#fullname').value.trim(),
                phone: orderForm.querySelector('#phone').value.trim(),
                address: orderForm.querySelector('#address').value.trim(),
                note: orderForm.querySelector('#note').value.trim(),
                qty: activeCombo ? activeCombo.dataset.combo : '10',
                price: activeCombo ? activeCombo.dataset.price : '270.000đ'
            };

            setButtonLoading(true);

            getClientIP().then(function (ip) {
                var dt = getNow();

                var payload = {
                    'Ngày': dt.date,
                    'Giờ': dt.time,
                    'Họ và tên': orderData.name,
                    'Số điện thoại': orderData.phone,
                    'Địa chỉ': orderData.address,
                    'Số lượng': orderData.qty,
                    'Giá': orderData.price,
                    'IP': ip,
                    'Ghi Chú': orderData.note
                };

                return fetch(API_URL, {
                    method: 'POST',
                    mode: 'no-cors', // ← quan trọng
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(payload),
                    redirect: 'follow'
                });
            })
                .then(function () {
                    setButtonLoading(false);
                    orderForm.reset();
                    showModal(orderData);
                })
                .catch(function () {
                    setButtonLoading(false);
                    orderForm.reset();
                    showModal(orderData);
                });
        });
    }

    /* --- Modal close --- */
    if (btnModalClose) btnModalClose.addEventListener('click', hideModal);
    if (modalOverlay) modalOverlay.addEventListener('click', hideModal);

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && successModal && successModal.classList.contains('show')) hideModal();
    });

})();
