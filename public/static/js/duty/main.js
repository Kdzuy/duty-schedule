// === DỮ LIỆU BAN ĐẦU ===
let teams = [
    // { id: 1, name: "Tổ TH" }, { id: 2, name: "Tổ AN" }, { id: 3, name: "Tổ CSPCTP" },
    // { id: 4, name: "Tổ CSTT" }, { id: 5, name: "Tổ CSKV" },
    // { id: 6, name: "Trực Lãnh đạo" }, { id: 7, name: "Trực ban" }
];
const protectedTeams = [6, 7]; 
let positions = [
    // { id: 1, name: 'Trưởng Công an' }, { id: 2, name: 'Phó Trưởng Công an' },
    // { id: 3, name: 'Tổ trưởng' }, { id: 4, name: 'Tổ phó' },
    // { id: 5, name: 'Cán bộ' }, { id: 6, name: 'Trực ban' }
];
let locations = [
    // { id: 1, name: "Phòng trực ban" }, { id: 2, name: "Phòng chỉ huy" },
    // { id: 3, name: "Khu A" }, { id: 4, name: "Khu B" }, { id: 5, name: "Cổng chính" }
];
let members = [
    // { id: 1, name: 'Sơn', positionId: 1, teamId: 6, locationId: 2, phone: '0901234567' },
    // { id: 2, name: 'Thủy', positionId: 2, teamId: 6, locationId: 2, phone: '0907654321' },
    // { id: 3, name: 'Tòng', positionId: 5, teamId: 7, locationId: 1, phone: '0911111111' },
    // { id: 4, name: 'Hùng', positionId: 6, teamId: 7, locationId: 1, phone: '0922222222' },
    // { id: 5, name: 'Tuyến', positionId: 3, teamId: 1, locationId: 3, phone: '0933333333' },
    // { id: 6, name: 'Hiếu', positionId: 5, teamId: 2, locationId: 3, phone: '0944444444' }
];
let masterSchedule = {};
let scheduleTemplates = {};
let selectedCell = null;

// === LẤY CÁC PHẦN TỬ DOM ===
const dom = {
    scheduleBody: document.getElementById('schedule-body'),
    startDateInput: document.getElementById('start-date'),
    endDateInput: document.getElementById('end-date'),
    scheduleSubtitle: document.getElementById('schedule-subtitle'),
    membersList: document.getElementById('members-list'),
    teamsList: document.getElementById('teams-list'),
    locationsList: document.getElementById('locations-list'),
    positionsList: document.getElementById('positions-list'),
    managementToggle: document.getElementById('management-toggle'),
    managementContent: document.getElementById('management-content'),
    modal: document.getElementById('add-person-modal'),
    modalTitle: document.getElementById('modal-title'),
    memberSelect: document.getElementById('member-select'),
    exportBtn: document.getElementById('export-btn'),
    personForm: document.getElementById('person-form'),
    addMemberBtn: document.getElementById('add-member-btn'),
    addTeamBtn: document.getElementById('add-team-btn'),
    addLocationBtn: document.getElementById('add-location-btn'),
    addPositionBtn: document.getElementById('add-position-btn'),
    closeModalBtn: document.getElementById('close-modal-btn'),
    cancelModalBtn: document.getElementById('cancel-modal-btn'),
    generateScheduleBtn: document.getElementById('generate-schedule-btn'),
    applyTemplateBtn: document.getElementById('apply-template-btn'),
    deletePlanBtn: document.getElementById('delete-plan-btn'),
    savePlanBtn: document.getElementById('save-plan-btn'),
    infoModal: document.getElementById('member-info-modal'),
    infoModalTitle: document.getElementById('info-modal-title'),
    infoModalBody: document.getElementById('info-modal-body'),
    closeInfoModalBtn: document.getElementById('close-info-modal-btn'),
    okInfoModalBtn: document.getElementById('ok-info-modal-btn'),
    saveToJsonBtn: document.getElementById('save-to-json-btn'),
    loadFromJsonBtn: document.getElementById('load-from-json-btn'),
    loadJsonInput: document.getElementById('load-json-input'),
    locationFilterSelect: document.getElementById('location-filter-select'),
};

