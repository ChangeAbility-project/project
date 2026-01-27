document.addEventListener('DOMContentLoaded', function() {
    const button = document.getElementById('myButton');
    
    button.addEventListener('click', function() {
        alert('Button wurde geklickt!');
        console.log('Button-Klick registriert');
    });
});
