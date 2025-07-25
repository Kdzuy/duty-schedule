document.addEventListener('DOMContentLoaded', () => {
    // === DOM ELEMENTS ===
    const managerSelect = document.getElementById('manager-select');
    const guestSelect = document.getElementById('guest-select');
    const createForm = document.getElementById('create-cluster-form');
    const clustersTableBody = document.getElementById('clusters-table-body');
    const errorMessage = document.getElementById('error-message');
    // Lấy thẻ thông báo thành công
    const successMessage = document.getElementById('success-message');


    // === API OBJECT ===
    const api = {
        fetchAllUsersClusters: async () => {
            const response = await fetch(`/cluster/get-all-user-guest-clusters`);
            if (!response.ok) throw new Error('Không thể tải dữ liệu người dùng và cụm.');
            return response.json();
        },
        createCluster: async (id_user, id_guest) => {
            const response = await fetch('/cluster/import-cluster', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id_user, id_guest }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Tạo cụm thất bại.');
            }
            // Trả về kết quả từ server (chứa clusterID)
            return response.json();
        },
        deleteCluster: async (id_cluster) => {
            const response = await fetch('/cluster/delete-cluster', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id_cluster }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Xóa cụm thất bại.');
            }
        }
    };

    // === FUNCTIONS ===

    function parseVietnameseDate(dmyString) {
        if (!dmyString) return null;
        if (dmyString instanceof Date) return dmyString; // Nếu đã là đối tượng Date thì trả về luôn

        const parts = dmyString.split(' ');
        let datePart = parts[0];
        let timePart = '00:00:00';
        
        if (parts.length > 1 && parts[1].includes('/')) {
             timePart = parts[0];
             datePart = parts[1];
        }

        const [day, month, year] = datePart.split('/');
        const [hours, minutes, seconds] = timePart.split(':');
        
        return new Date(`${year}-${month}-${day}T${hours}:${minutes}:${seconds}`);
    }

    function populateDropdowns(managers, guests, existingClusters) {
        const assignedGuestIds = new Set(existingClusters.map(c => c.guest.id));
        managerSelect.innerHTML = '<option value="">-- Chọn Quản lý --</option>';
        managers.forEach(user => {
            const option = document.createElement('option');
            option.value = user.id;
            option.textContent = `${user.last_name} (ID: ${user.id})`;
            managerSelect.appendChild(option);
        });

        guestSelect.innerHTML = '<option value="">-- Chọn Thành viên --</option>';
        guests.forEach(guest => {
            //if (!assignedGuestIds.has(guest.id)) {
                const option = document.createElement('option');
                option.value = guest.id;
                option.textContent = `${guest.last_name} (ID: ${guest.id})`;
                guestSelect.appendChild(option);
            //}
        });
    }
    function formatDate(dateInput, fallback = '-') {
        // 1. Nếu đầu vào không hợp lệ (null, undefined, rỗng), trả về chuỗi dự phòng.
        if (!dateInput) {
            return fallback;
        }

        // 2. Thử tạo đối tượng Date trực tiếp.
        // Cách này hoạt động tốt với cả chuỗi ISO ('2025-07-25T...') và đối tượng Date có sẵn.
        const date = new Date(dateInput);

        // 3. Kiểm tra xem ngày có hợp lệ không. isNaN(date.getTime()) là cách chuẩn nhất.
        if (isNaN(date.getTime())) {
            // Nếu không hợp lệ, có thể đó là định dạng cũ 'DD/MM/YYYY', thử đọc nó.
            if (typeof dateInput === 'string' && dateInput.includes('/')) {
                // Đây là logic cũ của bạn để xử lý định dạng DD/MM/YYYY
                const parts = dateInput.split(' ');
                let datePart = parts[0];
                let timePart = '00:00:00';
                if (parts.length > 1 && parts[1].includes('/')) {
                    timePart = parts[0];
                    datePart = parts[1];
                }
                const [day, month, year] = datePart.split('/');
                const finalDate = new Date(`${year}-${month}-${day}T${timePart}`);
                
                // Nếu sau khi thử cách cũ vẫn lỗi, trả về chuỗi dự phòng.
                if(isNaN(finalDate.getTime())) return fallback;
                
                // Nếu thành công, định dạng và trả về.
                return finalDate.toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
            }
            // Nếu không phải định dạng nào, trả về chuỗi dự phòng.
            return fallback;
        }

        // 4. Nếu ngày hợp lệ, định dạng sang giờ Việt Nam và trả về.
        return date.toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
    }
    // Tách logic tạo một hàng ra hàm riêng để tái sử dụng
    // Trong hàm createTableRow
    function createTableRow(cluster) {
        const row = document.createElement('tr');
        row.dataset.clusterId = cluster.clusterId;

        // THAY THẾ DÒNG NÀY
        // const assignedDate = parseVietnameseDate(cluster.assigned_at);
        // const formattedDate = assignedDate ? assignedDate.toLocaleString('vi-VN') : 'Vừa xong';

        // BẰNG DÒNG NÀY
        const formattedDate = formatDate(cluster.assigned_at, 'Vừa xong');

        row.innerHTML = `
            <td>${cluster.manager.username} (ID: ${cluster.manager.id})</td>
            <td>${cluster.guest.username} (ID: ${cluster.guest.id})</td>
            <td>${formattedDate}</td>
            <td>
                <button class="delete-btn btn btn-danger btn-sm" data-cluster-id="${cluster.clusterId}">
                    Xóa
                </button>
            </td>
        `;
        return row;
    }

    function renderClustersTable(clusters) {
        clustersTableBody.innerHTML = '';
        if (clusters.length === 0) {
            clustersTableBody.innerHTML = '<tr><td colspan="4" class="text-center">Chưa có cụm nào được tạo.</td></tr>';
            return;
        }

        clusters.forEach(cluster => {
            const row = createTableRow(cluster);
            clustersTableBody.appendChild(row);
        });
    }

    async function loadInitialData() {
        try {
            successMessage.textContent = '';
            errorMessage.textContent = '';
            const data = await api.fetchAllUsersClusters();
            const managers = data.listusers.filter(u => u.trackper !== 3);
            const guests = data.listusers.filter(u => u.trackper === 3);
            const userMap = new Map(data.listusers.map(u => [u.id, u]));

            const hydratedClusters = data.listclusters.map(cluster => {
                const managerInfo = userMap.get(parseInt(cluster.id_user, 10));
                const guestInfo = userMap.get(parseInt(cluster.id_guest, 10));
                
                return {
                    clusterId: cluster.id,
                    manager: { id: managerInfo?.id, username: managerInfo?.last_name || 'Không rõ' },
                    guest: { id: guestInfo?.id, username: guestInfo?.last_name || 'Không rõ' },
                    assigned_at: cluster.created_at
                };
            });

            // ⭐ THÊM CÁC DÒNG DEBUG DƯỚI ĐÂY ⭐
            console.log("Tổng số Guest tìm thấy:", guests.length, guests);
            const assignedGuestIds = new Set(hydratedClusters.map(c => c.guest.id));
            console.log("Các ID Guest đã được gán:", assignedGuestIds);
            // ⭐ KẾT THÚC PHẦN DEBUG ⭐

            populateDropdowns(managers, guests, hydratedClusters);
            renderClustersTable(hydratedClusters);
        } catch (error) {
            errorMessage.textContent = 'Lỗi khi tải dữ liệu từ server: ' + error.message;
            console.error(error);
        }
    }

    // === EVENT LISTENERS ===
    
    createForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        errorMessage.textContent = '';
        successMessage.textContent = '';

        const managerId = parseInt(managerSelect.value, 10);
        const guestId = parseInt(guestSelect.value, 10);

        if (!managerId || !guestId) {
            errorMessage.textContent = 'Vui lòng chọn cả user quản lý và guest.';
            return;
        }

        try {
            // SỬA LẠI HOÀN TOÀN LOGIC NÀY
            const result = await api.createCluster(managerId, guestId);
            
            // 1. Hiển thị thông báo thành công từ server
            successMessage.textContent = result.message;
            setTimeout(() => { successMessage.textContent = '' }, 4000); // Tự ẩn sau 4 giây

            // 2. Tạo đối tượng cluster mới để thêm vào bảng
            const managerOption = managerSelect.querySelector(`option[value="${managerId}"]`);
            const guestOption = guestSelect.querySelector(`option[value="${guestId}"]`);
            
            const newClusterData = {
                clusterId: result.clusterID,
                manager: {
                    id: managerId,
                    // Lấy tên từ text của option đã chọn
                    username: managerOption.textContent.replace(` (ID: ${managerId})`, '')
                },
                guest: {
                    id: guestId,
                    username: guestOption.textContent.replace(` (ID: ${guestId})`, '')
                },
                // Vì vừa tạo xong, dùng ngày giờ hiện tại
                assigned_at: new Date()
            };

            // 3. Thêm hàng mới vào bảng
            const newRow = createTableRow(newClusterData);
            // Xóa thông báo "chưa có cụm nào" nếu có
            const emptyRow = clustersTableBody.querySelector('td[colspan="4"]');
            if (emptyRow) {
                clustersTableBody.innerHTML = '';
            }
            clustersTableBody.appendChild(newRow);

            // 4. Xóa guest vừa được gán khỏi dropdown
            // guestOption.remove();
            
            // 5. Reset form
            createForm.reset();

        } catch (error) {
            errorMessage.textContent = 'Tạo liên kết thất bại: ' + error.message;
            console.error(error);
        }
    });

    clustersTableBody.addEventListener('click', async (e) => {
        if (e.target.classList.contains('delete-btn')) {
            const button = e.target;
            const clusterId = parseInt(button.dataset.clusterId, 10);

            if (confirm(`Bạn có chắc chắn muốn xóa cụm có ID ${clusterId}?`)) {
                try {
                    // 1. Gọi API để xóa trên server
                    await api.deleteCluster(clusterId);
                    
                    // 2. Hiển thị thông báo thành công
                    successMessage.textContent = 'Đã xóa liên kết thành công.';
                    setTimeout(() => { successMessage.textContent = '' }, 4000);

                    // 3. Tải lại toàn bộ dữ liệu để cập nhật giao diện một cách nhất quán
                    await loadInitialData();

                } catch (error) {
                    alert('Xóa liên kết thất bại! ' + error.message);
                    console.error(error);
                }
            }
        }
    });

    // === INITIAL LOAD ===
    loadInitialData();
});