// === CÁC HÀM TÌM KIẾM DỮ LIỆU ===
const findById = (array, id) => array.find(item => item.id == id);

// === CÁC HÀM RENDER ===
function renderList(list, dataArray, renderItemFunc) {
    if (!list) return;
    list.innerHTML = '';
    dataArray.forEach(item => list.appendChild(renderItemFunc(item)));
};

function renderMemberItem(member) {
    const position = findById(positions, member.positionId)?.name || 'N/A';
    const team = findById(teams, member.teamId)?.name || 'N/A';
    const location = findById(locations, member.locationId)?.name || 'N/A';

    const li = document.createElement('li');
    li.innerHTML = `<div class="item-info"><span class="item-name">${member.name}</span><div class="item-details"><span class="item-detail-tag position-tag">${position}</span><span class="item-detail-tag team-tag">${team}</span><span class="item-detail-tag location-tag">${location}</span></div></div><button class="delete-item-btn" data-id="${member.id}" title="Xóa thành viên">&times;</button>`;
    li.querySelector('.delete-item-btn').onclick = () => handleDeleteMember(member.id);
    return li;
};

function renderGenericItem(item, type) {
    const li = document.createElement('li');
    const isProtected = type === 'tổ' && protectedTeams.includes(item.id);
    li.innerHTML = `<span class="item-name">${item.name}</span> ${!isProtected ? `<button class="delete-item-btn" data-id="${item.id}" title="Xóa ${type}">&times;</button>` : ''}`;
    if (!isProtected) {
        if (type === 'tổ') li.querySelector('.delete-item-btn').onclick = () => handleDeleteTeam(item.id);
        if (type === 'vị trí') li.querySelector('.delete-item-btn').onclick = () => handleDeleteLocation(item.id);
        if (type === 'chức vụ') li.querySelector('.delete-item-btn').onclick = () => handleDeletePosition(item.id);
    }
    return li;
};

function updateDropdown(selectElement, optionsArray, placeholder) {
    if (!selectElement) return;
    selectElement.innerHTML = '';
    if (placeholder) {
        const ph = new Option(placeholder, "");
        ph.disabled = true;
        ph.selected = true;
        selectElement.add(ph);
    }
    optionsArray.forEach(opt => {
        selectElement.add(new Option(opt.name, opt.id));
    });
};

function renderTeamHeaders() {
    const teamHeaderRow = document.getElementById('team-header-row');
    if (!teamHeaderRow) return;
    teamHeaderRow.innerHTML = '';
    const combatTeams = teams.filter(t => !protectedTeams.includes(t.id));
    combatTeams.forEach(team => teamHeaderRow.appendChild(Object.assign(document.createElement('th'), { textContent: team.name })));
    document.getElementById('main-header-cell').colSpan = combatTeams.length;
};

function fullRender() {
    renderList(dom.membersList, members, renderMemberItem);
    renderList(dom.teamsList, teams, (item) => renderGenericItem(item, "tổ"));
    renderList(dom.locationsList, locations, (item) => renderGenericItem(item, "vị trí"));
    renderList(dom.positionsList, positions, (item) => renderGenericItem(item, "chức vụ"));
    
    updateDropdown(document.getElementById('new-member-team'), teams, "Chọn tổ");
    updateDropdown(document.getElementById('new-member-location'), locations, "Chọn vị trí");
    updateDropdown(document.getElementById('new-member-position'), positions, "Chọn chức vụ");
    
    const templateOptions = Object.entries(scheduleTemplates).map(([key, value]) => ({ id: key, name: value.name }));
    updateDropdown(document.getElementById('template-select'), templateOptions, "-- Chọn phương án --");
        // THÊM MỚI: Cập nhật dropdown cho bộ lọc vị trí
    const locationFilterOptions = [{ id: 'all', name: 'Tất cả' }, ...locations];
    updateDropdown(dom.locationFilterSelect, locationFilterOptions);

    renderTeamHeaders();
};

