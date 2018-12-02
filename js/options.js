// Saves options to chrome.storage
function save_options() {
  var userSetting = document.getElementById('useplugin').checked;
  console.log("Option Save");
  chrome.storage.sync.set({
    usePlugin : userSetting
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  // Use default value color = 'red' and likesColor = true.
  console.log("Option Restore");
  chrome.storage.sync.get({
    usePlugin: true
  }, function(items) {
    document.getElementById('useplugin').checked = items.usePlugin;
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);