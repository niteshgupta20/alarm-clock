var alarmApp = (function () {
  let alarms = [];
  const alarmList = document.getElementById('alarm-list');

  function clockface() {
    let now = document.getElementById('now');
    setInterval(function () {
      const date = new Date();
      let hh = date.getHours();
      let mm = date.getMinutes();
      let ss = date.getSeconds();
      let session = 'AM';

      if (hh == 0) {
        hh = 12;
      }

      if (hh == 12) {
        session = 'PM';
      }

      if (hh > 12) {
        hh = hh - 12;
        session = 'PM';
      }

      hh = changeToTwoDigit(hh);
      mm = changeToTwoDigit(mm);
      ss = changeToTwoDigit(ss);

      const time = hh + ':' + mm + ':' + ss + ' ' + session;
      now.innerText = time;

      if (alarms.length > 0) {
        ringAlarm(time);
      }
    }, 1000);
  }

  function setAlarm(alarm) {
    if (alarm) {
      if (duplicateAlarm(alarm)) {
        showNotifications('Duplicate Alarm');
        return;
      }
      alarms.push(alarm);
      renderAlarmList();
      showNotifications('Alarm added successfully');
      return;
    }
    showNotifications('something went wrong, cannot set alarm');
  }

  function deleteAlarm(id) {
    const newalarmsList = alarms.filter(function (alarm) {
      return alarm.id !== id;
    });
    alarms = newalarmsList;
    renderAlarmList();
  }

  function addAlarmToDOM(alarm) {
    const li = document.createElement('li');
    li.innerHTML = `
        <li class="list-item">
          <span class="f-20">${alarm.time}</span>
          <button class="delete" data-id="${alarm.id}">Delete</button>
        </li>
      `;
    alarmList.append(li);
  }

  function renderAlarmList() {
    alarmList.innerHTML = '';
    if (alarms.length == 0) {
      const para = document.createElement('p');
      para.innerText = 'No Upcoming Alarms';
      alarmList.append(para);
    }
    for (let i = 0; i < alarms.length; i++) {
      addAlarmToDOM(alarms[i]);
    }
  }

  function ringAlarm(time) {
    for (let i = 0; i < alarms.length; i++) {
      if (time == alarms[i].time) {
        const text = `Alarm for ${time}`;
        showNotifications(text);
      }
    }
  }

  function showNotifications(text) {
    alert(text);
  }

  function handleAlarmForm(e) {
    e.preventDefault();
    let hh = document.getElementById('hours').value;
    let mm = document.getElementById('minutes').value;
    let ss = document.getElementById('seconds').value;
    let session = document.getElementById('session').value;

    if (
      hh == '' ||
      mm == '' ||
      ss == '' ||
      hh <= 0 ||
      hh > 12 ||
      mm < 0 ||
      mm > 60 ||
      ss < 0 ||
      ss > 60
    ) {
      showNotifications('Please Pass Time in 12 hour Format');
      return;
    }

    hh = changeToTwoDigit(hh);
    mm = changeToTwoDigit(mm);
    ss = changeToTwoDigit(ss);

    const time = `${hh}:${mm}:${ss} ${session}`;
    const alarm = {
      id: Date.now().toString(),
      time: time,
    };
    setAlarm(alarm);
    clearAlarmInputForm();
  }

  function handleClickListner(e) {
    const target = e.target;
    if (target.className === 'delete') {
      const id = target.dataset.id;
      deleteAlarm(id);
      return;
    } else if (target.id === 'set') {
      handleAlarmForm(e);
      return;
    }
  }

  function changeToTwoDigit(num) {
    num = num.toString();
    num = Number(num).toString();
    num = num < 10 ? '0' + num : num;
    return num;
  }

  function clearAlarmInputForm() {
    let hh = document.getElementById('hours');
    let mm = document.getElementById('minutes');
    let ss = document.getElementById('seconds');

    hh.value = '';
    mm.value = '';
    ss.value = '';
  }

  function duplicateAlarm(alarm) {
    for (let i = 0; i < alarms.length; i++) {
      if (alarm.time == alarms[i].time) {
        return true;
      }
    }
  }

  function initializeApp() {
    clockface();
    renderAlarmList();
    document.addEventListener('click', handleClickListner);
  }
  return {
    initialize: initializeApp,
  };
})();