// === CÁC HÀM XỬ LÝ DỮ LIỆU ===
const toYYYYMMDD = (d) => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');

// HÀM MỚI: Lọc các thẻ tên trên lịch theo vị trí trực
function filterScheduleByLocation(selectedLocationId) {
    const allTags = document.querySelectorAll('.personnel-tag');
    allTags.forEach(tag => {
        const cell = tag.closest('.duty-cell');
        if (!cell) return;

        const teamId = parseInt(cell.dataset.teamId);

        // NẾU THẺ NẰM TRONG CỘT ĐƯỢC BẢO VỆ, LUÔN HIỂN THỊ
        if (protectedTeams.includes(teamId)) {
            tag.classList.remove('tag-hidden');
            return; // Chuyển sang thẻ tiếp theo
        }

        // Nếu chọn "Tất cả vị trí", hiện tất cả các thẻ (không thuộc cột bảo vệ)
        if (selectedLocationId === 'all') {
            tag.classList.remove('tag-hidden');
            return;
        }

        // Lọc các thẻ còn lại như bình thường
        const memberId = tag.dataset.memberId;
        const member = findById(members, memberId);

        if (member && member.locationId == selectedLocationId) {
            tag.classList.remove('tag-hidden');
        } else {
            tag.classList.add('tag-hidden');
        }
    });
}

function updateDateRange() {
    const selectedDate = new Date(dom.startDateInput.value.replace(/-/g, '/'));
    if (isNaN(selectedDate)) return;
    const dayOfWeek = selectedDate.getDay();
    const daysToSubtract = (dayOfWeek === 0) ? 6 : (dayOfWeek - 1);
    const monday = new Date(selectedDate);
    monday.setDate(monday.getDate() - daysToSubtract);
    const sunday = new Date(monday);
    sunday.setDate(sunday.getDate() + 6);
    dom.startDateInput.value = toYYYYMMDD(monday);
};

function handleDateChange() {
    updateDateRange();
    generateSchedule();
}

// THAY ĐỔI: Thêm data-team-name vào mỗi ô
function generateSchedule() {
    const startDate = new Date(dom.startDateInput.value.replace(/-/g, '/'));
    if (isNaN(startDate)) return;

    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);

    dom.scheduleBody.innerHTML = '';
    const dateOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
    dom.scheduleSubtitle.textContent = `(Từ ngày ${startDate.toLocaleDateString('vi-VN', dateOptions)} đến ngày ${endDate.toLocaleDateString('vi-VN', dateOptions)})`;
    
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        const tr = document.createElement('tr');
        const isoDate = toYYYYMMDD(d);
        
        tr.dataset.dayIndex = d.getDay(); 
        tr.innerHTML = `<td class="date-cell" data-day="${isoDate}"><strong>${d.toLocaleDateString('vi-VN', { weekday: 'long' })}</strong><p>(${d.toLocaleDateString('vi-VN', dateOptions)})</p></td>`;
        
        const allTeamsInOrder = [...teams.filter(t => !protectedTeams.includes(t.id)), ...teams.filter(t => protectedTeams.includes(t.id))];
        allTeamsInOrder.forEach(team => {
             const dutyCell = document.createElement('td');
             dutyCell.className = 'duty-cell';
             dutyCell.dataset.teamId = team.id;
             dutyCell.dataset.teamName = team.name; // Thêm tên tổ vào data attribute
             tr.appendChild(dutyCell);
        });
        dom.scheduleBody.appendChild(tr);

        if (masterSchedule[isoDate]) {
            Object.entries(masterSchedule[isoDate]).forEach(([teamId, assignments]) => {
                const cell = tr.querySelector(`.duty-cell[data-team-id="${teamId}"]`);
                if (cell) {
                    cell.innerHTML = '';
                    assignments.forEach(assignment => {
                        const tag = createPersonnelTag(assignment.memberId);
                        if(tag) cell.appendChild(tag);
                    });
                }
            });
        }
    }
    updateLeaderHighlighting();
};

