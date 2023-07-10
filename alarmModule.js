var alarmApp = (function () {
  let alarms = [];
  const alarmList = document.getElementById('alarm-list');
  
  // showing the current time and also checking if the current is matching to any of the alarms
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
  
  // adding the alarm in the array.
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
  
  // delete a particular alarm
  function deleteAlarm(id) {
    const newalarmsList = alarms.filter(function (alarm) {
      return alarm.id !== id;
    });
    alarms = newalarmsList;
    renderAlarmList();
  }
  
  // add alarm to UI
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
  
  // render the array of alarms
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
  
  // ring the Alarm if the time matches
  function ringAlarm(time) {
    for (let i = 0; i < alarms.length; i++) {
      if (time == alarms[i].time) {
        const text = `Alarm for ${time}`;
        showNotifications(text);
      }
    }
  }
  
  // for showing notifications (JS Alert)
  function showNotifications(text) {
    alert(text);
  }
  
  // Handle the input boxes
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
  
  // Handing click listner for set alarm and delete alarm
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
  
  // if user pass one digit it converts into two digits
  function changeToTwoDigit(num) {
    num = num.toString();
    num = Number(num).toString();
    num = num < 10 ? '0' + num : num;
    return num;
  }
  
  // After Adding the alarm input box will empty
  function clearAlarmInputForm() {
    let hh = document.getElementById('hours');
    let mm = document.getElementById('minutes');
    let ss = document.getElementById('seconds');

    hh.value = '';
    mm.value = '';
    ss.value = '';
  }
  
  // not allow to add duplicate alarm
  function duplicateAlarm(alarm) {
    for (let i = 0; i < alarms.length; i++) {
      if (alarm.time == alarms[i].time) {
        return true;
      }
    }
  }
  
  // To initialize the app
  function initializeApp() {
    clockface();
    renderAlarmList();
    document.addEventListener('click', handleClickListner);
  }

  // once the javascript file loads, it will return initialize key with initializeApp value
  return {
    initialize: initializeApp,
  };
})();
