function getShort() {
    let val = document.querySelector('#send-input').value;
    // errorDiv.innerText = ''
    let encodedVal = encodeURIComponent(val);
    let domain = window.location.origin;
    let apiUrl = domain + '/to?url=' + encodedVal;
    window.location.assign(apiUrl);
}

document.querySelector('#send-button').addEventListener('click', getShort);
document.querySelector('#send-input').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        getShort();
    }
});