function addMember(memberData) {
    members.push({
        id: Date.now(),
        name: memberData.name,
        phone: memberData.phone,
        positionId: parseInt(memberData.positionId),
        teamId: parseInt(memberData.teamId),
        locationId: parseInt(memberData.locationId)
    });
    fullRender();
};

function deleteMember(id) {
    members = members.filter(m => m.id !== id);
    fullRender();
};

function addTeam(teamName) {
    if (teamName && !teams.some(t => t.name === teamName)) {
        teams.push({id: Date.now(), name: teamName});
        fullRender();
        generateSchedule();
    }
}

function deleteTeam(id) {
    teams = teams.filter(t => t.id !== id);
    fullRender();
    generateSchedule();
};

function addLocation(locationName) {
    if (locationName && !locations.some(l => l.name === locationName)) {
        locations.push({id: Date.now(), name: locationName});
        fullRender();
    }
}

function deleteLocation(id) {
    locations = locations.filter(l => l.id !== id);
    fullRender();
};

function addPosition(positionName) {
    if (positionName && !positions.some(p => p.name === positionName)) {
        positions.push({id: Date.now(), name: positionName});
        fullRender();
    }
}

function deletePosition(id) {
    positions = positions.filter(p => p.id !== id);
    fullRender();
};

function showModal(cell) {
    selectedCell = cell;
    const teamId = cell.dataset.teamId;
    const teamName = findById(teams, teamId)?.name || '';
    dom.modalTitle.textContent = `Phân công cho: ${teamName}`;
    const filteredMembers = members.filter(m => m.teamId == teamId);
    updateDropdown(dom.memberSelect, filteredMembers.map(m => ({id: m.id, name: m.name})), "Chọn thành viên");
    dom.modal.style.display = 'flex';
};

function hideModal() {
    dom.modal.style.display = 'none';
};

function showMemberInfoModal(memberId) {
    const member = findById(members, memberId);
    if (!member) return;
    dom.infoModalTitle.innerHTML = `<span class="info-label">Thông tin: </span><b>${member.name}</b>`;
    dom.infoModalBody.innerHTML = `
        <div class="info-item"><span class="info-label">Chức vụ:</span><span class="info-value">${findById(positions, member.positionId)?.name || 'N/A'}</span></div>
        <div class="info-item"><span class="info-label">Tổ:</span><span class="info-value">${findById(teams, member.teamId)?.name || 'N/A'}</span></div>
        <div class="info-item"><span class="info-label">Vị trí trực:</span><span class="info-value">${findById(locations, member.locationId)?.name || 'N/A'}</span></div>
        <div class="info-item"><span class="info-label">SĐT:</span><span class="info-value"><a href="tel:${member.phone}">${member.phone}</a></span></div>
    `;
    dom.infoModal.style.display = 'flex';
}

function hideInfoModal() {
    dom.infoModal.style.display = 'none';
}

function createPersonnelTag(memberId) {
    const memberData = findById(members, memberId);
    if (!memberData) return null;
    const tag = document.createElement('div');
    tag.className = 'personnel-tag';
    tag.dataset.memberId = memberId;
    const btn = document.getElementById('save-to-json-btn');
    const currentId = btn.getAttribute('data-id');

    if (currentId === '2') {
        tag.innerHTML = `<span class="tag-name">${memberData.name}</span><span class="remove-tag" title="Xóa">&times;</span>`;
    } else {
        tag.innerHTML = `<span class="tag-name">${memberData.name}</span>`;
    };
    return tag;
};

