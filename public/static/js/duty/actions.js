document.addEventListener('DOMContentLoaded', () => {
    // === SỰ KIỆN MỚI CHO BỘ LỌC ===
    dom.locationFilterSelect.addEventListener('change', (event) => {
        const selectedLocationId = event.target.value;
        console.log(`ACTION: Lọc lịch theo vị trí ID: ${selectedLocationId}`);
        filterScheduleByLocation(selectedLocationId);
    });

    // Hiện nút khi cuộn xuống dưới 100px
    window.addEventListener('scroll', () => {
        const btn = document.getElementById('scrollTopBtn');
        if (window.scrollY > 100) {
            btn.style.display = 'block';
        } else {
            btn.style.display = 'none';
        }
    });

// Xử lý khi click nút
document.getElementById('scrollTopBtn').addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

    // === LOGIC MỚI: TẠM THỜI TẮT RESPONSIVE KHI IN ===
    const viewportMeta = document.querySelector('meta[name="viewport"]');
    const originalViewportContent = viewportMeta.getAttribute('content');

    // window.addEventListener('beforeprint', () => {
    //     console.log("ACTION: Chuẩn bị in, tạm thời tắt giao diện responsive.");
    //     // Buộc trình duyệt hiển thị ở dạng máy tính để bàn để bản in đúng dạng bảng
    //     // viewportMeta.setAttribute('content', 'width=1200');
    //     const printStyleLink = document.createElement('link');
    //     printStyleLink.rel = 'stylesheet';
    //     printStyleLink.href = '/static/css/duty/styleprint.css';
    //     document.head.appendChild(printStyleLink);
    // });

    // window.addEventListener('afterprint', () => {
    //     console.log("ACTION: In xong, khôi phục lại giao diện responsive.");
    //     // Trả lại cài đặt viewport ban đầu
    //     viewportMeta.setAttribute('content', originalViewportContent);
    // });
    // =======================================================
    // === LƯU VÀ TẢI FILE JSON ===
    fetch('/duty/duty-get-json')
    .then(res => res.json())
    .then(loadedData => {
        members = loadedData.members || [];
        teams = loadedData.teams || [];
        positions = loadedData.positions || [];
        locations = loadedData.locations || [];
        masterSchedule = loadedData.masterSchedule || {};
        scheduleTemplates = loadedData.scheduleTemplates || {};

        fullRender();
        handleDateChange();
        console.log("Đã tải dữ liệu từ server thành công.");
    })
    .catch(err => {
        console.error("Lỗi khi tải dữ liệu từ server:", err);
    });

    // 1. LƯU DỮ LIỆU RA FILE JSON
    dom.saveToJsonBtn.addEventListener('click', () => {
        
        console.log("ACTION: Chuẩn bị lưu dữ liệu đã lọc lên server.");

        // BƯỚC 1: TÍNH NGÀY GIỚI HẠN (5 TUẦN TRƯỚC TÍNH TỪ HÔM NAY)
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Reset giờ để so sánh chỉ dựa trên ngày
        // 1.1. Lùi lại đúng 5 tuần (35 ngày)
        const fiveWeeksAgoDate = new Date(today.getTime() - (35 * 24 * 60 * 60 * 1000));

        // 1.2. Từ ngày đó, tìm ra ngày Thứ Hai của tuần chứa nó
        const dayOfWeek = fiveWeeksAgoDate.getDay(); // 0=Chủ Nhật, 1=Thứ Hai, ...
        const daysToSubtract = (dayOfWeek === 0) ? 6 : (dayOfWeek - 1);
        const cutoffDate = new Date(fiveWeeksAgoDate.getTime() - (daysToSubtract * 24 * 60 * 60 * 1000));
        
        console.log(`Lọc dữ liệu: Chỉ giữ lại lịch từ Thứ Hai (${cutoffDate.toLocaleDateString('vi-VN')}) trở về sau.`);

        // BƯỚC 2: TẠO BỘ NHỚ LỊCH ĐÃ ĐƯỢC LỌC
        const filteredMasterSchedule = {};
        for (const isoDate in masterSchedule) {
            const scheduleDate = new Date(isoDate.replace(/-/g, '/'));
            scheduleDate.setHours(0, 0, 0, 0);

            // Nếu ngày trong lịch lớn hơn hoặc bằng ngày giới hạn thì giữ lại
            if (scheduleDate >= cutoffDate) {
                filteredMasterSchedule[isoDate] = masterSchedule[isoDate];
            }
        }
        
        // BƯỚC 3: GÓI DỮ LIỆU ĐÃ LỌC ĐỂ GỬI ĐI
        const appData = {
            members,
            teams,
            positions,
            locations,
            masterSchedule: filteredMasterSchedule, // Sử dụng đối tượng đã lọc
            scheduleTemplates
        };

        fetch('/duty/duty-import-json', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(appData)
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                alert("Đã lưu Thay đổi thành công.");
                // Cập nhật lại bộ nhớ trên trình duyệt bằng dữ liệu đã lọc
                masterSchedule = filteredMasterSchedule
            }
        })
        .catch(err => {
            console.error("Lỗi khi lưu dữ liệu.", err);
        });
    });

    // 2. KÍCH HOẠT CHỨC NĂNG CHỌN FILE KHI NHẤN NÚT "TẢI"
    // dom.loadFromJsonBtn.addEventListener('click', () => {
    //     console.log("ACTION: Nhấn nút 'Tải từ JSON', mở cửa sổ chọn file.");
    //     dom.loadJsonInput.click();
    // });

    // 3. XỬ LÝ KHI NGƯỜI DÙNG ĐÃ CHỌN XONG FILE JSON
    dom.loadJsonInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (!file) {
            console.log("ACTION: Không có file nào được chọn.");
            return;
        }

        console.log(`ACTION: Đang đọc file ${file.name}...`);
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const jsonContent = e.target.result;
                const loadedData = JSON.parse(jsonContent);

                members = loadedData.members || [];
                teams = loadedData.teams || [];
                positions = loadedData.positions || [];
                locations = loadedData.locations || [];
                masterSchedule = loadedData.masterSchedule || {};
                scheduleTemplates = loadedData.scheduleTemplates || {};

                console.log("ACTION: Đã tải và cập nhật dữ liệu thành công.", loadedData);
                
                fullRender();
                handleDateChange();
                
                alert('Đã tải dữ liệu từ file JSON thành công!');

            } catch (error) {
                console.error("Lỗi khi đọc hoặc phân tích file JSON:", error);
                alert("Lỗi: File JSON không hợp lệ hoặc đã bị hỏng.");
            }
        };

        reader.readAsText(file);
        event.target.value = '';
    });


    // === CÁC SỰ KIỆN KHÁC ===

    // THAY ĐỔI: Nút "Lấy dữ liệu" giờ sẽ tải file JSON
    dom.generateScheduleBtn.addEventListener('click', () => {
        console.log("ACTION: Tải xuống toàn bộ dữ liệu ứng dụng.");

        const appData = {
            members,
            teams,
            positions,
            locations,
            masterSchedule,
            scheduleTemplates
        };

        const jsonString = JSON.stringify(appData, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'data.json'; // Tên file tải về
        document.body.appendChild(a);
        a.click();
        
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });

    dom.startDateInput.addEventListener('change', () => {
        handleDateChange();
    });
    dom.exportBtn.addEventListener('click', () => {
        window.print();
    });
    dom.managementToggle.addEventListener('click', () => {
        dom.managementContent.classList.toggle('collapsed');
        dom.managementToggle.classList.toggle('collapsed');
    });

    dom.startDateInput.addEventListener('change', () => {
        console.log("ACTION: Người dùng thay đổi ngày bắt đầu, tự động tải lại lịch");
        handleDateChange();
    });

    dom.exportBtn.addEventListener('click', () => {
        console.log("ACTION: Người dùng nhấn nút 'In / Xuất file'");
        const printStyleLink = document.getElementById('print-style');
        const documentHeader = document.getElementById('document-header');
        documentHeader.style.display = ''; // Hiển thị header khi in
        if (printStyleLink) {
            // Tạm thời vô hiệu hoá stylesheet
            console.log(printStyleLink);
            printStyleLink.disabled = true;
        }
        setTimeout(() => {
            window.print();

            // Sau khi in xong, có thể tắt lại nếu muốn
            printStyleLink.disabled = false;
            documentHeader.style.display = 'none';
        }, 100);
    });

    dom.managementToggle.addEventListener('click', () => {
        console.log("ACTION: Người dùng mở/đóng khu vực quản lý");
        dom.managementContent.classList.toggle('collapsed');
        dom.managementToggle.classList.toggle('collapsed');
    });

    dom.addMemberBtn.addEventListener('click', () => {
        const newMemberNameInput = document.getElementById('new-member-name');
        const newMemberPhoneInput = document.getElementById('new-member-phone');
        const newMemberPositionSelect = document.getElementById('new-member-position');
        const newMemberTeamSelect = document.getElementById('new-member-team');
        const newMemberLocationSelect = document.getElementById('new-member-location');
        
        const memberData = {
            name: newMemberNameInput.value.trim(),
            phone: newMemberPhoneInput.value.trim() || 'Chưa có',
            positionId: newMemberPositionSelect.value,
            teamId: newMemberTeamSelect.value,
            locationId: newMemberLocationSelect.value
        };

        if (memberData.name && memberData.positionId && memberData.teamId && memberData.locationId) {
            console.log('ACTION: Thêm thành viên', memberData);
            addMember(memberData);
            newMemberNameInput.value = '';
            newMemberPhoneInput.value = '';
        } else {
            alert("Vui lòng điền đầy đủ thông tin cho thành viên.");
        }
    });
    
    dom.addTeamBtn.addEventListener('click', () => {
        const teamName = document.getElementById('new-team-name').value.trim();
        if(teamName) {
            console.log('ACTION: Thêm tổ', teamName);
            addTeam(teamName);
            document.getElementById('new-team-name').value = '';
        }
    });

    dom.addLocationBtn.addEventListener('click', () => {
        const locationName = document.getElementById('new-location-name').value.trim();
        if(locationName) {
            console.log('ACTION: Thêm vị trí', locationName);
            addLocation(locationName);
            document.getElementById('new-location-name').value = '';
        }
    });
    
    dom.addPositionBtn.addEventListener('click', () => {
        const positionName = document.getElementById('new-position-name').value.trim();
        if(positionName) {
            console.log('ACTION: Thêm chức vụ', positionName);
            addPosition(positionName);
            document.getElementById('new-position-name').value = '';
        }
    });

    window.handleDeleteMember = (id) => {
        console.log('ACTION: Xóa thành viên với ID:', id);
        deleteMember(id);
    };
    window.handleDeleteTeam = (id) => {
        console.log('ACTION: Xóa tổ với ID:', id);
        deleteTeam(id);
    };
    window.handleDeleteLocation = (id) => {
        console.log('ACTION: Xóa vị trí với ID:', id);
        deleteLocation(id);
    };
    window.handleDeletePosition = (id) => {
        console.log('ACTION: Xóa chức vụ với ID:', id);
        deletePosition(id);
    };

    dom.scheduleBody.addEventListener('click', (e) => {
        const removeBtn = e.target.closest('.remove-tag');
        const personnelTag = e.target.closest('.personnel-tag');
        const dutyCell = e.target.closest('.duty-cell');

        if (removeBtn) {
            const row = removeBtn.closest('tr');
            removeBtn.parentElement.remove();
            updateLeaderHighlighting();
            autoSaveDayState(row); 
        } else if (personnelTag) {
            const memberId = personnelTag.dataset.memberId;
            console.log('ACTION: Xem thông tin thành viên ID:', memberId);
            showMemberInfoModal(memberId);
        } else if (dutyCell) {
            console.log('ACTION: Mở modal để phân công cho tổ ID:', dutyCell.dataset.teamId);
            const btn = document.getElementById('save-to-json-btn');
            const currentId = btn.getAttribute('data-id');
            if (currentId === '2') {
                showModal(dutyCell);
            }
        }
    });

    dom.personForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const selectedMemberId = dom.memberSelect.value;
        if (selectedMemberId && selectedCell) {
            // THAY ĐỔI: Kiểm tra trực tiếp trong selectedCell, không cần wrapper
            if (!selectedCell.querySelector(`.personnel-tag[data-member-id="${selectedMemberId}"]`)) {
                console.log(`ACTION: Phân công thành viên ID ${selectedMemberId} vào tổ ID ${selectedCell.dataset.teamId}`);
                const tag = createPersonnelTag(selectedMemberId);
                if (tag) {
                    selectedCell.appendChild(tag); // Thêm trực tiếp vào ô
                    updateLeaderHighlighting();
                    autoSaveDayState(selectedCell.closest('tr'));
                }
            } else {
                alert("Thành viên này đã được phân công trong ô này.");
            }
        }
        hideModal();
    });

    dom.closeModalBtn.addEventListener('click', hideModal);
    dom.cancelModalBtn.addEventListener('click', hideModal);
    dom.modal.addEventListener('click', (e) => { if (e.target === dom.modal) hideModal(); });
    
    dom.closeInfoModalBtn.addEventListener('click', hideInfoModal);
    dom.okInfoModalBtn.addEventListener('click', hideInfoModal);
    dom.infoModal.addEventListener('click', (e) => { if (e.target === dom.infoModal) hideInfoModal(); });

    dom.savePlanBtn.addEventListener('click', () => {
        const planName = document.getElementById('new-plan-name').value.trim();
        if(!planName) {
            alert('Vui lòng nhập tên cho phương án!');
            return;
        }
        const planData = getCurrentScheduleData();
        console.log(`ACTION: Lưu phương án '${planName}' với dữ liệu theo ID`, planData);
        savePlan(planName, planData);
        alert(`Đã lưu phương án "${planName}" thành công!`);
        document.getElementById('new-plan-name').value = '';
    });
    
    dom.applyTemplateBtn.addEventListener('click', () => {
        const planKey = document.getElementById('template-select').value;
        if(!planKey) return;
        console.log('ACTION: Áp dụng phương án:', scheduleTemplates[planKey].name);
        applyPlan(planKey);
    });

    dom.deletePlanBtn.addEventListener('click', () => {
        const planKey = document.getElementById('template-select').value;
        if(!planKey) {
            alert("Vui lòng chọn một phương án để xóa.");
            return;
        }
        if (confirm(`Bạn có chắc chắn muốn xóa phương án "${scheduleTemplates[planKey].name}"?`)) {
            console.log('ACTION: Xóa phương án:', scheduleTemplates[planKey].name);
            deletePlan(planKey);
        }
    });
});