function updateLeaderHighlighting() {
    document.querySelectorAll('.duty-cell').forEach(cell => {
        cell.querySelectorAll('.personnel-tag').forEach(tag => tag.classList.remove('leader'));
        const tags = Array.from(cell.querySelectorAll('.personnel-tag'));
        if (tags.length === 0) return;

        let leaderTag = null;
        let highestRank = Infinity;
        
        const sortedPositionIds = positions.map(p => p.id);

        tags.forEach(tag => {
            const member = findById(members, tag.dataset.memberId);
            if (!member) return;
            const rankIndex = sortedPositionIds.indexOf(member.positionId);
            if (rankIndex !== -1 && rankIndex < highestRank) {
                highestRank = rankIndex;
                leaderTag = tag;
            }
        });

        if (leaderTag) {
            cell.prepend(leaderTag);
            leaderTag.classList.add('leader');
        }
    });
};

function savePlan(planName, planData) {
    const planId = `plan_${Date.now()}`;
    scheduleTemplates[planId] = { name: planName, assignments: planData };
    fullRender();
};

function applyPlan(planKey) {
    if (!scheduleTemplates[planKey]) return;
    const template = scheduleTemplates[planKey];
    
    Object.entries(template.assignments).forEach(([dayIndex, teams]) => {
        const row = dom.scheduleBody.querySelector(`tr[data-day-index="${dayIndex}"]`);
        if (!row) return;

        Object.entries(teams).forEach(([teamId, assignments]) => {
            const cell = row.querySelector(`.duty-cell[data-team-id="${teamId}"]`);
            if (cell) {
                cell.innerHTML = '';
                assignments.forEach(assignment => {
                    const tag = createPersonnelTag(assignment.memberId);
                    if(tag) cell.appendChild(tag);
                });
            }
        });
        autoSaveDayState(row);
    });
    updateLeaderHighlighting();
};

function deletePlan(planKey) {
    if(scheduleTemplates[planKey]) {
        delete scheduleTemplates[planKey];
        fullRender();
    }
};

function getCurrentScheduleData() {
    const scheduleData = {};
    document.querySelectorAll('#schedule-body tr').forEach(row => {
        const dayIndex = row.dataset.dayIndex;
        if (dayIndex !== undefined) {
            scheduleData[dayIndex] = {};
            row.querySelectorAll('.duty-cell').forEach(cell => {
                const teamId = cell.dataset.teamId;
                const assignments = Array.from(cell.querySelectorAll('.personnel-tag')).map(tag => {
                    const member = findById(members, tag.dataset.memberId);
                    const position = findById(positions, member?.positionId);
                    return {
                        memberId: member.id,
                        position: position.name
                    };
                });
                if (assignments.length > 0) {
                    scheduleData[dayIndex][teamId] = assignments;
                }
            });
        }
    });
    return scheduleData;
};

function autoSaveDayState(rowElement) {
    if (!rowElement) return;
    const date = rowElement.querySelector('.date-cell')?.dataset.day;
    if (!date) return;

    const dayData = {};
    rowElement.querySelectorAll('.duty-cell').forEach(cell => {
        const teamId = cell.dataset.teamId;
        const assignments = Array.from(cell.querySelectorAll('.personnel-tag')).map(tag => {
            const member = findById(members, tag.dataset.memberId);
            return {
                memberId: member.id
            };
        });
        if (assignments.length > 0) {
            dayData[teamId] = assignments;
        }
    });

    if (Object.keys(dayData).length > 0) {
        masterSchedule[date] = dayData;
    } else {
        delete masterSchedule[date];
    }
    // Tạm thời không cập nhật dropdown tuần đã lưu ở đây để tránh làm chậm
    console.log(`Đã tự động lưu trạng thái ngày ${date}.`);
}


// === KHỞI TẠO BAN ĐẦU ===
function initialize() {
    const today = new Date();
    dom.startDateInput.value = toYYYYMMDD(today);
    handleDateChange();
    fullRender();
}

initialize();